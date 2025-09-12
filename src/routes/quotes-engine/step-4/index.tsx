import {  component$, Fragment, useContext, useSignal, useStylesScoped$, useTask$,useVisibleTask$,$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import styles from './index.css?inline'
import Wompi from "./wompi";
import OpenPay from "./openPay";
import Authorize from "./authorize";
import { useNavigate } from '@builder.io/qwik-city';
import { LoadingContext } from "~/root";

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
    const contextLoading = useContext(LoadingContext)
    const navigate = useNavigate()

    // const navigate = useNavigate()

    const formPayment = useSignal('')
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
        contextLoading.value = {status:false, message:''}

    })

     const redirectHome$ = $(() => {
            navigate('/');
            setTimeout(() => location.reload(), 300);
        })


    return(
        <div class='container-fluid px-0'>
        

                <div class='container-fluid'>
                <div class='row bg-step-6'>
                    <div class='col-xl-12'>

                    
                          
                         <div class='container'>
                            <div class='row  justify-content-center'>

                                {
                                      stateContext?.value?.total?.total === undefined ?
                                      <Fragment>
                                        <div class='col-lg-12 text-center  mb-5'>
                                              <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                              <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                      </div>
                                        <div class="row justify-content-center m-4" >
                                        <div class='col-lg-6' >                                            
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={()=>redirectHome$()}>Volver al inicio</button>
                                            </div>
                                        </div>
                                        </div>

                                      </Fragment>
                                      
                                    :
                                    <div class='col-lg-10 text-center'>
                                     <h3 class='text-semi-bold text-blue'>Método de pago</h3>                                   
                                    <hr class='divider my-4'/>
                                    </div>
                                }
                            
                            </div>

                            
                            {
                                   stateContext?.value?.total?.total != undefined ?
                                   <div class="row">
                                   <div class='col-lg-12 col-xl-12'>
   
                                   <br/>
                               <br/>
                               {
                                   formPayment.value == 'wompi'
                                   &&
                                   <Wompi />
                               }
                               {
                                   formPayment.value == 'openPay'
                                   &&
                                   <OpenPay />
                               }
                               {
                                   formPayment.value == 'authorize'
                                   &&
                                   <Authorize />
                               }
                                                                 
                                   </div>
                               </div>: null
                            }
                           
                            <br/>
                        </div>

                    
                        
                    </div>
                </div>
            </div>
            

           
            

        </div>
    )
})