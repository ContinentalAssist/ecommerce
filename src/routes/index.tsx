import { $, component$, useContext, useOnDocument,useTask$, useSignal, useStylesScoped$, useVisibleTask$,useOn,useOnWindow} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { QuotesEngine } from '~/components/starter/quotes-engine/QuotesEngine';
import { CardPlan } from '~/components/starter/card-plan/CardPlan';
import { CardResume } from '~/components/starter/card-resume/CardResume';
import { CardComment } from '~/components/starter/card-comment/CardComment';
import { WEBContext } from '~/root';
import { BoardSolari } from '~/components/starter/board-solari/BoardSolari';
import { Carousel } from'~/components/starter/carrucel-cards/Carrucel-cards';
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx'
import ImgContinentalAssistDoctor from '~/media/icons/continental-assist-doctor.webp?jsx'
import ImgContinentalAssistTravel from '~/media/icons/continental-assist-travel.webp?jsx'
import ImgContinentalAssistHeadphones from '~/media/icons/continental-assist-headphones.webp?jsx'
import ImgContinentalAssistPets from  '~/media/icons/continental-assist-pets.webp?jsx'
import ImgContinentalAssistPerson from  '~/media/home/continental-assist-person.webp?jsx'
import ImgContinentalAssistBlueAccess from '~/media/home/continental-assist-blue-access.webp?jsx'
//import ImgContinentalAssistBullets from '~/media/icons/continental-assist-bullets.webp?jsx'
import ImgContinentalAssistMedicine from '~/media/icons/continental-assist-medicine.webp?jsx'
import ImgContinentalAssistPregnancy from '~/media/icons/continental-assist-pregnancy.webp?jsx'
import ImgContinentalAssistSports from '~/media/icons/continental-assist-sports.webp?jsx'
import ImgContinentalAssistTickets from '~/media/icons/continental-assist-tickets.webp?jsx'
import ImgContinentalAssistStars from '~/media/icons/continental-assist-icon-stars.webp?jsx'
import ImgContinentalAssistVenezuela from '~/media/flags/continental-assist-colombia.webp?jsx'
import ImgContinentalAssistColombia from '~/media/flags/continental-assist-colombia.webp?jsx'
import ImgContinentalAssistCostaRica from '~/media/flags/continental-assist-costa-rica.webp?jsx'
import ImgContinentalAssistMexico from '~/media/flags/continental-assist-mexico.webp?jsx'
import ImgContinentalAssistSuiza from '~/media/flags/continental-assist-suiza.webp?jsx'
import ImgContinentalAssistVibe from '~/media/icons/continental-assist-vibe.webp?jsx'
import ImgContinentalAssistCovid19 from '~/media/icons/continental-assist-covid-19.webp?jsx'
import ImgContinentalAssistStick from '~/media/icons/continental-assist-stick.webp?jsx'
import ImgContinentalAssistAttendance from '~/media/icons/continental-assist-attendance.webp?jsx'
import ImgContinentalAssistContact from '~/media/icons/continental-assist-contact.webp?jsx'
import ImgContinentalAssistClock from '~/media/icons/BlueCyren-Ecommerce-relog.webp?jsx'
import { LoadingContext } from "~/root";

import styles from './index.css?inline';
//import dayjs from "dayjs";

export const head: DocumentHead = {
    title : 'Continental Assist <span class="qs-barra">|</span> Viaja internacionalmente con tranquilidad',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist <span class="qs-barra">|</span> Viaja internacionalmente con tranquilidad'},
        {name:'description',content:'Viaja internacionalmente con tranquilidad. Servicios de asistencia y/o seguro al viajero. Continental Assist cubre 24/7. Asistencia entre trayectos y más.'},
        {property:'og:type',content:'website'},
        {property:'og:url',content:'https://continentalassist.com'},
        {property:'og:title',content:'Continental Assist <span class="qs-barra">|</span> Viaja internacionalmente con tranquilidad'},
        {property:'og:description',content:'Viaja internacionalmente con tranquilidad. Servicios de asistencia y/o seguro al viajero. Continental Assist cubre 24/7. Asistencia entre trayectos y más.'},
        {property:'og:image',content:'https://continentalassist.com/assets/img/home/continental-assist-bg-header-1920x1080.webp'},
    ],
    links: [
        {rel:'image_src',href:'https://continentalassist.com/assets/img/home/continental-assist-bg-header-1920x1080.webp'},
        {rel:'canonical',href:'https://continentalassist.com'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const location = useLocation()
    const terms = useSignal(false)
    const isMobile=useSignal(false)
    const modeResumeStep = useSignal(false)
    const contextLoading = useContext(LoadingContext)
    const headerStep = useSignal(false)
    const urlBlueAccess =  useSignal('');
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
    ])


    const openQuotesEngine$ = $((toggle:boolean) => {
        const bs = (window as any)['bootstrap']
        
        const collapseBtn = new bs.Collapse('#collapseBtnQuotesEngine',{})
        const collapse = new bs.Collapse('#collapseQuotesEngine',{})
        const buttonDown =  document.querySelector('#scrollIndicatorDown') as HTMLButtonElement
        const containerQuote =  document.querySelector('#container-quote') as HTMLButtonElement
        const bg = document.querySelector('.bg-home-header') as HTMLElement

        const messageCookies = document.querySelector('#messageCookies') as HTMLElement
        messageCookies.classList.add('d-none')

        if(toggle == true)
        {

            document.documentElement.scrollTo({top:0,behavior:'smooth'})
            
            collapseBtn.hide()
            collapse.show()
            buttonDown.classList.add('d-none');
            (buttonDown.previousSibling as HTMLElement).classList.add('d-none')
            bg.style.opacity = '0.3'

            if(navigator.userAgent.includes('Mobile'))
            {
                containerQuote.style.paddingTop = '100px'
                containerQuote.classList.remove('align-content-center')
            }
        } 
            else
        {
            if(navigator.userAgent.includes('Mobile'))
            {
                containerQuote.style.paddingTop = '0px'
                containerQuote.classList.add('align-content-center')
            }

            collapseBtn.show()
            collapse.hide()
            buttonDown.classList.remove('d-none');
            (buttonDown.previousSibling as HTMLElement).classList.remove('d-none')
            bg.style.opacity = '1'
        }
        (window as any)['dataLayer'] = (window as any)['dataLayer'] || [];
        (window as any)['dataLayer'].push({
            'event': 'TrackEventGA4',
            'category': 'interacciones usuarios',
            'action': 'clic',
            'label': '¡quiero comprar!',
            'Page': '/'+location.url.pathname.split('/')[1],
        })
    })

   
    useTask$(({ track })=>{
        const newIsmobile = track(()=>stateContext.value.isMobile);        
        if (newIsmobile) {
            isMobile.value = newIsmobile
        }
    })

    useTask$(({ track })=>{
        const close = track(()=>modeResumeStep.value);        
        if (close==true) {
            openQuotesEngine$(false)
            modeResumeStep.value=false

        }
    })
    
   


    useTask$(async() => {
        
        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPlansBenefits",
            {method:"POST",body:JSON.stringify({})});
        const data =await response.json();
        if (!data.error) {
            dataPlan.value = await data.resultado; 
            stateContext.value.planDefault =await data.resultado;
        }
        

    })

   // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async() => {    
        if(location.url.search != '')
        {
            stateContext.value.ux = location.url.search.split('=')[1]
        }
        contextLoading.value = {status:false, message:''}
        urlBlueAccess.value ='https://blueaccess.continentalassist.com/blueaccess/validation/validate-eligibility';

    })

    useOnWindow('load', $(() => {
        if(localStorage.getItem('terms')) {
            const messageCookies = document.querySelector('#messageCookies') as HTMLElement
            messageCookies.classList.add('d-none')
        }

    }))

    useOnDocument('scroll',$(() => {
        const page = document.querySelector('body') as HTMLElement
        const down = document.querySelector('#scrollIndicatorDown') as HTMLElement
        const up = document.querySelector('#scrollIndicatorUp') as HTMLElement
        const quotes = document.querySelector('#collapseBtnQuotesEngine') as HTMLElement
        
        if(page.getClientRects()[0].top <= -50)
        {
            down.style.opacity = '0.4';
            (down.previousSibling as HTMLElement).style.opacity = '0.4'
        }
        else
        {
            if(String(quotes.classList).includes('show'))
            {
                down.style.opacity = '1';
                (down.previousSibling as HTMLElement).style.opacity = '1'
            }
        }

        if(up != null)
        {
            if(page.getClientRects()[0].bottom < 1400)
            {
                up.classList.remove('d-none')
            }
            else
            {
                up.classList.add('d-none')
            }
        }
    }))
    
    //Redirigir a seccion de blue-access    
    useOn(
    'hashchange',
    $(() => {
        const hash = String(location.url).split('#')[1];
        if (hash === 'blue-access') {
            const blueAccessSection = document.querySelector('#blue-access');
            if (blueAccessSection) {
            blueAccessSection.scrollIntoView({ behavior: 'smooth' });
            }}
    })
    );

    const getWelcome$ = $(() => {
        const messageCookies = document.querySelector('#messageCookies') as HTMLElement

        messageCookies.classList.add('d-none')

        localStorage.setItem('terms',"true")
    })




    return (
        <div class='container-fluid p-0'>
           
            <div class='home' style={{minHeight:'100vh'}}>
                <div class='bg-home-header position-absolute' />
                <div class='container position-relative h-100'>
                    <div id='container-quote' class='row align-content-center justify-content-center'
                         style={{minHeight: '100vh'}}>
                        <div class='col-xl-12 text-center'>
                            <div class="collapse show" id="collapseBtnQuotesEngine">
                                <h1 class='text-semi-bold text-blue'>
                                    <span class='text-tin'>¿Buscando un</span><br class='mobile'/> seguro o
                                    asistencia?
                                </h1>
                                <h2 class='h5 text-regular text-dark-gray'>Viaja internacionalmente con
                                    tranquilidad</h2>
                                <hr class='divider mt-4 mb-1'/>
                                <br></br>
                                <button type="button" class="btn btn-primary btn-lg mt-4" onClick$={() => {
                                    openQuotesEngine$(true)
                                }}>¡Quiero comprar!
                                </button>
                            </div>
                            <div class="collapse" id="collapseQuotesEngine">
                                <h2 class='text-semi-bold text-dark-blue mb-4'>
                                    <span class='text-tin'>Viaja internacionalmente </span><br class='mobile'/> con
                                    tranquilidad
                                </h2>
                                <hr class='divider mb-4'/>
                                <div class="card card-body border-none shadow-lg">
                                <QuotesEngine  modeResumeStep={modeResumeStep} headerStep={headerStep.value}/>
                                </div>
                            </div>
                            <div class='position-absolute' style={{left: 0, right: 0, bottom: 0, zIndex: 1}}>
                                <div class='text-center justify-content-center scroll-indicator'>
                                    <p class='text-blue text-tin mb-0'>Desliza para ver más</p>
                                    <span id='scrollIndicatorDown' class='mb-3'>
                                        <i class="fas fa-chevron-down"></i>
                                        <i class="fas fa-chevron-down fa-xl"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="qs-section">

                <div class="qs-background">
                    <div class="qs-bg-left"></div>
                    <div class="qs-bg-center"></div>
                    <div class="qs-bg-right"></div>
                </div>


                <div class="qs-content">

                    <div class="qs-top">
                        <div class="qs-info">
                            <div class="qs-title">
                                <div class="qs-dot"></div>
                                <h2 class="qs-title-light">¿Quiénes</h2>
                                <h2 class="qs-title-bold">Somos?</h2>
                            </div>
                            <button class="qs-button">¡Asegura tu viaje ya!</button>
                        </div>
                        <div class="qs-video">
                            <img
                                src="https://storage.googleapis.com/a1aa/image/17980991-8bf3-4574-8c86-3a19be860073.jpg"
                                alt="Video"
                            />
                        </div>
                    </div>


                    <div class="qs-metrics qs-metrics-top">
                        <div class="qs-metric">
                            <div class="qs-metrics-titulo"><p><span class="qs-highlight">+30</span> <span
                                class="qs-barra">|</span> <strong>Experiencia</strong></p></div>
                            <p class="qs-description">Años de consistencia en el mercado de asistencia</p>
                        </div>
                        <div class="qs-metric">
                            <div class="qs-metrics-titulo"><p><span class="qs-highlight">100%</span> <span
                                class="qs-barra"><span class="qs-barra">|</span></span>
                                <strong>Respaldo</strong></p></div>
                            <p class="qs-description">Única compañía de asistencia de viaje con reaseguro</p>
                        </div>
                        <div class="qs-metric">
                            <div class="qs-metrics-titulo"><p><span class="qs-highlight">+10M</span> <span
                                class="qs-barra">|</span> <strong>Confianza</strong></p></div>
                            <p class="qs-description">Más de 10 millones de usuarios han confiado en nuestros
                                servicios</p>
                        </div>
                    </div>


                    <div class="qs-metrics qs-metrics-bottom">
                        <div class="qs-metric">
                            <div class="qs-metrics-titulo"><p><span class="qs-highlight">24/7</span> <span
                                class="qs-barra">|</span>
                                <strong>Servicio</strong></p></div>
                            <p class="qs-description">Estamos disponibles en cualquier momento del día</p>
                        </div>
                        <div class="qs-metric">
                            <div class="qs-metrics-titulo">
                                <p><span class="qs-highlight">178.000</span> <span class="qs-barra">|</span>
                                    <strong>Red
                                        Global</strong></p></div>
                            <p class="qs-description">Más de 178 mil proveedores disponibles en todo el mundo</p>

                        </div>
                    </div>
                </div>
            </section>
            <div class='bg-home-plans mt-4'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row'>
                            <div class='col-lg-12'>
                                <div class='container'>
                                    <div class='row'>
                                        <div class='col-xl-10 offset-xl-1 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue mt-5'>
                                                <span class='text-tin'>Conoce</span> nuestros planes
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h5 text-dark-gray'>Te cubrimos <b>24/7/365</b> en <br
                                                class='mobile'/> cualquier parte del mundo.</h3>
                                        </div>
                                    </div>
                                    <div class='row not-mobile'>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id={'plan-' + dataPlan.value[0]['idplan']}
                                                title={dataPlan.value[0]['nombreplan']}
                                                description='Con lo necesario para tus aventuras.'
                                                btnLabel={dataPlan.value[0]['cobertura']}
                                                footer='Cubre hasta'
                                                benefits={dataPlan.value[0]['beneficiosasignados']}
                                            >
                                                <ImgContinentalAssistBagEssential class="img-fluid" loading="lazy"
                                                                                  title='continental-assist-bag-essential'
                                                                                  alt='continental-assist-bag-essential'/>
                                            </CardPlan>
                                        </div>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id={'plan-' + dataPlan.value[1]['idplan']}
                                                title={dataPlan.value[1]['nombreplan']}
                                                description='El ideal para conectar con tu tranquilidad.'
                                                btnLabel={dataPlan.value[1]['cobertura']}
                                                footer='Cubre hasta'
                                                benefits={dataPlan.value[1]['beneficiosasignados']}
                                            >
                                                <ImgContinentalAssistBagComplete class="img-fluid" loading="lazy"
                                                                                 title='continental-assist-bag-complete'
                                                                                 alt='continental-assist-bag-complete'/>
                                            </CardPlan>
                                        </div>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id={'plan-' + dataPlan.value[2]['idplan']}
                                                title={dataPlan.value[2]['nombreplan']}
                                                description='El que te conecta con la máxima cobertura.'
                                                btnLabel={dataPlan.value[2]['cobertura']}
                                                footer='Cubre hasta'
                                                benefits={dataPlan.value[2]['beneficiosasignados']}
                                            >
                                                <ImgContinentalAssistBagElite class="img-fluid" loading="lazy"
                                                                              title='continental-assist-bag-elite'
                                                                              alt='continental-assist-bag-elite'/>
                                            </CardPlan>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselPlans" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselPlans"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselPlans"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselPlans"
                                                            data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner  py-2">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='TotalCarousel'
                                                                        title={dataPlan.value[0]['nombreplan']}
                                                                        description='Con lo necesario para tus aventuras.'
                                                                        btnLabel={dataPlan.value[0]['cobertura']}
                                                                        footer='Cubre hasta'
                                                                        benefits={dataPlan.value[0]['beneficiosasignados']}
                                                                    >
                                                                        <ImgContinentalAssistBagEssential
                                                                            class="img-fluid" loading="lazy"
                                                                            title='continental-assist-bag-essential'
                                                                            alt='continental-assist-bag-essential'/>
                                                                    </CardPlan>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='MaximusCarousel'
                                                                        title={dataPlan.value[1]['nombreplan']}
                                                                        description='El ideal para conectar con tu tranquilidad.'
                                                                        btnLabel={dataPlan.value[1]['cobertura']}
                                                                        footer='Cubre hasta'
                                                                        benefits={dataPlan.value[1]['beneficiosasignados']}
                                                                    >
                                                                        <ImgContinentalAssistBagComplete
                                                                            class="img-fluid" loading="lazy"
                                                                            title='continental-assist-bag-complete'
                                                                            alt='continental-assist-bag-complete'/>
                                                                    </CardPlan>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='SupremeCarousel'
                                                                        title={dataPlan.value[2]['nombreplan']}
                                                                        description='El que te conecta con la máxima cobertura.'
                                                                        btnLabel={dataPlan.value[2]['cobertura']}
                                                                        footer='Cubre hasta'
                                                                        benefits={dataPlan.value[2]['beneficiosasignados']}
                                                                    >
                                                                        <ImgContinentalAssistBagElite class="img-fluid"
                                                                                                      loading="lazy"
                                                                                                      title='continental-assist-bag-elite'
                                                                                                      alt='continental-assist-bag-elite'/>
                                                                    </CardPlan>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section class="qd-section">

                <div class="qd-background">
                    <div class="qd-bg-left"></div>
                    <div class="qd-bg-center"></div>
                    <div class="qd-bg-right"></div>
                </div>


                <div class="qd-content">

                    <div class="qd-top">
                        <div class="qd-info">
                            <div class="qd-title">

                                <h2 class="qd-title-light">Conoce algunas de
                                </h2>
                                <h2 class="qd-title-bold">nuestras coberturas
                                    especiales</h2>
                            </div>
                            <button class="qd-button">¡Quiero comprar!</button>
                        </div>
                        <div class="qd-video">

                            <ImgContinentalAssistPerson  loading="lazy"
                                                        title='continental-assist-pets'
                                                        alt='continental-assist-pets'/>
                        </div>
                    </div>
                    <div >
                        <Carousel/>
                    </div>

                </div>


            </section>

            <div class='bg-home-benefits'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row align-content-center'>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row'>
                                        <div class='col-xl-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue mb-3'>
                                                <span class='text-tin'>Algunas de </span><br
                                                class='mobile'/> nuestras
                                                asistencias
                                            </h2>
                                            <hr class='divider mt-3'/>
                                        </div>
                                    </div>
                                    <div class='row not-mobile'>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-doctor.webp'
                                                title='Acompañamiento médico'
                                                description='Antes, durante y después de tu viaje.'
                                            >
                                                <ImgContinentalAssistDoctor class='img-fluid' loading="lazy"
                                                                            title='continental-assist-doctor'
                                                                            alt='continental-assist-doctor'/>
                                            </CardResume>
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-travel.webp'
                                                title='Entre trayectos'
                                                description='Asistencia por pérdida de documentos, de equipaje, de conexión de vuelos y más.'
                                            >
                                                <ImgContinentalAssistTravel class='img-fluid' loading="lazy"
                                                                            title='continental-assist-travel'
                                                                            alt='continental-assist-travel'/>
                                            </CardResume>
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-headphones.webp'
                                                title='Línea de información'
                                                description='Estamos 24 horas para ti y los tuyos, todo el año.'
                                            >
                                                <ImgContinentalAssistHeadphones class='img-fluid' loading="lazy"
                                                                                title='continental-assist-headphones'
                                                                                alt='continental-assist-headphones'/>
                                            </CardResume>
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-pets.webp'
                                                title='Mascotas protegidas'
                                                description='Contamos con orientación para viaje con mascotas y servicios clave.'
                                            >
                                                <ImgContinentalAssistPets class='img-fluid' loading="lazy"
                                                                          title='continental-assist-pets'
                                                                          alt='continental-assist-pets'/>
                                            </CardResume>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselBenefits" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true" data-bs-interval='5200'>
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselBenefits"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits"
                                                            data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits"
                                                            data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-doctor.webp'
                                                                        title='Acompañamiento médico'
                                                                        description='Antes, durante y después de tu viaje.'
                                                                    >
                                                                        <ImgContinentalAssistDoctor class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-doctor'
                                                                                                    alt='continental-assist-doctor'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-travel.webp'
                                                                        title='Entre trayectos'
                                                                        description='Asistencia por pérdida de documentos, de equipaje, de conexión de vuelos y más.'
                                                                    >
                                                                        <ImgContinentalAssistTravel class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-travel'
                                                                                                    alt='continental-assist-travel'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-headphones.webp'
                                                                        title='Línea de información'
                                                                        description='Estamos 24 horas para ti y los tuyos, todo el año.'
                                                                    >
                                                                        <ImgContinentalAssistHeadphones
                                                                            class='img-fluid' loading="lazy"
                                                                            title='continental-assist-headphones'
                                                                            alt='continental-assist-headphones'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-pets.webp'
                                                                        title='Mascotas protegidas'
                                                                        description='Contamos con orientación para viaje con mascotas y servicios clave.'
                                                                    >
                                                                        <ImgContinentalAssistPets class='img-fluid'
                                                                                                  loading="lazy"
                                                                                                  title='continental-assist-pets'
                                                                                                  alt='continental-assist-pets'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='bg-home-counter'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row justify-content-center'>
                            <div class='col-lg-10 text-center'>
                                <h2 class='h1 text-semi-bold text-blue mt-4'>
                                    <span class='text-tin'>La confianza se</span><br class='mobile'/> construye con
                                    hechos
                                </h2>
                                <hr class='divider my-3'/>
                                <h3 class='h5 text-dark-gray'>
                                    <b>¡No tercerizamos!</b> Contamos con <br class='mobile'/> un centro de atención
                                    propio.
                                </h3>
                            </div>
                        </div>
                        <div class='row justify-content-center'>
                            <div class='col-lg-10'>
                                <div class='container'>
                                    <div class='row bg-counter'>
                                        <div class='col-lg-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-yellow my-5'><i
                                                class="fas fa-plane-departure"/> Datos clave</h2>
                                            <div class='not-mobile'>
                                                <BoardSolari id={'table-desktop'} words={[
                                                    {
                                                        panel: '    +DE 9M    ',
                                                        position: 'bottom',
                                                        description: 'de personas protegidas por nuestros planes'
                                                    },
                                                    {
                                                        panel: '   +DE 25K    ',
                                                        position: 'bottom',
                                                        description: 'aliados en todo el mundo para atendere y acompañarte'
                                                    },
                                                    {
                                                        panel: '   +DE 4.5K   ',
                                                        position: 'bottom',
                                                        description: 'empresas confían en nosotros'
                                                    },
                                                    {
                                                        panel: ' +DE 30 AÑOS  ',
                                                        position: 'bottom',
                                                        description: 'de experiencia'
                                                    },
                                                    {
                                                        panel: ' MULTILINGUES ',
                                                        position: 'top',
                                                        description: 'Tenemos operadores'
                                                    }
                                                ]}/>
                                            </div>
                                            <div id={'table-mobile'} class='mobile' style={{marginLeft: '-1px'}}>
                                                <BoardSolari id={'table-mobile'} mobile words={[
                                                    {
                                                        panel: ['  +DE  ', '   9M  '],
                                                        position: 'bottom',
                                                        description: 'de personas protegidas por nuestros planes'
                                                    },
                                                    {
                                                        panel: ['  +DE  ', '  25K  '],
                                                        position: 'bottom',
                                                        description: 'aliados en todo el mundo para atendere y acompañarte'
                                                    },
                                                    {
                                                        panel: ['  +DE  ', ' 4.5K  '],
                                                        position: 'bottom',
                                                        description: 'empresas confían en nosotros'
                                                    },
                                                    {
                                                        panel: ['  +DE  ', '30 AÑOS'],
                                                        position: 'bottom',
                                                        description: 'de experiencia'
                                                    },
                                                    {
                                                        panel: [' MULTI ', 'LINGUES'],
                                                        position: 'top',
                                                        description: 'Tenemos operadores'
                                                    }
                                                ]}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='blue-access' class='bg-home-blue-access' style={{minHeight: '980px !important'}}>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row align-content-center'>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-12 col-xs-12 text-center'>
                                            <ImgContinentalAssistBlueAccess class='img-fluid img-blue-access mt-5'
                                                                            title='continental-assist-blue-access-logo'
                                                                            alt='continental-assist-blue-access-logo'/>
                                        </div>

                                        <div class="col-xl-6 col-xs-12">
                                            <h3 class='text-message h3 text-bold text-white'>
                                                Transforma los vuelos <br/>
                                                demorados en <span class='text-light-blue'>experiencias VIP</span>
                                            </h3>
                                            <p class='text-message text-white text-regular'> Registra a continuación
                                                tus
                                                vuelos y olvídate de los imprevistos.</p>
                                            <div class="row">
                                                <div id="div-clock"
                                                     class="col-xl-8 col-xs-12 align-items-center p-3 mx-0">
                                                    <div class="row">
                                                        <div class="d-flex flex-row col-xl-6 col-xs-6 pt-2 px-0">
                                                            <ImgContinentalAssistClock class='img-clock img-fluid px-1'
                                                                                       title='continental-assist-blue-access-reloj'
                                                                                       alt='continental-assist-blue-access-reloj'/>

                                                            <p class='text-semi-bold text-white px-2'>
                                                                <small style={{fontSize: '12px'}}>
                                                                    Cubrimos a partir de <br/>
                                                                </small>
                                                                <b class='text-yellow' style={{fontSize: '16px'}}>60
                                                                    minutos</b><br/>
                                                                <small style={{fontSize: '12px'}}>
                                                                    de retraso
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <div
                                                            class="col-xl-6 col-xs-6 justify-content-center p-2 px-3"
                                                            style={{borderLeft: '1px solid #FEDF84'}}>

                                                            <p class='text-regular text-white'
                                                               style={{fontSize: '14px'}}>
                                                                Contamos con <br/>
                                                                una red mundial de<br/>
                                                                salas exclusivas.
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div class="row pt-4">
                                                <div class="col">
                                                    <p class='text-message text-regular text-white '>
                                                        <b>Este es un servicio de acceso a salas VIP por demora en
                                                            vuelos.</b><br/>
                                                        Solo debes tener contratado un plan de asistencia
                                                        internacional <br/>
                                                        y tener a la mano tu número de voucher.
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="row not-mobile pt-4">
                                                <div class="col">
                                                    <p class='text-message text-regular text-white '>
                                                        Aplican Términos y Condiciones.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-6 p-3">
                                            <div class="row align-items-center">
                                            <iframe 
                                                id='blueaccess-widget'
                                                src={urlBlueAccess.value}
                                                frameBorder="0"
                                                title="BlueAccess Widget"
                                            />
                                            </div>
                                            <div class="row text-center mobile pt-4">
                                                <div class="col">
                                                    <p class='text-message text-regular text-white '>
                                                        Aplican Términos y Condiciones.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='bg-home-complements'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row align-content-center'>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-11 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue mt-5'>
                                                <span class='text-tin'>Complementos</span><br
                                                class='mobile'/> ideales
                                                para tu viaje
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h5 text-dark-gray'>Extras imperdibles, si requieres <br
                                                class='mobile'/> protección adicional.</h3>
                                        </div>
                                    </div>
                                    <div class='row not-mobile'>
                                        <div class='col-lg-4'>
                                            <CardResume
                                                title='Preexistencias'
                                                description='El beneficio perfecto para tus condiciones médicas previas.'
                                            >
                                                <ImgContinentalAssistMedicine class='img-fluid' loading="lazy"
                                                                              title='continental-assist-medicine'
                                                                              alt='continental-assist-medicine'/>
                                            </CardResume>
                                        </div>
                                        <div class='col-lg-4'>
                                            <CardResume
                                                title='Futura mamá'
                                                description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                            >
                                                <ImgContinentalAssistPregnancy class='img-fluid' loading="lazy"
                                                                               title='continental-assist-pregnancy'
                                                                               alt='continental-assist-pregnancy'/>
                                            </CardResume>
                                        </div>
                                        <div class='col-lg-4'>
                                            <CardResume
                                                title='Práctica deportiva'
                                                description='Estamos contigo, en experiencias deportivas para aficionados.'
                                            >
                                                <ImgContinentalAssistSports class='img-fluid' loading="lazy"
                                                                            title='continental-assist-sports'
                                                                            alt='continental-assist-sports'/>
                                            </CardResume>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselAdditionals" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselAdditionals"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals"
                                                            data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals"
                                                            data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        title='Enfermedades preexistentes'
                                                                        description='El beneficio perfecto para tus condiciones médicas previas.'
                                                                    >
                                                                        <ImgContinentalAssistMedicine class='img-fluid'
                                                                                                      loading="lazy"
                                                                                                      title='continental-assist-medicine'
                                                                                                      alt='continental-assist-medicine'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        title='Futura mamá'
                                                                        description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                                                    >
                                                                        <ImgContinentalAssistPregnancy class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-pregnancy'
                                                                                                       alt='continental-assist-pregnancy'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        title='Práctica deportiva'
                                                                        description='Estamos contigo, en experiencias deportivas para aficionados.'
                                                                    >
                                                                        <ImgContinentalAssistSports class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-sports'
                                                                                                    alt='continental-assist-sports'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        title='Modificación de viaje multicausa'
                                                                        description='Protege la inversión en tus viajes por cancelación multicausa.'
                                                                    >
                                                                        <ImgContinentalAssistTickets class='img-fluid'
                                                                                                     loading="lazy"
                                                                                                     title='continental-assist-tickets'
                                                                                                     alt='continental-assist-tickets'/>
                                                                    </CardResume>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='bg-home-testimonials'>
                <div class='col-lg-12'>
                    <div class='container-fluid'>
                        <div class='row align-content-center'>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-8 col-md-7 text-center'>
                                            <ImgContinentalAssistStars class='img-fluid' loading="lazy"
                                                                       title='continental-assist-icon-stars'
                                                                       alt='continental-assist-icon-stars'/>
                                        </div>
                                    </div>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue'>
                                                <span class='text-tin'>La voz de</span> <br
                                                class='mobile'/> nuestros
                                                clientes
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h5 text-dark-gray'>Conectamos con sus historias.</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class='container-fluid'>
                                    <div class='row-fluid not-mobile'>
                                        <div class='col-lg-12'>
                                            <div id="carouselComments" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                </div>
                                                <div class="carousel-inner py-2">
                                                    <div class="carousel-item active">
                                                        <div class='container-fluid'>
                                                            <div class='row'>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Luisa'
                                                                        subTitle='Venezuela'
                                                                        flag='/assets/img/flags/continental-assist-colombia.webp'
                                                                        description='Muchas gracias por la solución a la solicitud. El servicio prestado fue tan efectivo, que me generó mayor confianza ante el inconveniente.'
                                                                    >
                                                                        <ImgContinentalAssistVenezuela class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-venezuela'
                                                                                                       alt='continental-assist-venezuela'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Ramiro'
                                                                        subTitle='Costa Rica'
                                                                        description='Mi familia y amigos están muy agradecidos por su ayuda y acompañamiento. Nos enorgullece recomendarlos.'
                                                                    >
                                                                        <ImgContinentalAssistCostaRica class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-costa-rica'
                                                                                                       alt='continental-assist-costa-rica'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Sandra'
                                                                        subTitle='Colombia'
                                                                        description='El servicio es excelente, la comunicación y el control que se hace a través de las llamadas es muy bueno.'
                                                                    >
                                                                        <ImgContinentalAssistColombia class='img-fluid'
                                                                                                      loading="lazy"
                                                                                                      title='continental-assist-colombia'
                                                                                                      alt='continental-assist-colombia'
                                                                                                      style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container-fluid'>
                                                            <div class='row'>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Damaria'
                                                                        subTitle='Suiza'
                                                                        description='Elegí una empresa seria y que cumple lo que promete. Muchas gracias.'
                                                                    >
                                                                        <ImgContinentalAssistSuiza class='img-fluid'
                                                                                                   loading="lazy"
                                                                                                   title='continental-assist-suiza'
                                                                                                   alt='continental-assist-suiza'
                                                                                                   style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Oswaldo'
                                                                        subTitle='México'
                                                                        description='Siempre que salgo de vacaciones o de trabajo, siempre salgo seguro y tranquilo porque CONTINENTAL ASSIST me da lo que necesito.'
                                                                    >
                                                                        <ImgContinentalAssistMexico class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-mexico'
                                                                                                    alt='continental-assist-mexico'
                                                                                                    style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Fernando'
                                                                        subTitle='Costa Rica'
                                                                        description='Me fue súper, muy agradecido. Muy ágil el servicio. Y muy atinado el diagnóstico del especialista que me atendió.'
                                                                    >
                                                                        <ImgContinentalAssistCostaRica class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-costa-rica'
                                                                                                       alt='continental-assist-costa-rica'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-sm-12'>
                                            <div id="carouselComments" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="4" aria-label="Slide 5"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="5" aria-label="Slide 6"></button>
                                                </div>
                                                <div class="carousel-inner py-2">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Luisa'
                                                                        subTitle='Venezuela'
                                                                        description='Muchas gracias por la solución a la solicitud. El servicio prestado fue tan efectivo, que me generó mayor confianza ante el inconveniente.'
                                                                    >
                                                                        <ImgContinentalAssistVenezuela class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-venezuela'
                                                                                                       alt='continental-assist-venezuela'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Ramiro'
                                                                        subTitle='Costa Rica'
                                                                        description='Mi familia y amigos están muy agradecidos por su ayuda y acompañamiento. Nos enorgullece recomendarlos.'
                                                                    >
                                                                        <ImgContinentalAssistCostaRica class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-costa-rica'
                                                                                                       alt='continental-assist-costa-rica'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Sandra'
                                                                        subTitle='Colombia'
                                                                        description='El servicio es excelente, la comunicación y el control que se hace a través de las llamadas es muy bueno.'
                                                                    >
                                                                        <ImgContinentalAssistColombia class='img-fluid'
                                                                                                      loading="lazy"
                                                                                                      title='continental-assist-colombia'
                                                                                                      alt='continental-assist-colombia'
                                                                                                      style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Damaria'
                                                                        subTitle='Suiza'
                                                                        description='Elegí una empresa seria y que cumple lo que promete. Muchas gracias.'
                                                                    >
                                                                        <ImgContinentalAssistSuiza class='img-fluid'
                                                                                                   loading="lazy"
                                                                                                   title='continental-assist-suiza'
                                                                                                   alt='continental-assist-suiza'
                                                                                                   style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Oswaldo'
                                                                        subTitle='México'
                                                                        description='Siempre que salgo de vacaciones o de trabajo, siempre salgo seguro y tranquilo porque CONTINENTAL ASSIST me da lo que necesito.'
                                                                    >
                                                                        <ImgContinentalAssistMexico class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-mexico'
                                                                                                    alt='continental-assist-mexico'
                                                                                                    style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Fernando'
                                                                        subTitle='Costa Rica'
                                                                        description='Me fue súper, muy agradecido. Muy ágil el servicio. Y muy atinado el diagnóstico del especialista que me atendió.'
                                                                    >
                                                                        <ImgContinentalAssistCostaRica class='img-fluid'
                                                                                                       loading="lazy"
                                                                                                       title='continental-assist-costa-rica'
                                                                                                       alt='continental-assist-costa-rica'
                                                                                                       style={{width: '60px'}}/>
                                                                    </CardComment>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='bg-home-faqs'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row'>
                            <div class='col-xl-12'>
                                <div class='container' style={{maxWidth: '1140px'}}>
                                    <div class='row align-items-center'>
                                        <div class='col-lg-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue'>
                                                <span class='text-tin'>Tu pregunta </span> <br
                                                class='mobile'/> tiene
                                                una respuesta
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h2 text-semi-bold text-light-blue'>#JuntosEnEsteViaje</h3>
                                        </div>
                                    </div>
                                    <div class='row bg-vibe not-mobile'>
                                        <ImgContinentalAssistVibe class='bg-vibe' title='continental-assist-vibe'
                                                                  alt='continental-assist-vibe'/>
                                        <div class='col-lg-4 text-center'>
                                            <ImgContinentalAssistCovid19 class='img-fluid left'
                                                                         title='continental-assist-covid-19'
                                                                         alt='continental-assist-covid-19'/>
                                            <ImgContinentalAssistStick class='stick-left'
                                                                       title='continental-assist-stick'
                                                                       alt='continental-assist-stick'/>
                                            <p class='text-semi-bold text-dark-blue left'>¿Los planes tienen
                                                cobertura
                                                para casos de Covid-19?</p>
                                            <small class='text-semi-bold text-dark-gray left'>Cualquiera de nuestros
                                                planes te acompañará, si se llegase a presentar un caso positivo.
                                                Consulta nuestros límites de edad al momento de realizar tu
                                                compra.</small>
                                        </div>
                                        <div class='col-lg-4 text-center'>
                                            <ImgContinentalAssistAttendance class='img-fluid center'
                                                                            title='continental-assist-attendance'
                                                                            alt='continental-assist-attendance'/>
                                            <ImgContinentalAssistStick class='stick-center'
                                                                       title='continental-assist-stick'
                                                                       alt='continental-assist-stick'/>
                                            <p class='text-semi-bold text-dark-blue center'>¿Qué países exigen
                                                contar
                                                con una asistencia médica en viaje?</p>
                                            <small class='text-semi-bold text-dark-gray center'>Los países cambian
                                                constantemente sus regulaciones, por lo que te sugerimos consultar el <a
                                                    title='IATA' class='text-semi-bold'
                                                    href='https://www.iatatravelcentre.com/world.php' target='_black'>mapa
                                                    interactivo del portal de la IATA.</a></small>
                                        </div>
                                        <div class='col-lg-4 text-center'>
                                            <ImgContinentalAssistContact class='img-fluid right'
                                                                         title='continental-assist-contact'
                                                                         alt='continental-assist-contact'/>
                                            <ImgContinentalAssistStick class='stick-right'
                                                                       title='continental-assist-stick'
                                                                       alt='continental-assist-stick'/>
                                            <p class='text-semi-bold text-dark-blue right'>¿Tienes una
                                                emergencia?<br/>¡Estamos
                                                contigo!</p>
                                            <small class='text-semi-bold text-dark-gray right'>Operamos 24 horas, los 7
                                                días de la semana, todo el año. Si necesitas de nosotros, llámanos o
                                                escríbenos vía WhatsApp al <a title='WhatsApp'
                                                                              class='text-semi-bold'
                                                                              href='tel:+13057225824'>+13057225824.</a></small>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-lg-12'>
                                            <div id="carouselComments" class="carousel carousel-dark slide"
                                                 data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="0" class="active" aria-current="true"
                                                            aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselComments"
                                                            data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'
                                                                 style={{height: '550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <ImgContinentalAssistCovid19 class='img-fluid'
                                                                                                 loading="lazy"
                                                                                                 title='continental-assist-covid-19'
                                                                                                 alt='continental-assist-covid-19'/>
                                                                    <br/>
                                                                    <ImgContinentalAssistStick class='stick'
                                                                                               title='continental-assist-stick'
                                                                                               alt='continental-assist-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue left'>¿Los
                                                                        planes tienen cobertura para casos de
                                                                        Covid-19?</p>
                                                                    <small class='text-semi-bold text-dark-gray left'>
                                                                        Cualquiera de nuestros planes te acompañará, si
                                                                        se llegase a presentar un caso positivo.
                                                                        Consulta nuestros límites de edad al momento de
                                                                        realizar tu compra.
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'
                                                                 style={{height: '550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <ImgContinentalAssistAttendance class='img-fluid'
                                                                                                    loading="lazy"
                                                                                                    title='continental-assist-attendance'
                                                                                                    alt='continental-assist-attendance'/>
                                                                    <br/>
                                                                    <ImgContinentalAssistStick class='stick'
                                                                                               title='continental-assist-stick'
                                                                                               alt='continental-assist-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue center'>¿Qué
                                                                        países exigen contar con una asistencia médica
                                                                        en viaje?</p>
                                                                    <small class='text-semi-bold text-dark-gray center'>
                                                                        Los países cambian constantemente sus
                                                                        regulaciones,
                                                                        por lo que te sugerimos consultar el <a
                                                                        title='IATA' class='text-semi-bold'
                                                                        href='https://www.iatatravelcentre.com/world.php'
                                                                        rel="noopener" target='_black'>mapa interactivo
                                                                        del portal de la IATA.</a>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'
                                                                 style={{height: '550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <ImgContinentalAssistContact class='img-fluid'
                                                                                                 loading="lazy"
                                                                                                 title='continental-assist-contact'
                                                                                                 alt='continental-assist-contact'/>
                                                                    <br/>
                                                                    <ImgContinentalAssistStick class='stick'
                                                                                               title='continental-assist-stick'
                                                                                               alt='continental-assist-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue right'>¿Tienes
                                                                        una emergencia?<br/>¡Estamos contigo!</p>
                                                                    <small class='text-semi-bold text-dark-gray right'>
                                                                        Operamos 24 horas, los 7 días de la semana, todo
                                                                        el año.
                                                                        Si necesitas de nosotros, llámanos o escríbenos
                                                                        vía WhatsApp al <a title='WhatsApp'
                                                                                           class='text-semi-bold'
                                                                                           rel="noopener"
                                                                                           href='tel:+13057225824'>+13057225824.</a>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='my-5'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row'>
                            <div class='col-xl-12 text-center mt-4'>
                                <h2 class='h5 text-dark-gray mb-0'>Tus viajes, tus momentos, nuestros planes...</h2>
                                <hr class='divider mt-4'/>
                                <h3 class='h1 text-bold text-dark-blue'>¡Dile hola a tu nuevo equipo de respaldo!</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {
                terms.value !== true
                &&
                <div class='container-fluid fixed-bottom'>
                    {
                        <div id='messageCookies'
                             class='row justify-content-center aling-items-center bg-light p-3 pb-0 shadow-lg'>
                            <div class='col-lg-6'>
                                <p style={{fontSize: '12px'}}>
                                    Usamos cookies para conocer más acerca de la actividad de nuestro sitio web. Las
                                    puedes aceptar haciendo clic en el botón o rechazarlas.
                                    Si continúas navegando e interactuando con el sitio, estás aceptando nuestra <a
                                    title='Cookies'
                                    href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20cookies-Continental%20Assist.pdf'>Política
                                    de Cookies</a>.
                                </p>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <a title='Cancelar' href='https://www.google.com/'
                                       class='btn btn-primary'>Cancelar</a>
                                </div>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <button type='button' class='btn btn-primary' onClick$={getWelcome$}>Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
});