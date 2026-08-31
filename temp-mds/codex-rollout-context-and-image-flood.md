# Codex 聊天上下文为什么把请求撑爆，以及正确的清图做法

用 Codex 桌面版做视觉相关的开发任务时，聊久了容易碰到请求体过大。常见提示是 413 `Payload Too Large`，或者模型后端提示请求里的图像总量超出限制。网上一些做法是删掉 base64 让文件变小，结果经常越修越糟。这篇讲两件事，一是 Codex 怎么存上下文，二是图像为什么会越积越多以及怎么处理。

## 上下文存在哪

Codex 桌面端的资料都在 `%USERPROFILE%\.codex` 下，主要是这几处。

| 位置 | 作用 |
|---|---|
| `thread_history_1.sqlite` | 线程投影表，是 UI 显示和请求组装的主要来源 |
| `state_5.sqlite` | 线程的 rollout 文件路径和当前模型等元信息 |
| `sessions\YYYY\MM\DD\rollout-*.jsonl` | 原始日志，内联图像的 base64 都在这里 |
| `logs_2.sqlite` | app 运行日志，排障时有用 |

`rollout-*.jsonl` 一行一条 JSON，第一条是 `session_meta`，里面有 `history_mode` 和 `history_base`。长线程会被拆成多个 rollout 文件，靠 `history_base` 串成链。

```text
root -> seg1 -> seg2 -> ... -> 当前文件
```

每个文件的 `session_meta.history_base.end_byte_offset` 指向上一个文件的末尾。若把某个文件改小，这个偏移就会指向文件末尾之外，app 会拒绝打开线程，典型报错是 `cutoff byte offset is past the source rollout`。

`thread_history_1.sqlite` 里三张表管投影。`thread_items` 是投影出的对话项，类型有 `userMessage`、`agentMessage`、`reasoning`、`commandExecution`、`imageView` 等。`thread_turns` 是每个回合的边界，带 `rollout_byte_offset` 和 `rollout_end_byte_offset`。`thread_history_projection_state` 记录下次从哪继续读，字段是 `next_rollout_byte_offset` 和 `next_rollout_ordinal`。

有一个坑容易踩。`view_image` 这类工具调用在投影层会变成 `imageView`，只带一个路径引用，原始的 `function_call` 和 `function_call_output` 并不单独存在。

## 请求为什么会爆炸

Codex 没有只发增量的说法。每发一条新消息，它会把从会话开始到现在的所有对话项重新组装进请求。图像是 rollout 里的 `input_image`，一张就有几 MB 的 base64。看几十张图，累积上百 MB 很正常。到某个上限，比如后端的 48M 或网关的 48 MiB，就会爆。

区别在于，`thread_items` 里存的图像只是引用路径，很小，真正的大 base64 在 rollout。只清 SQLite 的引用没用，必须处理 rollout。

## 常见的几种现象

最常见的是 413 或图像总量超出。请求体过大，通常是 rollout 里 base64 累积过多。可以先看 rollout 文件大小和 `data:image/...;base64,` 的数量。

另一种是界面停在旧时间，但模型还记得最新。UI 显示依赖 `thread_items`，它要求 ordinal 连续，比较严格。模型请求直接读 rollout，能容忍缺口。所以可能界面停在前几天，你继续聊时模型仍记得最新。界面旧不代表数据丢了。

还有一种容易被误判成图像问题，其实是顺序问题。报错是 `No tool output found for tool call call_01_...`。同一回合连发两个 `view_image` 时，app 会把一条 `<image_resize_notice>` 消息插到两个工具输出中间，把第二个调用和它的输出隔开。app 重建请求时把它当成新的段落边界，于是第二个调用找不到输出。两条其实都在 rollout 里，纯粹是顺序。修法是把消息等长挪到两个输出之后。

## 正确的清法和救援

### 日常预防

每看一批图就开新线程，历史最短。先缩图、转 JPEG/WebP 再贴，模型内部本来也会归一化到 800 px 左右。直接调 API 时用 Files API 的 `file_id`，不占内联请求体。

### 清图只做等长替换

不要删 base64 把文件改小。正确做法是把 payload 换成等长的 `A`，`data:image/png;base64,` 前缀保留，字节数不变，这样所有偏移和分页链都不受影响。也可以把 `thread_items` 里的 `imageView` 路径指向一个 1×1 占位图，只改引用不动 rollout。这能立刻减小请求体，但重启后可能被 rollout 重新投影覆盖。

### 已经坏了怎么救

如果已经用过删小的脚本，通常会碰到三类后遗症，分别对应不同修法。

工具输出缺失时，把中间那条消息等长挪到两个输出后面。判断方法是在事件里找双 `function_call` 加中间插入 message 的固定模式。

字节偏移失准时，按当前文件重算 `thread_turns` 和续点偏移。`projection_state` 记录的 `next_rollout_byte_offset` 可能落在 base64 中间而不是行首，这正是投影中断的原因。

ordinal 有缺口时，有些行真的丢了，备份里也没有。app 要求 ordinal 连续，跨不过缺口，只能补占位行让序号连续。这救不回原文，但能让投影继续走完。

通用恢复顺序是先修顺序、再修偏移、最后补缺口。每次改完都彻底退出 Codex 再重开，因为 app 内存里缓存的是旧投影状态，不重启它不会用新值。

## 几个判断和避坑

分清 UI 投影和请求路径，这是两套。界面旧不代表内容丢，判断数据是否还在要看 rollout 文件。改文件或数据库前先备份，SQLite 用 `backup` API 拿一致快照。只能等 app 完全关闭后再重置投影，也就是删那三张表里对应线程的行，否则会被内存状态覆盖。一个线程可能横跨多个 rollout 文件，`state_5.sqlite.threads.rollout_path` 只指向最新那个，看整条链要顺着 `history_base` 往回追。

---

核心只有一句。`thread_items` 里的图像是引用，rollout 里的 base64 才是大头。清引用治标，清 rollout 才治本，而清 rollout 只能等长替换，绝不能改小字节数。
