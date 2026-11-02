# Tabby-Open-Here

Tabby 插件：在 Windows 资源管理器任意文件夹中直接打开 Tabby。

## 功能

- **地址栏命令**：在任意文件夹地址栏输入 `tabby`，在 Tabby 中打开当前目录。
- **右键菜单**：文件夹空白处、选中文件夹、驱动器、驱动器根目录均可「在 Tabby 中打开」。
- **现有窗口新标签页（默认）**：Tabby 已运行时在当前窗口新建标签页；未运行时正常启动。
- **新窗口模式**：设置页可切换为每次打开新窗口。
- **默认 Shell**：跟随 Tabby 默认，或选择任意本地 Profile（CMD、PowerShell、Git Bash 等）。
- **原生启动器**：约 7KB，无黑框闪烁，支持中文和空格路径。
- **无管理员权限**：只写 HKCU，不修改 PATH。
- **中英双语**：自动检测语言，可手动切换。
- **一键安装/卸载集成**，卸载时清理注册表与启动器目录。

## 安装

> 需要 Tabby 1.0.163 或更高版本（开发与验证基于 1.0.238）。

### 方式一：手动安装

1. 下载本项目：

   - GitHub 页面点击 **Code → Download ZIP**，解压
   - 或 `git clone https://github.com/iishen717/Tabby-Open-Here.git`

2. 在 Tabby 插件目录下创建插件文件夹（文件夹名必须是 `tabby-open-here`）：

```
Windows: %APPDATA%\tabby\plugins\node_modules\tabby-open-here\
```

3. 把项目中的 `package.json` 和 `dist/index.js` 复制进去：

```
tabby-open-here/
├── package.json
└── dist/
    └── index.js
```

4. 重启 Tabby。

> 不要直接把解压出来的 `Tabby-Open-Here-main` 文件夹放进 `node_modules`。Tabby 只识别以 `tabby-`（小写）开头的文件夹。

### 方式二：从源码构建

需要 Node.js 18+，以及 .NET Framework 4（仅重新生成启动器时需要）。

```bash
git clone https://github.com/iishen717/Tabby-Open-Here.git
cd Tabby-Open-Here
npm install --ignore-scripts
npm run build:launcher
npm test
npm run build
```

构建产物为 `dist/index.js`。然后按「方式一」第 2、3 步复制到插件目录，重启 Tabby。

> `npm install --ignore-scripts` 会跳过 `prepare` 构建；先生成启动器再执行 `npm run build`，顺序不能反。启动器自测可运行 `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-launcher.ps1`。

## 首次配置

1. 打开 Tabby → 设置 → **Open Here**。
2. 确认 **Tabby 路径**（通常会自动检测到）。
3. 选择默认 Shell 和打开方式（默认：现有窗口新标签页）。
4. 点击 **安装集成**。
5. 安装完成后即可使用。

> Windows 11：右键菜单位于「显示更多选项」中，这是经典菜单的正常行为。

## 使用

### 地址栏

在任意文件夹的地址栏输入：

```
tabby
```

按回车，Tabby 会在当前目录打开。

### 右键菜单

在文件夹空白处、文件夹本身或驱动器上右键，选择 **在 Tabby 中打开 / Open in Tabby**。

### 设置

Tabby 设置 → **Open Here**：

- **语言**：自动 / 中文 / English
- **Windows 集成**：安装 / 更新 / 卸载，查看状态
- **默认 Shell**：跟随 Tabby 默认 / 任意本地 Profile
- **打开位置**：现有窗口新标签页 / 新窗口
- **Tabby 路径**：自动检测、浏览或手动输入

## 卸载

**顺序很重要**：

1. 打开 Tabby 设置 → Open Here → **卸载集成**。
2. 关闭 Tabby。
3. 删除 `%APPDATA%\tabby\plugins\node_modules\tabby-open-here` 文件夹。

如果先删除了插件文件夹，设置页已经无法打开，请从项目仓库中手动运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\uninstall.ps1
```

该脚本删除：

- `HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\tabby.exe`
- 4 个 `HKCU\Software\Classes\...\TabbyOpenHere` 右键菜单键
- `%LOCALAPPDATA%\TabbyOpenHere` 启动器目录

## 工作原理

```
资源管理器地址栏 / 右键菜单
        ↓
%LOCALAPPDATA%\TabbyOpenHere\tabby.exe  （原生启动器）
        ↓  Tabby.exe open "<目录>"
Tabby 插件 CLIHandler（priority 100）
        ↓
按设置选择 Profile → 新建标签页 / 新窗口
```

- 地址栏命令通过 `HKCU\...\App Paths\tabby.exe` 解析，不需要修改 PATH。
- 右键菜单通过 `HKCU\Software\Classes\Directory|Drive\shell\TabbyOpenHere` 注册。
- 启动器读取 `tabby-path.txt`，所以 Tabby 移动或升级后只需在设置页更新路径。
- 新窗口模式通过 Tabby 内部 `newWindow()` + 一次性 localStorage 请求交接。
- 所有注册表操作都在当前用户下，不需要管理员权限。

## 故障排查

**地址栏输入 tabby 没反应**

- 确认设置页状态为「已安装」。
- 检查注册表：`reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\tabby.exe"`。
- 重启资源管理器（任务管理器 → 重启 Windows 资源管理器）。
- 某些第三方开始菜单/地址栏工具可能拦截命令。

**右键菜单看不到**

- Windows 11 请点击「显示更多选项」。
- 确认设置页右键菜单计数为 4/4。
- 重启资源管理器。

**提示找不到 Tabby.exe**

- 在设置页重新选择 Tabby 路径，点击「更新集成」。
- 检查 `%LOCALAPPDATA%\TabbyOpenHere\launcher.log`。

**新窗口模式没有打开目录**

- 确认 Tabby 版本 ≥ 1.0.163。
- 切换到「现有窗口新标签页」验证基础功能。
- 查看 Tabby 日志中的 `[OpenHere]` 与 CLI 信息。

**WSL Profile 不在列表里**

- 当前版本不支持 WSL 路径映射（Windows 目录无法可靠转换为 WSL 路径）。
- 可选择 CMD / PowerShell / Git Bash / 跟随默认。

## 技术栈

- Angular 9 + TypeScript
- Tabby Terminal Plugin API
- Webpack 5
- C# .NET Framework 4（原生启动器）

## License

MIT
