import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$,Slot } from "@builder.io/qwik";
import { WEBContext } from "~/root"; 
import CurrencyFormatter from "../../../utils/CurrencyFormater";
import styles from './card-payment-resume.css?inline'
import ImgContinentalAssistPrintTicket from '../../../media/quotes-engine/continental-assist-print-ticket.webp?jsx'


export const CardPaymentResume = component$(() => {

    //useStyles$(styles)

    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const objectResume : {[key:string]:any} = {}

    const resume = useSignal(objectResume)
    const loading = useSignal(true)
    const divisaManual = useSignal(stateContext.value.divisaManual)

    useVisibleTask$(() => {
        
        if(Object.keys(stateContext.value).length > 0)
        {
            
            resume.value = stateContext.value
            loading.value = false            
        }
      
    })

    const openCollapsPax$ =$(( key:string)=>{
        const bs = (window as any)['bootstrap']
       
        
        const collapseTwo = new bs.Collapse('#'+key,{})
        collapseTwo.hide()

            const collapse = document.querySelectorAll('.collapse');

            collapse.forEach(item=>{
                if (item.id != key) {
                    //item.classList.add('collapsing')
                    //item.classList.remove('collapsing')   
                    item.classList.remove('show')
                }
            })
    })

    return(
            <div class='card card-body shadow-lg mb-5' style={{minHeight:'500px', marginBottom:'70px !important'}}>
            <div class='container'>
                <div class="row">
                <div class='col-lg-5'>
                <ImgContinentalAssistPrintTicket class="img-ticket" style={{width:'100%'}} title='continental-assist-print-ticket' alt='continental-assist-print-ticket'/>

                <div class="card" id="card-pax">
                    <div class="card-body">                                          


                    <ul class="list-group" id="list-pax">

                        {
                            Object.keys(resume.value).length > 0
                            &&
                            resume.value.asegurados.map((pax:any,index:number) => {
                                return (
                                    <li class="list-group-item" key={index+1} >                                                            
                                        <div class='row'>
                                            <div class='col-lg-12' >
                                                <p class='text-gray' style={{textAlign:'left', padding:0, margin:0}}>Viajero # {index+1}</p>
                                            </div>
                                        </div>
                                        <div class='row ' >
                                            <div class="col-lg-6">
                                            <h5 class="text-bold text-dark-blue" style={{textAlign:'left', marginBottom:0}} >{pax.nombres} {pax.apellidos}</h5>
                                            </div>
                                            <div class="col-lg-6 ">
                                            <p class='text-light-blue' style={{textAlign:'right', padding:0,margin:0, cursor:'pointer'}} onClick$={() => {openCollapsPax$(String("collapse-"+(index+1)) )}}>Ver detalles</p>
                                            </div>
                                    
                                             <hr style={{backgroundColor:'#44d1fd',height:'4px',marginBottom:'0px',border:'none'}}/>

                                            <div id={"collapse-"+(index+1)} class={index==0?'collapse-pax collapse show':' collapse-pax collapse'} aria-labelledby="headingTwo" data-parent="#accordion" style={{backgroundColor:'#FAFAFA', marginLeft:0, marginRight:0}}>
                                                <div class="row">
                                                    <div class='col-lg-6 col-xs-12'>
                                                    <div class="input-group">
                                                        <span class="input-group-text border border-0 ">
                                                            <i class="fa-solid fa-plane-departure"/>
                                                        </span>
                                                        <p style={{textAlign:'left'}}>
                                                        <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Origen / Destino(s)</span> <br/>                                                                            
                                                        <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.paisorigen} <span class='text-semi-bold text-dark-blue'> a </span> {resume.value.paisesdestino && String(resume.value.paisesdestino).replaceAll(',',', ')}</span>
                                                        </p>                                                            
                                                    </div>
                                                    </div>                                                                     
                                                                                                                
                                                
                                                    <div class='col-lg-6 col-xs-12'>
                                                        <div class="input-group">
                                                            <span class="input-group-text border border-0 ">
                                                                <i class="fa-solid fa-user-plus"/>
                                                            </span>
                                                            <p style={{textAlign:'left'}}>
                                                            <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Viajeros</span><br/>
                                                                <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.pasajeros}
                                                            </span>
                                                            </p>                                                            
                                                        </div>
                                                    
                                                    </div>

                                                    <div class='col-lg-12 col-xs-12'>
                                                        <div class="input-group">
                                                            <span class="input-group-text border border-0 ">
                                                                <i class="far fa-calendar"/>
                                                            </span>
                                                            <p style={{textAlign:'left'}}>
                                                            <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Fechas de tu viaje</span> <br/>                                                                            
                                                                <span class="text-bold text-dark-blue" style={{fontSize:'12px'}}>{resume.value.desde} <span class='text-semi-bold text-dark-blue'> al </span> {resume.value.hasta}</span>
                                                            </p>                                                            
                                                        </div>
                                                    </div>

                                                    <hr/>
                                                    <div class='col-6'>
                                                
                                                
                                                        <div class="input-group">
                                                            <span class="input-group-text border border-0 ">
                                                                <i class="fa-solid fa-clipboard-check"/>
                                                            </span>
                                                            <p style={{textAlign:'left'}}>
                                                            <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Plan</span><br/>
                                                                <span class="text-bold text-light-blue" style={{fontSize:'12px'}}>{resume.value.plan.nombreplan}
                                                            </span>
                                                            </p>                                                            
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <p class="text-semi-bold text-dark-blue text-end">{
                                                            divisaManual.value == true ? CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.plan.precioindividual * stateContext.value.currentRate.rate)
                                        
                                                        }</p>
                                                    </div>

                                                  

                                                    {
                                                        pax.beneficiosadicionales.length>0
                                                        &&<>
                                                          <hr/>
                                                          <div class='col-lg-6 col-xs-12'>                                                                            
                                                            <div class="input-group">
                                                                
                                                                <p style={{textAlign:'left'}}>
                                                                <span class="text-semi-bold text-dark-gray ps-0" style={{fontSize:'12px'}}>Benenficios adicionales</span><br/>
                                                               </p>                                                            
                                                            </div>
                                                            </div>
                                                        </>
                                                        
                                                        
                                                    }
                                                    
                                                    
                                                   
                                                    <ul >
                                                        {
                                                            
                                                            pax.beneficiosadicionales.map((benefit:any,iBenefit:number) => {
                                                                return(
                                                                    <li key={iBenefit} class='text-semi-bold text-blue' style={{fontSize:'14px'}}>
                                                                        <div class='row'>
                                                                            <div class='col-lg-6 col-xs-12'>
                                                                            {benefit.nombrebeneficioadicional}
                                                                            </div>         
                                                                            <div class='col-lg-6 col-xs-12'>
                                                                                <span style={{float:'right'}}>
                                                                                    {
                                                                                        divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                                                    }
                                                                                </span>
                                                                                        
                                                                            </div>                                                                       
                                                                        </div>
                                                                 </li>
                                                                )
                                                            })
                                                            
                                                        }
                                                        <li key="key-sub">
                                                        <hr/>
                                                        <div class='row'>
                                                            <div class='col-lg-12 text-end' >
                                                                <span class='text-semi-bold text-gray' style={{ padding:0, margin:0}}>Sub total</span><br/>
                                                                <span class='text-bold text-dark-blue'> 
                                                                {
                                                                    resume.value.total && (divisaManual.value == true ? CurrencyFormatter(resume.value.total.divisa,
                                                                        (pax.beneficiosadicionales.reduce((sum:number, value:any) => {
                                                                            return sum + value.precio;
                                                                        }, 0) + resume.value.plan.precioindividual)

                                                                    ) : CurrencyFormatter(stateContext.value.currentRate.code,
                                                                        (pax.beneficiosadicionales.reduce((sum:number, value:any) => {
                                                                            return sum + value.precio;
                                                                        }, 0) + resume.value.plan.precioindividual)
                                                                        * stateContext.value.currentRate.rate))                                                           
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                            

                                                        </li>
                                                        

                                                    </ul>
                                            </div>
                                                                                        
                                            </div>
                                        </div>
                                
                                    </li>

                                )
                            })
                        }

                      {/*   {
                             Object.keys(resume.value).length > 0
                             && <li class="list-group-item" key="key-1" >
                                    <div class='row'>
                                        <div class='col-lg-12 text-end' >
                                            <span class='text-semi-bold text-gray' style={{ padding:0, margin:0}}>Total</span><br/>
                                            <span class='text-bold text-dark-blue'> {
                                             
                                             resume.value.total && (divisaManual.value == true ? CurrencyFormatter(resume.value.total.divisa,resume.value.total.total) : CurrencyFormatter(stateContext.value.currentRate.code,resume.value.total.total * stateContext.value.currentRate.rate))
                                            }</span>
                                        </div>
                                    </div>
                                </li>
                        } */}
                    

                    </ul>
               
                    </div>
                                                         
                   
                </div>
                </div>
                <div class='col-lg-7'>
                        <Slot/>
                        
                </div>

                </div>
            </div>
                
            </div>                            
      
    )
})