import { $, component$, useOnWindow, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import styles from './header.css?inline';
import { useLocation } from '@builder.io/qwik-city';

export const Header = component$(() => {
    useStyles$(styles);

    const location = useLocation()

    const showBtn = useSignal(false)
    const showLink = useSignal(false)

    useTask$(() => {
        if(location.url.pathname != '/' && !location.url.pathname.includes('quotes-engine'))
        {
            showLink.value = true
        }
    })

    useOnWindow('scroll',$(() => {
        if(location.url.pathname == '/')
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
        }
    }))

    const getQuotes$ = $(() => {
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
            (window as any)['dataLayer'].push({
                'event': 'TrackEventGA4',
                'category': 'interacciones usuarios',
                'action': 'clic',
                'label': '¡quiero comprar!',
                'Page': '/'+location.url.pathname.split('/')[1],
            })
        }
    })

    const getLocation$ = $((e:any) => {
        (window as any)['dataLayer'].push({
            'event': 'TrackEventGA4',
            'category': 'interacciones usuarios',
            'action': 'menu',
            'label': e.target.innerHTML,
            'page': e.target.href
        });
    })

    return (
        <header>
            <nav class={location.url.pathname === '/' ? 'navbar fixed-top' : 'navbar bg-light fixed-top'}>
                <div class="container pt-2 pb-2">
                    <button id='Menu' class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvasLg" aria-controls="navbarOffcanvasLg" aria-label='Menu'>
                        <i class="fas fa-bars"></i>
                    </button>
                    <a class="navbar-brand" href="/" title="Inicio" >
                        <img src='/assets/img/ca/continental-assist-logotipo.webp' width={180} height={58} alt='continental-assist-logotipo' title='continental-assist-logotipo'/>
                    </a>
                    <div class="offcanvas offcanvas-start" tabIndex={-1} id="navbarOffcanvasLg" aria-labelledby="navbarOffcanvasLgLabel">
                        <div class="offcanvas-header">
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
                                    <a title='Buscar Voucher' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="/search-voucher" >Busca tu voucher</a>
                                </li>
                                <li class="nav-item">
                                    <a title='Agentes' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="https://www.continentalassist.co/backmin/signin.php" target="_black" >Acceso agentes</a>
                                </li>
                                <li class="nav-item">
                                    <a title='Corporativos' class="nav-link text-semi-bold text-dark-blue" onClick$={(e) => {getLocation$(e)}} href="https://www.continentalassist.co/backmin/corp/signin.php" target="_black" >Acceso corporativo</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {
                        showLink.value
                        &&
                        <a title='Quiero Comprar' href='/' type='button' id='btn-quotes-header' class="btn btn-primary" onClick$={getQuotes$}>¡Quiero comprar!</a>
                    }
                    {
                        showBtn.value
                        &&
                        <button type='button' id='btn-quotes-header' class="btn btn-primary" onClick$={getQuotes$}>¡Quiero comprar!</button>
                    }
                </div>
            </nav>
        </header>
    );
});
