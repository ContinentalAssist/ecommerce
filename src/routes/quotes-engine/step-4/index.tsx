import { $, component$, useContext, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
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
    // const navigate = useNavigate()

    const formPayment = useSignal('')
    const divisaManual = useSignal(stateContext.value.divisaManual)
    const loading = useSignal(true)

    useTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            if(divisaManual.value == true)
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

    // const closeQuote$ = $(() => {
    //     const bs = (window as any)['bootstrap']
    //     const modalErrorAttemps = bs.Modal.getInstance('#modalErrorAttemps',{})
    //     modalErrorAttemps.hide()

    //     stateContext.value = {}
    // })

    const getLoading$ = $((status:boolean) => {        
        loading.value = status
    })
   
    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={4} hideForm/>
            <div class='container-fluid'>
                <div class='row bg-step-5'>
                    <div class='col-lg-12'>
                        <div class='container p-0'>
                            <div class='row align-content-center justify-content-center'>
                                <div class='col-lg-10 text-center mt-5'>
                                    <h1 class='text-semi-bold text-blue'>Método de pago</h1>
                                    <hr class='divider my-3'/>
                                </div>
                            </div>
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
                </div>
            </div>
        </>
    )
})