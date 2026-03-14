# openclaw-zh-tool

`openclaw-zh-tool` 是一个面向 OpenClaw Control WebUI 的社区汉化工具。

它的作用不是修改 OpenClaw 的运行逻辑，而是给已经安装好的 OpenClaw 前端界面注入一层中文显示运行时，让中文用户更容易使用 WebUI。

## 这个项目是做什么的

这个工具主要解决的问题是：

- OpenClaw 左侧菜单可能已经部分中文，但很多页面内部字段、按钮、说明、子页面内容仍然是英文
- OpenClaw 升级后，直接替换固定静态文件的做法很容易失效
- 需要一个可恢复、可校验、可扫描残留英文、可持续补全的方案

所以这个项目采用的是：

- 自适应检测当前 OpenClaw 前端 bundle
- 在 bundle 里注入显示层中文 runtime
- 保留备份
- 支持恢复
- 支持扫描残留英文
- 支持安全自动补全
- 支持人工确认后提升补词

## 它不会做什么

这个工具不会修改 OpenClaw 的真实运行行为。

它不会修改：

- 配置 key
- API / RPC 协议
- agent ID
- model ID
- command 名称
- tool ID
- 后端执行逻辑
- 请求结构
- 文件路径

简单说：

- 改的是“显示给人看的文本”
- 不改“系统真正拿来运行的值”

## 当前状态

- 已验证 OpenClaw 版本：`2026.3.12`
- 当前模式：自适应 runtime 注入
- 当前补词结构：
  - 基础 runtime
  - 自动生成补词
  - 人工确认补词

这意味着它不是写死某一个 hash 文件名的静态补丁，而是会自动找当前的 `index-*.js` 主 bundle。

## 支持平台

### 已支持

- macOS：已实际开发和验证
- Windows：已补齐 Node CLI 和 PowerShell 安装入口
- Linux：理论支持，前提是 OpenClaw 安装在可检测路径中

### 平台说明

- `install.sh` / `restore.sh`：给 macOS / Linux shell 用
- `install.ps1` / `restore.ps1`：给 Windows PowerShell 用
- 浏览器扫描功能依赖 Playwright 和可启动浏览器

## 安装原理

安装时，这个工具会：

1. 找到本机 OpenClaw 安装目录
2. 找到当前正在使用的 `dist/control-ui/assets/index-*.js`
3. 先备份原文件
4. 把中文 runtime 注入到 bundle 中
5. 写入本地状态文件

它不会直接替换整个 `assets` 目录。

这样做的好处是：

- 对 OpenClaw 小版本升级更稳
- 不依赖固定 hash 文件名
- 出问题可以恢复

## 快速开始

### 方式一：克隆仓库后安装

```bash
git clone https://github.com/Yhben/openclaw-zh-tool.git
cd openclaw-zh-tool
node scripts/install.js
```

### 方式二：macOS / Linux 一句话安装

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.sh | bash
```

### 方式三：Windows PowerShell 一句话安装

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.ps1 -UseBasicParsing | iex
```

## 恢复原文件

### 普通恢复

```bash
node scripts/restore.js
```

### macOS / Linux 一句话恢复

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.sh | bash
```

### Windows PowerShell 一句话恢复

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.ps1 -UseBasicParsing | iex
```

## 推荐使用流程

建议按这个顺序使用：

1. `install`
2. 浏览器强制刷新，必要时重启 OpenClaw
3. `doctor`
4. `report` 或 `residuals`
5. `autofix`
6. 查看 `review-candidates`
7. `promote-review`

## CLI 命令

```bash
node bin/openclaw-zh.js install
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
node bin/openclaw-zh.js scan
node bin/openclaw-zh.js autofix
node bin/openclaw-zh.js promote-review
node bin/openclaw-zh.js restore
```

### 命令说明

`install`

- 注入中文 runtime

`status`

- 查看当前安装状态、检测到的版本和目标 bundle

`verify`

- 校验注入状态是否完整

`doctor`

- 结构检查
- 浏览器扫描
- 输出残留英文统计

`report`

- 生成完整 JSON 报告

`residuals`

- 导出唯一残留英文词表

`scan`

- 输出路由级扫描摘要

`autofix`

- 生成安全自动补词
- 写入 `supplements/generated-exact.json`
- 写入 `supplements/review-candidates.json`

`promote-review`

- 把人工确认过的 review 词条写入 `supplements/custom-exact.json`

`restore`

- 恢复原始 bundle

## 浏览器扫描会做什么

扫描器不只是看主页面，它还会尽量去点：

- tab
- 折叠块
- 添加按钮
- 编辑 / 详情 / 设置类按钮

扫描时会强制设置：

```text
localStorage.openclaw.i18n.locale = zh-CN
```

也就是说，扫描结果反映的是“中文模式下”仍然残留的英文，而不是默认语言。

默认扫描地址：

```text
http://127.0.0.1:18789
```

也可以手动覆盖：

```bash
OPENCLAW_CONTROL_URL=http://127.0.0.1:18789 node bin/openclaw-zh.js doctor
```

## 会生成哪些文件

工具运行过程中，可能会生成：

- `openclaw-zh-report.json`
- `openclaw-zh-residuals.json`
- `supplements/generated-exact.json`
- `supplements/review-candidates.json`
- `supplements/custom-exact.json`

### 这些补词文件分别是什么

`supplements/generated-exact.json`

- `autofix` 自动生成的安全补词

`supplements/review-candidates.json`

- 需要人工确认的候选翻译

`supplements/custom-exact.json`

- 人工确认后沉淀下来的稳定补词

## 如果安装后页面还是有英文怎么办

不一定是补丁失败。

常见原因有：

- OpenClaw 进程还在提供旧前端资源
- 浏览器缓存没刷新干净
- 当前残留是命令示例或技术字面量
- 还没进行新一轮补词

建议排查顺序：

1. `node bin/openclaw-zh.js verify`
2. 浏览器强制刷新
3. 必要时重启 OpenClaw
4. `node bin/openclaw-zh.js residuals`
5. 看剩下的是不是“真正应该翻”的 UI 文案

## 这个项目适不适合开源分享

适合。

因为它已经不只是一个静态补丁，而是：

- 可安装
- 可恢复
- 可校验
- 可扫描
- 可补全
- 可沉淀补词

更准确地说，它是一个：

- OpenClaw WebUI 中文增强工具

而不是简单一次性的“替换包”。

## 兼容策略

这个项目是“自适应”，不是“永远零维护”。

它比静态替换强的地方在于：

- 自动找当前 bundle
- 注入 runtime，不替换全量 hash 文件
- 带扫描、报告和补词链路

但如果 OpenClaw 以后前端结构大改，仍然需要继续维护。

## 开发与调试

安装扫描依赖：

```bash
npm install
```

常用命令：

```bash
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
```

## 许可证

MIT
