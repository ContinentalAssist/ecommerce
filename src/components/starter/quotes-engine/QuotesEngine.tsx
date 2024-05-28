import { $, component$, useContext,useSignal, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import ServiceRequest from "~/utils/ServiceRequest";
import { Form } from "../form/Form";
import styles from './quotes-engine.css?inline'
import { WEBContext } from "~/root";

export interface propsQE {
    [key:string] : any
}

export const QuotesEngine = component$((props:propsQE) => {
    useStyles$(styles)

    const array : any[] = []
    const stateContext = useContext(WEBContext)
    const origins = useSignal(array)
    const destinations = useSignal(array)
    const dateStart = useSignal('')
    const dateEnd = useSignal('')
    const isMobile = useSignal(false)
    const object : {[key:string]:any} = {}
    const resume = useSignal(object)



    useTask$(async() => {
        let res : {[key:string]:any[]} = {}
        const resOrigins : any[] = []
        const resDestinations : any[] = []

        await ServiceRequest('/pw_getSelectsPorDefectoCotizadorViajes',{},(response) => {
            res = response.resultado[0]
        })
        
        res.origenes.map((origen) => {
            resOrigins.push({value:origen.idpais,label:origen.nombrepais})
        })

        res.destinos.map((destino) => {
            resDestinations.push({value:destino.idpais,label:destino.nombrepais})
        })

        origins.value = resOrigins
        destinations.value = resDestinations
        resume.value = stateContext.value
        props.setLoading != undefined&&props.setLoading(false)
        
    })

    useVisibleTask$(() => {
        
        dateStart.value = new Date().toISOString().substring(0, 10)
        dateEnd.value = new Date(new Date().setDate(new Date().getDate()+2)).toISOString().substring(0, 10)

        if(navigator.userAgent.includes('Mobile')){
            isMobile.value = true
        }
        resume.value = stateContext.value
      
        
    })

    const changeOrigin$ = $((e:any) => {        
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement
        const inputDestinations = form.querySelector('#form-step-1-0-select-0-1') as HTMLInputElement
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
        
        const dropdownDestinations = new bs.Dropdown('#dropdown-toggle-'+inputDestinations.id,{})
        dropdownDestinations.show()

        if (isMobile.value == true) {
            const formPrev = document.querySelector('#form-step-prev-1-0') as HTMLFormElement
            const inputPrevOrigin = formPrev.querySelector('#form-step-prev-1-0-input-0-0') as HTMLInputElement
            inputPrevOrigin.value = e.label;
        }
                
    })

    const changeDateStart$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateStart = form.querySelector('input[name=desde]') as HTMLInputElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement
      
        const formatDateStart = inputDateStart.value.replaceAll('-','/')

        inputDateEnd.min = new Date(new Date(formatDateStart).setDate(new Date(formatDateStart).getDate()+2)).toISOString().substring(0,10)
        inputDateEnd.max = new Date(new Date(formatDateStart).setDate(new Date(formatDateStart).getDate()+365)).toISOString().substring(0,10)
        
        inputDateEnd.focus()
        inputDateEnd.showPicker()
        if (isMobile.value) {
            const formPrev = document.querySelector('#form-step-prev-1-1') as HTMLFormElement
            const inputPrevDateStart = formPrev.querySelector('#form-step-prev-1-1-input-0-0') as HTMLInputElement
            inputPrevDateStart.value = String(formatDateStart);
        }
    })

    const changeDateEnd$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement
        const formatDateEnd = inputDateEnd.value.replaceAll('-','/')

        dateEnd.value = inputDateEnd.value

        if (isMobile.value) {
            const formPrev = document.querySelector('#form-step-prev-1-1') as HTMLFormElement
            const inputPrevDateEnd = formPrev.querySelector('#form-step-prev-1-1-input-0-1') as HTMLInputElement
            inputPrevDateEnd.value = String(formatDateEnd);
        }
    })

    const onClickInput$ =$((e:any)=>{
        const bs = (window as any)['bootstrap']
        const name =e.target.name
       if (name =='origenprev'||name =='destinosprev') {
        const modal = new bs.Modal('#modal-mobile-travel',{})
        modal.show()
       }
       
        
       if (name =='desdeprev'||name =='hastaprev') {
        const modal = new bs.Modal('#modal-mobile-dates',{})
        modal.show()
       }

       if (name =='pasajerosprev') {
        const modal = new bs.Modal('#modal-mobile-pax',{})
        modal.show()
       }

       
          
    })

    const changeDestinations$=$((e:any)=>{
        if (isMobile.value) {
            const formPrev = document.querySelector('#form-step-prev-1-0') as HTMLFormElement
            const inputPrevOrigin = formPrev.querySelector('#form-step-prev-1-0-input-0-1') as HTMLInputElement
            inputPrevOrigin.value = e.label.join(",");
        }        
    })

    const changePax$=$((e:any)=>{
        if (isMobile.value) {
            const formPrev = document.querySelector('#form-step-prev-1-2') as HTMLFormElement
            const inputPrevPax = formPrev.querySelector('#form-step-prev-1-2-input-0-0') as HTMLInputElement
            inputPrevPax.value = e.label;
        } 
        
    })
   
    return(
        <div class='container' id='quotes-engine'>
            <div class='row'>
                {
                isMobile.value == false&&
                <>
                <div class='col-lg-4'>
                    <h3 class='text-semi-bold mb-sm-4'>¿A dónde viajas?</h3>
                    <Form
                        id='form-step-1-0'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'select',
                                    label:'Origen',
                                    name:'origen',
                                    options:origins.value,required:true,
                                    onChange:$((e:any) => {changeOrigin$(e)}),
                                    icon:'plane-departure',
                                    menuSize:{width:'549px', height:'394px'},
                                    value: resume.value.origen,
                                },
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'select-multiple',
                                    label:'Destino(s)',
                                    name:'destinos',
                                    options:destinations.value,
                                    required:true,
                                    icon:'plane-arrival',
                                    menuSize:{width:'549px', height:'394px'},
                                    value: resume.value.destinos,
                                }
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-5'>
                    <h3 class='text-semi-bold mb-sm-4'>¿Cuándo viajas?</h3>
                    <Form
                        id='form-step-1-1'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'date',
                                    label:'Desde',
                                    name:'desde',
                                    min:dateStart.value,
                                    onChange:changeDateStart$,
                                    required:true,
                                    icon:'calendar',
                                    value: resume.value.desde,
                                },
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'date',
                                    label:'Hasta',
                                    name:'hasta',
                                    min:dateEnd.value,
                                    onChange:changeDateEnd$,
                                    required:true,
                                    icon:'calendar',
                                    value: resume.value.hasta,
                                }
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-3'>
                    <h3 class='text-semi-bold mb-sm-4'>¿Cuántos viajan?</h3>
                    <Form
                        id='form-step-1-2'
                        form={[
                            {row:[
                                {
                                    size:'col-12',
                                    type:'paxs',
                                    name:'pasajeros',
                                    required:true,
                                    icon:'user-plus',
                                    value:{[22]:resume.value[22]||0,[70]:resume.value[70]||0,[85]:resume.value[85]||0},
                                }
                            ]}
                        ]}
                    />
                </div>
                </>
                }

                {
                isMobile.value == true&&
                <>
                <div class='col-lg-4'>
                    <h3 class='text-semi-bold mb-sm-4 text-center text-dark-blue'>¿A dónde viajas?</h3>
                    <Form
                        id='form-step-prev-1-0'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'text',
                                    label:'Origen',
                                    name:'origenprev',
                                    onClick:onClickInput$,
                                    icon:'plane-departure',
                                    required:true,
                                    value:resume.value.origenprev
                                },
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'text',
                                    label:'Destino(s)',
                                    name:'destinosprev',                                 
                                    onClick:onClickInput$,
                                    required:true,
                                    icon:'plane-arrival',
                                    value:resume.value?.destinosprev
                                }
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-5'>
                    <h3 class='text-semi-bold mb-sm-4 text-center text-dark-blue'>¿Cuándo viajas?</h3>
                    <Form
                        id='form-step-prev-1-1'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'text',
                                    label:'Desde',
                                    name:'desdeprev',
                                    required:true,
                                    icon:'calendar',
                                    onClick:onClickInput$,
                                    value:resume.value.desdeprev
                                },
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'text',
                                    label:'Hasta',
                                    name:'hastaprev',
                                    required:true,
                                    icon:'calendar',
                                    onClick:onClickInput$,
                                    value:resume.value.hastaprev
                                }
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-3'>
                    <h3 class='text-semi-bold mb-sm-4 text-center text-dark-blue'>¿Cuántos viajan?</h3>
                    <Form
                        id='form-step-prev-1-2'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-12 col-sm-12 col-xs-12 col-6',
                                    type:'text',
                                    label:'Pasajeros',
                                    name:'pasajerosprev',
                                    onClick:onClickInput$,
                                    required:true,
                                    icon:'plane-departure',   
                                    value:resume.value.pasajerosprev                            
                                },
                            ]}
                        ]}
                    />
                </div>
                </>
                }   
            </div>

            {
            isMobile.value == true&&
            <div id="modal-mobile-travel" class="modal fade modal-fullscreen-xs-down" >
                    <div class="modal-dialog" style={{height:'100% !important'}}>
                    <div class="modal-content" style={{height:'100% !important'}}>
                    <div class="modal-header">
                        <h5 class="modal-title text-semi-bold mb-sm-4 text-dark-blue" id="exampleModalLabel">¿A dónde viajas?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body" style={{height:'100% !important',maxHeight:'100% !important'}}>
                        <div class="row">
                        <Form
                        id='form-step-1-0'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'select',
                                    label:'Origen',
                                    name:'origen',
                                    options:origins.value,required:true,
                                    onChange:$((e:any) => {changeOrigin$(e)}),
                                    icon:'plane-departure',
                                    menuSize:{width:'549px', height:'394px'},
                                    value:resume.value.origen
                                },
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'select-multiple',
                                    label:'Destino(s)',
                                    name:'destinos',
                                    options:destinations.value,
                                    required:true,
                                    icon:'plane-arrival',
                                    menuSize:{width:'549px', height:'394px'},
                                    onBlur:$((e:any) => {changeDestinations$(e)}),
                                    value:resume.value.destinos
                                }
                            ]}
                        ]}
                    />
                        </div>
                    
                    </div>
                   
                    </div>
                </div>
                
            </div>
            }

            {
            isMobile.value == true&&
            <div id="modal-mobile-dates" class="modal fade modal-fullscreen-xs-down" >
                    <div class="modal-dialog" style={{height:'100% !important'}}>
                    <div class="modal-content" style={{height:'100% !important'}}>
                    <div class="modal-header">
                        <h5 class="modal-title text-semi-bold mb-sm-4 text-dark-blue" id="exampleModalLabel">¿Cuándo viajas?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body" style={{height:'100% !important',maxHeight:'100% !important'}}>
                        <div class="row">
                        <Form
                            id='form-step-1-1'
                            form={[
                                {row:[
                                    {
                                        size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                        type:'date',
                                        label:'Desde',
                                        name:'desde',
                                        min:dateStart.value,
                                        onChange:changeDateStart$,
                                        required:true,
                                        icon:'calendar',
                                        value: resume.value.desde,
                                    },
                                    {
                                        size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                        type:'date',
                                        label:'Hasta',
                                        name:'hasta',
                                        min:dateEnd.value,
                                        onChange:changeDateEnd$,
                                        required:true,
                                        icon:'calendar',
                                        value: resume.value.hasta,
                                    }
                                ]}
                            ]}
                        />
                        </div>
                    
                    </div>
                   
                    </div>
                </div>
                
            </div>
            }

            {
            isMobile.value == true&&
            <div id="modal-mobile-pax" class="modal fade modal-fullscreen-xs-down" >
                    <div class="modal-dialog" style={{height:'100% !important'}}>
                    <div class="modal-content" style={{height:'100% !important'}}>
                    <div class="modal-header">
                        <h5 class="modal-title text-semi-bold mb-sm-4 text-dark-blue" id="exampleModalLabel">¿Cuántos viajan?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body" style={{height:'100% !important',maxHeight:'100% !important'}}>
                        <div class="row">
                        <Form
                            id='form-step-1-2'
                            form={[
                                {row:[
                                    {
                                        size:'col-12',
                                        type:'paxs',
                                        name:'pasajeros',
                                        required:true,
                                        icon:'user-plus',
                                        onChange:$((e:any) => {changePax$(e)}),
                                        value:{[22]:resume.value[22]||0,[70]:resume.value[70]||0,[85]:resume.value[85]||0},
                                
                                    }
                                ]}
                            ]}
                        />
                        </div>
                    
                    </div>
                   
                    </div>
                </div>
                
            </div>
            }

        </div>
        
    )
})