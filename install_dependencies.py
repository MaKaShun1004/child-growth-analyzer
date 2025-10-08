#!/usr/bin/env python3
"""
依賴安裝腳本 - 修復 Python 3.12 兼容性問題
"""

import subprocess
import sys
import os

def run_command(command):
    """運行命令並檢查結果"""
    print(f"🚀 執行: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(f"✅ 成功: {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 失敗: {command}")
        print(f"錯誤訊息: {e.stderr}")
        return False

def main():
    print("🔧 開始安裝童伴成長系統依賴...")
    
    # 先升級 pip
    run_command("pip install --upgrade pip")
    
    # 安裝基礎依賴
    dependencies = [
        "setuptools>=65.0.0",
        "wheel>=0.40.0",
        "numpy>=1.24.0",
        "pandas>=2.0.3",
        "pillow>=10.0.0",
        "plotly>=5.15.0",
        "scikit-learn>=1.3.0",
        "streamlit>=1.28.0",
        "openai>=1.0.0"
    ]
    
    success_count = 0
    for dep in dependencies:
        if run_command(f"pip install {dep}"):
            success_count += 1
    
    print(f"\n📊 安裝結果: {success_count}/{len(dependencies)} 個套件安裝成功")
    
    if success_count == len(dependencies):
        print("🎉 所有依賴安裝完成！")
        print("\n下一步: 運行測試驗證安裝")
        run_command("python -c \"import streamlit; print('✅ Streamlit 安裝成功')\"")
        run_command("python -c \"import pandas; print('✅ Pandas 安裝成功')\"")
    else:
        print("⚠️  部分套件安裝失敗，請檢查錯誤訊息")

if __name__ == "__main__":
    main()