import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TERRA MEN'S CO.",
    short_name: 'Terra',
    description: 'Disciplined luxury grooming fundamentals for skin and beard.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F3ED',
    theme_color: '#F6F3ED',
    icons: [
      {
        src: '/images/logo/logo-dark.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/logo/logo-dark.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Shop All',
        url: '/shop',
        description: 'Browse all Terra grooming formulations',
      },
      {
        name: 'Terra Face Wash',
        url: '/shop/terra-face-wash',
        description: 'Terra Daily Gel Cleanser with Salicylic Acid',
      },
      {
        name: 'Terra Beard Oil',
        url: '/shop/terra-beard-oil',
        description: 'Terra 7-Oil Botanical Beard & Skin Elixir',
      },
    ],
  };
}
