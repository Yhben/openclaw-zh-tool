# Share Posts

## Chinese short post

我把 `OpenClaw` 的 WebUI 汉化工具开源了：

`openclaw-zh-tool`

它不是简单替换静态文件，而是做成了一个可安装、可恢复、可校验、可扫描残留英文、可自动补全的中文增强工具。

目前特点：

- 支持 OpenClaw Control WebUI 汉化
- 只改显示层，不改运行逻辑
- 自适应定位当前 `index-*.js` bundle
- 支持 `install / restore / verify / doctor / report / residuals / autofix`
- 支持 Windows PowerShell 安装入口

仓库地址：

`https://github.com/Yhben/openclaw-zh-tool`

如果你也在用 OpenClaw，欢迎试用和提 issue。

## Chinese medium post

我把自己给 `OpenClaw Control WebUI` 做的中文增强工具整理成开源仓库了：

`openclaw-zh-tool`

这个项目的目标不是去改 OpenClaw 的后端逻辑，而是只在前端显示层做中文化和兼容修复，让中文用户打开控制台后更容易看懂页面标题、字段名、按钮、说明和子页面内容。

这套工具目前支持：

- 自适应注入当前 OpenClaw `index-*.js` bundle
- 安装前自动备份
- 一键恢复
- 校验当前补丁状态
- 浏览器扫描残留英文
- 导出残留词表
- 安全自动补词
- review 级候选提升

也就是说，它已经不只是一个“汉化补丁”，而是一个更完整的：

- 安装器
- 校验器
- 扫描器
- 补全器

仓库：

`https://github.com/Yhben/openclaw-zh-tool`

如果你在用 OpenClaw，欢迎反馈实际版本兼容情况，尤其是 Windows / Linux 环境。

## English short post

I open-sourced `openclaw-zh-tool`, a community Chinese localization tool for the OpenClaw Control WebUI.

It focuses on display-layer localization only:

- adaptive runtime injection
- backup / restore
- verify / doctor / report
- residual-English scanning
- conservative auto-fix workflow

Repo:

`https://github.com/Yhben/openclaw-zh-tool`
