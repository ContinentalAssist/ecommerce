import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import { SwitchDivisa } from "~/components/starter/switch/SwitchDivisa";
import CurrencyFormatter from "~/utils/CurrencyFormater";
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx'
import ImgContinentalAssistGroupPlan from '~/media/icons/continental-assist-group-plan.webp?jsx'

import styles from './index.css?inline'
import { QuotesEngine } from "~/components/starter/quotes-engine/QuotesEngine";

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
                    <div class='col-3 col-xs-6'>
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
                    <div class='col-lg-3  col-xs-6 text-end '/* align-items-end */>
                        {/* <div class='d-grid gap-2'> */}
                            <button type='button' class='btn btn-link text-regular text-light-blue mt-3' onClick$={props.openEdit}>Editar</button>
                        {/* </div> */}
                    </div>
                </div>
                :
                <>
                    {/* <div class='row'>
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
                    </div> */}
                    <QuotesEngine setLoading={props.loading} isMobile={props.isMobile}/>
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
    const divisaManual = useSignal(false)
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
            inputs.map((input) => {
                if ((input as HTMLInputElement).readOnly == true) {
                    (input as HTMLInputElement).removeAttribute('readonly');
                    //input.setAttribute('readonly', '');
                }})
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

    const openEdit$ = $(() => {
        showForm.value = !showForm.value

        if(showForm.value === true)
        {
            loading.value= true
/*             if(Object.keys(stateContext.value).length > 0)
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
            } */
        }
    })

    const getGroupPlan$ = $(() => {
        const bs = (window as any)['bootstrap']
        const modal = bs.Modal.getInstance('#modalGroupPlan',{})
        modal.hide()
        navigate('/quotes-engine/step-1')
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

    const getLoading$ = $((status:boolean) => {        
        loading.value = status
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
                        loading={getLoading$}
                        isMobile={stateContext.value.isMobile}
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
                                        <div class='col-md-2 text-end'>
                                            <QuotesEngineSteps active={1} name={'Planes'} steps={5}/>
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
            <div class='row mobile  text-center' >
            <hr class='m-0' />
                <div class='col-xs-12 d-flex justify-content-center align-items-center ' style={{padding:'20px'}} >
                    <QuotesEngineSteps active={1} name={'Planes'} steps={5}/>
                </div>
                <div class='col-xs-12 ' style={{padding:'20px'}}>
                    <SwitchDivisa
                        labels={['USD',stateContext.value?.currentRate?.code]}
                        value={stateContext.value.divisaManual ? 'base' : 'local'}
                        onChange={$((e:any) => {changeDivisa$(e)})}
                    />
                </div>
              
            </div>
             
            <div class='row bg-step-3'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row justify-content-center'>
                            {
                                plans.value.length == 0
                                ?
                                <div class='col-lg-12 text-center mt-4 mb-5'>
                                    <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                    <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                </div>
                                :
                                <div class='col-lg-12 text-center mt-4 mb-4'>
                                    <h1 class='text-semi-bold text-dark-blue'>
                                        <span class='text-tin'>Elige </span> tu plan
                                    </h1>
                                    <hr class='divider my-3'/>
                                    <h5 class='text-dark-blue'>Tenemos uno ideal para ti</h5>
                                </div>
                            }
                        </div>
                        <div class='row justify-content-between cards '/* not-mobile */>
                            {
                                plans.value.map((plan,index) => {
                                    return(
                                        <div key={index+1} class='col-lg-4 col-sm-4'>
                                            <div class={plan.idplan == '2964' ? 'card border-dark-blue ms-2 mb-5' : 'card border border-0 ms-2 mb-5 shadow-lg'} style={{maxWidth:'400px'}}>
                                                {
                                                    plan.idplan == '2964'
                                                    &&
                                                    <span class='card-recommended'>
                                                        {/* <ImgContinentalAssistStar class='img-star mt-0 me-2' title='continental-assist-star' alt='continental-assist-star'/> */}
                                                        <p class='mb-0'>Recomendado</p>
                                                    </span>
                                                }
                                                {plan.idplan == '2946' && <ImgContinentalAssistBagEssential class='card-img-top' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                                                {plan.idplan == '2964' && <ImgContinentalAssistBagComplete class='card-img-top' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                                                {plan.idplan == '2965' && <ImgContinentalAssistBagElite class='card-img-top' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                                                <div class='card-body px-5'>
                                                    <div class='container'>
                                                        <div class='row'>
                                                            <div class='col-lg-12 text-center'>
                                                                <h2 class='h1 card-title text-semi-bold text-light-blue mb-0'>
                                                                    {plan.idplan == '2946' && 'Essential'}
                                                                    {plan.idplan == '2964' && 'Complete'}
                                                                    {plan.idplan == '2965' && 'Elite'}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                        <div class='row'> 
                                                            <div class='col-lg-12 text-center'>
                                                                <small class='h5 text-dark-gray'>Cubre hasta
                                                                    <span class='text-bold'>
                                                                        {plan.idplan == '2946' && ' 35K USD'}
                                                                        {plan.idplan == '2964' && ' 60K USD'}
                                                                        {plan.idplan == '2965' && ' 100K USD'}
                                                                    </span>
                                                                </small>
                                                                <br/>
                                                                <button 
                                                                    type='button' 
                                                                    class='btn btn-link text-regular text-light-blue my-2' 
                                                                    onClick$={() => {getBenefits$(index)}} 
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target="#modalBenefits"
                                                                >
                                                                    Ver más
                                                                </button> 
                                                            </div>
                                                        </div>
                                                        <div class='row'>
                                                            <div class='col-lg-12 text-center'>
                                                                <h2 class='card-subtitle text-semi-bold text-dark-blue mb-3' style={{marginTop:'-10px'}}>
                                                                    {
                                                                        divisaManual.value == true 
                                                                        ? 
                                                                        CurrencyFormatter(plan.codigomonedapago,plan.precio_grupal)
                                                                        : 
                                                                        CurrencyFormatter(stateContext.value.currentRate.code,plan.precio_grupal * stateContext.value.currentRate.rate)
                                                                    }
                                                                </h2>
                                                            </div>
                                                        </div>
                                                        <div class='row mt-1 mb-1'>
                                                            <div class='col-lg-12 text-center text-semi-bold' style={{height:'170px'}}>
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
                                                    </div>
                                                </div> 
                                                <button 
                                                    class={planSelected.value.idplan == plan.idplan ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'} 
                                                    onClick$={() => {getPlan$(plan)}}
                                                >
                                                    {planSelected.value.idplan == plan.idplan ? 'Seleccionado' : 'Seleccionar'}
                                                </button> 
                                            </div>
                                        </div>
                                    )
                                })
                            }
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
        </div>   
    )
})