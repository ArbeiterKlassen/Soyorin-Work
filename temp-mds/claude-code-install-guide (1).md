# 国内环境安装 Claude Code 与 DeepSeek 后端配置

Claude Code 官方安装命令 `npm install -g @anthropic-ai/claude-code` 在国内直接执行会卡在 registry 连接或证书报错。本文记录一套不依赖代理、不修改系统证书、不使用 `sudo` 的安装方案，以及接入 DeepSeek API 作为后端的配置方法。

---

## 环境要求

- Node.js >= 18
- npm >= 10
- 网络可访问 `npmmirror.com`（国内环境）

---

## 一、Ubuntu 20.04 本地安装

### 1.1 检查 Node.js 版本

```bash
node -v
```

若输出 `v18.x` 或更高，跳至 1.3。若低于 18 或未安装，执行 1.2。

### 1.2 手动安装 Node 20（国内镜像二进制包）

Ubuntu 20 官方源 Node 版本过老，建议直接从 npmmirror 下载预编译包：

```bash
cd /tmp
wget https://npmmirror.com/mirrors/node/v20.13.1/node-v20.13.1-linux-x64.tar.xz
tar -xJf node-v20.13.1-linux-x64.tar.xz
sudo mv node-v20.13.1-linux-x64 /usr/local/node20

echo 'export PATH=/usr/local/node20/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

node -v   # v20.13.1
```

### 1.3 配置 npm 国内镜像

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
# 预期输出: https://registry.npmmirror.com
```

### 1.4 迁移 npm 全局目录至用户空间

避免后续使用 `sudo npm` 导致权限问题：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 1.5 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 1.6 验证

```bash
claude --version
```

若提示 `command not found`，关闭终端重新打开，或执行 `source ~/.bashrc`。

### 1.7 清理 APT 残留源（可选）

若之前按官方文档配置过 apt 源，需删除指向 `packages.claude-code.com` 的配置：

```bash
sudo rm -f /etc/apt/sources.list.d/claude-code.list
sudo rm -f /etc/apt/sources.list.d/packages_claude-code_com_apt.list
sudo apt update
```

---

## 二、远程 Linux 服务器安装

### 2.1 国内云服务器（阿里云 / 腾讯云 / 华为云）

SSH 登录后执行：

```bash
# Node 20
cd /tmp
wget https://npmmirror.com/mirrors/node/v20.13.1/node-v20.13.1-linux-x64.tar.xz
tar -xJf node-v20.13.1-linux-x64.tar.xz
mv node-v20.13.1-linux-x64 ~/.local/node20

echo 'export PATH="$HOME/.local/node20/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# npm 配置
npm config set registry https://registry.npmmirror.com
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 安装
npm install -g @anthropic-ai/claude-code

# 验证
claude --version
```

全程无需 `sudo`，适合无 root 权限的共享开发机或容器环境。

### 2.2 海外 VPS（AWS / GCP / Azure）

海外机器无需国内镜像，官方源速度更快：

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 用户级全局目录
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 安装
npm install -g @anthropic-ai/claude-code
claude --version
```

---

## 三、Windows 本地安装

Windows 下 npm 全局目录默认位于用户空间（`C:\Users\<用户名>\AppData\Roaming\npm`），无需手动迁移 `prefix`。

PowerShell 执行：

```powershell
# 检查版本
node -v

# 国内镜像
npm config set registry https://registry.npmmirror.com

# 安装
npm install -g @anthropic-ai/claude-code
```

**安装完成后必须重启终端**，否则 `claude` 命令无法识别。

验证：

```powershell
claude --version
```

若仍提示找不到命令，检查 PATH 是否包含 npm 全局 `bin` 目录：

```powershell
npm config get prefix
# 将输出路径加上 \bin，手动加入系统环境变量 PATH
```

---

## 四、网络受限环境：npx 免安装方案

若 `npm install -g` 因网络或权限问题失败，可使用 `npx` 直接启动，无需全局安装。

### 4.1 单次运行

```bash
npx -y @anthropic-ai/claude-code
```

`-y` 参数自动确认所有交互提示，避免中途阻塞。首次运行会从 registry 下载至本地缓存，后续启动复用缓存。

### 4.2 指定项目路径

```bash
npx -y @anthropic-ai/claude-code /path/to/project
```

### 4.3 离线迁移（内网环境）

在可联网机器上预装并打包缓存：

```bash
npm install -g @anthropic-ai/claude-code
tar czf npm-cache-claude.tar.gz ~/.npm
```

拷贝至目标机器后解压：

```bash
tar xzf npm-cache-claude.tar.gz -C ~/
npx -y @anthropic-ai/claude-code
```

`npx` 缓存位于 `~/.npm/_npx`，缓存完整时支持离线运行。

---

## 五、接入 DeepSeek API（第三方后端）

Claude Code 默认连接 `api.anthropic.com`，国内网络不通且成本较高。DeepSeek 提供 Anthropic 兼容接口（`api.deepseek.com/anthropic`），可通过环境变量或配置文件切换后端。

前置条件：在 [platform.deepseek.com](https://platform.deepseek.com) 注册并获取 API Key（格式 `sk-...`）。

### 5.1 方案 A：环境变量（~/.bashrc）

```bash
# DeepSeek 后端
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="sk-your-deepseek-key"
export ANTHROPIC_MODEL="deepseek-chat"
export ANTHROPIC_SMALL_FAST_MODEL="deepseek-chat"

# 禁用非必要流量
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"

# 禁用 thinking 参数（部分非 Anthropic 模型不支持，会导致挂起）
export CLAUDE_CODE_DISABLE_THINKING="1"
```

写入后执行 `source ~/.bashrc` 生效。

### 5.2 方案 B：用户级配置文件（~/.claude/settings.json）

```bash
mkdir -p ~/.claude
chmod 700 ~/.claude
```

创建 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_API_KEY": "sk-your-deepseek-key",
    "ANTHROPIC_MODEL": "deepseek-chat",
    "ANTHROPIC_SMALL_FAST_MODEL": "deepseek-chat",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_THINKING": "1"
  }
}
```

```bash
chmod 600 ~/.claude/settings.json
```

`settings.json` 中的 `"env"` 块优先级高于同名环境变量。临时切回 Anthropic 官方时，重命名或删除该文件即可。

### 5.3 方案 C：项目级配置（.claude/settings.json）

在项目根目录创建：

```bash
mkdir -p .claude
```

`.claude/settings.json` 内容与 5.2 相同。Claude Code 启动时优先读取当前项目配置，回退至 `~/.claude/settings.json`。

### 5.4 模型映射与成本优化

DeepSeek 兼容端点支持 Claude 的三档模型映射。可将主对话模型与后台子代理模型分离，降低开销：

**~/.bashrc 写法：**

```bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="sk-your-key"

export ANTHROPIC_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro"

export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"

export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
export CLAUDE_CODE_DISABLE_THINKING="1"
```

**~/.claude/settings.json 写法：**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_API_KEY": "sk-your-key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_THINKING": "1"
  }
}
```

配置后主对话使用 `deepseek-v4-pro`，文件检索、批量替换等子代理任务自动降级至 `deepseek-v4-flash`。

### 5.5 验证后端切换

启动 Claude Code 后输入：

```
你是谁？
```

若返回 DeepSeek 身份介绍，说明后端已切换。更可靠的验证方式：

```bash
sudo tcpdump -i any host api.deepseek.com
```

Claude Code 运行期间有流量至 `api.deepseek.com` 即为配置成功。

---

## 六、故障排查

### 6.1 EACCES 权限错误

通常由之前使用 `sudo npm install -g` 导致：

```bash
sudo chown -R $(whoami) ~/.npm-global
npm install -g @anthropic-ai/claude-code
```

### 6.2 command not found

- **Linux**: `source ~/.bashrc && hash -r`
- **Windows**: 重启终端
- 仍无效时执行 `which claude`（Linux）或 `where claude`（Windows）确认二进制位置，检查 PATH

### 6.3 证书错误 UNABLE_TO_VERIFY_LEAF_SIGNATURE

```bash
sudo apt update && sudo apt install --reinstall ca-certificates
```

**禁止**执行 `npm config set strict-ssl false`。

### 6.4 切至 DeepSeek 后 "not responding" 或挂起

DeepSeek 模型不支持 Anthropic `thinking: {type: "adaptive"}` 参数。添加环境变量：

```bash
export CLAUDE_CODE_DISABLE_THINKING="1"
```

### 6.5 临时切回 Anthropic 官方

命令行前缀覆盖环境变量：

```bash
ANTHROPIC_BASE_URL="" ANTHROPIC_API_KEY="sk-anthropic-key" claude
```

空字符串清空 `ANTHROPIC_BASE_URL`，客户端回退至官方端点。

### 6.6 npx 缓存权限错误

```bash
npm cache clean --force
npx -y @anthropic-ai/claude-code
```

---

## 参考

- [npmmirror 镜像站](https://npmmirror.com)
- [DeepSeek API 文档](https://api-docs.deepseek.com/)
- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
