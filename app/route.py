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
        """分析里程碑掌握情況"""
        data = request.json
        age = int(data.get('age', 4))
        mastered_skills = data.get('mastered_skills', {})
        
        milestones = get_milestones_by_age(age)
        progress_data = []
        
        for domain, skills in milestones.items():
            mastered = mastered_skills.get(domain, [])
            mastered_count = len(mastered)
            total_count = len(skills)
            percentage = (mastered_count / total_count) * 100 if total_count > 0 else 0
            
            progress_data.append({
                "領域": domain,
                "掌握程度": round(percentage, 1),
                "已掌握技能": mastered_count,
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
