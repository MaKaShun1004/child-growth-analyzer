from flask import render_template, request, jsonify
import pandas as pd
import plotly.express as px
from datetime import datetime

from utils.ai_analyzer import ChildGrowthAnalyzer
from utils.milestone_db import get_milestones_by_age

# 初始化AI分析器
analyzer = ChildGrowthAnalyzer()

def register_routes(app):
    """註冊所有路由"""
    
    @app.route('/')
    def index():
        """主頁面"""
        return render_template('index.html')

    @app.route('/get_milestones', methods=['POST'])
    def get_milestones():
        """獲取指定年齡的里程碑數據"""
        data = request.json
        age = int(data.get('age', 4))
        milestones = get_milestones_by_age(age)
        return jsonify(milestones)

    @app.route('/analyze_milestones', methods=['POST'])
    def analyze_milestones():
        """分析里程碑掌握情況 - 使用 Likert Scale 評分，計算總分，排除中立/不適用選項"""
        data = request.json
        age = int(data.get('age', 4))
        skill_scores = data.get('skill_scores', {})
        
        milestones = get_milestones_by_age(age)
        progress_data = []
        
        for domain, skills in milestones.items():
            # 獲取該領域的所有評分（已排除 N/A）
            domain_scores = skill_scores.get(domain, [])
            
            if len(domain_scores) > 0:
                # 計算總分數（只計算有效分數，不包含中立/不適用）
                total_score = sum(item['score'] for item in domain_scores)
                
                # 計算最大可能分數（有效評估數 × 5）
                max_possible_score = len(domain_scores) * 5
                
                # 計算達成度百分比
                achievement_percentage = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
                
                # 計算評估技能數和總技能數
                assessed_count = len(domain_scores)
                total_count = len(skills)
            else:
                # 如果該領域沒有有效評分（全部為 N/A 或未評分），設為0
                total_score = 0
                max_possible_score = 0
                achievement_percentage = 0
                assessed_count = 0
                total_count = len(skills)
            
            progress_data.append({
                "領域": domain,
                "總分": total_score,
                "最高分": max_possible_score,
                "達成度": round(achievement_percentage, 1),
                "已評估技能": assessed_count,
                "總技能數": total_count
            })
        
        return jsonify({
            "progress_data": progress_data,
            "success": True
        })

    @app.route('/analyze_image', methods=['POST'])
    def analyze_image():
        """分析上傳的圖片"""
        if 'image' not in request.files:
            return jsonify({"error": "未上傳圖片"}), 400
        
        file = request.files['image']
        age_group = request.form.get('age_group', '3-4歲')
        
        if file.filename == '':
            return jsonify({"error": "未選擇圖片"}), 400
        
        try:
            # 分析圖片
            analysis_result = analyzer.analyze_image(file, age_group)
            
            if "error" in analysis_result:
                return jsonify(analysis_result), 400
            
            # 生成雷達圖數據
            assessment_data = []
            for domain, data in analysis_result["development_assessment"].items():
                assessment_data.append({
                    "發展領域": domain,
                    "評估分數": data["score"],
                    "發展狀態": data["status"],
                    "專家評語": data["comment"]
                })
            
            # 創建雷達圖
            df = pd.DataFrame(assessment_data)
            fig = px.line_polar(df, r='評估分數', theta='發展領域', line_close=True)
            fig.update_traces(fill='toself')
            fig.update_layout(
                polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                showlegend=False,
                height=400
            )
            
            # 轉換圖表為JSON
            radar_chart = fig.to_json()
            
            return jsonify({
                "detected_activities": analysis_result["detected_activities"],
                "assessment_data": assessment_data,
                "recommendations": analysis_result["recommendations"],
                "radar_chart": radar_chart,
                "success": True
            })
            
        except Exception as e:
            return jsonify({"error": f"圖片分析失敗: {str(e)}"}), 500

    @app.route('/generate_report', methods=['POST'])
    def generate_report():
        """生成綜合成長報告"""
        data = request.json
        child_name = data.get('child_name', '寶寶')
        child_age = int(data.get('child_age', 4))
        
        age_groups = {"3": "3-4歲", "4": "4-5歲", "5": "5-6歲"}
        age_group = age_groups.get(str(child_age), "3-4歲")
        
        report_data = {
            "child_name": child_name,
            "child_age": child_age,
            "age_group": age_group,
            "assessment_date": datetime.now().strftime('%Y-%m-%d'),
            "overall_index": "85%",
            "strength_domain": "語言能力",
            "improvement_domain": "大運動",
            "development_speed": "正常"
        }
        
        return jsonify(report_data)
