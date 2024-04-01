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

    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={3} hideForm/>
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
                                    <h2 class='h2 text-dark-gray'>Resumen de compra</h2>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <div class='card card-body shadow-lg mb-5'>
                                        <div class='container'>
                                            <div class='row mt-2 not-mobile'>
                                                <div class='col-lg-6'>
                                                    <div id="carouselPaxs" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true" data-bs-interval='5200'>
                                                        <div class="carousel-indicators">
                                                            {
                                                                Object.keys(resume.value).length > 0
                                                                &&
                                                                resume.value.asegurados.map((pax:any,index:number) => {
                                                                    return(
                                                                        <button key={index} type="button" data-bs-target="#carouselPaxs" data-bs-slide-to={index} class={index == 0 ? "active" : ''}></button>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div class="carousel-inner">
                                                            {
                                                                Object.keys(resume.value).length > 0
                                                                &&
                                                                resume.value.asegurados.map((pax:any,index:number) => {
                                                                    return(
                                                                        <div key={index} class={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                                            <div class='container'>
                                                                                <div class='row justify-content-center'>
                                                                                    <div class='col-lg-12 text-center'>
                                                                                        <ImgContinentalAssistPrintTicket style={{width:'100%',height:'20px'}} title='continental-assist-print-ticket' alt='continental-assist-print-ticket'/>
                                                                                        <div class='card-pax card mb-5 mx-4 shadow-lg'>
                                                                                            <div class='card-body'>
                                                                                                <div class='container'>
                                                                                                    <div class='row'>
                                                                                                        <div class='col-lg-12 text-center'>
                                                                                                            <p class='text-semi-bold text-blue'>Viajero #{index+1}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class='row row-mobile mb-2'>
                                                                                                        <div class='col-lg-12 text-center card-title'>
                                                                                                            <h5 class='text-white'>{pax.nombres} {pax.apellidos}</h5>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class='row row-mobile'>
                                                                                                        <div class='col-lg-8 text-start'>
                                                                                                            <div class='d-flex' style={{alignItems:'center'}}>
                                                                                                                <ImgContinentalAssistTicket style={{height:'45px',width:'auto'}} title='continental-assist-ticket' alt='continental-assist-ticket'/>
                                                                                                                <div>
                                                                                                                    <p class='m-0 text-gray' style={{fontSize:'12px'}}>Plan</p>
                                                                                                                    <p class='m-0 text-semi-bold text-blue' style={{fontSize:'20px'}}>
                                                                                                                        {resume.value.plan.nombreplan}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class='col-lg-4 text-start'>
                                                                                                            <p class='text-gray mb-0' style={{fontSize:'12px'}}>Subtotal</p>
                                                                                                            <p class='text-semi-bold text-blue mb-0'>
                                                                                                                {
                                                                                                                    divisaManual.value == true ? CurrencyFormatter(resume.value.plan.codigomonedapago,resume.value.plan.precioindividual) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual * stateContext.value.currentRate.rate)
                                                                                                                }
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <hr/>
                                                                                                    <div class='row row-mobile'>
                                                                                                        <div class='col-lg-12 text-start'>
                                                                                                            <span class='text-gray' style={{fontSize:'12px',float:'left'}}>Beneficios Adicionales</span>
                                                                                                            <span class='text-gray' style={{fontSize:'12px',float:'right'}}>Subtotal</span>
                                                                                                            <br/>
                                                                                                            <ul style={{height:'60px'}}>
                                                                                                                {
                                                                                                                    pax.beneficiosadicionales.map((benefit:any,iBenefit:number) => {
                                                                                                                        return(
                                                                                                                            <li key={iBenefit} class='text-semi-bold text-blue' style={{fontSize:'14px'}}>{benefit.nombrebeneficioadicional} 
                                                                                                                                <span style={{float:'right'}}>
                                                                                                                                    {
                                                                                                                                        divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                                                                                                    }
                                                                                                                                </span>
                                                                                                                            </li>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> 
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='col-lg-6'>
                                                    <div class='container px-2 pt-4 pb-2'>
                                                        <div class='row mb-4'>
                                                            <div class='col-lg-6 col-sm-6 col-12'>
                                                                <span class='text-semi-bold text-dark-blue'>
                                                                    <ImgContinentalAssistCalendar class='img-fluid' title='continental-assist-calendar' alt='continental-assist-calendar'/> 
                                                                    Fechas de tu viaje
                                                                </span>
                                                                <h6>
                                                                    <span class='text-dark-gray'>{resume.value.desde}</span>
                                                                    <span class='text-semi-bold text-dark-blue'> al </span>
                                                                    <span class='text-dark-gray'>{resume.value.hasta}</span>
                                                                </h6>
                                                            </div>
                                                            <div class='col-lg-6 col-sm-6 col-12'>
                                                                <span class='text-semi-bold text-dark-blue'>
                                                                    <ImgContinentalAssistPosition class='img-fluid' title='continental-assist-position' alt='continental-assist-position'/> 
                                                                    Ubicación de tu viaje
                                                                </span>
                                                                <h6>
                                                                    <span class='text-dark-gray'>{resume.value.paisorigen} <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.paisesdestino && String(resume.value.paisesdestino).replaceAll(',',', ')}</span>
                                                                </h6>
                                                            </div>
                                                        </div>
                                                        <div class='row mb-4'>
                                                            <div class='col-lg-12'>
                                                                <span class='form-label text-semi-bold text-dark-blue'>
                                                                    <ImgContinentalAssistTicket class='img-fluid' style={{transform:'rotate(90deg)'}} title='continental-assist-ticket' alt='continental-assist-ticket'/> 
                                                                    ¿Tienes algún cupón de descuento?
                                                                </span>
                                                                <div class='container p-0'>
                                                                    <div class='row row-mobile'>
                                                                        <div class='col-xl-12 col-sm-12 col-12'>
                                                                            <input 
                                                                                id='input-cupon' 
                                                                                name='cupon' 
                                                                                type='text' 
                                                                                class='form-control' 
                                                                                disabled={messageCupon.value.error == 'success'}
                                                                                onChange$={getCupon$}
                                                                            />
                                                                        </div>
                                                                        {
                                                                            messageCupon.value.error != ''
                                                                            &&
                                                                            <div class='col-lg-12 mt-3'>
                                                                                {
                                                                                    messageCupon.value.error == 'error'
                                                                                    &&
                                                                                    <div class="alert alert-danger text-semi-bold text-blue mb-0" role="alert">
                                                                                        {/* Cupón <span class='text-semi-bold text-danger'>{messageCupon.value.cupon.codigocupon} no es valido!</span> */}
                                                                                        Este cupón no es válido
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    messageCupon.value.error == 'success'
                                                                                    &&
                                                                                    <div class="alert alert-success text-semi-bold text-blue mb-0" role="alert">
                                                                                        {/* Cupón <span class='text-semi-bold text-success'>{messageCupon.value.cupon.codigocupon}</span> aplicado con exito! */}
                                                                                        Cupón aplicado con exito!
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='row align-items-end'>
                                                            <div class='col-lg-8'>
                                                                <p class='text-regular text-blue mb-0'>Total</p>
                                                                <h3 class='h1 text-semi-bold text-blue mb-0'>
                                                                    {
                                                                        resume.value.total && (divisaManual.value == true ? CurrencyFormatter(resume.value.total.divisa,resume.value.total.total) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.total.total * stateContext.value.currentRate.rate))
                                                                    }
                                                                </h3>
                                                            </div>
                                                            <div class='col-lg-4'>
                                                                <div class='d-grid gap-2'>
                                                                    <button class='btn btn-primary mb-0' onClick$={getResume$}>Ir a pagar</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            resume.value.idcotizacion == undefined
                                                            &&
                                                            <div id='buttons' class='row row-mobile mt-2'>
                                                                <div class='col-lg-6 col-md-6 col-12'>
                                                                    <div class="form-check form-check-inline mt-3">
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
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='row mt-2 mobile'>
                                                <div class='col-lg-6'>
                                                    <div class='container'>
                                                        <div class='row mb-4 justify-content-center'>
                                                            <div class='col-lg-6 col-sm-6 col-10 mb-3'>
                                                                <span class='text-semi-bold text-dark-blue'>
                                                                    <ImgContinentalAssistCalendar class='img-fluid' title='continental-assist-calendar' alt='continental-assist-calendar'/> 
                                                                    Fechas de tu viaje
                                                                </span>
                                                                <h6>
                                                                    <span class='text-dark-gray'>{resume.value.desde}</span>
                                                                    <span class='text-semi-bold text-dark-blue'> al </span>
                                                                    <span class='text-dark-gray'>{resume.value.hasta}</span>
                                                                </h6>
                                                            </div>
                                                            <div class='col-lg-6 col-sm-6 col-10'>
                                                                <span class='text-semi-bold text-dark-blue'>
                                                                    <ImgContinentalAssistPosition class='img-fluid' title='continental-assist-position' alt='continental-assist-position'/> 
                                                                    Ubicación de tu viaje
                                                                </span>
                                                                <h6>
                                                                    <span class='text-dark-gray'>{resume.value.paisorigen} <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.paisesdestino}</span>
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="carouselPaxs" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true" data-bs-interval='5200'>
                                                        <div class="carousel-indicators">
                                                            {
                                                                Object.keys(resume.value).length > 0
                                                                &&
                                                                resume.value.asegurados.map((pax:any,index:number) => {
                                                                    return(
                                                                        <button key={index} type="button" data-bs-target="#carouselPaxs" data-bs-slide-to={index} class={index == 0 ? "active" : ''}></button>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div class="carousel-inner">
                                                            {
                                                                Object.keys(resume.value).length > 0
                                                                &&
                                                                resume.value.asegurados.map((pax:any,index:number) => {
                                                                    return(
                                                                        <div key={index} class={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                                            <div class='container p-0'>
                                                                                <div class='row justify-content-center'>
                                                                                    <div class='col-lg-12 text-center'>
                                                                                        <ImgContinentalAssistTicket class='img-fluid' style={{width:'100%',height:'20px'}} title='continental-assist-ticket' alt='continental-assist-ticket'/> 
                                                                                        <div class='card-pax card mb-5 mx-2 shadow-lg'>
                                                                                            <div class='card-body'>
                                                                                                <div class='container'>
                                                                                                    <div class='row'>
                                                                                                        <div class='col-lg-12 text-center'>
                                                                                                            <p class='text-semi-bold text-blue'>Viajero #{index+1}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class='row row-mobile mb-2'>
                                                                                                        <div class='col-lg-12 text-center card-title'>
                                                                                                            <h5 class='h6 text-white'>{pax.nombres} {pax.apellidos}</h5>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class='row row-mobile'>
                                                                                                        <div class='col-lg-8 col-8 text-start'>
                                                                                                            <div class='d-flex' style={{alignItems:'center'}}>
                                                                                                                <ImgContinentalAssistTicket class='img-fluid' style={{height:'30px'}} title='continental-assist-ticket' alt='continental-assist-ticket'/>
                                                                                                                <div>
                                                                                                                    <p class='m-0 text-gray' style={{fontSize:'10px'}}>Plan</p>
                                                                                                                    <p class='m-0 text-semi-bold text-blue' style={{fontSize:'14px'}}>
                                                                                                                        {resume.value.plan.nombreplan}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class='col-lg-4 col-4 text-start'>
                                                                                                            <p class='text-gray mb-0' style={{fontSize:'10px'}}>Subtotal</p>
                                                                                                            <p class='text-semi-bold text-blue mb-0' style={{fontSize:'14px'}}>
                                                                                                                {
                                                                                                                    divisaManual.value == true ? CurrencyFormatter(resume.value.plan.codigomonedapago,resume.value.plan.precioindividual) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual * stateContext.value.currentRate.rate)
                                                                                                                }
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <hr/>
                                                                                                    <div class='row row-mobile'>
                                                                                                        <div class='col-lg-12 text-start'>
                                                                                                            <span class='text-gray' style={{fontSize:'10px',float:'left'}}>Beneficios Adicionales</span>
                                                                                                            <span class='text-gray' style={{fontSize:'10px',float:'right'}}>Subtotal</span>
                                                                                                            <br/>
                                                                                                            <ul style={{height:'60px'}}>
                                                                                                                {
                                                                                                                    pax.beneficiosadicionales.map((benefit:any,iBenefit:number) => {
                                                                                                                        return(
                                                                                                                            <li key={iBenefit} class='text-semi-bold text-blue' style={{fontSize:'12px'}}>{benefit.nombrebeneficioadicional} 
                                                                                                                                <span style={{float:'right'}}>
                                                                                                                                    {
                                                                                                                                        divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                                                                                                    }
                                                                                                                                </span>
                                                                                                                            </li>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> 
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='col-lg-6'>
                                                    <div class='container px-2 pt-4 pb-2'>
                                                        <div class='row mb-4'>
                                                            <div class='col-lg-12'>
                                                                <div class='container'>
                                                                    <span class='form-label text-semi-bold text-dark-blue' style={{fontSize:'12px'}}>
                                                                    <ImgContinentalAssistTicket class='img-fluid' style={{transform:'rotate(90deg)'}} title='continental-assist-ticket' alt='continental-assist-ticket'/>
                                                                        ¿Tienes algún cupón de descuento?
                                                                    </span>
                                                                    <div class='row row-mobile'>
                                                                        <div class='col-xl-12 col-sm-12 col-12'>
                                                                            <input 
                                                                                id='input-cupon' 
                                                                                name='cupon' 
                                                                                type='text' 
                                                                                class='form-control' 
                                                                                disabled={messageCupon.value.error == 'success'}
                                                                                onBlur$={getCupon$}
                                                                            />
                                                                        </div>
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
                                                            <div class='col-lg-8 col-10 text-start'>
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
                                                    </div>
                                                </div>
                                            </div>
                                            <div id='form-send' class='row mt-3 d-none'>
                                                <hr></hr>
                                                <div class='col-lg-10'>
                                                    <Form 
                                                        id='form-send-quote'
                                                        form={[{row:[
                                                            {size:'col-lg-6',type:'text',label:'Nombre',name:'nombre',required:true},
                                                            {size:'col-lg-6',type:'email',label:'Correo',name:'correo',required:true}
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