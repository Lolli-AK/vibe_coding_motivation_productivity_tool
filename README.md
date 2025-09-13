# FocusRecap - AI-Powered Productivity Tracking

## Overview
FocusRecap is a macOS application that automatically captures screenshots of your work every 20 seconds, analyzes them with AI, and provides motivational summaries to help you track and improve your productivity.

## Features
- **Automatic Screenshot Capture**: Takes screenshots every 20 seconds of your active window
- **AI Analysis**: Uses OCR and AI to analyze your work patterns
- **Motivational Summaries**: Provides personalized feedback and encouragement
- **Email Integration**: Optional email delivery of summaries
- **Privacy-First**: All data stored locally, screenshots auto-deleted after analysis
- **Customizable Goals**: Set daily checklists for AI to reference

## Installation

### Prerequisites
- macOS 10.15 or later
- Node.js 16+ and npm
- Screen Recording permission (granted during first run)

### Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

## Usage

### First Time Setup
1. Launch FocusRecap
2. Enter your email address (optional)
3. Set recording duration (default: 5 minutes)
4. Add daily goals/checklist (optional)
5. Click "Start Recording"

### How It Works
1. **Screenshot Capture**: App captures your active window every 20 seconds
2. **Storage**: Screenshots stored locally for 5 minutes (15 screenshots)
3. **AI Analysis**: After 5 minutes, AI analyzes all screenshots
4. **Summary Generation**: Creates personalized summary with:
   - What you accomplished
   - What went well
   - Improvement suggestions
   - Motivational message
5. **Delivery**: Summary shown in-app and optionally emailed
6. **Cleanup**: Screenshots automatically deleted after analysis

### Privacy & Security
- All screenshots stored locally on your device
- Screenshots automatically deleted after analysis
- No data sent to external servers without explicit consent
- Full control over what gets captured and analyzed

## Technical Details

### Architecture
- **Frontend**: Electron renderer process with HTML/CSS/JavaScript
- **Backend**: Electron main process with Node.js
- **Database**: SQLite for local storage
- **OCR**: Tesseract.js for text extraction
- **AI**: Integration with OpenAI API (configurable)
- **Email**: Nodemailer for email delivery

### File Structure
```
src/
├── main.js              # Electron main process
├── preload.js           # Preload script for secure IPC
└── renderer/
    └── index.html       # Main UI

data/
├── focusrecap.db        # SQLite database
└── screenshots/         # Temporary screenshot storage

assets/
└── icon.icns           # App icon
```

### Permissions Required
- **Screen Recording**: Required for screenshot capture
- **File System**: For storing screenshots and database
- **Network**: For AI API calls and email (optional)

## Configuration

### Environment Variables
Create a `.env` file in the project root:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OPENAI_API_KEY=your-openai-api-key
```

### Settings
- Recording duration (1-60 minutes)
- Email notifications (on/off)
- Daily goals/checklist
- AI analysis preferences

## Troubleshooting

### Common Issues
1. **Permission Denied**: Grant Screen Recording permission in System Preferences
2. **Screenshots Not Captured**: Check if another app is blocking screen recording
3. **AI Analysis Fails**: Verify API key and internet connection
4. **Email Not Sent**: Check email credentials and SMTP settings

### Debug Mode
Run with debug logging:
```bash
npm run dev -- --debug
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - see LICENSE file for details

## Roadmap
- [ ] Menu bar integration
- [ ] Sensitive app detection
- [ ] Dashboard with analytics
- [ ] Offline mode
- [ ] Team collaboration features
- [ ] Mobile companion app

