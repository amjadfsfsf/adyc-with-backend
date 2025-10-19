const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
// ✅ غيّر هاي السطر - استخدم process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));


const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const MODEL = process.env.MODEL;




function formatArabicText(text) {
    // إزالة المراجع [1][2]
    text = text.replace(/\[\d+\]/g, '');
    
    // فصل النقاط المرقمة
    text = text.replace(/(\d+\.)\s+/g, '\n\n$1 ');
    
    // فصل النقاط بالشرطة
    text = text.replace(/\s+-\s+/g, '\n- ');
    
    // إضافة سطر بعد النقطتين
    text = text.replace(/:\s*/g, ':\n');
    
    // تنظيف المسافات
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
}


app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      data.choices[0].message.content = formatArabicText(
        data.choices[0].message.content
      );
    }
    
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Running', model: MODEL });
});

// ✅ غيّر app.listen عشان يستخدم 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ADYC Server running on port ${PORT}`);
  console.log(`📡 Model: ${MODEL}`);
});
