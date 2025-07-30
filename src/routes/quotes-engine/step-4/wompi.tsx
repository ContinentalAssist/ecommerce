import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$} from "@builder.io/qwik";
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




export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()

    const array : any[] = []
    const obj : {[key:string]:any} = {}

    const resume = useSignal(obj)
    const wSeesionId = useSignal('')
    const wToken = useSignal('')
    const months = useSignal(array)
    const years = useSignal(array)
    const tdcname = useSignal('xxxxxxxxxxxxxxxxxxxxx')
    const tdcnumber = useSignal('0000 0000 0000 0000')
    const tdcexpiration = useSignal('00/00')
    const attempts = useSignal(stateContext.value.attempts||0)
    const formPayment = useSignal('')
    const qr = useSignal(obj)
    const cash = useSignal(obj)
    const nequi = useSignal(obj)
    const pse = useSignal(obj)
    const institutions = useSignal(array)
    const counterRequest = useSignal(0)
    const wompiIdTransaccion =useSignal('')
    const contextLoading = useContext(LoadingContext)

    
    const validateTransaccion$ = $(async() => {
        const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({id_transaction:wompiIdTransaccion.value})});
        const dataValidation = await resValidation.json()

    
        if (dataValidation.resultado.status == "PENDING" && counterRequest.value > 0) {          
            if (dataValidation?.resultado?.payment_method?.extra?.async_payment_url != null && dataValidation?.resultado?.payment_method?.extra?.async_payment_url != '') 
            {                      
                const url= dataValidation.resultado.payment_method.extra.async_payment_url;

               navigate(url)
                
            }
            else if (dataValidation?.resultado?.payment_method?.extra?.qr_image != null && dataValidation?.resultado?.payment_method?.extra?.external_identifier ==null )
            {
                qr.value = {
                    qr:dataValidation.resultado.payment_method.extra.qr_image,
                    total:resume.value.total.total * stateContext.value.currentRate.rate,
                    voucher:dataValidation.resultado.reference
                }
                contextLoading.value = {status:false, message:''};

                formPayment.value = 'BANCOLOMBIA_QR'
                setTimeout(() =>counterRequest.value ++, 2000); 
            }
            else
            {
                setTimeout(() =>counterRequest.value ++, 2000); 
            }  

        }
        else if (dataValidation.resultado.status == "DECLINED"|| dataValidation.resultado.status == "ERROR") {
            attempts.value =(attempts.value + 1);            
            stateContext.value.attempts =attempts.value
            stateContext.value.typeMessage = 2
            await navigate('/quotes-engine/message')
        }else if (dataValidation?.resultado.status =="APPROVED") {
            if (stateContext.value.wompiTipo =='PSE') {
                const url= dataValidation.resultado.payment_method.extra.async_payment_url;
                navigate(url)
            }else{
                // Preservar todos los datos del contexto y agregar los nuevos datos del pago
                stateContext.value = {
                    ...stateContext.value, // Preservar todos los datos existentes
                    paymentstutus: 'completed',
                    codevoucher: dataValidation.resultado.reference,
                    typeMessage: 1
                }
                await navigate('/quotes-engine/message')
            }
           
        }
              
            

    })

    useTask$(async() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            const resAcceptance = await fetch(import.meta.env.VITE_MY_PUBLIC_API_WOMPI+'/merchants/'+import.meta.env.VITE_MY_PUBLIC_API_WOMPI_KEY,{method: 'GET'})
                .then((res) => {
                    return(res.json())
                })
                
            wSeesionId.value = resAcceptance?.data?.presigned_acceptance?.acceptance_token

            if(stateContext.value.wompiTipo == 'CARD')
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
                
                formPayment.value = 'CARD'
                contextLoading.value = {status:false, message:''};

                
            }
        }
    })

    useTask$(async({track})=>{
        const value=track(() => attempts.value);        
        if (value == 3) {
            stateContext.value.typeMessage = 3
           await navigate('/quotes-engine/message')
        }
 
    })

    useTask$(({track})=>{
        track(() => counterRequest.value);        
        if (counterRequest.value>0 && wompiIdTransaccion.value !='') {
            validateTransaccion$();
        }
 
    })

    useTask$(({track})=>{
        const value = track(() => formPayment.value);
        
        
         if (value =='BANCOLOMBIA_QR') {
             validateTransaccion$();
         }
      
    })

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        if(Object.keys(stateContext.value).length > 0)
        {

            if (stateContext.value.wompiTipo !='CARD') {
                contextLoading.value = {status:true, message: stateContext.value.wompiTipo};
            }
            resume.value = stateContext.value

            const newPaxs : any[] = []
            
            resume.value.asegurados.map((pax:any,index:number) => {
                
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionalesSeleccionados.map((benefit:any) => {
                    const monto=  Number(benefit.precio) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate));
                    newPaxs[index].beneficios_adicionales.push({id:benefit.idbeneficioadicional,
                        nombre:benefit.nombrebeneficioadicional,monto:Number(monto.toFixed(2)),cobertura:benefit.cobertura })    
                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })

            const montodescuento= Number(resume.value?.cupon?.descuento)>0?
            Number(resume.value?.cupon?.descuento) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate)):0;
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
                totalconversion:Number(String(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value?.cupon?.idcupon,
                    codigocupon:resume.value?.cupon?.codigocupon,
                    porcentaje:resume.value?.cupon?.porcentaje,
                    descuento:montodescuento
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                ip_address:resume.value.resGeo.ip_address,
            }
            
            
            if(stateContext.value.wompiTipo == 'BANCOLOMBIA_QR')
            {              
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl :  import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message',
                    wompiSandboxStatus : "APPROVED"
                }
                contextLoading.value = {status:true, message:'Generando QR Bancolombia...'};

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

                const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()
                
                if(dataPay?.resultado.length > 0 &&dataPay?.resultado[0]?.wompiIdTransaccion)
                {
                    counterRequest.value= 1;                   
                    const id=dataPay?.resultado[0]?.wompiIdTransaccion?.id;
                    wompiIdTransaccion.value =id;
                }

                //formPayment.value = 'BANCOLOMBIA_QR'
            }
            else if(stateContext.value.wompiTipo == 'BANCOLOMBIA_TRANSFER')
            {
                
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl : import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE + '/quotes-engine/message',
                    wompiSandboxStatus : "APPROVED",
                    wompiUserTipePSE:0
                }

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)
                const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()
                
                if (dataPay.error) {

                    stateContext.value.typeMessage = 2
                    await navigate('/quotes-engine/message')
                } 
                else if(dataPay?.resultado.length >0 &&dataPay.resultado[0]?.wompiIdTransaccion)
                {
                    contextLoading.value = {status:true, message:'Redireccionando a Bancolombia...'};

                    const id=dataPay?.resultado[0]?.wompiIdTransaccion?.id;
                    wompiIdTransaccion.value =id;
                    counterRequest.value= 1;
                    
                }
                formPayment.value = 'BANCOLOMBIA_TRANSFER'
       
            }
            else if(stateContext.value.wompiTipo == 'NEQUI')
            {
                nequi.value = {
                    total:resume.value.total.total * stateContext.value.currentRate.rate
                }

                formPayment.value = 'NEQUI'
                contextLoading.value = {status:false, message:''};

            }
            else if(stateContext.value.wompiTipo == 'PSE')
            {
                const resInstitutions = await fetch("/api/getInstitutionsW",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({})});
                const dataInstitutions = await resInstitutions.json()
               
                if(dataInstitutions.error == false)
                {
                    const newInstitutions : any[] = []

                    dataInstitutions.resultado.map((institution:any) => {
                        newInstitutions.push({value:institution.financial_institution_code,label:institution.financial_institution_name})
                    })

                    institutions.value = newInstitutions

                    pse.value = {
                        total:resume.value.total.total * stateContext.value.currentRate.rate
                    }

                    formPayment.value = 'PSE'
                    contextLoading.value = {status:false, message:''};

                }
                else
                {
                    contextLoading.value = {status:false, message:''};

                }
            }
            else if(stateContext.value.wompiTipo == 'BANCOLOMBIA_COLLECT')
            {
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl :  import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message',
                    wompiSandboxStatus : "APPROVED"
                }

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

                const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()

                if(dataPay?.resultado.length >0&&dataPay.resultado[0]?.wompiIdTransaccion)
                {
                    const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion.id})});
                    const dataValidation = await resValidation.json()

                    cash.value = {
                        code:dataValidation.resultado.payment_method.extra.business_agreement_code,
                        intention:dataValidation.resultado.payment_method.extra.payment_intention_identifier,
                        total:resume.value.total.total * stateContext.value.currentRate.rate,
                        voucher:dataValidation.resultado.reference
                    }
                    contextLoading.value = {status:false, message:''};

                }
                else
                {
                    contextLoading.value = {status:false, message:''};

                }

                formPayment.value = 'BANCOLOMBIA_COLLECT'
               
            }
        }
        else
        {
            contextLoading.value = {status:false, message:''};

            // loading.value = false
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
          
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
       /*  const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
        const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement */
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const dataFormInvoicing : {[key:string]:any} = {}
        const dataFormPayment : {[key:string]:any} = {}
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;
      
        contextLoading.value = {status:true, message:'Realizando el pago...'};

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
            const resToken = await fetch(import.meta.env.VITE_MY_PUBLIC_API_WOMPI+'tokens/cards',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization' : 'Bearer '+import.meta.env.VITE_MY_PUBLIC_API_WOMPI_KEY
                },
                body: JSON.stringify(
                {
                    number: dataForm.tdcnumero,
                    cvc: dataForm.tdccvv ,
                    exp_month: String( dataForm.tdcmesexpiracion),
                    exp_year: String(dataForm.tdcanoexpiracion),
                    card_holder: dataForm.tdctitular
                }
            )})
                .then((res) => {
                    return(res.json())
                })

            wToken.value = resToken?.data?.id

            const newPaxs : any[] = []
            
            resume.value.asegurados.map((pax:any,index:number) => {
                
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionalesSeleccionados.map((benefit:any) => {
                    const monto=  Number(benefit.precio) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate));
                    newPaxs[index].beneficios_adicionales.push({id:benefit.idbeneficioadicional,
                        nombre:benefit.nombrebeneficioadicional,monto:Number(monto.toFixed(2)),cobertura:benefit.cobertura })
                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })
            
            const montodescuento= Number(resume.value?.cupon?.descuento)>0?
           Number( Number(resume.value?.cupon?.descuento) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate))):0;

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
                    totalconversion:Number(String(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                    tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                    codigoconversion:stateContext.value.currentRate.code,
                    moneda:{
                        idmoneda:resume.value.plan.idmonedapago,
                    },
                    idplataformapago:4,
                    cupon:{
                        idcupon:resume.value?.cupon?.idcupon,
                        codigocupon:resume.value?.cupon?.codigocupon,
                        porcentaje:resume.value?.cupon?.porcentaje,
                        descuento: montodescuento
                    },
                    contacto:[resume.value.contacto],
                    ux:stateContext.value.ux ? stateContext.value.ux : '',
                    idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                    sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiTokenCard : wToken.value,
                    ip_address:resume.value.resGeo.ip_address,
                }
            )
            
            if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                //const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;

                dataFormInvoicing.tipoPersona = radioTypePerson.value;
                dataFormInvoicing.origenFactura = stateContext.value.country;
                dataFormInvoicing.codigociudad = null;//codigoCiudad;
                dataFormInvoicing.idciudad = null;//Number(inputCity.dataset?.value);
                dataFormInvoicing.idestado = null; //Number(inputState.dataset?.value);
                dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);
                dataRequest.facturacion = dataFormInvoicing;
            }


            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

            let resPayment : {[key:string]:any} = {}

            const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()

            resPayment = dataPay

            if(resPayment.error == false)
            {

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
               contextLoading.value = {status:true, message:'Estamos procesando tu pago ...'};

               const id=resPayment?.resultado[0]?.wompiIdTransaccion?.id;
               wompiIdTransaccion.value =id;
               counterRequest.value= 1;
            }
            else
            {
                if(attempts.value < 2)
                {
                    //loading.value = false;
                    //modalError.show()
                    stateContext.value.typeMessage = 2
                    await navigate('/quotes-engine/message')
                }
                else
                {
                    stateContext.value.typeMessage = 2
                    await navigate('/quotes-engine/message')
                }

                attempts.value = (attempts.value + 1)
                stateContext.value.attempts =attempts.value
            }

            //loading.value = true
        }else{
            contextLoading.value = {status:false, message:''}
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


    const getPhoneNequi$ = $(async() => {
        contextLoading.value = {status:true, message:'Realizando el pago...'};

        let error = false
        let errorInvoicing = false

        const dataForm : {[key:string]:any} = {}
        const dataFormInvoicing : {[key:string]:any} = {}
        //const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
        //const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement
        const formNequi = document.querySelector('#form-nequi') as HTMLFormElement
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;

        if(!formNequi.checkValidity())
        {
            formNequi.classList.add('was-validated')
            error = true
        }
        else
        {
            error = false

            formNequi.classList.remove('was-validated')

            const input = formNequi.querySelector('input') as HTMLInputElement

            dataForm[input.name] = input.value
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
            const newPaxs : any[] = []
            
            resume.value.asegurados.map((pax:any,index:number) => {
                
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionalesSeleccionados.map((benefit:any) => {
                    const monto=  Number(benefit.precio) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate));
                    newPaxs[index].beneficios_adicionales.push({id:benefit.idbeneficioadicional,
                        nombre:benefit.nombrebeneficioadicional,monto:Number(monto.toFixed(2)),cobertura:benefit.cobertura }) 
                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })
            const montodescuento= Number(resume.value?.cupon?.descuento)>0?
            Number(resume.value?.cupon?.descuento) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate)):0;

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
                totalconversion:Number(String(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value?.cupon?.idcupon,
                    codigocupon:resume.value?.cupon?.codigocupon,
                    porcentaje:resume.value?.cupon?.porcentaje,
                    descuento:montodescuento
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                ip_address:resume.value.resGeo.ip_address,
            }

             if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                //const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;

                dataFormInvoicing.tipoPersona = radioTypePerson.value;
                dataFormInvoicing.origenFactura = stateContext.value.country;
                dataFormInvoicing.codigociudad = null;//codigoCiudad;
                dataFormInvoicing.idestado = null; //Number(inputState.dataset?.value);
                dataFormInvoicing.idciudad = null;//Number(inputCity.dataset?.value);
                dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);
                Object.assign(dataRequest,{facturacion:dataFormInvoicing});
            }

            const wompiRequest = {
                wompiTipo : stateContext.value.wompiTipo,
                wompiAcceptanceToken : wSeesionId.value,
                wompiRedirectUrl :  import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message',
                wompiSandboxStatus : "APPROVED",
                wompiPhoneNumberNequi : dataForm.phone_number
            }

            Object.assign(dataRequest,wompiRequest)

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)
            const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()

            if(dataPay.resultado[0]?.wompiIdTransaccion)
            {
                contextLoading.value = {status:true, message:'Estamos procesando tu pago ...'};

                const id=dataPay?.resultado[0]?.wompiIdTransaccion?.id;
                wompiIdTransaccion.value =id;
                counterRequest.value= 1;

            }else{
                contextLoading.value = {status:false, message:''};
                if(attempts.value < 2)
                    {
                        //loading.value = false;
                        //modalError.show()
                        stateContext.value.typeMessage = 2
                        await navigate('/quotes-engine/message')
                    }
                    else
                    {
                        stateContext.value.typeMessage = 2
                        await navigate('/quotes-engine/message')
                    }
    
                    attempts.value = (attempts.value + 1)
                    stateContext.value.attempts =attempts.value
            }
        }else{
            contextLoading.value = {status:false, message:''}
        }
    })

    const getPSE$ = $(async() => {
        let error = false
        let errorInvoicing = false
        const dataForm : {[key:string]:any} = {}
        const dataFormInvoicing : {[key:string]:any} = {}
        //const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
        //const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement
        const formPSE = document.querySelector('#form-pse') as HTMLFormElement
        contextLoading.value = {status:true, message:'Realizando el pago...'};
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;

        if(!formPSE.checkValidity())
        {
            formPSE.classList.add('was-validated')
            error = true
        }
        else
        {
            formPSE.classList.remove('was-validated')

            const inputs = Array.from(formPSE.querySelectorAll('input,select'))

            inputs.map((input:any) => {
                dataForm[input.name] = input.value

                if(input.classList.value.includes('form-control-select'))
                {
                    dataForm[input.name] = String(input.dataset.value)
                }
            })
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
            const newPaxs : any[] = []
            
            resume.value.asegurados.map((pax:any,index:number) => {
                
                newPaxs.push(pax)

                newPaxs[index].beneficios_adicionales = []

                pax.beneficiosadicionalesSeleccionados.map((benefit:any) => {
                    const monto=  Number(benefit.precio) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate));
                    newPaxs[index].beneficios_adicionales.push({id:benefit.idbeneficioadicional,
                        nombre:benefit.nombrebeneficioadicional,monto:Number(monto.toFixed(2)),cobertura:benefit.cobertura }) 

                })

                newPaxs[index].fechaNac = newPaxs[index].fechanacimiento.split('-').reverse().join('/')
                newPaxs[index].edad = CalculateAge(newPaxs[index].fechanacimiento)
            })

            const montodescuento= Number(resume.value?.cupon?.descuento)>0?
            Number(resume.value?.cupon?.descuento) * Number(ParseTwoDecimal(stateContext.value.currentRate.rate)):0;
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
                totalconversion:Number(String(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value?.cupon?.idcupon,
                    codigocupon:resume.value?.cupon?.codigocupon,
                    porcentaje:resume.value?.cupon?.porcentaje,
                    descuento:montodescuento
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.VITE_MY_PUBLIC_MODE_SANDBOX,
                ip_address:resume.value.resGeo.ip_address,
            }

            if(checkInvoicing.checked === true && errorInvoicing === false)
            {
                //const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
                
                dataFormInvoicing.tipoPersona = radioTypePerson.value;
                dataFormInvoicing.origenFactura = stateContext.value.country;
                dataFormInvoicing.codigociudad = null;//codigoCiudad;
                dataFormInvoicing.idestado = null; //Number(inputState.dataset?.value);
                dataFormInvoicing.idciudad = null; //Number(inputCity.dataset?.value);
                dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);
                Object.assign(dataRequest,{facturacion:dataFormInvoicing});
            }

            const wompiRequest = {
                wompiTipo : stateContext.value.wompiTipo,
                wompiAcceptanceToken : wSeesionId.value,
                wompiRedirectUrl : import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE +'/quotes-engine/message',
                wompiSandboxStatus : "APPROVED",
                wompiUserTipePSE : 0,
                wompiUserLegalIDPSE : dataForm.document,
                wompiUserLegalIDTypePSE : dataForm.document_type,
                wompiFinancialInstitutionCodePSE : dataForm.institution
            }

            Object.assign(dataRequest,wompiRequest)

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.VITE_MY_PUBLIC_WEB_KEY)

            const resPay = await fetch("/api/getPayment",{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()

            if(dataPay.resultado[0]?.wompiIdTransaccion)
            {
                contextLoading.value = {status:true, message:'Estamos procesando tu pago ...'};

                const id=dataPay?.resultado[0]?.wompiIdTransaccion?.id;
                wompiIdTransaccion.value =id;
                counterRequest.value= 1;
            }
            else{
                contextLoading.value = {status:false, message:''};
                if(attempts.value < 2)
                    {
                        stateContext.value.typeMessage = 2
                        await navigate('/quotes-engine/message')
                    }
                    else
                    {
                        stateContext.value.typeMessage = 2
                        await navigate('/quotes-engine/message')
                    }
    
                    attempts.value = (attempts.value + 1)
                    stateContext.value.attempts =attempts.value
            }
        }else{
            contextLoading.value = {status:false, message:''}
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
                                <div class='row justify-content-center'>
                                        <p class=' text-semi-bold text-blue  text-end'> Ingresa la información de tu tarjeta</p>

                                    <div class='col-lg-12'>
                                        <Form
                                            id='form-payment-method'
                                            form={[
                                                {row:[
                                                    {size:'col-xl-12',type:'text',label:'Nombre completo',placeholder:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true', dataAttributes: { 'data-openpay-card':'holder_name' }},
                                                    {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',placeholder:'Número de tarjetas',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true, dataAttributes: { 'data-openpay-card': 'card_number' }},
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
                                            <InvoiceFormCO/>                   
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
                                                        <button type='button' class='btn btn-primary' onClick$={()=>{getPayment$()}}>Realizar pago</button>
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
                            }
                           {/*  {
                                formPayment.value == 'BANCOLOMBIA_QR'
                                &&
                                <>
                                 <h6 class="text-semi-bold text-dark-blue">QR Bancolombia</h6>
                                <hr/>
                                <div class='row '>
                                    <div class='col-lg-6 '>
                                    <h3 class="text-semi-bold text-dark-blue">Escanea este <br/> código QR</h3>
                                    <p class="text-regular text-dark-blue"> con tu celular para realizar <br/> el pago de tu plan de asistencia </p>
                                    </div>
                                    <div class='col-lg-6 '>
                                        <div class='d-flex justify-content-end'>
                                            <img src={'data:image/svg+xml;base64,'+qr.value.qr}  width={0} height={0} style={{ width:'70%', height:'auto'}} alt='continental-assist-qr-wompi'/>
                                        </div>
                                    </div>
                                    <br/>

                                    <div class='container'>
                                        <div class='row justify-content-center mb-4'>
                                            <div class='col-lg-6'>
                                                <div class='d-grid gap-2 mt-4'>
                                                    <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>
                                                    
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                </div>
                                <hr/>
                                </>
                            } */}
                            {/* {
                                formPayment.value == 'BANCOLOMBIA_COLLECT'
                                &&
                                <>
                                <h6 class="text-semi-bold text-dark-blue">Efectivo</h6>
                                <hr/>
                                <div class="row text-dark-blue">
                               
                                    <h4 class="text-semi-bold ">Datos para el pago:</h4>
                                    <div class="main-payment-container">
                                        <span class="text-medium ">Número de convenio</span>
                                        <span class="dotted-line"></span>
                                        <span class="text-medium">{cash.value.code}</span>
                                    </div>
                                    <div class="main-payment-container">
                                        <span class="text-medium">Referencia de pago</span>
                                        <span class="dotted-line"></span>
                                        <span class="text-medium">{cash.value.intention}</span>
                                    </div>   

                                   
                                </div>
                                <hr/>
                                </>
                               


                            } */}
                            {
                                    formPayment.value == 'NEQUI'
                                    &&
                                    <>
                                     <h6 class="text-semi-bold text-dark-blue">NEQUI</h6>
                                     <hr/>
                                    <div class='row justify-content-center'>
                                    
                                            {
                                               
                                                <>

                                                 <br/>
                                                 <br/>
                                                <div class="col-lg-9 col-sm-12 mt-4">
                                               
                                                   
                                                <Form
                                                        id='form-nequi'
                                                        form={[
                                                            {row:[
                                                                {size:'col-xl-12',type:'phone',label:'Número celular de tu cuenta Nequi',name:'phone_number',
                                                                placeholder:'Número celular de tu cuenta Nequi',required:true},
                                                            ]}
                                                        ]}
                                                    />
                                                    

                                                </div>
                                                    
                                                <div class='col-lg-3 mt-4'>
                                                    <div class='d-grid gap-2 mt-2'>
                                                        <button type='button' class='btn btn-primary' onClick$={getPhoneNequi$}>Pagar</button>
                                                        {
                                                             attempts.value > 0
                                                             &&
                                                             <span class='text-center rounded-pill text-bg-warning'>{attempts.value} intentos</span>
                                                             
                                                        }
                                                    </div>
                                                </div>

                                                <small class="text-regular"><b>Recuerda que es necesario tener la app de Nequi instalada en tu celular <br/>
                                                                            para poder completar el pago usando este método.</b></small>                                     
                                                <small class="text-regular"><b>Inicia la app de Nequi al momento de realizar el pago y espera la notificacion para autorizar tu compra</b></small> 

                                                <br/>                                               
                                                <br/>

                                                <div class='col-lg-6'>
                                                        <div class='d-grid gap-2 mt-4'>
                                                            <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>
                                                            
                                                        </div>
                                                </div>
                                                </>
                                            }

                                    </div>
                                    <hr />
                                    <br/>

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
                                            <InvoiceFormCO/>
                                        </div>
                                    </>
                                }
                                {
                                    formPayment.value == 'PSE'
                                    &&
                                    <>
                                    <h6 class="text-semi-bold text-dark-blue">PSE</h6>
                                    <hr/>
                                    <div class='row justify-content-center'>
                                    
                                    <div class="d-flex justify-content-start mb-4">
                       
                                    </div>

                                 
                                    <br/>
                                    <br/>
                                        <div class='col-lg-12 '>
                                            <Form
                                                id='form-pse'
                                                form={[
                                                   
                                                    {row:[
                                                        {size:'col-xl-6',type:'select',label:'Tipo de documento',placeholder:'Tipo de documento',name:'document_type',required:true,options:[
                                                            {value:'CC',label:'CC - Cédula de ciudadanía'},
                                                            {value:'CE',label:'CE - Cédula de extranjería'},
                                                        ]},
                                                        {size:'col-xl-6',type:'text',label:'Documento',placeholder:'Documento',name:'document',required:true}
                                                    ]},
                                                    {row:[
                                                        {size:'col-xl-12',type:'select',label:'Banco',placeholder:'Banco',name:'institution',required:true,options:institutions.value},
                                                    ]},
                                                ]}
                                            />
                                            <div class='container'>
                                                <div class='row justify-content-center mb-4'>
                                                    <div class='col-lg-6'>
                                                        <div class='d-grid gap-2 mt-4'>
                                                            <button type='button' class='btn btn-outline-primary' onClick$={()=>navigate('/quotes-engine/step-3')}>Regresar</button>
                                                            
                                                        </div>
                                                    </div>
                                                    <div class='col-lg-6'>
                                                        <div class='d-grid gap-2 mt-4'>
                                                            <button type='button' class='btn btn-primary' onClick$={getPSE$}>Realizar pago</button>
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
                                      
                                     
                                    <br/>
                                    <br/>
                                       
                                    </div>
                                    <hr />

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
                                            <InvoiceFormCO/>
                                        </div>
                                    </>
                                    
                                }    

                       </CardPaymentResume>
                    </div>
                </div>
            </div>
           
        </>
    )
})