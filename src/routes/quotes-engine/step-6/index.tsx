import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import styles from './index.css?inline'
import { Loading } from "~/components/starter/loading/Loading";

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

    // const stateContext = useContext(WEBContext)
    // // const navigate = useNavigate()
    const location = useLocation()

    const loading = useSignal(true)
    const voucher = useSignal('')

    useVisibleTask$(async() => {
        if(location.url.search.includes('id') && !location.url.search.includes('env'))
        {
            const resValidation = await fetch("/api/getValidationTransactionOP",{method:"POST",body:JSON.stringify({id:location.url.searchParams.get('id')})});
            const dataValidation = await resValidation.json()

            if(dataValidation.resultado.status)
            {
                voucher.value = dataValidation.resultado.order_id
            }
        }
        else
        {
            const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:location.url.searchParams.get('id')})});
            const dataValidation = await resValidation.json()

            if(dataValidation.resultado.status)
            {
                voucher.value = dataValidation.resultado.reference
            }
        }

        loading.value = false
    })
   
    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <div class='container-fluid'>
                <div class='row bg-step-6'>
                    <div class='col-lg-12'>
                        <div class='container p-0'>
                            <div class='row align-content-center justify-content-center h-75'>
                                <div class='col-lg-10 text-center mt-5'>
                                    <h1 class='text-semi-bold text-blue'>Gracias por tu compra!</h1>
                                    <hr class='divider my-3'/>
                                    <h5 class='text-dark-gray mb-4'>Tu codigo de vocuher es : {voucher.value}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})