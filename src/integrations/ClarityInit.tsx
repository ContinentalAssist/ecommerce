import { component$, useVisibleTask$ } from '@builder.io/qwik';

const CLARITY_ID = 't65sjv929c';
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

function loadClarityOnce(id: string) {
  if ((window as any).clarity) return; // evitar doble carga
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode?.insertBefore(t, y);
  })(window as any, document, 'clarity', 'script', id);
}

export const ClarityInit = component$(() => {
  useVisibleTask$(() => {
    if (!import.meta.env.PROD) return;         // Solo en build de prod
    if (!isProdHost(location.hostname)) return; // Solo dominios válidos
    if (isLikelyBot()) return;                 // Ignora crawlers/bots

    loadClarityOnce(CLARITY_ID);
  });

  return null;
});
