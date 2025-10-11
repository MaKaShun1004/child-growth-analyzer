from flask import Flask
import sys
import os

# 添加核心模塊路徑
sys.path.append(os.path.dirname(__file__))

from route import register_routes

app = Flask(__name__)
app.secret_key = 'child-growth-analyzer-secret-key-2025'

# 註冊路由
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
