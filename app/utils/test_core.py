#!/usr/bin/env python3
"""
測試核心模塊功能
"""

import sys
import os

# 添加當前目錄到 Python 路徑
sys.path.append(os.path.dirname(__file__))

from utils.milestone_db import get_milestones_by_age, DEVELOPMENT_MILESTONES
from utils.ai_analyzer import ChildGrowthAnalyzer

def test_milestone_database():
    """測試里程碑數據庫"""
    print("=== 測試里程碑數據庫 ===")
    
    # 測試各年齡段
    for age in [3, 4, 5]:
        milestones = get_milestones_by_age(age)
        print(f"\n🔍 {age}歲發展里程碑:")
        for domain, skills in milestones.items():
            print(f"  {domain}: {len(skills)} 項技能")
            for i, skill in enumerate(skills[:2], 1):  # 只顯示前2項
                print(f"    {i}. {skill}")
    
    print(f"\n✅ 數據庫加載成功，包含 {len(DEVELOPMENT_MILESTONES)} 個年齡段")

def test_ai_analyzer():
    """測試AI分析器"""
    print("\n=== 測試AI分析器 ===")
    
    analyzer = ChildGrowthAnalyzer()
    
    # 測試文字分析
    print("\n📝 測試文字分析:")
    test_texts = [
        "孩子今天畫了一幅畫，還數數到20",
        "寶寶在公園跑步跳躍，和其他小朋友分享玩具",
        "孩子會自己穿衣服，還能講簡單的故事"
    ]
    
    for i, text in enumerate(test_texts, 1):
        print(f"\n  測試案例 {i}: '{text}'")
        result = analyzer.analyze_text(text, "4-5歲")
        
        print(f"    檢測到的領域: {result['detected_domains']}")
        print(f"    情感分析: {result['sentiment']}")
        print(f"    建議: {result['suggestions'][:2]}")  # 只顯示前2個建議
    
    # 測試圖片分析（模擬）
    print("\n🖼️ 測試圖片分析功能:")
    try:
        # 創建一個簡單的測試圖片
        from PIL import Image
        import io
        
        # 創建一個簡單的測試圖片
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        result = analyzer.analyze_image(img_bytes, "4-5歲")
        
        if "error" not in result:
            print("✅ 圖片分析功能正常")
            print(f"   檢測到的活動: {result['detected_activities']}")
            print(f"   發展評估: {len(result['development_assessment'])} 個領域")
            print(f"   建議數量: {len(result['recommendations'])}")
        else:
            print(f"❌ 圖片分析錯誤: {result['error']}")
            
    except Exception as e:
        print(f"⚠️ 圖片分析測試跳過: {e}")

def test_recommendation_system():
    """測試建議生成系統"""
    print("\n=== 測試建議生成系統 ===")
    
    analyzer = ChildGrowthAnalyzer()
    
    # 模擬不同分數的評估結果
    test_assessments = [
        {
            "大運動": {"score": 65, "status": "待加強"},
            "精細動作": {"score": 85, "status": "優秀"},
            "語言能力": {"score": 75, "status": "良好"}
        },
        {
            "大運動": {"score": 90, "status": "優秀"},
            "精細動作": {"score": 70, "status": "良好"}, 
            "語言能力": {"score": 60, "status": "待加強"}
        }
    ]
    
    for i, assessment in enumerate(test_assessments, 1):
        print(f"\n  測試案例 {i}:")
        recommendations = analyzer._generate_recommendations(assessment)
        print(f"    生成的建議 ({len(recommendations)} 條):")
        for j, rec in enumerate(recommendations, 1):
            print(f"      {j}. {rec}")

def main():
    """主測試函數"""
    print("🧪 開始測試童伴成長系統核心模塊...\n")
    
    try:
        test_milestone_database()
        test_ai_analyzer() 
        test_recommendation_system()
        
        print("\n🎉 所有核心模塊測試完成！")
        print("\n📋 下一步:")
        print("  1. 運行主應用: cd phase_3_main_app && streamlit run app.py")
        print("  2. 訪問 http://localhost:8501 查看應用")
        
    except Exception as e:
        print(f"\n❌ 測試過程中出現錯誤: {e}")
        print("\n🔧 故障排除:")
        print("  - 檢查 requirements.txt 是否已安裝")
        print("  - 確認所有文件都在正確位置")
        print("  - 查看具體錯誤訊息進行修復")

if __name__ == "__main__":
    main()