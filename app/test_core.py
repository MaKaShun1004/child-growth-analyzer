from utils.milestone_db import get_milestones_by_age
from utils.ai_analyzer import ChildGrowthAnalyzer

# 測試里程碑數據庫
print("=== 測試里程碑數據庫 ===")
milestones = get_milestones_by_age(4)
for domain, skills in milestones.items():
    print(f"{domain}: {len(skills)} 項技能")

# 測試AI分析器
print("\n=== 測試AI分析器 ===")
analyzer = ChildGrowthAnalyzer()

print("\n核心模塊測試完成！")