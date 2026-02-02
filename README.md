# 🎥 Live Stream Player

A professional HLS live streaming player with link generation, encryption, and Chrome browser support.

## ✨ Features

- ✅ **HLS.js Integration** - Low latency live streaming
- ✅ **Encrypted Links** - Secure Base64 encoding
- ✅ **Token Support** - JWT authentication
- ✅ **Auto Quality** - Adaptive bitrate streaming
- ✅ **Chrome Compatible** - Works on all modern browsers
- ✅ **Responsive Design** - Mobile & desktop friendly
- ✅ **Error Handling** - Auto-retry mechanism
- ✅ **Clean UI** - Professional interface

---

## 📁 Project Structure

```
live-stream-player/
├── index.html          # Main page (link generator)
├── player.html         # Video player page
├── css/
│   └── style.css      # All styles
├── js/
│   ├── app.js         # Main logic (link generation)
│   └── player.js      # HLS player logic
├── config/
│   └── token.json     # Authentication token storage
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

---

## 🚀 Quick Start

### 1️⃣ **Clone/Download Repository**

```bash
# If using GitHub
git clone https://github.com/yourusername/live-stream-player.git
cd live-stream-player

# Or download ZIP and extract
```

### 2️⃣ **Open in Browser**

Simply open `index.html` in Chrome:

```bash
# On Windows
start index.html

# On Mac
open index.html

# On Linux
xdg-open index.html
```

### 3️⃣ **Use the Application**

1. Paste your M3U8 URL in the input box
2. (Optional) Add authentication token
3. Click "Generate Live Link"
4. Share or open the generated link

---

## 🎬 How It Works

### **Link Generation Flow:**

```
User Input (M3U8 URL) 
    ↓
Validation & Encoding (Base64)
    ↓
Generate Encrypted Link
    ↓
Player Page (Decode & Play)
```

### **Stream Data Format:**

```json
{
  "url": "https://example.cloudfront.net/index_1.m3u8?signature=...",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "timestamp": 1769499321000,
  "generated": "2025-02-02T10:30:00.000Z"
}
```

---

## 🔧 Configuration

### **Edit Token (Optional)**

Update `config/token.json`:

```json
{
  "token": "YOUR_JWT_TOKEN_HERE",
  "description": "Your app authentication token",
  "expires": "2025-12-31"
}
```

### **Player Settings**

Edit `js/player.js` to customize:

```javascript
const PLAYER_CONFIG = {
    retryDelay: 3000,        // Retry delay in ms
    maxRetries: 3,           // Max retry attempts
    updateInterval: 1000,    // Info update interval
    hlsConfig: {
        lowLatencyMode: true,    // Enable low latency
        maxBufferLength: 30,     // Buffer length in seconds
        // ... more HLS.js options
    }
};
```

---

## 🌐 Deployment Options

### **Option 1: GitHub Pages (Free)**

1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch `main` and folder `/` (root)
4. Save and get your link: `https://username.github.io/live-stream-player/`

### **Option 2: Render.com (Free)**

1. Create account on [Render.com](https://render.com)
2. New → Static Site
3. Connect GitHub repo
4. Build Command: (leave empty)
5. Publish Directory: `.`
6. Deploy!

Your link: `https://your-app.onrender.com`

### **Option 3: Vercel/Netlify (Free)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or simply drag-and-drop folder to [Netlify Drop](https://app.netlify.com/drop)

### **Option 4: VPS/Cloud Server**

```bash
# Install nginx
sudo apt update
sudo apt install nginx

# Copy files
sudo cp -r live-stream-player/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx
```

---

## 🔐 Security Notes

### **URL Encryption:**
- Links are Base64 encoded (URL-safe)
- Original URLs are not visible in browser
- Timestamp validation can be added

### **Token Handling:**
- Tokens are stored client-side
- Use HTTPS in production
- Implement server-side validation for production

### **CORS Issues:**
If you face CORS errors, the streaming server must allow your domain:

```
Access-Control-Allow-Origin: *
```

---

## 🐛 Troubleshooting

### **Problem: "Your browser does not support HLS"**
**Solution:** Use Chrome, Firefox, or Safari (latest versions)

### **Problem: Stream not loading**
**Solution:** 
- Check if M3U8 URL is valid
- Verify URL is accessible (open in browser)
- Check browser console for errors

### **Problem: CORS error**
**Solution:**
- Ensure streaming server allows your domain
- Use proxy if needed

### **Problem: Autoplay blocked**
**Solution:**
- Click on video to start playback
- Chrome blocks autoplay with sound by default

---

## 📱 Browser Compatibility

| Browser | Compatibility | Notes |
|---------|---------------|-------|
| Chrome | ✅ Full Support | Recommended |
| Firefox | ✅ Full Support | Works great |
| Safari | ✅ Native HLS | Best for iOS |
| Edge | ✅ Full Support | Chromium-based |
| Opera | ✅ Full Support | Chromium-based |
| IE11 | ❌ Not Supported | Use modern browser |

---

## 🎯 Use Cases

1. **Educational Platforms** - Live lectures & classes
2. **Webinars** - Professional presentations
3. **Events** - Conferences & workshops
4. **Entertainment** - Live shows & performances
5. **Gaming** - Stream gameplay
6. **Security** - CCTV monitoring

---

## 🔄 Updates & Maintenance

### **Regular Updates:**
- HLS.js library (check for updates)
- Browser compatibility fixes
- Security patches

### **Monitoring:**
- Check stream quality
- Monitor viewer count
- Track errors in console

---

## 📊 Performance Optimization

1. **Use CDN** for static files
2. **Enable gzip** compression
3. **Minify CSS/JS** in production
4. **Use WebP images** for assets
5. **Implement caching** headers

---

## 🎓 Learning Resources

- [HLS.js Documentation](https://github.com/video-dev/hls.js/)
- [HLS Streaming Guide](https://www.cloudflare.com/learning/video/what-is-http-live-streaming/)
- [HTML5 Video API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review browser console for errors

---

## 🎉 Credits

Built with:
- [HLS.js](https://github.com/video-dev/hls.js/) - Video streaming
- HTML5, CSS3, JavaScript - Core technologies
- Love ❤️ and Coffee ☕

---

**Made with ❤️ for seamless live streaming**

---

## 🔗 Quick Links

- [Live Demo](#) (Add your deployment URL)
- [GitHub Repository](#) (Add your repo URL)
- [Report Issue](#) (Add issues URL)
- [Documentation](README.md)

---

**Version:** 1.0.0  
**Last Updated:** February 2025  
**Status:** ✅ Production Ready
