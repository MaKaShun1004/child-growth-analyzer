import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from PIL import Image
import sys
import os

# 添加核心模塊路徑
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'phase_2_core_modules'))

from utils.ai_analyzer import ChildGrowthAnalyzer
from utils.milestone_db import get_milestones_by_age, DEVELOPMENT_MILESTONES

# 頁面設置
st.set_page_config(
    page_title="童伴成長 - 幼兒發展分析系統",
    page_icon="👶",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 初始化AI分析器
@st.cache_resource
def get_analyzer():
    return ChildGrowthAnalyzer()

analyzer = get_analyzer()

# CSS樣式
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #2e86ab;
        margin: 1rem 0;
    }
    .success-box {
        background-color: #d4edda;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #28a745;
    }
    .info-box {
        background-color: #d1ecf1;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #17a2b8;
    }
    .warning-box {
        background-color: #fff3cd;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #ffc107;
    }
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# 主標題
st.markdown('<div class="main-header">👶 童伴成長 - 幼兒發展分析系統</div>', unsafe_allow_html=True)
st.markdown("### 🎯 為3-6歲兒童提供專業的發展評估與個性化成長建議")

# 側邊欄 - 用戶輸入
st.sidebar.header("📋 孩子基本信息")

child_name = st.sidebar.text_input("孩子姓名", placeholder="請輸入孩子姓名")
child_age = st.sidebar.slider("孩子年齡", 3, 6, 4)
child_gender = st.sidebar.selectbox("性別", ["男孩", "女孩"])

# 根據年齡確定年齡組
age_groups = {"3": "3-4歲", "4": "4-5歲", "5": "5-6歲"}
age_group = age_groups.get(str(child_age), "3-4歲")

# 主內容區域
tab1, tab2, tab3 = st.tabs(["📊 發展評估", "🖼️ 圖片分析", " 成長報告"])

with tab1:
    st.header("🎯 發展里程碑評估")
    
    if child_age in [3, 4, 5]:
        milestones = get_milestones_by_age(child_age)
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.markdown('<div class="sub-header">發展目標指標</div>', unsafe_allow_html=True)
            st.markdown('<div class="info-box">以下是您孩子年齡段典型的發展目標：</div>', unsafe_allow_html=True)
            
            for domain, skills in milestones.items():
                with st.expander(f"🔷 {domain}發展指標 ({len(skills)}項)", expanded=True):
                    for i, skill in enumerate(skills, 1):
                        st.write(f"{i}. {skill}")
        
        with col2:
            st.markdown('<div class="sub-header">發展情況記錄</div>', unsafe_allow_html=True)
            st.markdown('<div class="info-box">請根據孩子實際情況勾選已掌握的技能：</div>', unsafe_allow_html=True)
            
            mastered_skills = {}
            progress_data = []
            
            for domain, skills in milestones.items():
                mastered_skills[domain] = []
                st.write(f"**{domain}**")
                
                for skill in skills:
                    if st.checkbox(skill, key=f"check_{domain}_{skill}"):
                        mastered_skills[domain].append(skill)
                
                # 計算掌握百分比
                mastered_count = len(mastered_skills[domain])
                total_count = len(skills)
                percentage = (mastered_count / total_count) * 100 if total_count > 0 else 0
                progress_data.append({
                    "領域": domain,
                    "掌握程度": percentage,
                    "已掌握技能": mastered_count,
                    "總技能數": total_count
                })
            
            if st.button("📊 生成發展報告", type="primary", use_container_width=True):
                if child_name:
                    st.balloons()
                    st.success(f"已為 {child_name} 生成發展評估報告！")
                
                # 顯示進度條
                st.markdown('<div class="sub-header">發展進度概覽</div>', unsafe_allow_html=True)
                
                for data in progress_data:
                    progress_value = data["掌握程度"] / 100
                    if progress_value >= 0.8:
                        st.success(f"**{data['領域']}**: {data['已掌握技能']}/{data['總技能數']} ({data['掌握程度']:.1f}%)")
                    elif progress_value >= 0.6:
                        st.info(f"**{data['領域']}**: {data['已掌握技能']}/{data['總技能數']} ({data['掌握程度']:.1f}%)")
                    else:
                        st.warning(f"**{data['領域']}**: {data['已掌握技能']}/{data['總技能數']} ({data['掌握程度']:.1f}%)")
                    
                    st.progress(progress_value)
                
                # 生成建議
                st.markdown('<div class="sub-header">💡 個性化發展建議</div>', unsafe_allow_html=True)
                
                for data in progress_data:
                    if data["掌握程度"] < 60:
                        st.markdown(f'<div class="warning-box">🚩 **{data["領域"]}需要加強**<br>建議多進行相關活動訓練，促進技能發展</div>', unsafe_allow_html=True)
                    elif data["掌握程度"] > 85:
                        st.markdown(f'<div class="success-box">✅ **{data["領域"]}發展優秀**<br>請保持並繼續挑戰更高難度的活動</div>', unsafe_allow_html=True)
                    else:
                        st.markdown(f'<div class="info-box">💪 **{data["領域"]}發展良好**<br>繼續保持當前的發展節奏</div>', unsafe_allow_html=True)

with tab2:
    st.header("🖼️ 圖片分析評估")
    
    uploaded_file = st.file_uploader(
        "選擇孩子活動圖片", 
        type=['png', 'jpg', 'jpeg'],
        help="上繪畫、手工、運動等活動圖片進行分析"
    )
    
    if uploaded_file is not None:
        col1, col2 = st.columns([1, 1])
        
        with col1:
            # 顯示圖片
            image = Image.open(uploaded_file)
            st.image(image, caption="📸 上傳的活動圖片", use_column_width=True)
            
            # 圖片基本信息
            st.write(f"**圖片信息:** {image.size[0]} x {image.size[1]} 像素")
        
        with col2:
            analysis_placeholder = st.empty()
            
            if st.button("🔍 分析圖片", type="primary", use_container_width=True):
                with st.spinner("AI正在分析圖片內容..."):
                    analysis_result = analyzer.analyze_image(uploaded_file, age_group)
                    
                    if "error" not in analysis_result:
                        analysis_placeholder.success("✅ 分析完成！")
                        
                        # 顯示檢測到的活動
                        st.markdown("#### 🎯 檢測到的活動")
                        for activity in analysis_result["detected_activities"]:
                            st.write(f"• {activity}")
                        
                        # 顯示發展評估
                        st.markdown("#### 📊 發展評估")
                        assessment_data = []
                        for domain, data in analysis_result["development_assessment"].items():
                            assessment_data.append({
                                "發展領域": domain,
                                "評估分數": data["score"],
                                "發展狀態": data["status"],
                                "專家評語": data["comment"]
                            })
                        
                        df = pd.DataFrame(assessment_data)
                        st.dataframe(df, use_container_width=True, hide_index=True)
                        
                        # 顯示雷達圖
                        st.markdown("#### 📈 能力雷達圖")
                        fig = px.line_polar(df, r='評估分數', theta='發展領域', line_close=True)
                        fig.update_traces(fill='toself')
                        fig.update_layout(
                            polar=dict(
                                radialaxis=dict(visible=True, range=[0, 100])
                            ),
                            showlegend=False
                        )
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # 顯示建議
                        st.markdown("#### 💡 改善建議")
                        for i, recommendation in enumerate(analysis_result["recommendations"], 1):
                            st.write(f"{i}. {recommendation}")
                    else:
                        analysis_placeholder.error(f"❌ {analysis_result['error']}")

with tab3:
    st.header("📈 綜合成長報告")
    
    if st.button("🎉 生成完整成長報告", type="primary", use_container_width=True):
        st.balloons()
        
        # 模擬綜合報告數據
        st.markdown(f'<div class="main-header">👶 {child_name}的成長報告</div>', unsafe_allow_html=True)
        
        # 基本信息
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("孩子年齡", f"{child_age}歲")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("評估時間", pd.Timestamp.now().strftime('%Y-%m-%d'))
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col3:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("發展階段", age_group)
            st.markdown('</div>', unsafe_allow_html=True)
        
        # 綜合評估
        st.markdown("---")
        st.markdown("#### 📊 綜合發展評估")
        
        metrics_col1, metrics_col2, metrics_col3, metrics_col4 = st.columns(4)
        
        with metrics_col1:
            st.metric("整體發展指數", "85%", "符合預期")
        
        with metrics_col2:
            st.metric("優勢領域", "語言能力", "+12%")
        
        with metrics_col3:
            st.metric("待加強領域", "大運動", "需關注")
        
        with metrics_col4:
            st.metric("發展速度", "正常", "±0%")
        
        # 詳細建議
        st.markdown("---")
        st.markdown("#### 🎯 專屬成長方案")
        
        advice_col1, advice_col2 = st.columns(2)
        
        with advice_col1:
            st.markdown("##### 🏃 大運動發展建議")
            st.markdown("""
            - **每日活動**: 保證1小時戶外活動時間
            - **遊戲推薦**: 跳房子、丟沙包、三輪車
            - **訓練重點**: 平衡感、協調性、力量控制
            - **親子活動**: 週末公園遊玩、親子運動會
            """)
            
            st.markdown("##### 🎨 精細動作發展建議")
            st.markdown("""
            - **每日活動**: 15-20分鐘手工時間
            - **遊戲推薦**: 穿珠子、拼圖、畫畫
            - **訓練重點**: 手眼協調、小肌肉控制
            - **工具準備**: 安全剪刀、蠟筆、積木
            """)
        
        with advice_col2:
            st.markdown("##### 💬 語言能力發展建議")
            st.markdown("""
            - **每日活動**: 親子閱讀15-20分鐘
            - **遊戲推薦**: 故事接龍、詞語遊戲
            - **訓練重點**: 詞彙量、表達能力
            - **互動技巧**: 多提問、鼓勵描述
            """)
            
            st.markdown("##### 🤝 社交情感發展建議")
            st.markdown("""
            - **社交機會**: 每週安排同齡玩伴
            - **情緒教育**: 認識和表達感受
            - **規則意識**: 學習輪流和分享
            - **獨立能力**: 鼓勵自己完成任務
            """)
        
        # 興趣班建議
        st.markdown("---")
        st.markdown("#### 💡 興趣班選擇建議")
        
        rec_col1, rec_col2 = st.columns(2)
        
        with rec_col1:
            st.markdown('<div class="success-box">', unsafe_allow_html=True)
            st.markdown("##### ✅ 推薦類型")
            st.markdown("""
            - **創意美術班**: 發展想像力和精細動作
            - **故事表達班**: 提升語言能力和自信心
            - **音樂律動班**: 培養節奏感和身體協調
            - **科學探索班**: 激發好奇心和認知能力
            """)
            st.markdown('</div>', unsafe_allow_html=True)
        
        with rec_col2:
            st.markdown('<div class="warning-box">', unsafe_allow_html=True)
            st.markdown("##### ⚠️ 暫緩類型")
            st.markdown("""
            - **競技體育班**: 避免過早專業化訓練
            - **高強度訓練**: 保護身體發育
            - **重複記憶班**: 不利創造力發展
            - **長時間課程**: 注意注意力時長
            """)
            st.markdown('</div>', unsafe_allow_html=True)
        
        st.markdown("---")
        st.markdown("##### 💰 節費建議")
        st.info("""
        **根據當前評估，建議優先投資以下方面：**
        - 優先選擇綜合性、遊戲化的課程
        - 避免同時報讀過多相似類型的興趣班  
        - 充分利用免費資源：圖書館、公園、社區活動
        - 注重家庭親子活動的質量而非課程數量
        """)

# 頁腳
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: gray; padding: 2rem;'>
    <h4>💡 溫馨提示</h4>
    <p>本系統分析結果基於兒童發展里程碑和AI分析，僅供參考和教育目的使用。<br>
    不能替代專業醫療、心理或教育評估。如有疑慮，請咨詢相關專業人士。</p>
    <p>© 2025 童伴成長 - 幼兒發展分析系統</p>
    </div>
    """,
    unsafe_allow_html=True
)