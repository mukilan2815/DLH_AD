# 🔧 Configuration Guide

## Environment Variables

All configuration is done via environment variables. Edit `.env.local` on your VPS:

```bash
nano .env.local
```

---

## 📱 Facebook Pixel Setup

### Step 1: Get Your Pixel ID
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Click **"Events Manager"** 
3. Select or create a **Data Source** (Web)
4. Copy your **Pixel ID** (8-12 digit number)

### Step 2: Add to Environment
Edit `.env.local` and add:

```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

Replace `YOUR_PIXEL_ID_HERE` with your actual pixel ID. For example:

```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=800307272889568
```

### Step 3: Restart the App
```bash
cd /var/www/DLH_AD
pm2 restart dlh-ad --update-env
```

### Step 4: Verify It's Working
1. Visit your website
2. Go to Facebook Events Manager
3. Check the **"Test Events"** tab
4. You should see a **PageView** event

---

## ✅ What Gets Tracked

- **PageView** - Automatically tracked when users visit
- **Form Submission** - Can be added to track registrations (optional)
- **Lead** - Can be added to track form submissions as leads

---

## 📊 Why Facebook Pixel?

✅ Track visitor behavior on your website  
✅ Create audiences for retargeting ads  
✅ Measure campaign conversion  
✅ Improve ad targeting  
✅ Understand your audience better

---

## 🔒 Security Note

- The Pixel ID is **intentionally public** (starts with `NEXT_PUBLIC_`)
- It's safe to expose - no sensitive data is leaked
- Your Pixel ID is already visible in Facebook Business Manager

---

## 🐛 Troubleshooting

**Not seeing events in Facebook?**
- Check the Pixel ID is correct
- Wait 5-10 minutes (events take time to appear)
- Check browser console for errors (`F12 → Console`)
- Ensure `.env.local` file was updated
- Restart the app with `pm2 restart dlh-ad --update-env`

**Want to disable tracking?**
- Remove the `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` line from `.env.local`
- Restart the app

---

## 📝 Summary of Files

- **`.env.local`** - Store your environment variables here (VPS only)
- **`.env.example`** - Example file showing available variables
- **`app/FacebookPixel.tsx`** - Pixel tracking component
- **`app/layout.tsx`** - Where pixel is initialized

---

## 💡 Next Steps

1. Get your Facebook Pixel ID
2. Add it to `.env.local` on your VPS
3. Restart the app
4. Test in Facebook Events Manager
5. Monitor conversions in Facebook Ads Manager

---

**Need help?** Check your `.env.example` file for the format.
