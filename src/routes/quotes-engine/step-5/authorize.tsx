import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
// import { useNavigate } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import { EncryptAES } from "~/utils/EncryptAES";
import styles from './index.css?inline'
import { CalculateAge } from "~/utils/CalculateAge";
import { ParseTwoDecimal } from "~/utils/ParseTwoDecimal";

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    // const navigate = useNavigate()

    const array : any[] = []
    const obj : {[key:string]:any} = {}

    const resume = useSignal(obj)
    const opSessionId = useSignal('')
    const opToken = useSignal('')
    const wSeesionId = useSignal('')
    const wToken = useSignal('')
    const months = useSignal(array)
    const years = useSignal(array)
    const tdcname = useSignal('xxxxxxxxxxxxxxxxxxxxx')
    const tdcnumber = useSignal('0000 0000 0000 0000')
    const tdcexpiration = useSignal('00/00')
    const loading = useSignal(true)
    const urlvoucher = useSignal(array)
    const attempts = useSignal(0)

    useTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
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
            
            for (let index = actualYear; index < futureYear; index++) 
            {
                newYears.push({value:String(index),label:String(index)})
            }
                    
            years.value = newYears
        }
    })

    useVisibleTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            resume.value = stateContext.value
            loading.value = false
        }
        else
        {
            loading.value = false
            // navigate('/quotes-engine/step-1')
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
        // const modalErrorPax = new bs.Modal('#modalErrorPax',{})
        const modalErrorAttemps = new bs.Modal('#modalErrorAttemps',{})
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const dataFormInvoicing : {[key:string]:any} = {}

    
        let error = false
        let errorInvoicing = false
        
        if(!form.checkValidity())
        {
            form.classList.add('was-validated')
            error = true
        }
        else
        {
            form.classList.remove('was-validated')
            
            dataForm.tdctitular = tdcname.value
            dataForm.tdcnumero = tdcnumber.value.replace(/\s+/g,'')
            dataForm.tdcmesexpiracion = Number(tdcexpiration.value.split('/')[0])
            dataForm.tdcanoexpiracion = Number(tdcexpiration.value.split('/')[1])
            dataForm.tdccvv = (document.querySelector('input[name=tdccvv]') as HTMLInputElement).value
            
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
                    'label': resume.value.plan.nombreplan,
                    'descuento': stateContext.value.cupon.porcentaje,
                    'cupon': stateContext.value.cupon.codigocupon,
                    'total': resume.value.total.total,
                    'metodo_de_pago': 'tarjeta de crédito'
                },stateContext.value.dataLayerPaxBenefits)
            );
        }

        if(checkInvoicing.checked === true)
        {
            if(!formInvoicing.checkValidity())
            {
                formInvoicing.classList.add('was-validated')
                errorInvoicing = true
            }
            else
            {
                formInvoicing.classList.remove('was-validated')
                errorInvoicing = false

                const inputs = Array.from(formInvoicing.querySelectorAll('input,select'))

                inputs.map((input) => {
                    dataFormInvoicing[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
                })
            }
        }

        if(error == false)
        {
            loading.value = true

            const newPaxs : any[] = []

            resume.value.asegurados.map((pax:any,index:number) => {
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionales.map((benefit:any) => {
                    newPaxs[index].beneficios_adicionales.push(benefit.idbeneficioadicional)
                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })

            const dataRequest = Object.assign(
                dataForm,
                {
                    fecha:{
                        desde:resume.value.desde,
                        hasta:resume.value.hasta,
                        dias:resume.value.dias
                    },
                    idorigen:resume.value.origen,
                    destinos:resume.value.destinos,
                    pasajeros:resume.value.asegurados,
                    planfamiliar:resume.value.planfamiliar,
                    plan:{
                        idplan:resume.value.plan.idplan,
                        nombreplan:resume.value.plan.nombreplan,
                        total:resume.value.plan.precio_grupal
                    },
                    total:Number(ParseTwoDecimal(resume.value.total.total)),
                    totalconversion:resume.value.total.total,
                    tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                    codigoconversion:resume.value.total.divisa,
                    moneda:{
                        idmoneda:resume.value.plan.idmonedapago,
                    },
                    idplataformapago:2,
                    cupon:{
                        idcupon:resume.value.cupon.idcupon,
                        codigocupon:resume.value.cupon.codigocupon,
                        porcentaje:resume.value.cupon.porcentaje
                    },
                    contacto:[resume.value.contacto],
                    ux:stateContext.value.ux ? stateContext.value.ux : '',
                    idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                    sandbox:import.meta.env.PUBLIC_MODE_SANDBOX,
                    devicesessionid : opSessionId.value,
                    sourceid : opToken.value,
                    acceptanceToken : wSeesionId.value,
                    tokenWompi : wToken.value
                }
            )
            
            if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                dataRequest.facturacion = dataFormInvoicing
            }

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

            let resPayment : {[key:string]:any} = {}

            const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
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
                        'total': resume.value.total.total,
                        'metodo_de_pago': 'tarjeta de crédito'
                    },stateContext.value.dataLayerPaxBenefits)
                );

                modalSuccess.show()
            }
            else
            {
                if(attempts.value < 2)
                {
                    // if(resPayment.resultado.mensaje_error.includes('voucher activo'))
                    // {
                    //     loading.value = false;

                    //     (window as any)['dataLayer'].push({
                    //         'event': 'TrackEvent',
                    //         'Category': 'Cotizador',
                    //         'Action': 'Paso 5 :: Pago no realizado! Uno de los beneficiarios ya cuenta con un voucher activo para las fechas seleccionadas',
                    //         'Label': resume.value.plan.nombreplan,
                    //         'Origen': resume.value.paisorigen,
                    //         'Destino': resume.value.paisesdestino,
                    //         'Desde': resume.value.desde,
                    //         'Hasta': resume.value.hasta,
                    //         'Adultos': resume.value[70],
                    //         'Ninosjovenes': resume.value[22],
                    //         'Adultosmayores': resume.value[85],
                    //         'Value': resume.value.total.total,
                    //         'Método de pago': dataForm.tdcnumero
                    //     });

                    //     modalErrorPax.show()
                    // }
                    // else
                    // {
                        loading.value = false;

                        // (window as any)['dataLayer'].push({
                        //     'event': 'TrackEvent',
                        //     'Category': 'Cotizador',
                        //     'Action': 'Paso 5 :: Pago no realizado!',
                        //     'Label': resume.value.plan.nombreplan,
                        //     'Origen': resume.value.paisorigen,
                        //     'Destino': resume.value.paisesdestino,
                        //     'Desde': resume.value.desde,
                        //     'Hasta': resume.value.hasta,
                        //     'Adultos': resume.value[70],
                        //     'Ninosjovenes': resume.value[22],
                        //     'Adultosmayores': resume.value[85],
                        //     'Value': resume.value.total.total,
                        //     'Método de pago': dataForm.tdcnumero
                        // });
        
                        modalError.show()
                    // }
                }
                else
                {
                    loading.value = false;

                    // (window as any)['dataLayer'].push({
                    //     'event': 'TrackEvent',
                    //     'Category': 'Cotizador',
                    //     'Action': 'Paso 5 :: Has realizado 3 intentos!',
                    //     'Label': resume.value.plan.nombreplan,
                    //     'Origen': resume.value.paisorigen,
                    //     'Destino': resume.value.paisesdestino,
                    //     'Desde': resume.value.desde,
                    //     'Hasta': resume.value.hasta,
                    //     'Adultos': resume.value[70],
                    //     'Ninosjovenes': resume.value[22],
                    //     'Adultosmayores': resume.value[85],
                    //     'Value': resume.value.total.total,
                    //     'Método de pago': dataForm.tdcnumero
                    // });

                    modalErrorAttemps.show()
                }

                attempts.value = (attempts.value + 1)
            }
        }
    })

    // const getDownloadVoucher$ = $(() => {
    //     (window as any)['dataLayer'].push({
    //         'event': 'TrackEvent',
    //         'Category': 'Interacciones',
    //         'Action': 'Click',
    //         'Label': 'Descargar tu voucher',
    //         'Page': '/step-4'
    //     });
    // })

    const showForm$ = $(() => {
        const form = document.querySelector('#invoice') as HTMLFormElement

        if(form.classList.value.includes('d-none'))
        {
            form.classList.remove('d-none')
        }
        else
        {
            form.classList.add('d-none')
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
            {/* {
                loading.value === true
                &&
                <Loading/>
            } */}
            <div class='container-fluid'>
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
                                                        <img src='/assets/img/icons/continental-assist-card.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-card'/>
                                                    </div>
                                                </div>
                                                <div class='col-lg-4 offset-lg-1'>
                                                    <Form
                                                        id='form-payment-method'
                                                        form={[
                                                            {row:[
                                                                {size:'col-xl-12',type:'text',label:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true', dataAttributes: { 'data-openpay-card':'holder_name' }},
                                                                {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true, dataAttributes: { 'data-openpay-card': 'card_number' }},
                                                            ]},
                                                            {row:[
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Mes',name:'tdcmesexpiracion',readOnly:true,required:true,options:months.value,onChange:$((e:any) => {getMonth$(e)}), dataAttributes: { 'data-openpay-card':'expiration_month' }},
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Año',name:'tdcanoexpiracion',readOnly:true,required:true,options:years.value,onChange:$((e:any) => {getYear$(e)}), dataAttributes: { 'data-openpay-card':'expiration_year' }},
                                                                {size:'col-xl-4 col-xs-4 credit-card',type:'number',label:'CVV',name:'tdccvv',min:'0000',maxLength:'9999',required:true,disableArrows:true, dataAttributes: { 'data-openpay-card':'cvv2' }}
                                                            ]}
                                                        ]}
                                                    />
                                                    <div class='container'>
                                                        <div class='row'>
                                                            <div class='col-12'>
                                                                <div class="form-check form-check-inline my-3">
                                                                    <input class="form-check-input" type="checkbox" id={"invoicing"} name='required_invoicing' onClick$={showForm$}/>
                                                                    <label class="form-check-label" for={"invoicing"}>
                                                                        Requiero factura personalizada.
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
            <div id='modalConfirmation' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border border-success">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <img src='/assets/img/icons/continental-assist-success.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-success'/>
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
                                        urlvoucher.value.map((voucher:any,index:number) => {
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
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
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
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
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
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
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