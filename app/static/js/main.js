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

// 初始化按鈕
function initializeButtons() {
    // 生成里程碑報告
    document.getElementById('generate-milestone-report').addEventListener('click', generateMilestoneReport);
    
    // 分析圖片
    document.getElementById('analyze-image-btn').addEventListener('click', analyzeImage);
    
    // 生成完整報告
    document.getElementById('generate-full-report').addEventListener('click', generateFullReport);
}

