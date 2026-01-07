"""
打包脚本 - 将 sync_comments.py 打包成独立可执行文件
使用 PyInstaller 打包，生成的可执行文件可以在没有 Python 环境的电脑上运行
"""

import subprocess
import sys
import os

def install_pyinstaller():
    """安装 PyInstaller"""
    print("正在安装 PyInstaller...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    print("PyInstaller 安装完成！\n")

def build_executable():
    """使用 PyInstaller 打包"""
    print("开始打包...")
    
    # 获取当前脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_script = os.path.join(script_dir, "sync_comments.py")
    config_file = os.path.join(script_dir, "config.ini")
    
    # 检查配置文件是否存在
    if not os.path.exists(config_file):
        print("警告: config.ini 不存在，将创建示例配置文件")
        # 这里可以创建一个示例配置文件
    
    # PyInstaller 命令参数
    cmd = [
        "pyinstaller",
        "--onefile",  # 打包成单个文件
        "--name=批注同步工具",  # 可执行文件名称
        "--clean",  # 清理临时文件
        "--noconfirm",  # 不询问确认
        "--console",  # 显示控制台窗口
        f"--add-data={config_file}:.",  # 将配置文件打包进去（Windows 用分号，macOS/Linux 用冒号）
        target_script
    ]
    
    # 根据操作系统调整 add-data 参数
    if sys.platform == "win32":
        cmd[6] = f"--add-data={config_file};."
    
    # 执行打包
    subprocess.check_call(cmd, cwd=script_dir)
    
    print("\n" + "="*60)
    print("打包完成！")
    print("="*60)
    print(f"可执行文件位置: {os.path.join(script_dir, 'dist', '批注同步工具')}")
    print("\n使用说明:")
    print("1. 将 dist 文件夹中的可执行文件复制到需要的位置")
    print("2. 将 config.ini 复制到与可执行文件相同的目录")
    print("3. 将 source.xlsx 和 target.xlsx 放在与可执行文件相同的目录")
    print("4. 根据需要修改 config.ini 配置文件")
    print("5. 双击运行可执行文件即可")
    print("\n注意:")
    print("- 修改 config.ini 后无需重新打包，直接运行即可")
    print("- 详细使用说明请查看 使用说明.md")
    print("="*60)

if __name__ == "__main__":
    try:
        # 检查是否已安装 PyInstaller
        try:
            import PyInstaller
            print("PyInstaller 已安装\n")
        except ImportError:
            install_pyinstaller()
        
        # 执行打包
        build_executable()
        
    except Exception as e:
        print(f"\n错误: {e}")
        print("\n如果遇到问题，请手动执行以下命令:")
        print("1. pip install pyinstaller")
        print("2. pyinstaller --onefile --name=批注同步工具 sync_comments.py")
        sys.exit(1)
