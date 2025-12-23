# Fix for WhatsApp and Social Media Link Previews

## Problem
When sharing article links on WhatsApp, Facebook, or other social media platforms, only the generic sabadvance.it preview is shown instead of the specific article preview with proper title, description, and featured image.

## Root Cause
This application is a Single Page Application (SPA) built with React and Vite. When social media crawlers (WhatsApp, Facebook, Twitter, etc.) try to preview a link, they:
1. Fetch the HTML directly from the server
2. DO NOT execute JavaScript
3. Only read the static HTML meta tags

Since this is an SPA, the server always returns the same `index.html` file with generic meta tags, regardless of which article URL is being accessed. The React code that renders specific article meta tags only runs in the browser after JavaScript executes.

## Solution Implemented

### 1. Share URL Pattern
The application uses a special `/share/:slug` URL pattern for social sharing:
- Example: `https://sabadvance.it/share/article-slug`
- With cache-busting: `https://sabadvance.it/share/article-slug?v=2024-12-23T10:30:00.000Z`

### 2. Cloudflare Pages Function
A Cloudflare Pages Function is implemented at `functions/share/[slug].ts` that:
- Intercepts requests to `/share/:slug`
- Fetches the post data from Supabase
- Generates an HTML page with proper Open Graph and Twitter Card meta tags
- Includes the article's title, description, and featured image
- Automatically redirects users to the actual article page at `/blog/:slug`

### 3. Social Share Component
The `SocialShare` component (already implemented) uses these `/share/:slug` URLs when sharing to:
- WhatsApp
- Facebook
- Twitter
- Clipboard (for manual sharing)

## How It Works

1. **User shares an article**: The share buttons use `https://sabadvance.it/share/{slug}` URLs
2. **Crawler visits the share URL**: Social media crawlers fetch the `/share/{slug}` page
3. **Function generates HTML**: The Cloudflare Pages Function dynamically generates HTML with proper meta tags
4. **Crawler reads meta tags**: The crawler sees the article-specific title, description, and image
5. **User is redirected**: Real users visiting the share URL are automatically redirected to the actual article

## Deployment Requirements

### For Cloudflare Pages
1. Deploy the site to Cloudflare Pages
2. The `functions/` directory will automatically be recognized
3. Environment variables are automatically available from the project settings
4. The function will handle `/share/*` routes

### For Other Platforms
If deploying to Netlify or similar platforms, you may need to:
1. Convert the Cloudflare Pages Function to a Netlify Function
2. Ensure the `_redirects` file is properly configured
3. Set up environment variables in the platform settings

## Testing

### Test with Facebook Debugger
1. Go to https://developers.facebook.com/tools/debug/
2. Enter your share URL: `https://sabadvance.it/share/your-article-slug`
3. Click "Debug" to see how Facebook sees your page
4. Verify that the correct title, description, and image appear

### Test with WhatsApp
1. Send a share URL to yourself or a test contact
2. Wait for WhatsApp to generate the preview
3. Verify the preview shows the article title, description, and image

### Clear Cache
If the preview doesn't update after changes:
1. Facebook: Use the "Scrape Again" button in the debugger
2. WhatsApp: Add or change the `v=` parameter in the URL to bust the cache
3. Example: `?v=2024-12-23T10:30:00.000Z`

## Files Involved

- `functions/share/[slug].ts` - Cloudflare Pages Function that generates meta tags
- `src/components/SocialShare.tsx` - React component using the share URLs
- `public/_redirects` - Routing configuration for SPA fallback
- `public/_headers` - Caching headers configuration

## Recent Fixes (December 2024)

### HTML Code Display Issue
**Problem**: When sharing links on social media, the page was showing raw HTML code instead of rendering properly.

**Root Cause**: The Supabase Edge Function (`og-meta`) was returning HTML as a string, which some clients/proxies were interpreting as plain text instead of HTML content.

**Solution**: Modified the Edge Function to explicitly encode the HTML string as a byte array using `TextEncoder()` before returning the response. This ensures:
- The Content-Type header is properly respected by all clients
- The response body is correctly interpreted as a byte array representing UTF-8 encoded HTML
- Social media crawlers render the HTML instead of displaying raw code

**Files Changed**:
- `supabase/functions/og-meta/index.ts` - Added explicit byte encoding of HTML response

## Alternative Solutions (Not Implemented)

Other approaches that could work but were not chosen:

1. **Server-Side Rendering (SSR)**: Convert to Next.js or similar - major architectural change
2. **Static Site Generation**: Pre-render all article pages - doesn't work well for dynamic content
3. **Prerender.io**: Third-party service - additional cost and complexity
4. **Custom Express Server**: Add a Node.js server - more infrastructure to maintain

The Cloudflare Pages Function approach is the minimal-change solution that works within the existing architecture.
