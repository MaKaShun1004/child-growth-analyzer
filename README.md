# 童伴成長 - 幼兒發展分析系統

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
python app/run.py
```

### 3. 訪問應用
打開瀏覽器訪問: http://localhost:5000
