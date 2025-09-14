# 🎯 FocusRecap - Your AI Productivity Coach

> *Transform fragmented work sessions into clear, actionable insights with AI-powered screenshot analysis*

An app that helps you increase your productivity while also keeping your spirits up. Track what you did during a certain day with an app that runs seamlessly in the background for however long you want it. At the end of a session, read some words of encouragement, and some ways to improve your workflow (if you choose).


## 🌟 The Problem We're Solving

Ever finish a long work day and think *"What did I actually accomplish?"* You're not alone. 

In our hyper-connected world, we're constantly switching between tasks, apps, and contexts. By the end of the day, it's nearly impossible to remember what we actually did - let alone what we accomplished. This leads to:

- **Lost motivation** from feeling unproductive
- **Missed opportunities** for improvement  
- **Poor work-life balance** from unclear progress tracking
- **Decision fatigue** from fragmented sessions

FocusRecap solves this by becoming your **AI productivity coach** that watches your work patterns and delivers personalized insights.

## 🚀 What Makes FocusRecap Special

### 🧠 **AI-Powered Analysis**
Unlike manual time trackers, FocusRecap uses **OpenAI's GPT** to understand what you're actually working on. It doesn't just count minutes - it analyzes your screen content and provides meaningful feedback.

### 🔒 **Privacy-First Design**
Your screenshots never leave your device. Everything is processed locally, and screenshots are automatically deleted after analysis. We believe productivity tools shouldn't compromise your privacy.

### ⚡ **Zero-Friction Tracking**
No manual logging, no complex setup. Just start monitoring and get insights. FocusRecap works in the background while you focus on what matters.

### 🎯 **Personalized Motivation**
Get GenZ-style motivational messages that actually resonate. No corporate speak - just real, energetic encouragement that keeps you going.

## 🛠️ Tech Stack

### **Frontend & Desktop Framework**
- **Electron** - Cross-platform desktop app framework
- **HTML5/CSS3/JavaScript** - Modern web technologies for the UI
- **Native macOS APIs** - Screen capture and system integration

### **Backend & Processing**
- **Node.js** - JavaScript runtime for the main process
- **SQLite** - Local database for storing settings and metadata
- **Tesseract.js** - OCR engine for text extraction from screenshots
- **Sharp** - High-performance image processing

### **AI & Intelligence**
- **OpenAI GPT-4** - Advanced language model for content analysis
- **Custom prompt engineering** - Tailored prompts for productivity insights
- **Context-aware analysis** - Understanding of user goals and patterns

### **Communication & Integration**
- **Axios** - HTTP client for API communication
- **Nodemailer** - Email delivery system
- **IPC (Inter-Process Communication)** - Secure communication between Electron processes

### **Development & Build**
- **npm/Node.js** - Package management and runtime
- **electron-builder** - App packaging and distribution
- **Git** - Version control and collaboration

## 🚀 Quick Start

### **Option 1: Automated Installation (Recommended)**

```bash
# Clone the repository
git clone https://github.com/Lolli-AK/vibe_coding_motivation_productivity_tool.git
cd vibe_coding_motivation_productivity_tool

# Run the automated installer
chmod +x install.sh
./install.sh
```

The installer will:
- ✅ Check system requirements
- 📦 Install all dependencies
- 📁 Create necessary directories
- 📝 Set up environment configuration
- 🔐 Guide you through permissions

### **Option 2: Manual Installation**

```bash
# Install dependencies
npm install

# Create data directories
mkdir -p data/screenshots assets

# Set up environment
cp env.example .env
# Edit .env with your API keys

# Run the app
npm run dev
```

## ⚙️ Configuration

### **Required Setup**
1. **OpenAI API Key** - Get yours at [platform.openai.com](https://platform.openai.com)
2. **Screen Recording Permission** - Granted automatically on first run

### **Optional Setup**
- **Email Integration** - For summary delivery
- **Custom Goals** - Personal productivity checklists

### **Environment Variables**
```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🎮 How It Works

### **1. Smart Monitoring** 📸
- Captures screenshots every 20 seconds
- Skips sensitive apps (password managers, banking)
- Stores data locally with automatic cleanup

### **2. AI Analysis** 🧠
- Extracts text using OCR
- Analyzes work patterns with GPT-4
- References your personal goals and checklist

### **3. Personalized Insights** 💡
- **Accomplishments**: What you actually achieved
- **What Went Well**: Specific positive reinforcement
- **Areas to Improve**: Actionable suggestions
- **Motivational Boost**: Energetic encouragement

### **4. Flexible Delivery** 📧
- In-app summary display
- Optional email delivery
- Professional boss-ready summaries

## 🔧 Building & Distribution

### **Development**
```bash
npm run dev          # Development mode with hot reload
npm run start        # Production mode
```

### **Building for Distribution**
```bash
npm run build        # Build for current platform
npm run dist         # Create distributable packages
```

### **Publishing Options**
- **GitHub Releases** - Automated via electron-builder
- **Direct Distribution** - DMG/ZIP files
- **App Store** - macOS App Store (requires Apple Developer account)

## 🛡️ Privacy & Security

- **Local Processing**: Screenshots never leave your device
- **Automatic Cleanup**: Files deleted after analysis
- **No Tracking**: No analytics or user data collection
- **Open Source**: Full transparency in code

## 🐛 Troubleshooting

### **Common Issues**

**"Screenshots not capturing"**
- Check Screen Recording permissions in System Preferences
- Ensure no other apps are blocking screen capture

**"AI analysis failing"**
- Verify your OpenAI API key is valid
- Check internet connection
- Ensure you have API credits

**"App won't start"**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (requires 16+)

### **Debug Mode**
```bash
npm run dev -- --debug
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit with clear messages**: `git commit -m "Add amazing feature"`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style
- Add tests for new features
- Update documentation
- Test on multiple macOS versions

## 📈 Roadmap

### **Coming Soon**
- [ ] **Menu Bar Integration** - Quick access and status
- [ ] **Sensitive App Detection** - Auto-pause on private content
- [ ] **Dashboard Analytics** - Visual progress tracking
- [ ] **Team Collaboration** - Shared productivity insights

### **Future Vision**
- [ ] **Mobile Companion** - Cross-device productivity tracking
- [ ] **Offline Mode** - Local AI processing
- [ ] **Custom Templates** - Personalized summary formats
- [ ] **Integration Hub** - Connect with other productivity tools

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the incredible GPT models
- **Electron** team for the amazing desktop framework
- **Tesseract.js** for OCR capabilities
- **The open-source community** for inspiration and tools

---

**Ready to transform your productivity?** 🚀

[Get Started](#-quick-start) | [Report Issues](https://github.com/Lolli-AK/vibe_coding_motivation_productivity_tool/issues) | [Contribute](https://github.com/Lolli-AK/vibe_coding_motivation_productivity_tool/pulls)

*Built with ❤️ for productivity enthusiasts everywhere*
