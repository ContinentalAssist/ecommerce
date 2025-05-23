import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { WEBContext } from "~/root";
import styles from './index.css?inline'
import ImgContinentalAssistPrintTicket from '~/media/quotes-engine/continental-assist-print-ticket.webp?jsx'
import CurrencyFormatter from "~/utils/CurrencyFormater";
import { LoadingContext } from "~/root";


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
    //const loading = useSignal(true)
    const obj : {[key:string]:any} = {}
    const resume = useSignal(obj)
    const locationEnv = useLocation()
    const typeMessage = useSignal(0)
    const desktop = useSignal(false)
    const contextLoading = useContext(LoadingContext)


    const getVoucher = $( async( vouchercode: string)=>{
        let resVoucher : {[key:string]:any} = {}

        const resData = await fetch("/api/getVoucher",{method:"POST",body:JSON.stringify({codigovoucher:vouchercode})});
        const data = await resData.json()
        resVoucher = data

        if(resVoucher.error == false){
            resume.value = resVoucher.resultado[0]
            
            typeMessage.value = 1
    
        }
        contextLoading.value = {status:false, message:''};

    })

    useTask$(() => {        
        
        if(Object.keys(stateContext.value).length > 0)
        {
            resume.value = stateContext.value
            
            if (resume?.value?.codevoucher != ''&&resume?.value?.paymentstutus == 'completed') {
                if (stateContext?.value?.typeMessage == 1) {
                    getVoucher(resume?.value?.codevoucher);

                }
        
                
            }
            else{
                typeMessage.value =stateContext?.value?.typeMessage

            }
        }
    })

  
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async() => {        

        if (locationEnv.url.search.includes('id') || locationEnv.url.search.includes('env')) {
            //loading.value = true
         
            if(locationEnv.url.search.includes('id') && !locationEnv.url.search.includes('env'))
            {
                const resValidation = await fetch("/api/getValidationTransactionOP",{method:"POST",body:JSON.stringify({id:locationEnv.url.searchParams.get('id')})});
                const dataValidation = await resValidation.json()
                if(dataValidation.resultado?.status == 'completed')
                {
                    //voucher.value = {error:false,message:'Tu codigo de voucher es : '+dataValidation.resultado.order_id}
                    getVoucher(dataValidation.resultado.order_id)
                    
                }
                else
                {
                    //voucher.value = {error:true,message:'Hubo un error en tu transaccion'}
                    typeMessage.value = 4
                    //loading.value = false
                }
            }
            else
            {
                const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:locationEnv.url.searchParams.get('id')})});
                const dataValidation = await resValidation.json()
    
                if(dataValidation.resultado.status == 'APPROVED')
                {
                   getVoucher(dataValidation.resultado.reference)
    
                   // voucher.value = {error:false,message:'Tu codigo de voucher es : '+dataValidation.resultado.reference}
                 
                }
                else
                {
                   // voucher.value = {error:true,message:dataValidation.resultado.status_message}
                   typeMessage.value = 4
                   //loading.value = false
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
        contextLoading.value = {status:false, message:''};

    })


    const redirectHome$ = $(() => {
        navigate('/');
        setTimeout(() => location.reload(), 300);
    })
   
    return(
        <div class='container-fluid px-0' style={{paddingTop:'78px'}}>


            <div class='container-fluid'>
                <div class='row bg-message'>
                    <div class='col-xl-12'>
                        <div class='container mt-5'>

                            <div class="row">
                                <div class='col-lg-12 col-xl-12 mt-5'>
                                {
                                 Number(typeMessage.value) == 1 
                                 &&<div class="row justify-content-center"  >
                                    <div class='col-lg-12 text-center mt-5' >
                                          <p class="h1 text-semi-bold text-blue"><i class="fa-regular fa-circle-check fa-xl" style={{color:'green'}}/> Gracias por tu compra! </p>                                     
                                            <hr class='divider my-3'/>
                                            <br/>
                                          <span class="text-regular text-dark-gray ">En breve recibirás un correo con la confirmación de tu orden.</span>
                                        </div>
                             
                                <div class="col-lg-6 col-sm-12">
                                <ImgContinentalAssistPrintTicket class="img-ticket"  title='continental-assist-print-ticket' alt='continental-assist-print-ticket'/>
                                <div class="card" id="card-pax" style={{borderTopLeftRadius:'3px !important', borderTopRightRadius:'3px !important'}}>
                                    <div class="card-body">
                                        <div class="container  m-2">
                                        <div class="row not-mobile">
                                        <div class='col-lg-6 col-sm-12 '>                                                
                                            <div class="input-group">
                                               
                                                <p >
                                                <span class="text-regular text-dark-gray ps-0" style={{fontSize:'1.188rem'}}>Plan</span><br/>
                                                    <span class="text-bold text-light-blue" style={{fontSize:'1.375rem'}}>{resume.value?.nombreplan}
                                                </span>
                                                </p>                                                            
                                            </div>
                                        </div>
                                        <div class='col-lg-6 col-sm-12  text-end'>
                                                    <p class='text-regular text-dark-gray mb-0'  style={{fontSize:'1.188rem'}}>Código de voucher:</p>
                                                    <p class='text-semi-bold text-blue mb-4' style={{fontSize:'1.375rem'}}>
                                                         {resume.value.codigovoucher}
                                                    </p>
                                                </div>

                                        </div>
                                        <div class='row mobile text-center'>                                                
                                           <div class="col-sm-12">

                                           <p >
                                                <span class="text-regular text-dark-gray ps-0" style={{fontSize:'1.375rem'}}>Plan </span>
                                                    <span class="text-bold text-light-blue" style={{fontSize:'1.375rem'}}>{resume.value?.nombreplan}
                                                </span>
                                                </p> 

                                           </div>
                                           <div class="col-sm-12">
                                           <span class="text-regular text-dark-gray ps-0" style={{fontSize:'1.188rem',}}>Código de voucher:</span><br/>
                                                    <span class="text-bold text-dark-blue" style={{fontSize:'1.375rem'}}>{resume.value.codigovoucher}
                                                </span>
                                           </div>
                                            


                                                                                                           
                                        </div>

                                        
                                       
                                            <div class='col-lg-12 col-sm-12'>
                                            <hr/>
                                            <div class="input-group" style={{backgroundColor:'white'}}>
                                                <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                    <i class="fa-solid fa-plane-departure"/>
                                                </span>
                                                <p style={{marginLeft:'-6px'}}>
                                                <span class="text-regular text-dark-gray ps-0" style={{fontSize:'0.75rem'}}>Origen / Destino(s)</span> <br/>                                                                            
                                                <span class="text-bold text-dark-blue" style={{fontSize:'0.875rem'}}>{resume.value.nombrepais}  <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.destinos && String(resume.value.destinos).replaceAll(',',', ')}</span>
                                                </p>                                                            
                                            </div>
                                            </div> 
                                            <div class='col-lg-12 col-sm-12'>
                                                <div class="input-group" >
                                                    <span class="input-group-text border border-0 " style={{backgroundColor:'white'}}>
                                                        <i class="far fa-calendar"/>
                                                    </span>
                                                    <p style={{textAlign:'left'}}>
                                                    <span class="text-regular text-dark-gray ps-0" style={{fontSize:'0.75rem'}}>Fechas de tu viaje</span> <br/>                                                                            
                                                        <span class="text-bold text-dark-blue" style={{fontSize:'0.875rem'}}> {resume.value.fechadesde} <span class='text-semi-bold text-dark-blue'> al </span>{resume.value.fechahasta}</span>
                                                    </p>                                                            
                                                </div>
                                                <hr/>
                                            </div>
                                            
                                    

                                            
                                            <div class="row not-mobile">
                                              {/*   <div class="col-lg-6 col-sm-12 mt-4">
                                                    <button type='button' class='btn btn-primary btn-lg' >Descargar vouchers</button>
                                                </div> */}

                                                <div class='col-lg-12 col-sm-12  text-end'>
                                                    <p class='text-regular text-blue mb-0'>Total</p>
                                                    <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                        {
                                                            CurrencyFormatter(resume.value?.codigomoneda,resume.value?.total)
                                                        }
                                                    </h3>
                                                </div>
                                            </div>

                                            <div class="row mobile">

                                               
                                                <div class='col-sm-12  text-center'>
                                                    <p class='text-regular text-blue mb-0'>Total</p>
                                                    <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                        {
                                                            CurrencyFormatter(resume.value?.codigomoneda,resume.value?.total)
                                                        }
                                                    </h3>
                                                </div>

                                              {/*   <div class="col-sm-12 text-center mt-4">
                                                    <button type='button' class='btn btn-primary btn-lg' >Descargar vouchers</button>
                                                </div>
 */}
                                            </div>
                                           
                                       
                                        </div>
                                        
                                    </div>
                                </div>
                                </div>
                                <div class="row justify-content-center m-4" >
                                <div class='col-lg-6' >                                            
                                    <div class='d-grid gap-2'>
                                        <button type='button' class='btn btn-primary btn-lg' onClick$={()=>redirectHome$()}>Volver al inicio</button>
                                    </div>
                                </div>
                                </div>
                                </div>
                                  
                            }
                      
                            {
                               Number(typeMessage.value) == 2
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
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={()=>navigate('/quotes-engine/step-3')}>Intentar de nuevo</button>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                            }

                            {
                               Number(typeMessage.value) == 3
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
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={()=> redirectHome$()}>Volver al inicio</button>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                              
                            }

{
                               Number(typeMessage.value) == 4
                                &&<>
                                   <div class='row justify-content-center' style={{minHeight:'70vh'}}>                                  

                                        <div class='col-lg-12 text-center mt-5' >
                                          <p class="h1 text-semi-bold text-blue"><i class="fa-regular fa-circle-xmark fa-xl" style={{color:'red'}}/> Compra rechazada </p>                                     
                                            <hr class='divider my-3'/>
                                        </div>
                                        <div class='col-lg-6'>
                                            <h5 class='text-dark-blue mb-4 text-center'>Lo sentimos, tu pago ha sido rechazado.</h5> 
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary btn-lg' onClick$={()=> redirectHome$()}>Volver al inicio</button>
                                            </div>
                                        </div>
                                    </div>                               
                                </>
                            }
  

                                                              
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>

            

        </div>
    )
})