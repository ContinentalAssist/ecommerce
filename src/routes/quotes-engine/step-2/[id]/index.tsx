import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import styles from '../index.css?inline'
import DateFormat from "~/utils/DateFormat";

export const head: DocumentHead = {
    title : 'Continental Assist | Tus datos y complementos',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Tus datos y complementos'},
        {name:'description',content:'Paso 2 - Tus datos y complementos. Continental Assist acompaña internacionalmente, adquiere tu plan, ingresa tus datos y elige complementos.'},
        {property:'og:title',content:'Continental Assist | Tus datos y complementos'},
        {property:'og:description',content:'Paso 2 - Tus datos y complementos. Continental Assist acompaña internacionalmente, adquiere tu plan, ingresa tus datos y elige complementos.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-2/[id]'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()
    const location = useLocation()

    const arrayAdditionalsBenefits: {[key:string]:any,beneficiosadicionalesasignados:any[],beneficiosadicionales:any[]}[] = []
    const objectAdditionalsBenefitsPlan:{[key:string]:any,beneficiosadicionalesasignados:any[],beneficiosadicionales:any[]} = {beneficiosadicionalesasignados:[],beneficiosadicionales:[]}
    const objectResume : {[key:string]:any} = {}
    const array : any[] = []
    const objectPlanSelected: {[key:string]:any} = {}
    const arrayPlans: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]}[] = []

    const additionalsBenefits = useSignal(arrayAdditionalsBenefits)
    const additionalsBenefitsPlan = useSignal(objectAdditionalsBenefitsPlan)
    const resume = useSignal(objectResume)
    const totalPay = useSignal({divisa:'',total:0})
    const contact = useSignal(objectResume)
    const prevTotal = useSignal(0)
    const loading = useSignal(true)
    const origins = useSignal(array)
    const destinations = useSignal(array)
    const planSelected = useSignal(objectPlanSelected)
    const plans = useSignal(arrayPlans)

    useVisibleTask$(async() => {
        let res : {[key:string]:any[]} = {}
        const resOrigins : any[] = []
        const resDestinations : any[] = []

        const resDefaults = await fetch("/api/getDefaults",{method:"GET"});
        const dataDefaults = await resDefaults.json()
        res = dataDefaults.resultado[0]

        res.origenes.map((origen) => {
            resOrigins.push({value:origen.idpais,label:origen.nombrepais})
        })

        res.destinos.map((destino) => {
            resDestinations.push({value:destino.idpais,label:destino.nombrepais})
        })

        origins.value = resOrigins
        destinations.value = resDestinations
    })

    useVisibleTask$(async() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            const prevResume : {[key:string]:any} = stateContext.value

            if(prevResume.asegurados != undefined)
            {
                resume.value = stateContext.value
                contact.value = stateContext.value.contacto
                totalPay.value = {divisa:resume.value.plan.codigomonedapago,total:resume.value.total.total}
                additionalsBenefits.value = prevResume.asegurados
            }
            else
            {
                resume.value = stateContext.value
                totalPay.value = {divisa:resume.value.plan.codigomonedapago,total:Number(resume.value.plan.precio_grupal)}
                let newRes: any[] = []

                const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                    .then((response) => {return(response.json())})
                const newAges : any[] = []

                resume.value.edades.map((age:any) => {
                    if(age == 70)
                    {
                        newAges.push(40)
                    }
                    else if(age == 85)
                    {
                        newAges.push(72)
                    }
                })

                const dataRequest = {
                    idplan:resume.value.plan.idplan,
                    dias:resume.value.dias,
                    edades:resume.value.edades,
                    // edades:newAges,
                    ip:resGeo.ip_address,
                }

                const resAdditionals = await fetch("/api/getAdditionalsBenefits",{method:"POST",body:JSON.stringify(dataRequest)});
                const dataAdditionals = await resAdditionals.json()
                newRes = dataAdditionals.resultado

                const today = DateFormat(new Date)

                newRes.map((res,index) => {
                    // const min = new Date(new Date(today).setMonth(new Date(today).getMonth() - (res.edad*12))).toISOString().substring(0,10)
                    const min = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (res.edad*12))))
                    let max = ''
                    
                    if(res.edad == '22')
                    {
                        // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (0*12))).toISOString().substring(0,10)
                        max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (0*12))))
                    }
                    else if (res.edad == '70')
                    {
                        // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (23*12))).toISOString().substring(0,10)
                        max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (23*12))))
                    }
                    else if (res.edad == '85')
                    {
                        // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (71*12))).toISOString().substring(0,10)
                        max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (71*12))))
                    }

                    res.minDate = min
                    res.maxDate = max
                    res.idpasajero = index+1
                    res.beneficiosadicionalesasignados = res.beneficiosadicionales
                    res.beneficiosadicionales = []
                    res.documentacion = ''
                })
                
                additionalsBenefits.value = newRes
            }

            if(additionalsBenefits.value.length > 0)
            {
                loading.value = false
            }
        }
        else
        {
            // loading.value = false
            // navigate('/quotes-engine/step-1')

            const dataForm : {[key:string]:any} = {}

            const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                .then((response) => {return(response.json())})

            Object.assign(dataForm,stateContext.value)
            dataForm.idfuente = 2
            dataForm.ip = resGeo.ip_address

            const newResume : {[key:string]:any} = {}

            newResume.paisesdestino = []
            newResume[22] = 0
            newResume[70] = 0
            newResume[85] = 0
            newResume.edades = []

            const resQuote = await fetch("/api/getQuote",{method:"POST",body:JSON.stringify({idcotizacion:Number(location.params.id.split('-')[0])})});
            const dataQuote = await resQuote.json()
            newResume.idagencia = dataQuote.resultado[0].idagencia
            newResume.idcotizacion = dataQuote.resultado[0].idcotizacion
            newResume.idusuario = dataQuote.resultado[0].idusuario
            newResume.desde = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.fecha.desde
            newResume.hasta = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.fecha.hasta
            newResume.dias = Number(JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.fecha.dias)
            newResume.origen = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.origen
            newResume.destinos = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.destinos
            newResume.idcotizacion = Number(location.params.id.split('-')[0])

            origins.value.map(origin => {
                if(origin.value == newResume.origen)
                {
                    newResume.paisorigen = origin.label
                }
            }) 
            
            destinations.value.map(destination => {
                newResume.destinos.map((destino:any) => {
                    if(destination.value == destino)
                    {
                        newResume.paisesdestino.push(destination.label)
                    }
                })
            }) 

            newResume.asegurados = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.pasajeros
            newResume.contacto = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.contacto

            if(JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.contacto)
            {
                contact.value = JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.contacto
            }

            JSON.parse(dataQuote.resultado[0].jsoncotizacion).cotizacion.pasajeros.map((pax:any) => {
                if(pax.edad <= 22)
                {
                    newResume[22] += 1
                    newResume.edades.push(22)
                }
                else if(pax.edad > 22 && pax.edad <= 70)
                {
                    newResume[70] += 1
                    newResume.edades.push(70)
                }
                else if(pax.edad < 70 && pax.edad <= 85)
                {
                    newResume[85] += 1
                    newResume.edades.push(85)
                }
            })

            newResume.pasajeros = (newResume[22] > 0 ? newResume[22]+' Niño(s) y joven(es) ' : '') + (newResume[70] > 0 ? newResume[70]+' Adulto(s) ' : '') + (newResume[85] > 0 ? newResume[85]+' Adulto(s) mayor(es) ' : '')

            plans.value = dataQuote.resultado[0].planescotizados
            
            dataQuote.resultado[0].planescotizados.map((plancotizado:any) => {
                if(plancotizado.idplan === Number(location.params.id.split('-')[1]))
                {
                    planSelected.value = {
                        idplan : plancotizado.idplan,
                        nombreplan : plancotizado.nombreplan,
                        precio_grupal : plancotizado.precio_grupal,
                        precioindividual : plancotizado.precio_individual,
                        codigomonedapago : plancotizado.codigomonedapago
                    }
                }
            })
            
            Object.assign(newResume,{planescotizados:plans.value},{plan:planSelected.value})

            // -----------------------------

            resume.value = newResume
            totalPay.value = {divisa:newResume.plan.codigomonedapago,total:Number(newResume.plan.precio_grupal)}
            let newRes: any[] = []

            const resGeoPrev = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                .then((response) => {return(response.json())})
            const newAges : any[] = []

            resume.value.edades.map((age:any) => {
                if(age == 70)
                {
                    newAges.push(40)
                }
                else if(age == 85)
                {
                    newAges.push(72)
                }
            })

            const dataRequest = {
                idplan:newResume.plan.idplan,
                dias:newResume.dias,
                edades:newResume.edades,
                // edades:newAges,
                ip:resGeoPrev.ip_address,
            }

            const resAdditionals = await fetch("/api/getAdditionalsBenefits",{method:"POST",body:JSON.stringify(dataRequest)});
            const dataAdditionals = await resAdditionals.json()
            newRes = dataAdditionals.resultado

            const today = DateFormat(new Date)

            newRes.map((res,index) => {
                // const min = new Date(new Date(today).setMonth(new Date(today).getMonth() - (res.edad*12))).toISOString().substring(0,10)
                const min = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (res.edad*12))))
                let max = ''
                
                if(res.edad == '22')
                {
                    // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (0*12))).toISOString().substring(0,10)
                    max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (0*12))))
                }
                else if (res.edad == '70')
                {
                    // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (23*12))).toISOString().substring(0,10)
                    max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (23*12))))
                }
                else if (res.edad == '85')
                {
                    // max = new Date(new Date(today).setMonth(new Date(today).getMonth() - (71*12))).toISOString().substring(0,10)
                    max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (71*12))))
                }

                res.minDate = min
                res.maxDate = max
                res.idpasajero = index+1
                
                newResume.asegurados[index].beneficiosadicionales.map((additional:any) => {
                    res.beneficiosadicionales.map((additionalAsign:any) => {
                        if(additional.id == additionalAsign.idbeneficioadicional)
                        {
                            additionalAsign.seleccionado = true
                        }

                        if(additional.id == 36)
                        {
                            if(additionalAsign.idbeneficioadicional == 37)
                            {
                                additionalAsign.disabled = true
                            }
                        }
                        else if(additional.id == 37)
                        {
                            if(additionalAsign.idbeneficioadicional == 36)
                            {
                                additionalAsign.disabled = true
                            }
                        }
                    })
                })

                res.beneficiosadicionalesasignados = res.beneficiosadicionales

                newResume.asegurados[index].beneficiosadicionales.map((benefit:any) => {
                    benefit.idbeneficioadicional = benefit.id
                    benefit.nombrebeneficioadicional = benefit.nombre
                    benefit.codigomonedapago = newResume.plan.codigomonedapago
                })

                res.beneficiosadicionales = newResume.asegurados[index].beneficiosadicionales
                res.nombres = newResume.asegurados[index].nombres
                res.apellidos = newResume.asegurados[index].apellidos
                res.documentacion = newResume.asegurados[index].documentacion
                res.correo = newResume.asegurados[index].correo
                res.telefono = newResume.asegurados[index].telefono
                res.fechanacimiento = newResume.asegurados[index].fechanacimiento
            })

            stateContext.value = newResume
            additionalsBenefits.value = newRes

            if(additionalsBenefits.value.length > 0)
            {
                loading.value = false
            }
        }
    })

    const getAdditionalsbBenefits$ = $((index:number) => {
        additionalsBenefitsPlan.value = additionalsBenefits.value[index]
    })

    const getAdditional$ = $((index:number,idpax:number,benefit:object) => {
        const dataBenefits: any[] = additionalsBenefits.value
        const dataLayer : {[key:string]:any} = {}

        dataBenefits.map((pax,indexP) => {
            if(pax.idpasajero == idpax)
            {
                dataBenefits[indexP].beneficiosadicionales.push(benefit)
                dataBenefits[indexP].beneficiosadicionalesasignados[index].seleccionado = true

                dataBenefits[indexP].beneficiosadicionalesasignados.map((additional:any) => {
                    if(dataBenefits[indexP].beneficiosadicionalesasignados[index].idbeneficioadicional == 36)
                    {
                        if(additional.idbeneficioadicional == 37)
                        {
                            additional.disabled = true
                        }
                    }
                    else if(dataBenefits[indexP].beneficiosadicionalesasignados[index].idbeneficioadicional == 37)
                    {
                        if(additional.idbeneficioadicional == 36)
                        {
                            additional.disabled = true
                        }
                    }
                })
                
                additionalsBenefitsPlan.value = Object.assign({},dataBenefits[indexP])
                totalPay.value.total += Number(dataBenefits[indexP].beneficiosadicionalesasignados[index].precio)
            }

            const benefitsDataLayer : any[] = []

            dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                benefitsDataLayer.push(additional.nombrebeneficioadicional)
            })

            dataLayer['viajero'+pax.idpasajero] = String(benefitsDataLayer)
        })

        stateContext.value.dataLayerPaxBenefits = dataLayer;

        (window as any)['dataLayer'].push(
            Object.assign({
                'event': 'TrackEventGA4',
                'category': 'Flujo asistencia',
                'action': 'Paso 3 :: beneficios',
                'cta': 'Agregar',
            },dataLayer)
        );
    })

    const deleteAdditional$ = $((index:number,idpax:number,benefit:{[key:string]:any}) => {
        const dataBenefits: {[key:string]:any,beneficiosadicionales:any[],beneficiosadicionalesasignados:any[]}[] = additionalsBenefits.value
        const dataLayer : {[key:string]:any} = {}

        dataBenefits.map((pax,indexP) => {
            if(pax.idpasajero == idpax)
            {
                dataBenefits[indexP].beneficiosadicionales.map(((item,indexI) => {
                    if(item.idbeneficioadicional == benefit.idbeneficioadicional)
                    {
                        dataBenefits[indexP].beneficiosadicionales.splice(indexI,1)
                        dataBenefits[indexP].beneficiosadicionalesasignados[index].seleccionado = false

                        dataBenefits[indexP].beneficiosadicionalesasignados.map((additional:any) => {
                            if(dataBenefits[indexP].beneficiosadicionalesasignados[index].idbeneficioadicional == 36)
                            {
                                if(additional.idbeneficioadicional == 37)
                                {
                                    additional.disabled = false
                                }
                            }
                            else if(dataBenefits[indexP].beneficiosadicionalesasignados[index].idbeneficioadicional == 37)
                            {
                                if(additional.idbeneficioadicional == 36)
                                {
                                    additional.disabled = false
                                }
                            }
                        })

                        additionalsBenefitsPlan.value = Object.assign({},dataBenefits[indexP])
                        totalPay.value.total = (totalPay.value.total-dataBenefits[indexP].beneficiosadicionalesasignados[index].precio)
                    }
                }))
            }

            const benefitsDataLayer : any[] = []

            dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                benefitsDataLayer.push(additional.nombrebeneficioadicional)
            })

            dataLayer['viajero'+pax.idpasajero] = String(benefitsDataLayer)
        })

        stateContext.value.dataLayerPaxBenefits = dataLayer;

        (window as any)['dataLayer'].push(
            Object.assign({
                'event': 'TrackEventGA4',
                'category': 'Flujo asistencia',
                'action': 'Paso 3 :: beneficios',
                'cta': 'Remover',
            },dataLayer)
        );
    })

    const getPaxs$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const toastError = new bs.Toast('#toast-error',{})
        const containerForms = document.querySelector('.cards-paxs') as HTMLElement
        const forms = Array.from(containerForms.querySelectorAll('form'))
        const checkPolicy = document.querySelector('input[name=aceptapolitica]') as HTMLInputElement
        
        const dataForm: any[] = additionalsBenefits.value
        const error : any[] = []

        if(checkPolicy.checked == true)
        {
            forms.map((form,index) => {
                if(!form.checkValidity())
                {
                    form.classList.add('was-validated')

                    const card = document.querySelector('#card-'+(index+1)) as HTMLElement

                    if(card != null)
                    {
                        card.classList.add('border')
                        card.classList.add('border-danger')
                    }
                    
                    error[index] = true
                    toastError.show()
                }
                else
                {
                    form.classList.remove('was-validated')

                    const card = document.querySelector('#card-'+(index+1)) as HTMLElement

                    if(card != null)
                    {
                        card.classList.remove('border')
                        card.classList.remove('border-danger')

                        const inputs = Array.from(form.querySelectorAll('input'))
    
                        inputs.map((input) => {
                            dataForm[index][(input as HTMLInputElement).name] = (input as HTMLInputElement).value
                        })
                    }
                }
            })
    
            if(!error.includes(true))
            {
                const dataRequest = {
                    cotizacion:{
                        idplan:resume.value.plan.idplan,
                        cantidaddias:resume.value.dias,
                        pasajeros:dataForm,
                        fechadesde:resume.value.departure,
                        fechahasta:resume.value.arrival,
                        origenes:resume.value.origen,
                        detinos:resume.value.destinos,
                    },
                    ps:'www.continentalassist.com'
                }
                
                let resValidPaxs : {[key:string]:any} = {}

                const resPaxs = await fetch("/api/getPaxValidation",{method:"POST",body:JSON.stringify(dataRequest)});
                const dataPaxs = await resPaxs.json()
                resValidPaxs = dataPaxs
    
                if(resValidPaxs.error == false)
                {
                    const paxs: any[] = resValidPaxs.resultado
                    let countPaxs = 0
    
                    if(paxs.length > 0)
                    {
                        paxs.map(pax => {
                            if(pax.voucher != '')
                            {
                                const card = document.querySelector('#card-'+pax.idpasajero) as HTMLElement
                                const cardMessage = document.querySelector('#card-message-'+pax.idpasajero) as HTMLElement
        
                                card.classList.add('border')
                                card.classList.add('border-danger')
                                cardMessage.classList.remove('d-none')
                            }
                            else
                            {
                                const card = document.querySelector('#card-'+pax.idpasajero) as HTMLElement
                                const cardMessage = document.querySelector('#card-message-'+pax.idpasajero) as HTMLElement
        
                                card.classList.add('border')
                                card.classList.add('border-success')
                                cardMessage.classList.add('d-none')
    
                                countPaxs += 1
                            }
                        })
    
                        if(paxs.length == countPaxs)
                        {
                            const newStateContext : {[key:string]:any} = {}

                            Object.assign(newStateContext,stateContext.value)
                            newStateContext.asegurados = dataForm
                            newStateContext.subTotal = prevTotal.value 
                            newStateContext.total = totalPay.value;

                            (window as any)['dataLayer'].push(
                                Object.assign({
                                    'event': 'TrackEventGA4',
                                    'category': 'Flujo asistencia',
                                    'action': 'Paso 3 :: beneficios',
                                    'origen': newStateContext.paisorigen,
                                    'destino': newStateContext.paisesdestino,
                                    'desde': newStateContext.desde,
                                    'hasta': newStateContext.hasta,
                                    'adultos': newStateContext[70],
                                    'niños y jovenes': newStateContext[22],
                                    'adultos mayores': newStateContext[85],
                                    'page': 'home',
                                    'label': newStateContext.plan.nombreplan,
                                    'precio': newStateContext.total.total,
                                    'cta': 'siguiente',
                                },stateContext.value.dataLayerPaxBenefits)
                            );

                            const dataFormContact : {[key:string]:any} = {}

                            const formContact = document.querySelector('#form-pax-contact') as HTMLFormElement
                            const inputs = Array.from(formContact.querySelectorAll('input'))

                            inputs.map((input) => {
                                dataFormContact[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
                            })

                            newStateContext.contacto = dataFormContact

                            stateContext.value = Object.assign(stateContext.value,newStateContext)
        
                            await navigate('/quotes-engine/step-3')
                        }
                    }
                    else
                    {
                        
                        const cards = Array.from(containerForms.querySelectorAll('.card'))
    
                        cards.map((card,index) => {
                            (card as HTMLElement).classList.remove('border');
                            (card as HTMLElement).classList.remove('border-danger');
                            (card as HTMLElement).classList.add('border');
                            (card as HTMLElement).classList.add('border-success');
                            const cardMessage = document.querySelector('#card-message-'+(index+1)) as HTMLElement
                            cardMessage.classList.add('d-none')
                        })
    
                        const newStateContext : {[key:string]:any} = {}
                        Object.assign(newStateContext,stateContext.value)
                        newStateContext.asegurados = dataForm
                        newStateContext.subTotal = prevTotal.value 
                        newStateContext.total = totalPay.value;

                        (window as any)['dataLayer'].push(
                            Object.assign({
                                'event': 'TrackEventGA4',
                                'category': 'Flujo asistencia',
                                'action': 'Paso 3 :: beneficios',
                                'origen': newStateContext.paisorigen,
                                'destino': newStateContext.paisesdestino,
                                'desde': newStateContext.desde,
                                'hasta': newStateContext.hasta,
                                'adultos': newStateContext[70],
                                'niños y jovenes': newStateContext[22],
                                'adultos mayores': newStateContext[85],
                                'page': 'home',
                                'label': newStateContext.plan.nombreplan,
                                'precio': newStateContext.total.total,
                                'cta': 'siguiente',
                            },stateContext.value.dataLayerPaxBenefits)
                        );

                        stateContext.value = Object.assign(stateContext.value,newStateContext)
    
                        navigate('/quotes-engine/step-3')
                    }
                }
            }
        }
        else
        {
            checkPolicy.classList.add('is-invalid')
            toastError.show()
        }
    })

    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={2} hideForm/>
            <div class='container-fluid'>
                <div class='row bg-step-4'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row align-content-center justify-content-center'>
                                {
                                    additionalsBenefits.value.length > 0
                                    ?
                                    <div class='col-xl-10 text-center mb-3 mt-5'>
                                        <h1 class='text-semi-bold text-blue'>
                                            <span class='text-tin'>Tus datos</span> <br class='mobile'/> y complementos
                                        </h1>
                                        <hr class='divider my-3'/>
                                        <h5 class='text-dark-blue'>Ingresa la información de los viajeros <br class='mobile'/> y elige beneficios opcionales</h5>
                                    </div>
                                    :
                                    <div class='col-lg-12 text-center mt-5 mb-5'>
                                        <h1 class='text-semi-bold text-dark-blue'>Lo sentimos!</h1>
                                        <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                    </div>
                                }
                            </div>
                            <div class='row mb-5'>
                                <div class='col-xl-12'>
                                    <div class='cards-paxs'>
                                        {
                                            additionalsBenefits.value.map((addBenefit,index) => {
                                                return(
                                                    <div key={index+1} class="card px-lg-5 shadow-lg" id={'card-'+addBenefit.idpasajero}>
                                                        <div class='container'>
                                                            <div class='row row-mobile p-3'>
                                                                <div class='col-xl-4 col-sm-3 col-xs-5'>
                                                                    <h5 class='text-semi-bold text-dark-blue'>Viajero #{addBenefit.idpasajero}</h5>
                                                                </div>
                                                                <div class='col-xl-4 col-sm-3 col-xs-7'>
                                                                    <h5 class='text-gray'>
                                                                        De
                                                                        {addBenefit.edad == '22' && ' 0 a 22 '}
                                                                        {addBenefit.edad == '70' && ' 23 a 70 '}
                                                                        {addBenefit.edad == '85' && ' 71 a 85 '}
                                                                        años
                                                                    </h5>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <div class='d-grid gap-2'>
                                                                        <button 
                                                                            type='button' 
                                                                            class='btn btn-primary mt-2 mt-sm-0' 
                                                                            onClick$={() => {getAdditionalsbBenefits$(index)}} 
                                                                            data-bs-toggle="modal" 
                                                                            data-bs-target="#modalAdditionals"
                                                                        >
                                                                            Ver beneficios adicionales
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <button type="button" class='btn btn-collapse not-mobile' data-bs-toggle="collapse" data-bs-target={"#collapseExample-"+index}>
                                                                    <i id={"icon-collapse-"+index} class="fas fa-chevron-down text-light-blue" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div class={index == 0 ? "collapse show" : "collapse"} id={"collapseExample-"+index}>
                                                            <hr class='m-0' />
                                                            <div class='card-body px-5 text-start'>
                                                                <div class='container'>
                                                                    <div class="row align-items-center">
                                                                        <div class="col-xl-12">  
                                                                            <Form
                                                                                id={'form-pax-'+(index+1)}
                                                                                form={[
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'text',label:'Nombre(s)',name:'nombres',required:true,value:addBenefit.nombres,textOnly:'true'},
                                                                                        {size:'col-xl-4',type:'text',label:'Apellido(s)',name:'apellidos',required:true,value:addBenefit.apellidos,textOnly:'true'},
                                                                                        {size:'col-xl-4',type:'date',label:'Nacimiento',name:'fechanacimiento',min:addBenefit.minDate,max:addBenefit.maxDate,required:true,value:addBenefit.fechanacimiento},
                                                                                    ]},
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'text',label:'Identificación / Pasaporte',name:'documentacion',required:true,value:addBenefit.documentacion},
                                                                                        {size:'col-xl-4',type:'email',label:'Correo',name:'correo',required:true,value:addBenefit.correo},
                                                                                        {size:'col-xl-4',type:'phone',label:'Teléfono',name:'telefono',required:true,value:addBenefit.telefono},
                                                                                    ]}
                                                                                ]}
                                                                            />   
                                                                            <div id={'card-message-'+addBenefit.idpasajero} class='container d-none'>
                                                                                <div class='row'>
                                                                                    <div class='col-xl-12'>
                                                                                        <hr/>
                                                                                        <div class='message error'>
                                                                                            <span class='text-semi-bold'>Esta persona ya cuenta con un voucher activo, <small>por favor contacta con un agente para resolver el problema.</small></span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='text-center'>
                                                            <div class='mobile'>
                                                                <button type="button" class='btn btn-collapse p-0 mb-3' data-bs-toggle="collapse" data-bs-target={"#collapseExample-"+index}>
                                                                    <i id={"icon-collapse-"+index} class="fas fa-chevron-down text-light-blue" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            additionalsBenefits.value.length > 0
                                            ?
                                            <div class='container p-0'>
                                                <div class='row'>
                                                    <div class='col-lg-12'>
                                                        <div class='card px-lg-5 shadow-lg'>
                                                            <div class='container'>
                                                                <div class='row p-3'>
                                                                    <div class='col-lg-12'>
                                                                        <h5 class='text-semi-bold text-dark-blue'>Contacto de emergencia</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class='card-body px-5 text-start'>
                                                                <div class='container'>
                                                                    <div class='row'>
                                                                        <div class='col-lg-12'>
                                                                            <Form
                                                                                id={'form-pax-contact'}
                                                                                form={[
                                                                                    {row:[
                                                                                        {size:'col-xl-6',type:'text',label:'Nombre(s)',name:'nombres',required:true,textOnly:'true',value:contact.value.nombres},
                                                                                        {size:'col-xl-6',type:'text',label:'Apellido(s)',name:'apellidos',required:true,value:contact.value.apellidos},
                                                                                    ]},
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'phone',label:'Teléfono',name:'telefono',required:true,value:contact.value.telefono},
                                                                                        {size:'col-xl-8',type:'email',label:'Correo',name:'correo',required:true,value:contact.value.correo},
                                                                                    ]}
                                                                                ]}
                                                                            />   
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='row justify-content-center'>
                                                    <div class='col text-center'>
                                                        <div class="form-check form-check-inline">
                                                            <input class="form-check-input" type="checkbox" id={"check-policy"} name='aceptapolitica' required/>
                                                            <label class="form-check-label" for={"check-policy"}>
                                                                Aceptas nuestra <a href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20Tratamiento%20de%20la%20Informaci%C3%B3n%20y%20Privacidad%20Continental%20Assist.pdf' target='_black'>Política de Tratamiento de la Información y Privacidad</a>.
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='row row-mobile justify-content-center mt-3 mb-5'>
                                                    <div class='col-xl-2 col-sm-6 col-xs-6'>
                                                        <div class='d-grid gap-2'>
                                                            <button type='button' class='btn btn-primary btn-lg' onClick$={getPaxs$}>Siguiente</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>            
            </div>
            <div id='modalAdditionals' class="modal fade">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">  
                            <h2 class='text-semi-bold text-white'>
                                Viajero {additionalsBenefitsPlan.value.idpasajero}  
                            </h2>
                        </div>
                        <div class="modal-body cards-additionals">
                            {
                                additionalsBenefitsPlan.value.beneficiosadicionalesasignados.length > 0
                                ?
                                additionalsBenefitsPlan.value.beneficiosadicionalesasignados.map((benefit,index) => {
                                    return(
                                        <div key={index+1} class="card">
                                            <div class='card-body'>
                                                <div class='container'>
                                                    <div class="row g-0 align-items-center">
                                                        <div class="col-md-2 text-center" style={{paddingRight:'10px'}}>
                                                            {benefit.idbeneficioadicional == '37' && <img src='/assets/img/icons/continental-assist-pregnancy.webp' class="img-fluid" alt="icon-pregnancy"/>}
                                                            {benefit.idbeneficioadicional == '36' && <img src='/assets/img/icons/continental-assist-sports.webp' class="img-fluid" alt="icon-sports"/>}
                                                            {benefit.idbeneficioadicional == '35' && <img src='/assets/img/icons/continental-assist-medicine.webp' class="img-fluid" alt="icon-medicine"/>}
                                                        </div>
                                                        <div class="col-md-7">
                                                            <h5 class="card-title text-semi-bold text-light-blue">{benefit.nombrebeneficioadicional}</h5>
                                                            {benefit.idbeneficioadicional == '37' && <p class="card-text text-gray">Protegemos a madres gestantes, <br/> de hasta 32 semanas.</p>}
                                                            {benefit.idbeneficioadicional == '36' && <p class="card-text text-gray">Contigo, en experiencias recreativas.</p>}
                                                            {benefit.idbeneficioadicional == '35' && <p class="card-text text-gray">Perfecto para tus condiciones medicas previas.</p>}
                                                            <h4 class="card-text text-semi-bold text-dark-blue mb-4">{benefit.codigomonedapago+' '+benefit.precio}</h4>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <div class='d-grid gap-2'>
                                                                {
                                                                    benefit.seleccionado === true 
                                                                    ? 
                                                                    <button class='btn btn-primary' onClick$={() => {deleteAdditional$(index,additionalsBenefitsPlan.value.idpasajero,benefit)}}>Remover</button>
                                                                    :
                                                                    <button class='btn btn-outline-primary' disabled={benefit.disabled === true} onClick$={() => {getAdditional$(index,additionalsBenefitsPlan.value.idpasajero,benefit)}}>Agregar</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : 
                                <div class='card-body'>
                                    <h3>Sin beneficios adicionales</h3>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class="toast-container position-fixed bottom-0 p-3">
                <div id='toast-error' class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <div class='message'>
                                <i class="fas fa-times-circle"/>
                                <span class='text-start'>
                                    <b>¡Espera! Falta algo…</b>
                                    <br/>
                                    <small>Revisa porfavor la información ingresada.</small>
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