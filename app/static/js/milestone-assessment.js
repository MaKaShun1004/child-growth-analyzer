// 發展評估專用功能

// 顯示 Likert Scale 問卷評估界面
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
        
        // 添加 Likert Scale 問卷
        skills.forEach((skill, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'likert-question';
            
            // 問題文字
            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.textContent = skill;
            questionDiv.appendChild(questionText);
            
            // Likert Scale (1-5分制)
            const scaleDiv = document.createElement('div');
            scaleDiv.className = 'likert-scale';
            
            // 左側標籤 (做到)
            const leftLabel = document.createElement('div');
            leftLabel.className = 'scale-label left-label';
            leftLabel.textContent = '做到';
            scaleDiv.appendChild(leftLabel);
            
            // 選項容器
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'likert-options';
            
            // 創建 5 個選項，從右到左 (5=強烈同意, 4=同意, 3=中立/不適用, 2=不同意, 1=強烈不同意)
            for (let score = 5; score >= 1; score--) {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'likert-option';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question_${domain}_${index}`;
                // 中立選項 (score=3) 使用特殊值 'N/A'
                radio.value = score === 3 ? 'N/A' : score;
                radio.id = `radio_${domain}_${index}_${score}`;
                radio.dataset.domain = domain;
                radio.dataset.skill = skill;
                
                const label = document.createElement('label');
                label.htmlFor = radio.id;
                label.className = `circle-label score-${score}`;
                
                const circle = document.createElement('span');
                circle.className = 'circle';
                
                label.appendChild(circle);
                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                optionsDiv.appendChild(optionDiv);
            }
            
            scaleDiv.appendChild(optionsDiv);
            
            // 右側標籤 (做不到)
            const rightLabel = document.createElement('div');
            rightLabel.className = 'scale-label right-label';
            rightLabel.textContent = '做不到';
            scaleDiv.appendChild(rightLabel);
            
            questionDiv.appendChild(scaleDiv);
            content.appendChild(questionDiv);
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

// 生成里程碑報告
async function generateMilestoneReport() {
    const childName = document.getElementById('child_name').value;
    const resultsContainer = document.getElementById('milestone-results');
    const generateBtn = document.getElementById('generate-milestone-report');
    
    // 顯示精美的載入動畫
    resultsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="loading-message">正在生成發展評估報告</div>
            <div class="loading-submessage">系統正在分析孩子的發展狀況，請稍候...</div>
        </div>
    `;
    generateBtn.disabled = true;
    
    // 收集所有 Likert Scale 評分
    const skillScores = {};
    const radios = document.querySelectorAll('#milestone-assessment input[type="radio"]:checked');
    
    radios.forEach(radio => {
        const domain = radio.dataset.domain;
        const skill = radio.dataset.skill;
        const value = radio.value;
        
        // 只收集有效分數，跳過 'N/A' (中立/不適用)
        if (value !== 'N/A') {
            const score = parseInt(value);
            
            if (!skillScores[domain]) {
                skillScores[domain] = [];
            }
            skillScores[domain].push({
                skill: skill,
                score: score
            });
        }
    });
    
    try {
        const response = await fetch('/analyze_milestones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: currentAge,
                skill_scores: skillScores
            })
        });
        
        const result = await response.json();
        displayMilestoneResults(result.progress_data, childName);
    } catch (error) {
        console.error('分析失敗:', error);
        resultsContainer.innerHTML = '<div class="warning-box">❌ 生成報告失敗，請重試</div>';
    } finally {
        // 重新啟用按鈕，允許多次生成
        generateBtn.disabled = false;
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
        
        const totalScore = data['總分'];
        const maxScore = data['最高分'];
        const percentage = data['達成度'];
        let statusClass = 'success-box';
        let statusText = '';
        let barClass = '';
        
        // 根據達成度判斷發展狀態
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
        statusBox.innerHTML = `<strong>${data['領域']}</strong>: 總分 ${totalScore}/${maxScore} (達成度 ${percentage}%) - ${statusText}`;
        
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
        const percentage = data['達成度'];
        let suggestion = '';
        let boxClass = '';
        
        if (percentage < 60) {
            boxClass = 'warning-box';
            suggestion = `🚩 <strong>${data['領域']}需要加強</strong><br>建議多進行相關活動訓練，促進技能發展`;
        } else if (percentage >= 90) {
            boxClass = 'success-box';
            suggestion = `✅ <strong>${data['領域']}發展優秀</strong><br>請保持並繼續挑戰更高難度的活動`;
        } else if (percentage >= 80) {
            boxClass = 'success-box';
            suggestion = `👍 <strong>${data['領域']}發展優秀</strong><br>保持良好的發展勢頭`;
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
