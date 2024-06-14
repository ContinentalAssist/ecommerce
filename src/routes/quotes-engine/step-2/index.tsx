import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import DateFormat from "~/utils/DateFormat";
import CurrencyFormatter from "~/utils/CurrencyFormater";

import ImgContinentalAssistMedicine from '~/media/icons/continental-assist-medicine.webp?jsx'
import ImgContinentalAssistPregnancy from '~/media/icons/continental-assist-pregnancy.webp?jsx'
import ImgContinentalAssistSports from '~/media/icons/continental-assist-sports.webp?jsx'

import styles from './index.css?inline'
import { SwitchDivisa } from "~/components/starter/switch/SwitchDivisa";

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
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-2'},
    ],
}

interface propsQuotesEngineResume
{
    [key:string] : any
}

export const QuotesEngineResume = (props:propsQuotesEngineResume) => {    
    return(
        <div class='container' id='quotes-engine'>
            {
                props.showForm !== true
                ?
                <div class='row resume'>
                    <div class='col-3 col-xs-12'>
                        <div class="input-group">
                            <span class="input-group-text border border-0 bg-white">
                                <i class="fa-solid fa-plane-departure"/>
                            </span>
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    readOnly 
                                    class="form-control-plaintext text-bold text-dark-blue ps-0" 
                                    id="fechas" 
                                    placeholder="Origen / Destino(s)"
                                    value={props.resume.paisorigen != undefined ? (props.resume.paisorigen+' a '+String(props.resume.paisesdestino).replaceAll(',',', ')): ''}
                                />
                                <label class='text-semi-bold text-dark-gray ps-0' for="fechas">Origen / Destino(s)</label>
                            </div>
                        </div>
                    </div>
                    <div class='col-3 col-xs-12'>
                        <div class="input-group">
                            <span class="input-group-text border border-0 bg-white">
                                <i class="far fa-calendar"></i>
                            </span>
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    readOnly 
                                    class="form-control-plaintext text-bold text-dark-blue ps-0" 
                                    id="fechas" 
                                    placeholder="Fechas de tu viaje"
                                    value={props.resume.desde != undefined ? (props.resume.desde+' al '+props.resume.hasta) : ''}
                                />
                                <label class='text-semi-bold text-dark-gray ps-0' for="fechas">Fechas de tu viaje</label>
                            </div>
                        </div>
                    </div>
                    <div class='col-3 col-xs-12'>
                        <div class="input-group">
                            <span class="input-group-text border border-0 bg-white">
                                <i class="fa-solid fa-user-plus"/>
                            </span>
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    readOnly 
                                    class="form-control-plaintext text-bold text-dark-blue ps-0" 
                                    id="fechas" 
                                    placeholder="Viajeros"
                                    value={props.resume.pasajeros}
                                />
                                <label class='text-semi-bold text-dark-gray ps-0' for="fechas">Viajeros</label>
                            </div>
                        </div>
                    </div>
                    <div class='col-2 col-xs-6'>
                        <div class="input-group">
                            <span class="input-group-text border border-0 bg-white">
                                <i class="fa-solid fa-clipboard-check"/>
                            </span>
                            <div class="form-floating">
                            <input 
                                    type="text" 
                                    readOnly 
                                    class="form-control-plaintext text-bold text-light-blue ps-0" 
                                    id="plan" 
                                    placeholder="Plan"
                                    value={props.resume.plan?.nombreplan}
                                />
                                <label class='text-semi-bold text-dark-gray ps-0' for="fechas">Plan</label>
                            </div>
                        </div>
                    </div>
{/*                     <div class='col-lg-1  col-xs-6 text-end align-items-end'>
                        <div class='d-grid gap-2'>
                            <button type='button' class='btn btn-link text-regular text-light-blue mt-3' onClick$={props.openEdit}>Editar</button>
                        </div>
                    </div> */}
                </div>
                :
                <>
                    <div class='row'>
                        <div class='col-lg-4 mt-3'>
                            <Form
                                id='form-step-1-0'
                                form={[
                                    {row:[
                                        {
                                            size:'col-lg-6 col-sm-6 col-6',
                                            type:'select',
                                            label:'Origen',
                                            name:'origen',
                                            options:props.origins,
                                            required:true,
                                            value:props.resume.origen,
                                            onChange:$((e:any) => {props.changeOrigin(e)}),
                                            icon:'plane-departure',
                                            menuSize:{width:'608px', height:'394px'}
                                        },
                                        {
                                            size:'col-lg-6 col-sm-6 col-6',
                                            type:'select-multiple',
                                            label:'Destino(s)',
                                            name:'destinos',
                                            options:props.destinations,
                                            required:true,
                                            value:props.resume.destinos,
                                            icon:'plane-arrival',
                                            menuSize:{width:'608px', height:'394px'}
                                        }
                                    ]}
                                ]}
                            />
                        </div>
                        <div class='col-lg-5 mt-3'>
                            <Form
                                id='form-step-1-1'
                                form={[
                                    {row:[
                                        {
                                            size:'col-lg-6 col-sm-6 col-6',
                                            type:'date',
                                            label:'Desde',
                                            name:'desde',
                                            min:props.dateStart,
                                            onChange:props.changeDateStart,
                                            required:true,
                                            value:props.resume.desde,
                                            icon:'calendar'
                                        },
                                        {
                                            size:'col-lg-6 col-sm-6 col-6',
                                            type:'date',
                                            label:'Hasta',
                                            name:'hasta',
                                            min:props.dateEnd,
                                            onChange:props.changeDateEnd,
                                            required:true,
                                            value:props.resume.hasta,
                                            icon:'calendar'
                                        }
                                    ]}
                                ]}
                            />
                        </div>
                        <div class='col-lg-3 mt-3'>
                            <Form
                                id='form-step-1-2'
                                form={[
                                    {row:[
                                        {
                                            size:'col-lg-12',
                                            type:'paxs',
                                            name:'pasajeros',
                                            required:true,
                                            value:{[22]:props.resume[22]||0,[70]:props.resume[70]||0,[85]:props.resume[85]||0},
                                            icon:'user-plus'
                                        }
                                    ]}
                                ]}
                            />
                        </div>
                    </div>
                    <div class='row justify-content-center mt-2'>
                        <div class='col-lg-2 col-6'>
                            <div class='d-grid gap-2'>
                                <button type='button' class='btn btn-primary mb-3' onClick$={props.openEdit}>Cerrar</button>
                            </div>
                        </div>
                        <div class='col-lg-2 col-6'>
                            <div class='d-grid gap-2'>
                                <button type='button' class='btn btn-primary' onClick$={props.getQuotesEngine}>Buscar</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const navigate = useNavigate()

    const arrayAdditionalsBenefits: {[key:string]:any,beneficiosadicionalesasignados:any[],beneficiosadicionales:any[]}[] = []
    const objectAdditionalsBenefitsPlan:{[key:string]:any,beneficiosadicionalesasignados:any[],beneficiosadicionales:any[]} = {beneficiosadicionalesasignados:[],beneficiosadicionales:[]}
    const objectResume : {[key:string]:any} = {}

    const additionalsBenefits = useSignal(arrayAdditionalsBenefits)
    const additionalsBenefitsPlan = useSignal(objectAdditionalsBenefitsPlan)
    const resume = useSignal(objectResume)
    const totalPay = useSignal({divisa:'',total:0})
    const contact = useSignal(objectResume)
    const prevTotal = useSignal(0)
    const loading = useSignal(true)
    const divisaManual = useSignal(stateContext.value.divisaManual)

    const array : any[] = []
    const arrayPlans: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]}[] = []
    const objectBenefitsPlan: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]} = {beneficiosasignados:[{beneficios:[]}]}
    const objectPlanSelected: {[key:string]:any} = {}

    const origins = useSignal(array)
    const destinations = useSignal(array)
    const showForm = useSignal(false)
    const dateStart = useSignal('')
    const dateEnd = useSignal('')
    const plans = useSignal(arrayPlans)
    const benefitsPlan = useSignal(objectBenefitsPlan)
    const planSelected = useSignal(objectPlanSelected)

    const desktop = useSignal(false)

    useVisibleTask$(() => {
        if(!navigator.userAgent.includes('Mobile'))
        {
            desktop.value = true
        }
    })

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
        dateStart.value = new Date().toISOString().substring(0,10)
        dateEnd.value = new Date(new Date().setDate(new Date().getDate()+2)).toISOString().substring(0,10)

        resume.value = stateContext.value
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
                totalPay.value = {divisa:resume?.value?.plan?.codigomonedapago,total:Number(resume?.value?.plan?.precio_grupal)}
                let newRes: any[] = []

                // const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                //     .then((response) => {return(response.json())})
                const newAges : any[] = []

                resume?.value?.edades?.map((age:any) => {
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
                    idplan:resume?.value?.plan?.idplan,
                    dias:resume.value.dias,
                    edades:resume.value.edades,
                    // edades:newAges,
                    ip:stateContext.value?.resGeo?.ip_address,
                }

                const resAdditionals = await fetch("/api/getAdditionalsBenefits",{method:"POST",body:JSON.stringify(dataRequest)});
                const dataAdditionals = await resAdditionals.json()
                newRes = Array.isArray(dataAdditionals?.resultado)?dataAdditionals.resultado:[]

                const today = DateFormat(new Date)

               newRes.map((res,index) => {
                    const min = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (res.edad*12))))
                    let max = ''
                    
                    if(res.edad == '22')
                    {
                        max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (0*12))))
                    }
                    else if (res.edad == '70')
                    {
                        max = DateFormat(new Date(new Date(today).setMonth(new Date(today).getMonth() - (23*12))))
                    }
                    else if (res.edad == '85')
                    {
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
            loading.value = false
           /*  if(additionalsBenefits.value.length > 0)
            {
                loading.value = false
            } */
        }
        else
        {
            navigate('/quotes-engine/step-1')
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
                        fechadesde:resume.value.desde,
                        fechahasta:resume.value.hasta,
                        origenes:resume.value.origen,
                        destinos:resume.value.destinos,
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
                                    'niños_y_jovenes': newStateContext[22],
                                    'adultos_mayores': newStateContext[85],
                                    'page': '/quotes-engine/step-2',
                                    'option': newStateContext.plan.nombreplan,
                                    'precio': Math.ceil(newStateContext.total.total),
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

    const openEdit$ = $(() => {
        showForm.value = !showForm.value

        if(showForm.value === true)
        {
            if(Object.keys(stateContext.value).length > 0)
            {
                setTimeout(() => {
                    const form = document.querySelector('#form-step-1-0') as HTMLFormElement
    
                    const listDestinations = form.querySelector('#dropdown-form-step-1-0-select-0-1') as HTMLDListElement
                    const list = Array.from(listDestinations.querySelectorAll('li'))
    
                    list.map((item) => {
                        if(item.value === Number(stateContext.value.origen) && stateContext.value.origen !== 11)
                        {
                            item.style.display = 'none';
                        }
                        else
                        {
                            item.style.display = 'inherit';
                        }
                    })
                },500) 
            }
        }
    })

    const changeOrigin$ = $((e:any) => {
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement
        const listDestinations = form.querySelector('#dropdown-form-step-1-0-select-0-1') as HTMLInputElement
        const list = Array.from(listDestinations.querySelectorAll('li'))

        const bs = (window as any)['bootstrap']
        const dropdownOrigin = bs.Dropdown.getInstance('#dropdown-toggle-'+inputOrigin.id,{})
        dropdownOrigin.hide()

        list.map((item) => {
            if(item.value === Number(e.value) && e.value !== 11)
            {
                item.style.display = 'none';
            }
            else
            {
                item.style.display = 'inherit';
            }
        })
    })

    const changeDateStart$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateStart = form.querySelector('input[name=desde]') as HTMLInputElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement
      
        const formatDateStart = inputDateStart.value.replaceAll('-','/')

        inputDateEnd.min = new Date(new Date(formatDateStart).setDate(new Date(formatDateStart).getDate()+2)).toISOString().substring(0,10)
        inputDateEnd.max = new Date(new Date(formatDateStart).setDate(new Date(formatDateStart).getDate()+365)).toISOString().substring(0,10)
        
        // inputDateEnd.focus()
        // inputDateEnd.showPicker()
    })

    const changeDateEnd$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement

        dateEnd.value = inputDateEnd.value
    })

    const getQuotesEngine$ = $(async() => {
        //const bs = (window as any)['bootstrap']
        //const modal = new bs.Modal('#modalGroupPlan',{})
        const quotesEngine = document.querySelector('#quotes-engine') as HTMLElement
        const forms = Array.from(quotesEngine.querySelectorAll('form'))
        const inputs = Array.from(document.querySelectorAll('input,select'))

        const error = [false,false,false]
        const newDataForm : {[key:string]:any} = {}
        newDataForm.edades = []
        newDataForm.paisesdestino = []

        forms.map((form,index) => {
            if(!form.checkValidity())
            {
                form.classList.add('was-validated')
                error[index] = true
            }
            else
            {
                form.classList.remove('was-validated')
            }
        })

        if(!error.includes(true))
        {
            loading.value = true
            
            inputs.map((input) => {
                newDataForm[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
    
                if(input.classList.value.includes('form-control-select-multiple'))
                {
                    newDataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value).split(',')
                }
                else if(input.classList.value.includes('form-control-select'))
                {
                    newDataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value)
                }
                else if((input as HTMLInputElement).type == 'number')
                {
                    newDataForm[(input as HTMLInputElement).name] = Number((input as HTMLInputElement).value)

                    for (let index = 0; index < newDataForm[(input as HTMLInputElement).name]; index++) 
                    {
                        newDataForm.edades.push(Number((input as HTMLInputElement).name))
                    }
                }
            })

            newDataForm.dias = ((new Date(newDataForm.hasta).getTime() - new Date(newDataForm.desde).getTime()) / 1000 / 60 / 60 / 24) + 1

            origins.value.map(origin => {
                if(origin.value == newDataForm.origen)
                {
                    newDataForm.paisorigen = origin.label
                }
            }) 
            
            destinations.value.map(destination => {
                newDataForm.destinos.map((destino:any) => {
                    if(destination.value == destino)
                    {
                        newDataForm.paisesdestino.push(destination.label)
                    }
                })
            }) 

            newDataForm.origen = Number(newDataForm.origen)

            if(newDataForm.edades.length > 0)
            {
                if(newDataForm[22] >= 2 && (newDataForm[70]+newDataForm[85]) >= 2)
                {
                    newDataForm.planfamiliar = 't'
                    stateContext.value = newDataForm
                    resume.value = newDataForm

                    const dataForm : {[key:string]:any} = {}

                    Object.assign(dataForm,stateContext.value)
                    dataForm.idfuente = 2
                    dataForm.ip = stateContext.value.resGeo.ip_address

                    const resPlans = await fetch("/api/getPlans",{method:"POST",body:JSON.stringify(dataForm)});
                    const dataPlans = await resPlans.json()
                    plans.value = dataPlans.resultado

                    if(plans.value.length > 0)
                    {
                        loading.value = false
                    }

                   // modal.show()
                }
                else
                {
                    newDataForm.planfamiliar = 'f'
                    resume.value = newDataForm
                    stateContext.value = {...stateContext.value,...newDataForm}
                    
                    const dataForm : {[key:string]:any} = {}

                    Object.assign(dataForm,stateContext?.value)
                    dataForm.idfuente = 2
                    dataForm.ip = stateContext.value.resGeo.ip_address

                    let error = false

                    const resPlans = await fetch("/api/getPlans",{method:"POST",body:JSON.stringify(dataForm)});
                    const dataPlans = await resPlans.json()
                    
                    error = dataPlans.error
                    plans.value = dataPlans.resultado

                    if(error == false)
                    {
                        if(plans.value.length > 0)
                        {
                            showForm.value = false
                            loading.value = false
                        }
                    }
                    else
                    {
                        plans.value = []
                        loading.value = false
                    }
                }
            }
        }
    })

    const changeDivisa$ = $((divisa:string) => {
        if(divisa == 'base')
        {
            divisaManual.value = true
            stateContext.value.divisaManual = true
        }
        else if(divisa == 'local')
        {
            divisaManual.value = false
            stateContext.value.divisaManual = false
        }
    })

    return(
        <div class='container-fluid px-0' style={{paddingTop:'78px'}}>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <div class='row mt-4'>
                <div class='col-12'>
                    <QuotesEngineResume 
                        resume={resume.value}
                        openEdit={openEdit$}
                        showForm={showForm.value}
                        origins={origins.value}
                        destinations={destinations.value}
                        dateStart={dateStart.value}
                        dateEnd={dateEnd.value}
                        changeOrigin={changeOrigin$}
                        changeDateStart={changeDateStart$}
                        changeDateEnd={changeDateEnd$}
                        getQuotesEngine={getQuotesEngine$}
                    />
                </div>
            </div>
            
            <div class='row not-mobile'>
                <div class='col-12'>
                    <div class={desktop.value == true ? 'container-fluid steps-float' : 'container'}>
                        <div class='row'>
                            <div class='col-12'>
                                <div class='container'>
                                    <div class={desktop.value == true ? 'row justify-content-end mx-0' : 'row'}>
                                        
                                        <div class='col-md-3'>
                                            <QuotesEngineSteps active={2} name={'Complementos'} steps={5}/>
                                        </div>
                                        <div class='col-md-2 align-self-center text-center'>
                                            <div class='icons' style={{border:'2px solid lightgray',borderRadius:'33px', padding:'9px',margin:'0px'}} >
                                                <i class="fa-solid fa-basket-shopping text-end" style={{paddingRight:'10px'}}/>
                                                <span class='text-bold text-dark-blue'>                                                 
                                                {
                                                totalPay.value.total && (divisaManual.value == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) : CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate))
                                                }
                                                </span>
                                            </div>
                                        </div>
                                        <div class='col-md-2 text-end'>
                                            <SwitchDivisa
                                                labels={['USD',stateContext.value?.currentRate?.code]}
                                                value={stateContext.value.divisaManual ? 'base' : 'local'}
                                                onChange={$((e:any) => {changeDivisa$(e)})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class='row mobile  text-center justify-content-center align-items-center' >
            <hr class='m-0' />
                <div class='col-xs-12 d-flex justify-content-center align-items-center '  style={{padding:'20px'}} >
                    <QuotesEngineSteps active={1} name={'Planes'} steps={5}/>
                </div>
                <div class="col-xs-12 d-flex justify-content-center align-items-center">

                <div class='col-xs-5' >
                    <div class="icons" style={{border:'2px solid lightgray',borderRadius:'33px', padding:'9px',margin:'0px'}} >

                    <i class="fa-solid fa-basket-shopping text-end" style={{paddingRight:'10px'}}/>
                    <span class='text-bold text-dark-blue'>                                                 
                    {
                    totalPay.value.total && (divisaManual.value == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) : CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate))
                    }
                    </span>
                    </div>
                </div>
                <div class='col-xs-5' >
                    <SwitchDivisa
                        labels={['USD',stateContext.value?.currentRate?.code]}
                        value={stateContext.value.divisaManual ? 'base' : 'local'}
                        onChange={$((e:any) => {changeDivisa$(e)})}
                    />
                </div>
                </div>
              
            </div>
            <div class='container-fluid'>
                <div class='row bg-step-4'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row  justify-content-center'>
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
                                        <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                        <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                    </div>
                                }
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
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
                                                                    <div class="row">
                                                                        <div class="col-lg-12">  
                                                                        <Form
                                                                                id={'form-pax-'+(index+1)}
                                                                                form={[
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'text',label:'Nombre(s)',name:'nombres',required:true,value:addBenefit.nombres,textOnly:'true',placeholder:'Nombre(s)'},
                                                                                        {size:'col-xl-4',type:'text',label:'Apellido(s)',name:'apellidos',required:true,value:addBenefit.apellidos,textOnly:'true',placeholder:'Apellido(s)'},                                                                                        
                                                                                        {size:'col-xl-4',type:'text',label:'Identificación / Pasaporte',name:'documentacion',required:true,value:addBenefit.documentacion,placeholder:'Identificación / Pasaporte'},
                                                                                        {size:'col-xl-4',type:'date',label:'Nacimiento',name:'fechanacimiento',min:addBenefit.minDate,max:addBenefit.maxDate,required:true,value:addBenefit.fechanacimiento,placeholder:'Nacimiento'},
                                                                                        {size:'col-xl-4',type:'email',label:'Correo',name:'correo',required:true,value:addBenefit.correo,placeholder:'Correo'},
                                                                                        {size:'col-xl-4',type:'phone',label:'Teléfono',name:'telefono',required:true,value:addBenefit.telefono,placeholder:'Teléfono'},

                                                                                    ]},
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
                                                            <hr class='m-0' />
                                                            <div class='card-body px-5 text-start'>
                                                                <div class='container'>
                                                                    <div class='row'>
                                                                        <div class='col-lg-12'>
                                                                            <Form
                                                                                id={'form-pax-contact'}
                                                                                form={[
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'text',label:'Nombre(s)',name:'nombres',required:true,textOnly:'true',value:contact.value.nombres,placeholder:'Nombre(s)'},
                                                                                        {size:'col-xl-4',type:'text',label:'Apellido(s)',name:'apellidos',required:true,value:contact.value.apellidos,placeholder:'Apellido(s)'},      
                                                                                        {size:'col-xl-4',type:'phone',label:'Teléfono',name:'telefono',required:true,value:contact.value.telefono,placeholder:'Teléfono(s)'},
                                                                                    ]},
                                                                                    {row:[
                                                                                        {size:'col-xl-4',type:'email',label:'Correo',name:'correo',required:true,value:contact.value.correo,placeholder:'Correo(s)'},
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
                                                                Aceptas nuestra <a title='Tratamiento Informacion' href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20Tratamiento%20de%20la%20Informaci%C3%B3n%20y%20Privacidad%20Continental%20Assist.pdf' target='_black'>Política de Tratamiento de la Información y Privacidad</a>.
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
                                                            {benefit.idbeneficioadicional == '37' && <ImgContinentalAssistPregnancy class='img-fluid' title='continental-assist-pregnancy' alt='continental-assist-pregnancy'/>}
                                                            {benefit.idbeneficioadicional == '36' && <ImgContinentalAssistSports class='img-fluid' title='continental-assist-sports' alt='continental-assist-sports'/>}
                                                            {benefit.idbeneficioadicional == '35' && <ImgContinentalAssistMedicine class='img-fluid' title='continental-assist-medicine' alt='continental-assist-medicine'/>}
                                                        </div>
                                                        <div class="col-md-7">
                                                            <h5 class="card-title text-semi-bold text-light-blue">{benefit.nombrebeneficioadicional}</h5>
                                                            {benefit.idbeneficioadicional == '37' && <p class="card-text text-gray">Protegemos a madres gestantes, <br/> de hasta 32 semanas.</p>}
                                                            {benefit.idbeneficioadicional == '36' && <p class="card-text text-gray">Contigo, en experiencias recreativas.</p>}
                                                            {benefit.idbeneficioadicional == '35' && <p class="card-text text-gray">Perfecto para tus condiciones medicas previas.</p>}
                                                            <h4 class="card-text text-semi-bold text-dark-blue mb-4">
                                                                {
                                                                    divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                                }
                                                            </h4>
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
        </div>
    )
})