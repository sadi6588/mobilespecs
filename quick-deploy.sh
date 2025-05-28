#!/bin/bash

# Quick Deployment Script for Mobile Device Comparison Website
echo "🚀 Deploying Mobile Device Comparison Website to Raspberry Pi..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
sudo apt install -y nodejs npm nginx git

# Create project directory
sudo mkdir -p /var/www/mobilespecs
sudo chown $USER:$USER /var/www/mobilespecs

# Navigate to project directory
cd /var/www/mobilespecs

echo "✅ Basic setup complete!"
echo ""
echo "To complete deployment:"
echo "1. Copy your project files to /var/www/mobilespecs/"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
echo "Your website will be accessible at http://[your-pi-ip]:5000"