"""
准备 Windows 打包文件
将所有需要的文件复制到一个文件夹，方便传输到 Windows 电脑
"""

import os
import shutil
from datetime import datetime

def prepare_windows_package():
    """准备 Windows 打包所需的文件"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 创建输出文件夹
    output_name = f"Windows打包文件_{datetime.now().strftime('%Y%m%d')}"
    output_folder = os.path.join(script_dir, output_name)
    
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)
    os.makedirs(output_folder)
    
    print("=" * 60)
    print("准备 Windows 打包文件")
    print("=" * 60)
    
    # 需要复制的文件列表
    files_to_copy = [
        "sync_comments.py",
        "config.ini",
        "build_exe.py",
        "create_distribution.py",
        "使用说明.md",
        "Windows打包指南.md",
        "source.xlsx",
        "target.xlsx"
    ]
    
    copied_count = 0
    
    for filename in files_to_copy:
        src = os.path.join(script_dir, filename)
        if os.path.exists(src):
            dst = os.path.join(output_folder, filename)
            shutil.copy2(src, dst)
            print(f"✓ 已复制: {filename}")
            copied_count += 1
        else:
            print(f"⚠ 跳过（文件不存在）: {filename}")
    
    # 创建 Windows 打包说明
    readme_file = os.path.join(output_folder, "README_Windows.txt")
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write("=" * 60 + "\n")
        f.write("Windows 打包说明\n")
        f.write("=" * 60 + "\n\n")
        f.write("1. 安装 Python 3.9+\n")
        f.write("   下载地址: https://www.python.org/downloads/\n")
        f.write("   安装时勾选 'Add Python to PATH'\n\n")
        f.write("2. 打开命令提示符（CMD）或 PowerShell\n\n")
        f.write("3. 进入此文件夹\n")
        f.write("   cd 文件夹路径\n\n")
        f.write("4. 创建虚拟环境\n")
        f.write("   python -m venv venv\n\n")
        f.write("5. 激活虚拟环境\n")
        f.write("   venv\\Scripts\\activate\n\n")
        f.write("6. 安装依赖\n")
        f.write("   pip install openpyxl pyinstaller\n\n")
        f.write("7. 打包\n")
        f.write("   python build_exe.py\n\n")
        f.write("8. 创建分发包\n")
        f.write("   python create_distribution.py\n\n")
        f.write("9. 查看结果\n")
        f.write("   dist\\批注同步工具.exe\n")
        f.write("   批注同步工具_Windows_YYYYMMDD.zip\n\n")
        f.write("=" * 60 + "\n")
        f.write("详细说明请查看: Windows打包指南.md\n")
        f.write("=" * 60 + "\n")
    
    print(f"✓ 已创建: README_Windows.txt")
    
    # 创建批处理文件（Windows 快捷脚本）
    batch_file = os.path.join(output_folder, "打包.bat")
    with open(batch_file, 'w', encoding='gbk') as f:
        f.write("@echo off\n")
        f.write("chcp 65001 >nul\n")
        f.write("echo ============================================================\n")
        f.write("echo Excel 批注同步工具 - Windows 打包脚本\n")
        f.write("echo ============================================================\n")
        f.write("echo.\n")
        f.write("echo 正在检查 Python...\n")
        f.write("python --version\n")
        f.write("if errorlevel 1 (\n")
        f.write("    echo 错误: 未找到 Python，请先安装 Python 3.9+\n")
        f.write("    echo 下载地址: https://www.python.org/downloads/\n")
        f.write("    pause\n")
        f.write("    exit /b 1\n")
        f.write(")\n")
        f.write("echo.\n")
        f.write("echo 正在创建虚拟环境...\n")
        f.write("if not exist venv (\n")
        f.write("    python -m venv venv\n")
        f.write(")\n")
        f.write("echo.\n")
        f.write("echo 正在激活虚拟环境...\n")
        f.write("call venv\\Scripts\\activate\n")
        f.write("echo.\n")
        f.write("echo 正在安装依赖...\n")
        f.write("pip install openpyxl pyinstaller\n")
        f.write("echo.\n")
        f.write("echo 正在打包...\n")
        f.write("python build_exe.py\n")
        f.write("echo.\n")
        f.write("echo 正在创建分发包...\n")
        f.write("python create_distribution.py\n")
        f.write("echo.\n")
        f.write("echo ============================================================\n")
        f.write("echo 打包完成！\n")
        f.write("echo ============================================================\n")
        f.write("echo.\n")
        f.write("pause\n")
    
    print(f"✓ 已创建: 打包.bat（Windows 一键打包脚本）")
    
    # 压缩成 zip
    zip_file = os.path.join(script_dir, f"{output_name}.zip")
    if os.path.exists(zip_file):
        os.remove(zip_file)
    
    print("\n正在压缩...")
    import zipfile
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(output_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, script_dir)
                zipf.write(file_path, arcname)
    
    print("\n" + "=" * 60)
    print("准备完成！")
    print("=" * 60)
    print(f"文件夹: {output_folder}")
    print(f"压缩包: {zip_file}")
    print(f"文件数: {copied_count + 2}")
    print("\n包含文件:")
    for filename in files_to_copy:
        if os.path.exists(os.path.join(script_dir, filename)):
            print(f"  - {filename}")
    print("  - README_Windows.txt（打包说明）")
    print("  - 打包.bat（一键打包脚本）")
    print("\n使用方法:")
    print("1. 将 zip 文件复制到 Windows 电脑")
    print("2. 解压缩")
    print("3. 双击运行 '打包.bat'")
    print("   或按照 README_Windows.txt 的步骤手动操作")
    print("=" * 60)

if __name__ == "__main__":
    try:
        prepare_windows_package()
    except Exception as e:
        print(f"\n错误: {e}")
        import traceback
        traceback.print_exc()
