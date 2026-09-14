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
      },
      {
        src: '/images/logo/logo-dark.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
