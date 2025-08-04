const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno

// Tus rutas y prioridades
const routes = [
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'', priority: '1.00' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/about-us', priority: '0.90' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/contact-us', priority: '0.90' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/search-voucher', priority: '0.90' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/general-conditions', priority: '0.90' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/information-treatment-privacy-policies', priority: '0.90' },
  { loc: process.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+'/invoice', priority: '0.90' },
];

const generateSitemap = () => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => {
      return `<url>
        <loc>${route.loc}</loc>
        <priority>${route.priority}</priority>
      </url>`;
    })
    .join('\n')
  }
</urlset>`;

  
  fs.writeFileSync(path.resolve(__dirname, './dist/sitemap.xml'), sitemapContent);

};

generateSitemap();