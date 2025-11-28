import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates og:image and twitter:image meta tags
 * to point to the app's opengraph image with the correct domain.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      
      if (baseUrl) {
        log('[meta-images] updating meta image tags to:', `${baseUrl}/opengraph.png`);
        
        // Replace og:image with absolute URL using the deployment domain
        html = html.replace(
          /<meta\s+property="og:image"\s+content="\/opengraph\.[^"]*"\s*\/>/g,
          `<meta property="og:image" content="${baseUrl}/opengraph.png" />`
        );

        // Replace twitter:image with absolute URL using the deployment domain
        html = html.replace(
          /<meta\s+name="twitter:image"\s+content="\/opengraph\.[^"]*"\s*\/>/g,
          `<meta name="twitter:image" content="${baseUrl}/opengraph.png" />`
        );
      } else {
        log('[meta-images] no deployment domain found, keeping relative paths');
      }

      return html;
    },
  };
}

function getDeploymentUrl(): string | null {
  // Vercel deployment
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'https';
    const url = `${protocol}://${process.env.VERCEL_URL}`;
    log('[meta-images] using Vercel domain:', url);
    return url;
  }

  // Replit deployment
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    const url = `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN}`;
    log('[meta-images] using Replit internal app domain:', url);
    return url;
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    const url = `https://${process.env.REPLIT_DEV_DOMAIN}`;
    log('[meta-images] using Replit dev domain:', url);
    return url;
  }

  return null;
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
}
