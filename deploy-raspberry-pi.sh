#!/bin/bash

# Mobile Device Comparison Website - Raspberry Pi Deployment Script
# Run this script on your Raspberry Pi to deploy the website

echo "🚀 Starting deployment of Mobile Device Comparison Website..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Install git if not present
sudo apt install git -y

# Create project directory
echo "📁 Creating project directory..."
sudo mkdir -p /var/www/mobilespecs
cd /var/www/mobilespecs

# Copy your project files here (you'll need to upload them first)
# For now, we'll create the basic structure
echo "📋 Setting up project structure..."

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create nginx configuration
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/mobilespecs > /dev/null <<EOL
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable the site
sudo ln -sf /etc/nginx/sites-available/mobilespecs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start services
echo "🔄 Starting services..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl reload nginx

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Basic setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your project files to /var/www/mobilespecs/"
echo "2. Run 'npm install' in the project directory"
echo "3. Start the application with PM2"
echo ""
echo "Your website will be available at: http://[your-pi-ip-address]"