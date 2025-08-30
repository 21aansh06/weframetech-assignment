import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
        </noscript>
        
        {/* Critical CSS inlining would go here in production */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - above the fold styles */
            body { margin: 0; font-family: Inter, system-ui, sans-serif; }
            .loading { display: flex; align-items: center; justify-content: center; height: 100vh; }
          `
        }} />
      </Head>
      <body>
        {/* Loading fallback */}
        <div id="loading" className="loading">
          <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full"></div>
        </div>
        
        <Main />
        <NextScript />
        
        {/* Remove loading screen when React hydrates */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const loading = document.getElementById('loading');
              if (loading) loading.style.display = 'none';
            });
          `
        }} />
      </body>
    </Html>
  );
}