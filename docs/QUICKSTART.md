# Quick Start: Deploying the WhatsApp Preview Fix

This is a **5-minute deployment guide** for getting social media link previews working.

## Prerequisites

- ✅ Cloudflare account (free tier is fine)
- ✅ GitHub repository connected
- ✅ Supabase project credentials

## Deployment Steps

### 1. Connect to Cloudflare Pages (2 minutes)

1. Go to https://pages.cloudflare.com/
2. Click **"Create a project"**
3. Select **"Connect to Git"**
4. Choose your GitHub repository: `sandrello1971/github-move-buddy`
5. Click **"Begin setup"**

### 2. Configure Build Settings (1 minute)

```
Framework preset:     None (or select Vite)
Build command:        npm run build
Build output:         dist
Root directory:       /
```

Click **"Save and Deploy"**

### 3. Set Environment Variables (1 minute)

In Cloudflare Pages dashboard:
1. Go to **Settings → Environment variables**
2. Add these variables:

```bash
VITE_SUPABASE_URL=https://nzpawvhmjetdxcvvbwbi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...your_key...
VITE_SUPABASE_PROJECT_ID=nzpawvhmjetdxcvvbwbi
```

3. Apply to **both** Production and Preview
4. Click **"Save"**

### 4. Redeploy (30 seconds)

1. Go to **Deployments** tab
2. Click **"Retry deployment"** or make a new commit

### 5. Test (1 minute)

#### Quick Test
Visit: `https://your-site.pages.dev/share/test-slug`
- Should redirect to blog post (or show 404 if slug doesn't exist)

#### Full Test with Facebook
1. Go to https://developers.facebook.com/tools/debug/
2. Enter: `https://sabadvance.it/share/actual-article-slug`
3. Click **"Debug"**
4. Verify you see:
   - ✅ Article title
   - ✅ Article description
   - ✅ Featured image

#### Test with WhatsApp
1. Send yourself a message with a share URL
2. Wait for preview to generate
3. Verify article details appear

## Troubleshooting

### Preview Not Showing?

**Problem**: WhatsApp shows generic preview
**Solution**: 
1. Make sure you're using the `/share/` URL format
2. Clear cache: Add `?v=2024-12-23` to URL
3. Wait 30 seconds for WhatsApp to generate preview

### Function Not Working?

**Problem**: 404 error on `/share/` URLs
**Solution**:
1. Check that `functions/` folder was deployed
2. Verify environment variables are set
3. Check Cloudflare Pages Functions logs

### Wrong Article Showing?

**Problem**: Preview shows different article
**Solution**:
1. Verify the slug in the URL matches the post
2. Check that post status is 'published' in Supabase
3. Clear cache with `?v=` parameter

## Verification Checklist

After deployment, verify:
- [ ] Build completed successfully
- [ ] Environment variables are set
- [ ] `/share/article-slug` URLs work
- [ ] Facebook Debugger shows correct meta tags
- [ ] WhatsApp preview displays properly
- [ ] Users are redirected correctly

## Custom Domain (Optional)

If using a custom domain:

1. In Cloudflare Pages → **Settings → Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `sabadvance.it`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## Monitoring

Check function performance:
1. Cloudflare Pages dashboard
2. **Functions** tab
3. View:
   - Invocation count
   - Error rate
   - Execution time

## Next Steps

1. ✅ Deploy to production
2. ✅ Test with real articles
3. ✅ Share on social media
4. ✅ Monitor engagement improvements

## Support

For issues:
- Check `docs/deployment.md` for detailed guide
- Check `docs/testing-share-functionality.md` for testing help
- Review Cloudflare Functions logs
- Test with Facebook Debugger

## Expected Results

**Before**: Generic site preview
**After**: Rich article preview with title, description, and image

Enjoy better social media engagement! 🚀
