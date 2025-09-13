#!/bin/bash

# FocusRecap Installation Script
echo "🎯 Installing FocusRecap..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

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
    echo "⚠️  Please edit .env file with your API keys and email settings"
fi

# Check for required permissions
echo "🔐 Checking permissions..."
echo "⚠️  Note: FocusRecap requires Screen Recording permission."
echo "   You'll be prompted to grant this permission when you first run the app."

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start FocusRecap:"
echo "   npm run dev    # Development mode"
echo "   npm start      # Production mode"
echo ""
echo "📧 Don't forget to:"
echo "   1. Edit .env file with your API keys"
echo "   2. Grant Screen Recording permission when prompted"
echo "   3. Configure your email settings (optional)"
echo ""
echo "🎯 Happy productivity tracking!"

