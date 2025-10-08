# 步驟 2: 核心模塊測試指南

## 2.1 測試核心模塊
創建測試文件 `test_core.py`：

```python
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

# 測試文字分析
text_result = analyzer.analyze_text("孩子今天畫了一幅畫，還數數到20", "4-5歲")
print("文字分析結果:", text_result)

print("\n核心模塊測試完成！")