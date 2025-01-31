import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import { EncryptAES } from "~/utils/EncryptAES";
import { CalculateAge } from "~/utils/CalculateAge";
import { ParseTwoDecimal } from "~/utils/ParseTwoDecimal";
import styles from './index.css?inline'
import { CardPaymentResume } from "~/components/starter/card-payment-resume/CardPaymentResume";
import ImgIconBanksVisa from '~/media/banks/visa.webp?jsx'
import ImgIconBanksMaster from '~/media/banks/masterCard.webp?jsx'
import ImgIconBanksAmerican from '~/media/banks/americanExpress.webp?jsx'
import ImgIconBanksCarnet from '~/media/banks/carnet.webp?jsx'
import ImgIconBanksBBVA from '~/media/banks/BBVA.webp?jsx'
import ImgIconBanksSantander from '~/media/banks/santander.webp?jsx'
import ImgIconBanksHsbc from '~/media/banks/hsbc.webp?jsx'
import ImgIconBanksScotiabank from '~/media/banks/scotiabank.webp?jsx'
import ImgIconBanksInbursa from '~/media/banks/inbursa.webp?jsx'
import ImgIconBanksIxe from '~/media/banks/ixe.webp?jsx'

export interface propsOP {
    setLoading: (loading: boolean, message: string) => void;
   
}

export default component$((props:propsOP) => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()

    const array : any[] = []
    const obj : {[key:string]:any} = {}

    const resume = useSignal(obj)
    const opSessionId = useSignal('')
    const opToken = useSignal('')
    const months = useSignal(array)
    const years = useSignal(array)
    const tdcname = useSignal('xxxxxxxxxxxxxxxxxxxxx')
    const tdcnumber = useSignal('0000 0000 0000 0000')
    const tdcexpiration = useSignal('00/00')
    const attempts = useSignal(stateContext.value.attempts|| 0)
    const formPayment = useSignal('')
    const redirect = useSignal(obj)
    const store = useSignal(obj)
    const bank = useSignal(obj)
    const isLoading = useSignal(false);
    const dataError = useSignal('')


    function updateLoading(){
        props.setLoading(isLoading.value,'')
        
    }
    updateLoading()

    useTask$(() => {
        isLoading.value = true
        if(Object.keys(stateContext.value).length > 0)
        {            
            if(stateContext.value.openPayTipo == 'CARD')
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
                    newYears.push({value: String(index).slice(-2), label: String(index).slice(-2)})
                }
                        
                years.value = newYears

                const checkOpenPayLoaded = () => {
                                        
                    if (window.OpenPay) {
                        window.OpenPay.setId(import.meta.env.VITE_MY_PUBLIC_WEB_API_ID_OPEN_PAY);
                        window.OpenPay.setApiKey(import.meta.env.VITE_MY_PUBLIC_WEB_API_KEY_OPEN_PAY);
                        window.OpenPay.setSandboxMode(import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX=='t'? true: false);
                        const deviceSessionId = window.OpenPay.deviceData.setup("form-payment-method", "deviceIdHiddenFieldName");
                        opSessionId.value = deviceSessionId
                    } else {
                        setTimeout(checkOpenPayLoaded, 500); 
                    }
                };
            
                if (typeof window !== "undefined" && stateContext.value.resGeo.country == "MX") {
                    checkOpenPayLoaded();
                }

                formPayment.value = 'CARD'
                isLoading.value = false

                //props.setLoading(false)
            }
        }
    })
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            resume.value = stateContext.value
            
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

            const dataRequest = {
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
                totalconversion:Number(ParseTwoDecimal(resume.value.total.total * stateContext.value.currentRate.rate)),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:3,
                cupon:{
                    idcupon:resume.value?.cupon?.idcupon,
                    codigocupon:resume.value?.cupon?.codigocupon,
                    porcentaje:resume.value?.cupon?.porcentaje
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
            }

            if(stateContext.value.openPayTipo == 'CARD_REDIRECT')
            {
                const openPayRequest = {
                    openPayTipo:stateContext.value.openPayTipo,
                    openPayRedirectUrl:import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message'
                }                

                Object.assign(dataRequest,openPayRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()

                if(dataPay?.resultado[0].openPayTransaccion)
                {
                    redirect.value = {
                        url:dataPay.resultado[0].openPayTransaccion.payment_method.url
                    }
                }

                formPayment.value = 'CARD_REDIRECT'
                
                navigate(redirect.value.url)
            }
            else if(stateContext.value.openPayTipo == 'STORE')
            {
                const openPayRequest = {
                    openPayTipo:stateContext.value.openPayTipo,
                    openPayRedirectUrl: import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message'
                }

                Object.assign(dataRequest,openPayRequest)


                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()

                if(dataPay?.resultado[0]?.openPayTransaccion)
                {
                    store.value = {
                        barcode:dataPay.resultado[0].openPayTransaccion.payment_method.barcode_url,
                        intention:dataPay.resultado[0].openPayTransaccion.payment_method.reference,
                        total:resume.value.total.total * stateContext.value.currentRate.rate
                    }
                }

                formPayment.value = 'STORE'
                isLoading.value = false

            }
            else if(stateContext.value.openPayTipo == 'BANK_ACCOUNT')
            {
                const openPayRequest = {
                    openPayTipo:stateContext.value.openPayTipo,
                    openPayRedirectUrl: import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message'
                }

                Object.assign(dataRequest,openPayRequest)


                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()
 
                if(dataPay?.resultado[0]?.openPayTransaccion)
                {
                    bank.value = {
                        bank:dataPay.resultado[0].openPayTransaccion.payment_method.bank,
                        clabe:dataPay.resultado[0].openPayTransaccion.payment_method.clabe,
                        url:dataPay.resultado[0].openPayTransaccion.payment_method.url_spei,
                        agreement:dataPay.resultado[0].openPayTransaccion.payment_method.agreement,
                        total:resume.value.total.total * stateContext.value.currentRate.rate,
                        intention:dataPay.resultado[0].openPayTransaccion.payment_method.name,
                        id:dataPay.resultado[0].openPayTransaccion.id
                    }
                }

                formPayment.value = 'BANK_ACCOUNT'
                isLoading.value = false
            }
        }
        else
        {
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

    const getOpenPayToken$ = $(async() =>  {
        // Envolver la llamada a OpenPay en una Promesa
        const promesaOpenPay = new Promise((resolve, reject) => {
            const success_callback = (response: any) => {
                opToken.value = response.data.id;

                resolve(response); // Resuelve la promesa con la respuesta en caso de éxito
            };
        
            const error_callback = (error: any) => {
                dataError.value = error?.data?.description                
                reject(error); // Rechaza la promesa con el error en caso de fallo
            };
        
            window.OpenPay.token.extractFormAndCreate('form-payment-method', success_callback, error_callback);
        });
        
        try {
            // Esperar a que la promesa se resuelva para obtener la respuesta
            const response = await promesaOpenPay;
            return response
            // Continuar con el flujo después de obtener la respuesta
        } catch (error) {
            // Manejar el error
        }
    });

    const getPayment$ = $(async() => {
        dataError.value !=''
        //const bs = (window as any)['bootstrap']

        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const dataFormInvoicing : {[key:string]:any} = {}
        isLoading.value = true

        let error = false
        let errorInvoicing = false
        await getOpenPayToken$()
        
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

        if(error == false &&opToken.value.length>0 &&dataError.value =='')
        {
          

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
                    totalconversion:Number(ParseTwoDecimal(resume.value.total.total * stateContext.value.currentRate.rate)),
                    tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                    codigoconversion:stateContext.value.currentRate.code,
                    moneda:{
                        idmoneda:resume.value.plan.idmonedapago,
                    },
                    idplataformapago:3,
                    cupon:{
                        idcupon:resume.value?.cupon?.idcupon,
                        codigocupon:resume.value?.cupon?.codigocupon,
                        porcentaje:resume.value?.cupon?.porcentaje
                    },
                    contacto:[resume.value.contacto],
                    ux:stateContext.value.ux ? stateContext.value.ux : '',
                    idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                    sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                    openPayDeviceSessionId : opSessionId.value,
                    openPaySourceId : opToken.value,
                    openPayTipo:stateContext.value.openPayTipo,
                    openPayRedirectUrl:import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message'
                }
            )
            
            if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                dataRequest.facturacion = dataFormInvoicing
            }

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

            let resPayment : {[key:string]:any} = {}

            const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()
            resPayment = dataPay

            if(resPayment.error == false)
            {
                //urlvoucher.value = resPayment.resultado;
                isLoading.value = false;

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
                
               if (resPayment.resultado[0]?.openPayTransaccion?.status ==='charge_pending' && resPayment.resultado[0]?.openPayTransaccion?.payment_method)
                {
                stateContext.value.paymentstutus =resPayment.resultado[0]?.openPayTransaccion?.status||'';
                stateContext.value.codevoucher =resPayment.resultado[0]?.openPayTransaccion?.order_id||'';
                stateContext.value.typeMessage = 1
                await navigate(resPayment.resultado[0]?.openPayTransaccion?.payment_method.url)
               }
                
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
                        {
                             formPayment.value == 'CARD'
                             &&
                             <div class='row'>
                                <div class='col-4 pb-2'>
                                <p class=' text-regular text-dark-gray  text-start pb-0 mb-1'>Tarjetas de crédito</p>
                                    <div class='col-12'>
                                    <ImgIconBanksVisa  class='img-fluid px-1' style={{ width: 'auto', height: '20px'}} />
                                    <ImgIconBanksMaster  class='img-fluid px-1' style={{ width: 'auto', height: '20px'}} />
                                    <ImgIconBanksAmerican  class='img-fluid ps-1' style={{ width: '30px', height: 'auto'}} />
                                    <ImgIconBanksCarnet   class='img-fluid' style={{ width: '70px', height: 'auto'}} />
                                    </div>
                                </div>
                                <div class='col-8 pb-2'>
                                <p class=' text-regular text-dark-gray  text-start pb-0 mb-0'>Tarjetas de débito</p>
                                    <div class='col-12'>
                                    <ImgIconBanksBBVA  class='img-fluid ' style={{ width: 'auto', height: '18px'}} />
                                    <ImgIconBanksSantander  class='img-fluid ' style={{ width: '80px', height: 'auto'}} />
                                    <ImgIconBanksHsbc  class='img-fluid ' style={{ width: 'auto', height: '30px'}} />
                                    <ImgIconBanksScotiabank  class='img-fluid ' style={{ width: 'auto', height: '30px'}} />
                                    <ImgIconBanksInbursa  class='img-fluid ' style={{ width: 'auto', height: '45px'}} />
                                    <ImgIconBanksIxe  class='img-fluid ' style={{ width: 'auto', height: '30px'}} />
                                    </div>                                
                                </div>
                                       <p class=' text-semi-bold text-blue  text-end'> Ingresa la información de tu tarjeta</p>

                                            <Form
                                                id='form-payment-method'
                                                form={[
                                                    {row:[
                                                        {size:'col-xl-12',type:'text',label:'Nombre completo',placeholder:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true', dataAttributes: { 'data-openpay-card':'holder_name' }},
                                                        {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',placeholder:'Número de tarjeta',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true, dataAttributes: { 'data-openpay-card': 'card_number' }},
                                                    ]},
                                                    {row:[
                                                        {size:'col-xl-4 col-xs-4',type:'select',label:'Mes',placeholder:'Mes',name:'tdcmesexpiracion',readOnly:true,required:true,options:months.value,onChange:$((e:any) => {getMonth$(e)}), dataAttributes: { 'data-openpay-card':'expiration_month' }},
                                                        {size:'col-xl-4 col-xs-4',type:'select',label:'Año',placeholder:'Año',name:'tdcanoexpiracion',readOnly:true,required:true,options:years.value,onChange:$((e:any) => {getYear$(e)}), dataAttributes: { 'data-openpay-card':'expiration_year' }},
                                                        {size:'col-xl-4 col-xs-4 credit-card',type:'number',placeholder:'CVV',label:'CVV',name:'tdccvv',min:'0000',maxLength:'9999',required:true,disableArrows:true, dataAttributes: { 'data-openpay-card':'cvv2' }}
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
                                                            {size:'col-xl-12',type:'text',label:'Razón Social',placeholder:'Razón Social',name:'razonsocial',required:true,onChange:$((e:any) => {getName$(e.target.value)})},
                                                        ]},
                                                        {row:[
                                                            {size:'col-xl-4 col-xs-4',type:'select',label:'Tipo ID',placeholder:'Tipo ID',name:'tipoid',required:true,options:[
                                                                {value:'RFC',label:'RFC'},
                                                                {value:'CC',label:'CC'},
                                                                {value:'PASAPORTE',label:'Pasaporte'},
                                                                {value:'NIT',label:'NIT'}
                                                            ]},
                                                            {size:'col-xl-8 col-xs-8',type:'text',label:'ID',placeholder:'ID',name:'id',required:true},
                                                        ]},
                                                        {row:[
                                                            {size:'col-xl-12',type:'email',label:'Correo',placeholder:'Correo',name:'correo',required:true},
                                                        ]},
                                                        {row:[
                                                            {size:'col-xl-6 col-xs-6',type:'tel',label:'Teléfono',placeholder:'Teléfono',name:'telefono',required:true},
                                                            
                                                            {size:'col-xl-6 col-xs-6',type:'text',label:'C.P.',placeholder:'C.P.',name:'codigopostal',required:true}
                                                        ]}
                                                    ]}
                                                />
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
                        }
                        {
                             formPayment.value == 'STORE'
                             &&
                             <>
                               <h6 class="text-semi-bold text-dark-blue">Pago en comercio</h6>
                               <hr/>
                             <div class="row">
                                <div class='img-card text-center'>
                                    <img src={store.value.barcode} class='img-fluid' width={0} height={0} style={{width:'30%'}} alt='continental-assist-barcode-paynet'/>
                                    <br/>
                                    <small>{store.value.intention}</small>
                                    <br/>
                                    <img src='https://s3.amazonaws.com/images.openpay/Horizontal_1.gif' class='img-fluid' width={0} height={0} style={{width:'80%'}} alt='continental-assist-stores-paynet'/>
                                    <br/>
                                    <a href={import.meta.env.VITE_MY_PUBLIC_WEB_API_PAYNET_PDF+import.meta.env.VITE_MY_PUBLIC_WEB_API_ID_OPEN_PAY+'/'+store.value.intention} type='button' class='btn btn-primary' download>Descargar</a>
                                </div>

                              
                             </div>
                             <hr class="mt-4"/>
                             <div class="row">
                                <div class='col-lg-6'>
                                    <div class='d-grid gap-2 mt-4'>
                                        <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>
                                        
                                    </div>
                                </div>
                            </div>
                             </>
                             
                            
                        }

                        {
                             formPayment.value == 'BANK_ACCOUNT'
                             &&
                             <>
                             <h6 class="text-semi-bold text-dark-blue">Pago en banco</h6>
                             <hr/>
                             <div class="row text-dark-blue">
                            
                                 <h4 class="text-semi-bold ">Datos para el pago:</h4>
                                 <div class="main-payment-container">
                                     <span class="text-medium ">Número de convenio</span>
                                     <span class="dotted-line"></span>
                                     <span class="text-medium">{bank.value.agreement}</span>
                                 </div>
                                 <div class="main-payment-container">
                                     <span class="text-medium">Referencia de pago</span>
                                     <span class="dotted-line"></span>
                                     <span class="text-medium">{bank.value.intention}</span>
                                 </div>   

                                 <div class='img-card text-center'>
                                    <a href={import.meta.env.VITE_MY_PUBLIC_WEB_API_SPEI_PDF+import.meta.env.VITE_MY_PUBLIC_WEB_API_ID_OPEN_PAY+'/'+bank.value.id} type='button' class='btn btn-primary' download>Descargar</a>
                                </div>
                                <br/>
                                <br/>

                                
                             </div>
                           

                             <hr class="mt-4"/>
                             <div class="row">
                                <div class='col-lg-6'>
                                        <div class='d-grid gap-2 mt-4'>
                                            <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>
                                            
                                        </div>
                                    </div>
                            </div>
                             </>
                                                        
                        }
                        </CardPaymentResume>
                    </div>

                    {
                    dataError.value !=''&&<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Ocurrio un error!</strong> Revisa porfavor la información ingresada.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick$={()=>{dataError.value =''}}></button>
                    </div>
                    } 
                </div>
            </div>

        </>
    )
})