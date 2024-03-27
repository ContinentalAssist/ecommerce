import { $, component$, useContext, useOnDocument, useSignal, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { QuotesEngine } from '~/components/starter/quotes-engine/QuotesEngine';
import { Loading } from '~/components/starter/loading/Loading';
import { CardPlan } from '~/components/starter/card-plan/CardPlan';
import { CardResume } from '~/components/starter/card-resume/CardResume';
import { CardComment } from '~/components/starter/card-comment/CardComment';
import { WEBContext } from '~/root';
import { BoardSolari } from '~/components/starter/board-solari/BoardSolari';

import ImgContinentalAssistBagEssential from '~/media/img/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx'
import ImgContinentalAssistDoctor from '~/media/icons/continental-assist-doctor.webp?jsx'
import ImgContinentalAssistTravel from '~/media/icons/continental-assist-travel.webp?jsx'
import ImgContinentalAssistHeadphones from '~/media/icons/continental-assist-headphones.webp?jsx'
import ImgContinentalAssistPets from  '~/media/icons/continental-assist-pets.webp?jsx'
import ImgContinentalAssistShoppingCar from '~/media/icons/continental-assist-shopping-car.webp?jsx'
import ImgContinentalAssistRegister from '~/media/icons/continental-assist-register.webp?jsx'
import ImgContinentalAssistProtection from '~/media/icons/continental-assist-protection.webp?jsx'
import ImgContinentalAssistDots from '~/media/icons/continental-assist-dots.png?jsx'


import ImgContinentalAssistGroupPlan from '~/media/img/icons/continental-assist-group-plan.webp?jsx'
import styles from './index.css?inline';

export const head: DocumentHead = {
    title : 'Continental Assist | Viaja internacionalmente con tranquilidad',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Viaja internacionalmente con tranquilidad'},
        {name:'description',content:'Viaja internacionalmente con tranquilidad. Servicios de asistencia y/o seguro al viajero. Continental Assist cubre 24/7. Asistencia entre trayectos y más.'},
        {property:'og:type',content:'website'},
        {property:'og:url',content:'https://continentalassist.com'},
        {property:'og:title',content:'Continental Assist | Viaja internacionalmente con tranquilidad'},
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
    const navigate = useNavigate()
    const location = useLocation()

    const array : any[] = []

    const origins = useSignal(array)
    const destinations = useSignal(array)
    const loading = useSignal(true)
    const terms = useSignal(false)
    const benefits = useSignal([
        {
            "idplan": 2946,
            "nombreplan": "ESSENTIAL",
            "beneficiosasignados": []
        },
        {
            "idplan": 2964,
            "nombreplan": "COMPLETE",
            "beneficiosasignados": []
        },
        {
            "idplan": 2965,
            "nombreplan": "ELITE",
            "beneficiosasignados": []
        }
    ])

    useVisibleTask$(async() => {
        if(location.url.search != '')
        {
            stateContext.value.ux = location.url.search.split('=')[1]
        }

        let res : {[key:string]:any[]} = {}
        const resOrigins : any[] = []
        const resDestinations : any[] = []

        const resDefaults = await fetch("/api/getDefaults",{method:"GET"});
        const dataDefaults = await resDefaults.json()
        res = dataDefaults.resultado[0]

        res.origenes.map((origen) => {
            resOrigins.push({value:origen.idpais,label:origen.nombrepais})
        })

        res.destinos.map((destino) => {
            resDestinations.push({value:destino.idpais,label:destino.nombrepais})
        })

        origins.value = resOrigins
        destinations.value = resDestinations

        const resBenefits0 = await fetch("/api/getBenefits",{method:"POST",body:JSON.stringify({idplan:2946})});
        const dataBenefits0 = await resBenefits0.json()
        benefits.value[0].beneficiosasignados = dataBenefits0.resultado.beneficiosasignados

        const resBenefits1 = await fetch("/api/getBenefits",{method:"POST",body:JSON.stringify({idplan:2964})});
        const dataBenefits1 = await resBenefits1.json()
        benefits.value[1].beneficiosasignados = dataBenefits1.resultado.beneficiosasignados

        const resBenefits2 = await fetch("/api/getBenefits",{method:"POST",body:JSON.stringify({idplan:2965})});
        const dataBenefits2 = await resBenefits2.json()
        benefits.value[2].beneficiosasignados = dataBenefits2.resultado.beneficiosasignados

        loading.value = false
    })

    useVisibleTask$(() => {
        if(localStorage.getItem('terms'))
        {
            const messageCookies = document.querySelector('#messageCookies') as HTMLElement
            messageCookies.classList.add('d-none')
        }
    })

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

    const getWelcome$ = $(() => {
        const messageCookies = document.querySelector('#messageCookies') as HTMLElement

        messageCookies.classList.add('d-none')

        localStorage.setItem('terms',"true")
    })

    const openQuotesEngine$ = $((toggle:boolean) => {
        (window as any)['dataLayer'].push({
            'event': 'TrackEventGA4',
            'category': 'interacciones usuarios',
            'action': 'clic',
            'label': '¡quiero comprar!',
            'page': 'Home'
        })

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
    })

    const getQuotesEngine$ = $(async() => {    
        const bs = (window as any)['bootstrap']
        const modal = new bs.Modal('#modalGroupPlan',{})
        const quotesEngine = document.querySelector('#quotes-engine') as HTMLElement
        const forms = Array.from(quotesEngine.querySelectorAll('form'))
        const inputs = Array.from(document.querySelectorAll('input,select'))

        const error = [false,false,false]
        const newDataForm : {[key:string]:any} = {}
        newDataForm.edades = []
        newDataForm.paisesdestino = []

        forms.map((form,index) => {
            inputs.map((input) => {
                if(input.classList.value.includes('form-select') && ((input as HTMLInputElement).required === true) && ((input as HTMLInputElement).value === ''))
                {
                    (input as HTMLInputElement).classList.add('is-invalid')
                    error[0] = true
                }
                else if(input.classList.value.includes('form-paxs') && ((input as HTMLInputElement).required === true) && ((input as HTMLInputElement).value === ''))
                {
                    (input as HTMLInputElement).classList.add('is-invalid')
                    error[2] = true
                }
                else
                {
                    (input as HTMLInputElement).classList.remove('is-invalid');
                    (input as HTMLInputElement).classList.add('is-valid')
                }
            })

            if(!form.checkValidity())
            {
                form.classList.add('was-validated')
                error[index] = true
            }
            else
            {
                form.classList.remove('was-validated')
            }
        })

        if(!error.includes(true))
        {
            loading.value = true
            
            inputs.map((input) => {
                if ((input as HTMLInputElement).name)
                {
                    newDataForm[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
    
                    if(input.classList.value.includes('form-select-multiple'))
                    {
                        newDataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value).split(',')
                    }
                    else if(input.classList.value.includes('form-select'))
                    {
                        newDataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value)
                    }
                    else if((input as HTMLInputElement).type == 'number')
                    {
                        newDataForm[(input as HTMLInputElement).name] = Number((input as HTMLInputElement).value)

                        for (let index = 0; index < newDataForm[(input as HTMLInputElement).name]; index++) 
                        {
                            newDataForm.edades.push(Number((input as HTMLInputElement).name))
                        }
                    }
                }
            })

            newDataForm.dias = ((new Date(newDataForm.hasta).getTime() - new Date(newDataForm.desde).getTime()) / 1000 / 60 / 60 / 24) + 1

            origins.value.map(origin => {
                if(origin.value == newDataForm.origen)
                {
                    newDataForm.paisorigen = origin.label
                }
            }) 
            
            destinations.value.map(destination => {
                newDataForm.destinos.map((destino:any) => {
                    if(destination.value == destino)
                    {
                        newDataForm.paisesdestino.push(destination.label)
                    }
                })
            }) 

            newDataForm.origen = Number(newDataForm.origen);
            // newDataForm.destinos = newDataForm.destinos;

            (window as any)['dataLayer'].push({
                'event': 'TrackEventGA4',
                'category': 'Flujo asistencia',
                'action': 'Paso 1 :: buscador',
                'origen': newDataForm.paisorigen,
                'destino': newDataForm.paisesdestino,
                'desde': newDataForm.desde,
                'hasta': newDataForm.hasta,
                'adultos':newDataForm[70],
                'niños_y_jovenes': newDataForm[22],
                'adultos_mayores': newDataForm[85],
                'page': 'home',
                'cta': 'buscar'
            });

            if(newDataForm.edades.length > 0)
            {
                if(newDataForm[22] >= 2 && (newDataForm[70]+newDataForm[85]) >= 2)
                {
                    newDataForm.planfamiliar = 't'
                    stateContext.value = Object.assign(stateContext.value,newDataForm)
                    loading.value = false
                    modal.show()
                }
                else
                {
                    newDataForm.planfamiliar = 'f'
                    stateContext.value = Object.assign(stateContext.value,newDataForm)
                    await navigate('/quotes-engine/step-1')
                }
            }
        }
    })

    const getGroupPlan$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const modal = bs.Modal.getInstance('#modalGroupPlan',{})
        modal.hide()
        await navigate('/quotes-engine/step-1')
    })

    const getCancelQuotes$ = $(() => {
        openQuotesEngine$(false);

        (window as any)['dataLayer'].push({
            'event': 'TrackEventGA4',
            'category': 'Flujo asistencia',
            'action': 'Paso 1 :: buscador',
            'origen': '',
            'destino': '',
            'desde': '',
            'hasta': '',
            'adultos': 0,
            'niños_y_jovenes': 0,
            'adultos_mayores': 0,
            'page': 'home',
            'cta': 'cancelar'
        });
    })

    return (
        <div class='container-fluid p-0'>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <div class='home' style={{minHeight:'100vh'}}>
                <div class='bg-home-header position-absolute' />
                <div class='container position-relative h-100'>
                    <div id='container-quote' class='row align-content-center justify-content-center' style={{minHeight:'100vh'}}>
                        <div class='col-xl-12 text-center'>
                            <div class="collapse show" id="collapseBtnQuotesEngine">
                                <h1 class='text-semi-bold text-blue'>
                                    <span class='text-tin'>¿Buscando un</span><br class='mobile'/> seguro o asistencia?
                                </h1>
                                <h2 class='h5 text-regular text-dark-gray'>Viaja internacionalmente con tranquilidad</h2>
                                <hr class='divider mt-4 mb-1'/>
                                <br></br>
                                <button type="button" class="btn btn-primary btn-lg mt-4" onClick$={() => {openQuotesEngine$(true)}}>¡Quiero comprar!</button>
                            </div>
                            <div class="collapse" id="collapseQuotesEngine">
                                <h2 class='text-semi-bold text-dark-blue mb-4'>
                                    <span class='text-tin'>Viaja internacionalmente </span><br class='mobile'/> con tranquilidad
                                </h2>
                                <hr class='divider mb-4'/>
                                <div class="card card-body border-none shadow-lg">
                                    <QuotesEngine/>
                                    <div class='container mt-3'>
                                        <div class='row row-mobile justify-content-center'>
                                            <div class='col-lg-3 col-sm-6 col-xs-6'>
                                                <div class='d-grid gap-2'>
                                                    <button type="button" class="btn btn-primary btn-lg" onClick$={getCancelQuotes$}>Cancelar</button>
                                                </div>
                                            </div>
                                            <div class='col-lg-3 col-sm-6 col-xs-6'>
                                                <div class='d-grid gap-2'>
                                                    <button type="button" class="btn btn-primary btn-lg" onClick$={getQuotesEngine$}>Buscar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='position-absolute' style={{left:0,right:0,bottom:0,zIndex:1}}>
                                <div class='text-center justify-content-center scroll-indicator'>
                                    <p class='text-blue text-tin mb-0'>Desliza para ver más</p>
                                    <span id='scrollIndicatorDown' class='mb-3'>
                                        <i class="fas fa-chevron-down"></i>
                                        <i class="fas fa-chevron-down"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
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
                                            <h3 class='h5 text-dark-gray'>Te cubrimos <b>24/7/365</b> en <br class='mobile'/> cualquier parte del mundo.</h3>
                                        </div>
                                    </div>
                                    <div class='row not-mobile'>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id='Essential'
                                                img='/assets/img/icons/continental-assist-bag-essential.webp'
                                                title='Essential'
                                                description='Con lo necesario para tus aventuras.'
                                                btnLabel='USD 35K'
                                                footer='Cubre hasta'
                                                benefits={benefits.value[0].beneficiosasignados}
                                            />
                                        </div>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id='Complete'
                                                img='/assets/img/icons/continental-assist-bag-complete.webp'
                                                title='Complete'
                                                description='El ideal para conectar con tu tranquilidad.'
                                                btnLabel='USD 60K'
                                                footer='Cubre hasta'
                                                benefits={benefits.value[1].beneficiosasignados}
                                            />
                                        </div>
                                        <div class='col-xl-4 col-md-4'>
                                            <CardPlan
                                                id='Elite'
                                                img='/assets/img/icons/continental-assist-bag-elite.webp'
                                                title='Elite'
                                                description='El que te conecta con la máxima cobertura.'
                                                btnLabel='USD 100K'
                                                footer='Cubre hasta'
                                                benefits={benefits.value[2].beneficiosasignados}
                                            />
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselPlans" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner  py-2">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='EssentialCarousel'
                                                                        img='/assets/img/icons/continental-assist-bag-essential.webp'
                                                                        title='Essential'
                                                                        description='Con lo necesario para tus aventuras.'
                                                                        btnLabel='USD 35K'
                                                                        footer='Cubre hasta'
                                                                        benefits={benefits.value[0].beneficiosasignados}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='CompleteCarousel'
                                                                        img='/assets/img/icons/continental-assist-bag-complete.webp'
                                                                        title='Complete'
                                                                        description='El ideal para conectar con tu tranquilidad.'
                                                                        btnLabel='USD 60K'
                                                                        footer='Cubre hasta'
                                                                        benefits={benefits.value[1].beneficiosasignados}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6'>
                                                                    <CardPlan
                                                                        id='EliteCarousel'
                                                                        img='/assets/img/icons/continental-assist-bag-elite.webp'
                                                                        title='Elite'
                                                                        description='El que te conecta con la máxima cobertura.'
                                                                        btnLabel='USD 100K'
                                                                        footer='Cubre hasta'
                                                                        benefits={benefits.value[2].beneficiosasignados}
                                                                    />
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
            <div class='bg-home-benefits'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row align-content-center'>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row'>
                                        <div class='col-xl-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue mb-3'>
                                                <span class='text-tin'>Algunas de </span><br class='mobile'/> nuestras asistencias
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
                                            />
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-travel.webp'
                                                title='Entre trayectos'
                                                description='Asistencia por pérdida de documentos, de equipaje, de conexión de vuelos y más.'
                                            />
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-headphones.webp'
                                                title='Línea de información'
                                                description='Estamos 24 horas para ti y los tuyos, todo el año.'
                                            />
                                        </div>
                                        <div class='col-xl-3 col-md-6'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-pets.webp'
                                                title='Mascotas protegidas'
                                                description='Contamos con orientación para viaje con mascotas y servicios clave.'
                                            />
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselBenefits" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true" data-bs-interval='5200'>
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselBenefits" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselBenefits" data-bs-slide-to="3" aria-label="Slide 4"></button>
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
                                                                    />
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
                                                                    />
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
                                                                    />
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
                                                                    />
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
                                    <span class='text-tin'>La confianza se</span><br class='mobile'/> construye con hechos
                                </h2>
                                <hr class='divider my-3'/>
                                <h3 class='h5 text-dark-gray'>
                                    <b>¡No tercerizamos!</b> Contamos con <br class='mobile'/> un centro de atención propio.
                                </h3>
                            </div>       
                        </div>
                        <div class='row justify-content-center'>
                            <div class='col-lg-10'>
                                <div class='container'>
                                    <div class='row bg-counter'>
                                        <div class='col-lg-12 text-center'>
                                                <h2 class='h1 text-semi-bold text-yellow my-5'><i class="fas fa-plane-departure"/> Datos clave</h2>
                                                <div class='not-mobile'>
                                                    <BoardSolari id={'table-desktop'} words={[
                                                        {panel:'    +DE 9M    ',position:'bottom',description:'de personas protegidas por nuestros planes'},
                                                        {panel:'   +DE 25K    ',position:'bottom',description:'aliados en todo el mundo para atendere y acompañarte'},
                                                        {panel:'   +DE 4.5K   ',position:'bottom',description:'empresas confían en nosotros'},
                                                        {panel:' +DE 30 AÑOS  ',position:'bottom',description:'de experiencia'},
                                                        {panel:' MULTILINGUES ',position:'top',description:'Tenemos operadores'}
                                                    ]}/>
                                                </div>
                                                <div id={'table-mobile'} class='mobile'>
                                                    <BoardSolari mobile words={[
                                                        {panel:['  +DE  ','   9M  '],position:'bottom',description:'de personas protegidas por nuestros planes'},
                                                        {panel:['  +DE  ','  25K  '],position:'bottom',description:'aliados en todo el mundo para atendere y acompañarte'},
                                                        {panel:['  +DE  ',' 4.5K  '],position:'bottom',description:'empresas confían en nosotros'},
                                                        {panel:['  +DE  ','30 AÑOS'],position:'bottom',description:'de experiencia'},
                                                        {panel:[' MULTI ','LINGUES'],position:'top',description:'Tenemos operadores'}
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
            <div class='bg-home-blue-access'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row align-content-center' style={{minHeight:'100vh'}}>
                            <div class='col-xl-12'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-8 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue mt-5'>Blue Access</h2>
                                            <h3 class='h5 text-dark-gray'>Servicio VIP exclusivo de Continental Assist,<br class='mobile'/> sin costo extra.</h3>
                                            <hr class='divider my-3'/>
                                            <p class='text-blue mb-5'>
                                                Dile adiós a los dolores de cabeza por causa de los vuelos demorados. 
                                                Te abrimos la puerta a cientos de salas VIP alrededor del mundo, para transformar vuelos retrasados, 
                                                en experiencias de espera confortables y exclusivas. 
                                            </p>
                                        </div>
                                    </div>
                                    <div class='row justify-content-center not-mobile'>
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-shopping-car.webp'
                                                description='Compra el plan de asistencia que más se ajuste a tu viaje.'
                                            />
                                        </div>
                                        <img src='/assets/img/icons/continental-assist-dots.png' class='img-fluid line-dots-left' width={150} height={33} alt='continental-assist-icon-dots' title='continental-assist-icon-dots' />
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-register.webp'
                                                description='Registra tu vuelo para monitorearlo en tiempo real.'
                                            />
                                        </div>
                                        <img src='/assets/img/icons/continental-assist-dots.png' class='img-fluid line-dots-left' width={150} height={33} alt='continental-assist-icon-dots' title='continental-assist-icon-dots' />
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-protection.webp'
                                                description='Ingresa a los espacios exclusivos en caso de un retraso.'
                                            />
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselAdditionals" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-shopping-car.webp'
                                                                        description='Compra el plan de asistencia que más se ajuste a tu viaje.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-register.webp'
                                                                        description='Registra tu vuelo para monitorearlo en tiempo real.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-protection.webp'
                                                                        description='Ingresa a los espacios exclusivos en caso de un retraso.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-lg-12 text-center mb-5 py-4'>
                                            <h4 class='text-semi-bold text-blue'>Activa el plan y adquiere tu cobertura.</h4>
                                            <small class='text-blue fst-italic'>Aplican Términos y Condiciones.</small>
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
                                                <span class='text-tin'>Complementos</span><br class='mobile'/> ideales para tu viaje
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h5 text-dark-gray'>Extras imperdibles, si requieres <br class='mobile'/> protección adicional.</h3>
                                        </div>
                                    </div>
                                    <div class='row not-mobile'>
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-medicine.webp'
                                                title='Preexistencias'
                                                description='El beneficio perfecto para tus condiciones médicas previas.'
                                            />
                                        </div>
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-pregnancy.webp'
                                                title='Futura mamá'
                                                description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                            />
                                        </div>
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-sports.webp'
                                                title='Práctica deportiva'
                                                description='Estamos contigo, en experiencias deportivas para aficionados.'
                                            />
                                        </div>
                                        <div class='col-lg-3'>
                                            <CardResume
                                                img='/assets/img/icons/continental-assist-tickets.webp'
                                                title='Modificación de viaje'
                                                description='Protege la inversión en tus viajes por cancelación multicausa.'
                                            />
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-xl-12'>
                                            <div id="carouselAdditionals" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselAdditionals" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-medicine.webp'
                                                                        title='Enfermedades preexistentes'
                                                                        subTitle={undefined}
                                                                        description='El beneficio perfecto para tus condiciones médicas previas.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-pregnancy.webp'
                                                                        title='Futura mamá'
                                                                        subTitle={undefined}
                                                                        description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-sports.webp'
                                                                        title='Práctica deportiva'
                                                                        subTitle={undefined}
                                                                        description='Estamos contigo, en experiencias deportivas para aficionados.'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'>
                                                                <div class='col-sm-6 mb-5'>
                                                                    <CardResume
                                                                        img='/assets/img/icons/continental-assist-tickets.webp'
                                                                        title='Modificación de viaje multicausa'
                                                                        subTitle={undefined}
                                                                        description='Protege la inversión en tus viajes por cancelación multicausa.'
                                                                    />
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
                                <div class='container' >
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-8 col-md-7 text-center'>
                                            <img class='img-fluid' src='/assets/img/icons/continental-assist-icon-stars.webp' width={955} height={167} alt='continental-assist-icon-stars' title='continental-assist-icon-stars'/>
                                        </div>
                                    </div>
                                    <div class='row justify-content-center'>
                                        <div class='col-xl-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue'>
                                                <span class='text-tin'>La voz de</span> <br class='mobile'/> nuestros clientes
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h5 text-dark-gray'>Conectamos con sus historias.</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class='container-fluid'>
                                    <div class='row-fluid not-mobile'>
                                        <div class='col-lg-12'>
                                            <div id="carouselComments" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="1" aria-label="Slide 2"></button>                                                
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
                                                                    />
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Ramiro'
                                                                        subTitle='Costa Rica'
                                                                        flag='/assets/img/flags/continental-assist-costa-rica.webp'
                                                                        description='Mi familia y amigos están muy agradecidos por su ayuda y acompañamiento. Nos enorgullece recomendarlos.'
                                                                    />
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Sandra'
                                                                        subTitle='Colombia'
                                                                        flag='/assets/img/flags/continental-assist-colombia.webp'
                                                                        description='El servicio es excelente, la comunicación y el control que se hace a través de las llamadas es muy bueno.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-suiza.webp'
                                                                        description='Elegí una empresa seria y que cumple lo que promete. Muchas gracias.'
                                                                    />
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Oswaldo'
                                                                        subTitle='México'
                                                                        flag='/assets/img/flags/continental-assist-mexico.webp'
                                                                        description='Siempre que salgo de vacaciones o de trabajo, siempre salgo seguro y tranquilo porque CONTINENTAL ASSIST me da lo que necesito.'
                                                                    />
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <CardComment
                                                                        title='Fernando'
                                                                        subTitle='Costa Rica'
                                                                        flag='/assets/img/flags/continental-assist-costa-rica.webp'
                                                                        description='Me fue súper, muy agradecido. Muy ágil el servicio. Y muy atinado el diagnóstico del especialista que me atendió.'
                                                                    />
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
                                            <div id="carouselComments" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="4" aria-label="Slide 5"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="5" aria-label="Slide 6"></button>
                                                </div>
                                                <div class="carousel-inner py-2">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-sm-12'>
                                                                    <CardComment
                                                                        title='Luisa'
                                                                        subTitle='Venezuela'
                                                                        flag='/assets/img/flags/continental-assist-colombia.webp'
                                                                        description='Muchas gracias por la solución a la solicitud. El servicio prestado fue tan efectivo, que me generó mayor confianza ante el inconveniente.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-costa-rica.webp'
                                                                        description='Mi familia y amigos están muy agradecidos por su ayuda y acompañamiento. Nos enorgullece recomendarlos.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-colombia.webp'
                                                                        description='El servicio es excelente, la comunicación y el control que se hace a través de las llamadas es muy bueno.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-suiza.webp'
                                                                        description='Elegí una empresa seria y que cumple lo que promete. Muchas gracias.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-mexico.webp'
                                                                        description='Siempre que salgo de vacaciones o de trabajo, siempre salgo seguro y tranquilo porque CONTINENTAL ASSIST me da lo que necesito.'
                                                                    />
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
                                                                        flag='/assets/img/flags/continental-assist-costa-rica.webp'
                                                                        description='Me fue súper, muy agradecido. Muy ágil el servicio. Y muy atinado el diagnóstico del especialista que me atendió.'
                                                                    />
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
                                <div class='container' style={{maxWidth:'1140px'}}>
                                    <div class='row align-items-center'>
                                        <div class='col-lg-12 text-center'>
                                            <h2 class='h1 text-semi-bold text-blue'>
                                                <span class='text-tin'>Tu pregunta </span> <br class='mobile'/> tiene una respuesta
                                            </h2>
                                            <hr class='divider my-3'/>
                                            <h3 class='h2 text-semi-bold text-light-blue'>#JuntosEnEsteViaje</h3>
                                        </div>
                                    </div>
                                    <div class='row bg-vibe not-mobile'>
                                        <img src='/assets/img/icons/continental-assist-vibe.webp' class='img-fluid' alt='continental-assist-vibe' width={1140} height={621} title='continental-assist-vibe'/>
                                        <div class='col-lg-4 text-center'>
                                            <img src='/assets/img/icons/continental-assist-covid-19.webp' class='img-fluid left' width={250} height={250} alt='continental-assist-icon-covid-19' title='continental-assist-covid-19' />
                                            <img class='stick-left' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                            <p class='text-semi-bold text-dark-blue left'>¿Los planes tienen cobertura para casos de Covid-19?</p>
                                            <small class='text-semi-bold text-dark-gray left'>Cualquiera de nuestros planes te acompañará, si se llegase a presentar un caso positivo. Consulta nuestros límites de edad al momento de realizar tu compra.</small>
                                        </div>
                                        <div class='col-lg-4 text-center'>
                                            <img src='/assets/img/icons/continental-assist-attendance.webp'class='img-fluid center' width={250} height={250} alt='continental-assist-icon-attendance' title='continental-assist-icon-attendance'/>
                                            <img class='stick-center' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                            <p class='text-semi-bold text-dark-blue center'>¿Qué países exigen contar con una asistencia médica en viaje?</p>
                                            <small  class='text-semi-bold text-dark-gray center'>Los países cambian constantemente sus regulaciones, por lo que te sugerimos consultar el <a title='IATA' class='text-semi-bold' href='https://www.iatatravelcentre.com/world.php' target='_black'>mapa interactivo del portal de la IATA.</a></small>
                                        </div>
                                        <div class='col-lg-4 text-center'>
                                            <img src='/assets/img/icons/continental-assist-contact.webp' class='img-fluid right' width={250} height={250} alt='continental-assist-icon-contact' title='continental-assist-icon-contact'/>
                                            <img class='stick-right' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                            <p class='text-semi-bold text-dark-blue right'>¿Tienes una emergencia?<br/>¡Estamos contigo!</p>
                                            <small class='text-semi-bold text-dark-gray right'>Operamos 24 horas, los 7 días de la semana, todo el año. Si necesitas de nosotros, llámanos o escríbenos vía WhatsApp al <a title='WhatsApp' class='text-semi-bold' href='tel:+18602187561'>+18602187561.</a></small>
                                        </div>
                                    </div>
                                    <div class='row mobile'>
                                        <div class='col-lg-12'>
                                            <div id="carouselComments" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselComments" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class='container'>
                                                            <div class='row justify-content-center' style={{height:'550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <img src='/assets/img/icons/continental-assist-covid-19.webp' class='img-fluid'width={250} height={250} alt='continental-assist-icon-covid-19' title='continental-assist-covid-19' />
                                                                    <br/>
                                                                    <img src='/assets/img/icons/continental-assist-stick.webp' width={38} height={100} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue left'>¿Los planes tienen cobertura para casos de Covid-19?</p>
                                                                    <small class='text-semi-bold text-dark-gray left'>
                                                                        Cualquiera de nuestros planes te acompañará, si se llegase a presentar un caso positivo. 
                                                                        Consulta nuestros límites de edad al momento de realizar tu compra.
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center' style={{height:'550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <img src='/assets/img/icons/continental-assist-attendance.webp' class='img-fluid'width={250} height={250} alt='continental-assist-icon-attendance' title='continental-assist-icon-attendance'/>
                                                                    <br/>
                                                                    <img src='/assets/img/icons/continental-assist-stick.webp' width={38} height={100} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue center'>¿Qué países exigen contar con una asistencia médica en viaje?</p>
                                                                    <small  class='text-semi-bold text-dark-gray center'>
                                                                        Los países cambian constantemente sus regulaciones, 
                                                                        por lo que te sugerimos consultar el <a title='IATA' class='text-semi-bold' href='https://www.iatatravelcentre.com/world.php' rel="noopener" target='_black'>mapa interactivo del portal de la IATA.</a>
                                                                        </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class='container'>
                                                            <div class='row justify-content-center'style={{height:'550px'}}>
                                                                <div class='col-sm-6 text-center'>
                                                                    <img src='/assets/img/icons/continental-assist-contact.webp' class='img-fluid'width={250} height={250} alt='continental-assist-icon-contact' title='continental-assist-icon-contact'/>
                                                                    <br/>
                                                                    <img src='/assets/img/icons/continental-assist-stick.webp' width={38} height={100} alt='continental-assist-icon-stick' title='continental-assist-icon-stick'/>
                                                                    <p class='text-semi-bold text-dark-blue right'>¿Tienes una emergencia?<br/>¡Estamos contigo!</p>
                                                                    <small class='text-semi-bold text-dark-gray right'>
                                                                        Operamos 24 horas, los 7 días de la semana, todo el año. 
                                                                        Si necesitas de nosotros, llámanos o escríbenos vía WhatsApp al <a title='WhatsApp' class='text-semi-bold' rel="noopener" href='tel:+18602187561'>+18602187561.</a>
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
            <div id='modalGroupPlan' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            {/* <img src='/assets/img/icons/continental-assist-group-plan.webp' class='img-fluid' width={350} height={278} alt='continental-assist-icon-group-plan' title='continental-assist-icon-group-plan'/> */}
                            <ImgContinentalAssistGroupPlan class='img-fluid' title='continental-assist-group-plan' alt='continental-assist-group-plan' />
                            <h2 class='text-semi-bold text-white'>¡Genial!</h2>
                        </div>
                        <div class="modal-body">
                            <p class='text-blue'>
                                Parece que la cantidad de viajeros y las edades ingresadas, aplican para nuestro plan grupal.
                                Solo vas a pagar por la asistencia de los <span class='text-semi-bold'>mayores de 23 años y el resto corren por nuestra cuenta</span>.
                            </p>
                            <h3 class='text-semi-bold text-light-blue'>¡No estas alucinando!</h3>
                            <p class='text-blue'><span class='text-semi-bold'>Continental</span> te esta entregando asistencias completamente gratis.</p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-3'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary' onClick$={getGroupPlan$}>Aceptar</button>
                                        </div>
                                    </div>
                                </div>
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
                        <div id='messageCookies' class='row justify-content-center aling-items-center bg-light p-3 pb-0 shadow-lg'>
                            <div class='col-lg-6'>
                                <p  style={{fontSize:'12px'}}>
                                Usamos cookies para conocer más acerca de la actividad de nuestro sitio web. Las puedes aceptar haciendo clic en el botón o rechazarlas. 
                                Si continúas navegando e interactuando con el sitio, estás aceptando nuestra <a title='Cookies' href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20cookies-Continental%20Assist.pdf'>Política de Cookies</a>.
                                </p>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <a title='Cancelar' href='https://www.google.com/' class='btn btn-primary' >Cancelar</a>
                                </div>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <button type='button' class='btn btn-primary' onClick$={getWelcome$}>Aceptar</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
            <script type='application/ld+json'>
                {
                    JSON.stringify({
                        "@context" : "https://schema.org",
                        "@type": "WebPage",
                        "name": "Continental Asisst",
                        "description": "Viaja internacionalmente con tranquilidad.",
                        "url": "https://continentalassist.com",
                        "breadcrumb": {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Nosotros",
                                    "item": "https://continentalassist.com/about-us"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Contactanos",
                                    "item": "https://continentalassist.com/contact-us"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": "Buscar voucher",
                                    "item": "https://continentalassist.com/search-voucher"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 4,
                                    "name": "Condiciones Generales",
                                    "item": "https://continentalassist.com/general-conditions"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 5,
                                    "name": "Tratamiento de la Informacion",
                                    "item": "https://continentalassist.com/information-treatment-privacy-policies"
                                },
                            ]
                        }
                    })
                }
            </script>
        </div>
    );
});