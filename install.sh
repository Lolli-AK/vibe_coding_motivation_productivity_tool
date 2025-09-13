#!/bin/bash

# FocusRecap Installation Script
echo "🎯 Installing FocusRecap - AI-Powered Productivity Tracking..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    echo "   Or use Homebrew: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/screenshots
mkdir -p assets

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your API keys if you want AI-powered summaries"
fi

# Check for required permissions
echo "🔐 Checking permissions..."
echo "⚠️  Note: FocusRecap requires Screen Recording permission."
echo "   You'll be prompted to grant this permission when you first run the app."

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎉 New Features in FocusRecap:"
echo "   ✨ Three-page navigation system"
echo "   🎊 Confetti celebrations for completed sessions"
echo "   🖱️  Custom drag bar with window controls"
echo "   ⏱️  Countdown timer during monitoring"
echo "   📊 Beautiful summary page with insights"
echo "   🔒 Privacy-first design (screenshots stay local)"
echo ""
echo "🚀 To start FocusRecap:"
echo "   npm start      # Production mode"
echo "   npm run dev    # Development mode"
echo ""
echo "📋 App Features:"
echo "   1. 🎯 Settings Page - Configure timer and daily goals"
echo "   2. 📊 Monitoring Page - Watch countdown and capture progress"
echo "   3. 📈 Summary Page - View AI-generated productivity insights"
echo "   4. 🎊 Confetti celebration when sessions complete"
echo "   5. 🖱️  Drag window by the black bar at the top"
echo ""
echo "⚠️  Important Notes:"
echo "   • Edit .env file with your OpenAI API key for AI summaries"
echo "   • Grant Screen Recording permission when prompted"
echo "   • Screenshots are captured every 20 seconds during monitoring"
echo "   • All data stays on your device for privacy"
echo ""
echo "🎯 Ready to boost your productivity!"
