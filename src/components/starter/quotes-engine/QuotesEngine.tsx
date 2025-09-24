import { $, component$, useContext,useSignal, useStyles$, useTask$,Fragment,Signal} from "@builder.io/qwik";
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { Form } from "../form/Form";
import styles from './quotes-engine.css?inline'
import { WEBContext } from "~/root";
import { LoadingContext } from "~/root";
import dayjs from "dayjs";
export interface propsQE {
    modeResumeStep: Signal<boolean>,
    headerStep:boolean
}

export const QuotesEngine = component$((props:propsQE) => {
    useStyles$(styles)

    const array : any[] = []
    const stateContext = useContext(WEBContext)
    const origins = useSignal(array)
    const destinations = useSignal(array)
    const planSelect = useSignal(array)
    const dateEnd = useSignal('')
    const object : {[key:string]:any} = {}
    const resume = useSignal(object)
    const inputStart =useSignal({min:'', max:'',open:false})
    const inputEnd =useSignal({min:'', max:'',open:false})
    const { modeResumeStep } = props;
    const navigate = useNavigate()
    const location = useLocation()
    const idPlan = useSignal(0)
    const updateInputEnd = $((newMin: string, newMax: string) => {
        inputEnd.value = { ...inputEnd.value, min: newMin, max: newMax, open:true };
      });
    const contextLoading = useContext(LoadingContext)


    useTask$(async() => {
        let res : {[key:string]:any[]} = {}
        const resOrigins : any[] = []
        const resDestinations : any[] = []

        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPlansBenefits", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})});
        const data =await response.json();
        if (!data.error) {
            stateContext.value.planDefault =await data.resultado;               
            // Transformar el array lista de planes
            const planesSelect = data.resultado.map((plan:any) => ({
                label: plan.nombreplan,
                value: plan.idplan
            }));
            planSelect.value = planesSelect
        }
    
          
        const resDefaults = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getDefaults",{method:"GET"});
        const dataDefaults = await resDefaults.json()
        res = dataDefaults.resultado[0]
        if (res && res.origenes  && res.destinos) {
            res.origenes.map((origen) => {
                resOrigins.push({value:origen.idpais,label:origen.nombrepais})
            })
    
            res.destinos.map((destino) => {
                resDestinations.push({value:destino.idpais,label:destino.nombrepais})
            })
    
        }          
        origins.value = resOrigins
        destinations.value = resDestinations
        resume.value = stateContext.value
        
        const inputDateStart=dayjs().add(2,'day').format('YYYY/MM/DD');
        const inputDateEnd=dayjs().add(365,'day').format('YYYY/MM/DD');
        inputStart.value.min = dayjs().format('YYYY/MM/DD')
        updateInputEnd(inputDateStart,inputDateEnd)
    })


    const changeOrigin$ = $((e:any) => {        
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement

        if (stateContext.value.isMobile == true &&modeResumeStep.value=== false) {
            const formPrev = document.querySelector('#form-step-prev-1-0') as HTMLFormElement
            const inputPrevOrigin = formPrev.querySelector('#form-step-prev-1-0-input-0-0') as HTMLInputElement
            inputPrevOrigin.value = e.label;
        }
        
    })

    const changeDateStart$ = $((range: {start: string, end: string}) => {
        const inputDateStart = dayjs(range.start).add(2, 'day').format('YYYY/MM/DD');
        const inputDateEnd = dayjs(range.start).add(365, 'day').format('YYYY/MM/DD');
        updateInputEnd(inputDateStart, inputDateEnd);

        if (stateContext.value.isMobile) {
            const formPrev = document.querySelector('#form-step-prev-1-1') as HTMLFormElement
            const inputPrevDateStart = formPrev.querySelector('#form-step-prev-1-1-input-0-0') as HTMLInputElement
            inputPrevDateStart.value = range.start || '';
        }
    });


    const changeDateEnd$ = $(() => {
        const form = document.querySelector('#form-step-1-1') as HTMLFormElement
        const inputDateEnd = form.querySelector('input[name=hasta]') as HTMLInputElement
        const formatDateEnd = inputDateEnd.value.replaceAll('-','/')

        dateEnd.value = inputDateEnd.value

        if (stateContext.value.isMobile == true) {
            const formPrev = document.querySelector('#form-step-prev-1-1') as HTMLFormElement
            const inputPrevDateEnd = formPrev.querySelector('#form-step-prev-1-1-input-0-1') as HTMLInputElement
            inputPrevDateEnd.value = String(formatDateEnd);
        }
    })

    const onClickInput$ =$((e:any)=>{
        const bs = (window as any)['bootstrap']
        const name =e.target.name
       // Create a new MouseEvent object
        const clickEvent = new MouseEvent('click', {
            bubbles: true, // Whether the event should bubble up through the DOM
            cancelable: true, // Whether the event's propagation can be canceled
            view: window // The Window object to associate with the event
        });

       if (name =='origenprev'||name =='destinosprev') {

        const modal = new bs.Modal(document.getElementById('modal-mobile-travel'));
        modal.show();
       /*  const modal = new bs.Modal('#modal-mobile-travel',{})
        modal.show() */
        if (name =='origenprev') {
            const form = document.querySelector('#form-step-1-0') as HTMLFormElement
            const inputOrigin = form.querySelector('#form-step-1-0-select-0-0') as HTMLInputElement
            if (inputOrigin) {
                setTimeout(() => {
                        inputOrigin.dispatchEvent(clickEvent)
                        inputOrigin.focus();
                }, 200);
            
            }
           }

        if (name =='destinosprev') {
            const form = document.querySelector('#form-step-1-0') as HTMLFormElement
            const inputDestinations = form.querySelector('#form-step-1-0-select-0-1') as HTMLInputElement
            if (inputDestinations) {
                setTimeout(() => {
                   /*  inputDestinations.dispatchEvent(clickEvent)
                    inputDestinations.focus(); */
                }, 200);
            
            }
        }   
       }
       

       
        
       /* if (name =='desdeprev'||name =='hastaprev') {
        const modal = new bs.Modal('#modal-mobile-dates',{})
        modal.show()
       } */

       if (name =='pasajerosprev') {
        const modal = new bs.Modal('#modal-mobile-pax',{})
        modal.show()

       
        const form = document.querySelector('#form-step-1-2') as HTMLFormElement
            const inputPax = form.querySelector('#form-step-1-2-input-0-0') as HTMLInputElement
            if (inputPax) {
                setTimeout(() => {
                    inputPax.dispatchEvent(clickEvent)
                    //inputDestinations.focus();
                }, 200);
            
            }
       }

       
          
    })

    const changeDestinations$=$((e:any)=>{
        if (stateContext.value.isMobile) {
            const formPrev = document.querySelector('#form-step-prev-1-0') as HTMLFormElement
            const inputPrevDestination = formPrev.querySelector('#form-step-prev-1-0-input-0-1') as HTMLInputElement
            inputPrevDestination.value = e.label.join(",");
        }        
    })

    const changePax$=$((e:any)=>{
        if (stateContext.value.isMobile) {
            const formPrev = document.querySelector('#form-step-prev-1-2') as HTMLFormElement
            const inputPrevPax = formPrev.querySelector('#form-step-prev-1-2-input-0-0') as HTMLInputElement
            inputPrevPax.value = e.label;
        } 
        
    })

    const closeInputDestination$=$(()=>{
        const form = document.querySelector('#form-step-1-0') as HTMLFormElement
        const inputDestinations = form.querySelector('#form-step-1-0-select-0-1') as HTMLInputElement
   
        const bs = (window as any)['bootstrap']
        const dropdownOrigin = bs.Dropdown.getInstance('#dropdown-toggle-'+inputDestinations.id,{})
        if (dropdownOrigin != null) {
            dropdownOrigin.hide()
        }
        
    })


    const changePlan$ = $((e:any) => {
       /*  const form = document.querySelector('#form-step-1-3') as HTMLFormElement
        const inputPlan = form.querySelector('#form-step-1-3-select-0-0') as HTMLInputElement
      */
        idPlan.value = e.value
      
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
                // NO remover readonly de campos paxs para evitar conflictos con GTM
                if ((input as HTMLInputElement).readOnly == true && 
                    !input.classList.value.includes('form-paxs')) {
                    (input as HTMLInputElement).removeAttribute('readonly');
                }
                
                // Validación para selects
                if(input.classList.value.includes('form-control-select') && 
                ((input as HTMLInputElement).required === true) && 
                ((input as HTMLInputElement).value === ''))
                {
                    (input as HTMLInputElement).classList.add('is-invalid')
                    error[0] = true
                }
                // Validación para campos paxs
                else if(input.classList.value.includes('form-paxs') && 
                        ((input as HTMLInputElement).required === true))
                {
                    // Obtener el valor del data-value que contiene el JSON con los pasajeros
                    const dataValue = (input as HTMLInputElement).dataset.value;
                    if (!dataValue || dataValue === '{}') {
                        (input as HTMLInputElement).classList.add('is-invalid')
                        error[2] = true
                    } else {
                        try {
                            const paxData = JSON.parse(dataValue);
                            const totalPax = (paxData[23] || 0) + (paxData[75] || 0) + (paxData[85] || 0);
                            if (totalPax === 0) {
                                (input as HTMLInputElement).classList.add('is-invalid')
                                error[2] = true
                            } else {
                                (input as HTMLInputElement).classList.remove('is-invalid');
                                (input as HTMLInputElement).classList.add('is-valid')
                            }
                        } catch (e) {
                            (input as HTMLInputElement).classList.add('is-invalid')
                            error[2] = true
                        }
                    }
                }
                // ← NUEVA: Validación para date range picker
                else if(input.classList.value.includes('form-date-range') && 
                        ((input as HTMLInputElement).required === true))
                {
                    const startDate = (input as HTMLInputElement).dataset.start;
                    const endDate = (input as HTMLInputElement).dataset.end;
                    
                    // Validar que ambas fechas estén presentes
                    if(!startDate || !endDate || startDate === '' || endDate === '') {
                        (input as HTMLInputElement).classList.add('is-invalid')
                        error[3] = true // Nuevo índice de error para date ranges
                    } else {
                        (input as HTMLInputElement).classList.remove('is-invalid');
                        (input as HTMLInputElement).classList.add('is-valid')
                    }
                }
                // Validación para campos con valor
                else if((input as HTMLInputElement).value != '')
                {
                    (input as HTMLInputElement).classList.remove('is-invalid');
                    (input as HTMLInputElement).classList.add('is-valid')
                }
                // Campos vacíos
                else {
                    (input as HTMLInputElement).classList.remove('is-invalid', 'is-valid');
                }
            })
            
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
            //loading.value = true
            contextLoading.value = {status:true, message:'Esperando respuesta...'}
            inputs.map((input) => {
                
                if ((input as HTMLInputElement).name)
                {
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
                }
            })


            const destinos = newDataForm.destinos.filter((item:any) => item !== '')

            newDataForm.destinos = destinos

            newDataForm.dias = dayjs(newDataForm.hasta).diff(dayjs(newDataForm.desde), 'day') + 1;
            
            if (newDataForm.dias > 120) {
                // Mostrar modal de error
                const bs = (window as any)['bootstrap'];
                const modal = new bs.Modal('#modal-date-range-validation', {});
                modal.show();
                
                // Detener el loading
                contextLoading.value = {status: false, message: ''};
                
                // No continuar con el proceso
                return;
            }
            
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

            newDataForm.origen = Number(newDataForm.origen);
            // newDataForm.destinos = newDataForm.destinos;


            newDataForm.desde= dayjs(newDataForm.desde).format('YYYY-MM-DD');
            newDataForm.hasta= dayjs(newDataForm.hasta).format('YYYY-MM-DD');
 
            if(newDataForm.edades.length > 0)
            {                
                newDataForm.planfamiliar = (newDataForm[23] > 0 && newDataForm[23] <= 4 && newDataForm[75] == 2 && newDataForm[85] == 0)?'t':'f'

              
                
                    stateContext.value = Object.assign(stateContext.value,newDataForm)
                    const dataForm : {[key:string]:any} = {}
               
                
                    Object.assign(dataForm,stateContext?.value)
                    let error = false
                    if (location.url.pathname == '/') {
                        stateContext.value = {...stateContext.value,...newDataForm}
                        newDataForm.planfamiliar == 't' && modal.show();
                        await navigate('/quotes-engine/step-1')
                        
                    }
                    else {

      
                    // Validar que todos los datos necesarios estén presentes
                    if (!stateContext.value.resGeo || !stateContext.value.resGeo.ip_address) {
                        console.error('Datos de geolocalización faltantes:', stateContext.value.resGeo);
                        contextLoading.value = {status: false, message: ''};
                        return;
                    }

                    if (!newDataForm.edades || newDataForm.edades.length === 0) {
                        console.error('Datos de edades faltantes:', newDataForm.edades);
                        contextLoading.value = {status: false, message: ''};
                        return;
                    }

                    if (!newDataForm.origen || !newDataForm.destinos || newDataForm.destinos.length === 0) {
                        console.error('Datos de origen/destino faltantes:', {origen: newDataForm.origen, destinos: newDataForm.destinos});
                        contextLoading.value = {status: false, message: ''};
                        return;
                    }

                    const newBody = {
                        edades:newDataForm.edades,                            
                        origen: newDataForm.origen,
                        destinos: newDataForm.destinos,
                        dias: newDataForm.dias,
                        planfamiliar: newDataForm.planfamiliar,
                        idfuente: 2,
                        resGeo:stateContext.value.resGeo
                    }
                    
                    console.log('Enviando datos de cotización:', newBody);
                    
                    const resPlans = await fetch("/api/getPlansPrices", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBody)});
                    
                    if (!resPlans.ok) {
                        console.error('Error HTTP:', resPlans.status, resPlans.statusText);
                        contextLoading.value = {status: false, message: ''};
                        return;
                    }
                    
                    const dataPlans = await resPlans.json()
                    console.log('Respuesta del servidor:', dataPlans);

                    if (dataPlans.error) {
                        console.error('Error en la respuesta del servidor:', dataPlans);
                        contextLoading.value = {status: false, message: ''};
                        return;
                    }
                    
                    error = dataPlans.error
                    stateContext.value.precioPlanes= []

                       
                        if(error == false&&dataPlans.resultado.length > 0)
                        {
                            modeResumeStep.value = true

                            //SE AÑADEN PLANES PRECIOS    
                            const resultado =stateContext.value.planDefault.map((item:any)=>{
                                const coincidente = dataPlans.resultado.find((c:any)=> c.idplan === item.idplan);
                                return coincidente ? coincidente : item;
                            })

                            newDataForm.precioPlanes= resultado
                            if ('plan' in stateContext.value)
                            {
                                
                                if (idPlan.value != 0 && idPlan.value != stateContext.value.plan.idplan) {
                                    const planSelected = dataPlans.resultado.find((c:any)=> c.idplan === idPlan.value);
                                    newDataForm.plan = {};
                                    newDataForm.plan = planSelected;
                                    
                                }else{
                                    const planSelected = dataPlans.resultado.find((c:any)=> c.idplan === stateContext.value.plan.idplan);
                                    newDataForm.plan = {};
                                    newDataForm.plan = planSelected;
                                    
                                }
                                
                            }
                            
                            const today = new Date();
                            let suma =0;
                          
                                                
                            if (
                                location.url.pathname == '/quotes-engine/step-2/'||
                                location.url.pathname == '/quotes-engine/step-3/' || 
                                location.url.pathname == '/quotes-engine/step-4/'
                            )
                            {
                                // Iterar sobre los pasajeros
                                newDataForm.plan?.adicionalesdefault&&newDataForm.plan.adicionalesdefault.forEach((pax: any, index: number) => {
                                    let min, max;
                                    const idpasajero = index + 1;

                                    // Verificar si ya existe un asegurado con el mismo idpasajero y edad
                                    const existePax = stateContext.value?.asegurados.find(
                                        (a: any) => a.idpasajero === idpasajero && a.edad === pax.edad
                                    );

                                    // Calcular las fechas mínimas y máximas según la edad
                                    if (pax.edad >= 24 && pax.edad <= 75) {
                                        min = dayjs(today).subtract(24, 'year').format("YYYY-MM-DD");
                                        max = dayjs(today).subtract(75, 'year').format("YYYY-MM-DD");
                                    } else if (pax.edad >= 76 && pax.edad <= 85) {
                                        min = dayjs(today).subtract(76, 'year').format("YYYY-MM-DD");
                                        max = dayjs(today).subtract(85, 'year').format("YYYY-MM-DD");
                                    } else {
                                        min = dayjs(today).subtract(0, 'year').format("YYYY-MM-DD");
                                        max = dayjs(today).subtract(23, 'year').format("YYYY-MM-DD");
                                    }
                                    

                                    // Si el pasajero ya existe, copiar sus datos
                                    if (existePax) {


                                        const beneficiosSeleccionados = existePax.beneficiosadicionalesSeleccionados.map((seleccionado:any) => {
                                            // Buscar el objeto correspondiente en el segundo array
                                            const beneficioadicionales = pax.beneficiosadicionales.find((beneficio:any) => beneficio.idbeneficioadicional === seleccionado.idbeneficioadicional);
                                            
                                            // Si se encuentra, actualizar los valores, de lo contrario, devolver el original
                                            return beneficioadicionales?{ ...seleccionado, ...beneficioadicionales }:seleccionado;
                                        });
                                    const paxBeneficio= pax.beneficiosadicionales.map((beneficio:any) => {                                        
                                            // Buscar el objeto correspondiente en el segundo array
                                            const beneficioadicionales = existePax.beneficiosadicionalesSeleccionados.find((seleccionado:any) => seleccionado.idbeneficioadicional === beneficio.idbeneficioadicional);
                                            // Si se encuentra, actualizar los valores, de lo contrario, devolver el original
                                            return { ...beneficio, seleccionado: beneficioadicionales? beneficioadicionales.seleccionado:false };
                                        });
                                        
                                        suma += beneficiosSeleccionados.reduce((sum: number, value: any) => {    
                                            return sum +  Number(value.precio);
                                            }, 0) 
                                        Object.assign(pax, {
                                            apellidos: existePax.apellidos,
                                            beneficiosadicionalesSeleccionados: beneficiosSeleccionados,
                                            beneficiosadicionales: paxBeneficio,
                                            correo: existePax.correo,
                                            documentacion: existePax.documentacion,
                                            fechanacimiento: existePax.fechanacimiento,
                                            maxDate: existePax.maxDate,
                                            minDate: existePax.minDate,
                                            nombres: existePax.nombres,
                                            telefono: existePax.telefono,
                                            idpasajero: idpasajero,
                                        });
                                    } else {
                                        // Si no existe, inicializar los datos del pasajero
                                        Object.assign(pax, {
                                            minDate: max,
                                            maxDate: min,
                                            idpasajero: idpasajero,
                                            beneficiosadicionales: pax.beneficiosadicionales,
                                            beneficiosadicionalesSeleccionados: [],
                                        });
                                    }
                                });
                                newDataForm.asegurados= newDataForm.plan?.adicionalesdefault;
                                newDataForm.total =  {
                                    divisa: stateContext.value.plan?.codigomonedapago,
                                    total: suma+Number(newDataForm.plan?.precio_grupal)
                                }

                            }
                           
                                
                                

                            stateContext.value = {...stateContext.value,...newDataForm}
                            resume.value = stateContext.value
                            
                            newDataForm.planfamiliar == 't' && modal.show();
                        
                            
                            if (stateContext.value?.plan?.idplan !== undefined) {
                                if (location.url.pathname == '/quotes-engine/step-2/'||
                                    location.url.pathname == '/quotes-engine/step-3/' || 
                                    location.url.pathname == '/quotes-engine/step-4/'                                     
                                    &&newDataForm.edades.length>0 &&stateContext.value.edades.length>0) 
                                {                               
                                
                                    await navigate('/quotes-engine/step-2');
                                
                                }else{
                                    await navigate('/quotes-engine/step-1/');
                                }                  
                            }else{
                                await navigate('/quotes-engine/step-1/');
                            }   
                                        
                            
                        }                            
                        else
                        {
                            stateContext.value.precioPlanes= []
                            //loading.value = false
                            await navigate('/quotes-engine/step-1/');
                        }

                    
                    
                   
                }
            }
        }
        contextLoading.value = {status:false, message:''}
    })

    const getCancelQuotes$ = $(() => {

             
        modeResumeStep.value = true;
        
    })
        
    return(
        <div class='container' id='quotes-engine'>
            {
                modeResumeStep.value=== true?
                <Fragment>
                    {/* Versión Desktop */}
                    <div class='d-none d-lg-block'>
                        <div class='row justify-content-between align-items-center'>
                            {/* Origen */}
                            <div class='summary-item-divider' style={{width: '15%'}}>
                                <div class="input-group">
                                    <span class="input-group-text border border-0 bg-white" style={{padding: '0.375rem 0.5rem'}}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png" alt="Avión" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                    </span>
                                    <div class="form-floating">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            class="form-control-plaintext text-medium text-dark-blue ps-0" 
                                            id="origen" 
                                            placeholder="Origen"
                                            value={stateContext.value.paisorigen || ''}
                                        />
                                        <label class='text-medium text-dark-gray ps-0' htmlFor="origen">Origen</label>
                                    </div>
                                </div>
                            </div>

                            {/* Destino */}
                            <div class='summary-item-divider' style={{width: '15%'}}>
                                <div class="input-group">
                                    <span class="input-group-text border border-0 bg-white" style={{padding: '0.375rem 0.5rem'}}>
                                    <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-to.png" alt="Avión" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                    </span>
                                    <div class="form-floating">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            class="form-control-plaintext text-medium text-dark-blue ps-0" 
                                            id="destino" 
                                            placeholder="Destino"
                                            value={Array.isArray(stateContext.value.paisesdestino) ? String(stateContext.value.paisesdestino).replaceAll(',',', ') : (stateContext.value.paisesdestino || '')}
                                        />
                                        <label class='text-medium text-dark-gray ps-0' htmlFor="destino">Destino</label>
                                    </div>
                                </div>
                            </div>

                            {/* Fechas de tu viaje (rango) */}
                            <div class='summary-item-divider' style={{width: '25%'}}>
                                <div class="input-group">
                                    <span class="input-group-text border border-0 bg-white" style={{padding: '0.375rem 0.5rem'}}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                    </span>
                                    <div class="form-floating">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            class="form-control-plaintext text-medium text-dark-blue ps-0" 
                                            id="fechas" 
                                            placeholder="Fechas de tu viaje"
                                            value={stateContext.value.desde != undefined ? 
                                                `${stateContext.value.desde} al ${stateContext.value.hasta}`
                                                : ''
                                            }
                                        />
                                        <label class='text-medium text-dark-gray ps-0' htmlFor="fechas">Fechas de tu viaje</label>
                                    </div>
                                </div>
                            </div>

                            {/* Viajeros */}
                            <div class='summary-item-divider' style={{width: '15%'}}>
                                <div class="input-group">
                                    <span class="input-group-text border border-0 bg-white" style={{padding: '0.375rem 0.5rem'}}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-passengers.png" alt="Usuario" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                    </span>
                                    <div class="form-floating">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            class="form-control-plaintext text-medium text-dark-blue ps-0" 
                                            id="viajeros" 
                                            placeholder="Viajeros"
                                            value={stateContext.value.pasajeros}
                                        />
                                        <label class='text-medium text-dark-gray ps-0' htmlFor="viajeros">Viajeros</label>
                                    </div>
                                </div>
                            </div>

                            {/* Plan seleccionado (no en step-1) */}
                            {location.url.pathname != '/quotes-engine/step-1/' && (
                                <div class='summary-item-divider' style={{width: '15%'}}>
                                    <div class="input-group">
                                        <span class="input-group-text border border-0 bg-white" style={{padding: '0.375rem 0.5rem'}}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plan.png" alt="Editar" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}/>
                                        </span>
                                        <div class="form-floating">
                                            <input 
                                                type="text" 
                                                readOnly 
                                                class="form-control-plaintext text-medium text-dark-blue ps-0" 
                                                id="plan" 
                                                placeholder="Plan"
                                                value={stateContext.value.plan?.nombreplan}
                                            />
                                            <label class='text-medium text-dark-gray ps-0' htmlFor="plan">Plan</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Editar */}
                            {location.url.pathname != '/quotes-engine/step-4/' &&
                             location.url.pathname != '/quotes-engine/message/' && (
                                <div class='text-end' style={{width: '10%'}}>
                                    <button type='button' class='btn btn-link text-medium text-dark-blue d-flex align-items-center' onClick$={()=>modeResumeStep.value = false}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-edit.png" alt="Editar" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}/>
                                        Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Versión Mobile */}
                    <div class='d-lg-none'>
                        {/* Primera Row: Origen-Destino (6 cols) y Plan (6 cols) */}
                        <div class='row align-items-center mb-3'>
                            {/* Origen y Destino */}
                            <div class='col-8 d-flex align-items-center'>
                                <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png" alt="Avión" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                <span class='text-dark-blue fw-bold' style={{fontSize: '0.90rem'}}>
                                    {stateContext.value.paisorigen || ''} - {Array.isArray(stateContext.value.paisesdestino) ? String(stateContext.value.paisesdestino).replaceAll(',',', ') : (stateContext.value.paisesdestino || '')}
                                </span>
                            </div>
                            
                            {/* Plan */}
                            <div class='col-4 text-end'>
                                {location.url.pathname != '/quotes-engine/step-1/' && (
                                    <span class='text-light-blue fw-bold' style={{fontSize: '0.90rem'}}>
                                        {stateContext.value.plan?.nombreplan || 'plan no seleccionado'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Separador HR */}
                        <hr />

                        {/* Segunda Row: Fechas (5 cols), Pasajeros (3 cols), Editar (4 cols) */}
                        <div class='row align-items-center'>
                            {/* Fechas */}
                            <div class='col-8 d-flex align-items-center'>
                                <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                <span class='text-dark-blue fw-bold' style={{fontSize: '0.90rem'}}>
                                    {stateContext.value.desde != undefined ? 
                                        `${stateContext.value.desde} - ${stateContext.value.hasta}`
                                        : ''
                                    }
                                </span>
                            </div>

                            {/* Pasajeros */}
                            <div class='col-2 d-flex align-items-center pe-0'>
                                <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-passengers.png" alt="Usuario" style={{width: '1.2rem', height: '1.2rem', marginRight: '0.5rem'}}/>
                                <span class='text-dark-blue fw-bold' style={{fontSize: '0.90rem'}}>
                                    {typeof stateContext.value.pasajeros === 'string' ? 
                                        stateContext.value.pasajeros.split(' ')[0] : 
                                        stateContext.value.pasajeros
                                    }
                                </span>
                            </div>

                            {/* Editar */}
                            {location.url.pathname != '/quotes-engine/step-4/' &&
                             location.url.pathname != '/quotes-engine/message/' && (
                                <div class='col-2 text-end'>
                                    <button type='button' class='btn btn-link text-dark-blue d-flex align-items-center justify-content-end' style={{fontSize: '0.75rem', textDecoration: 'underline'}} onClick$={()=>modeResumeStep.value = false}>
                                        <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-edit.png" alt="Editar" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </Fragment>
                :
                <div class='row'>
                    {!stateContext.value.isMobile && (
                        <>
                            <div class='col-lg-5'>
                                {location.url.pathname == '/' && (
                                    <h4 class='mb-sm-4 text-dark-blue'>¿A dónde viajas?</h4>
                                )}
                                <Form
                                    id='form-step-1-0'
                                    form={[
                                        {row:[
                                            {
                                                size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                type:'destinos-select',
                                                label:'Origen',
                                                name:'origen',
                                                options:origins.value,
                                                required:true,
                                                onChange:$((e:any) => {changeOrigin$(e)}),
                                                icon:'plane-departure',
                                                value: resume?.value?.origen,
                                                placeholder: "Ingrese país de origen"  // Añade esto para personalizar el placeholder
                                            },
                                            {
                                                size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                type:'destinos-select-multiple',
                                                label:'Destino(s)',
                                                name:'destinos',
                                                options:destinations.value,
                                                required:true,
                                                icon:'plane-arrival',
                                                value: resume.value.destinos,
                                            }
                                        ]}
                                    ]}
                                />
                            </div>
                            <div class='col-lg-4'>
                            {location.url.pathname == '/' && (
                                <h4 class='mb-sm-4 text-dark-blue'>¿Cuándo viajas?</h4>
                            )}
                                <Form
                                    id='form-step-1-1'
                                    form={[
                                        {row:[
                                            {
                                                size:'col-lg-12 col-sm-12 col-xs-12 col-12',
                                                type:'date-range',
                                                label:'Rango de fechas',
                                                name:'rango-fechas',
                                                min: inputStart.value.min,
                                                max: inputEnd.value.max,
                                                onChange: $((e:any) => {changeDateStart$(e)}),
                                                required: true,
                                                icon: 'calendar',
                                                value: stateContext.value.desde ? {
                                                    start: stateContext.value.desde,
                                                    end: stateContext.value.hasta
                                                } : undefined,
                                                onFocus: $(() => {closeInputDestination$()}),
                                            }
                                        ]}
                                    ]}
                                />
                            </div>
                            <div class='col-lg-3'>
                            {location.url.pathname == '/' && (
                                <h4 class='mb-sm-4 text-dark-blue'>¿Cuántos viajan?</h4>
                            )}
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
                                                value:{[23]:stateContext.value[23]||0,[75]:stateContext.value[75]||0,[85]:stateContext.value[85]||0},
                                            }
                                        ]}
                                    ]}
                                />
                            </div>
                            {location.url.pathname != '/' &&
                             location.url.pathname != '/quotes-engine/step-1/' && (
                                <div class='col-lg-6'>
                                    <Form
                                        id='form-step-1-3'
                                        form={[
                                            {row:[
                                                {
                                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                    type:'select',
                                                    label:'Plan',
                                                    name:'planseleccionado',
                                                    options:planSelect.value,
                                                    required:true,
                                                    onChange:$((e:any) => {changePlan$(e)}),
                                                    icon:'fa-solid fa-clipboard-check',
                                                    value: stateContext.value?.plan?.idplan,
                                                }
                                            ]}
                                        ]}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {stateContext.value.isMobile && (
                        <>
                            <div class='col-lg-4'>
                                {location.url.pathname == '/' && (
                                    <h3 class='mb-sm-4 text-center text-dark-blue'>¿A dónde viajas?</h3>
                                )}
                                <Form
                                    id='form-step-prev-1-0'
                                    form={[
                                        {row:[
                                            {
                                                size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                type:'text',
                                                label:'Origen',
                                                placeholder:'Origen',
                                                name:'origenprev',
                                                onClick:onClickInput$,
                                                icon:'plane-departure',
                                                required:true,
                                                value:resume.value.origenprev,
                                                readOnly:true,
                                            },
                                            {
                                                size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                type:'text',
                                                label:'Destino(s)',
                                                placeholder:'Ingrese su destino',
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
                                {location.url.pathname == '/' && (
                                    <h3 class='mb-sm-4 text-center text-dark-blue'>¿Cuándo viajas?</h3>
                                )}
                                <Form
                                    id='form-step-prev-1-1'
                                    form={[
                                        {row:[
                                            {
                                                size:'col-lg-12 col-sm-12 col-xs-12 col-12',
                                                type:'date-range',
                                                label:'Rango de fechas',
                                                placeholder:'Rango de fechas',
                                                name:'rango-fechas-prev',
                                                required:true,
                                                icon:'calendar',
                                                min: inputStart.value.min,
                                                max: inputEnd.value.max,
                                                onClick:onClickInput$,
                                                value: stateContext.value.desde ? {
                                                    start: stateContext.value.desde,
                                                    end: stateContext.value.hasta
                                                } : undefined,
                                                readOnly:true,
                                            }
                                        ]}
                                    ]}
                                />
                            </div>
                            <div class='col-lg-3'>
                                {location.url.pathname == '/' && (
                                    <h3 class='mb-sm-4 text-center text-dark-blue'>¿Cuántos viajan?</h3>
                                )}
                                <Form
                                    id='form-step-prev-1-2'
                                    form={[
                                        {row:[
                                            {
                                                size:'col-lg-12 col-sm-12 col-xs-12 col-6',
                                                type:'text',
                                                label:'Pasajeros',
                                                placeholder:'Pasajeros',
                                                name:'pasajerosprev',
                                                onClick:onClickInput$,
                                                required:true,
                                                icon:'plane-departure',   
                                                value:resume.value.pasajerosprev,
                                                readOnly:true,                          
                                            },
                                        ]}
                                    ]}
                                />
                            </div>

                            {location.url.pathname != '/' &&
                             location.url.pathname != '/quotes-engine/step-1/' && (
                                <div class='col-lg-6'>
                                    <Form
                                        id='form-step-1-3'
                                        form={[
                                            {row:[
                                                {
                                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                                    type:'select',
                                                    label:'Plan',
                                                    name:'prevplanseleccionado',
                                                    options:planSelect.value,
                                                    required:true,
                                            onChange:$((e:any) => {changePlan$(e)}),
                                            icon:'fa-solid fa-clipboard-check',
                                            value: stateContext.value?.plan?.idplan,
                                        }
                                    ]}
                                ]}
                            />
                        </div>
                            )}
                        </>
                    )}   

                    
                    
                         <div class='row justify-content-center mt-2 '>
                        {modeResumeStep.value === false && location.url.pathname != '/' && (
                            <div class='col-lg-2 col-sm-4 col-10'>
                                <div class='d-grid gap-2'>
                                    <button type='button' class='btn btn-cancelar-edit btn-lg text-medium' onClick$={getCancelQuotes$}>Cancelar</button>
                                </div>
                            </div>
                        )}
                             <div class='col-lg-2 col-sm-4 col-10 mb-2 mb-sm-0'>
                                 <div class='d-grid gap-2'>
                                     <button type='button' class='btn btn-primary btn_cotizar_1' onClick$={getQuotesEngine$}>Cotizar</button>
                                 </div>
                             </div>
                         </div>
                    
                </div>
            }
            

            {stateContext.value.isMobile && (
            <div id="modal-mobile-travel" class="modal fade " tabIndex={-1} data-bs-backdrop="true" aria-hidden="true" >
                    <div class="modal-dialog modal-fullscreen-xs-down" style={{height:'100% !important'}}>
                    <div class="modal-content" style={{height:'100% !important'}}>
                    <div class="modal-header">
                   
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body" style={{height:'100% !important',maxHeight:'100% !important'}}>
                        <div class="row">
                        <h5 class="modal-title text-semi-bold mb-sm-4 text-dark-blue" id="exampleModalLabel">¿A dónde viajas?</h5>
                        <br/>
                        <br/>
                        <Form
                        id='form-step-1-0'
                        form={[
                            {row:[
                                {
                                    size:'col-lg-6 col-sm-6 col-xs-12 col-6',
                                    type:'destinos-select',
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
                                    type:'destinos-select-multiple',
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
                    <div class="modal-footer mx-auto"   style={{width:'100% !important'}}>
                    <button type='button' class='btn btn-primary mx-auto mt-3 mb-5' data-bs-dismiss="modal" aria-label="Close" >Siguiente</button>
                    </div>
                   
                    </div>
                </div>
                
            </div>
            )}


            {stateContext.value.isMobile && (
            <div id="modal-mobile-pax" class="modal fade modal-fullscreen-xs-down" >
                    <div class="modal-dialog" style={{height:'100% !important'}}>
                    <div class="modal-content" style={{height:'100% !important'}}>
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                         style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body" style={{height:'100% !important',maxHeight:'100% !important'}}>
                        <div class="row">
                        <h5 class="modal-title text-semi-bold mb-sm-4 text-dark-blue" id="exampleModalLabel">¿Cuántos viajan?</h5>
                        <br/>
                        <br/>
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
                                        value:{[23]:resume.value[23]||0,[75]:resume.value[75]||0,[85]:resume.value[85]||0},
                                        readOnly:true
                                    }
                                ]}
                            ]}
                        />
                        </div>
                    
                    </div>
                    <div class="modal-footer mx-auto" style={{width:'100% !important'}}>
                    <button type='button' class='btn btn-primary mx-auto mt-3 mb-5' data-bs-dismiss="modal" aria-label="Close" onClick$={getQuotesEngine$} >Siguiente</button>
                    </div>
                   
                    </div>
                </div>
                
            </div>
            )}



            <div id="modal-date-range-validation" class="modal fade" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-0 pb-0">
                    <div class="d-flex align-items-center justify-content-center w-100">
                        <h5 class="modal-title text-dark-blue fw-semibold mb-0 text-center">
                            Rango de fechas inválido
                        </h5>
                    </div>
                </div>
                <div class="modal-body text-center py-4">
                    <div class="mb-4">
                    <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                        style="width: 80px; height: 80px;">
                        <i class="fa-solid fa-triangle-exclamation text-warning fa-2x"></i>
                    </div>
                    <p class="text-dark fs-5 mb-0 lh-base">
                        Su cotización no puede superar los <strong class="text-primary">120 días</strong>
                    </p>
                    <small class="text-muted mt-2 d-block">
                        Por favor, ajuste las fechas de su viaje para continuar
                    </small>
                    </div>
                </div>
                <div class="modal-footer border-0 justify-content-center pt-0">
                    <button 
                    type="button" 
                    class="btn btn-primary px-4 py-2 fw-semibold"
                    data-bs-dismiss="modal"
                    style="min-width: 120px;"
                    >
                    Regresar
                    </button>
                </div>
                </div>
            </div>
            </div>

        </div>
        
    
    )
})