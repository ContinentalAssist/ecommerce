import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import { EncryptAES } from "~/utils/EncryptAES";
import { CalculateAge } from "~/utils/CalculateAge";

import ImgContinentalAssistCard from '~/media/icons/continental-assist-card.webp?jsx'
import ImgContinentalAssistSuccess from '~/media/icons/continental-assist-success.webp?jsx'
import ImgContinentalAssistError from '~/media/icons/continental-assist-error.webp?jsx'

import styles from './index.css?inline'
import gtag from "~/utils/GTAG";

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
    const navigate = useNavigate()

    const array : any[] = []
    const obj : {[key:string]:any} = {}

    const resume = useSignal(obj)
    const months = useSignal(array)
    const years = useSignal(array)
    const tdcname = useSignal('xxxxxxxxxxxxxxxxxxxxx')
    const tdcnumber = useSignal('0000 0000 0000 0000')
    const tdcexpiration = useSignal('00/00')
    const loading = useSignal(true)
    const urlvoucher = useSignal(array)
    const attempts = useSignal(0)

    useTask$(() => {
        months.value = [
            {value:'01',label:'01'},
            {value:'02',label:'02'},
            {value:'03',label:'03'},
            {value:'04',label:'04'},
            {value:'05',label:'05'},
            {value:'06',label:'06'},
            {value:'07',label:'07'},
            {value:'08',label:'08'},
            {value:'09',label:'09'},
            {value:'10',label:'10'},
            {value:'11',label:'11'},
            {value:'12',label:'12'}
        ]

        const newYears = []
        const actualYear = new Date().getFullYear()
        const futureYear = new Date(new Date().setFullYear(new Date().getFullYear()+15)).getFullYear()

        for (let index = actualYear; index < futureYear; index++) {
            newYears.push({value:String(index),label:String(index)})
        }

        years.value = newYears
    })

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

    const getName$ = $((name:string) => {
        tdcname.value = name
    })

    const getCardNumber$ = $(() => {
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        form.classList.remove('was-validated')
        const input = document.querySelector('input[name=tdcnumero]') as HTMLInputElement

        if(input.value.length == 15 || input.value.length == 16)
        {
            if(input.value.charAt(0) == '4' && input.value.length == 16)
            {
                // const visa = new RegExp(/^4[0-9]{3}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/)
                tdcnumber.value = input.value.substring(0,4)+' '+input.value.substring(4,8)+' '+input.value.substring(8,12)+' '+input.value.substring(12,16)
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            }
            else if(input.value.charAt(0) == '5' && input.value.length == 16)
            {
                // const master = new RegExp(/^5[1-5][0-9]{2}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/)
                tdcnumber.value = input.value.substring(0,4)+' '+input.value.substring(4,8)+' '+input.value.substring(8,12)+' '+input.value.substring(12,16)
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            }
            else if(input.value.charAt(0) == '3' && input.value.length == 15)
            {
                // const amex = new RegExp(/^3[47][0-9-]{16}$/)
                tdcnumber.value = input.value.substring(0,4)+' '+input.value.substring(4,10)+' '+input.value.substring(10,15)
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            }
            else
            {
                tdcnumber.value = '0000 0000 0000 0000'
                input.classList.remove('is-valid')
                input.classList.add('is-invalid')
            }
        }
        else
        {
            tdcnumber.value = '0000 0000 0000 0000'
            input.classList.remove('is-valid')
            input.classList.add('is-invalid')
        }
    })

    const getMonth$ = $((e:any) => {
        tdcexpiration.value = e.value+'/0000'
    })

    const getYear$ = $((e:any) => {
        const newExpiration = tdcexpiration.value.split('/')
        tdcexpiration.value = newExpiration[0]+'/'+e.value
    })

    const getPayment$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const modalSuccess = new bs.Modal('#modalConfirmation',{})
        const modalError = new bs.Modal('#modalError',{})
        const modalErrorPax = new bs.Modal('#modalErrorPax',{})
        const modalErrorAttemps = new bs.Modal('#modalErrorAttemps',{})
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
        let error = false
        
        if(!form.checkValidity())
        {
            form.classList.add('was-validated')
            error = true
        }
        else
        {
            form.classList.remove('was-validated')

            dataForm.tdctitular = EncryptAES(tdcname.value,import.meta.env.PUBLIC_WEB_USER)
            dataForm.tdcnumero = EncryptAES(tdcnumber.value.replace(/\s+/g,''),import.meta.env.PUBLIC_WEB_USER)
            dataForm.tdcmesexpiracion = EncryptAES(Number(tdcexpiration.value.split('/')[0]),import.meta.env.PUBLIC_WEB_USER)
            dataForm.tdcanoexpiracion = EncryptAES(Number(tdcexpiration.value.split('/')[1]),import.meta.env.PUBLIC_WEB_USER)
            dataForm.tdccvv = EncryptAES((document.querySelector('input[name=tdccvv]') as HTMLInputElement).value,import.meta.env.PUBLIC_WEB_USER)
            
            error = false;

            (window as any)['dataLayer'].push(
                Object.assign({
                    'event': 'TrackEventGA4',
                    'category': 'Flujo asistencia',
                    'action': 'Paso 5 :: pago',
                    'origen': resume.value.paisorigen,
                    'destino': resume.value.paisesdestino,
                    'desde': resume.value.desde,
                    'hasta': resume.value.hasta,
                    'adultos': resume.value[70],
                    'niños_y_jovenes': resume.value[22],
                    'adultos_mayores': resume.value[85],
                    'page': '/quotes-engine/step-4',
                    'option': resume.value.plan.nombreplan,
                    'descuento': stateContext.value.cupon.porcentaje,
                    'cupon': stateContext.value.cupon.codigocupon,
                    'total': Math.ceil(resume.value.total.total),
                    'metodo_de_pago': 'tarjeta de crédito'
                },stateContext.value.dataLayerPaxBenefits)
            );
        }

        if(error == false)
        {
            loading.value = true

            let originCountry = ''
            const newPaxs : any[] = []

            const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                        .then((response) => {return(response.json())})

            const resDefaults = await fetch("/api/getDefaults",{method:"GET"});
            const dataDefaults = await resDefaults.json()

            dataDefaults.resultado[0].origenes.map((origin:any) => {
                if(origin.idpais == resume.value.origen)
                originCountry = origin.codigopais
            })

            resume.value.asegurados.map((pax:any,index:number) => {
                
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionales.map((benefit:any) => {
                    newPaxs[index].beneficios_adicionales.push(benefit.idbeneficioadicional)
                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })

            const dataRequest =
            {
                ps:"www.continentalassist.com",
                origen:originCountry,
                destino:resume.value.destinos[0],
                desde:resume.value.desde.split('-').reverse().join('/'),
                hasta:resume.value.hasta.split('-').reverse().join('/'),
                id_plan:String(resume.value.plan.idplan),
                contacto:resume.value.contacto,
                beneficiarios:newPaxs,
                ip:resGeo.ip_address,
                forma_pago: "2",
                inputCardNumber:dataForm.tdcnumero,
                inputMonth:dataForm.tdcmesexpiracion,
                inputYear:dataForm.tdcanoexpiracion,
                inputCVV2:dataForm.tdccvv,
                totalgeneral:String(resume.value.total.total),
                inputNameCard:dataForm.tdctitular 
            }

            let resPayment : {[key:string]:any} = {}

            const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify(dataRequest)});
            const dataPay = await resPay.json()
            resPayment = dataPay

            if(resPayment.error == false)
            {
                urlvoucher.value = resPayment.resultado
                loading.value = false;

                (window as any)['dataLayer'].push(
                    Object.assign({
                        'event': 'TrackEventGA4',
                        'category': 'Flujo asistencia',
                        'action': 'Paso 6 :: compra exitosa',
                        'origen': resume.value.paisorigen,
                        'destino': resume.value.paisesdestino,
                        'desde': resume.value.desde,
                        'hasta': resume.value.hasta,
                        'adultos': resume.value[70],
                        'niños_y_jovenes': resume.value[22],
                        'adultos_mayores': resume.value[85],
                        'page': '/quotes-engine/step-4',
                        'option': resume.value.plan.nombreplan,
                        'descuento': stateContext.value.cupon.porcentaje,
                        'cupon': stateContext.value.cupon.codigocupon,
                        'total': Math.ceil(resume.value.total.total),
                        'metodo_de_pago': 'tarjeta de crédito'
                    },stateContext.value.dataLayerPaxBenefits)
                );

                modalSuccess.show();

                (window as any)['dataLayer'].push({ ecommerce: null });
                (window as any)['dataLayer'].push({
                    event: "purchase",
                    ecommerce: {
                        transaction_id: urlvoucher.value[0].codigovoucher,
                        affiliation: "Continental Assist",
                        value: Math.ceil(resume.value.total.total),
                        tax: "0",
                        shipping: "0",
                        currency: "USD",
                        coupon: stateContext.value.cupon.codigocupon,
                        items: [
                            stateContext.value.dataLayerPaxBenefits
                        ]
                    }
                });

                gtag('event', 'conversion', { 'send_to': 'AW-11397008041/XZCjCNHhy_cYEKmVwroq', 'transaction_id': urlvoucher.value[0].codigovoucher });
            }
            else
            {
                if(attempts.value < 2)
                {
                    if(resPayment.resultado.mensaje_error.includes('voucher activo'))
                    {
                        loading.value = false;

                        modalErrorPax.show()
                    }
                    else
                    {
                        loading.value = false;
        
                        modalError.show()
                    }
                }
                else
                {
                    loading.value = false;

                    modalErrorAttemps.show()
                }

                attempts.value = (attempts.value + 1)
            }
        }
    })

    const closeQuote$ = $(() => {
        const bs = (window as any)['bootstrap']
        const modalErrorAttemps = bs.Modal.getInstance('#modalErrorAttemps',{})
        modalErrorAttemps.hide()

        stateContext.value = {}
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
                <div class='row bg-step-6'>
                    <div class='col-lg-12'>
                        <div class='container p-0'>
                            <div class='row align-content-center justify-content-center'>
                                <div class='col-lg-10 text-center mt-5'>
                                    <h1 class='text-semi-bold text-blue'>Método de pago</h1>
                                    <hr class='divider my-3'/>
                                    <h5 class='text-dark-gray mb-4'>Ingresa la información de tu tarjeta</h5>
                                </div>
                            </div>
                            <div class='row mb-5'>
                                <div class='col-lg-12'>
                                    <div class='card card-body shadow-lg'>
                                        <div class='container'>
                                            <div class='row justify-content-center'>
                                                <div class='col-lg-4 mb-3'>
                                                    <div class='img-card'>
                                                        <div class='card-name'>{tdcname.value}</div>
                                                        <div class='card-number'>{tdcnumber.value}</div>
                                                        <div class='card-expiration'>{tdcexpiration.value}</div>
                                                        <ImgContinentalAssistCard class='img-fluid' title='continental-assist-card' alt='continental-assist-card'/>
                                                    </div>
                                                </div>
                                                <div class='col-lg-4 offset-lg-1'>
                                                    <Form
                                                        id='form-payment-method'
                                                        form={[
                                                            {row:[
                                                                {size:'col-xl-12',type:'text',label:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true'},
                                                                {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true},
                                                            ]},
                                                            {row:[
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Mes',name:'tdcmesexpiracion',readOnly:true,required:true,options:months.value,onChange:$((e:any) => {getMonth$(e)})},
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Año',name:'tdcanoexpiracion',readOnly:true,required:true,options:years.value,onChange:$((e:any) => {getYear$(e)})},
                                                                {size:'col-xl-4 col-xs-4 credit-card',type:'number',label:'CVV',name:'tdccvv',min:'0000',maxLength:'9999',required:true,disableArrows:true}
                                                            ]}
                                                        ]}
                                                    />
                                                    <div class='d-none' id='invoice'>
                                                        <Form
                                                            id='form-invoicing'
                                                            form={[
                                                                {row:[
                                                                    {size:'col-xl-12',type:'text',label:'Razon Social',name:'razonsocial',required:true,onChange:$((e:any) => {getName$(e.target.value)})},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-4 col-xs-4',type:'select',label:'Tipo ID',name:'tipoid',required:true,options:[
                                                                        {value:'RFC',label:'RFC'},
                                                                        {value:'CC',label:'CC'},
                                                                        {value:'PASAPORTE',label:'Pasaporte'},
                                                                        {value:'NIT',label:'NIT'}
                                                                    ]},
                                                                    {size:'col-xl-8 col-xs-8',type:'text',label:'ID',name:'id',required:true},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-12',type:'email',label:'Correo',name:'correo',required:true},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-6 col-xs-6',type:'tel',label:'Telefono',name:'telefono',required:true},
                                                                    
                                                                    {size:'col-xl-6 col-xs-6',type:'text',label:'C.P.',name:'codigopostal',required:true}
                                                                ]}
                                                            ]}
                                                        />
                                                    </div>
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-lg-6'>
                                                                <div class='d-grid gap-2 mt-4'>
                                                                    <button type='button' class='btn btn-primary' onClick$={getPayment$}>Realizar pago</button>
                                                                    {
                                                                        attempts.value > 0
                                                                        &&
                                                                        <span class='text-center rounded-pill text-bg-warning'>{attempts.value} intentos</span>
                                                                    }
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
            <div id='modalConfirmation' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border border-success">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <ImgContinentalAssistSuccess class='img-fluid' title='continental-assist-success' alt='continental-assist-success'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Compra exitosa!</h2>
                            {
                                urlvoucher.value.length > 4
                                ?
                                <>
                                    <p class='px-2 py-1 mb-0'>Ahora tu viaje cuenta con el respaldo ideal para olvidarse de imprevistos.</p>
                                    <p><b>Descargar Vouchers:</b></p>
                                </>
                                :
                                <>
                                    <p class='px-5 py-1 mb-0'>Ahora tu viaje cuenta con el respaldo ideal para olvidarse de imprevistos. Conecta con la magia del mundo, del resto nos encargamos nosotros.</p>
                                    <p><b>Descargar Vouchers:</b></p>
                                </>
                            }
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    {
                                        urlvoucher.value.map((voucher,index) => {
                                            return(
                                                <div key={index} class='col-lg-6'>
                                                    <div class='d-grid gap-2'>
                                                        <a title='Voucher' class='btn btn-primary btn-sm mt-2' href={voucher.link_voucher} target='_blank'>{voucher.nombrebeneficiario}</a>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-4'>
                                        <div class='d-grid gap-2'>
                                            {
                                                urlvoucher.value.length > 2
                                                ?
                                                <a title='Inicio' class={'btn btn-blue btn-lg mt-3'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                                :
                                                <a title='Inicio' class={'btn btn-blue btn-lg mt-5'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalError' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-error' alt='continental-assist-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Pago rechazado!</h2>
                            <p class='px-5 py-3'>Revisa los datos de tu medio de pago e intenta de nuevo.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary btn-lg' data-bs-dismiss="modal">Volver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalErrorPax' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-error' alt='continental-assist-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Voucher activo!</h2>
                            <p class='px-5 py-3'>Uno de los beneficiarios ya cuenta con un voucher activo para las fechas seleccionadas.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary btn-lg' data-bs-dismiss="modal">Volver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalErrorAttemps' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-error' alt='continental-assist-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Has realizado tres intentos!</h2>
                            <p class='px-5 py-3'>Lo sentimos has superado el número de permitidos.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <a title='Inicio' class={'btn btn-blue btn-lg'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})