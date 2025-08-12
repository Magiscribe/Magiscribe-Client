import { Plugin } from 'vite';

/**
 * Vite plugin to inject meta tags from config into index.html
 */
export function injectMetaTags(): Plugin {
  return {
    name: 'inject-meta-tags',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const domain = process.env.VITE_APP_DOMAIN || 'magiscribe.com';
        const baseUrl = process.env.VITE_APP_BASE_URL || 'https://magiscribe.com';
        const title = process.env.VITE_APP_META_TITLE || 'Magiscribe';
        const description = process.env.VITE_APP_META_DESCRIPTION || 'Reduce daily standups by 40% with AI-powered inquiry system. Spend more time developing and less time in meetings.';
        const ogImagePath = process.env.VITE_APP_META_OG_IMAGE || '/og-banner.png';
        const ogImage = ogImagePath.startsWith('http') ? ogImagePath : `${baseUrl}${ogImagePath}`;

        return html
          .replace(/{{DOMAIN}}/g, domain)
          .replace(/{{BASE_URL}}/g, baseUrl)
          .replace(/{{TITLE}}/g, title)
          .replace(/{{DESCRIPTION}}/g, description)
          .replace(/{{OG_IMAGE}}/g, ogImage);
      },
    },
  };
}
