# Deployment Configuration

## Cloudflare Pages Setup

This project is configured to work with Cloudflare Pages to provide proper Open Graph meta tags for social media link previews.

### Required Configuration

1. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

2. **Environment Variables**:
   Set these in your Cloudflare Pages project settings:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anonymous/public key
   - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

   These values are available in your `.env` file locally.

3. **Functions**:
   - The `functions/` directory contains Cloudflare Pages Functions
   - These are automatically deployed with your site
   - No additional configuration needed

### Deployment Steps

1. **Connect your repository**:
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your GitHub repository

2. **Configure build settings**:
   - Framework preset: None (or Vite)
   - Build command: `npm run build`
   - Build output: `dist`

3. **Set environment variables**:
   - Go to Settings > Environment variables
   - Add the variables listed above
   - Apply to both Production and Preview environments

4. **Deploy**:
   - Save and deploy
   - Cloudflare will automatically build and deploy your site
   - The `/share/:slug` routes will be handled by the Functions

### Verifying the Setup

After deployment, test the share functionality:

1. **Check a share URL**:
   ```
   https://sabadvance.it/share/your-article-slug
   ```
   - Should redirect to the article page
   - Should show proper meta tags when viewed as HTML source

2. **Test with Facebook Debugger**:
   ```
   https://developers.facebook.com/tools/debug/
   ```
   - Enter your share URL
   - Verify correct title, description, and image appear

3. **Test with WhatsApp**:
   - Share a link with yourself
   - Verify the preview shows article details

## Alternative Platforms

### Netlify

If deploying to Netlify instead of Cloudflare Pages:

1. Convert the Cloudflare Pages Function to a Netlify Function:
   - Move `functions/share/[slug].ts` to `netlify/functions/share.ts`
   - Update the function signature to match Netlify's API

2. Update `_redirects`:
   ```
   /share/:slug  /.netlify/functions/share?slug=:slug  200
   /*            /index.html                            200
   ```

### Vercel

For Vercel deployment:

1. Convert to Vercel Serverless Functions (API Routes)
2. Create `api/share/[slug].ts` with similar logic
3. Update build configuration in `vercel.json`

## Troubleshooting

### Previews not updating
- WhatsApp and Facebook cache previews
- Change the `v=` parameter in the URL to bust the cache
- Use Facebook's "Scrape Again" button

### Function not working
- Check Cloudflare Pages Functions logs
- Verify environment variables are set correctly
- Ensure Supabase URL and key are valid

### 404 errors on share URLs
- Verify the Functions directory is being deployed
- Check the function file name matches `[slug].ts`
- Review Cloudflare Pages build logs

## Local Development

For local development with Functions:

1. Install Wrangler (Cloudflare CLI):
   ```bash
   npm install -D wrangler
   ```

2. Run locally with Pages Functions:
   ```bash
   npm run build
   npx wrangler pages dev dist
   ```

3. The share URLs will be available at:
   ```
   http://localhost:8788/share/article-slug
   ```

Note: Make sure your `.env` file has the correct Supabase credentials for local testing.
