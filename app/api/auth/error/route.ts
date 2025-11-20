import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  // Log the error for debugging
  console.error('[NextAuth Error]:', error);
  
  // Return a proper error page
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Error</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
          }
          .error-box {
            background: #fee;
            border: 2px solid #fcc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <h1>⚠️ Authentication Error</h1>
        <div class="error-box">
          <p><strong>Error:</strong> <code>${error || 'Unknown error'}</code></p>
        </div>
        <p>Please check:</p>
        <ul style="text-align: left;">
          <li>Google OAuth redirect URI is configured correctly</li>
          <li>Environment variables are set in Vercel</li>
          <li>NEXTAUTH_URL matches your deployment URL</li>
        </ul>
        <p><a href="/">← Back to Home</a></p>
      </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
