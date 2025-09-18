import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$,useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from '@builder.io/qwik-city';
import { Form } from "~/components/starter/form/Form";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from "~/utils/CurrencyFormater";
import ImgContinentalAssistMedicine from '~/media/icons/continental-assist-medicine.webp?jsx'
import ImgContinentalAssistPregnancy from '~/media/icons/continental-assist-pregnancy.webp?jsx'
import ImgContinentalAssistSports from '~/media/icons/continental-assist-sports.webp?jsx'
import dayjs from "dayjs";
import styles from './index.css?inline'
import { LoadingContext } from "~/root";
import { saveQuoteData$ } from "~/utils/QuotePersistence";

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

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    const contextDivisa = useContext(DIVISAContext)
    const navigate = useNavigate()
    const objectAdditionalsBenefitsPlan:{[key:string]:any,beneficiosadicionales:any[],beneficiosadicionalesSeleccionados:any[]} = {beneficiosadicionales:[],beneficiosadicionalesSeleccionados:[]}
    const additionalsBenefitsPlan = useSignal(objectAdditionalsBenefitsPlan)
   // const arrayAdditionalsBenefits: {[key:string]:any,beneficiosadicionales:any[],beneficiosadicionalesSeleccionados:any[]}[] = []
   // const additionalsBenefits = useSignal(arrayAdditionalsBenefits)    

    const divisaManual = useSignal(contextDivisa.divisaUSD)
    const contextLoading = useContext(LoadingContext)

    // Función local para guardar datos con QRL
    const saveData = $((data: any) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('continental_assist_quote_data', JSON.stringify(data));
            } catch (error) {
                console.warn('Error al guardar datos del cotizador:', error);
            }
        }
    });

    const desktop = useSignal(false)
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {        
        if(!navigator.userAgent.includes('Mobile'))
        {
            desktop.value = true
        }
        contextLoading.value = {status:false, message:''}
        
    })
    
    useTask$(async() => {  
    
        if (Object.keys(stateContext.value).length > 0 && 'plan' in stateContext.value ) {
            const newAdditionalBenefit = [...(stateContext.value.plan?.adicionalesdefault || [])];

                    const today = new Date();
                    let suma =0;
                    // Iterar sobre los pasajeros
                    newAdditionalBenefit.forEach((pax: any, index: number) => {
                        let min, max;
                        const idpasajero = index + 1;
            
                        // Verificar si ya existe un asegurado con el mismo idpasajero y edad
                        const existePax = stateContext.value?.asegurados?.find(
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
                    
                    // Actualizar el contexto global con los nuevos datos
                     stateContext.value.plan.adicionalesdefault = newAdditionalBenefit;
                     stateContext.value = {
                        ...stateContext.value,
                        total: {
                            divisa: stateContext.value.plan.codigomonedapago,
                            total: suma+Number(stateContext.value.plan.precio_grupal)
                        },
                        asegurados: newAdditionalBenefit
                    };
                    
                    // Guardar datos en localStorage
                    saveData(stateContext.value);

        }
    });


    const getAdditionalsbBenefits$ = $((index:number) => {
        
        additionalsBenefitsPlan.value =  stateContext.value.asegurados[index]

        
    })

    const getAdditional$ = $((index:number,idpax:number,benefit:object) => {
        const dataBenefits: any[] = [...stateContext.value.asegurados]
        let totalUpgrade=0;
        dataBenefits.map((pax,indexP) => {
            if(pax.idpasajero == idpax)
            {
                dataBenefits[indexP].beneficiosadicionalesSeleccionados.push(benefit)
                dataBenefits[indexP].beneficiosadicionales[index].seleccionado = true

                dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                    if(dataBenefits[indexP].beneficiosadicionales[index].idbeneficioadicional == 36)
                    {
                        if(additional.idbeneficioadicional == 37)
                        {
                            additional.disabled = true
                        }
                    }
                    else if(dataBenefits[indexP].beneficiosadicionales[index].idbeneficioadicional == 37)
                    {
                        if(additional.idbeneficioadicional == 36)
                        {
                            additional.disabled = true
                        }
                    }
                })
                
                additionalsBenefitsPlan.value = Object.assign({},dataBenefits[indexP])
                totalUpgrade +=  Number(dataBenefits[indexP].beneficiosadicionales[index].precio)
            }

            const benefitsDataLayer : any[] = []

            dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                benefitsDataLayer.push(additional.nombrebeneficioadicional)
            })

        })
        
        
        const total = stateContext.value.total.total +totalUpgrade;
        stateContext.value = {
            ...stateContext.value,
            subTotal: total,
            total: {
                divisa: stateContext.value.plan.codigomonedapago,
                total: total,
            },
            asegurados: dataBenefits
        };
        
        // Guardar datos en localStorage
        saveData(stateContext.value);
        
    })

    const deleteAdditional$ = $((index:number,idpax:number,benefit:{[key:string]:any}) => {
        const dataBenefits: {[key:string]:any,beneficiosadicionalesSeleccionados:any[],beneficiosadicionales:any[]}[] = [...stateContext.value.asegurados]
        let totalUpgrade=0;
        dataBenefits.map((pax,indexP) => {
            if(pax.idpasajero == idpax)
            {
                dataBenefits[indexP].beneficiosadicionalesSeleccionados.map(((item,indexI) => {
                    if(item.idbeneficioadicional == benefit.idbeneficioadicional)
                    {
                        dataBenefits[indexP].beneficiosadicionalesSeleccionados.splice(indexI,1)
                        dataBenefits[indexP].beneficiosadicionales[index].seleccionado = false

                        dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                            if(dataBenefits[indexP].beneficiosadicionales[index].idbeneficioadicional == 36)
                            {
                                if(additional.idbeneficioadicional == 37)
                                {
                                    additional.disabled = false
                                }
                            }
                            else if(dataBenefits[indexP].beneficiosadicionales[index].idbeneficioadicional == 37)
                            {
                                if(additional.idbeneficioadicional == 36)
                                {
                                    additional.disabled = false
                                }
                            }
                        })

                        additionalsBenefitsPlan.value = Object.assign({},dataBenefits[indexP])
                        totalUpgrade += dataBenefits[indexP].beneficiosadicionales[index].precio;
                        

                    }
                }))
            }

            const benefitsDataLayer : any[] = []

            dataBenefits[indexP].beneficiosadicionales.map((additional:any) => {
                benefitsDataLayer.push(additional.nombrebeneficioadicional)
            })

        })
        const total = stateContext.value.total.total - totalUpgrade;
        
        stateContext.value = {
            ...stateContext.value,
            subTotal: total,
            total: {
                divisa: stateContext.value.plan.codigomonedapago,
                total: total,
            },
            asegurados: dataBenefits
        };
        
        // Guardar datos en localStorage
        saveData(stateContext.value);

    })



   const getPaxs$ = $(async () => {
    const bs = (window as any)['bootstrap'];
    const toastError = new bs.Toast('#toast-error', {});
    const containerForms = document.querySelector('.cards-paxs') as HTMLElement;
    const forms = Array.from(containerForms.querySelectorAll('form'));
    const checkPolicy = document.querySelector('input[name=aceptapolitica]') as HTMLInputElement;

    //const dataForm: any[] = stateContext.value.plan.adicionalesdefault;
    const dataForm: any[] =JSON.parse(JSON.stringify(stateContext.value.asegurados));


    const error: boolean[] = [];

    // Función auxiliar para manejar errores de validación
    const handleValidationError = (form: HTMLFormElement, index: number) => {
        form.classList.add('was-validated');
        const card = document.querySelector(`#card-${index + 1}`) as HTMLElement;
        if (card) {
            card.classList.add('border', 'border-danger');
        }
        error[index] = true;
        toastError.show();
    };

    // Función auxiliar para manejar validaciones exitosas
    const handleValidationSuccess = (form: HTMLFormElement, index: number) => {
        form.classList.remove('was-validated');
        const card = document.querySelector(`#card-${index + 1}`) as HTMLElement;
        if (card) {
            card.classList.remove('border', 'border-danger');
            const inputs = Array.from(form.querySelectorAll('input'));
            inputs.forEach((input) => {
                const inputElement = input as HTMLInputElement;
                
                if (inputElement.name && inputElement.name.trim() !== '') {
                    if (inputElement.name === 'fechanacimiento') {
                        dataForm[index][inputElement.name] = dayjs(inputElement.value).format('YYYY-MM-DD');
                    } else {
                        dataForm[index][inputElement.name] = inputElement.value;
                    }
                }
            });
        }
    };

    if (checkPolicy.checked) {
        forms.forEach((form, index) => {
            if (!form.checkValidity()) {
                handleValidationError(form, index);
            } else {
                handleValidationSuccess(form, index);
            }
        });

        const dataFormContact: { [key: string]: any } = {};
        const formContact = document.querySelector('#form-pax-contact') as HTMLFormElement;
        const inputs = Array.from(formContact.querySelectorAll('input'));
        inputs.forEach((input) => {
            dataFormContact[(input as HTMLInputElement).name] = (input as HTMLInputElement).value;
        });

        if (!error.includes(true)) {
            const dataRequest = {
                cotizacion: {
                    idplan: stateContext.value.plan.idplan,
                    cantidaddias: stateContext.value.dias,
                    pasajeros: dataForm,
                    fechadesde: stateContext.value.desde,
                    fechahasta: stateContext.value.hasta,
                    origenes: stateContext.value.origen,
                    destinos: stateContext.value.destinos,
                    contactoemergencia: dataFormContact,
                },
                ps: 'www.continentalassist.com',
            };

            try {
                const resPaxs = await fetch('/api/getPaxValidation', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataRequest)});
                const dataPaxs = await resPaxs.json();

                if (!dataPaxs.error) {
                    const paxs: any[] = dataPaxs.resultado;
                    let countPaxs = 0;

                    paxs.forEach((pax) => {
                        const card = document.querySelector(`#card-${pax.idpasajero}`) as HTMLElement;
                        const cardMessage = document.querySelector(`#card-message-${pax.idpasajero}`) as HTMLElement;

                        if (pax.voucher || pax.bloqueado) {
                            card.classList.add('border', 'border-danger');
                            cardMessage.classList.remove('d-none');
                            if (pax.bloqueado) {
                                const divElemento = document.querySelector('.message.error') as HTMLElement;
                                divElemento.innerHTML =
                                    "<span class='text-semi-bold'>Encontramos un problema con la información ingresada, <small>por favor contáctanos por medio del chat.</small></span>";
                            }
                        } else {
                            card.classList.add('border', 'border-success');
                            cardMessage.classList.add('d-none');
                            countPaxs += 1;
                        }
                    });
                    
                    if (paxs.length === countPaxs) {
                        const newStateContext = {
                            ...stateContext.value,
                            asegurados: dataForm,
                            contacto: dataFormContact,
                            subTotal: stateContext.value.total.total                           
                           
                        };
                        


                        stateContext.value = newStateContext;
                        
                        // Guardar datos en localStorage
                        saveData(stateContext.value);
                        
                        contextLoading.value = { status: true, message: 'Espere un momento...' };
                        await navigate('/quotes-engine/step-3');
                    }
                } else {
                    checkPolicy.classList.add('is-invalid');
                    toastError.show();
                }
            } catch (error) {
                console.error('Error al validar pasajeros:', error);
                toastError.show();
            }
        } else {
            toastError.show();
        }
    } else {
        checkPolicy.classList.add('is-invalid');
        toastError.show();
    }
});

    return(
        <div class='container-fluid px-0'>
        <div class='container-fluid'>
            <div class='row bg-step-4'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row  justify-content-center'>
                            {
                               stateContext.value.plan&& stateContext.value.plan.adicionalesdefault&&stateContext.value.plan.adicionalesdefault.length > 0                             
                                ?                                
                                <div class='col-xl-10 text-center mb-3'>
                                    <h2 class='text-semi-bold text-blue'>
                                        <span class='text-semi-bold'>Tus datos <br class='mobile'/>y complementos</span>
                                    </h2>
                                    <h5 class='text-dark-blue text-tin mb-3'>Ingresa la información de los viajeros <br class='mobile'/> y elige beneficios opcionales</h5>
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
                                        /* stateContext.value.plan&& stateContext.value.plan?.adicionalesdefault&&
                                        stateContext.value.plan? */
                                       Array.isArray(stateContext.value?.asegurados) &&stateContext.value.asegurados.map((addBenefit:any,index:number) => {
                                            return(
                                                <div key={index+1} class="card px-lg-5 shadow-sm" id={'card-'+addBenefit.idpasajero}>
                                                    <div class='container'>   
                                                        <div class="row mobile d-flex d-lg-none justify-content-center text-center p-3">
                                                            <div class='col-lg-6 col-md-8 col-6'>
                                                            <h4 class='text-semi-bold me-3 mb-0 text-light-blue'>Viajero #{addBenefit.idpasajero}</h4>
                                                                <p class='text-tin text-dark-blue mb-0'>
                                                                    De
                                                                    {addBenefit.edad == '23' && ' 0 a 23 '}
                                                                    {addBenefit.edad == '75' && ' 24 a 75 '}
                                                                    {addBenefit.edad == '85' && ' 76 a 85 '}
                                                                    años
                                                                </p>
                                                            </div>
                                                            <div class="col-lg-4 col-md-4 col-6">
                                                                <div class='d-grid gap-2'>
                                                                <button 
                                                                        type='button' 
                                                                        class='btn btn-benefits mt-2 mt-md-0 text-light-blue text-decoration-underline d-flex align-items-center' 
                                                                        onClick$={() => {getAdditionalsbBenefits$(index)}} 
                                                                        data-bs-toggle="modal" 
                                                                        data-bs-target="#modalAdditionals"
                                                                        style={{fontSize:'0.73rem', padding:'0', justifyContent:'end'}}
                                                                    >
                                                                        <span>Adquiere beneficios </span> <span class="fas fa-chevron-down ms-1"></span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>                                                         
                                                        <div class='row '>
                                                        
                                                        <div class="row not-mobile">
                                                        <div class='col-xl-8 col-sm-8 col-xs-12 d-flex align-items-center'>
                                                                <h4 class='text-semi-bold me-3 mb-0 text-light-blue'>Viajero #{addBenefit.idpasajero}</h4>
                                                                <p class='text-tin text-dark-blue mb-0'>
                                                                    De
                                                                    {addBenefit.edad == '23' && ' 0 a 23 '}
                                                                    {addBenefit.edad == '75' && ' 24 a 75 '}
                                                                    {addBenefit.edad == '85' && ' 76 a 85 '}
                                                                    años
                                                                </p>
                                                            </div>
                                                            <div class="col-xl-4  col-sm-4 col-xs-12">
                                                                <div class='d-grid gap-2 justify-content-end'>
                                                                    <button 
                                                                        type='button' 
                                                                        class='btn btn-benefits mt-2 mt-sm-0 text-light-blue text-decoration-underline d-flex align-items-center' 
                                                                        onClick$={() => {getAdditionalsbBenefits$(index)}} 
                                                                        data-bs-toggle="modal" 
                                                                        data-bs-target="#modalAdditionals"
                                                                    >
                                                                        <span>Adquiere beneficios </span> <span class="fas fa-chevron-down ms-1"></span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        </div>
                                                    </div>
                                                    <div class="collapse show" id={"collapseExample-"+index}>
                                                        <div class='card-body px-3 text-start'>
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
                                                                                        <span class='text-semi-bold'>Esta persona ya cuenta con un voucher activo</span>
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
                                                            <button type="button" class='btn btn-collapse p-0 mb-3 mb-0 border-0' data-bs-toggle="collapse" data-bs-target={"#collapseExample-"+index}>
                                                                <i id={"icon-collapse-"+index} class="fas fa-chevron-down text-light-blue" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                    stateContext.value.plan&& stateContext.value.plan.adicionalesdefault.length > 0
                                        ?
                                        <div class='container p-0'>
                                            <div class='row'>
                                                <div class='col-lg-12'>
                                                    <div class='card px-lg-5 shadow-sm'>
                                                        <div class='container'>
                                                        <div class='row not-mobile p-3'>
                                                                <div class='col-lg-12'>
                                                                    <h5 class='text-semi-bold text-light-blue'>Contacto de emergencia</h5>
                                                                </div>
                                                            </div>
                                                            <div class='row mobile text-center p-3'>
                                                                <div class='col-lg-12'>
                                                                    <h5 class='text-semi-bold text-light-blue'>Contacto de emergencia</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='card-body px-3 text-start'>
                                                            <div class='container'>
                                                                <div class='row'>
                                                                    <div class='col-lg-12'>
                                                                        <Form
                                                                            id={'form-pax-contact'}
                                                                            form={[
                                                                                {row:[
                                                                                    {size:'col-xl-4',type:'text',label:'Nombre(s)',name:'nombres',required:true,textOnly:'true',value:stateContext.value?.contacto?.nombres,placeholder:'Nombre(s)'},
                                                                                    {size:'col-xl-4',type:'text',label:'Apellido(s)',name:'apellidos',required:true,textOnly:'true',value:stateContext.value?.contacto?.apellidos,placeholder:'Apellido(s)'},      
                                                                                    {size:'col-xl-4',type:'phone',label:'Teléfono',name:'telefono',required:true,value:stateContext.value?.contacto?.telefono,placeholder:'Teléfono(s)'},
                                                                                ]},
                                                                                {row:[
                                                                                    {size:'col-xl-4',type:'email',label:'Correo',name:'correo',required:true,value:stateContext.value?.contacto?.correo,placeholder:'Correo(s)'},
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
                                                <div class='col-lg-2 col-sm-5 col-xs-5'>
                                                    <div class='d-grid gap-2'>
                                                        <button type='button' class='btn btn-cancelar-edit btn-lg text-medium' onClick$={()=>navigate('/quotes-engine/step-1')}>Regresar</button>                                                            
                                                    </div>
                                                </div>
                                                <div class='col-lg-2 col-sm-5 col-xs-5'>
                                                    <div class='d-grid gap-2'>
                                                        <button type='button' class='btn btn-primary btn_cotizar_1' onClick$={getPaxs$}>Siguiente</button>
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
        <div id='modalAdditionals' class="modal fade modal-backdrop-mobile" aria-hidden="false">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header d-flex">  
                        <h2 class='text-semi-bold text-white px-4 p-2 m-0 me-2'>
                            Viajero {additionalsBenefitsPlan.value.idpasajero}  
                        </h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                     style={{border:'1px solid', borderRadius:'33px'}}></button>
                    </div>
                    <div class="modal-body cards-additionals">
                        {
                         additionalsBenefitsPlan.value?.beneficiosadicionales&&additionalsBenefitsPlan.value.beneficiosadicionales?.length > 0
                            ?
                            additionalsBenefitsPlan.value.beneficiosadicionales.map((benefit,index) => {
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
                                                        <h2 class="card-title text-semi-bold text-light-blue">{benefit.nombrebeneficioadicional}</h2>
                                                        {benefit.idbeneficioadicional == '37' && <p class="card-text text-blue">{benefit.descripcion}</p>}
                                                        {benefit.idbeneficioadicional == '36' && <p class="card-text text-blue">{benefit.descripcion}</p>}
                                                        {benefit.idbeneficioadicional == '35' && <p class="card-text text-blue">{benefit.descripcion}</p>}
                                                        <p class="card-text text-semi-bold text-dark-blue mb-4 benefit-price" style={{fontSize:'2rem'}}>
                                                            {
                                                                divisaManual.value == true ? CurrencyFormatter(benefit.codigomonedapago,benefit.precio) : CurrencyFormatter(stateContext.value.currentRate.code,benefit.precio * stateContext.value.currentRate.rate)
                                                            }
                                                        </p>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class='d-grid gap-2'>
                                                            {
                                                                benefit.seleccionado === true 
                                                                ? 
                                                                <button class='btn btn-primary' onClick$={() => {deleteAdditional$(index,additionalsBenefitsPlan.value.idpasajero,benefit)}}>Remover</button>
                                                                :
                                                                <button class='btn btn-primary btn_cotizar_1' disabled={benefit.disabled === true} onClick$={() => {getAdditional$(index,additionalsBenefitsPlan.value.idpasajero,benefit)}}>Agregar</button>
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