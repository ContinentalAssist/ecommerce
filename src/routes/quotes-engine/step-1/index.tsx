import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import { SwitchDivisa } from "~/components/starter/switch/SwitchDivisa";
import CurrencyFormatter from "~/utils/CurrencyFormater";
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx'
import ImgContinentalAssistGroupPlan from '~/media/icons/continental-assist-group-plan.webp?jsx'

import styles from './index.css?inline'
import { QuotesEngine } from "~/components/starter/quotes-engine/QuotesEngine";
import dayjs from "dayjs";

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
                                <label class='text-medium text-dark-gray ps-0' for="fechas">Origen / Destino(s)</label>
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
                                <label class='text-medium text-dark-gray ps-0' for="fechas">Fechas de tu viaje</label>
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
                                <label class='text-medium text-dark-gray ps-0' for="fechas">Viajeros</label>
                            </div>
                        </div>
                    </div>
                    <div class='col-lg-3  col-xs-6 text-end '>
                            <button type='button' class='btn btn-link text-medium text-light-blue mt-3' onClick$={props.openEdit}>Editar</button>
                    </div>
                </div>
                :
                <>
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
    const contextDivisa = useContext(DIVISAContext)

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
            dataForm.ip = stateContext?.value?.resGeo?.ip_address

            let error = false

            const resPlans = await fetch("/api/getPlansPrices",{method:"POST",body:JSON.stringify(dataForm)});
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
                'desde': dayjs(dataForm.desde).format('YYYY-MM-DD'),
                'hasta':  dayjs(dataForm.hasta).format('YYYY-MM-DD'),
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
            newDataForm.desde=dayjs(newDataForm.desde).format('YYYY-MM-DD')
            newDataForm.hasta=dayjs(newDataForm.hasta).format('YYYY-MM-DD')
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

                    const resPlans = await fetch("/api/getPlansPrices",{method:"POST",body:JSON.stringify(dataForm)});
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

                    const resPlans = await fetch("/api/getPlansPrices",{method:"POST",body:JSON.stringify(dataForm)});
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
            contextDivisa.divisaUSD = true
        }
        else if(divisa == 'local')
        {
            divisaManual.value = false
            contextDivisa.divisaUSD = false
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
                                                value={contextDivisa.divisaUSD ? 'base' : 'local'}
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
                        value={contextDivisa.divisaUSD ? 'base' : 'local'}
                        onChange={$((e:any) => {changeDivisa$(e)})}
                    />
                </div>
              
            </div>
             
            <div class='row bg-step-3 mb-3'>
                <div class='col-lg-12'>
                    <div class='container mb-5'>
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
                        <div class='row justify-content-between cards '>
                            {
                                plans.value.map((plan,index) => {                                    
                                    return(
                                        <div key={index+1} class='col-lg-4 col-sm-4'>
                                            <div class={plan.idplan == '2964' ? 'card border-dark-blue ms-2 mb-5' : 'card border border-0 ms-2 mb-5 shadow-lg'} style={{maxWidth:'400px', maxHeight:'90%', minHeight:'90%'}}>
                                                {
                                                    plan.idpopularidad == 9
                                                    &&
                                                    <span class='card-recommended'>
                                                        <p class='mb-0'>Recomendado</p>
                                                    </span>
                                                }
                                                {plan.idpopularidad == 8 && <ImgContinentalAssistBagEssential class='card-img-top' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                                                {plan.idpopularidad == 9 && <ImgContinentalAssistBagComplete class='card-img-top' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                                                {plan.idpopularidad == 10 && <ImgContinentalAssistBagElite class='card-img-top' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                                                <div class='card-body px-4'>
                                                    <div class='container'>
                                                        <div class='row'>
                                                            <div class='col-lg-12 text-center'>
                                                                <h2 class='h1 card-title text-semi-bold text-light-blue mb-0'>
                                                                    {plan.nombreplan}                                                    
                                                                </h2>
                                                            </div>
                                                        </div>
                                                        <div class='row'> 
                                                            <div class='col-lg-12 text-center'>
                                                                <small class='h5 text-dark-gray'>Cubre hasta 
                                                                    <span class='text-bold'>
                                                                        { ' ' + plan.cobertura }                                                                 
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
                                                            <div class='col-lg-12 text-center text-medium' style={{height:'170px'}}>                                                        
                                                                     <ul class='text-start'>
                                                                        {
                                                                            plan.beneficiosasignados[0]['beneficios'].map((beneficio,index)=>{
                                                                                if (index<=4) {
                                                                                  return   <li><span class='text-dark-gray'>{beneficio.nombrebeneficio}: </span><span class='text-semi-bold text-blue'>{beneficio.cobertura}.</span></li>
                                                                                }
                                                                            })
                                                                        }
                                                                 </ul>
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
                            {benefitsPlan.value.idpopularidad == 10 && <ImgContinentalAssistBagEssential class='img-fluid' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                            {benefitsPlan.value.idpopularidad == 9 &&<ImgContinentalAssistBagComplete class='img-fluid' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                            {benefitsPlan.value.idpopularidad == 8 && <ImgContinentalAssistBagElite class='img-fluid' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
                            <h2 class='text-semi-bold text-white p-2'>
                                {benefitsPlan.value.nombreplan}
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
                                                        <td class='tr-title text-semi-bold text-dark-blue'colSpan={2} >{benefit.nombrefamilia}</td>
                                                    </tr>
                                                    {
                                                        benefit.beneficios.map((item,iItem) => {
                                                            return(
                                                                <tr key={iItem+1}>
                                                                    <td class='text-blue'>{item.nombrebeneficio}</td>
                                                                    <td class='text-blue text-start'><span >{item.cobertura}</span></td>
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
                            <h2 class='text-semi-bold text-drak-blue p-2'>¡Genial!</h2>
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