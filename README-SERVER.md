# ADYC Chatbot - Backend Server

## 📋 متطلبات التشغيل

1. **Node.js** - لازم يكون مثبت عندك (تحميل من: https://nodejs.org/)

## 🚀 خطوات التشغيل

### 1. تثبيت المكتبات
افتح Terminal/Command Prompt في مجلد المشروع واكتب:

```bash
npm install
```

### 2. تشغيل السيرفر
بعد ما تخلص التثبيت، شغل السيرفر:

```bash
npm start
```

أو للتطوير (مع إعادة تشغيل تلقائية):

```bash
npm run dev
```

### 3. افتح الموقع
السيرفر رح يشتغل على: `http://localhost:3000`

افتح ملف `index.html` في المتصفح وجرب الشات بوت!

## ✅ التأكد من عمل السيرفر

افتح المتصفح واكتب:
```
http://localhost:3000/health
```

لازم تشوف: `{"status":"Server is running!"}`

## 🔧 حل المشاكل

### مشكلة: "npm not found"
- تأكد إنك نزلت Node.js من: https://nodejs.org/
- أعد تشغيل Terminal بعد التثبيت

### مشكلة: "Port 3000 already in use"
- غير رقم PORT في ملف server.js
- أو أوقف البرنامج اللي مستخدم port 3000

### مشكلة: "CORS error"
- تأكد إن السيرفر شغال
- تأكد إنك غيرت API_ENDPOINT في index.html إلى: http://localhost:3000/api/chat

## 📝 ملاحظات

- API Key موجود في server.js
- لو بدك تغير الـ key، غيره في ملف server.js
- السيرفر لازم يكون شغال عشان الشات يشتغل
