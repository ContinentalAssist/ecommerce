import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import ServiceRequest from "~/utils/ServiceRequest";
import { Form } from "../form/Form";
import styles from './quotes-engine.css?inline'

export const QuotesEngine = component$(() => {
    useStylesScoped$(styles)

    const array : any[] = []

    const origins = useSignal(array)
    const destinations = useSignal(array)
    const dateStart = useSignal('')
    const dateEnd = useSignal('')

    useTask$(async() => {
        let res : {[key:string]:any[]} = {}
        const resOrigins : any[] = []
        const resDestinations : any[] = []

        await ServiceRequest('/pw_getSelectsPorDefectoCotizadorViajes',{},(response) => {
            //console.log(response)
            res = response.resultado[0]
        })
        //console.log(res)
        res.origenes.map((origen) => {
            resOrigins.push({value:origen.idpais,label:origen.nombrepais})
        })

        res.destinos.map((destino) => {
            resDestinations.push({value:destino.idpais,label:destino.nombrepais})
        })

        origins.value = resOrigins
        destinations.value = resDestinations
        // dateStart.value = new Date().toISOString().substring(0, 10)
        // dateEnd.value = new Date(new Date().setDate(new Date().getDate()+2)).toISOString().substring(0, 10)
    })

    useVisibleTask$(() => {
        dateStart.value = new Date().toISOString().substring(0, 10)
        dateEnd.value = new Date(new Date().setDate(new Date().getDate()+2)).toISOString().substring(0, 10)
    })

    const changeOrigin$ = $((e:any) => {
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement
        const inputDestinations = form.querySelector('#form-step-1-0-select-0-1') as HTMLInputElement
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
        
        const dropdownDestinations = new bs.Dropdown('#'+inputDestinations.id,{})
        dropdownDestinations.show()
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
    })

    const changeDateEnd$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement

        dateEnd.value = inputDateEnd.value
    })

    return(
        <div class='container' id='quotes-engine'>
            <div class='row'>
                <div class='col-lg-4'>
                    <h4 class='text-semi-bold mb-sm-4'>¿A dónde viajas?</h4>
                    <Form
                        id='form-step-1-0'
                        form={[
                            {row:[
                                {size:'col-lg-6 col-sm-6 col-xs-6',type:'select',label:'Origen',name:'origen',options:origins.value,required:true,onChange:$((e:any) => {changeOrigin$(e)})},
                                {size:'col-lg-6 col-sm-6 col-xs-6',type:'select-multiple',label:'Destino(s)',name:'destinos',options:destinations.value,required:true}
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-5'>
                    <h4 class='text-semi-bold mb-sm-4'>¿Cuándo viajas?</h4>
                    <Form
                        id='form-step-1-1'
                        form={[
                            {row:[
                                {size:'col-lg-6 col-sm-6 col-xs-6',type:'date',label:'Desde',name:'desde',min:dateStart.value,onChange:changeDateStart$,required:true},
                                {size:'col-lg-6 col-sm-6 col-xs-6',type:'date',label:'Hasta',name:'hasta',min:dateEnd.value,onChange:changeDateEnd$,required:true}
                            ]}
                        ]}
                    />
                </div>
                <div class='col-lg-3'>
                    <h4 class='text-semi-bold mb-sm-4'>¿Cuántos viajan?</h4>
                    <Form
                        id='form-step-1-2'
                        form={[
                            {row:[
                                {size:'col-lg-12',type:'paxs',name:'pasajeros',required:true}
                            ]}
                        ]}
                    />
                </div>
            </div>
        </div>
    )
})