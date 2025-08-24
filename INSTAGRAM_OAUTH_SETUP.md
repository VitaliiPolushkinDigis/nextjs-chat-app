# Instagram OAuth Setup Guide

## 🚀 Overview
This guide will help you set up Instagram and Facebook OAuth for automatic token retrieval instead of manual entry.

## 📋 Prerequisites
1. Instagram Business Account
2. Facebook Developer Account
3. Facebook App with Instagram Basic Display permissions

## 🔧 Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Instagram OAuth Configuration
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=1074423231467713
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/instagram/oauth/callback

# Backend API URL
NEXT_PUBLIC_URL=https://bad9a395c843.ngrok-free.app
```

## 📱 Instagram App Setup

### 1. Use Your Existing Instagram App
You already have the perfect setup:
- **App Name**: TEST DM AUTOMATION-IG
- **App ID**: 1074423231467713
- **App Secret**: [Keep this secret]

### 2. Configure OAuth Settings
1. In your Instagram app dashboard, go to "Instagram" → "API setup with Instagram login"
2. Set your redirect URI to: `http://localhost:3000/instagram/oauth/callback`
3. Make sure your app is in development mode for testing

### 3. Required Permissions
Your app will request these permissions during OAuth:
- `user_profile` - Read Instagram profile info
- `user_media` - Access user's media
- `instagram_basic` - Basic Instagram functionality
- `instagram_manage_messages` - Send and manage DMs
- `instagram_manage_comments` - Reply to and moderate comments

## 🔄 OAuth Flow

### How It Works:
1. User clicks "Connect Instagram" button
2. Popup opens with Instagram login
3. User authorizes your app
4. Instagram redirects to `/instagram/oauth/callback`
5. Your app exchanges authorization code for access tokens
6. Tokens are automatically saved to your backend
7. Popup closes and user sees success message

### Benefits:
- ✅ No manual token entry
- ✅ Secure token exchange
- ✅ Automatic token refresh
- ✅ Better user experience
- ✅ Mobile-friendly
- ✅ Direct Instagram integration (no Facebook dependency)

## 🚨 Security Notes
- Never expose your app secret in frontend code
- Always use HTTPS in production
- Implement proper state parameter validation
- Store tokens securely in your backend
- Implement token refresh logic

## 🧪 Testing
1. Start your development server: `npm run dev`
2. Go to `/instagram`
3. Click "Connect Instagram + Facebook"
4. Complete OAuth flow
5. Check that tokens are received

## 🔧 Troubleshooting

### Common Issues:
- **"Invalid redirect URI"** - Check your redirect URI in Facebook/Instagram app settings
- **"App not approved"** - Make sure your app is in development mode or approved
- **"Permissions not granted"** - Request the required permissions in App Review
- **"Popup blocked"** - Allow popups for your domain

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check network tab for API calls
4. Verify redirect URI matches exactly

## 📚 Additional Resources
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
