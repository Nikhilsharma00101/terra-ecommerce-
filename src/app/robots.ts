import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terramensco.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/api/*',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'ClaudeBot',
          'Omgilibot',
          'Omgili',
          'FacebookBot',
          'PerplexityBot',
          'cohere-ai',
          'OAI-SearchBot'
        ],
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
