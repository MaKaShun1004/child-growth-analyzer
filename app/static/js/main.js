// 全局狀態
let currentAge = 4;
let currentMilestones = {};
let uploadedImage = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAgeSlider();
    loadMilestones();
    initializeImageUpload();
    initializeButtons();
});

// 標籤頁切換
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // 移除所有active類
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加active類到當前標籤
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// 年齡滑塊
function initializeAgeSlider() {
    const ageSlider = document.getElementById('child_age');
    const ageDisplay = document.getElementById('age_display');
    
    ageSlider.addEventListener('input', function() {
        currentAge = parseInt(this.value);
        ageDisplay.textContent = currentAge;
        loadMilestones();
    });
}

// 載入里程碑數據
async function loadMilestones() {
    try {
        const response = await fetch('/get_milestones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ age: currentAge })
        });
        
        const milestones = await response.json();
        currentMilestones = milestones;
        
        displayMilestoneAssessment(milestones);
    } catch (error) {
        console.error('載入里程碑失敗:', error);
    }
}

// 顯示合併的里程碑評估界面
function displayMilestoneAssessment(milestones) {
    const container = document.getElementById('milestone-assessment');
    container.innerHTML = '';
    
    Object.entries(milestones).forEach(([domain, skills]) => {
        const domainDiv = document.createElement('div');
        domainDiv.className = 'milestone-domain';
        
        const header = document.createElement('div');
        header.className = 'milestone-header';
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                🔷 <strong>${domain}</strong>
                <span style="color: #666; font-weight: normal; font-size: 0.9rem;">(${skills.length}項技能)</span>
            </div>
            <span class="toggle-icon">▼</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'milestone-content';
        content.style.display = 'block';
        
        // 添加技能列表
        skills.forEach((skill, index) => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'milestone-skill';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `check_${domain}_${skill}`;
            checkbox.value = skill;
            checkbox.dataset.domain = domain;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = skill;
            
            skillDiv.appendChild(checkbox);
            skillDiv.appendChild(label);
            content.appendChild(skillDiv);
        });
        
        header.addEventListener('click', () => {
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
            header.querySelector('.toggle-icon').textContent = isVisible ? '▶' : '▼';
        });
        
        domainDiv.appendChild(header);
        domainDiv.appendChild(content);
        container.appendChild(domainDiv);
    });
}

// 更新領域進度指示器 (保留函數以防將來使用)
function updateDomainProgress(domainDiv, domain, totalSkills) {
    // 函數保留但不再使用
}

// 初始化按鈕
function initializeButtons() {
    // 生成里程碑報告
    document.getElementById('generate-milestone-report').addEventListener('click', generateMilestoneReport);
    
    // 分析圖片
    document.getElementById('analyze-image-btn').addEventListener('click', analyzeImage);
    
    // 生成完整報告
    document.getElementById('generate-full-report').addEventListener('click', generateFullReport);
}

// 生成里程碑報告
async function generateMilestoneReport() {
    const childName = document.getElementById('child_name').value;
    
    // 收集已勾選的技能
    const masteredSkills = {};
    const checkboxes = document.querySelectorAll('#milestone-assessment input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const domain = checkbox.dataset.domain;
        if (!masteredSkills[domain]) {
            masteredSkills[domain] = [];
        }
        masteredSkills[domain].push(checkbox.value);
    });
    
    try {
        const response = await fetch('/analyze_milestones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: currentAge,
                mastered_skills: masteredSkills
            })
        });
        
        const result = await response.json();
        displayMilestoneResults(result.progress_data, childName);
    } catch (error) {
        console.error('分析失敗:', error);
    }
}

// 顯示里程碑分析結果
function displayMilestoneResults(progressData, childName) {
    const container = document.getElementById('milestone-results');
    container.innerHTML = '';
    
    if (childName) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-box';
        successMsg.textContent = `✅ 已為 ${childName} 生成發展評估報告！`;
        container.appendChild(successMsg);
    }
    
    const header = document.createElement('div');
    header.className = 'sub-header';
    header.textContent = '發展進度概覽';
    container.appendChild(header);
    
    progressData.forEach(data => {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'progress-item';
        
        const percentage = data['掌握程度'];
        let statusClass = 'success-box';
        let statusText = '';
        let barClass = '';
        
        if (percentage >= 80) {
            statusClass = 'success-box';
            statusText = '發展優秀';
            barClass = '';
        } else if (percentage >= 60) {
            statusClass = 'info-box';
            statusText = '發展良好';
            barClass = 'medium';
        } else {
            statusClass = 'warning-box';
            statusText = '需要加強';
            barClass = 'low';
        }
        
        const statusBox = document.createElement('div');
        statusBox.className = statusClass;
        statusBox.innerHTML = `<strong>${data['領域']}</strong>: ${data['已掌握技能']}/${data['總技能數']} (${percentage}%) - ${statusText}`;
        
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = `progress-bar ${barClass}`;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
        
        progressBarContainer.appendChild(progressBar);
        progressDiv.appendChild(statusBox);
        progressDiv.appendChild(progressBarContainer);
        container.appendChild(progressDiv);
    });
    
    // 顯示建議
    const suggestionsHeader = document.createElement('div');
    suggestionsHeader.className = 'sub-header';
    suggestionsHeader.textContent = '💡 個性化發展建議';
    container.appendChild(suggestionsHeader);
    
    progressData.forEach(data => {
        const percentage = data['掌握程度'];
        let suggestion = '';
        let boxClass = '';
        
        if (percentage < 60) {
            boxClass = 'warning-box';
            suggestion = `🚩 <strong>${data['領域']}需要加強</strong><br>建議多進行相關活動訓練，促進技能發展`;
        } else if (percentage > 85) {
            boxClass = 'success-box';
            suggestion = `✅ <strong>${data['領域']}發展優秀</strong><br>請保持並繼續挑戰更高難度的活動`;
        } else {
            boxClass = 'info-box';
            suggestion = `💪 <strong>${data['領域']}發展良好</strong><br>繼續保持當前的發展節奏`;
        }
        
        const suggestionBox = document.createElement('div');
        suggestionBox.className = boxClass;
        suggestionBox.innerHTML = suggestion;
        container.appendChild(suggestionBox);
    });
}

// 初始化圖片上傳
function initializeImageUpload() {
    const fileInput = document.getElementById('image-upload');
    const analyzeBtn = document.getElementById('analyze-image-btn');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadedImage = file;
            
            // 顯示預覽
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('image-preview');
                preview.innerHTML = `
                    <img src="${event.target.result}" alt="預覽圖片">
                    <p><strong>圖片信息:</strong> ${file.name}</p>
                `;
            };
            reader.readAsDataURL(file);
            
            // 啟用分析按鈕
            analyzeBtn.disabled = false;
        }
    });
}

// 分析圖片
async function analyzeImage() {
    if (!uploadedImage) {
        alert('請先上傳圖片');
        return;
    }
    
    const ageGroups = {"3": "3-4歲", "4": "4-5歲", "5": "5-6歲", "6": "5-6歲"};
    const ageGroup = ageGroups[currentAge.toString()] || "3-4歲";
    
    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('age_group', ageGroup);
    
    const resultsContainer = document.getElementById('image-results');
    resultsContainer.innerHTML = '<div class="loading"></div> AI正在分析圖片內容...';
    
    try {
        const response = await fetch('/analyze_image', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.error) {
            resultsContainer.innerHTML = `<div class="warning-box">❌ ${result.error}</div>`;
            return;
        }
        
        displayImageResults(result);
    } catch (error) {
        console.error('分析失敗:', error);
        resultsContainer.innerHTML = '<div class="warning-box">❌ 分析失敗，請重試</div>';
    }
}

// 顯示圖片分析結果
function displayImageResults(result) {
    const container = document.getElementById('image-results');
    container.innerHTML = '';
    
    // 成功消息
    const successMsg = document.createElement('div');
    successMsg.className = 'success-box';
    successMsg.textContent = '✅ 分析完成！';
    container.appendChild(successMsg);
    
    // 檢測到的活動
    const activitiesHeader = document.createElement('h4');
    activitiesHeader.textContent = '🎯 檢測到的活動';
    container.appendChild(activitiesHeader);
    
    const activitiesList = document.createElement('ul');
    activitiesList.className = 'activity-list';
    result.detected_activities.forEach(activity => {
        const li = document.createElement('li');
        li.textContent = `• ${activity}`;
        activitiesList.appendChild(li);
    });
    container.appendChild(activitiesList);
    
    // 發展評估表格
    const assessmentHeader = document.createElement('h4');
    assessmentHeader.textContent = '📊 發展評估';
    container.appendChild(assessmentHeader);
    
    const table = document.createElement('table');
    table.className = 'assessment-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>發展領域</th>
                <th>評估分數</th>
                <th>發展狀態</th>
                <th>專家評語</th>
            </tr>
        </thead>
        <tbody>
            ${result.assessment_data.map(data => `
                <tr>
                    <td>${data['發展領域']}</td>
                    <td>${data['評估分數']}</td>
                    <td>${data['發展狀態']}</td>
                    <td>${data['專家評語']}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.appendChild(table);
    
    // 雷達圖
    const radarHeader = document.createElement('h4');
    radarHeader.textContent = '📈 能力雷達圖';
    container.appendChild(radarHeader);
    
    const radarDiv = document.createElement('div');
    radarDiv.id = 'radar-chart';
    container.appendChild(radarDiv);
    
    // 繪製雷達圖
    const radarData = JSON.parse(result.radar_chart);
    Plotly.newPlot('radar-chart', radarData.data, radarData.layout);
    
    // 改善建議
    const recommendationsHeader = document.createElement('h4');
    recommendationsHeader.textContent = '💡 改善建議';
    container.appendChild(recommendationsHeader);
    
    const recommendationsList = document.createElement('ol');
    recommendationsList.className = 'recommendation-list';
    result.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    container.appendChild(recommendationsList);
}

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
