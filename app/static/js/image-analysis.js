// 圖片分析專用功能

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
    resultsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="loading-message">AI正在分析圖片內容</div>
            <div class="loading-submessage">識別活動類型並評估發展領域...</div>
        </div>
    `;
    
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
