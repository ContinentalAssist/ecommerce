import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";

import ImgContinentalAssistBagEssential from '~/media/img/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/img/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/img/icons/continental-assist-bag-elite.webp?jsx'
import ImgContinentalAssistGroupPlan from '~/media/img/icons/continental-assist-group-plan.webp?jsx'

import styles from './index.css?inline'
import { ParseTwoDecimal } from "~/utils/ParseTwoDecimal";

export const head: DocumentHead = {
    title : 'Continental Assist | Elige tu plan',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Elige tu plan'},
        {name:'description',content:'Paso 1 - Elige tu plan, Continental Assist cuenta con 3 planes de cobertura para viajes. Gastos médicos, telemedicina, acceso a salas VIP, entre otros.'},
        {property:'og:title',content:'Continental Assist | Elige tu plan'},
        {property:'og:description',content:'Paso 1 - Elige tu plan, Continental Assist cuenta con 3 planes de cobertura para viajes. Gastos médicos, telemedicina, acceso a salas VIP, entre otros.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-1'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const navigate = useNavigate()
    const stateContext = useContext(WEBContext)

    const arrayPlans: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]}[] = []
    const objectBenefitsPlan: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]} = {beneficiosasignados:[{beneficios:[]}]}
    const objectPlanSelected: {[key:string]:any} = {}
    const array : any[] = []
    const object : {[key:string]:any} = {}

    const origins = useSignal(array)
    const destinations = useSignal(array)
    const resume = useSignal(object)
    const showForm = useSignal(false)
    const dateStart = useSignal('')
    const dateEnd = useSignal('')
    const plans = useSignal(arrayPlans)
    const benefitsPlan = useSignal(objectBenefitsPlan)
    const planSelected = useSignal(objectPlanSelected)
    const loading = useSignal(true)

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

            if(prevResume.plan != undefined)
            {  
                planSelected.value = prevResume.plan
            }

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
                    plans.value.map((plan) => {
                        plan.precio_grupal_convertion = ParseTwoDecimal(plan.precio_grupal * stateContext.value.currentRate.rate)
                        plan.codigomonedapago_convertion = stateContext.value.currentRate.code
                    })

                    plans.value = plans.value
                    loading.value = false
                }
            }
            else
            {
                plans.value = []
                loading.value = false
            }
        }
        else
        {
            plans.value = []
            loading.value = false
        }
    })

    const getBenefits$ = $((index:number) => {
        benefitsPlan.value = plans.value[index]
    })

    const getForm$ = $(async() => {
        const dataForm : {[key:string]:any} = {}

        if(Object.keys(planSelected.value).length > 0)
        {       
            Object.assign(dataForm,stateContext.value)
            dataForm.plan = planSelected.value
            dataForm.planescotizados = plans.value;

            (window as any)['dataLayer'].push({
                'event': 'TrackEventGA4',
                'category': 'Flujo asistencia',
                'action': 'Paso 2 :: plan',
                'origen': dataForm.paisorigen,
                'destino': dataForm.paisesdestino,
                'desde': dataForm.desde,
                'hasta': dataForm.hasta,
                'adultos': dataForm[70],
                'niños_y_jovenes': dataForm[22],
                'adultos_mayores': dataForm[85],
                'page': '/quotes-engeni/step-1',
                'option': planSelected.value.nombreplan,
                'precio': Math.ceil(dataForm.plan.precio_grupal),
                'cta': 'seleccionar',
            });

            

            stateContext.value = dataForm

            await navigate('/quotes-engine/step-2')
        }
    })

    const getPlan$ = $((plan:{}) => {
        planSelected.value = plan

        getForm$()
    })

    const changeOrigin$ = $((e:any) => {
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement
        const listDestinations = form.querySelector('#drodown-form-step-1-0-select-0-1') as HTMLInputElement
        const list = Array.from(listDestinations.querySelectorAll('li'))

        const bs = (window as any)['bootstrap']
        const dropdownOrigin = bs.Dropdown.getInstance('#'+inputOrigin.id,{})
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
        const bs = (window as any)['bootstrap']
        const modal = new bs.Modal('#modalGroupPlan',{})
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
    
                if(input.classList.value.includes('form-select-multiple'))
                {
                    newDataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value).split(',')
                }
                else if(input.classList.value.includes('form-select'))
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
            // newDataForm.destinos = newDataForm.destinos;

            if(newDataForm.edades.length > 0)
            {
                if(newDataForm[22] >= 2 && (newDataForm[70]+newDataForm[85]) >= 2)
                {
                    newDataForm.planfamiliar = 't'
                    stateContext.value = newDataForm
                    resume.value = newDataForm

                    const dataForm : {[key:string]:any} = {}

                    const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
                        .then((response) => {return(response.json())})

                    Object.assign(dataForm,stateContext.value)
                    dataForm.idfuente = 2
                    dataForm.ip = resGeo.ip_address

                    const resPlans = await fetch("/api/getPlans",{method:"POST",body:JSON.stringify(dataForm)});
                    const dataPlans = await resPlans.json()
                    plans.value = dataPlans.resultado

                    if(plans.value.length > 0)
                    {
                        loading.value = false
                    }

                    modal.show()
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
                            plans.value.map((plan) => {
                                plan.precio_grupal_convertion = ParseTwoDecimal(plan.precio_grupal * stateContext.value.currentRate.rate)
                                plan.codigomonedapago_convertion = stateContext.value.currentRate.code
                            })

                            plans.value = plans.value
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

    const getGroupPlan$ = $(() => {
        const bs = (window as any)['bootstrap']
        const modal = bs.Modal.getInstance('#modalGroupPlan',{})
        modal.hide()
        navigate('/quotes-engine/step-1')
    })

    const openEdit$ = $(() => {
        showForm.value = true

        if(Object.keys(stateContext.value).length > 0)
        {
            setTimeout(() => {
                const form = document.querySelector('#form-step-1-0') as HTMLFormElement

                const listDestinations = form.querySelector('#drodown-form-step-1-0-select-0-1') as HTMLDListElement
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
    })

    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps/>
            <div class='container mt-2' id='quotes-engine'>
                <div class='row'>
                    <div class='col-lg-12'>
                        <div class='card card-body shadow-lg container' style={{borderRadius:'33px'}}>
                            {
                                showForm.value !== true
                                ?
                                <div class='row'>
                                    <div class='col-lg-3 col-sm-6 col-xs-12 text-center mb-4 mb-sm-0'>
                                        <span class='text-semi-bold text-dark-blue'>
                                            <img src='/assets/img/icons/continental-assist-icon-02.webp' class='img-fluid' width='20' alt='continental-assist-icon-02'/> Fechas de tu viaje
                                        </span>
                                        <div>
                                            <span class='text-dark-gray'>{resume.value.desde}</span>
                                            <span class='text-semi-bold text-dark-blue'> al </span>
                                            <span class='text-dark-gray'>{resume.value.hasta}</span>
                                        </div>
                                    </div>
                                    <div class='col-lg-5 col-sm-6 col-xs-12 text-center mb-4 mb-sm-0'>
                                        <span class='text-semi-bold text-dark-blue'>
                                            <img src='/assets/img/icons/continental-assist-icon-03.webp' class='img-fluid' width='20' alt='continental-assist-icon-03'/> Ubicacion de tu viaje
                                        </span>
                                        <div>
                                            <span class='text-dark-gray'>{resume.value.paisorigen} <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.paisesdestino && String(resume.value.paisesdestino).replaceAll(',',', ')}</span>
                                        </div>
                                    </div>
                                    <div class='col-lg-3 col-sm-6 col-xs-12 text-center mb-4 mb-sm-0'>
                                        <span class='text-semi-bold text-dark-blue'>
                                            <img src='/assets/img/icons/continental-assist-icon-03.webp' class='img-fluid' width='20' alt='continental-assist-icon-03'/> Viajeros
                                        </span>
                                        <div>
                                            <span class='text-dark-gray'>{resume.value.pasajeros}</span>
                                        </div>
                                    </div>
                                    <div class='col-lg-1 text-center align-items-center'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary mt-2' onClick$={openEdit$}><i class="fas fa-edit"/></button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    <div class='row'>
                                        <div class='col-lg-4 mt-3'>
                                            <Form
                                                id='form-step-1-0'
                                                form={[
                                                    {row:[
                                                        {size:'col-lg-6 col-sm-6 col-xs-6',type:'select',label:'Origen',name:'origen',options:origins.value,required:true,value:resume.value.origen,onChange:$((e:any) => {changeOrigin$(e)})},
                                                        {size:'col-lg-6 col-sm-6 col-xs-6',type:'select-multiple',label:'Destino(s)',name:'destinos',options:destinations.value,required:true,value:resume.value.destinos}
                                                    ]}
                                                ]}
                                            />
                                        </div>
                                        <div class='col-lg-5 mt-3'>
                                            <Form
                                                id='form-step-1-1'
                                                form={[
                                                    {row:[
                                                        {size:'col-lg-6 col-sm-6 col-xs-6',type:'date',label:'Desde',name:'desde',min:dateStart.value,onChange:changeDateStart$,required:true,value:resume.value.desde},
                                                        {size:'col-lg-6 col-sm-6 col-xs-6',type:'date',label:'Hasta',name:'hasta',min:dateEnd.value,onChange:changeDateEnd$,required:true,value:resume.value.hasta}
                                                    ]}
                                                ]}
                                            />
                                        </div>
                                        <div class='col-lg-3 mt-3'>
                                            <Form
                                                id='form-step-1-2'
                                                form={[
                                                    {row:[
                                                        {size:'col-lg-12',type:'paxs',name:'pasajeros',required:true,value:{[22]:resume.value[22]||0,[70]:resume.value[70]||0,[85]:resume.value[85]||0}}
                                                    ]}
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div class='row justify-content-center mt-2'>
                                        <div class='col-lg-2 col-6'>
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary mb-3' onClick$={() => showForm.value = false}>Cerrar</button>
                                            </div>
                                        </div>
                                        <div class='col-lg-2 col-6'>
                                            <div class='d-grid gap-2'>
                                                <button type='button' class='btn btn-primary' onClick$={getQuotesEngine$}>Buscar</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class='container-fluid'>
                <div class='row bg-step-3'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12 text-center mt-5 mb-5'>
                                    <h1 class='text-semi-bold text-dark-blue'>
                                        <span class='text-tin'>Elige </span> tu plan
                                    </h1>
                                    <hr class='divider my-3'/>
                                    <h5 class='text-dark-blue'>Tenemos uno ideal para ti</h5>
                                </div>
                                {
                                    plans.value.length == 0
                                    &&
                                    <div class='col-lg-12 text-center mt-5 mb-5'>
                                        <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                        <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                    </div>
                                }
                            </div>
                            <div class='row justify-content-center cards not-mobile'>
                                {
                                    plans.value.map((plan,index) => {
                                        return(
                                            <div key={index+1} class='col-lg-4 col-sm-4' style={{maxWidth:'300px'}}>
                                                <div class={plan.idplan == '2964' ? 'card border-dark-blue' : 'card'}>
                                                    {
                                                        plan.idplan == '2964'
                                                        &&
                                                        <span class='card-recommended'>
                                                            <img class='mt-0 me-2' src='/assets/img/icons/continental-assist-icon-star.webp' width='20' alt='continental-assist-icon-star'/>
                                                            <p class='mb-0'>+ vendido</p>
                                                        </span>
                                                    }
                                                    <div class='card-body'>
                                                        <div class='container'>
                                                            <div class='row'>
                                                                <div class='col-lg-12 text-center align-center'>
                                                                {plan.idplan == '2946' && <ImgContinentalAssistBagEssential class='img-fluid' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                                                                {plan.idplan == '2964' && <ImgContinentalAssistBagComplete class='img-fluid' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                                                                {plan.idplan == '2965' && <ImgContinentalAssistBagElite class='img-fluid' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                                                                </div>
                                                                <div class='col-lg-12 text-center'>
                                                                    <h2 class='card-title text-semi-bold text-light-blue'>
                                                                        {plan.idplan == '2946' && 'Essential'}
                                                                        {plan.idplan == '2964' && 'Complete'}
                                                                        {plan.idplan == '2965' && 'Elite'}
                                                                        {/* {plan.nombreplan.charAt(0).toUpperCase()+plan.nombreplan.slice(1)} */}
                                                                    </h2>
                                                                </div>
                                                            </div>
                                                            <div class='row'> 
                                                                <div class='col-lg-12 text-center'>
                                                                    <small>Cubre hasta</small>
                                                                    <h2 class='card-subtitle text-semi-bold text-dark-blue mb-0' style={{marginTop:'-10px'}}>
                                                                        {plan.idplan == '2946' && '35K USD'}
                                                                        {plan.idplan == '2964' && '60K USD'}
                                                                        {plan.idplan == '2965' && '100K USD'}
                                                                    </h2>
                                                                    <button type='button' class='btn-link text-regular text-light-blue mb-2' onClick$={() => {getBenefits$(index)}} data-bs-toggle="modal" data-bs-target="#modalBenefits">Ver más</button> 
                                                                </div>
                                                            </div>
                                                            <div class='row mt-1 mb-1'>
                                                                <div class='col-lg-12 text-center' style={{lineHeight:'16px',height:'160px'}}>
                                                                    {/* {plan.idplan == '2946' && <small>Te protegemos con lo necesario para que disfrutes de tus aventuras.</small>} */}
                                                                    {
                                                                        plan.idplan == '2946' 
                                                                        &&
                                                                        <ul class='text-start'>
                                                                            <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>35.000 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos médicos por enfermedad preexistente: </span><span class='text-semi-bold text-blue'>500 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos odontológicos por emergencia: </span><span class='text-semi-bold text-blue'>500 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>100 USD.</span></li>
                                                                        </ul>
                                                                    }
                                                                    {/* {plan.idplan == '2964' && <small>El que más compran nuestros clientes porque tiene la cobertura ideal.</small>} */}
                                                                    {
                                                                        plan.idplan == '2964' 
                                                                        &&
                                                                        <ul class='text-start'>
                                                                            <li><span class='text-dark-gray'>Telemedicina pre y post viaje.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>60.000 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos médicos por enfermedad preexistente: </span><span class='text-semi-bold text-blue'>1.000 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos odontológicos por emergencia: </span><span class='text-semi-bold text-blue'>800 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>150 USD.</span></li>
                                                                        </ul>
                                                                    }
                                                                    {/* {plan.idplan == '2965' && <small>Maximizamos lo necesario para quienes buscan mayor protección.</small>} */}
                                                                    {
                                                                        plan.idplan == '2965' 
                                                                        &&
                                                                        <ul class='text-start'>
                                                                            <li><span class='text-dark-gray'>Telemedicina pre y post viaje.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>100.000 USD.</span></li>
                                                                            <li><span class='text-dark-gray'>Compensación por pérdida de equipaje en crucero.</span></li>
                                                                            <li><span class='text-dark-gray'>Auxilio para cremación de mascota fallecida en viaje.</span></li>
                                                                            <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>200 USD.</span></li>
                                                                        </ul>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div class='row'>
                                                                <div class='col-lg-12 text-center'>
                                                                    <small>Precio</small>
                                                                    <h2 class='card-subtitle text-semi-bold text-dark-blue mb-3' style={{marginTop:'-10px'}}>{(plan.precio_grupal_convertion ? plan.precio_grupal_convertion : plan.precio_grupal) +' '+ (plan.codigomonedapago_convertion ? plan.codigomonedapago_convertion : plan.codigomonedapago)}</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                    <button class={planSelected.value.idplan == plan.idplan ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'} onClick$={() => {getPlan$(plan)}}>{planSelected.value.idplan == plan.idplan ? 'Seleccionado' : 'Seleccionar'}</button> 
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div class='row cards mobile'>
                                <div class='col-xl-12'>
                                    <div id="carouselPlans" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true" data-bs-interval='5200'>
                                        <div class="carousel-indicators">
                                            {
                                                plans.value.map((plan,index) => {
                                                    return(
                                                        <button key={index+1} type="button" data-bs-target="#carouselPlans" data-bs-slide-to={index} class={index == 0 ? "active" : ''}></button>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div class="carousel-inner">
                                            {
                                                plans.value.map((plan,index) => {
                                                    return(
                                                        <div key={index+1} class={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                            <div class='container'>
                                                                <div class='row justify-content-center'>
                                                                    <div class='col-md-6 col-sm-9 col-xs-10'>
                                                                        <div class={plan.idplan == '2964' ? 'card border-dark-blue' : 'card border'}>
                                                                            {
                                                                                plan.idplan == '2964'
                                                                                &&
                                                                                <span class='card-recommended'>
                                                                                    <img class='mt-0 me-2' src='/assets/img/icons/continental-assist-icon-star.webp' width='20' alt='continental-assist-icon-star'/>
                                                                                    <p class='mb-0'>+ vendido</p>
                                                                                </span>
                                                                            }
                                                                            <div class='card-body'>
                                                                                <div class='container'>
                                                                                    <div class='row'>
                                                                                        <div class='col-lg-12 text-center align-center'>
                                                                                            {plan.idplan == '2946' && <ImgContinentalAssistBagEssential class='img-fluid' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                                                                                            {plan.idplan == '2964' && <ImgContinentalAssistBagComplete class='img-fluid' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                                                                                            {plan.idplan == '2965' && <ImgContinentalAssistBagElite class='img-fluid' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                                                                                        </div>
                                                                                        <div class='col-lg-12 text-center'>
                                                                                            <h2 class='card-title text-semi-bold text-light-blue'>
                                                                                                {plan.idplan == '2946' && 'Essential'}
                                                                                                {plan.idplan == '2964' && 'Complete'}
                                                                                                {plan.idplan == '2965' && 'Elite'}
                                                                                                {/* {plan.nombreplan} */}
                                                                                            </h2>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class='row'> 
                                                                                        <div class='col-lg-12 text-center'>
                                                                                            <small>Cubre hasta</small>
                                                                                            <h2 class='card-subtitle text-semi-bold text-dark-blue mb-0' style={{marginTop:'-10px'}}>
                                                                                                {plan.idplan == '2946' && '35K USD'}
                                                                                                {plan.idplan == '2964' && '60K USD'}
                                                                                                {plan.idplan == '2965' && '100K USD'}
                                                                                            </h2>
                                                                                            <button type='button' class='btn-link text-regular text-light-blue mb-2' onClick$={() => {getBenefits$(index)}} data-bs-toggle="modal" data-bs-target="#modalBenefits">Ver más</button> 
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class='row mt-3 mb-4'>
                                                                                        <div class='col-lg-12 text-center' style={{lineHeight:'16px',height:'160px'}}>
                                                                                            {/* {plan.idplan == '2946' && <small>Te protegemos con lo necesario para que disfrutes de tus aventuras.</small>} */}
                                                                                            {
                                                                                                plan.idplan == '2946' 
                                                                                                &&
                                                                                                <ul class='text-start'>
                                                                                                    <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>35.000 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos médicos por enfermedad preexistente: </span><span class='text-semi-bold text-blue'>500 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos odontológicos por emergencia: </span><span class='text-semi-bold text-blue'>500 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>100 USD.</span></li>
                                                                                                </ul>
                                                                                            }
                                                                                            {/* {plan.idplan == '2964' && <small>El que más compran nuestros clientes porque tiene la cobertura ideal.</small>} */}
                                                                                            {
                                                                                                plan.idplan == '2964' 
                                                                                                &&
                                                                                                <ul class='text-start'>
                                                                                                    <li><span class='text-dark-gray'>Telemedicina pre y post viaje.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>60.000 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos médicos por enfermedad preexistente: </span><span class='text-semi-bold text-blue'>1.000 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos odontológicos por emergencia: </span><span class='text-semi-bold text-blue'>800 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>150 USD.</span></li>
                                                                                                </ul>
                                                                                            }
                                                                                            {/* {plan.idplan == '2965' && <small>Maximizamos lo necesario para quienes buscan mayor protección.</small>} */}
                                                                                            {
                                                                                                plan.idplan == '2965' 
                                                                                                &&
                                                                                                <ul class='text-start'>
                                                                                                    <li><span class='text-dark-gray'>Telemedicina pre y post viaje.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos médicos por accidente: </span><span class='text-semi-bold text-blue'>100.000 USD.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Compensación por pérdida de equipaje en crucero.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Auxilio para cremación de mascota fallecida en viaje.</span></li>
                                                                                                    <li><span class='text-dark-gray'>Gastos por acceso a sala VIP: </span><span class='text-semi-bold text-blue'>200 USD.</span></li>
                                                                                                </ul>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class='row'>
                                                                                        <div class='col-lg-12 text-center'>
                                                                                            <small>Precio</small>
                                                                                            <h2 class='card-subtitle text-semi-bold text-dark-blue mb-3' style={{marginTop:'-10px'}}>{(plan.precio_grupal_convertion ? plan.precio_grupal_convertion : plan.precio_grupal) +' '+ (plan.codigomonedapago_convertion ? plan.codigomonedapago_convertion : plan.codigomonedapago)}</h2>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> 
                                                                            <button class={planSelected.value.idplan == plan.idplan ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'} onClick$={() => {getPlan$(plan)}}>Seleccionar</button> 
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalBenefits' class="modal fade">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            {benefitsPlan.value.idplan == '2946'&& <ImgContinentalAssistBagEssential class='img-fluid' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                            {benefitsPlan.value.idplan == '2964'&& <ImgContinentalAssistBagComplete class='img-fluid' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                            {benefitsPlan.value.idplan == '2965'&& <ImgContinentalAssistBagElite class='img-fluid' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                            <h2 class='text-semi-bold text-white'>
                                {benefitsPlan.value.idplan == '2946' && 'Essential'}
                                {benefitsPlan.value.idplan == '2964' && 'Complete'}
                                {benefitsPlan.value.idplan == '2965' && 'Elite'}   
                            </h2>
                        </div>
                        <div class="modal-body">
                            <table class='table table-borderless table-striped'>
                                <tbody>
                                    {
                                        benefitsPlan.value.beneficiosasignados.map((benefit,iBenefit) => {
                                            return(
                                                <>
                                                    <tr key={iBenefit+1}>
                                                        <td class='tr-title text-semi-bold text-dark-blue'>{benefit.nombrefamilia}</td>
                                                    </tr>
                                                    {
                                                        benefit.beneficios.map((item,iItem) => {
                                                            return(
                                                                <tr key={iItem+1}>
                                                                    <td class='text-blue'>{item.nombrebeneficio}<span style={{float:'right'}}>{item.cobertura}</span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalGroupPlan' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <ImgContinentalAssistGroupPlan class='img-fluid' title='continental-assist-group-plan' alt='continental-assist-group-plan'/>
                            <h2 class='text-semi-bold text-drak-blue'>¡Genial!</h2>
                        </div>
                        <div class="modal-body">
                            <p class='text-blue'>
                                Parece que la cantidad de viajeros y las edades ingresadas, aplican para nuestro plan grupal.
                                Solo vas a pagar por la asistencia de los <span class='text-semi-bold'>mayores de 23 años y el resto corren por nuestra cuenta</span>.
                            </p>
                            <h3 class='text-semi-bold text-light-blue'>¡No estas alucinando!</h3>
                            <p class='text-blue'><span class='text-semi-bold'>Continental</span> te esta entregando asistencias completamente gratis.</p>
                            <div class='d-grid gap-2'>
                                <button type='button' class='btn btn-primary' onClick$={getGroupPlan$}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})