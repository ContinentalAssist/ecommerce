import { component$, useVisibleTask$ } from '@builder.io/qwik';

const GTM_CONTAINER_ID = 'GTM-KB4C9T86';
const ALLOWED_HOSTS = ['www.continentalassist.com', 'continentalassist.com'];

function isProdHost(hostname: string) {
  return ALLOWED_HOSTS.includes(hostname);
}

function isLikelyBot() {
  const ua = navigator.userAgent.toLowerCase();
  return (
    navigator.webdriver === true ||
    ua.includes('bot') ||
    ua.includes('crawler') ||
    ua.includes('spider')
  );
}

function initializeDataLayer() {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
  }
}

function loadGTMOnce(containerId: string) {
  if (typeof window === 'undefined') return;
  
  // Verificar si GTM ya está cargado
  if ((window as any).google_tag_manager) return;
  
  // Inicializar dataLayer
  initializeDataLayer();
  
  // Función de inicialización de GTM
  (function(w: any, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    
    if (f.parentNode) {
      f.parentNode.insertBefore(j, f);
    }
  })(window, document, 'script', 'dataLayer', containerId);
}

function loadGTMNoScript(containerId: string) {
  if (typeof window === 'undefined') return;
  
  // Crear iframe noscript para casos sin JavaScript
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + containerId;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  
  noscript.appendChild(iframe);
  
  // Insertar al inicio del body
  const body = document.body;
  if (body && body.firstChild) {
    body.insertBefore(noscript, body.firstChild);
  }
}

export const GTMInit = component$(() => {
  useVisibleTask$(() => {
    if (!import.meta.env.PROD) return;         // Solo en build de prod
    if (!isProdHost(location.hostname)) return; // Solo dominios válidos
    if (isLikelyBot()) return;                 // Ignora crawlers/bots

    // Retrasar la carga de GTM para evitar conflictos con Qwik
    // Esto permite que Qwik complete su hidratación antes de que GTM interfiera
    setTimeout(() => {
      loadGTMOnce(GTM_CONTAINER_ID);
      loadGTMNoScript(GTM_CONTAINER_ID);
    }, 1000); // 1 segundo de retraso
  });

  return null;
});
