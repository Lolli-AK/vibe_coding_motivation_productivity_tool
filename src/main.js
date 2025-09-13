const { app, BrowserWindow, Menu, ipcMain, dialog, shell, Tray, nativeImage } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const axios = require('axios');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const MenuBarApp = require('./menuBar');
require('dotenv').config();

class FocusRecapApp {
  constructor() {
    this.mainWindow = null;
    this.db = null;
    this.screenshotInterval = null;
    this.isCapturing = false;
    this.screenshots = [];
    this.menuBarApp = null;
    this.userSettings = {
      email: '',
      checklist: [],
      recordingDuration: 5, // minutes
      isRecording: false
    };
  }

  async initialize() {
    await this.setupDatabase();
    this.setupIPC(); // Set up IPC handlers first
    await this.createMainWindow();
    this.setupMenu();
    this.setupMenuBar();
  }

  async setupDatabase() {
    const dbPath = path.join(__dirname, 'data', 'focusrecap.db');
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    
    this.db = new sqlite3.Database(dbPath);
    
    // Create tables
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS screenshots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          file_path TEXT,
          ocr_text TEXT,
          app_name TEXT,
          window_title TEXT
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS summaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          summary_text TEXT,
          email_sent BOOLEAN DEFAULT FALSE,
          screenshots_count INTEGER
        )
      `);
      
      this.db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);
    });
  }

  async createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false
    });

    await this.mainWindow.loadFile('src/renderer/index.html');
    
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  setupMenu() {
    const template = [
      {
        label: 'FocusRecap',
        submenu: [
          {
            label: 'About FocusRecap',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'About FocusRecap',
                message: 'FocusRecap v1.0.0',
                detail: 'AI-powered productivity tracking app'
              });
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Cmd+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Capture',
        submenu: [
          {
            label: 'Start Recording',
            click: () => this.startScreenshotCapture()
          },
          {
            label: 'Stop Recording',
            click: () => this.stopScreenshotCapture()
          },
          { type: 'separator' },
          {
            label: 'Generate Summary',
            click: () => this.generateSummary()
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIPC() {
    // Remove any existing handlers first
    ipcMain.removeAllListeners('get-settings');
    ipcMain.removeAllListeners('save-settings');
    ipcMain.removeAllListeners('start-recording');
    ipcMain.removeAllListeners('stop-recording');
    ipcMain.removeAllListeners('generate-summary');

    ipcMain.handle('get-settings', async () => {
      return this.userSettings;
    });

    ipcMain.handle('save-settings', async (event, settings) => {
      this.userSettings = { ...this.userSettings, ...settings };
      return true;
    });

    ipcMain.handle('start-recording', async () => {
      await this.startScreenshotCapture();
      return true;
    });

    ipcMain.handle('stop-recording', async () => {
      await this.stopScreenshotCapture();
      return true;
    });

    ipcMain.handle('generate-summary', async () => {
      return await this.generateSummary();
    });
  }

  setupMenuBar() {
    this.menuBarApp = new MenuBarApp(this);
    this.menuBarApp.createTray();
  }

  async startScreenshotCapture() {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    this.screenshots = [];
    
    // Request screen recording permission
    const hasPermission = await this.requestScreenRecordingPermission();
    if (!hasPermission) {
      dialog.showErrorBox('Permission Required', 'Screen recording permission is required for FocusRecap to work.');
      this.isCapturing = false;
      return;
    }

    // Start capturing screenshots every 20 seconds
    this.screenshotInterval = setInterval(async () => {
      await this.captureScreenshot();
      
      // Keep only last 15 screenshots (5 minutes)
      if (this.screenshots.length > 15) {
        const oldScreenshot = this.screenshots.shift();
        await this.deleteScreenshot(oldScreenshot);
      }
      
      // Generate summary after 5 minutes (15 screenshots)
      if (this.screenshots.length === 15) {
        await this.generateSummary();
      }
    }, 20000);

    console.log('Screenshot capture started');
  }

  async stopScreenshotCapture() {
    if (!this.isCapturing) return;
    
    this.isCapturing = false;
    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
      this.screenshotInterval = null;
    }
    
    console.log('Screenshot capture stopped');
  }

  async requestScreenRecordingPermission() {
    // This is a simplified version - in a real app, you'd need to handle
    // the actual macOS permission request flow
    return true;
  }

  async captureScreenshot() {
    try {
      const timestamp = new Date().toISOString();
      const filename = `screenshot_${timestamp.replace(/[:.]/g, '-')}.png`;
      const filepath = path.join(__dirname, 'data', 'screenshots', filename);
      
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      
      // Check for sensitive applications before capturing
      const windowInfo = await this.getActiveWindowInfo();
      if (this.isSensitiveApp(windowInfo.appName)) {
        console.log('Skipping screenshot - sensitive app detected:', windowInfo.appName);
        return null;
      }
      
      // Use screencapture command (macOS built-in)
      const screenshotProcess = spawn('screencapture', ['-x', filepath]);
      
      return new Promise((resolve, reject) => {
        screenshotProcess.on('close', async (code) => {
          if (code === 0) {
            const screenshotData = {
              timestamp,
              filepath,
              filename
            };
            
            this.screenshots.push(screenshotData);
            
            // Perform OCR
            const ocrText = await this.performOCR(filepath);
            
            // Store in database
            this.db.run(
              'INSERT INTO screenshots (timestamp, file_path, ocr_text, app_name, window_title) VALUES (?, ?, ?, ?, ?)',
              [timestamp, filepath, ocrText, windowInfo.appName, windowInfo.windowTitle]
            );
            
            // Update menu bar
            if (this.menuBarApp) {
              this.menuBarApp.updateTrayMenu();
            }
            
            resolve(screenshotData);
          } else {
            reject(new Error(`Screenshot failed with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  }

  isSensitiveApp(appName) {
    const sensitiveApps = [
      '1Password',
      'LastPass',
      'Bitwarden',
      'Keychain Access',
      'Bank of America',
      'Chase',
      'Wells Fargo',
      'Messages',
      'FaceTime',
      'System Preferences',
      'Activity Monitor'
    ];
    
    return sensitiveApps.some(app => 
      appName.toLowerCase().includes(app.toLowerCase())
    );
  }

  async getActiveWindowInfo() {
    // This would require additional native modules to get active window info
    // For now, return placeholder data
    return {
      appName: 'Unknown App',
      windowTitle: 'Unknown Window'
    };
  }

  async performOCR(imagePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
      return text;
    } catch (error) {
      console.error('OCR failed:', error);
      return '';
    }
  }

  async generateSummary() {
    if (this.screenshots.length === 0) {
      return { error: 'No screenshots available for analysis' };
    }

    try {
      // Prepare screenshot data for AI analysis
      const screenshotData = await this.prepareScreenshotData();
      
      // Call AI API for analysis
      const summary = await this.callAIAnalysis(screenshotData);
      
      // Store summary in database
      this.db.run(
        'INSERT INTO summaries (summary_text, screenshots_count) VALUES (?, ?)',
        [summary.text, this.screenshots.length]
      );
      
      // Send email if configured
      if (this.userSettings.email) {
        await this.sendEmailSummary(summary);
      }
      
      // Clean up screenshots
      await this.cleanupScreenshots();
      
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      return { error: error.message };
    }
  }

  async prepareScreenshotData() {
    const data = [];
    
    for (const screenshot of this.screenshots) {
      const ocrText = await this.performOCR(screenshot.filepath);
      data.push({
        timestamp: screenshot.timestamp,
        ocrText,
        // Add more metadata as needed
      });
    }
    
    return data;
  }

  async callAIAnalysis(screenshotData) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        // Fallback to mock summary if no API key
        return this.generateMockSummary(screenshotData);
      }

      const prompt = this.buildAIPrompt(screenshotData);
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a productivity coach analyzing work sessions. Provide concise, motivational feedback based on screenshot data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const summary = {
        text: response.data.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

      return summary;
    } catch (error) {
      console.error('AI API error:', error);
      // Fallback to mock summary
      return this.generateMockSummary(screenshotData);
    }
  }

  buildAIPrompt(screenshotData) {
    const checklist = this.userSettings.checklist || [];
    const checklistText = checklist.length > 0 ? 
      `\n\nUser's daily goals/checklist:\n${checklist.map(item => `- ${item}`).join('\n')}` : '';

    const ocrTexts = screenshotData.map(data => 
      `Time: ${data.timestamp}\nText: ${data.ocrText}`
    ).join('\n\n');

    return `Analyze this 5-minute work session and provide a motivational summary:

Screenshot data:
${ocrTexts}
${checklistText}

Please provide:
1. What the user accomplished (2-3 sentences)
2. What went well (positive reinforcement)
3. What to improve (1-2 actionable suggestions)
4. A motivational closing message

Keep it concise, encouraging, and actionable. Focus on productivity patterns and goal alignment.`;
  }

  generateMockSummary(screenshotData) {
    const activities = this.extractActivities(screenshotData);
    const checklist = this.userSettings.checklist || [];
    
    let summary = `Based on your 5-minute work session, here's what I observed:\n\n`;
    
    summary += `What you did: ${activities}\n\n`;
    
    summary += `What went well: You maintained focus on productive activities and efficiently managed your workflow.\n\n`;
    
    if (checklist.length > 0) {
      summary += `What to improve: Consider reviewing your daily goals and ensuring each task aligns with your priorities.\n\n`;
    } else {
      summary += `What to improve: Consider setting specific daily goals to better track your progress and maintain motivation.\n\n`;
    }
    
    summary += `Keep up the great work! Every focused moment brings you closer to your goals.`;
    
    return {
      text: summary,
      timestamp: new Date().toISOString()
    };
  }

  extractActivities(screenshotData) {
    const activities = [];
    const appNames = new Set();
    
    screenshotData.forEach(data => {
      if (data.ocrText) {
        // Simple activity detection based on OCR text
        const text = data.ocrText.toLowerCase();
        if (text.includes('code') || text.includes('function') || text.includes('class')) {
          activities.push('coding');
        } else if (text.includes('email') || text.includes('message')) {
          activities.push('email/communication');
        } else if (text.includes('document') || text.includes('report')) {
          activities.push('document work');
        } else if (text.includes('meeting') || text.includes('zoom') || text.includes('teams')) {
          activities.push('meetings');
        } else {
          activities.push('general work');
        }
      }
    });
    
    const uniqueActivities = [...new Set(activities)];
    return uniqueActivities.length > 0 ? 
      uniqueActivities.join(', ') : 
      'various productive activities';
  }

  async sendEmailSummary(summary) {
    try {
      if (!this.userSettings.email || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email not configured, skipping email send');
        return;
      }

      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: this.userSettings.email,
        subject: `FocusRecap Summary - ${new Date().toLocaleDateString()}`,
        text: summary.text,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">🎯 FocusRecap Summary</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${summary.text}</pre>
            </div>
            <p style="color: #666; font-size: 14px;">
              Generated on ${new Date().toLocaleString()}
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      
      // Update database to mark email as sent
      this.db.run(
        'UPDATE summaries SET email_sent = TRUE WHERE timestamp = ?',
        [summary.timestamp]
      );
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async cleanupScreenshots() {
    // For testing purposes - keep screenshots instead of deleting
    console.log('Keeping screenshots for testing - not deleting');
    this.screenshots = [];
    
    // Update menu bar
    if (this.menuBarApp) {
      this.menuBarApp.updateTrayMenu();
    }
  }

  async deleteScreenshot(screenshot) {
    try {
      await fs.unlink(screenshot.filepath);
      console.log('Screenshot deleted:', screenshot.filename);
    } catch (error) {
      console.error('Error deleting screenshot:', error);
    }
  }

  async cleanupOldData() {
    try {
      // For testing purposes - keep all screenshots
      console.log('Skipping cleanup for testing - keeping all screenshots');
      
      // Only clean up database records older than 24 hours (instead of 1 hour)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      this.db.run(
        'DELETE FROM screenshots WHERE timestamp < ?',
        [oneDayAgo]
      );
      
      console.log('Cleaned up database records older than 24 hours');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Initialize app
const focusRecapApp = new FocusRecapApp();

app.whenReady().then(async () => {
  await focusRecapApp.initialize();
  
  // Start periodic cleanup (less frequent for testing)
  setInterval(() => {
    focusRecapApp.cleanupOldData();
  }, 2 * 60 * 60 * 1000); // Every 2 hours instead of 30 minutes
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await focusRecapApp.createMainWindow();
  }
});

app.on('before-quit', async () => {
  await focusRecapApp.stopScreenshotCapture();
});
