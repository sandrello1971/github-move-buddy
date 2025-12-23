# Testing the Share Functionality

## Manual Testing Steps

### 1. Deploy to Cloudflare Pages

Follow the instructions in `docs/deployment.md` to deploy the site to Cloudflare Pages.

### 2. Test the Share URL Directly

Visit a share URL in your browser:
```
https://sabadvance.it/share/your-article-slug
```

Expected behavior:
- You should be automatically redirected to the article page
- View the page source - you should see article-specific meta tags

### 3. Test with Facebook Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your share URL: `https://sabadvance.it/share/your-article-slug`
3. Click "Debug"
4. Verify the preview shows:
   - ✓ Correct article title
   - ✓ Article description/excerpt
   - ✓ Featured image (or default image)
   - ✓ Article URL
   - ✓ og:type = "article"

### 4. Test with Twitter Card Validator

1. Go to: https://cards-dev.twitter.com/validator
2. Enter your share URL
3. Verify the preview card displays correctly

### 5. Test with WhatsApp

#### Option A: WhatsApp Web
1. Open WhatsApp Web
2. Send yourself a message with the share URL
3. Wait for the preview to generate
4. Verify it shows the article details

#### Option B: Mobile WhatsApp
1. Share the URL via any method to get it on your phone
2. Send it to yourself or a test contact
3. Verify the preview appears correctly

### 6. Test Cache Busting

If you update an article and the preview doesn't change:

1. Add or update the `v=` parameter:
   ```
   https://sabadvance.it/share/your-article-slug?v=2024-12-23T10:30:00.000Z
   ```

2. Use the current timestamp or the article's `updated_at` value

3. Re-test with the updated URL

### 7. Test Different Articles

Test with articles that have:
- ✓ Featured image
- ✓ No featured image (should use default)
- ✓ Long titles
- ✓ Long descriptions
- ✓ Special characters in title/description

## Automated Testing (Future)

To add automated tests:

1. **Unit Tests** for the Cloudflare Function:
   - Mock the Supabase API
   - Test HTML generation
   - Test error handling

2. **Integration Tests**:
   - Use Playwright or Puppeteer
   - Test the redirect behavior
   - Verify meta tags in the HTML

3. **E2E Tests**:
   - Test the actual crawling behavior
   - Use Facebook's API to test og:image resolution
   - Verify cache control headers

## Troubleshooting

### Preview Not Showing
1. Check if the share URL is accessible
2. Verify the function is deployed correctly
3. Check Cloudflare Pages Functions logs
4. Ensure environment variables are set

### Wrong Preview
1. Clear cache by changing the `v=` parameter
2. Use Facebook Debugger's "Scrape Again" button
3. Check if the post data in Supabase is correct

### Function Errors
1. Check Cloudflare Pages dashboard for errors
2. Verify Supabase credentials in environment variables
3. Test the Supabase query directly
4. Check if the post exists and is published

## Local Testing with Wrangler

For local development testing:

```bash
# Install wrangler
npm install -D wrangler

# Build the project
npm run build

# Run with Cloudflare Pages emulation
npx wrangler pages dev dist

# Test the share URL
# Visit: http://localhost:8788/share/your-article-slug
```

Note: Make sure your `.env` file has the correct Supabase credentials.

## Expected Results

When everything is working correctly:

1. **For Crawlers** (WhatsApp, Facebook, etc.):
   - Fetch `/share/article-slug`
   - Receive HTML with proper OG tags
   - Display rich preview with title, description, image

2. **For Users**:
   - Click on `/share/article-slug`
   - Get redirected to `/blog/article-slug`
   - See the actual article

3. **Page Source** should show:
   ```html
   <meta property="og:title" content="Article Title | Sabadvance" />
   <meta property="og:description" content="Article description..." />
   <meta property="og:image" content="https://..." />
   <meta property="og:type" content="article" />
   ```
