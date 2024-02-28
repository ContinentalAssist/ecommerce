import type { RequestHandler } from "@builder.io/qwik-city";
// import { isDev } from "@builder.io/qwik/build";
 
export const onRequest: RequestHandler = event => {
    // if (isDev) return; // Will not return CSP headers in dev mode

    const nonce = Date.now().toString(36); // Your custom nonce logic here
    event.sharedMap.set("@nonce", nonce);

    const csp = [
        // `default-src 'self' 'unsafe-inline'`,
        // `font-src 'self'`,
        // `img-src 'self' 'unsafe-inline' data:`,
        // `script-src 'self' 'unsafe-inline' https: 'nonce-${nonce}' 'strict-dynamic' 'nonce-random-nonce-value'`,
        // `style-src 'self' 'unsafe-inline'`,
        // `frame-src 'self' 'nonce-${nonce}'`,
        // `object-src 'none'`,
        // `base-uri 'self'`,
        "default-src 'self'",
        "font-src 'self' https: https://ka-f.fontawesome.com https://kit.fontawesome.com",
        "img-src 'self' data: https: https://www.google.com.mx",
        "script-src 'self' 'unsafe-inline' https: nonce-sha256-"+nonce+"",
        // "require-trusted-types-for 'script'",
        "style-src 'self' 'unsafe-inline' https: https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
        "frame-src 'self' https: https://td.doubleclick.net",
        "object-src 'none'",
        "base-uri 'self'",
        "connect-src 'self' https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js https://ka-f.fontawesome.com https://analytics.google.com https://us-central1-db-service-01.cloudfunctions.net/get-location https://metrics.hotjar.io https://td.doubleclick.net https://stats.g.doubleclick.net https://vc.hotjar.io https://content.hotjar.io https://www.google.com/* https://v6.exchangerate-api.com/v6/c4ac30b2c210a33f339f5342/latest/USD https://api-bdc.net/data/ip-geolocation https://sandbox-api.openpay.mx/",
    ];
 
    event.headers.set("Content-Security-Policy", csp.join("; "));
};