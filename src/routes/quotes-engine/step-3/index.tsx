import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import CurrencyFormatter from "~/utils/CurrencyFormater";

import ImgContinentalAssistPrintTicket from '~/media/quotes-engine/continental-assist-print-ticket.webp?jsx'
import ImgContinentalAssistTicket from '~/media/icons/continental-assist-ticket.webp?jsx'
import ImgContinentalAssistCalendar from '~/media/icons/continental-assist-calendar.webp?jsx'
import ImgContinentalAssistPosition from '~/media/icons/continental-assist-position.webp?jsx'

import styles from './index.css?inline'

export const head: DocumentHead = {
    title : 'Continental Assist | Resumen de compra',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Resumen de compra'},
        {name:'description',content:'Paso 3 - Resumen de compra. Continental Assist te ayuda a tener todo listo para tu viaje. Un plan de asistencia para que conectes con la tranquilidad.'},
        {property:'og:title',content:'Continental Assist | Resumen de compra'},
        {property:'og:description',content:'Paso 3 - Resumen de compra. Continental Assist te ayuda a tener todo listo para tu viaje. Un plan de asistencia para que conectes con la tranquilidad.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-3'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()

    const objectResume : {[key:string]:any} = {}

    const resume = useSignal(objectResume)
    const messageCupon = useSignal({error:'',cupon:{codigocupon:'',idcupon:0,porcentaje:0}})
    const loading = useSignal(true)
    const divisaManual = useSignal(stateContext.value.divisaManual)

    useVisibleTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            
            resume.value = stateContext.value
            loading.value = false
        }
        else
        {
            navigate('/quotes-engine/step-1')
        }
    })

    const getCupon$ = $(async() => {
        const input = document.querySelector('#input-cupon') as HTMLInputElement

        if(input.value != '')
        {
            const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                .then((response) => {return(response.json())})

            if(resGeo.ip_address != '' || resGeo.ip_ != undefined)
            {
                const dataRequest = {
                    idplan:resume.value.plan.idplan,
                    codigocupon:input.value,
                    ip:resGeo.ip_address
                }
                
                let resCupon : {[key:string]:any} = {}

                const resCuponValid = await fetch("/api/getCupon",{method:"POST",body:JSON.stringify(dataRequest)});
                const dataCupon = await resCuponValid.json()
                resCupon = dataCupon
    
                if(resCupon.error == false)
                {
                    const newResume = Object.assign({},resume.value)
                    const discount = newResume.total.total * parseFloat("0." + Number(resCupon.resultado[0].porcentaje))
                    const newTotal = newResume.total.total - discount
                    
                    newResume.subTotal = newResume.total.total
                    newResume.total = {divisa:newResume.total.divisa,total:newTotal}

                    resume.value = newResume

                    messageCupon.value = {error:'success',cupon:resCupon.resultado}
                }
                else
                {
                    messageCupon.value = {error:'error',cupon:{codigocupon:input.value,idcupon:0,porcentaje:0}}
                }
            }
        }
    })

    const getResume$ = $(async() => {
        const newResume = Object.assign({},resume.value)
        newResume.cupon = messageCupon.value.cupon;

        (window as any)['dataLayer'].push(
            Object.assign({
                'event': 'TrackEventGA4',
                'category': 'Flujo asistencia',
                'action': 'Paso 4 :: resumen de compra',
                'origen': newResume.paisorigen,
                'destino': newResume.paisesdestino,
                'desde': newResume.desde,
                'hasta': newResume.hasta,
                'adultos': newResume[70],
                'niños_y_jovenes': newResume[22],
                'adultos_mayores': newResume[85],
                'page': '/quotes-engine/step-3',
                'option': newResume.plan.nombreplan,
                'descuento': newResume.cupon.porcentaje,
                'cupon': newResume.cupon.codigocupon,
                'total': Math.ceil(newResume.total.total),
                'cta': 'ir a pagar',
            },stateContext.value.dataLayerPaxBenefits)
        );

        stateContext.value = newResume

        await navigate('/quotes-engine/step-4')
    })

    const sendQuote$ = $((e:any) => {
        const form = document.querySelector('#form-send') as HTMLElement

        if(e.target.checked == false)
        {
            form.classList.add('d-none')
        }
        else
        {
            form.classList.remove('d-none')
        }
    })

    const getSendQuote$ = $(async() => {
        const form = document.querySelector('#form-send-quote') as HTMLFormElement
        const inputs = Array.from(form.querySelectorAll('input'))
        const bs = (window as any)['bootstrap']
        const toastSuccess = new bs.Toast('#toast-success',{})
        const toastError = new bs.Toast('#toast-error',{})
        let error = false
        const dataForm : {[key:string]:any} = {}

        if(!form.checkValidity())
        {
            form.classList.add('was-validated')
            error = true
        }
        else
        {
            form.classList.remove('was-validated')
            
            inputs.map((input) => {
                dataForm[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })
        }

        if(error == false)
        {
            const planescotizados : any[] = []

            resume.value.planescotizados.map((plan:any) => {
                planescotizados.push({idplan:plan.idplan,precio:plan.precio_grupal})
            })

            dataForm.cotizacion = { 
                fecha:{desde:resume.value.desde,hasta:resume.value.hasta,dias:resume.value.dias}, 
                origen:resume.value.origen,
                destinos:resume.value.destinos,
                pasajeros:resume.value.asegurados, 
                planfamiliar:resume.value.planfamiliar, 
                plan:{idplan:resume.value.plan.idplan,nombreplan:resume.value.plan.nombreplan,precio:resume.value.plan.precio_grupal}, 
                total:resume.value.total.total, 
                moneda:{codigomoneda:resume.value.total.divisa}, 
                planescotizados:planescotizados, 
                contacto:resume.value.contacto, 
                edades:resume.value.edades
            }

            let resQuote : {[key:string]:any} = {}

            const resSendQuote = await fetch("/api/getSendEmailQuote",{method:"POST",body:JSON.stringify(dataForm)});
            const dataSendQuote = await resSendQuote.json()
          
            resQuote = dataSendQuote

            if(resQuote.error == false)
            {
                toastSuccess.show()
            }
            else
            {
                toastError.show()
            }
        }
    })

    const openCollapsPax$ =$((toggle:boolean, key:string)=>{
        const bs = (window as any)['bootstrap']
       
        
        const collapseTwo = new bs.Collapse('#'+key,{})
        console.log(collapseTwo);
        collapseTwo.hide()

       // const collapse = new bs.Collapse('#collapseQuotesEngine',{})
       // bs.collapse('#collapseTwo').show();
    })

    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={3} />
            <div class='container-fluid bg-step-5'>
                <div class='row'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row align-content-center justify-content-center'>
                                <div class='col-lg-10 text-center mt-5 mb-3'>
                                    <h1 class='text-semi-bold text-blue'>
                                        <span class='text-tin'>Todo listo </span><br class='mobile'/> para tu viaje
                                    </h1>
                                    <hr class='divider my-3'/>
{/*                                     <h2 class='h2 text-dark-gray'>Resumen de compra</h2>
 */}                                </div>
                            </div>
                            <div class="row">
                                <div class='col-lg-12'>
                                    <div class='card card-body shadow-lg mb-5' style={{minHeight:'350px', marginBottom:'90px'}}>
                                    <div class='container'>
                                        <div class="row">
                                        <div class='col-lg-6'>
                                        <div class="card" style={{minHeight:'400px !important', position:'absolute', marginLeft:'-28px',marginTop:'-16px',maxWidth:'500px !important',width:'100%',zIndex:10 }}>
                                            <div class="card-body">                                          


                                            <ul class="list-group" id="list-pax">

                                                {
                                                    Object.keys(resume.value).length > 0
                                                    &&
                                                    resume.value.asegurados.map((pax:any,index:number) => {
                                                        {console.log(resume)} 
                                                        return (
                                                            <li class="list-group-item" key={index+1} >                                                            
                                                                <div class='row'>
                                                                    <div class='col-lg-12' >
                                                                        <p class='text-gray' style={{textAlign:'left', padding:0, margin:0}}>Viajero # {index+1}</p>
                                                                    </div>
                                                                </div>
                                                                <div class='row ' >
                                                                    <div class="col-lg-6">
                                                                    <h5 class="text-bold text-dark-blue" style={{textAlign:'left', marginBottom:0}} >{pax.nombres} {pax.apellidos}</h5>
                                                                    </div>
                                                                    <div class="col-lg-6 ">
                                                                    <p class='text-light-blue' style={{textAlign:'right', padding:0,margin:0, cursor:'pointer'}} onClick$={() => {openCollapsPax$(true,String("collapse-"+(index+1)) )}}>Ver detalles</p>
                                                                    </div>
                                                            
                                                                     <hr style={{backgroundColor:'#44d1fd',height:'4px',marginBottom:'0px',border:'none'}}/>

                                                                    <div id={"collapse-"+(index+1)} class="collapse" aria-labelledby="headingTwo" data-parent="#accordion" style={{backgroundColor:'#FAFAFA', marginLeft:0, marginRight:0}}>
                                                                        <div class="row">
                                                                            <div class='col-lg-6 col-xs-12'>
                                                                            <div class="input-group">
                                                                                <span class="input-group-text border border-0 ">
                                                                                    <i class="fa-solid fa-plane-departure"/>
                                                                                </span>
                                                                                <p style={{textAlign:'left'}}>
                                                                                <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Origen / Destino(s)</span> <br/>                                                                            
                                                                                <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.paisorigen} <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.paisesdestino && String(resume.value.paisesdestino).replaceAll(',',', ')}</span>
                                                                                </p>                                                            
                                                                            </div>
                                                                            </div>                                                                     
                                                                                                                                        
                                                                        
                                                                            <div class='col-lg-6 col-xs-12'>
                                                                                <div class="input-group">
                                                                                    <span class="input-group-text border border-0 ">
                                                                                        <i class="fa-solid fa-user-plus"/>
                                                                                    </span>
                                                                                    <p style={{textAlign:'left'}}>
                                                                                    <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Viajeros</span><br/>
                                                                                        <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.pasajeros}
                                                                                    </span>
                                                                                    </p>                                                            
                                                                                </div>
                                                                            
                                                                            </div>

                                                                            <div class='col-lg-12 col-xs-12'>
                                                                                <div class="input-group">
                                                                                    <span class="input-group-text border border-0 ">
                                                                                        <i class="far fa-calendar"/>
                                                                                    </span>
                                                                                    <p style={{textAlign:'left'}}>
                                                                                    <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Fechas de tu viaje</span> <br/>                                                                            
                                                                                        <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.desde} <span class='text-semi-bold text-dark-blue'> al </span> {resume.value.hasta}</span>
                                                                                    </p>                                                            
                                                                                </div>
                                                                            </div>

                                                                            <hr/>
                                                                            <div class='col-6'>
                                                                        
                                                                        
                                                                                <div class="input-group">
                                                                                    <span class="input-group-text border border-0 ">
                                                                                        <i class="fa-solid fa-clipboard-check"/>
                                                                                    </span>
                                                                                    <p style={{textAlign:'left'}}>
                                                                                    <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Plan</span><br/>
                                                                                        <span class="text-bold text-light-blue" style={{fontSize:'12px'}}>{resume.value.plan.nombreplan}
                                                                                    </span>
                                                                                    </p>                                                            
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-6">
                                                                                <p class="text-bold text-dark-blue text-end">{
                                                                                    divisaManual.value == true ? CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual * stateContext.value.currentRate.rate)
                                                                
                                                                                }</p>
                                                                            </div>

                                                                          

                                                                            {
                                                                                pax.beneficiosadicionales.length>0
                                                                                &&<>
                                                                                  <hr/>
                                                                                  <div class='col-lg-6 col-xs-12'>                                                                            
                                                                                    <div class="input-group">
                                                                                        
                                                                                        <p style={{textAlign:'left'}}>
                                                                                        <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Benenficios adicionales</span><br/>
                                                                                       </p>                                                            
                                                                                    </div>
                                                                                    </div>
                                                                                </>
                                                                                
                                                                                
                                                                            }
                                                                            
                                                                            
                                                                           
                                                                            <ul style={{height:'60px'}}>
                                                                                {
                                                                                    pax.beneficiosadicionales.map((benefit:any,iBenefit:number) => {
                                                                                        return(
                                                                                            <li key={iBenefit} class='text-semi-bold text-blue' style={{fontSize:'14px'}}>
                                                                                                <div class='row'>
                                                                                                    <div class='col-lg-6 col-xs-12'>
                                                                                                    {benefit.nombrebeneficioadicional}
                                                                                                    </div>         
                                                                                                    <div class='col-lg-6 col-xs-12'>
                                                                                                        <span style={{float:'right'}}>
                                                                                                            {
                                                                                                                divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                                                                            }
                                                                                                        </span>
                                                                                                                
                                                                                                    </div>                                                                       
                                                                                                </div>
                                                                                         </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                    </div>
                                                                                                                
                                                                    </div>
                                                                </div>
                                                        
                                                            </li>

                                                        )
                                                    })
                                                }

                                                {
                                                     Object.keys(resume.value).length > 0
                                                     && <li class="list-group-item" key="key-1" >
                                                            <div class='row'>
                                                                <div class='col-lg-12 text-end' >
                                                                    <span class='text-semi-bold text-gray' style={{ padding:0, margin:0}}>Subtotal</span><br/>
                                                                    <span class='text-bold text-dark-blue'> {
                                                                    divisaManual.value == true ? CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precio_grupal) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precio_grupal * stateContext.value.currentRate.rate)
                                                                    }</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                }
                                            
                
                                            </ul>
                                       
                                            </div>
                                                                                 
                                           
                                        </div>
                                        </div>
                                        <div class='col-lg-6'>
                                         <div class='container px-2 pt-4 pb-2'>
                                                        <div class='row mb-4'>
                                                            <div class='col-lg-12'>
                                                                <div class='container'>
                                                                    
                                                                    <div class='row row-mobile'>
                                                                        <div class='col-xl-12 col-sm-12 col-12'>
                                                                            <input 
                                                                                id='input-cupon' 
                                                                                name='cupon' 
                                                                                type='text' 
                                                                                class='form-control' 
                                                                                placeholder="¿Tienes algún cupón de descuento?"
                                                                                disabled={messageCupon.value.error == 'success'}
                                                                                onBlur$={getCupon$}
                                                                            />
                                                                        </div>
                                                                        <hr/>
                                                                        {
                                                                            messageCupon.value.error != ''
                                                                            &&
                                                                            <div class='col-lg-12 mt-3'>
                                                                                {
                                                                                    messageCupon.value.error == 'error'
                                                                                    &&
                                                                                    <div class="alert alert-danger text-semi-bold text-blue mb-0" role="alert">
                                                                                        Cupón <span class='text-semi-bold text-danger'>{messageCupon.value.cupon.codigocupon} no es valido!</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    messageCupon.value.error == 'success'
                                                                                    &&
                                                                                    <div class="alert alert-success text-semi-bold text-blue mb-0" role="alert">
                                                                                        Cupón <span class='text-semi-bold text-success'>{messageCupon.value.cupon.codigocupon}</span> aplicado con exito!
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='row align-items-end justify-content-center'>
                                                            <div class='col-lg-12 col-10 text-end'>
                                                                <p class='text-regular text-blue mb-0'>Total</p>
                                                                <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                                    {
                                                                        resume.value.total && (divisaManual.value == true ? CurrencyFormatter(resume.value.total.divisa,resume.value.total.total) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.total.total * stateContext.value.currentRate.rate))
                                                                    }
                                                                </h3>
                                                            </div>
                                                            <div class='col-lg-4 col-10'>
                                                                <div class='d-grid gap-2'>
                                                                    <button class='btn btn-primary mb-0' onClick$={getResume$}>Ir a pagar</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            resume.value.idcotizacion == undefined
                                                            &&
                                                            <div id='buttons' class='row row-mobile mt-4 text-center'>
                                                                <div class='col-lg-6 col-md-6 col-12'>
                                                                    <div class="form-check form-check-inline">
                                                                        <input 
                                                                            class="form-check-input" 
                                                                            type="checkbox" 
                                                                            id={"send-quote"} 
                                                                            name='sendquote' 
                                                                            onClick$={(e) => {sendQuote$(e)}}
                                                                        />
                                                                        <label class="form-check-label" for={"send-quote"}>Enviar cotización</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }


                                                            <div id='form-send' class='row mt-3 d-none'>
                                                                <hr></hr>
                                                                <div class='col-lg-12'>
                                                                    <Form 
                                                                        id='form-send-quote'
                                                                        form={[{row:[
                                                                            {size:'col-lg-6',type:'text',label:'Nombre',placeholder:'Nombre',name:'nombre',required:true},
                                                                            {size:'col-lg-6',type:'email',label:'Correo',placeholder:'Correo', name:'correo',required:true}
                                                                        ]}]}
                                                                    />
                                                                </div>
                                                                <div class='col-lg-2 col-md-6 col-12'>
                                                                    <div class='d-grid gap-2'>
                                                                        <label for='btnSendQuote'></label>
                                                                        <button id='btnSendQuote' class='btn btn-success btn-lg mt-4' onClick$={getSendQuote$}>Enviar</button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                         </div>
                                        </div>

                                        </div>
                                    </div>
                                        
                                    </div>                            
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="toast-container position-fixed bottom-0 p-3">
                <div id='toast-success' class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <div class='message'>
                                <i class="fas fa-check-circle"/>
                                <span  class='text-start'>
                                    <b>Tu cotizacion se ha enviado!</b>
                                    <br/>
                                    <small>Por favor revisa tu bandeja de entrada o spam.</small>
                                </span>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
                <div id='toast-error' class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <div class='message'>
                                <i class="fas fa-times-circle"/>
                                <span class='text-start'>
                                    <b>Ocurrio un error!</b>
                                    <br/>
                                    <small>Si el error persiste llama a nuestros números de contacto.</small>
                                </span>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </>
    )
})