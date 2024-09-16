import { $, component$, useContext, useSignal, useStylesScoped$, useTask$,useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import styles from './index.css?inline'
import Wompi from "./wompi";
import OpenPay from "./openPay";
import Authorize from "./authorize";

export const head: DocumentHead = {
    title : 'Continental Assist | Método de pago',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Método de pago'},
        {name:'description',content:'Paso 4 - Método de pago. Continental Assist protege tu información y tu medio de pago. Adquiere nuestros planes con total seguridad.'},
        {property:'og:title',content:'Continental Assist | Método de pago'},
        {property:'og:description',content:'Paso 4 - Método de pago. Continental Assist protege tu información y tu medio de pago. Adquiere nuestros planes con total seguridad.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-4'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const contextDivisa = useContext(DIVISAContext)

    // const navigate = useNavigate()

    const formPayment = useSignal('')
    const messageLoading = useSignal('')
    const loading = useSignal(false)
    const desktop = useSignal(false)

    useTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            if(contextDivisa.divisaUSD == true)
            {
                formPayment.value = 'authorize' 
            }
            else
            {                          
                if(stateContext.value.resGeo.country == 'CO')
                {
                    formPayment.value = 'wompi' 
                }
                else if(stateContext.value.resGeo.country == 'MX')
                {
                    formPayment.value = 'openPay' 
                }
                else
                {
                    formPayment.value = 'authorize' 
                }
            }
        }
    })

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {        
        if(!navigator.userAgent.includes('Mobile'))
        {
            desktop.value = true
        }
    })

    const getLoading$ = $((status:boolean, message: string) => {        
        loading.value = status;
        messageLoading.value =message;      
    })

    return(
        <div class='container-fluid px-0' style={{paddingTop:'78px'}}>
        
            <div class='row not-mobile'>
                <div class='col-12'>
                    <div class={desktop.value == true ? 'container-fluid steps-float' : 'container'}>
                        <div class='row'>
                            <div class='col-12'>
                                <div class='container'>
                                    <div class={desktop.value == true ? 'row justify-content-end mx-0' : 'row'}>
                                        
                                        <div class='col-md-3  d-flex  justify-content-end'>
                                            <QuotesEngineSteps active={4} name={'Método'} steps={5}/>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class='row mobile  text-center justify-content-center align-items-center' >
            <hr class='m-0' />
                <div class='col-xs-12 d-flex justify-content-center align-items-center '  style={{padding:'20px'}} >
                    <QuotesEngineSteps  active={4} name={'Método'} steps={5}/>
                </div>

              
            </div>

            <div class='container-fluid'>
                <div class='row bg-step-5'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row  justify-content-center'>
                            <div class='col-lg-10 text-center mt-5 mb-3'>
                                     <h1 class='text-semi-bold text-blue'>Método de pago</h1>                                   
                                    <hr class='divider my-3'/>
                              </div>
                            </div>

                            <br/>
                            <div class="row">
                                <div class='col-lg-12 col-xl-12'>

                                <br/>
                            <br/>
                            {
                                formPayment.value == 'wompi'
                                &&
                                <Wompi setLoading={getLoading$}/>
                            }
                            {
                                formPayment.value == 'openPay'
                                &&
                                <OpenPay setLoading={getLoading$}/>
                            }
                            {
                                formPayment.value == 'authorize'
                                &&
                                <Authorize setLoading={getLoading$}/>
                            }
                                                              
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
            {
            loading.value === true
            &&
            <Loading message={messageLoading.value}/>
            }
            

        </div>
    )
})