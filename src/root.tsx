import { type Signal, component$, createContextId, useContextProvider, useSignal,  $, useStore,useOnDocument, useVisibleTask$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { QwikPartytown } from './components/partytown/partytown';
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik/build";
import { ClarityInit } from './integrations/ClarityInit';
import { GTMInit } from './integrations/GTMInit';
import "./global.css";
import { initializeGenesys } from './utils/genesys';

interface DivisaStore{
  divisaUSD: boolean
}
interface LoadingStore{
  status: boolean,
  message: string,
}

declare let window: any;

export const WEBContext = createContextId<Signal<any>>('web-context')
export const DIVISAContext = createContextId<DivisaStore>('divisa-manual');

export const LoadingContext = createContextId<Signal<LoadingStore>>('set-loading');


export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const obj : {[key:string]:any} = {}
  const resumeQuote = useSignal(obj)
  const loading = useSignal({status:true, message:'Espera un momento...'}); // Signal para el estado de carga
  //const loadingStatus = useSignal(true); // Signal para el estado de carga const loadingMessage = useSignal('Espere un momento ...')
  const so = useSignal('')
  const device = useSignal('desktop')
  const divisaUpdate:  DivisaStore=useStore({divisaUSD:true})

  useContextProvider(WEBContext,resumeQuote)
  useContextProvider(DIVISAContext, divisaUpdate);
  useContextProvider(LoadingContext, loading);

  useOnDocument(
    'load',
    $(() => {
      if (/mobile/i.test(navigator.userAgent)) {
        resumeQuote.value = { ...resumeQuote.value, isMobile: true }
    }else{
        resumeQuote.value = { ...resumeQuote.value, isMobile: false }
      }
    })
  );

  useVisibleTask$(async () => {
    // Restaurar datos del cotizador desde localStorage si existen
    // Solo restaurar si no estamos en el home para evitar conflictos
    if (typeof window !== 'undefined') {
      try {
        // Verificar si estamos en el home
        const isHome = window.location.pathname === '/';

        if (!isHome) {
          const savedData = localStorage.getItem('continental_assist_quote_data');
          if (savedData) {
            const savedQuoteData = JSON.parse(savedData);
            if (savedQuoteData && Object.keys(savedQuoteData).length > 0) {
              resumeQuote.value = { ...resumeQuote.value, ...savedQuoteData };
            }
          }
        }
      } catch (error) {
        console.warn('Error al cargar datos del cotizador:', error);
      }
    }

    let convertionRate: number;
    let currency: string;

    if (/mobile/i.test(navigator.userAgent)) {
      resumeQuote.value = { ...resumeQuote.value, isMobile: true }
    }else{
      resumeQuote.value = { ...resumeQuote.value, isMobile: false }
    }

    const geoData = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
      .then((response) => {
            return(response.json())
      })
    /* const geoData ={
          ip_address: "2806:10be:7:2e9:62fc:9d:7f21:a6cc",
          country: "CO"
      } */

    resumeQuote.value = { ...resumeQuote.value, resGeo: geoData }

        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getExchangeRate", {method:"POST", headers: { 'Content-Type': 'application/json' }, body:JSON.stringify({codigopais:geoData.country})});
        const data =await response.json();
        const resState : any[] = [];
    if (!data.error) {

          if(geoData.country == 'CO' || geoData.country == 'MX')
          {
             const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getStateMXCO", {method:"POST", headers: { 'Content-Type': 'application/json' }, body:JSON.stringify({codigopais:geoData.country})});
                  const listadoEstados =await response.json();

        if (listadoEstados && listadoEstados.resultado[0] && listadoEstados.resultado[0].estados && Array.isArray(listadoEstados.resultado[0].estados)) {
          listadoEstados.resultado[0].estados.map((estado: any) => {
            resState.push({ value: estado.idestado, label: estado.nombreestado, codigoestado: estado.codigoestado })
          })

        }
      }
          switch (geoData.country) 
          {
        case 'CO':
          convertionRate = data.resultado[0]?.valor
          currency = 'COP'
          break;
        case 'MX':
          convertionRate = data.resultado[0]?.valor
          currency = 'MXN'
          break;
        default:
          convertionRate = 1
          currency = 'USD'
      }
          resumeQuote.value = { ...resumeQuote.value, currentRate: {code:currency,rate:convertionRate},country:geoData.country, listadoestados:resState, listadociudades:[] }

    }

  })


  useVisibleTask$(async()=>{
    if(navigator.userAgent.includes('Windows'))
      {
      so.value = 'windows'
    }

      if(navigator.userAgent.includes('Mobile'))
      {
      device.value = 'mobile'
    }


    await initializeGenesys(import.meta.env.VITE_MY_PUBLIC_WEBCHATID)
  })


  /*  useOnWindow('load',$(() => {
     
   })) */

  /*   useOnWindow('load',$(async() => {
         await initializeGenesys(import.meta.env.VITE_MY_PUBLIC_WEBCHATID)
         //await initializeGenesys(import.meta.env.VITE_MY_PUBLIC_BROWSINGVOZID)
    })) */



  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="attribution-reporting" content="disable" />
        <meta name="keywords" content="
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
              precios assistencia medico viajes,
      " />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/Galano_Grotesque.woff" as="font" type="font/woff" crossOrigin='' />
        <RouterHead />
      </head>
      <body data-so={so.value} data-device={device.value}>
        <ClarityInit />
        <GTMInit />
        <RouterOutlet />
        <script async type="text/javascript" src='/assets/icons/all.min.js' />
        <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
        <script async src="https://js.openpay.mx/openpay.v1.min.js" defer></script>
        <script async src="https://js.openpay.mx/openpay-data.v1.min.js" defer></script>
        <script dangerouslySetInnerHTML={`
          console.log('Attribution Reporting Status:','disable');
          // Verificar si los headers se están aplicando
          fetch(window.location.href, {method: 'HEAD'})
            .then(response => {
              console.log('Attribution-Reporting header:', response.headers.get('Attribution-Reporting'));
            })
            .catch(console.error);
      `} />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
