import { type Signal, component$, createContextId, useContextProvider, useSignal, useOnWindow, $, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import gtm from './utils/GTM';
import gtag from './utils/GTAG';

import './global.css';

export const WEBContext = createContextId<Signal<any>>('web-context')

export default component$(() => {
    const obj : {[key:string]:any} = {}

    const resumeQuote = useSignal(obj)
    const so = useSignal('')
    const device = useSignal('desktop')
    
    useContextProvider(WEBContext,resumeQuote)

    useVisibleTask$(()=>{
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
            /*   const geoData ={
                ip_address: "2806:10be:7:2e9:62fc:9d:7f21:a6cc",
                country: "CO"
            }  */
        resumeQuote.value = { ...resumeQuote.value, resGeo: geoData }

        // const resRates = await fetch("/api/getCurrentRates",{method:"POST",body:JSON.stringify({})});
        // const dataRates = await resRates.json()
        // exchangeRate = dataRates.resultado

        // switch (geoData.country) 
        // {
        //     case 'CO':
        //         convertionRate = exchangeRate.find((rate) => {return rate.moneda == 'COP'})?.valor || 1
        //         currency = 'COP'
        //         break;
        //     case 'MX':
        //         convertionRate = exchangeRate.find((rate) => {return rate.moneda == 'MXN'})?.valor || 1
        //         currency = 'MXN'
        //         break; 
        //     default:
        //         convertionRate = exchangeRate.find((rate) => {return rate.moneda == 'USD'})?.valor || 1
        //         currency = 'USD'
        // }

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

    return (
        <QwikCityProvider>
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
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"/>
                <RouterHead />
            </head>
            <body data-so={so.value} data-device={device.value}>
                <noscript>
                    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KB4C9T86" height="0" width="0" style="display:none;visibility:hidden"></iframe>
                </noscript>
                <RouterOutlet />
                {/* <script async src="https://kit.fontawesome.com/43fc986b58.js" crossOrigin="anonymous"></script> */}
                <script async type="text/javascript" src='/assets/icons/all.min.js'/>
                <script async type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
                <script async type="text/javascript" src="https://js.openpay.mx/openpay.v1.min.js"></script>
                <script async type='text/javascript' src="https://js.openpay.mx/openpay-data.v1.min.js"></script>
                {/* <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script> */}
                <ServiceWorkerRegister />
            </body>
        </QwikCityProvider>
    );
});
