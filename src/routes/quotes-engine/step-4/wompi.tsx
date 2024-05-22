import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from '@builder.io/qwik'
import { useNavigate } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import { EncryptAES } from "~/utils/EncryptAES";
import { CalculateAge } from "~/utils/CalculateAge";
import { ParseTwoDecimal } from "~/utils/ParseTwoDecimal";
import CurrencyFormatter from "~/utils/CurrencyFormater";
import styles from './index.css?inline'
import { CardPaymentResume } from "~/components/starter/card-payment-resume/CardPaymentResume";

export interface propsWompi {
    setLoading: (loading: boolean) => void;

}

export default component$((props:propsWompi) => {
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
    const urlvoucher = useSignal(array)
    const attempts = useSignal(stateContext.value.attempts||0)
    const formPayment = useSignal('')
    const qr = useSignal(obj)
    const cash = useSignal(obj)
    const nequi = useSignal(obj)
    const transfers = useSignal(obj)
    const pse = useSignal(obj)
    const institutions = useSignal(array)


    useTask$(async() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            const resAcceptance = await fetch(import.meta.env.PUBLIC_API_WOMPI+'/merchants/'+import.meta.env.PUBLIC_API_WOMPI_KEY,{method: 'GET'})
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

                props.setLoading(false)
            }
        }
    })

    useVisibleTask$(async () => {
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
                totalconversion:Number(ParseTwoDecimal(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value.cupon.idcupon,
                    codigocupon:resume.value.cupon.codigocupon,
                    porcentaje:resume.value.cupon.porcentaje
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.PUBLIC_MODE_SANDBOX,
            }

            if(stateContext.value.wompiTipo == 'BANCOLOMBIA_QR')
            {              
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl : 'http://localhost:5173/quotes-engine/step-5',
                    wompiSandboxStatus : "APPROVED"
                }

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()
                
                
                if(dataPay?.resultado[0].wompiIdTransaccion)
                {
                    const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion})});
                    const dataValidation = await resValidation.json()

                    qr.value = {
                        qr:dataValidation.resultado.payment_method.extra.qr_image,
                        total:resume.value.total.total * stateContext.value.currentRate.rate,
                        voucher:dataValidation.resultado.reference
                    }
                }

                formPayment.value = 'BANCOLOMBIA_QR'
                props.setLoading(false)
            }
            else if(stateContext.value.wompiTipo == 'BANCOLOMBIA_TRANSFER')
            {
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl : 'http://localhost:5173/quotes-engine/step-5',
                    wompiSandboxStatus : "APPROVED",
                    wompiUserTipePSE:0
                }

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()
                
                if(dataPay.resultado[0].wompiIdTransaccion)
                {
                    const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion})});
                    const dataValidation = await resValidation.json()

                    transfers.value = {
                        intention:dataValidation.resultado.payment_method.payment_description,
                        total:resume.value.total.total * stateContext.value.currentRate.rate,
                        voucher:dataValidation.resultado.reference,
                        url:dataValidation.resultado.payment_method.extra.async_payment_url
                    }
                }

                formPayment.value = 'BANCOLOMBIA_TRANSFER'
                navigate(transfers.value.url)
            }
            else if(stateContext.value.wompiTipo == 'NEQUI')
            {
                nequi.value = {
                    total:resume.value.total.total * stateContext.value.currentRate.rate
                }

                formPayment.value = 'NEQUI'
                props.setLoading(false)
            }
            else if(stateContext.value.wompiTipo == 'PSE')
            {
                const resInstitutions = await fetch("/api/getInstitutionsW",{method:"POST",body:JSON.stringify({})});
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
                    props.setLoading(false)
                }
            }
            else if(stateContext.value.wompiTipo == 'BANCOLOMBIA_COLLECT')
            {
                const wompiRequest = {
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiRedirectUrl : 'http://localhost:5173/quotes-engine/step-5',
                    wompiSandboxStatus : "APPROVED"
                }

                Object.assign(dataRequest,wompiRequest)

                const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

                const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
                const dataPay = await resPay.json()

                if(dataPay.resultado[0].wompiIdTransaccion)
                {
                    const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion})});
                    const dataValidation = await resValidation.json()

                    cash.value = {
                        code:dataValidation.resultado.payment_method.extra.business_agreement_code,
                        intention:dataValidation.resultado.payment_method.extra.payment_intention_identifier,
                        total:resume.value.total.total * stateContext.value.currentRate.rate,
                        voucher:dataValidation.resultado.reference
                    }
                }

                formPayment.value = 'BANCOLOMBIA_COLLECT'
                props.setLoading(false)
            }
        }
        else
        {
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
        const bs = (window as any)['bootstrap']
        //const modalSuccess = new bs.Modal('#modalConfirmation',{})
        //const modalError = new bs.Modal('#modalError',{})
        // const modalErrorPax = new bs.Modal('#modalErrorPax',{})
        //const modalErrorAttemps = new bs.Modal('#modalErrorAttemps',{})
        const form = document.querySelector('#form-payment-method') as HTMLFormElement
        const dataForm : {[key:string]:any} = {}
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const checkInvoicing = document.querySelector('#invoicing') as HTMLInputElement
        const dataFormInvoicing : {[key:string]:any} = {}

        props.setLoading(true);
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
            const resToken = await fetch(import.meta.env.PUBLIC_API_WOMPI+'/tokens/cards',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization' : 'Bearer '+import.meta.env.PUBLIC_API_WOMPI_KEY
                },
                body: JSON.stringify(
                {
                    number: dataForm.tdcnumero,
                    cvc: dataForm.tdccvv ,
                    exp_month: String(dataForm.tdcmesexpiracion < 10 ? '0'+String(dataForm.tdcmesexpiracion) : dataForm.tdcmesexpiracion),
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
                    totalconversion:Number(ParseTwoDecimal(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                    tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                    codigoconversion:stateContext.value.currentRate.code,
                    moneda:{
                        idmoneda:resume.value.plan.idmonedapago,
                    },
                    idplataformapago:4,
                    cupon:{
                        idcupon:resume.value.cupon.idcupon,
                        codigocupon:resume.value.cupon.codigocupon,
                        porcentaje:resume.value.cupon.porcentaje
                    },
                    contacto:[resume.value.contacto],
                    ux:stateContext.value.ux ? stateContext.value.ux : '',
                    idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                    sandbox:import.meta.env.PUBLIC_MODE_SANDBOX,
                    wompiTipo : stateContext.value.wompiTipo,
                    wompiAcceptanceToken : wSeesionId.value,
                    wompiTokenCard : wToken.value,
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
                urlvoucher.value = resPayment.resultado;
                //loading.value = false;
                props.setLoading(false);

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

               // modalSuccess.show()
               stateContext.value.urlvoucher =urlvoucher.value
               stateContext.value.typeMessage = 1
               await navigate('/quotes-engine/message')
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
                   // loading.value = false;
                    //modalErrorAttemps.show()
                    stateContext.value.typeMessage = 2
                    await navigate('/quotes-engine/message')
                }

                attempts.value = (attempts.value + 1)
                stateContext.value.attempts =attempts.value
            }

            //loading.value = true
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

    const getPhoneNequi$ = $(async() => {
        let error = false
        const dataForm : {[key:string]:any} = {}
        const formNequi = document.querySelector('#form-nequi') as HTMLFormElement

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

        if(error == false)
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
                totalconversion:Number(ParseTwoDecimal(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value.cupon.idcupon,
                    codigocupon:resume.value.cupon.codigocupon,
                    porcentaje:resume.value.cupon.porcentaje
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.PUBLIC_MODE_SANDBOX,
            }

            const wompiRequest = {
                wompiTipo : stateContext.value.wompiTipo,
                wompiAcceptanceToken : wSeesionId.value,
                wompiRedirectUrl : 'http://localhost:5173/quotes-engine/step-5',
                wompiSandboxStatus : "APPROVED",
                wompiPhoneNumberNequi : dataForm.phone_number
            }

            Object.assign(dataRequest,wompiRequest)

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

            const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()
            
            if(dataPay.resultado[0].wompiIdTransaccion)
            {
                const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion})});
                const dataValidation = await resValidation.json()

                nequi.value = {
                    total:dataValidation.resultado.amount_in_cents,
                    voucher:dataValidation.resultado.reference,
                    phone:dataForm.phone_number
                }
            }
        }
    })

    const getPSE$ = $(async() => {
        let error = false
        const dataForm : {[key:string]:any} = {}
        const formPSE = document.querySelector('#form-pse') as HTMLFormElement

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

                if(input.classList.value.includes('form-select'))
                {
                    dataForm[input.name] = String(input.dataset.value)
                }
            })
        }

        if(error == false)
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
                totalconversion:Number(ParseTwoDecimal(Math.ceil(resume.value.total.total * stateContext.value.currentRate.rate))?.replace('.','')),
                tasaconversion:Number(ParseTwoDecimal(stateContext.value.currentRate.rate)),
                codigoconversion:stateContext.value.currentRate.code,
                moneda:{
                    idmoneda:resume.value.plan.idmonedapago,
                },
                idplataformapago:4,
                cupon:{
                    idcupon:resume.value.cupon.idcupon,
                    codigocupon:resume.value.cupon.codigocupon,
                    porcentaje:resume.value.cupon.porcentaje
                },
                contacto:[resume.value.contacto],
                ux:stateContext.value.ux ? stateContext.value.ux : '',
                idcotizacion:stateContext.value.idcotizacion ? stateContext.value.idcotizacion : '',
                sandbox:import.meta.env.PUBLIC_MODE_SANDBOX,
            }

            const wompiRequest = {
                wompiTipo : stateContext.value.wompiTipo,
                wompiAcceptanceToken : wSeesionId.value,
                wompiRedirectUrl : 'http://localhost:5173/quotes-engine/step-5',
                wompiSandboxStatus : "APPROVED",
                wompiUserTipePSE : 0,
                wompiUserLegalIDPSE : dataForm.document,
                wompiUserLegalIDTypePSE : dataForm.document_type,
                wompiFinancialInstitutionCodePSE : dataForm.institution
            }


            Object.assign(dataRequest,wompiRequest)

            const dataRequestEncrypt = EncryptAES(dataRequest,import.meta.env.PUBLIC_WEB_USER)

            const resPay = await fetch("/api/getPayment",{method:"POST",body:JSON.stringify({data:dataRequestEncrypt})});
            const dataPay = await resPay.json()
            
            if(dataPay.resultado[0].wompiIdTransaccion)
            {
                const resValidation = await fetch("/api/getValidationTransactionW",{method:"POST",body:JSON.stringify({id_transaction:dataPay.resultado[0].wompiIdTransaccion})});
                const dataValidation = await resValidation.json()

                pse.value = {
                    intention:dataValidation.resultado.payment_method.payment_description,
                    total:dataValidation.resultado.amount_in_cents,
                    voucher:dataValidation.resultado.reference,
                    url:dataValidation.resultado.payment_method.extra.async_payment_url
                }

                navigate(pse.value.url)
            }
        }
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
                                    {/* <div class='col-lg-12 col-10 text-end'>
                                        <p class='text-regular text-blue mb-0'>Total</p>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>
                                            {
                                                //CurrencyFormatter('COP',qr.value.total)
                                                CurrencyFormatter(resume.value.total.divisa,resume.value.total.total)
                                            }
                                        </h3>
                                    </div> */}
                                </div>
                            }
                            {
                                formPayment.value == 'BANCOLOMBIA_QR'
                                &&
                                <div class='row justify-content-center'>
                                    {/* <div class='col-lg-4 mb-3'>
                                        <h2 class='h1 text-regular text-blue mb-0'>Referencia</h2>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>{qr.value.voucher}</h3>
                                        <h2 class='h1 text-regular text-blue mb-0'>Total</h2>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>{CurrencyFormatter('COP',qr.value.total)}</h3>
                                    </div> */}
                                    <div class='col-lg-6 offset-lg-1'>
                                        <div class='img-card'>
                                            <img src={'data:image/svg+xml;base64,'+qr.value.qr} class='img-fluid' width={0} height={0} alt='continental-assist-qr-wompi'/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div class='col-lg-12 col-10 text-end'>
                                        <p class='text-regular text-blue mb-0'>Total</p>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>
                                            {
                                                CurrencyFormatter('COP',qr.value.total)
                                            }
                                        </h3>
                                    </div>
                                </div>
                            }
                            {
                                formPayment.value == 'BANCOLOMBIA_COLLECT'
                                &&
                                <div class='row justify-content-center'>
                                    {/* <div class='col-lg-4 mb-3'>
                                        <h2 class='h1 text-regular text-blue mb-0'>Referencia</h2>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>{cash.value.voucher}</h3>
                                        <h2 class='h1 text-regular text-blue mb-0'>Total</h2>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>{CurrencyFormatter('COP',cash.value.total)}</h3>
                                    </div> */}
                                    <div class='col-lg-12'>
                                        <table class="table table-bordered">
                                            <tr>
                                                <th class='text-center' colSpan={2}>Datos para el pago:</th>
                                            </tr>
                                            <tr>
                                                <td>Número de convenio</td>
                                                <td>{cash.value.code}</td>
                                            </tr>
                                            <tr>
                                                <td>Referencia de pago</td>
                                                <td>{cash.value.intention}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <br/>
                                    <div class='col-lg-12 col-10 text-end'>
                                        <p class='text-regular text-blue mb-0'>Total</p>
                                        <h3 class='h1 text-semi-bold text-blue mb-4'>
                                            {
                                                CurrencyFormatter('COP',cash.value.total)
                                            }
                                        </h3>
                                    </div>
                                </div>
                            }
                            {
                                    formPayment.value == 'NEQUI'
                                    &&
                                    <div class='row justify-content-center'>
                                    
                                        <div class='col-lg-12'>
                                            {
                                                nequi.value.phone
                                                ?
                                                <>
                                                    <h2 class='h1 text-regular text-blue mb-0'>Referencia</h2>
                                                    <h3 class='h1 text-semi-bold text-blue mb-4'>{nequi.value.voucher}</h3>
                                                    <h2 class='h1 text-regular text-blue mb-0'>Telefono</h2>
                                                    <h3 class='h1 text-semi-bold text-blue mb-4'>{nequi.value.phone}</h3>
                                                </>
                                                :
                                                <>
                                                    <Form
                                                        id='form-nequi'
                                                        form={[
                                                            {row:[
                                                                {size:'col-xl-12',type:'phone',label:'Número celular de tu cuenta Nequi',name:'phone_number',required:true},
                                                            ]}
                                                        ]}
                                                    />
                                                    <small>Recibiras una notificación push en tu celular.</small>
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-lg-6'>
                                                                <div class='d-grid gap-2 mt-4'>
                                                                    <button type='button' class='btn btn-primary' onClick$={getPhoneNequi$}>Realizar pago</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div class='col-lg-12 col-10 text-end'>
                                            <p class='text-regular text-blue mb-0'>Total</p>
                                            <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                {
                                                    CurrencyFormatter('COP',nequi.value.total)
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                }
                                {
                                    formPayment.value == 'PSE'
                                    &&
                                    <div class='row justify-content-center'>
                                        {/* <div class='col-lg-4 mb-3'>
                                            <h2 class='h1 text-regular text-blue mb-0'>Total</h2>
                                            <h3 class='h1 text-semi-bold text-blue mb-4'>{CurrencyFormatter('COP',pse.value.total)}</h3>
                                        </div> */}
                                        <div class='col-lg-12 '>
                                            <Form
                                                id='form-pse'
                                                form={[
                                                    {row:[
                                                        {size:'col-xl-12',type:'select',label:'Banco',name:'institution',required:true,options:institutions.value},
                                                    ]},
                                                    {row:[
                                                        {size:'col-xl-6',type:'select',label:'Tipo de documento',name:'document_type',required:true,options:[
                                                            {value:'CC',label:'CC - Cedula de ciudadania'},
                                                            {value:'CE',label:'CE - Cedula de extranjenria'},
                                                        ]},
                                                        {size:'col-xl-6',type:'text',label:'Documento',name:'document',required:true}
                                                    ]}
                                                ]}
                                            />
                                            <div class='container'>
                                                <div class='row justify-content-center'>
                                                    <div class='col-lg-6'>
                                                        <div class='d-grid gap-2 mt-4'>
                                                            <button type='button' class='btn btn-primary' onClick$={getPSE$}>Realizar pago</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-lg-12 col-10 text-end'>
                                            <p class='text-regular text-blue mb-0'>Total</p>
                                            <h3 class='h1 text-semi-bold text-blue mb-4'>
                                                {
                                                    CurrencyFormatter('COP',pse.value.total)
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                }    

                       </CardPaymentResume>
                    </div>
                </div>
            </div>
            {/* <div id='modalConfirmation' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border border-success">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <ImgContinentalAssistSuccess class='img-fluid' title='continental-assist-icon-success' alt='continental-assist-icon-success'/>
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
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-icon-error' alt='continental-assist-icon-error'/>
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
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-icon-error' alt='continental-assist-icon-error'/>
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
                            <ImgContinentalAssistError class='img-fluid' title='continental-assist-icon-error' alt='continental-assist-icon-error'/>
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
            </div> */}
        </>
    )
})