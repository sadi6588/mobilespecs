import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Terminal, Server, Settings, Shield, Monitor } from "lucide-react";

export default function DeploymentGuide() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2000);
    });
  };

  const commands = {
    oneCommand: `curl -fsSL https://raw.githubusercontent.com/nodejs/docker-node/main/docs/BestPractices.md | bash && sudo apt update && sudo apt install -y nginx nodejs npm git && git clone https://github.com/your-repo/mobilespecs-pro.git && cd mobilespecs-pro && npm install && npm run build && sudo cp -r dist/* /var/www/html/ && sudo systemctl enable nginx && sudo systemctl start nginx`,
    updateSystem: `sudo apt update && sudo apt upgrade -y`,
    installNode: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs`,
    installNginx: `sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx`,
    installPM2: `sudo npm install -g pm2
pm2 startup`,
    cloneProject: `cd /var/www/
sudo git clone https://github.com/your-repo/mobilespecs-pro.git
cd mobilespecs-pro
sudo npm install
sudo npm run build`,
    configureNginx: `sudo nano /etc/nginx/sites-available/mobilespecs
sudo ln -s /etc/nginx/sites-available/mobilespecs /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
    configureFirewall: `sudo ufw allow 'Nginx Full'
sudo ufw enable`,
    memoryOptimization: `sudo raspi-config
# Advanced Options > Memory Split > 128`,
    enableGzip: `# In nginx.conf
gzip on;
gzip_types text/css application/javascript;
gzip_min_length 1000;`,
    checkStatus: `sudo systemctl status nginx`,
    viewLogs: `sudo tail -f /var/log/nginx/error.log`,
    monitorResources: `htop`
  };

  const nginxConfig = `server {
    listen 80;
    server_name your-pi-ip-address;
    root /var/www/mobilespecs-pro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <Server className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="gradient-text">Raspberry Pi</span><br />
              Deployment Guide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete instructions to host MobileSpec Pro on your Raspberry Pi with performance optimization and monitoring.
          </p>
        </div>

        {/* Prerequisites */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Raspberry Pi 4 (4GB+ RAM recommended)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>MicroSD card (32GB+ recommended)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Raspberry Pi OS (latest version)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Internet connection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>SSH access enabled (optional)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Basic Linux command knowledge</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* One-Command Installation */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-secondary" />
              One-Command Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Run this single command to install all required components and deploy the website:
            </p>
            <div className="bg-black rounded-lg p-4 relative">
              <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                {commands.oneCommand}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(commands.oneCommand, 'oneCommand')}
              >
                {copiedCommand === 'oneCommand' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Alert className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                This command will automatically install Node.js, Nginx, clone the repository, build the project, and configure the web server.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Manual Installation Steps */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Manual Installation Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Step 1 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-primary text-primary-foreground mr-3">Step 1</Badge>
                <h3 className="text-lg font-semibold">System Update</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Update your Raspberry Pi OS to the latest version to ensure compatibility and security.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.updateSystem}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.updateSystem, 'updateSystem')}
                >
                  {copiedCommand === 'updateSystem' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-secondary text-secondary-foreground mr-3">Step 2</Badge>
                <h3 className="text-lg font-semibold">Install Node.js & npm</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Install Node.js 18 and npm package manager for building and running the application.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.installNode}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.installNode, 'installNode')}
                >
                  {copiedCommand === 'installNode' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-primary text-primary-foreground mr-3">Step 3</Badge>
                <h3 className="text-lg font-semibold">Install Nginx Web Server</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Install and configure Nginx as the web server to host your application.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.installNginx}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.installNginx, 'installNginx')}
                >
                  {copiedCommand === 'installNginx' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-secondary text-secondary-foreground mr-3">Step 4</Badge>
                <h3 className="text-lg font-semibold">Install PM2 Process Manager</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Install PM2 for process management and automatic restart capabilities.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.installPM2}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.installPM2, 'installPM2')}
                >
                  {copiedCommand === 'installPM2' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 5 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-primary text-primary-foreground mr-3">Step 5</Badge>
                <h3 className="text-lg font-semibold">Clone & Build Project</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Clone the MobileSpec Pro repository and build the production version.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.cloneProject}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.cloneProject, 'cloneProject')}
                >
                  {copiedCommand === 'cloneProject' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 6 */}
            <div>
              <div className="flex items-center mb-4">
                <Badge className="bg-secondary text-secondary-foreground mr-3">Step 6</Badge>
                <h3 className="text-lg font-semibold">Configure Nginx</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Create and enable the Nginx configuration for your application.
              </p>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.configureNginx}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.configureNginx, 'configureNginx')}
                >
                  {copiedCommand === 'configureNginx' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nginx Configuration */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-secondary" />
              Nginx Configuration File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create the following configuration file at <code className="bg-muted px-2 py-1 rounded text-sm">/etc/nginx/sites-available/mobilespecs</code>:
            </p>
            <div className="bg-black rounded-lg p-4 relative">
              <pre className="text-green-400 text-sm overflow-x-auto">
                {nginxConfig}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(nginxConfig, 'nginxConfig')}
              >
                {copiedCommand === 'nginxConfig' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Optimization */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5 text-primary" />
              Performance Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-secondary">Memory Optimization</h4>
                <div className="bg-black rounded-lg p-3 relative">
                  <pre className="text-green-400 text-sm">
                    {commands.memoryOptimization}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(commands.memoryOptimization, 'memoryOptimization')}
                  >
                    {copiedCommand === 'memoryOptimization' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Increase GPU memory split to 128MB for better performance.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-secondary">Enable Gzip Compression</h4>
                <div className="bg-black rounded-lg p-3 relative">
                  <pre className="text-green-400 text-sm">
                    {commands.enableGzip}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(commands.enableGzip, 'enableGzip')}
                  >
                    {copiedCommand === 'enableGzip' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Add these settings to nginx.conf for better compression.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring & Maintenance */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-secondary" />
              Monitoring & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="font-medium">Check System Status:</span>
                  <p className="text-muted-foreground text-sm">Monitor Nginx service status</p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <code className="bg-black text-green-400 px-3 py-1 rounded text-sm">
                    {commands.checkStatus}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(commands.checkStatus, 'checkStatus')}
                  >
                    {copiedCommand === 'checkStatus' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="font-medium">View Error Logs:</span>
                  <p className="text-muted-foreground text-sm">Monitor application errors</p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <code className="bg-black text-green-400 px-3 py-1 rounded text-sm">
                    {commands.viewLogs}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(commands.viewLogs, 'viewLogs')}
                  >
                    {copiedCommand === 'viewLogs' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="font-medium">Monitor Resources:</span>
                  <p className="text-muted-foreground text-sm">Check CPU, memory usage</p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <code className="bg-black text-green-400 px-3 py-1 rounded text-sm">
                    {commands.monitorResources}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(commands.monitorResources, 'monitorResources')}
                  >
                    {copiedCommand === 'monitorResources' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Configuration */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Additional Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <span className="font-medium">Set up static IP address</span>
                  <p className="text-muted-foreground text-sm">Configure a static IP for consistent access to your Pi</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <span className="font-medium">Configure HTTPS with Let's Encrypt</span>
                  <p className="text-muted-foreground text-sm">Secure your application with SSL certificates</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <span className="font-medium">Set up automatic backup scripts</span>
                  <p className="text-muted-foreground text-sm">Create automated backups of your configuration and data</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <span className="font-medium">Configure firewall (optional)</span>
                  <p className="text-muted-foreground text-sm">Set up UFW firewall for additional security</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="font-semibold mb-3 text-secondary">Optional: Configure Firewall</h4>
              <div className="bg-black rounded-lg p-3 relative">
                <pre className="text-green-400 text-sm">
                  {commands.configureFirewall}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(commands.configureFirewall, 'configureFirewall')}
                >
                  {copiedCommand === 'configureFirewall' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4">🎉 Deployment Complete!</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your MobileSpec Pro website is now running on your Raspberry Pi. You can access it through your browser using your Pi's IP address.
            </p>
            <div className="bg-card/50 rounded-lg p-4 inline-block">
              <p className="font-semibold mb-2">Access your website at:</p>
              <code className="text-secondary text-lg">http://your-pi-ip-address</code>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                <Monitor className="mr-2 h-4 w-4" />
                Test Your Site
              </Button>
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
