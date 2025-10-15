import random
from PIL import Image
import pandas as pd

class ChildGrowthAnalyzer:
    """模擬小冰AI的分析功能"""
    
    def analyze_image(self, image_file, age_group):
        """分析上傳的圖片"""
        try:
            image = Image.open(image_file)
            width, height = image.size
            
            analysis_results = {
                "detected_activities": [],
                "development_assessment": {},
                "recommendations": []
            }
            
            # 模擬圖片內容分析
            activity_models = {
                "drawing": ["繪畫", "塗鴉", "寫字"],
                "building": ["堆積木", "拼圖", "手工"],
                "sports": ["跑步", "跳躍", "球類活動"],
                "reading": ["閱讀", "聽故事", "看圖書"]
            }
            
            # 基於圖片特徵模擬檢測
            detected_activities = []
            if width > height:  # 橫向圖片可能為戶外活動
                detected_activities.extend(["戶外活動", "大運動遊戲"])
            else:  # 縱向圖片可能為靜態活動
                detected_activities.extend(["桌面活動", "精細動作"])
            
            # 隨機添加1-2個活動
            all_activities = [act for activities in activity_models.values() for act in activities]
            detected_activities.extend(random.sample(all_activities, min(2, len(all_activities))))
            
            analysis_results["detected_activities"] = list(set(detected_activities))
            
            # 生成發展評估
            domains = ["大運動", "精細動作", "語言能力", "認知能力", "社交情感"]
            for domain in domains:
                score = random.randint(65, 92)
                status = "優秀" if score >= 85 else "良好" if score >= 75 else "待加強"
                
                analysis_results["development_assessment"][domain] = {
                    "score": score,
                    "status": status,
                    "comment": self._generate_domain_comment(domain, score, age_group)
                }
            
            # 生成建議
            analysis_results["recommendations"] = self._generate_recommendations(
                analysis_results["development_assessment"]
            )
            
            return analysis_results
            
        except Exception as e:
            return {"error": f"圖片分析失敗: {str(e)}"}
    
    def _generate_domain_comment(self, domain, score, age_group):
        """生成領域評語"""
        comments = {
            "大運動": {
                "high": "孩子的大肌肉發展良好，動作協調性不錯，繼續保持運動習慣",
                "medium": "大肌肉發展符合基本要求，可加強平衡和協調訓練",
                "low": "建議多進行戶外活動，增強體能發展和身體協調性"
            },
            "精細動作": {
                "high": "精細動作發展優秀，手眼協調能力強，適合進行複雜手工",
                "medium": "精細動作發展正常，可多進行畫畫、手工等活動",
                "low": "建議進行穿珠、拼圖等活動訓練小肌肉發展"
            },
            "語言能力": {
                "high": "語言表達能力優秀，詞彙豐富，溝通順暢",
                "medium": "語言發展正常，可多進行親子閱讀和對話練習",
                "low": "建議多與孩子對話，鼓勵表達，進行語言遊戲"
            },
            "認知能力": {
                "high": "認知能力發展優秀，邏輯思維和問題解決能力強",
                "medium": "認知發展正常，可進行更多思維訓練遊戲",
                "low": "建議進行拼圖、分類等遊戲促進認知發展"
            },
            "社交情感": {
                "high": "社交情感發展優秀，能良好表達和理解情感",
                "medium": "社交情感發展正常，可多安排團體互動",
                "low": "建議多進行角色扮演遊戲，學習表達情感"
            }
        }
        
        level = "high" if score >= 85 else "medium" if score >= 75 else "low"
        return comments.get(domain, {}).get(level, "發展情況正常，繼續保持")
    
    def _generate_recommendations(self, assessment):
        """生成改善建議"""
        recommendations = []
        recommendation_pool = {
            "大運動": [
                "每天進行30分鐘戶外活動，如跑步、跳躍",
                "玩跳房子、丟沙包等傳統遊戲",
                "練習單腳站立，從5秒開始逐漸延長時間",
                "親子一起做簡單的體操或舞蹈"
            ],
            "精細動作": [
                "每天進行15分鐘手工活動，如剪紙、摺紙",
                "練習使用安全剪刀沿直線剪紙",
                "玩穿珠子、堆積木遊戲",
                "練習扣鈕扣、繫鞋帶等生活技能"
            ],
            "語言能力": [
                "每天親子閱讀15-20分鐘",
                "鼓勵孩子描述一天發生的事情",
                "玩『我說你猜』的詞語遊戲",
                "學習簡單的兒歌或童謠"
            ],
            "認知能力": [
                "玩拼圖遊戲，從4塊開始逐漸增加難度",
                "學習分類物品（按顏色、形狀、用途）",
                "進行簡單的記憶遊戲",
                "玩數字和形狀的配對遊戲"
            ],
            "社交情感": [
                "安排與同齡孩子的遊戲約會",
                "教導孩子用語言表達感受",
                "進行角色扮演遊戲",
                "學習輪流和分享的概念"
            ]
        }
        
        for domain, data in assessment.items():
            if data["score"] < 80:
                recs = recommendation_pool.get(domain, [])
                if recs:
                    recommendations.append(random.choice(recs))
        
        # 確保至少有3個建議
        while len(recommendations) < 3:
            all_recs = [rec for recs in recommendation_pool.values() for rec in recs]
            recommendations.append(random.choice(all_recs))
        
        return list(set(recommendations))[:5]
    
    def _generate_text_suggestions(self, domains):
        """基於檢測領域生成建議"""
        base_suggestions = {
            "大運動": "多安排戶外活動時間，發展身體協調性",
            "精細動作": "提供畫筆、積木等工具，訓練手部小肌肉",
            "語言能力": "多與孩子對話，鼓勵表達想法",
            "認知能力": "進行益智遊戲，促進思維發展",
            "社交情感": "安排團體活動，學習人際互動"
        }
        
        return [base_suggestions.get(domain, "保持均衡發展") for domain in domains[:3]]