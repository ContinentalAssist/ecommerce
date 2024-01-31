import { $, component$, createContextId, useContextProvider, useOnWindow, useSignal } from "@builder.io/qwik";
import type { Signal } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import gtm from "./utils/GTM";
import gtag from "./utils/GTAG";

export const WEBContext = createContextId<Signal<any>>('web-context')

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

    useContextProvider(WEBContext,resumeQuote)

    useOnWindow('load',$(() => {
        if(navigator.userAgent.includes('Windows'))
        {
            so.value = 'windows'
        }

        (window as any)['dataLayer'] = (window as any)['dataLayer'] || [];
        gtm(window,document,'script','dataLayer','GTM-KB4C9T86');
        gtag('js', new Date()); 
        gtag('config', 'AW-11397008041'); 
    }))

    return (
        <QwikCityProvider>
            <head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11397008041"></script>
                <meta charSet="utf-8" />
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
                <ServiceWorkerRegister />
            </head>
            <body lang="es-MX" data-so={so.value}>
                <noscript>
                    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KB4C9T86" height="0" width="0" style="display:none;visibility:hidden"></iframe>
                </noscript>
                <RouterOutlet />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
                <script src="https://kit.fontawesome.com/43fc986b58.js" crossOrigin="anonymous"></script>
            </body>
        </QwikCityProvider>
    );
});
