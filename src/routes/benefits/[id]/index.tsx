import { component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from '@builder.io/qwik-city';
import { Loading } from "~/components/starter/loading/Loading";
import styles from './index.css?inline'

export const head: DocumentHead = {
    title : 'Continental Assist | Beneficios',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Beneficios'},
        {name:'description',content:'Beneficios de tu plan. Continental Assist Tenemos beneficios ideales para ti.'},
        {property:'og:title',content:'Continental Assist | Beneficios'},
        {property:'og:description',content:'Beneficios de tu plan. Continental Assist Tenemos beneficios ideales para ti.'},
    ],
    links: [
        {rel:'canonical',href: 'https://continentalassist.com/contact-us'},
    ],
}

export default component$(() => {
    useStyles$(styles)
    
    const location = useLocation()

    const array : any[] = []

    const plan = useSignal('')
    const benefits = useSignal(array)
    const loading = useSignal(true)

    useVisibleTask$(async() => {
        const resBenefits = await fetch("/api/getBenefits",{method:"POST",body:JSON.stringify({idplan:Number(location.params.id)})});
        const dataBenefits = await resBenefits.json()

        plan.value = dataBenefits.resultado.nombreplan
        benefits.value = dataBenefits.resultado.beneficiosasignados

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
                <div class='row bg-step-3'>
                    <div class='col-lg-12'>
                        <div class='container mt-5'>
                            <div class='row'>
                                {
                                    benefits.value.length > 0
                                    ?
                                    <div class='col-lg-12 text-center mt-5 mb-5'>
                                        <h1 class='text-semi-bold text-dark-blue'>{plan.value}</h1>
                                        <hr class='divider my-3'/>
                                        <h5 class='text-dark-blue'>Tenemos beneficios ideales para ti</h5>
                                    </div>
                                    :
                                    <div class='col-lg-12 text-center mt-5 mb-5'>
                                        <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                        <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                    </div>
                                }
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <table class='table table-borderless table-striped'>
                                        <tbody>
                                            {
                                                benefits.value.map((benefit,iBenefit) => {
                                                    return(
                                                        <>
                                                            <tr key={iBenefit+1}>
                                                                <td class='tr-title text-semi-bold text-dark-blue'>{benefit.nombrefamilia}</td>
                                                            </tr>
                                                            {
                                                                benefit.beneficios.map((item:any,iItem:number) => {
                                                                    return(
                                                                        <tr key={iBenefit+'-'+iItem+1}>
                                                                            <td class='text-blue'>{item.nombrebeneficio}<span style={{float:'right'}}>{item.cobertura}</span></td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})