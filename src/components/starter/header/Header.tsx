import { $, component$, useOnWindow, useSignal, useStyles$, useTask$,useVisibleTask$, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import ImgContinentalAssistLogotipo from '~/media/ca/continental-assist-logotipo.webp?jsx'

import styles from './header.css?inline';
import { QuotesEngineSteps } from '../quotes-engine/QuotesEngineSteps';
import { SwitchDivisa } from '../switch/SwitchDivisa';
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from '~/utils/CurrencyFormater';
//import { QuotesEngineResume } from '../quotes-engine/QuotesEngineResume';
import { clearQuoteData$ } from '~/utils/QuotePersistence';

// Definir el tipo para cada paso
interface Step {
    stepActive: number;
    name: string;
}

// Definir el tipo para el objeto que contiene los pasos
interface StepsMap {
    [path: string]: Step; // Usar un índice de tipo string
}

interface GA4EventData {
    event: string;
    category: string;
    action: string;
    label: string;
    page: string;
  }

export const Header = component$(() => {
    useStyles$(styles);

    const location = useLocation()

    const showBtn = useSignal(false)
    const showLink = useSignal(false)
    const desktop = useSignal(false)
    const headerStep = useSignal(true);
    const stateContext = useContext(WEBContext)
    const contextDivisa = useContext(DIVISAContext)
    const totalPay = useSignal({divisa:'',total:0})
    const divisaManual = useSignal(contextDivisa.divisaUSD)
    const pathNameURL = useSignal('')
    const country = useSignal('');
    const stepsMap = useSignal<StepsMap>(
        {
            '/quotes-engine/step-1/': { stepActive: 1, name: 'Planes' },
            '/quotes-engine/step-2/': { stepActive: 2, name: 'Complementos' },
            '/quotes-engine/step-3/': { stepActive: 3, name: 'Método' },
            '/quotes-engine/message/': { stepActive: 4, name: 'Pago' },
        }
    )
    const modeResumeStep = useSignal(true)

   
    
    useTask$(({ track }) => {
        const pathName = track(()=>location.url.pathname);  
        pathNameURL.value = pathName
        if(pathName != '/' && !pathName.includes('quotes-engine'))
        {
            showLink.value = true
        }
        else
        {
            showBtn.value = false
            showLink.value = false
        }
    }) 

    useTask$(({ track }) => {
        const precioGrupal = track(()=>stateContext?.value?.total?.total);  

        if(precioGrupal != undefined&&Object.keys(stateContext.value).length > 0&& 'plan' in stateContext.value)
            {
    
                totalPay.value = {divisa:stateContext?.value?.plan?.codigomonedapago,total:Number(precioGrupal)}
    
            }
    })

    useTask$(({ track })=>{
            const value = track(()=>stateContext.value.country);   
             country.value = value;
            
    })

    useOnWindow('scroll',$(() => {
        
        if(location.url.pathname == '/'&& !location.url.pathname.includes('quotes-engine'))
        {
            const navbar = document.querySelector('.navbar') as HTMLElement
            const page = document.querySelector('body') as HTMLElement
            
            if(page.getClientRects()[0]['y'] <= -50)
            {
                navbar.classList.add('bg-light')
            }
            else
            {
                navbar.classList.remove('bg-light')
            }

            if(page.getClientRects()[0]['y'] <= -200)
            {
                showBtn.value = true
            }
            else
            {
                showBtn.value = false
            }
        }else{
            showBtn.value = false
            showLink.value = false
        }
    }))

    useVisibleTask$(() => {        
        if(!navigator.userAgent.includes('Mobile'))
        {
            desktop.value = true
            
        }

        
    })

    /*     const getQuotes$ = $(() => {
        const bs = (window as any)['bootstrap']
        const collapseBtn = new bs.Collapse('#collapseBtnQuotesEngine',{})
        const collapse = new bs.Collapse('#collapseQuotesEngine',{})
        const buttonDown =  document.querySelector('#scrollIndicatorDown') as HTMLButtonElement
        const containerQuote =  document.querySelector('#container-quote') as HTMLButtonElement
        const bg = document.querySelector('.bg-home-header') as HTMLElement

        if(location.url.pathname == '/')
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
            (window as any)['dataLayer'] = (window as any)['dataLayer'] || [];
            (window as any)['dataLayer'].push({
                'event': 'TrackEventGA4',
                'category': 'interacciones usuarios',
                'action': 'clic',
                'label': '¡quiero comprar!',
                'Page': '/'+location.url.pathname.split('/')[1],
            })
        }
    }) */

    const getLocation$ = $((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        
        if (!(window as any)['dataLayer']) {
          console.warn('dataLayer no está inicializado');
          return;
        }
      
        const eventData: GA4EventData = {
          event: 'TrackEventGA4',
          category: 'interacciones usuarios',
          action: 'menu',
          label:  target?.textContent ?? 'Elemento sin texto',
          page: target.getAttribute('href') || ''
        };
      
        (window as any)['dataLayer'].push(eventData);
      });

    const changeDivisa$ = $((divisa:string) => {
        if(divisa == 'base')
        {
            divisaManual.value = true
            contextDivisa.divisaUSD = true
        }
        else if(divisa == 'local')
        {
            divisaManual.value = false
            contextDivisa.divisaUSD = false
        }
    })

    // Función para limpiar datos del cotizador cuando se hace clic en el logo
    const clearQuoteDataOnLogoClick$ = $(() => {
        clearQuoteData$();
        // También limpiar el contexto actual
        stateContext.value = {};
    })

    return (
        <header class={location.url.pathname.includes('quotes-engine')&&stateContext.value.isMobile===true?'header-step-content':''}>
            <nav class={pathNameURL.value === '/' ? 'navbar fixed-top' : 'navbar bg-light fixed-top'}>
                <div class={"container pt-2 pb-2 contenedor-header-1"}>
                    {/* Layout para mobile */}
                    <div class="col-12 d-lg-none row align-items-center">
                        {/* Botón hamburguesa - 3 columnas */}
                        <div class="col-3">
                            <button id='Menu' class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvasLg" aria-controls="navbarOffcanvasLg" aria-label='Menu'>
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                        
                        {/* Logo centrado - 5 columnas en step-1, 7 columnas en step-2, 5 columnas en step-3 */}
                        <div class={`${pathNameURL.value === '/quotes-engine/step-2/' ? 'col-7' : 'col-5'} d-flex justify-content-center align-items-center`}>
                            <a class="navbar-brand" href="/" title="Inicio"
                            onClick$={() => clearQuoteDataOnLogoClick$()}
                            style={{transform: 'translateX(32px)'}}
                            >
                                <ImgContinentalAssistLogotipo title='continental-assist-logotipo' alt='continental-assist-logotipo' style={{width:'auto', height:'30px'}} />
                            </a>
                        </div>
                        
                        {/* Switch de divisa - 4 columnas en step-1, 2 columnas en step-2, 4 columnas en step-3 */}
                        <div class={`${pathNameURL.value === '/quotes-engine/step-2/' ? 'col-2' : 'col-4'} text-end pe-0`}>
                            {
                                (pathNameURL.value === '/quotes-engine/step-1/' || pathNameURL.value === '/quotes-engine/step-3/') ? (
                                    <div style={{transform: 'scale(0.8)', transformOrigin: 'center'}}>
                                        <SwitchDivisa
                                            labels={['USD',stateContext.value?.currentRate?.code]}
                                            value={contextDivisa.divisaUSD ? 'base' : 'local'}
                                            onChange={$((e:any) => {changeDivisa$(e)})}
                                        />
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                    </div>
                    
                    {/* Layout para desktop */}
                    <div class="d-none d-lg-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <button id='Menu' class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvasLg" aria-controls="navbarOffcanvasLg" aria-label='Menu'>
                                <i class="fas fa-bars"></i>
                            </button>
                            
                            {/* Logo - centrado solo en home, normal en otras páginas */}
                            {pathNameURL.value === '/' ? (
                                <a class="navbar-brand position-absolute start-50 translate-middle-x" href="/" title="Inicio" 
                                onClick$={() => clearQuoteDataOnLogoClick$()}
                                >
                                    <ImgContinentalAssistLogotipo title='continental-assist-logotipo' alt='continental-assist-logotipo' style={{width:'auto', height:'50px'}} />
                                </a>
                            ) : (
                                <a class="navbar-brand ms-3" href="/" title="Inicio" 
                                onClick$={() => clearQuoteDataOnLogoClick$()}
                                >
                                    <ImgContinentalAssistLogotipo title='continental-assist-logotipo' alt='continental-assist-logotipo' style={{width:'auto', height:'50px'}} />
                                </a>
                            )}
                        </div>
                        
                        {/* Espacio para mantener el balance en desktop */}
                        <div style={{width: '120px'}}></div>
                    </div>
                    <div class="offcanvas offcanvas-start" tabIndex={-1} id="navbarOffcanvasLg" aria-labelledby="navbarOffcanvasLgLabel" style={{zIndex:3000}}>
                        <div class="offcanvas-header d-flex justify-content-end">
                            <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel"></h5>
                            <button title='Menu' aria-label="Menu" type='button' class="navbar-toggler" data-bs-dismiss="offcanvas">
                                <i class='fas fa-times'/>
                            </button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-center flex-grow-1">
                                <li class="nav-item">
                                    <a title='Nosotros' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/about-us" >¿Quiénes somos?</a>
                                </li>
                                <li class="nav-item">
                                    <a title='Contactanos' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/contact-us" >Contáctanos</a>
                                </li>
                                <li class="nav-item">
                                    <a title='chatpdf' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/chat-conditions" >Chatea con nuestras Condiciones</a>
                                </li>
                                <li class="nav-item">
                                    <a title='Buscar Voucher' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/search-voucher" >Busca tu voucher</a>
                                </li>
                                <li class="nav-item">
                                    <a title='Agentes' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="https://eva.continentalassist.com" target="_black" >Acceso agentes</a>
                                </li>
                                {
                                    country.value === 'CO' &&
                                    <li class="nav-item">
                                        <a title='Facturacion' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/invoice" >Facturación</a>
                                    </li>
                                }
                                {
                                    country.value === 'MX' &&
                                    <li class="nav-item">
                                        <a title='Facturacion' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/invoice" >Facturación</a>
                                    </li>
                                }
                                
                            </ul>
                        </div>
                    </div>
                    {
                        showLink.value
                        &&
                        <a onClick$={() => {
                            const el = document.getElementById('container-quote');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }} title='Quiero Comprar' href='/' type='button' id='btn-quotes-header' class="btn btn-primary" >¡Quiero comprar!</a>
                    }
                    {
                        showBtn.value
                        &&
                        <button onClick$={() => {
                            const el = document.getElementById('container-quote');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }} type='button' id='btn-quotes-header' class="btn btn-primary" >¡Quiero comprar!</button>

                    }
                    
                    
                    {
                        
                        pathNameURL.value != '/'&&pathNameURL.value.includes('quotes-engine') &&
                        <div class={'not-mobile'}>
                            
                                <QuotesEngineSteps active={stepsMap.value[pathNameURL.value].stepActive} name={stepsMap.value[pathNameURL.value].name} steps={4}/>
                          
                          {
                            pathNameURL.value === '/quotes-engine/step-2/'&&
                            <div class='icons mx-0' style={{border:'none',borderRadius:'33px', padding:'9px 0 9px 9px',margin:'0px', minWidth:'120px'}} >
                                    <i class="fa-solid fa-basket-shopping text-end" style={{paddingRight:'5px'}}/>
                                    <span id='header-step-currency' class='text-bold text-dark-blue'>                                                 
                                    {
                                    totalPay.value.total && (divisaManual.value == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) : CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate))
                                    }
                                    </span>
                            </div>
                          }

                          {/* Switch de divisa para step-1 en desktop */}
                          {
                            pathNameURL.value === '/quotes-engine/step-1/' &&
                            <div class="d-flex align-items-center mx-2">
                                <SwitchDivisa
                                    labels={['USD',stateContext.value?.currentRate?.code]}
                                    value={contextDivisa.divisaUSD ? 'base' : 'local'}
                                    onChange={$((e:any) => {changeDivisa$(e)})}
                                />
                            </div>
                          }

                          {/* Switch de divisa para step-2 en desktop */}
                          {
                            pathNameURL.value === '/quotes-engine/step-2/' &&
                            <div class="d-flex align-items-center mx-2">
                                <SwitchDivisa
                                    labels={['USD',stateContext.value?.currentRate?.code]}
                                    value={contextDivisa.divisaUSD ? 'base' : 'local'}
                                    onChange={$((e:any) => {changeDivisa$(e)})}
                                />
                            </div>
                          }

                          {/* Switch de divisa específico para step-3 */}
                          {
                            pathNameURL.value === '/quotes-engine/step-3/' &&
                            <div class="d-flex align-items-center mt-2">
                              
                              <SwitchDivisa
                                labels={['USD',stateContext.value?.currentRate?.code]}
                                value={contextDivisa.divisaUSD ? 'base' : 'local'}
                                onChange={$((e:any) => {changeDivisa$(e)})}
                              />
                            </div>
                          }

                                
                           {
                              pathNameURL.value != '/quotes-engine/step-1/'&&
                              pathNameURL.value != '/quotes-engine/step-2/'&&
                              pathNameURL.value != '/quotes-engine/step-3/'&&
                              pathNameURL.value != '/quotes-engine/step-4/'&&
                              pathNameURL.value != '/quotes-engine/message/' &&
                              <SwitchDivisa
                                    labels={['USD',stateContext.value?.currentRate?.code]}
                                    value={ contextDivisa.divisaUSD ? 'base' : 'local'}
                                    onChange={$((e:any) => {changeDivisa$(e)})}
                                />
                           }
                        
                                
                        
                        </div>
                    }
                    
                   
                </div> 
                
            </nav>
        </header>
    );
});
