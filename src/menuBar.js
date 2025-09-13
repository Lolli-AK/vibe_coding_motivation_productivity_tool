const { app, BrowserWindow, Menu, ipcMain, dialog, shell, Tray, nativeImage } = require('electron');
const path = require('path');

class MenuBarApp {
  constructor(mainApp) {
    this.mainApp = mainApp;
    this.tray = null;
    this.trayWindow = null;
  }

  createTray() {
    // Create a simple icon (in a real app, you'd have a proper icon file)
    const icon = nativeImage.createFromDataURL('data:image/svg+xml;base64,' + Buffer.from(`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" fill="#667eea"/>
        <circle cx="8" cy="8" r="3" fill="white"/>
      </svg>
    `).toString('base64'));
    
    this.tray = new Tray(icon);
    this.tray.setToolTip('FocusRecap - AI Productivity Tracker');
    
    this.updateTrayMenu();
    
    this.tray.on('click', () => {
      if (this.mainApp.mainWindow) {
        this.mainApp.mainWindow.show();
        this.mainApp.mainWindow.focus();
      }
    });
  }

  updateTrayMenu() {
    const isRecording = this.mainApp.isCapturing;
    const screenshotCount = this.mainApp.screenshots.length;
    
    const template = [
      {
        label: 'FocusRecap',
        enabled: false
      },
      { type: 'separator' },
      {
        label: isRecording ? 'Stop Recording' : 'Start Recording',
        click: () => {
          if (isRecording) {
            this.mainApp.stopScreenshotCapture();
          } else {
            this.mainApp.startScreenshotCapture();
          }
          this.updateTrayMenu();
        }
      },
      {
        label: 'Generate Summary',
        enabled: screenshotCount > 0,
        click: () => {
          this.mainApp.generateSummary();
        }
      },
      { type: 'separator' },
      {
        label: `Status: ${isRecording ? 'Recording' : 'Stopped'}`,
        enabled: false
      },
      {
        label: `Screenshots: ${screenshotCount}/15`,
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Show App',
        click: () => {
          if (this.mainApp.mainWindow) {
            this.mainApp.mainWindow.show();
            this.mainApp.mainWindow.focus();
          }
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ];

    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);
  }
}

module.exports = MenuBarApp;

