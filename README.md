# FocusRecap - AI-Powered Productivity Tracking

## Overview
FocusRecap is a macOS application that automatically captures screenshots of your work every 20 seconds, analyzes them with AI, and provides motivational summaries to help you track and improve your productivity. Features a beautiful three-page navigation system with confetti celebrations!

## ✨ Features

### 🎯 Three-Page Navigation System
- **Settings Page**: Configure timer duration and daily goals
- **Monitoring Page**: Real-time countdown timer with progress tracking
- **Summary Page**: AI-generated insights with celebration animations

### 🎊 Celebration Features
- **Confetti animations** when sessions complete
- **Motivational messages** for different completion scenarios
- **Beautiful UI** with smooth page transitions

### 🔧 Core Functionality
- **Automatic Screenshot Capture**: Takes screenshots every 20 seconds
- **AI Analysis**: Uses OCR and AI to analyze your work patterns
- **Motivational Summaries**: Provides personalized feedback and encouragement
- **Privacy-First**: All data stored locally, screenshots auto-deleted after analysis
- **Customizable Goals**: Set daily checklists for AI to reference

### 🖱️ Enhanced UI
- **Custom drag bar** with window controls (close, minimize, maximize)
- **Frameless window** with modern design
- **Responsive layout** that adapts to different screen sizes
- **Loading states** and smooth animations

## 🚀 Installation

### Quick Setup
```bash
# Make install script executable and run it
chmod +x install.sh
./install.sh
```

### Manual Installation

#### Prerequisites
- macOS 10.15 or later
- Node.js 16+ and npm
- Screen Recording permission (granted during first run)

#### Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

## 📱 Usage

### First Time Setup
1. Launch FocusRecap
2. Set recording duration (minutes and seconds)
3. Add daily goals/checklist (optional)
4. Click "Start Monitoring"

### How It Works
1. **Settings Page**: Configure your session duration and goals
2. **Monitoring Page**: Watch the countdown timer as screenshots are captured
3. **Summary Page**: View AI-generated insights with confetti celebration

### Navigation
- **Drag the window** using the black bar at the top
- **Window controls** on the left: red (close), yellow (minimize), green (maximize)
- **Automatic transitions** between pages during monitoring
- **Return to main** button on summary page

## 🎯 App Flow

```
Settings Page → Start Monitoring → Monitoring Page → Summary Page → Return to Main
     ↓              ↓                    ↓               ↓              ↓
  Configure      Auto-save         Countdown        AI Analysis    Back to start
   timer &       settings          & screenshots    & confetti     for next session
   goals         & start           every 20s        celebration
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file (copy from `env.example`):
```bash
# Optional: For AI-powered summaries
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo

# Optional: For email summaries
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Settings
- **Recording Duration**: Set custom timer (minutes + seconds)
- **Daily Goals**: Add tasks for AI to reference in summaries
- **Privacy**: All data stays on your device

## 🎊 Celebrations

The app celebrates your productivity achievements with:
- **🎉 Session Complete!** - When auto-generated summary is ready
- **🎉 Great Work!** - When you manually stop monitoring
- **🎯 Time's Up! Great Job!** - When timer automatically completes

## 🛠️ Development

### Available Scripts
```bash
npm start      # Production mode
npm run dev    # Development mode
npm run build  # Build for distribution
npm run dist   # Create distributable package
```

### Project Structure
```
src/
├── main.js              # Main Electron process
├── preload.js           # IPC bridge
├── menuBar.js           # Menu bar functionality
└── renderer/
    └── index.html       # Three-page UI with confetti
```

## 🔒 Privacy & Security

- **Local Storage**: All screenshots stored locally on your device
- **Auto-Cleanup**: Screenshots automatically deleted after analysis
- **No Cloud**: No data sent to external servers without your consent
- **Permissions**: Only requires Screen Recording permission

## 🎯 Tips for Best Results

1. **Set Clear Goals**: Add specific tasks to your daily checklist
2. **Consistent Sessions**: Use the same duration for comparable results
3. **Review Summaries**: Use insights to improve your productivity patterns
4. **Celebrate Wins**: Enjoy the confetti celebrations as motivation!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Happy Productivity Tracking!

FocusRecap helps you stay motivated and track your progress with beautiful UI, AI insights, and celebration animations. Start monitoring your productivity today!