import { type Signal, component$, createContextId, useContextProvider, useSignal, useOnWindow, $, useVisibleTask$, useStore } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik/build";
import gtm from './utils/GTM';
import gtag from './utils/GTAG';
import "./global.css";

interface DivisaStore{
  divisaUSD: boolean
}
declare let window: any;

export const WEBContext = createContextId<Signal<any>>('web-context')
export const DIVISAContext = createContextId<DivisaStore>('divisa-manual');

// initializeGenesys.ts
export function initializeGenesysBrowsing(): void {
  window['Genesys'] = window['Genesys'] || function () {
    (window['Genesys'].q = window['Genesys'].q || []).push(arguments);
  };

  window['Genesys'].t = new Date().getTime();
  window['Genesys'].c = {
      environment: 'prod',
      deploymentId: '45fcee1e-b649-4182-8b26-36a9d94f1f59',
      debug: true 
    };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js';
  script.charset = 'utf-8';
  script.onload = () => {
    window['Genesys']
  };
  document.head.appendChild(script);
}

export function initializeGenesysBrowsingWebChat(): void {
  window['Genesys'] = window['Genesys'] || function () {
    (window['Genesys'].q = window['Genesys'].q || []).push(arguments);
  };

  window['Genesys'].t = new Date().getTime();
  window['Genesys'].c = {
      environment: 'prod',
      deploymentId: '48cfd3f8-3f9c-4222-8786-16ec71a7c437',
      debug: true 
  };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js';
  script.charset = 'utf-8';
  script.onload = () => {
      window['Genesys']
  };
  document.head.appendChild(script);
}

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const obj : {[key:string]:any} = {}

  const resumeQuote = useSignal(obj)
  const so = useSignal('')
  const device = useSignal('desktop')
  const divisaUpdate:  DivisaStore=useStore({divisaUSD:false})

  useContextProvider(WEBContext,resumeQuote)
  useContextProvider(DIVISAContext, divisaUpdate);

  useVisibleTask$(()=>{
      
      const link = document.createElement('link');
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
      link.type = 'text/css';
      link.rel = 'stylesheet';
     // link.onload = callback; // La función que se ejecutará después de que el CSS se haya cargado
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.async = true;
      script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
      script.integrity = "sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);

      if (/mobile/i.test(navigator.userAgent)) {
          resumeQuote.value = { ...resumeQuote.value, isMobile: true }
      }else{
          resumeQuote.value = { ...resumeQuote.value, isMobile: false }
      }
  })

  useVisibleTask$(async() => {
      let convertionRate: number;
      let currency: string;
      // let exchangeRate : any[] = []

      const geoData = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
          .then((response) => {
              return(response.json())
          })
            /* const geoData ={
              ip_address: "2806:10be:7:2e9:62fc:9d:7f21:a6cc",
              country: "CO"
          }  */
      resumeQuote.value = { ...resumeQuote.value, resGeo: geoData }
      const resRates = await fetch('https://v6.exchangerate-api.com/v6/c4ac30b2c210a33f339f5342/latest/USD')
      .then((response) => {
          return(response.json())
      })
      

    switch (geoData.country) 
    {
        case 'CO':
            convertionRate = resRates.conversion_rates.COP
            currency = 'COP'
            break;
        case 'MX':
            convertionRate = resRates.conversion_rates.MXN
            currency = 'MXN'
            break; 
        default:
            convertionRate = resRates.conversion_rates.USD
            currency = 'USD'
    }

    resumeQuote.value = { ...resumeQuote.value, currentRate: {code:currency,rate:convertionRate} }
  });

  useVisibleTask$(() => {
    const openpayScript = document.createElement('script');
    openpayScript.async = true;
    openpayScript.type = "text/javascript";
    openpayScript.src = "https://js.openpay.mx/openpay.v1.min.js";
    document.body.appendChild(openpayScript);
  
    const openpayDataScript = document.createElement('script');
    openpayDataScript.async = true;
    openpayDataScript.type = 'text/javascript';
    openpayDataScript.src = "https://js.openpay.mx/openpay-data.v1.min.js";
    document.body.appendChild(openpayDataScript);
  });

  
  useOnWindow('load',$(async() => {
    if(navigator.userAgent.includes('Windows'))
    {
        so.value = 'windows'
    }

    if(navigator.userAgent.includes('Mobile'))
    {
        device.value = 'mobile'
    }

    (window as any)['dataLayer'] = (window as any)['dataLayer'] || [];
    await gtm(window,document,'script','dataLayer','GTM-KB4C9T86');
    await gtag('js', new Date()); 
    await gtag('config', 'AW-11397008041'); 
  }))


  useOnWindow('load',$(async() => {
    /*    const genesysScript = document.createElement('script');
       genesysScript.type = 'text/javascript';
       genesysScript.charset = 'utf-8';
       genesysScript.innerHTML = `
         (function (g, e, n, es, ys) {
           g['_genesysJs'] = e; g[e] = g[e] || function () {(g[e].q = g[e].q || []).push(arguments)};
           g[e].t = 1 * new Date(); g[e].c = es; ys = document.createElement('script'); ys.async = 1;
           ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
         })(window, 'Genesys', 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js', {
           deploymentId: '45fcee1e-b649-4182-8b26-36a9d94f1f59',
         });
       `;
       document.head.appendChild(genesysScript); */
     // await initializeGenesysBrowsing()
  }))



  return (
    <QwikCityProvider>
      {/* <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head> */}

      <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11397008041"></script> 
          <meta name="keywords" content='
              seguro, 
              seguro viajes,
              seguro viajeros,
              seguro viaje extranjero, 
              seguro viajes nacionales,
              seguro viajes internacionales,
              seguro medico viajes,

              cotizar seguro, 
              cotizar seguro viajes,
              cotizar seguro viajeros,
              cotizar seguro viaje extranjero, 
              cotizar seguro viajes nacionales,
              cotizar seguro viajes internacionales,
              cotizar seguro medico viajes,

              comprar seguro, 
              comprar seguro viajes,
              comprar seguro viajeros,
              comprar seguro viaje extranjero, 
              comprar seguro viajes nacionales,
              comprar seguro viajes internacionales,
              comprar seguro medico viajes,

              precios seguro, 
              precios seguro viajes,
              precios seguro viajeros,
              precios seguro viaje extranjero, 
              precios seguro viajes nacionales,
              precios seguro viajes internacionales,
              precios seguro medico viajes,

              assistencia, 
              assistencia viajes,
              assistencia viajeros,
              assistencia viaje extranjero, 
              assistencia viajes nacionales,
              assistencia viajes internacionales,
              assistencia medico viajes,

              cotizar assistencia, 
              cotizar assistencia viajes,
              cotizar assistencia viajeros,
              cotizar assistencia viaje extranjero, 
              cotizar assistencia viajes nacionales,
              cotizar assistencia viajes internacionales,
              cotizar assistencia medico viajes,

              comprar assistencia, 
              comprar assistencia viajes,
              comprar assistencia viajeros,
              comprar assistencia viaje extranjero, 
              comprar assistencia viajes nacionales,
              comprar assistencia viajes internacionales,
              comprar assistencia medico viajes,
              
              precios assistencia, 
              precios assistencia viajes,
              precios assistencia viajeros,
              precios assistencia viaje extranjero, 
              precios assistencia viajes nacionales,
              precios assistencia viajes internacionales,
              precios assistencia medico viajes,'
          />
          <link rel="manifest" href="/manifest.json" />              
          <RouterHead />
      </head>
      <body data-so={so.value} data-device={device.value}>
          <noscript>
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KB4C9T86" height="0" width="0" style="display:none;visibility:hidden"></iframe>
          </noscript>
        <RouterOutlet />
        <script async type="text/javascript" src='/assets/icons/all.min.js'/>
{/*         <script async type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
 */}       {/*  <script async type="text/javascript" src="https://js.openpay.mx/openpay.v1.min.js"></script>
        <script async type='text/javascript' src="https://js.openpay.mx/openpay-data.v1.min.js"></script>
 */}
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
