import { $, component$, useContext, useSignal, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import { EncryptAES } from "~/utils/EncryptAES";
import { CalculateAge } from "~/utils/CalculateAge";
import { ParseTwoDecimal } from "~/utils/ParseTwoDecimal";

import styles from './index.css?inline'
import { CardPaymentResume } from "~/components/starter/card-payment-resume/CardPaymentResume";
import { LoadingContext } from "~/root";
import { InvoiceFormCO } from "~/components/starter/invoice-forms/InvoiceFormCO";
import { InvoiceFormMX } from "~/components/starter/invoice-forms/InvoiceFormMX";



export default component$(() => {
    useStyles$(styles)

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
    const attempts = useSignal(stateContext.value.attempts|| 0)
    const contextLoading = useContext(LoadingContext)



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
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {        
        if(Object.keys(stateContext.value).length > 0)
        {
            resume.value = stateContext.value
        
        }
        else
        {
            // navigate('/quotes-engine/step-1')
        }
        contextLoading.value = {status:false, message:''}
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
        //const bs = (window as any)['bootstrap']
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const dataFormInvoicing : {[key:string]:any} = {}
        const dataFormPayment : {[key:string]:any} = {}
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;

        contextLoading.value = {status:true, message:'Procesando tu pago, por favor espera un momento...'}


        let error = false
        let errorInvoicing = false
        
        const inputsPayments = Array.from(form.querySelectorAll('input,select'))

        inputsPayments.map((input) => {            
            dataFormPayment[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
        })
        const validatemonth = dataFormPayment.tdcmesexpiracion.split('').every((char:any) => char === '0');
        const validateyear = dataFormPayment.tdcanoexpiracion.split('').every((char:any) => char === '0');
        if(!form.checkValidity()|| validatemonth || validateyear)
        {
            form.classList.add('was-validated')
            error = true
            contextLoading.value = {status:false, message:''}

        }
        else
        {
            form.classList.remove('was-validated')
            
            dataForm.tdctitular = tdcname.value
            dataForm.tdcnumero = tdcnumber.value.replace(/\s+/g,'')
            dataForm.tdcmesexpiracion = dataFormPayment.tdcmesexpiracion
            dataForm.tdcanoexpiracion = dataFormPayment.tdcanoexpiracion
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
                    'adultos': resume.value[75],
                    'niños_y_jovenes': resume.value[23],
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

        if(error == false && errorInvoicing === false)
        {
           // loading.value = true

            const newPaxs : any[] = []

            resume.value.asegurados.map((pax:any,index:number) => {
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []                
                pax.beneficiosadicionalesSeleccionados.map((benefit:any) => {
                    newPaxs[index].beneficios_adicionales.push({id:benefit.idbeneficioadicional,
                        nombre:benefit.nombrebeneficioadicional,monto:Number(benefit.precio),cobertura:benefit.cobertura})
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
                        idcupon:resume.value?.cupon?.idcupon,
                        codigocupon:resume.value?.cupon?.codigocupon,
                        porcentaje:resume.value?.cupon?.porcentaje,
                        descuento:resume.value?.cupon?.descuento||0
                    },
                    contacto:[resume.value.contacto],
                    ux:stateContext.value.ux ? stateContext.value.ux : '',
                    idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                    sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                    ip_address:resume.value.resGeo.ip_address,
                }
            )
            
            if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                dataFormInvoicing.tipoPersona = radioTypePerson.value;
                dataFormInvoicing.origenFactura = stateContext.value.country;
                if (stateContext.value.country == 'CO') 
                {
                    //const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
                    //const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement
                    //const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
                    dataFormInvoicing.codigociudad = null;//codigoCiudad;
                    dataFormInvoicing.idestado = null; //Number(inputState.dataset?.value);
                    dataFormInvoicing.idciudad = null;//Number(inputCity.dataset?.value);
                    dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);

                    
                }
                else if (stateContext.value.country === 'MX')
                {
                    const inputState = document.querySelector('#form-invoicing-select-3-0') as HTMLInputElement
                    const inputCity = document.querySelector('#form-invoicing-select-3-1') as HTMLInputElement
                    const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
                    const inputTaxRegime = document.querySelector('#form-invoicing-select-0-1') as HTMLSelectElement;
                    const inputPaymentGroupCode = document.querySelector('#form-invoicing-select-0-2') as HTMLSelectElement;
                    const regimenfiscal = stateContext.value.listadoRegimenesSat.find((tax: any) => tax.value == inputTaxRegime?.dataset?.value);
                    const codigoEstado = stateContext.value.listadoestados.find((state: any) => state.value == inputState?.dataset?.value)?.codigoestado || null;    
                    const paymentGroupCode =[{value:'PUE',label:'PUE-Contado',codigo:-1},{value:'PPD',label:'PPD-Diferido',codigo:12}]
                    const paymentCode = paymentGroupCode.find((code: any) => code.value == inputPaymentGroupCode?.dataset?.value);

                    dataFormInvoicing.idciudad = Number(inputCity.dataset?.value);
                    dataFormInvoicing.idestado = Number(inputState.dataset?.value);
                    dataFormInvoicing.codigoestado = codigoEstado;
                    dataFormInvoicing.codigociudad = codigoCiudad;
                    dataFormInvoicing.codigoverificacion =0;
                    dataFormInvoicing.tipoid ='RFC';
                    dataFormInvoicing.idregimenfiscal = Number(regimenfiscal.value);
                    dataFormInvoicing.claveregimenfiscal =regimenfiscal.clave ||'';
                    dataFormInvoicing.usocfdi =regimenfiscal.usocfdi||'';
                    dataFormInvoicing.grupopagocodigo =paymentCode?.codigo;
                }
                dataRequest.facturacion = dataFormInvoicing
            }

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

            let resPayment : {[key:string]:any} = {}

            const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()
            resPayment = dataPay

            if(resPayment.error == false)
            {
               // urlvoucher.value = resPayment.resultado;


                (window as any)['dataLayer'].push(
                    Object.assign({
                        'event': 'TrackEventGA4',
                        'category': 'Flujo asistencia',
                        'action': 'Paso 6 :: compra exitosa',
                        'origen': resume.value.paisorigen,
                        'destino': resume.value.paisesdestino,
                        'desde': resume.value.desde,
                        'hasta': resume.value.hasta,
                        'adultos': resume.value[75],
                        'niños_y_jovenes': resume.value[23],
                        'adultos_mayores': resume.value[85],
                        'page': '/quotes-engine/step-4',
                        'option': resume.value.plan.nombreplan,
                        'descuento': stateContext.value.cupon.porcentaje,
                        'cupon': stateContext.value.cupon.codigocupon,
                        'total': resume.value.total.total,
                        'metodo_de_pago': 'tarjeta de crédito'
                    },stateContext.value.dataLayerPaxBenefits)
                );

               // modalSuccess.show()
               // Preservar todos los datos del contexto y agregar los nuevos datos del pago
               stateContext.value = {
                   ...stateContext.value, // Preservar todos los datos existentes
                   paymentstutus: resPayment.resultado[0]?.authorizeTransaccion?.status||'',
                   codevoucher: resPayment.resultado[0]?.orden?.codvoucher||'',
                   typeMessage: 1
               }
               await navigate('/quotes-engine/message')
            }
            else
            {
                if(attempts.value < 2)
                {
                    stateContext.value.typeMessage = 2
                    await navigate('/quotes-engine/message')
                }
                else
                {
                    stateContext.value.typeMessage = 3
                    await navigate('/quotes-engine/message')
                }

                attempts.value = (attempts.value + 1)
                stateContext.value.attempts =attempts.value
            }
        }
    })


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


    return(
        <>
            <div class='container-fluid'>
                <div class='row mb-5'>
                    <div class='col-lg-12'>
                        <CardPaymentResume>
                             <div class='row justify-content-center'>
                                <div class='col-lg-12'>
                                <p class=' text-semi-bold text-blue  text-end'> Ingresa la información de tu tarjeta</p>

                                    <Form
                                        id='form-payment-method'
                                        form={[
                                            {row:[
                                                {size:'col-xl-12',type:'text',label:'Nombre completo',placeholder:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true', dataAttributes: { 'data-openpay-card':'holder_name' }},
                                                {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',placeholder:'Número de tarjeta',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true, dataAttributes: { 'data-openpay-card': 'card_number' }},
                                            ]},
                                            {row:[
                                                {size:'col-xl-4 col-xs-12',type:'select',label:'Mes',placeholder:'Mes',name:'tdcmesexpiracion',readOnly:true,required:true,options:months.value,onChange:$((e:any) => {getMonth$(e)}), dataAttributes: { 'data-openpay-card':'expiration_month' }},
                                                {size:'col-xl-4 col-xs-12',type:'select',label:'Año',placeholder:'Año',name:'tdcanoexpiracion',readOnly:true,required:true,options:years.value,onChange:$((e:any) => {getYear$(e)}), dataAttributes: { 'data-openpay-card':'expiration_year' }},
                                                {size:'col-xl-4 col-xs-12 credit-card',type:'number',label:'CVV',placeholder:'CVV',name:'tdccvv',min:'0000',maxLength:'9999',required:true,disableArrows:true, dataAttributes: { 'data-openpay-card':'cvv2' }}
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
                                        { 
                                            stateContext.value.country == 'MX' && <InvoiceFormMX/>
                                            || 
                                            stateContext.value.country == 'CO' && <InvoiceFormCO/>
                                        }
                                    </div>
                                    <div class='container'>
                                        <div class='row justify-content-center'>
                                            <div class='col-lg-6'>
                                                <div class='d-grid gap-2 mt-4'>
                                                    <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>                                                        
                                                </div>
                                            </div>

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
                        </CardPaymentResume>

                    </div>
                </div>
            </div>
           
        </>
    )
})