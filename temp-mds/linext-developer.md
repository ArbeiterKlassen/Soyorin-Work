# LiNeXt Developer Documentation

**Target Venue:** CVPR / AAAI  
**Author:** cuitianxu, Wuhan University  
**Last Updated:** 2026-05-30

---

## Table of Contents

1. [Project Motivation](#1-project-motivation)
2. [System Architecture](#2-system-architecture)
3. [Baseline and Benchmark](#3-baseline-and-benchmark)
4. [Version History](#4-version-history)
5. [Structural Priors: PlaneHead and K-PlaneHead](#5-structural-priors)
6. [Temporal Multi-Frame Fusion](#6-temporal-multi-frame-fusion)
7. [N2C Improvements: Breaking the Denoising Ceiling](#7-n2c-improvements)
8. [Key Experimental Findings](#8-key-experimental-findings)
9. [Code Organization](#9-code-organization)
10. [Training and Evaluation Guide](#10-training-and-evaluation-guide)
11. [Failure Log](#11-failure-log)

---

## 1. Project Motivation

LiDAR scene completion aims to reconstruct a dense 3D point cloud from a sparse single-frame LiDAR scan. The state-of-the-art method, LiNeXt (AAAI 2026), achieves this through a two-stage pipeline: a Noise-to-Coarse (N2C) module that denoises a repeated-and-noised input, followed by a lightweight Refine module that upsamples the coarse output. The N2C module is a single-step denoiser that processes DSR-augmented sparse scans through multi-scale sparse convolution and cross-point attention, achieving 199.8× speedup over diffusion-based methods.

However, the official LiNeXt model leaves several open questions. First, the Refine module is frozen to the N2C output, meaning all structural improvements on the Refine side are constrained by the quality of N2C features. Second, the model operates purely on geometric cues with no explicit modeling of scene structure. Third, the single-frame input inherently limits the reconstruction of distant regions where LiDAR returns are extremely sparse.

This project investigates three research directions toward addressing these limitations: (1) structural priors via explicit plane prediction heads that constrain the completion geometry, (2) temporal multi-frame fusion that aggregates observations across consecutive frames to densify the input, and (3) architectural improvements to the N2C denoiser itself to raise the coarse output quality.

## 2. System Architecture

The LiNeXt pipeline consists of four stages. In the first stage, the sparse input scan undergoes Distance-aware Selected Repeat (DSR), where points are grouped by distance into four quartiles and replicated with different multiplicities (5×, 8×, 12×, 15×), then perturbed with Gaussian noise (σ=1.0). This produces a spatially uniform noisy point cloud. In the second stage, the N2C module processes this noisy cloud through multi-scale sparse convolution (MSSC, 8 voxel scales from 0.01m to 1.28m) and a hierarchical partial feature extractor (Get\_Kprev) that downsamples the original sparse scan into seed points. These features are fused via Serial Point Deconvolution (SerialPD), which uses cross-point attention between the full and partial representations to predict per-point noise offsets. Subtracting these offsets yields the coarse point cloud. In the third stage, the Refine module takes the N2C coarse output and upsamples it by a factor of 6 (from 180k to 1.08M points), applying a lightweight learnable delta to each point. The fourth stage is an optional post-processing pipeline that applies distance-aware filtering and physics-based corrections.

Our extensions to this pipeline are threefold. We add a Quality Prediction Head that estimates per-point P2G distance to downweight outliers during post-processing. We add a K-Plane Prediction Head that predicts K dominant scene planes and their per-point soft assignments, enabling multi-plane structural correction during inference. And we implement a temporal multi-frame dataloader that fuses observations from adjacent frames using LiDAR poses, producing a denser input before DSR.

## 3. Baseline and Benchmark

All experiments use the SemanticKITTI dataset, training on sequences 00-07 and 09-10, validating on sequence 08. Evaluation metrics include Chamfer Distance (CD), decomposed into Prediction-to-Ground-Truth (P2G) and Ground-Truth-to-Prediction (G2P), plus an outlier ratio (fraction of points with P2G > 0.3m) and a composite quality score.

The official LiNeXt checkpoint achieves CD=0.1993 on our 401-frame evaluation (frames 0-4000, step=10). Our best reproduction, designated v5, achieves CD=0.2027 using the standard training recipe: N2C frozen, Refine trained for 5 epochs with chamfer-sqrt loss, smoothness regularization, and a BCE quality prediction head. The persistent gap of approximately 1.7% between our best model and the official checkpoint appears to be systematic rather than addressable through hyperparameter tuning of the Refine module alone.

A critical methodological note: our batch evaluation computes CD on the full 1.08M-point Refine output against 180k GT points using scipy's cKDTree with L2 distances. The paper reports CD=0.149 on SemanticKITTI, but the evaluation protocol (number of evaluation points, test split, normalization) has not been fully replicated. Our measurements are internally consistent across all experiments, enabling valid relative comparisons even if absolute values differ from the paper.

## 4. Version History

The project evolved through nine major versions, each testing a specific hypothesis about what limits completion quality.

**v1 through v4 (Exploration phase).** Early experiments incorporated physics-based loss functions (ground plane, Manhattan world, density constraints) directly into the training objective. These universally degraded CD, from 0.2250 (N2C-only) to 0.2476. The physics losses competed with the CD objective rather than complementing it. Attempts to add a Plane Prediction Head, quality-aware sampling, and focal loss weighting similarly failed to improve upon the simple baseline. The critical insight from this phase was that physics constraints belong in post-processing, not in the training loss, and that N2C must remain strictly frozen during Refine training.

**v5 (Current CD-optimal baseline).** Trained with standard chamfer-sqrt loss, smoothness regularization (weight 0.05), density penalty (weight 0.01), and a BCE quality prediction head. N2C frozen, hidden_dim=64, 5 epochs. This achieved CD=0.2027 on 401 frames and remains our best model by CD.

**v6 (Larger Refine capacity).** Increased Refine hidden_dim from 64 to 128, expanding trainable parameters from 110K to 303K. After 10 epochs, CD=0.2031—statistically identical to v5. The extra capacity enabled lower training CD (0.123 vs. 0.198 for v5) but did not translate to better generalization. This confirmed that the bottleneck is not Refine capacity but the quality of information arriving from the frozen N2C.

**v6/v6' (N2C unfreezing).** Two attempts to fine-tune N2C jointly with Refine, using learning rates of 1e-5 and 5e-6. Both failed catastrophically: P2G increased from 0.1926 to 0.2026, and the outlier ratio rose from 8.3% to 9.5%. The N2C feature distribution shifted during unfreezing, and the Refine module, trained on the original distribution, could not adapt. This established a hard rule: N2C must remain frozen unless Retine is retrained from scratch alongside it.

**v7 (Single-plane structural prior).** Added a Plane Prediction Head (2.3K parameters) that predicts a single global ground plane from N2C hidden features. The plane is supervised via RANSAC-fitted GT plane parameters and used during inference for adaptive ground correction. Result: CD unchanged from v5, with marginal improvements in ground plane error on specific frames.

**v8 (K-plane structural prior).** Extended the plane head to predict K=4 dominant planes with per-point soft assignment, Hungarian matching against sequential RANSAC GT planes, and clustering regularization (sharp assignment entropy + balanced plane usage). The multi-plane design addressed the failure mode of v7 on complex scenes (intersections, slopes) where a single global plane is insufficient. Inference uses per-plane correction: points within an adaptive distance threshold of any predicted plane are projected onto it. Result: CD unchanged from v5 on both good frames (960-1160: 0.1872 vs. 0.1873) and worst frames (1300-1320: 0.50-0.62 vs. 0.50-0.62). The K-plane head learns quickly (loss drops 6× in the first epoch), confirming that N2C features encode plane-relevant information, but this structural knowledge does not improve point-level accuracy under the frozen-N2C constraint.

**v9 (K-plane with higher weight and extended training).** Increased the K-plane loss weight from 0.05 to 0.07 and extended training to 10 epochs (though only 5 completed before an OOM interruption). Result: CD=0.1874, identical to v8. The structural prior cannot overcome the information bottleneck at N2C.

### Summary of Refine-Side Experiments

Every experiment that modified only the Refine side—whether by adding parameters, structural heads, physics losses, or quality predictors—converged to the same CD value of approximately 0.187 in the 960-1160 range and 0.202 on full 401-frame evaluation. This convergence is not a failure of individual ideas but a demonstration that the frozen N2C representation is the binding constraint. The 64-dimensional features produced by the official N2C checkpoint contain the information needed to achieve CD≈0.20; adding structure-aware modules on top of these features cannot extract information that is not present.

## 5. Structural Priors: PlaneHead and K-PlaneHead

The PlaneHead family of modules addresses a specific weakness of purely geometric completion: the absence of explicit scene structure. In man-made environments, dominant planar surfaces (roads, building facades) constitute a large fraction of the scene. A model that recognizes these surfaces can enforce structural consistency.

The single PlaneHead (v7) predicts a global plane (normal, offset) from N2C hidden features via a lightweight Conv1d-MLP with global average pooling. Supervision comes from RANSAC-fitted ground truth planes (z < -0.5 threshold, SVD on covariance). During inference, the predicted plane drives adaptive ground correction: points within a distance-adaptive threshold of the plane are projected onto it, with the threshold expanding from 5cm at close range to 15cm at 50m distance. The limitation of a single global plane is evident at intersections, curved roads, and multi-level structures where multiple dominant planes coexist.

The K-PlaneHead (v8, v9) generalizes this to K planes. Rather than global pooling, the architecture uses per-point soft assignment: each of the 180k coarse points receives a K-dimensional softmax weight indicating its affinity to each plane. Plane features are computed as weighted averages of point features, giving each plane a distinct "receptive field" in the scene. Three loss components guide training: Hungarian-matched L1 loss against sequential RANSAC GT planes, a diversity penalty that discourages plane collapse (cosine similarity between predicted plane normals), and clustering regularization that encourages sharp per-point assignments while maintaining balanced plane usage.

The sequential RANSAC GT extraction operates on the ground truth point cloud: fit the largest plane via RANSAC (threshold 0.15m, 150 iterations on a 20K-point subset), remove inliers, repeat. This produces up to K valid planes per scene; scenes with fewer planes are handled via a validity mask. The Hungarian matching between predicted and GT planes uses a cost function combining normal alignment (1 - |cos θ|) and offset difference, solved via scipy's linear sum assignment on a K×K matrix.

For inference, the multi-plane enforcement iterates over predicted planes, computing per-point distances and projecting points within the adaptive threshold. Ground-like planes (normal with nz > 0.3) only affect points below z=0; non-ground planes affect all points. This prevents walls from incorrectly pulling ground points upward.

Despite the architectural sophistication, empirical results show that K-PlaneHead does not improve CD. The failure is instructive: it demonstrates that the N2C features, while encoding some plane-relevant information (the K-plane loss converges rapidly), do not encode it with sufficient spatial precision for the plane predictions to meaningfully correct point positions. The features are 64-dimensional global aggregates that lose the fine-grained spatial structure needed for per-point plane assignment.

## 6. Temporal Multi-Frame Fusion

The fundamental limitation of single-frame LiDAR completion is sparsity at distance. A 64-beam LiDAR at 50 meters produces points spaced several meters apart; no amount of learned completion can reliably hallucinate structure in these gaps. However, consecutive frames in a driving sequence observe the same static scene from slightly different viewpoints. By transforming points from adjacent frames into the current frame's coordinate system, we can densify the input before completion.

The coordinate transform is P_i→t = T_t^{-1} × T_i × P_i, where T_i are 4×4 LiDAR-frame poses obtained from the KITTI calibration and GPS/IMU data. Our verification on sequence 08, frame 1300, confirmed that transformed neighbor frames achieve 96-99% overlap with the current frame at a 0.5m threshold, with a median point-to-point distance of 5-6cm (compared to 3.9cm self-sparsity of the current frame). The alignment is near-perfect for static structures.

The TemporalMultiFrameSet dataloader loads a window of ±2 frames around each target frame, applies the pose transform, concatenates all points, and uses farthest-point sampling to select a fixed number of input points with maximal spatial coverage. The same random augmentation (rotation, scale, flip) is applied to both the input and ground truth by concatenating them before transformation and splitting afterward.

A diagnostic test on 50 batches from the full training set confirmed data validity: no NaN or infinity values, coordinate ranges consistent with LiDAR data (p_part within [-83, 87] meters versus p_full within [-52, 52]—reflecting the expanded coverage from multi-frame fusion), and a baseline CD between the fused input and ground truth of approximately 0.95, which is the expected sparsity of the input before completion.

The temporal training has not yet been successfully run due to GPU memory constraints. The fused dataloader increases I/O overhead (loading 5× more files per sample) but does not change the model's memory footprint since the input point count is held constant. Early attempts at temporal training with DDP on dual GPUs encountered OOM errors traced to zombie GPU processes rather than fundamental memory limitations. The next step is a single-GPU validation run with batch_size=1 to confirm training stability before scaling to full dual-GPU training.

Dynamic objects (moving vehicles, pedestrians) create ghost points after temporal alignment—the same car appears at different positions in different frames. Our initial implementation ignores this issue, relying on the observation that static structures dominate LiDAR scenes and the N2C denoiser can treat inconsistent dynamic points as noise. A temporal consistency filter (requiring a point to appear in at least 2 of 5 frames) can be added if ghost artifacts prove problematic.

## 7. N2C Improvements: Breaking the Denoising Ceiling

The consistent failure of all Refine-side improvements points to a single conclusion: the N2C coarse output quality is the ceiling. The N2C module in the official LiNeXt is a single-step denoiser with hidden_dim=64, 128 seed points, and chamfer-sqrt training loss. The question is whether a stronger N2C can raise this ceiling.

Our N2C v2 implements four improvements simultaneously. First, hidden_dim is increased from 64 to 128, expanding the feature capacity throughout MSSC, SerialPD, and the cross-attention layers. Since Get_Kprev has hardcoded internal dimensions (64→128→256→512 cascade through the hierarchical downsampling), we add projection layers (proj_in: 128→64, proj_out: 64→128) to bridge the MSSC output to the serial attention modules without modifying their architecture. Second, denoising is extended from 1 step to 2 steps: the first step performs full denoising as in the original N2C, and the second step re-extracts MSSC features on the partially denoised cloud and predicts a residual correction. Third, the number of seed points from Get_Kprev is increased from 128 to 256, providing finer global context during cross-attention. Fourth, the training loss is changed from chamfer-sqrt (mean of L1 distances) to standard chamfer (mean of squared L2 distances), which penalizes outliers more heavily.

The parameter count increases modestly from 2.0M to 2.3M. The 2-step denoising approximately doubles the N2C forward pass time, but since N2C inference is already fast (0.167s), this remains practical.

Related work in LiDAR denoising provides additional directions. LiDPM (IV 2025) demonstrated that standard DDPM formulations work directly on LiDAR point clouds when starting from an intermediate timestep rather than pure noise, and found that Instance Normalization is critical for stability (BatchNorm caused artifacts at distant points). LiDiff (CVPR 2024) uses SparseConv U-Net architectures with 30-1000 denoising steps and requires a regularization loss. Our 2-step approach occupies a middle ground: more expressive than single-step but vastly faster than iterative diffusion. Future improvements could include InstanceNorm, noise-level conditioning for multi-timestep training, and U-Net style skip connections from MSSC to SerialPD layers.

N2C v2 training (from scratch, 10 epochs planned, 5 completed due to OOM, resumed from epoch 4) achieved a training loss of approximately 0.31 (standard CD). A direct N2C-only evaluation (without Refine) on frames 960-1160 will quantify whether the improved N2C produces better coarse point clouds than the official checkpoint.

## 8. Key Experimental Findings

The central empirical result of this project is the identification and confirmation of a CD ceiling at approximately 0.202 (401-frame) or 0.187 (960-1160 subset) under the frozen-N2C paradigm. This ceiling has been tested against seven distinct intervention strategies—increased Refine capacity, quality prediction heads, single-plane structural priors, multi-plane structural priors, physics-based loss functions, N2C unfreezing, and extended training duration—and none have breached it.

Several secondary findings merit attention. The N2C features, despite being 64-dimensional and trained purely on a denoising objective, encode substantial plane-relevant information; the K-plane loss converges 6-fold in the first training epoch. The temporal alignment between adjacent LiDAR frames is near-perfect (99% overlap within 1m), confirming the feasibility of multi-frame fusion. Data augmentation is correctly synchronized between input and GT (concatenation before transformation), eliminating a common source of silent training failures. The GPU environment on the 8×4090 server requires explicit zombie process cleanup before each training run, as stale CUDA contexts can cause spurious OOM errors even when sufficient memory is available.

The worst-performing frames (001300-001310, CD 0.50-0.62) are characterized by complex multi-plane geometry (intersections with multiple road surfaces and building facades) and extreme sparsity at distance. Neither K-plane structural constraints nor increased Refine capacity improve these frames; they require fundamentally better input data, which is the motivation for temporal fusion.

## 9. Code Organization

The codebase extends the official LiNeXt repository with additional modules and training scripts. The core model definitions reside in `models/linextnet.py` (N2C, Refine, SerialPD, MSSC, Get_Kprev, and all attention modules) and `models/models_refine.py` (training LightningModule, QualityHead, PlaneHead, KPlaneHead, and all loss functions including Hungarian matching and clustering regularization).

Dataset and dataloader code is in `datasets/dataloader/temporal_multiframe.py` (multi-frame temporal fusion) and `datasets/datasets_refine.py` (LightningDataModule registration for both standard and temporal modes).

Inference and evaluation tools include `tools/batch_eval_v6.py` (multi-GPU parallel batch evaluation with start_frame support), `tools/completion_pipeline.py` (inference pipeline with KPlaneHead auto-detection and multi-plane enforcement), and `tools/verify_temporal_transform.py` (coordinate transform validation).

Configuration files follow the pattern `config/config_refine_v{5-9}.yaml` for Refine training variants and `config/config_n2c_v2.yaml` for the N2C v2 training. Training launch scripts are `start_train_v{5-9}.sh` and `start_train_n2c_v2.sh`.

Critical backup locations: `backups/v9_20260528_2135/` (pre-temporal-fusion code), `backups/n2c_v2_20260529_1933/` (pre-N2C-v2 linextnet and models), `backups/20260527_1716/` (pre-KPlaneHead code).

## 10. Training and Evaluation Guide

**Environment setup.** All training and evaluation requires the LiNeXt conda environment (PyTorch 1.13.1, CUDA 11.7, MinkowskiEngine 0.5.4, pytorch-lightning 1.8.1). The PYTHONPATH must include the project root, and TMPDIR must point to a writable location (the default /tmp is read-only on the server).

```bash
source ~/.miniconda3/bin/activate LiNeXt
export PYTHONPATH=/data1/cuitianxu/LiNeXt_ws/LiNeXt-main/LiNeXt-main:$PYTHONPATH
export TMPDIR=/home/cuitianxu/tmp
export OMP_NUM_THREADS=8
cd /data1/cuitianxu/LiNeXt_ws/LiNeXt-main/LiNeXt-main/linext
```

**Refine training.** Set CUDA_VISIBLE_DEVICES to the desired GPUs (typically 0,1 for dual-GPU DDP), then run the training script. The config file controls all hyperparameters including which structural heads are active, loss weights, and training duration. After any modification to linextnet.py or models_refine.py, all __pycache__ directories must be deleted.

```bash
CUDA_VISIBLE_DEVICES=0,1 python train_refine.py -c config/config_refine_v9.yaml
```

**N2C training.** The N2C uses a separate training script (train.py) and the DenoisePoints LightningModule from models.py. The v2 config specifies hidden_dim=128, denoise_steps=2, and seed_num=256 through the model section.

```bash
CUDA_VISIBLE_DEVICES=2,3 python train.py -c config/config_n2c_v2.yaml
```

**Batch evaluation.** Use batch_eval_v6.py for multi-GPU parallelism or batch_eval_v3.py for single-GPU evaluation. The fast evaluation range (960-1160, step=1) covers 201 frames with good LiDAR coverage and provides a reliable quick benchmark. For N2C-only evaluation, omit the --refine argument.

```bash
CUDA_VISIBLE_DEVICES=5 python tools/batch_eval_v3.py \
  --n2c <N2C_CHECKPOINT> \
  --refine <REFINE_CHECKPOINT> \
  --output <OUTPUT_DIR> \
  --start_frame 960 --max_frame 1160 --step 1
```

## 11. Failure Log

This section catalogs experimental failures that consumed significant GPU time and established hard constraints for future work. Each entry represents a tested hypothesis that did not survive contact with data.

**N2C Unfreezing.** Attempting to fine-tune N2C jointly with Refine, even at extremely low learning rates (5e-6), destroys the coarse output quality. The P2G metric increases by 5-8% and the outlier ratio rises by 13-15%. This was tested in two configurations (v6 with lr=1e-5, v6' with lr=5e-6) with consistent failure. The mechanism appears to be a distribution shift in N2C features that the Refine module, trained on the original distribution, cannot accommodate. Joint training from scratch (not attempted) might avoid this issue.

**Alpha Noise Mismatch.** Using alpha_noise=3.0 during Refine training (matching the N2C training configuration) causes the initial CD to spike to 0.77, versus 0.28 with alpha_noise=1.0. Despite the N2C having been trained with alpha_noise=3.0, the Refine module learns better with lower input noise. The alpha_noise should remain at 1.0 for all Refine training.

**Physics Losses as Training Objectives.** Four physics-based loss functions were tested as direct training objectives: ground plane consistency (SVD on predicted points, weighted by z-coordinate), Manhattan world alignment (KNN PCA on sampled points, axial constraint), density control, and surface smoothness. When added to the CD loss with nonzero weights, all degraded CD. The ground and Manhattan losses in particular create a direct tension with CD: they pull points toward geometrically "correct" positions that are not necessarily the positions that minimize distance to GT. These constraints are effective only as post-processing steps, where they can refine an already-completed point cloud without competing gradients.

**Post-Processing Outlier Filtering.** Geometric filters operating on the completed point cloud (planarity-based filtering, KNN isolation detection with radius thresholds) were tested as a means to reduce outliers without modifying the training pipeline. These universally failed because they cannot distinguish between "false structures" (sparse scattered points from model error) and "true sparse structures" (legitimate distant points that happen to be isolated). Any filter aggressive enough to remove outliers also removes valid distant completions.

**GPU Zombie Processes.** The 8×4090 server accumulates stale CUDA contexts from crashed training runs. These manifest as 35+ GB of "already allocated" memory on otherwise idle GPUs, causing spurious OOM errors on subsequent runs. The fix is `fuser -k /dev/nvidia{N}` before each training launch. The __pycache__ directories must similarly be purged after any code change, as stale bytecode can cause dimension mismatch errors that are indistinguishable from genuine bugs.

**Temporal Training OOM.** Early temporal fusion training attempts encountered OOM errors at approximately 35 GB allocated per GPU. The root cause was traced to zombie GPU processes rather than the temporal dataloader itself. A clean GPU launch with batch_size=1 verified that the model fits comfortably (13.5 GB peak). The temporal dataloader was validated separately on 50 batches and confirmed to produce valid data with expected CD distributions.
