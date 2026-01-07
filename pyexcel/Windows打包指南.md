# Windows 版本打包指南

## ⚠️ 重要说明

**PyInstaller 不支持跨平台打包！**

- ❌ 在 macOS 上无法打包 Windows 版本
- ❌ 在 Windows 上无法打包 macOS 版本
- ✅ 必须在目标平台上进行打包

---

## 🎯 三种解决方案

### 方案 1：在 Windows 电脑上手动打包（最简单）

#### 步骤 1：准备 Windows 环境

1. **安装 Python**
   - 访问 https://www.python.org/downloads/
   - 下载 Python 3.9 或更高版本
   - 安装时勾选 "Add Python to PATH"

2. **创建项目文件夹**
   ```
   C:\批注同步工具\
   ```

3. **复制以下文件到 Windows 电脑**
   - `sync_comments.py`
   - `config.ini`
   - `build_exe.py`
   - `create_distribution.py`
   - `使用说明.md`
   - `source.xlsx`（示例）
   - `target.xlsx`（示例）

#### 步骤 2：安装依赖

打开命令提示符（CMD）或 PowerShell：

```bash
# 进入项目目录
cd C:\批注同步工具

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
venv\Scripts\activate

# 安装依赖
pip install openpyxl pyinstaller
```

#### 步骤 3：打包

```bash
# 确保虚拟环境已激活
venv\Scripts\activate

# 运行打包脚本
python build_exe.py

# 创建分发包
python create_distribution.py
```

#### 步骤 4：获取结果

打包完成后，会生成：
- `dist\批注同步工具.exe`（可执行文件）
- `批注同步工具_Windows_YYYYMMDD.zip`（分发包）

---

### 方案 2：使用 GitHub Actions（推荐，自动化）

#### 优势
- ✅ 完全免费
- ✅ 自动打包 Windows、macOS、Linux 三个版本
- ✅ 无需本地 Windows 环境
- ✅ 可重复执行

#### 步骤 1：准备 GitHub 仓库

1. 在 GitHub 上创建仓库（如果还没有）
2. 将项目代码推送到 GitHub

```bash
cd /Users/ryan/mycode/HRExcel
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/HRExcel.git
git push -u origin main
```

#### 步骤 2：触发自动打包

已经创建了 GitHub Actions 配置文件：`.github/workflows/build.yml`

**方法 A：手动触发**
1. 访问 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Build Executables"
4. 点击 "Run workflow"

**方法 B：创建标签触发**
```bash
git tag v1.0
git push origin v1.0
```

#### 步骤 3：下载打包结果

1. 等待 Actions 运行完成（约 5-10 分钟）
2. 在 Actions 页面下载生成的文件：
   - `批注同步工具_Windows.zip`
   - `批注同步工具_macOS.zip`
   - `批注同步工具_Linux.zip`

---

### 方案 3：使用虚拟机

#### 使用 Parallels Desktop（macOS）

1. **安装 Parallels Desktop**
   - 购买并安装 Parallels Desktop
   - 创建 Windows 虚拟机

2. **在虚拟机中打包**
   - 按照"方案 1"的步骤操作
   - 在虚拟机中完成打包

3. **复制文件到 macOS**
   - 使用共享文件夹功能
   - 将打包好的文件复制出来

---

## 📋 Windows 打包命令参考

### 完整的 Windows 打包命令

```bash
# 1. 创建虚拟环境
python -m venv venv

# 2. 激活虚拟环境
venv\Scripts\activate

# 3. 安装依赖
pip install openpyxl pyinstaller

# 4. 打包（手动方式）
pyinstaller --onefile --name=批注同步工具 --clean --add-data="config.ini;." sync_comments.py

# 或使用自动脚本
python build_exe.py

# 5. 创建分发包
python create_distribution.py
```

### 注意事项

1. **路径分隔符**
   - Windows 使用 `\` 或 `\\`
   - `--add-data` 参数在 Windows 上使用 `;` 分隔

2. **文件名**
   - Windows 会生成 `.exe` 文件
   - 文件名：`批注同步工具.exe`

3. **杀毒软件**
   - 某些杀毒软件可能误报
   - 需要添加信任

---

## 🎁 推荐方案对比

| 方案 | 难度 | 成本 | 时间 | 推荐度 |
|------|------|------|------|--------|
| **方案 1：Windows 电脑** | ⭐⭐ | 免费（需要 Windows 电脑） | 30分钟 | ⭐⭐⭐⭐ |
| **方案 2：GitHub Actions** | ⭐⭐⭐ | 完全免费 | 10分钟（自动） | ⭐⭐⭐⭐⭐ |
| **方案 3：虚拟机** | ⭐⭐⭐⭐ | 需购买 Parallels | 1小时 | ⭐⭐⭐ |

---

## 💡 我的建议

### 如果你有 Windows 电脑
→ 使用**方案 1**，最直接

### 如果你没有 Windows 电脑
→ 使用**方案 2（GitHub Actions）**，完全免费且自动化

### 如果你需要频繁打包
→ 使用**方案 2（GitHub Actions）**，一次配置，永久使用

---

## 📦 GitHub Actions 使用步骤（详细）

### 1. 推送代码到 GitHub

```bash
cd /Users/ryan/mycode/HRExcel

# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Add Excel comment sync tool"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/HRExcel.git

# 推送
git push -u origin main
```

### 2. 触发自动打包

**方法 A：通过网页手动触发**
1. 访问 `https://github.com/你的用户名/HRExcel`
2. 点击顶部的 "Actions" 标签
3. 左侧选择 "Build Executables"
4. 右侧点击 "Run workflow" 按钮
5. 点击绿色的 "Run workflow" 确认

**方法 B：通过标签自动触发**
```bash
# 创建版本标签
git tag v1.0

# 推送标签
git push origin v1.0
```

### 3. 等待打包完成

- 打包过程约 5-10 分钟
- 可以在 Actions 页面查看进度
- 绿色勾号表示成功

### 4. 下载打包结果

1. 在 Actions 页面点击对应的运行记录
2. 滚动到底部的 "Artifacts" 部分
3. 下载以下文件：
   - `批注同步工具_Windows.zip`
   - `批注同步工具_macOS.zip`
   - `批注同步工具_Linux.zip`

---

## ✅ 总结

**最简单的方法**：使用 GitHub Actions（方案 2）

1. 推送代码到 GitHub
2. 在 Actions 页面点击 "Run workflow"
3. 等待 5-10 分钟
4. 下载 Windows、macOS、Linux 三个版本

**完全免费，无需 Windows 电脑！** 🎉

---

## 📞 需要帮助？

如果你选择使用 GitHub Actions，我可以帮你：
1. 创建 GitHub 仓库
2. 配置 Actions
3. 触发第一次打包

告诉我你想用哪种方案！
