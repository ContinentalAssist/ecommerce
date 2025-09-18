import { $, component$, useContext, useOnDocument, useTask$, useSignal, useStylesScoped$, useVisibleTask$, useOn, useOnWindow} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { WEBContext } from '~/root';
import { LoadingContext } from "~/root";
import styles from './index.css?inline';

// Importar componentes modulares
import { HomeHeader } from '~/components/home/HomeHeader';
import { MetricSection } from '~/components/home/MetricSection'; // Importamos el nuevo componente
import { AboutUsSection } from '~/components/home/AboutUsSection';
import { BlueAccessSection } from '~/components/home/BlueAccessSection';
import { ComplementsSection } from '~/components/home/ComplementsSection';
import { TestimonialsSection } from '~/components/home/TestimonialsSection';
import { FaqsSection } from '~/components/home/FaqsSection';
import { CookiesBanner } from '~/components/home/CookiesBanner';
import { CoverSection } from '~/components/home/CoverSection';

export const head: DocumentHead = {
    title : 'Continental Assist Viaja internacionalmente con tranquilidad',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist Viaja internacionalmente con tranquilidad'},
        {name:'description',content:'Viaja internacionalmente con tranquilidad. Servicios de asistencia y/o seguro al viajero. Continental Assist cubre 24/7. Asistencia entre trayectos y más.'},
        {property:'og:type',content:'website'},
        {property:'og:url',content:'https://continentalassist.com'},
        {property:'og:title',content:'Continental Assist Viaja internacionalmente con tranquilidad'},
        {property:'og:description',content:'Viaja internacionalmente con tranquilidad. Servicios de asistencia y/o seguro al viajero. Continental Assist cubre 24/7. Asistencia entre trayectos y más.'},
        {property:'og:image',content:'https://continentalassist.com/assets/img/home/continental-assist-bg-header-1920x1080.webp'},
    ],
    links: [
        {rel:'image_src',href:'https://continentalassist.com/assets/img/home/continental-assist-bg-header-1920x1080.webp'},
        {rel:'canonical',href:'https://continentalassist.com'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles);

    const stateContext = useContext(WEBContext)
    const location = useLocation()
    const terms = useSignal(false)
    const isMobile=useSignal(false)
    const modeResumeStep = useSignal(false)
    const contextLoading = useContext(LoadingContext)
    const headerStep = useSignal(false)
    const urlBlueAccess =  useSignal('');

    // Limpiar datos del cotizador cuando se navega al home
    useVisibleTask$(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem('continental_assist_quote_data');
                // También limpiar el contexto actual
                stateContext.value = {};
            } catch (error) {
                console.warn('Error al limpiar datos del cotizador:', error);
            }
        }
    });

    // estructura base se actualiza con la data de los planes configurados en el servicio getPlansBenefits
    const dataPlan = useSignal([
        {
            "idplan": 0,
            "nombreplan": "Plan 1",
            "beneficiosasignados": [],
            "cobertura": ''
        },
        {
            "idplan": 1,
            "nombreplan": "Plan 2",
            "beneficiosasignados": [],
            "cobertura": ''
        },
        {
            "idplan": 2,
            "nombreplan": "Plan 3",
            "beneficiosasignados": [],
            "cobertura": ''
        }
    ]);

    const openQuotesEngine$ = $((toggle:boolean) => {
        const bs = (window as any)['bootstrap'];

        const collapseBtn = new bs.Collapse('#collapseBtnQuotesEngine',{});
        const collapse = new bs.Collapse('#collapseQuotesEngine',{});
        const buttonDown = document.querySelector('#scrollIndicatorDown') as HTMLButtonElement;
        const containerQuote = document.querySelector('#container-quote') as HTMLButtonElement;
        const bg = document.querySelector('.bg-home-header') as HTMLElement;

        const messageCookies = document.querySelector('#messageCookies') as HTMLElement;
        messageCookies.classList.add('d-none');

        if(toggle == true) {
            document.documentElement.scrollTo({top:0,behavior:'smooth'});

            collapseBtn.hide();
            collapse.show();
            buttonDown.classList.add('d-none');
            (buttonDown.previousSibling as HTMLElement).classList.add('d-none');
            bg.style.opacity = '0.3';

            if(navigator.userAgent.includes('Mobile')) {
                containerQuote.style.paddingTop = '100px';
                containerQuote.classList.remove('align-content-center');
            }
        } else {
            if(navigator.userAgent.includes('Mobile')) {
                containerQuote.style.paddingTop = '0px';
                containerQuote.classList.add('align-content-center');
            }

            collapseBtn.show();
            collapse.hide();
            buttonDown.classList.remove('d-none');
            (buttonDown.previousSibling as HTMLElement).classList.remove('d-none');
            bg.style.opacity = '1';
        }

    });

    useTask$(({ track }) => {
        const newIsmobile = track(() => stateContext.value.isMobile);
        if (newIsmobile) {
            isMobile.value = newIsmobile;
        }
    });

    useTask$(({ track }) => {
        const close = track(() => modeResumeStep.value);
        if (close == true) {
            openQuotesEngine$(false);
            modeResumeStep.value = false;
        }
    });

    useTask$(async() => {
        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPlansBenefits",
            {method:"POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})});
        const data = await response.json();
        if (!data.error) {
            dataPlan.value = await data.resultado;
            stateContext.value.planDefault = await data.resultado;
        }
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async() => {
        if(location.url.search != '') {
            stateContext.value.ux = location.url.search.split('=')[1];
        }
        contextLoading.value = {status:false, message:''};
        urlBlueAccess.value = 'https://blueaccess.continentalassist.com/blueaccess/validation/validate-eligibility';
    });

    useOnWindow('load', $(() => {
        if(localStorage.getItem('terms')) {
            const messageCookies = document.querySelector('#messageCookies') as HTMLElement;
            messageCookies.classList.add('d-none');
        }
    }));

    useOnDocument('scroll', $(() => {
        const page = document.querySelector('body') as HTMLElement;
        const down = document.querySelector('#scrollIndicatorDown') as HTMLElement;
        const up = document.querySelector('#scrollIndicatorUp') as HTMLElement;
        const quotes = document.querySelector('#collapseBtnQuotesEngine') as HTMLElement;

        if(page.getClientRects()[0].top <= -50) {
            down.style.opacity = '0.4';
            (down.previousSibling as HTMLElement).style.opacity = '0.4';
        } else {
            if(String(quotes.classList).includes('show')) {
                down.style.opacity = '1';
                (down.previousSibling as HTMLElement).style.opacity = '1';
            }
        }

        if(up != null) {
            if(page.getClientRects()[0].bottom < 1400) {
                up.classList.remove('d-none');
            } else {
                up.classList.add('d-none');
            }
        }
    }));

    //Redirigir a seccion de blue-access
    useOn('hashchange', $(() => {
        const hash = String(location.url).split('#')[1];
        if (hash === 'blue-access') {
            const blueAccessSection = document.querySelector('#blue-access');
            if (blueAccessSection) {
                blueAccessSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }));

    const getWelcome$ = $(() => {
        const messageCookies = document.querySelector('#messageCookies') as HTMLElement;
        messageCookies.classList.add('d-none');
        localStorage.setItem('terms', "true");
    });

    return (
        <div class='container-fluid p-0'>

            <HomeHeader
                modeResumeStep={modeResumeStep}
                headerStep={headerStep.value}
                openQuotesEngine$={openQuotesEngine$}
            />


            <MetricSection />

            <AboutUsSection />

            <CoverSection />

            {/*<PlansSection dataPlan={dataPlan.value} />*/}


            {/*<SpecialCoveragesSection />*/}

            <BlueAccessSection urlBlueAccess={urlBlueAccess.value} />

            <ComplementsSection />

            <TestimonialsSection />

            <FaqsSection />

            <div class='my-5'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row'>
                            <div class='col-xl-12 text-center mt-4'>
                                <h3 class="text-dark-blue">
                                    Contigo, <span class="text-bold">globalmente.</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CookiesBanner terms={terms.value} getWelcome$={getWelcome$} />
        </div>
    );
});
