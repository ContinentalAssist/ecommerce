import { $, component$, Slot,  useStyles$ ,useContext, useSignal, useTask$} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { RequestHandler } from '@builder.io/qwik-city';
import { Header } from '~/components/starter/header/Header';
import { Footer } from '~/components/starter/footer/Footer';
import styles from './index.css?inline';
import { ChatGenesys } from '~/components/starter/chat-genesys/ChatGenesys';
import ImgContinentalAssistGroupPlan from '~/media/icons/continental-assist-group-plan.webp?jsx'
import {  useLocation, useNavigate } from '@builder.io/qwik-city';
import { Loading } from '~/components/starter/loading/Loading';
import { LoadingContext } from "~/root";
import { WEBContext } from "~/root";
import { QuotesResume } from '~/components/starter/quotes-resume/QuotesResume';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 1,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString(),
    };
});


/* export const useRedirectIfQuotesEngine = routeLoader$(({ redirect, request, url }) => {
    const referer = request.headers.get('referer');

    // Verifica si la URL contiene 'quotes-engine/' y no hay referer
    if (url.pathname.includes('/quotes-engine/message/') && !referer) {
        throw redirect(302, '/');
    }
}); */

export default component$(() => {
    useStyles$(styles);
        const navigate = useNavigate()
        const location = useLocation()
        const contextLoading = useContext(LoadingContext)
        const stateContext = useContext(WEBContext)
        const pathNameURL = useSignal('')
        
        // Task para actualizar la URL
        useTask$(({ track }) => {
            const pathName = track(() => location.url.pathname);  
            pathNameURL.value = pathName;
        });


    
    //const showChat = useSignal(false);

/*     useVisibleTask$(()=>{
       
        setInterval(() => {
            if ((window as any)['Genesys']&& !showChat.value) {
                const WGenesys = (window as any)['Genesys']

                //Inicia chat
                WGenesys("command", "Messenger.open", {},
                    function(o:any){
                        showChat.value =true;

                    },  // if resolved
                  )

                  WGenesys("subscribe", "MessagingService.conversationCleared", function(data:any){

                    showChat.value =false;
                });
                  
            }
        }, 5000);
       
    
    }) */

    const getGroupPlan$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const modal = bs.Modal.getInstance('#modalGroupPlan',{})
        modal.hide()
        if (location.url.pathname == '/') {
            await navigate('/quotes-engine/step-1')
        }
        
    })



    return (
        <>
            <Header />
            {
                pathNameURL.value != '/' && pathNameURL.value.includes('quotes-engine') &&
                <div style={{background: '#F4F4F4', padding: '120px 6% 9px 6%'}}>
                    <QuotesResume />
                </div>
            }
            <main>
            {
                stateContext.value.isMobile === false?
                <ChatGenesys></ChatGenesys>: null
            }
            

                <Slot />
                <div id='modalGroupPlan' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header p-2">
                            <ImgContinentalAssistGroupPlan class='img-fluid' loading="lazy" title='continental-assist-group-plan' alt='continental-assist-group-plan' />
                            <h2 class='text-semi-bold text-white p-2'>¡Genial!</h2>
                        </div>
                        <div class="modal-body">
                            <p class='text-blue'>
                                Parece que la cantidad de viajeros y las edades ingresadas, aplican para nuestro plan familiar.
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
            contextLoading.value.status === true
            &&
            <Loading message={contextLoading.value.message}/>
            }
            </main>
            <Footer />
        </>
    );
});
