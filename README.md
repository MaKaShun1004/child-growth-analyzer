# 童伴成長 - 幼兒發展分析系統

## 專案簡介
為3-6歲兒童提供專業的發展評估與個性化成長建議的Web應用系統。採用 Likert Scale 問卷評估方式，支援五大發展領域的全面評估。

## 核心功能
- **發展里程碑評估**: 使用 Likert Scale (1-5分制) 問卷系統，評估五大發展領域
- **智能計分系統**: 自動計算總分並生成達成度百分比報告
- **中立選項處理**: 支援「不適用/無法觀察」選項，自動排除在計算之外
- **圖片分析**: AI輔助分析兒童活動照片
- **個性化建議**: 基於評估結果生成專業發展建議
- **綜合成長報告**: 多維度數據可視化呈現

## 技術棧
- **後端**: Flask 3.0, Python 3.12
- **前端**: HTML5, CSS3, JavaScript (原生)
- **數據處理**: Pandas, NumPy
- **數據可視化**: Plotly
- **圖片處理**: Pillow
- **評估系統**: Likert Scale 問卷算法

## 五大發展領域
1. **大肌肉運動 (Gross Motor)** - 評估大動作協調能力
2. **小肌肉運動 (Fine Motor)** - 評估精細動作技巧
3. **語言與溝通 (Language & Communication)** - 評估語言表達與理解能力
4. **認知能力 (Cognitive Skills)** - 評估思維與學習能力
5. **社交與情緒 (Social & Emotional)** - 評估人際互動與情緒管理

## 專案結構
```
child-growth-analyzer/
├── app/
│   ├── run.py                        # Flask應用啟動入口
│   ├── route.py                      # 路由定義
│   ├── test_core.py                  # 核心測試
│   ├── templates/                    # HTML模板
│   │   └── index.html                # 主頁面
│   ├── static/                       # 靜態資源
│   │   ├── css/
│   │   │   ├── main.css              # 主樣式表
│   │   │   ├── milestone-assessment.css  # 發展評估樣式
│   │   │   ├── image-analysis.css    # 圖片分析樣式
│   │   │   └── growth-report.css     # 成長報告樣式
│   │   └── js/
│   │       ├── main.js               # JavaScript核心邏輯
│   │       ├── milestone-assessment.js   # 發展評估功能
│   │       ├── image-analysis.js     # 圖片分析功能
│   │       └── growth-report.js      # 成長報告功能
│   └── utils/                        # 工具模組
│       ├── __init__.py
│       ├── ai_analyzer.py            # AI分析器
│       ├── milestone_db.py           # 里程碑數據庫
│       └── test_core.py              # 核心測試
├── requirements.txt                  # Python依賴套件
├── README.md                         # 專案說明文件
```

## 安裝步驟

### 1. 克隆專案
```bash
git clone https://github.com/MaKaShun1004/child-growth-analyzer.git
cd child-growth-analyzer
```

### 2. 安裝依賴
```bash
pip install -r requirements.txt
```

### 3. 運行應用
```bash
# 方法 1：使用 run.py（推薦）
python app/run.py

# 方法 2：開發模式（自動重載）
cd app
flask --app run --debug run --host=0.0.0.0 --port=5000
```

### 4. 訪問應用
打開瀏覽器訪問: http://localhost:5000
