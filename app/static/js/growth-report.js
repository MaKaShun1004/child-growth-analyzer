// 成長報告專用功能

// 生成完整報告
async function generateFullReport() {
    const childName = document.getElementById('child_name').value || '寶寶';
    
    try {
        const response = await fetch('/generate_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                child_name: childName,
                child_age: currentAge
            })
        });
        
        const report = await response.json();
        displayFullReport(report);
    } catch (error) {
        console.error('生成報告失敗:', error);
    }
}

// 顯示完整報告
function displayFullReport(report) {
    const container = document.getElementById('full-report');
    container.innerHTML = '';
    
    // 報告標題
    const title = document.createElement('div');
    title.className = 'main-header';
    title.textContent = `👶 ${report.child_name}的成長報告`;
    container.appendChild(title);
    
    // 基本信息卡片
    const metricsDiv = document.createElement('div');
    metricsDiv.className = 'report-metrics';
    metricsDiv.innerHTML = `
        <div class="metric-card">
            <h4>孩子年齡</h4>
            <p style="font-size: 2rem; color: #1f77b4;">${report.child_age}歲</p>
        </div>
        <div class="metric-card">
            <h4>評估時間</h4>
            <p style="font-size: 1.5rem;">${report.assessment_date}</p>
        </div>
        <div class="metric-card">
            <h4>發展階段</h4>
            <p style="font-size: 1.5rem;">${report.age_group}</p>
        </div>
    `;
    container.appendChild(metricsDiv);
    
    // 綜合評估
    const assessmentSection = document.createElement('div');
    assessmentSection.className = 'report-section';
    assessmentSection.innerHTML = `
        <hr>
        <h3>📊 綜合發展評估</h3>
        <div class="report-metrics" style="grid-template-columns: repeat(4, 1fr);">
            <div class="metric-card">
                <h4>整體發展指數</h4>
                <p style="font-size: 2rem; color: #28a745;">${report.overall_index}</p>
                <small>符合預期</small>
            </div>
            <div class="metric-card">
                <h4>優勢領域</h4>
                <p style="font-size: 1.5rem; color: #1f77b4;">${report.strength_domain}</p>
                <small>+12%</small>
            </div>
            <div class="metric-card">
                <h4>待加強領域</h4>
                <p style="font-size: 1.5rem; color: #ffc107;">${report.improvement_domain}</p>
                <small>需關注</small>
            </div>
            <div class="metric-card">
                <h4>發展速度</h4>
                <p style="font-size: 1.5rem;">${report.development_speed}</p>
                <small>±0%</small>
            </div>
        </div>
    `;
    container.appendChild(assessmentSection);
    
    // 成長方案
    const adviceSection = document.createElement('div');
    adviceSection.className = 'report-section';
    adviceSection.innerHTML = `
        <hr>
        <h3>🎯 專屬成長方案</h3>
        <div class="advice-grid">
            <div class="advice-item">
                <h4>🏃 大運動發展建議</h4>
                <ul>
                    <li><strong>每日活動</strong>: 保證1小時戶外活動時間</li>
                    <li><strong>遊戲推薦</strong>: 跳房子、丟沙包、三輪車</li>
                    <li><strong>訓練重點</strong>: 平衡感、協調性、力量控制</li>
                    <li><strong>親子活動</strong>: 週末公園遊玩、親子運動會</li>
                </ul>
                
                <h4 style="margin-top: 20px;">🎨 精細動作發展建議</h4>
                <ul>
                    <li><strong>每日活動</strong>: 15-20分鐘手工時間</li>
                    <li><strong>遊戲推薦</strong>: 穿珠子、拼圖、畫畫</li>
                    <li><strong>訓練重點</strong>: 手眼協調、小肌肉控制</li>
                    <li><strong>工具準備</strong>: 安全剪刀、蠟筆、積木</li>
                </ul>
            </div>
            
            <div class="advice-item">
                <h4>💬 語言能力發展建議</h4>
                <ul>
                    <li><strong>每日活動</strong>: 親子閱讀15-20分鐘</li>
                    <li><strong>遊戲推薦</strong>: 故事接龍、詞語遊戲</li>
                    <li><strong>訓練重點</strong>: 詞彙量、表達能力</li>
                    <li><strong>互動技巧</strong>: 多提問、鼓勵描述</li>
                </ul>
                
                <h4 style="margin-top: 20px;">🤝 社交情感發展建議</h4>
                <ul>
                    <li><strong>社交機會</strong>: 每週安排同齡玩伴</li>
                    <li><strong>情緒教育</strong>: 認識和表達感受</li>
                    <li><strong>規則意識</strong>: 學習輪流和分享</li>
                    <li><strong>獨立能力</strong>: 鼓勵自己完成任務</li>
                </ul>
            </div>
        </div>
    `;
    container.appendChild(adviceSection);
    
    // 興趣班建議
    const classSection = document.createElement('div');
    classSection.className = 'report-section';
    classSection.innerHTML = `
        <hr>
        <h3>💡 興趣班選擇建議</h3>
        <div class="advice-grid">
            <div class="success-box">
                <h4>✅ 推薦類型</h4>
                <ul style="list-style: none; padding-left: 0;">
                    <li>• <strong>創意美術班</strong>: 發展想像力和精細動作</li>
                    <li>• <strong>故事表達班</strong>: 提升語言能力和自信心</li>
                    <li>• <strong>音樂律動班</strong>: 培養節奏感和身體協調</li>
                    <li>• <strong>科學探索班</strong>: 激發好奇心和認知能力</li>
                </ul>
            </div>
            
            <div class="warning-box">
                <h4>⚠️ 暫緩類型</h4>
                <ul style="list-style: none; padding-left: 0;">
                    <li>• <strong>競技體育班</strong>: 避免過早專業化訓練</li>
                    <li>• <strong>高強度訓練</strong>: 保護身體發育</li>
                    <li>• <strong>重複記憶班</strong>: 不利創造力發展</li>
                    <li>• <strong>長時間課程</strong>: 注意注意力時長</li>
                </ul>
            </div>
        </div>
        
        <hr style="margin-top: 30px;">
        <h4>💰 節費建議</h4>
        <div class="info-box">
            <strong>根據當前評估，建議優先投資以下方面：</strong>
            <ul>
                <li>優先選擇綜合性、遊戲化的課程</li>
                <li>避免同時報讀過多相似類型的興趣班</li>
                <li>充分利用免費資源：圖書館、公園、社區活動</li>
                <li>注重家庭親子活動的質量而非課程數量</li>
            </ul>
        </div>
    `;
    container.appendChild(classSection);
}
