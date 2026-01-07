# Excel 批注同步工具 / Excel Comment Sync Tool

[![Build Status](https://github.com/auenger/excel-sync-comments/actions/workflows/build.yml/badge.svg)](https://github.com/auenger/excel-sync-comments/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

一个强大的 Excel 批注同步工具，支持多区域筛选、批注智能合并和详细日志记录。

A powerful Excel comment synchronization tool with multi-region filtering, intelligent comment merging, and detailed logging.

## ✨ 主要特性 / Features

- ✅ **多区域筛选** / Multi-region filtering
- ✅ **批注智能合并** / Intelligent comment merging
- ✅ **配置文件支持** / Configuration file support
- ✅ **详细日志记录** / Detailed logging
- ✅ **跨平台支持** / Cross-platform support (Windows, macOS, Linux)
- ✅ **独立可执行文件** / Standalone executables (no Python required)

## 📦 下载 / Download

### 自动构建版本 / Automated Builds

访问 [Releases](https://github.com/auenger/excel-sync-comments/releases) 页面下载最新版本：

- **Windows**: `批注同步工具_Windows.zip`
- **macOS**: `批注同步工具_macOS.zip`
- **Linux**: `批注同步工具_Linux.zip`

### 手动构建 / Manual Build

如果需要手动构建，请查看 [开发者文档](pyexcel/开发者文档.md)。

## 🚀 快速开始 / Quick Start

### 1. 下载并解压

Download and extract the appropriate package for your platform.

### 2. 准备文件 / Prepare Files

将以下文件放在同一目录：
- 可执行文件（批注同步工具 / 批注同步工具.exe）
- `config.ini`（配置文件）
- `source.xlsx`（源文件，包含批注）
- `target.xlsx`（目标文件，需要添加批注）

### 3. 配置 / Configuration

编辑 `config.ini` 文件：

```ini
[文件路径]
源文件 = source.xlsx
目标文件 = target.xlsx
输出文件 = target_updated.xlsx

[列配置]
区域列 = C
姓名列 = B
同步列 = DO, DP, DS, DU

[筛选条件]
筛选区域 = 厦门, 福州, 泉州

[批注合并]
启用合并 = True
分隔符 = \n---\n
```

### 4. 运行 / Run

- **Windows**: 双击 `批注同步工具.exe`
- **macOS/Linux**: 双击 `批注同步工具` 或运行 `./批注同步工具`

### 5. 查看结果 / View Results

运行完成后会生成：
- `target_updated.xlsx` - 同步后的文件
- `sync_log_YYYYMMDD_HHMMSS.txt` - 详细日志

## 📖 文档 / Documentation

- [使用说明](pyexcel/使用说明.md) - 详细的用户指南
- [开发者文档](pyexcel/开发者文档.md) - 技术文档和开发指南
- [Windows 打包指南](pyexcel/Windows打包指南.md) - Windows 平台打包说明

## 🔧 配置说明 / Configuration

### 文件路径 / File Paths

| 配置项 | 说明 | Example |
|--------|------|---------|
| 源文件 | 包含批注的源文件 | `source.xlsx` |
| 目标文件 | 需要添加批注的目标文件 | `target.xlsx` |
| 输出文件 | 同步后保存的文件 | `target_updated.xlsx` |

### 列配置 / Column Configuration

| 配置项 | 说明 | Example |
|--------|------|---------|
| 区域列 | 区域所在的列 | `C` |
| 姓名列 | 姓名所在的列 | `B` |
| 同步列 | 需要同步批注的列（逗号分隔） | `DO, DP, DS, DU` |

### 筛选条件 / Filtering

| 配置项 | 说明 | Example |
|--------|------|---------|
| 筛选区域 | 只处理这些区域的数据（逗号分隔）<br>留空或填 `None` 表示不筛选 | `厦门, 福州, 泉州` |

### 批注合并 / Comment Merging

| 配置项 | 说明 | Example |
|--------|------|---------|
| 启用合并 | 如果目标单元格已有批注，是否合并 | `True` / `False` |
| 分隔符 | 合并批注时使用的分隔符 | `\n---\n` |

## 🛠️ 开发 / Development

### 环境要求 / Requirements

- Python 3.9+
- openpyxl
- PyInstaller (for building)

### 安装依赖 / Install Dependencies

```bash
pip install openpyxl pyinstaller
```

### 运行源代码 / Run from Source

```bash
cd pyexcel
python sync_comments.py
```

### 构建可执行文件 / Build Executable

```bash
cd pyexcel
python build_exe.py
```

### 自动化构建 / Automated Build

本项目使用 GitHub Actions 自动构建所有平台的可执行文件。

每次推送标签时会自动触发构建：

```bash
git tag v1.0.0
git push origin v1.0.0
```

或在 GitHub Actions 页面手动触发。

## 📊 工作流程 / Workflow

```
源文件 (source.xlsx)
    ↓
  读取批注
    ↓
  根据姓名匹配
    ↓
目标文件 (target.xlsx)
    ↓
  同步/合并批注
    ↓
输出文件 (target_updated.xlsx)
    +
详细日志 (sync_log_*.txt)
```

## 💡 使用示例 / Examples

### 示例 1：同步单个区域

```ini
[筛选条件]
筛选区域 = 厦门
```

### 示例 2：同步多个区域

```ini
[筛选条件]
筛选区域 = 厦门, 福州, 泉州, 龙岩
```

### 示例 3：同步所有区域

```ini
[筛选条件]
筛选区域 = None
```

### 示例 4：禁用批注合并

```ini
[批注合并]
启用合并 = False
```

## 🐛 常见问题 / FAQ

### Q: 如何修改配置？
**A**: 直接编辑 `config.ini` 文件，保存后重新运行工具即可，**无需重新打包**。

### Q: 配置文件丢失了怎么办？
**A**: 工具会自动使用默认配置运行。你可以重新创建 `config.ini` 文件。

### Q: 如何知道哪些批注被合并了？
**A**: 查看生成的日志文件，在【合并批注详情】部分可以看到所有合并的批注。

### Q: macOS 提示"无法打开，因为无法验证开发者"
**A**: 右键点击可执行文件 > 选择"打开" > 点击"打开"确认。

## 📝 更新日志 / Changelog

### v1.0.0 (2026-01-07)
- ✅ 初始版本发布
- ✅ 支持多区域筛选
- ✅ 支持批注智能合并
- ✅ 支持配置文件
- ✅ 详细日志记录
- ✅ 跨平台自动构建

## 📄 许可证 / License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

## 📞 支持 / Support

如有问题，请：
1. 查看[使用说明](pyexcel/使用说明.md)
2. 查看生成的日志文件
3. 提交 [Issue](https://github.com/auenger/excel-sync-comments/issues)

---

**Made with ❤️ by Ryan**
