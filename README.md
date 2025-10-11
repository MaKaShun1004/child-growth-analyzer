# 童伴成長 - 幼兒發展分析系統 (Flask版本)

## 專案簡介
為3-6歲兒童提供專業的發展評估與個性化成長建議的Web應用系統。

## 技術棧
- **後端**: Flask 3.0
- **前端**: HTML5, CSS3, JavaScript (原生)
- **數據處理**: Pandas, NumPy
- **數據可視化**: Plotly
- **圖片處理**: Pillow

## 專案結構
```
app/
├── flask_app.py          # Flask應用主程式
├── templates/            # HTML模板
│   └── index.html        # 主頁面
├── static/               # 靜態資源
│   ├── css/
│   │   ├── main.css      # 主樣式表
│   │   ├── milestone-assessment.css  # 發展評估樣式
│   │   ├── image-analysis.css        # 圖片分析樣式
│   │   └── growth-report.css         # 成長報告樣式
│   └── js/
│       ├── main.js       # JavaScript核心邏輯
│       ├── milestone-assessment.js   # 發展評估功能
│       ├── image-analysis.js         # 圖片分析功能
│       └── growth-report.js          # 成長報告功能
└── utils/                # 工具模組
    ├── ai_analyzer.py    # AI分析器
    ├── milestone_db.py   # 里程碑數據庫
    └── test_core.py      # 核心測試
```

## 安裝步驟

### 1. 安裝依賴
```bash
pip install -r requirements.txt
```

### 2. 運行應用
```bash
cd app
python app.py
```

### 3. 訪問應用
打開瀏覽器訪問: http://localhost:5000

## 主要功能

### 📊 發展評估
- 根據年齡段（3-6歲）顯示發展里程碑
- 勾選已掌握的技能進行評估
- 生成個性化發展報告和建議

### 🖼️ 圖片分析
- 上傳孩子活動圖片
- AI分析檢測活動類型
- 評估五大發展領域（大運動、精細動作、語言能力、認知能力、社交情感）
- 生成雷達圖和改善建議

### 📈 成長報告
- 綜合發展評估
- 專屬成長方案
- 興趣班選擇建議
- 節費建議

## API端點

### POST /get_milestones
獲取指定年齡的里程碑數據
```json
{
  "age": 4
}
```

### POST /analyze_milestones
分析里程碑掌握情況
```json
{
  "age": 4,
  "mastered_skills": {
    "大運動": ["能單腳跳躍"],
    "精細動作": ["能畫出簡單的人像"]
  }
}
```

### POST /analyze_image
分析上傳的圖片
- 表單數據: image (文件), age_group (字符串)

### POST /generate_report
生成綜合成長報告
```json
{
  "child_name": "小明",
  "child_age": 4
}
```

## 開發說明

### 前端交互
- 標籤頁切換由 JavaScript 控制
- AJAX 請求與後端 API 通信
- 動態渲染分析結果和圖表

### 後端處理
- Flask 路由處理 HTTP 請求
- 使用 ChildGrowthAnalyzer 進行 AI 分析
- Plotly 生成交互式圖表

### 樣式設計
- 響應式設計，支持移動端
- 固定側邊欄顯示基本信息
- 彩色信息框區分不同狀態

## 測試

運行核心模組測試:
```bash
cd app
python utils/test_core.py
```

## 更新日誌

### v2.0 (2025-10-11)
- 從 Streamlit 遷移到 Flask
- 實現前後端分離架構
- 優化 UI/UX 設計
- 移除未使用的依賴（openai）
- 增強響應式設計

### v1.0
- 初始 Streamlit 版本

## 授權
© 2025 童伴成長 - 幼兒發展分析系統