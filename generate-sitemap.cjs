const fs = require('fs');
const path = require('path');

// Tus rutas y prioridades
const routes = [
  { loc: 'https://e-commerce.continentalassist.com', priority: '1.00' },
  { loc: 'https://e-commerce.continentalassist.com/about-us', priority: '0.90' },
  { loc: 'https://e-commerce.continentalassist.com/contact-us', priority: '0.90' },
  //{ loc: 'https://e-commerce.continentalassist.com/search-voucher', priority: '0.90' },
  { loc: 'https://e-commerce.continentalassist.com/general-conditions', priority: '0.90' },
  { loc: 'https://e-commerce.continentalassist.com/information-treatment-privacy-policies', priority: '0.90' },
  { loc: 'https://e-commerce.continentalassist.com/invoice', priority: '0.90' },
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