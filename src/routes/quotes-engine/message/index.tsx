import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import styles from './index.css?inline'
import ImgContinentalAssistPrintTicket from '~/media/quotes-engine/continental-assist-print-ticket.webp?jsx'
import CurrencyFormatter from "~/utils/CurrencyFormater";


export const head: DocumentHead = {
    title : 'Continental Assist | Mensaje de compra',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Mensaje de compra'},
        {name:'description',content:'Paso 6 - Mensaje de compra.'},
        {property:'og:title',content:'Continental Assist | Mensaje de compra'},
        {property:'og:description',content:'Paso 6 - Mensaje de compra. '},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/message'},
    ],
}


export default component$(() => {
    useStylesScoped$(styles)
    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()
    const loading = useSignal(false)
    const obj : {[key:string]:any} = {}
    const resume = useSignal(obj)
    const voucher =useSignal(obj)
    const beneficiarios = useSignal(Array)
    

    useVisibleTask$(()=>{
        if(Object.keys(stateContext.value).length > 0)
            {
                
                resume.value = stateContext.value

                
          
            }
        

    })

    useTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            loading.value = false
            resume.value = stateContext.value
            if (resume?.value?.hasOwnProperty('urlvoucher')&&resume?.value?.urlvoucher.length>0) {
                
                voucher.value= resume?.value?.urlvoucher[0]
                beneficiarios.value = resume?.value?.urlvoucher[0].beneficiarios
            }
        }
    })


  /*   const getLoading$ = $(() => {
        loading.value = false
    }) */

    const redirectHome$ = $(() => {
        navigate('/');
        setTimeout(() => location.reload(), 300);
    })
   
    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={5} hideForm steps={5}/>
            <div class='container-fluid'>
                <div class='row bg-message'>
                    <div class='col-lg-12'>
                        <div class='container p-0'>
                            {
                                 Number(stateContext.value.typeMessage) == 1 
                                 &&<div class="row justify-content-center"  >
                                    <div class='col-lg-12 text-center mt-5' >
                                          <p class="h1 text-semi-bold text-blue"><i class="fa-regular fa-circle-check fa-xl" style={{color:'green'}}/> Gracias por tu compra! </p>                                     
                                            <hr class='divider my-3'/>
                                        </div>
                             
                                <div class="col-lg-6 col-xs-12">
                                <ImgContinentalAssistPrintTicket class="img-ticket"  title='continental-assist-print-ticket' alt='continental-assist-print-ticket'/>
                                <div class="card" id="card-pax" style={{borderTopLeftRadius:'3px !important', borderTopRightRadius:'3px !important'}}>
                                    <div class="card-body">
                                        <div class="row">
                                        <div class='col-lg-6 col-xs-12'>                                                
                                            <div class="input-group">
                                                <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                    <i class="fa-solid fa-clipboard-check"/>
                                                </span>
                                                <p style={{textAlign:'left'}}>
                                                <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'14px'}}>Plan</span><br/>
                                                    <span class="text-bold text-light-blue" style={{fontSize:'16px'}}>{resume.value?.plan?.nombreplan}
                                                </span>
                                                </p>                                                            
                                            </div>
                                        </div>
                                        <div class='col-lg-6 col-xs-12'>                                                
                                            <div class="input-group">
                                                <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                    <i class="fa-solid fa-clipboard-check"/>
                                                </span>
                                                <p style={{textAlign:'left'}}>
                                                <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'14px',}}>Código de voucher:</span><br/>
                                                    <span class="text-bold text-dark-blue" style={{fontSize:'16px'}}>{voucher.value.codigovoucher}
                                                </span>
                                                </p>                                                            
                                            </div>
                                        </div>
                                        <hr/>
                                            <div class='col-lg-12 col-xs-12'>
                                            <div class="input-group" style={{backgroundColor:'white'}}>
                                                <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                    <i class="fa-solid fa-plane-departure"/>
                                                </span>
                                                <p style={{textAlign:'left'}}>
                                                <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Origen / Destino(s)</span> <br/>                                                                            
                                                <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{/* {resume.value.paisorigen} */} dasdsadsad <span class='text-semi-bold text-dark-blue'> a </span>sdsdfdsfdf {/* {resume.value.paisesdestino && String(resume.value.paisesdestino).replaceAll(',',', ')} */}</span>
                                                </p>                                                            
                                            </div>
                                            </div> 
                                            <div class='col-lg-12 col-xs-12'>
                                                <div class="input-group" >
                                                    <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                        <i class="far fa-calendar"/>
                                                    </span>
                                                    <p style={{textAlign:'left'}}>
                                                    <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Fechas de tu viaje</span> <br/>                                                                            
                                                        <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}> {resume.value.desde} <span class='text-semi-bold text-dark-blue'> al </span>{resume.value.hasta}</span>
                                                    </p>                                                            
                                                </div>
                                            </div>
                                            
                                            <div class='col-lg-12 col-xs-12'>
                                            <hr class='divider my-3'/>

                                            
                                            <div class="col-lg-12 col-xs-12">
                                                <button type='button' class='btn btn-primary btn-lg' >Descargar vouchers</button>
                                            </div>
          
                                            </div>
                                            <div class='col-lg-12  text-end'>
                                                        <p class='text-regular text-blue mb-0'>Total</p>
                                                        <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                            {
                                                               CurrencyFormatter(voucher.value?.codigomoneda,voucher.value?.total)
                                                            }
                                                        </h3>
                                                    </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div class="row justify-content-center" style={{margin:'5px'}}>
                                <div class='col-lg-6' >                                            
                                    <div class='d-grid gap-2'>
                                        <button type='button' class='btn btn-primary btn-lg' onClick$={(e)=>redirectHome$()}>Volver al inicio</button>
                                    </div>
                                </div>
                                </div>
                                </div>
                                  
                            }
                      
                            {
                               Number(stateContext.value.typeMessage) == 2
                                &&<>
                                   <div class='row justify-content-center' style={{minHeight:'70vh'}}>                                  

                                        <div class='col-lg-12 text-center mt-5' >
                                          <p class="h1 text-semi-bold text-blue"><i class="fa-regular fa-circle-xmark fa-xl" style={{color:'red'}}/> Compra rechazada </p>                                     
                                            <hr class='divider my-3'/>
                                        </div>
                                        <div class='col-lg-6'>
                                            <h5 class='text-dark-blue mb-4 text-center'>Lo sentimos, tu pago ha sido rechazado.<br/>
                                            Intenta nuevamente o cambia el método de pago.
                                            </h5> 
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={(e)=>navigate('/quotes-engine/step-3')}>Intentar de nuevo</button>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                            }

                            {
                               Number(stateContext.value.typeMessage) == 3
                               &&<>
                                   <div class='row justify-content-center' style={{minHeight:'70vh'}}>                                  
                                        <div class='col-lg-12 text-center mt-5' >
                                          <p class="h1 text-semi-bold text-blue"><i class="fa-regular fa-circle-xmark fa-xl" style={{color:'red'}}/> ¡Has realizado tres intentos! </p>                                     
                                            <hr class='divider my-3'/>
                                        </div>
                                 
                                        <div class='col-lg-6'>
                                            <h5 class='text-dark-blue mb-4 text-center'>Lo sentimos has superado el número de intentos permitidos.
                                            </h5> 
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={(e)=> redirectHome$()}>Volver al inicio</button>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                              
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})