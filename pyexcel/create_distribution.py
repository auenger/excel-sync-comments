"""
创建分发包 - 将所有需要的文件打包成 zip
"""

import os
import shutil
import zipfile
from datetime import datetime

def create_distribution():
    """创建分发包"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 分发包名称
    dist_name = f"批注同步工具_macOS_{datetime.now().strftime('%Y%m%d')}"
    dist_folder = os.path.join(script_dir, dist_name)
    
    # 创建分发文件夹
    if os.path.exists(dist_folder):
        shutil.rmtree(dist_folder)
    os.makedirs(dist_folder)
    
    print(f"正在创建分发包: {dist_name}")
    print("="*60)
    
    # 复制可执行文件
    exe_file = os.path.join(script_dir, "dist", "批注同步工具")
    if os.path.exists(exe_file):
        shutil.copy2(exe_file, dist_folder)
        print("✓ 已复制: 批注同步工具（可执行文件）")
    else:
        print("✗ 错误: 找不到可执行文件，请先运行 build_exe.py")
        return
    
    # 复制配置文件
    config_file = os.path.join(script_dir, "config.ini")
    if os.path.exists(config_file):
        shutil.copy2(config_file, dist_folder)
        print("✓ 已复制: config.ini（配置文件）")
    
    # 复制使用说明
    readme_file = os.path.join(script_dir, "使用说明.md")
    if os.path.exists(readme_file):
        shutil.copy2(readme_file, dist_folder)
        # 同时创建一个 txt 版本
        txt_file = os.path.join(dist_folder, "使用说明.txt")
        shutil.copy2(readme_file, txt_file)
        print("✓ 已复制: 使用说明.md / 使用说明.txt")
    
    # 创建示例文件夹
    example_folder = os.path.join(dist_folder, "示例文件")
    os.makedirs(example_folder)
    
    # 如果有示例文件，复制过去
    source_example = os.path.join(script_dir, "source.xlsx")
    target_example = os.path.join(script_dir, "target.xlsx")
    
    if os.path.exists(source_example):
        shutil.copy2(source_example, example_folder)
        print("✓ 已复制: source.xlsx（示例文件）")
    
    if os.path.exists(target_example):
        shutil.copy2(target_example, example_folder)
        print("✓ 已复制: target.xlsx（示例文件）")
    
    # 创建快速开始说明
    quick_start = os.path.join(dist_folder, "快速开始.txt")
    with open(quick_start, 'w', encoding='utf-8') as f:
        f.write("=" * 60 + "\n")
        f.write("Excel 批注同步工具 - 快速开始\n")
        f.write("=" * 60 + "\n\n")
        f.write("1. 准备文件\n")
        f.write("   将 source.xlsx（源文件）和 target.xlsx（目标文件）\n")
        f.write("   放在与可执行文件相同的目录下\n\n")
        f.write("2. 修改配置（可选）\n")
        f.write("   打开 config.ini 文件，根据需要修改配置\n")
        f.write("   - 筛选区域：可以设置多个区域，用逗号分隔\n")
        f.write("   - 同步列：设置需要同步批注的列\n")
        f.write("   - 批注合并：设置是否合并已有批注\n\n")
        f.write("3. 运行工具\n")
        f.write("   双击 批注同步工具 可执行文件\n\n")
        f.write("4. 查看结果\n")
        f.write("   - target_updated.xlsx：同步后的文件\n")
        f.write("   - sync_log_*.txt：详细日志文件\n\n")
        f.write("=" * 60 + "\n")
        f.write("重要提示：\n")
        f.write("- 修改 config.ini 后无需重新打包，直接运行即可\n")
        f.write("- 详细使用说明请查看 使用说明.txt\n")
        f.write("- macOS 首次运行可能需要右键 > 打开\n")
        f.write("=" * 60 + "\n")
    
    print("✓ 已创建: 快速开始.txt")
    
    # 打包成 zip
    zip_file = os.path.join(script_dir, f"{dist_name}.zip")
    if os.path.exists(zip_file):
        os.remove(zip_file)
    
    print("\n正在压缩...")
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, script_dir)
                zipf.write(file_path, arcname)
    
    print("\n" + "="*60)
    print("分发包创建完成！")
    print("="*60)
    print(f"文件夹: {dist_folder}")
    print(f"压缩包: {zip_file}")
    print(f"大小: {os.path.getsize(zip_file) / 1024 / 1024:.2f} MB")
    print("\n包含文件:")
    print("  - 批注同步工具（可执行文件）")
    print("  - config.ini（配置文件）")
    print("  - 使用说明.md / 使用说明.txt")
    print("  - 快速开始.txt")
    print("  - 示例文件/（示例 Excel 文件）")
    print("\n现在可以将 zip 文件分发给其他人使用！")
    print("="*60)

if __name__ == "__main__":
    try:
        create_distribution()
    except Exception as e:
        print(f"\n错误: {e}")
        import traceback
        traceback.print_exc()
