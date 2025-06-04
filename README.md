# 🧠 SmartNote AI (Web Version)

**SmartNote AI** is an intelligent, user-friendly, privacy-first, multilingual note-taking web application.  
Built with **Next.js**, **Firebase**, and **Gemini AI**, it offers rich note editing, AI-enhanced organization, and voice support – all designed to help you write smart, think faster, and stay organized.

🔗 **Live Demo**: [https://smart-note-ai-one.vercel.app](https://smart-note-ai-one.vercel.app)

---

## ✨ Features

### ✅ Core
- 📝 Rich note editor with markdown & text formatting  
- 📌 Create, edit, delete, pin & archive notes  
- 🔎 Tag-based filtering, fast search & categorization  
- 📱 Responsive UI for desktop, tablet & mobile  

### 🤖 AI-Powered Tools (Gemini API)
- 🔍 **Summarization**: Convert long notes into bullet points  
- 🧠 **Auto Titles**: Generate note titles automatically  
- 🌐 **Translation**: Bengali, English, Spanish, and more  
- 🎙️ **Voice Input**: Voice-to-text via Web Speech API / Whisper  
- 🏷️ **AI Tagging**: Smart categorization with suggested tags  

### 🔐 Privacy & Security
- 🔐 Firebase Auth: Google & Email sign-in  
- 👤 Local-only anonymous mode (optional)  
- 🧬 Biometric-ready structure (future-ready)  

### 🕒 Reminders
- ⏰ Schedule local or push notifications for notes  

### ☁️ Sync & Backup
- 🔄 Cloud sync using Firebase Firestore  
- 📶 Offline-first architecture (IndexedDB)  
- 📤 Export to Google Drive / PDF (Coming soon)  

### 🎨 UI/UX
- 🎨 Material UI + Tailwind CSS hybrid  
- 🌙 Light & Dark theme toggle  
- 🌀 Smooth animations (Framer Motion)  
- 📱 PWA support (Add to Home Screen)  

---

## 🧪 Tech Stack

| Layer        | Stack                                      |
|--------------|---------------------------------------------|
| Frontend     | Next.js 14 (App Router)                     |
| Styling      | Tailwind CSS + Material UI + Framer Motion |
| Auth & DB    | Firebase Auth, Firestore, FCM               |
| AI           | Gemini API (Google AI Studio)               |
| Speech Input | Web Speech API / Whisper API               |
| Offline      | IndexedDB                                   |
| Hosting      | Vercel                                      |

---

### 📂 Project Structure
---
/SmartNote-AI
├── app/ # Next.js App Router
│ ├── notes/ # Notes UI & Logic
│ └── auth/ # Authentication flows
├── components/ # Reusable UI components
├── lib/ # Firebase, Gemini, DB clients
├── utils/ # Formatters, constants, helpers
├── public/ # Static assets
├── styles/ # Tailwind and global styles
├── .env.local # Environment variables (excluded)

---

### 🚀 Getting Started

⚙️ Configuration
রুট ডিরেক্টরিতে .env.local ফাইল তৈরি করুন এবং নিচের ভেরিয়েবলগুলো সেট করুন:

---
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
🔧 Firebase সেটআপ: https://firebase.google.com
---
🔑 Gemini API কী সংগ্রহ: https://makersuite.google.com
---
▶️ Run Locally
---
npm run dev
তারপর ব্রাউজারে যান: http://localhost:3000
---
📦 Build & Deploy
প্রোডাকশন বিল্ড তৈরি করতে:
---

npm run build
GitHub-এ কোড পুশ করে Vercel Dashboard থেকে ডিপ্লয় করুন।
---
## 📸 Screenshots

শীঘ্রই যুক্ত করা হবে...
আপনি চাইলে নিজস্ব স্ক্রিনশট বা ভিডিও যুক্ত করতে পারেন।
---
##  👤 Author
---
মোহাম্মদ শেখ শাহিনুর রহমান
CTO, IT AMADERSOMAJ INC


---
📃 License
MIT License — Free to use, fork, and customize.
---
“Write smart. Organize better. Let AI help you think.” — SmartNote AI
---

