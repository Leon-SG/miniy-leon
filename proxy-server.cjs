require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 配置 multer 用于文件上传
const upload = multer();

// 打印环境变量（调试用）
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('ANTHROPIC_API_KEY:', apiKey ? '已设置' : '未设置');
if (!apiKey) {
  console.warn('警告: ANTHROPIC_API_KEY 未设置，将使用默认值');
}

// 测试路由
app.get('/test', (req, res) => {
  console.log('测试路由被访问');
  res.json({ message: 'Server is running!' });
});

// Claude API 代理路由
app.post('/api/claude-store-assistant', async (req, res) => {
  try {
    console.log('[调试] 收到请求:', req.body);
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: req.body.model,
        max_tokens: req.body.max_tokens,
        messages: req.body.messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('[调试] Claude API 原始响应:', response.data);
    
    // 提取内容
    const content = response.data.content[0].text;
    console.log('[调试] 提取的内容:', content);

    // 改进的 JSON 解析逻辑
    let processedResponse = {
      aiMessage: '',
      storeConfig: {},
      aiCard: undefined
    };

    try {
      // 1. 首先尝试直接解析整个内容
      const parsedContent = JSON.parse(content);
      if (parsedContent && typeof parsedContent === 'object') {
        processedResponse = {
          aiMessage: parsedContent.aiMessage || '',
          storeConfig: parsedContent.storeConfig || {},
          aiCard: parsedContent.aiCard
        };
      }
    } catch (parseError) {
      console.log('[调试] 直接解析失败，尝试提取 JSON');
      
      // 2. 尝试提取 JSON 对象
      const jsonRegex = /\{[\s\S]*?\}(?=\s*$|\s*\{)/g;
      const matches = content.match(jsonRegex);
      
      if (matches) {
        for (const match of matches) {
          try {
            const parsedJson = JSON.parse(match);
            if (parsedJson && typeof parsedJson === 'object') {
              // 合并找到的 JSON 对象
              processedResponse = {
                aiMessage: parsedJson.aiMessage || processedResponse.aiMessage,
                storeConfig: {
                  ...processedResponse.storeConfig,
                  ...(parsedJson.storeConfig || {})
                },
                aiCard: parsedJson.aiCard || processedResponse.aiCard
              };
            }
          } catch (matchError) {
            console.log('[调试] 单个 JSON 对象解析失败:', matchError);
            continue;
          }
        }
      }

      // 3. 如果仍然没有找到有效的 JSON，使用原始内容作为 aiMessage
      if (!processedResponse.aiMessage) {
        processedResponse.aiMessage = content;
      }
    }

    // 4. 验证和清理数据
    if (typeof processedResponse.aiMessage !== 'string') {
      processedResponse.aiMessage = JSON.stringify(processedResponse.aiMessage);
    }

    if (typeof processedResponse.storeConfig !== 'object') {
      processedResponse.storeConfig = {};
    }

    console.log('[调试] 最终返回的响应:', processedResponse);
    res.json(processedResponse);
  } catch (error) {
    console.error('[调试] 处理请求时出错:', error);
    res.status(500).json({
      aiMessage: '抱歉，处理您的请求时出现错误。请重试。',
      storeConfig: {},
      aiCard: undefined
    });
  }
});

// 404 处理
app.use((req, res) => {
  console.log('404 - 未找到路由:', req.method, req.url);
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
  console.log('已注册路由:');
  console.log('- GET  /test');
  console.log('- POST /api/claude-store-assistant');
  console.log('服务器启动时间:', new Date().toISOString());
}); 