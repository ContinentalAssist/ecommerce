import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$,useTask$ ,Fragment} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from "~/utils/CurrencyFormater";
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx'
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx'
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx'
import styles from './index.css?inline'
import dayjs from "dayjs";
import { LoadingContext } from "~/root";

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
    const contextDivisa = useContext(DIVISAContext)

    const arrayPlans: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]}[] = []
    const objectBenefitsPlan: {[key:string]:any,beneficiosasignados:[{[key:string]:any,beneficios:any[]}]} = {beneficiosasignados:[{beneficios:[]}]}
    const objectPlanSelected: {[key:string]:any} = {}
    const plans = useSignal(arrayPlans)
    const benefitsPlan = useSignal(objectBenefitsPlan)
    const planSelected = useSignal(objectPlanSelected)
    const desktop = useSignal(false)
    const indexImage = useSignal(0)
    const contextLoading = useContext(LoadingContext)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        if(!navigator.userAgent.includes('Mobile'))
        {
            desktop.value = true
        } 
           if(contextLoading.value.status == true)
           {
                contextLoading.value = {status:false, message:''}
           }
    })

    // eslint-disable-next-line qwik/no-use-visible-task
    useTask$(async() => {
        
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

            const newBody = {
                edades:dataForm.edades,                
                origen: dataForm.origen,
                destinos: dataForm.destinos,
                dias: dataForm.dias,
                planfamiliar: dataForm.planfamiliar,
                idfuente: 2,
                resGeo:stateContext.value.resGeo
            }
            

            const resPlans = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPlansPrices", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBody)});
            const dataPlans = await resPlans.json()
            
            error = dataPlans.error

            if(error == false)
            {
                const defaultPlan =stateContext.value.planDefault;
                if(plans.value.length < 3 && defaultPlan?.length > 0)
                {
                    const resultado = defaultPlan.map((item:any)=>{
                        const coincidente = dataPlans.resultado.find((c:any)=> c.idplan === item.idplan);
                        return coincidente ? coincidente : item;
                    })
                    
                    stateContext.value={
                        ...stateContext.value,
                        precioPlanes : resultado}

                }
               // loading.value = false

            }
            else
            {
                stateContext.value.precioPlanes = []
//                loading.value = false
            }
        }
        else
        {
            stateContext.value.precioPlanes = []
            //loading.value = false
        }
    })

    const getBenefits$ = $((index:number) => {
        benefitsPlan.value = stateContext.value.precioPlanes[index]
        indexImage.value = index
        
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
                'adultos': dataForm[75],
                'niños_y_jovenes': dataForm[23],
                'adultos_mayores': dataForm[85],
                'page': '/quotes-engeni/step-1',
                'option': planSelected.value.nombreplan,
                'precio':dataForm.plan.precio_grupal,
                'cta': 'seleccionar',
            });

            dataForm.subTotal =dataForm.plan.precio_grupal; 
            dataForm.total = {divisa:dataForm.plan.codigomonedapago,total:Number(dataForm.plan.precio_grupal)}; 
          
            stateContext.value = dataForm
            contextLoading.value = {status:true, message:'Espere un momento...'}

            await navigate('/quotes-engine/step-2')
        }
    })

    const getPlan$ = $((plan:{}) => {
        planSelected.value = plan

        getForm$()
    })
   

    return(
        <div class='container-fluid px-0'>          
            <div class='row bg-step-3 mb-3'>
                <div class='col-lg-12'>
                    <div class='container mb-5'>
                        <div class='row justify-content-center '>
                            {
                               stateContext.value && Array.isArray(stateContext.value.precioPlanes) && stateContext.value.precioPlanes.length === 0
                                ?
                                <div class='col-lg-12 text-center mt-5 mb-5'>
                                    <h2 class='h1 text-semi-bold text-dark-blue'>Lo sentimos!</h2>
                                    <h5 class='text-dark-blue'>Hubo un error en la búsqueda, vuelve a intentarlo.</h5>
                                </div>
                                :
                                <div class='col-lg-12 text-center mt-1 mb-4'>
                                    <h3 class='text-semi-bold text-dark-blue'>Elige tu plan</h3>
                                </div>
                            }
                        </div>
                        <div class='row justify-content-center'>
                            <div class='cards-container'>
                                <div class='cards'>
                                    {
                                        stateContext.value?.precioPlanes?.map((plan:any,index:number) => {                                                                                                     
                                            return(
                                                <div key={index+1} class='card-wrapper' style={{opacity:!plan.precio_grupal ?'0.3':'none', pointerEvents:!plan.precio_grupal ?'none':'all'}}>
                                                    <div class={index == 1  ? 'card border-dark-blue mb-5' : 'card border border-0  mb-5'}>
                                                        {
                                                            index == 1
                                                            &&
                                                            <span class='card-recommended'>
                                                                <p class='mb-0'>Recomendado</p>
                                                            </span>
                                                        }
                                                        
                                                        {/* Título del plan */}
                                                        <div class='card-header text-center pt-3' style={{background: 'transparent', border: 'none'}}>
                                                            <h2 class='h2 card-title text-semi-bold text-light-blue mb-0 text-responsive'>
                                                                {plan.nombreplan}                                                    
                                                            </h2>   
                                                        </div>

                                                        {/* Imagen del plan */}
                                                        <div class='text-center '>
                                                            {index == 0 && <ImgContinentalAssistBagEssential class='card-img-top' title='continental-assist-bag-essential' alt='continental-assist-bag-essential' style={{width: '120px', height: 'auto'}}/>}
                                                            {index == 1 && <ImgContinentalAssistBagComplete class='card-img-top' title='continental-assist-bag-complete' alt='continental-assist-bag-complete' style={{width: '120px', height: 'auto'}}/>}
                                                            {index == 2 && <ImgContinentalAssistBagElite class='card-img-top' title='continental-assist-bag-elite' alt='continental-assist-bag-elite' style={{width: '120px', height: 'auto'}}/>}
                                                        </div>

                                                        <div class='card-body px-4'>
                                                            {/* Cobertura */}
                                                            <div class='text-center mb-1'>
                                                                <span class='h6 text-dark-blue text-tin'>Cubre hasta 
                                                                        { ' ' + plan.cobertura }                                                                 
                                                                </span>
                                                            </div>

                                                            {/* Precio */}
                                                            <div class='text-center mb-1'>
                                                                <h2 class='card-subtitle text-semi-bold text-dark-blue mb-0 h5'>
                                                                    {
                                                                        plan.precio_grupal ?
                                                                        contextDivisa.divisaUSD == true 
                                                                        ? 
                                                                        CurrencyFormatter(plan.codigomonedapago,plan.precio_grupal)
                                                                        : 
                                                                        CurrencyFormatter(stateContext.value?.currentRate?.code,plan.precio_grupal * stateContext.value?.currentRate?.rate)
                                                                        :
                                                                        <p class="divisa text-semi-bold text-dark-blue"> No disponible</p>
                                                                    }
                                                                </h2>
                                                            </div>

                                                            {/* Botón de selección */}
                                                            <div class='text-center mb-1'>
                                                                <button 
                                                                    class={planSelected.value.idplan == plan.idplan ? 'btn btn-warning btn-lg text-tin' : 'btn btn-warning btn-lg text-medium'} 
                                                                    onClick$={() => {getPlan$(plan)}}
                                                                    style={{backgroundColor: '#FFD700', border: 'none', color: '#333', width: 'auto', padding: '0.75rem 2rem'}}
                                                                >
                                                                    {planSelected.value.idplan == plan.idplan ? 'Seleccionado' : 'Seleccionar'}
                                                                </button>
                                                            </div>

                                                            {/* Lista de beneficios */}
                                                            <div class='mb-3'>                                                        
                                                                <ul class='text-start ps-3'>
                                                                    {
                                                                        plan.beneficiosasignados[0]['beneficios'].map((beneficio:any,benefitIndex:number)=>{
                                                                            if (benefitIndex<=1) {
                                                                              return   <li key={benefitIndex} class='mb-2'><span class='text-dark-gray'>{beneficio.nombrebeneficio}: </span><span class='text-semi-bold text-blue'>{beneficio.cobertura}.</span></li>
                                                                            }
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>

                                                            {/* Enlace Ver detalles */}
                                                            <div class='text-center'>
                                                                <button 
                                                                    type='button' 
                                                                    class='btn btn-link text-medium text-light-blue p-0' 
                                                                    onClick$={() => {getBenefits$(index)}} 
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target="#modalBenefits"
                                                                    style={{textDecoration: 'underline', transition: 'none'}}
                                                                >
                                                                    Ver detalles
                                                                </button> 
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
            <div id='modalBenefits' class="modal fade">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header d-flex d-flex justify-content-between">                          
                        <h2 class='text-semi-bold text-white px-4 p-2 m-0'>
                            {benefitsPlan.value.nombreplan}
                        </h2>
                        {indexImage.value == 0 && <ImgContinentalAssistBagEssential class='img-fluid' title='continental-assist-bag-essential' alt='continental-assist-bag-essential'/>}
                        {indexImage.value == 1 &&<ImgContinentalAssistBagComplete class='img-fluid' title='continental-assist-bag-complete' alt='continental-assist-bag-complete'/>}
                        {indexImage.value == 2 && <ImgContinentalAssistBagElite class='img-fluid' title='continental-assist-bag-elite' alt='continental-assist-bag-elite'/>}
 
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                          
                    </div>
                        <div class="modal-body">
                            <table class='table table-borderless table-striped'>
                                <tbody>
                                    {
                                        benefitsPlan.value.beneficiosasignados.map((benefit,iBenefit) => {                                            
                                            return(
                                               <Fragment key={iBenefit+1}>
                                                    <tr key={iBenefit+1}>
                                                        <td key={iBenefit+1} class='tr-title text-semi-bold text-dark-blue'colSpan={2} >{benefit.nombrefamilia}</td>
                                                    </tr>
                                                    {
                                                        benefit.beneficios.map((item,iItem) => {
                                                            return(
                                                                <tr key={`beneficio-tr-${iItem+1}`} >
                                                                    <td key={`beneficio-${iItem+1}`} class='text-blue'>{item.nombrebeneficio}</td>
                                                                    <td key={`cobertura-${iItem+1}`} class='text-blue text-start'><span >{item.cobertura}</span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                               </Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>   
    )
})