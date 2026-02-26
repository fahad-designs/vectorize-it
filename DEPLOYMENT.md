# VectorPro AI - Deployment Guide for Hostinger

This guide will help you deploy VectorPro AI to Hostinger.

## Prerequisites

- Hostinger account with VPS or Cloud hosting
- Node.js 18+ installed on your server
- Domain name configured (optional)
- Basic knowledge of SSH and command line

## Deployment Options

### Option 1: Static Export (Recommended for Hostinger Shared Hosting)

This option generates a static build that can be deployed on any web server.

**Note:** This option will disable the server-side vectorization API. For full functionality, use Option 2.

#### Steps:

1. **Build the application:**

```bash
bun run build
```

2. **The static files will be in `.next/static`**

3. **Upload to Hostinger:**
   - Use File Manager or FTP to upload the `.next` directory
   - Upload `public` directory contents
   - Upload `package.json`

4. **Configure .htaccess (for Apache):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^(.*)$ /index.html [L]
```

### Option 2: Node.js Server (Recommended for Full Functionality)

This option runs the Next.js server with full API support.

#### Steps:

1. **Prepare your server:**

```bash
# SSH into your Hostinger VPS
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun (recommended for performance)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

2. **Clone or upload your project:**

```bash
# Create directory
mkdir -p /var/www/vectorpro
cd /var/www/vectorpro

# Upload files using Git, SCP, or File Manager
# If using Git:
git clone your-repo-url .
```

3. **Install dependencies:**

```bash
bun install
```

4. **Build the application:**

```bash
bun run build
```

5. **Set up environment variables:**

Create `.env.production`:

```env
NODE_ENV=production
```

6. **Start the application:**

```bash
# For production
bun run start
```

7. **Set up PM2 (Process Manager):**

```bash
# Install PM2 globally
npm install -g pm2

# Start the app with PM2
pm2 start bun --name "vectorpro" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

8. **Configure reverse proxy with Nginx:**

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vectorpro
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/vectorpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Set up SSL with Let's Encrypt:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

## Environment Variables

Create a `.env.local` file in your project root:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# (Optional) Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Performance Optimization

### 1. Enable Compression

Add to your Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
```

### 2. Set Up CDN

Configure a CDN (like Cloudflare) to:
- Serve static assets
- Enable caching
- Provide DDoS protection
- Enable HTTPS

### 3. Optimize Images

The application already uses Sharp for image optimization. Ensure the server has sufficient memory for image processing.

## Monitoring

### Check Application Status:

```bash
pm2 status
pm2 logs vectorpro
```

### Monitor Resources:

```bash
htop
```

### Check Nginx Logs:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Issue: Port 3000 already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 PID
```

### Issue: Build fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
bun install

# Rebuild
bun run build
```

### Issue: API not working

Check if the API route is correctly configured:
- Verify `XTransformPort` query parameter in API calls
- Check server logs for errors
- Ensure Node.js/Bun is running

## Security Best Practices

1. **Keep dependencies updated:**
```bash
bun update
```

2. **Set up firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

3. **Regular backups:**
```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backup/vectorpro-$DATE.tar.gz /var/www/vectorpro
```

```bash
# Make executable and set up cron job
chmod +x backup.sh
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Scaling Considerations

If your application grows, consider:

1. **Load Balancing:** Set up multiple instances behind Nginx
2. **Database:** Add a database for user accounts and conversion history
3. **Queue System:** Use Redis/Bull for processing large files
4. **CDN:** Serve static assets globally
5. **Monitoring:** Set up New Relic or Datadog for application monitoring

## Support

For issues specific to:
- **Hostinger:** Contact Hostinger support
- **Next.js:** Check [Next.js documentation](https://nextjs.org/docs)
- **Bun:** Check [Bun documentation](https://bun.sh/docs)

---

**Deployment completed successfully!** 🎉

Your VectorPro AI application is now live and ready to convert images to SVG vectors.
