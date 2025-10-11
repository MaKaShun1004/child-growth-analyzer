// 發展評估專用功能

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
