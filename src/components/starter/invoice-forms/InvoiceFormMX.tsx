import { $, component$,useSignal,useContext, useTask$} from "@builder.io/qwik";
//import styles from './card-plan.css?inline'
import { WEBContext } from "~/root";
import { Form } from "~/components/starter/form/Form";
import { LoadingContext } from "~/root";


export const InvoiceFormMX = component$(() => {
   // useStylesScoped$(styles)
    const stateContext = useContext(WEBContext)
    const typePersonInvoice = useSignal('RS');
    const hideInputInvoiceRS= useSignal(true);
    const array : any[] = []
    const listadoCiudades = useSignal(array)
    const listadoRegimenesSat = useSignal(array)
    const contextLoading = useContext(LoadingContext)



    useTask$(async()=>{
        let res : {[key:string]:any[]} = {}
        const resTaxRegime : any[] = []
        const taxRegime = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getTaxRegime",{method:"POST"});
        const dataDefaults = await taxRegime.json()
        res = dataDefaults.resultado[0]
        if (res && res.regimenfiscal) 
        {
            res.regimenfiscal.map((regimen) => {
                resTaxRegime.push({value:regimen.idregimenfiscal,label:`${regimen.clave} - ${regimen.regimenfiscal}`,clave:regimen.clave, usocfdi:regimen.usocfdi})
            })
            listadoRegimenesSat.value = resTaxRegime;
        }
        stateContext.value = { ...stateContext.value, listadoRegimenesSat:resTaxRegime }
    })

    useTask$(() => {
        let observer: MutationObserver;
        
        const setupObserver = () => {
            if (observer) {
                observer.disconnect();
            }
            
            observer = new MutationObserver((mutations) => {
                const input = document.querySelector('input[name="codigopostal"]');
                if (input) {
                (input as HTMLInputElement).addEventListener('input', (e) => {
                    const value = (e.target as HTMLInputElement).value;
                    const numericValue = value.replace(/\D/g, '');
                    const formattedValue = numericValue.slice(0, 6);
                    (e.target as HTMLInputElement).value = formattedValue;
                });
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };
        
        setupObserver();
        
        // Reconectar cuando cambie el formulario
        document.addEventListener('change', (e) => {
            if ((e.target as HTMLElement).tagName === 'FORM') {
                setupObserver();
            }
        });
    });

    
    const changeTypePerson$ = $((person:string) => {
        
        typePersonInvoice.value = person

        if(person == 'RS')
        {
            hideInputInvoiceRS.value = true
        }else{
            hideInputInvoiceRS.value = false
        }

    })



    const changeStateMX$  =  $(async(value:any) => {
        
        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getCityMXCO",
                    {method:"POST",body:JSON.stringify({idestado:Number(value),codigopais:stateContext.value.country})});
                    const listadociudad =await response.json();
                    const resCity : any[] = [];

                    if (listadociudad && listadociudad.resultado[0]  && listadociudad.resultado[0].ciudades &&Array.isArray(listadociudad.resultado[0].ciudades)) {
                        listadociudad.resultado[0].ciudades.map((ciudades:any) => {
                            resCity.push({value:ciudades.idciudad,label:ciudades.nombreciudad,codigociudad:ciudades.codigociudad})
                        })
                    listadoCiudades.value = resCity
                    
                    }   

                stateContext.value = { ...stateContext.value, listadociudades:resCity }

    })

    const getClientInvoice$ = $(async(e:any) => {
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const inputNombres = formInvoicing.querySelector('input[name="nombres"]') as HTMLInputElement;
        const inputApellidos = formInvoicing.querySelector('input[name="apellidos"]') as HTMLInputElement;
        const inputCorreo = formInvoicing.querySelector('input[name="correo"]') as HTMLInputElement;
        const inputDireccion = formInvoicing.querySelector('input[name="direccion"]') as HTMLInputElement;
        const inputCodigoPostal = formInvoicing.querySelector('input[name="codigopostal"]') as HTMLInputElement;
        const inputTelefono = formInvoicing.querySelector('input[name="telefono"]') as HTMLInputElement;   
        const selectRegimenFiscal = formInvoicing.querySelector('#form-invoicing-select-0-1') as HTMLSelectElement;
        const selectEstado = formInvoicing.querySelector('#form-invoicing-select-3-0') as HTMLSelectElement;
        const selectCiudad = formInvoicing.querySelector('#form-invoicing-select-3-1') as HTMLSelectElement;
        contextLoading.value = {status:true, message:''}

        const body = {
            tipoid:'RFC',// México solo maneja RFC
            id: e.target.form.id.value,
            origen: stateContext.value.country
        }

        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getClientInvoice",
                  {method:"POST",body:JSON.stringify(body)});
        const data =await response.json();
        
        if(data && data.resultado && data.resultado[0]){
            typePersonInvoice.value = data.resultado[0].tipopersona || 'RS';
            changeStateMX$(data.resultado[0].idestado);
            inputNombres.value = data.resultado[0].nombres || '';
            inputApellidos.value = data.resultado[0].apellidos || '';
            inputCorreo.value = data.resultado[0].email || '';
            inputTelefono.value = data.resultado[0].telefono || '';          
            inputDireccion.value = data.resultado[0].direccion || '';
            inputCodigoPostal.value = data.resultado[0].codigopostal || '';
            selectEstado.value = data.resultado[0].nombreestado; 
            selectCiudad.value = data.resultado[0].nombreciudad;
            selectEstado.dataset.value =data.resultado[0].idestado;
            selectCiudad.dataset.value=data.resultado[0].idciudad; 
            selectRegimenFiscal.dataset.value=data.resultado[0].idregimenfiscal;   
            selectRegimenFiscal.value=data.resultado[0].clave +" - "+data.resultado[0].regimenfiscal;         
            contextLoading.value = {status:false, message:''}
        }
        else
        {
            contextLoading.value = {status:false, message:''}
        }
        
    })

    

    return(
        <>

        <div class="row">
            <div class="col-12 mb-3 my-3">
                <hr/>
                <h6 class="text-semi-bold text-dark-blue">Seleccione el tipo de persona </h6>
                <div class="row">    
                    <div class="col-6 mb-3 my-3">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="radiotipofactura" 
                    id="radiotipofactura1" checked={hideInputInvoiceRS.value} value={'RS'} onClick$={()=>changeTypePerson$('RS')}/>
                    <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipofactura1" >
                        Persona Física
                        </label>
                    </div>
                </div>
        
                <div class="col-6 mb-3 my-3">
                    <div class="form-check">
                    <input class="form-check-input" type="radio" name="radiotipofactura" 
                    id="radiotipofactura2" value={'RC'} onClick$={()=>changeTypePerson$('RC')}/>
                    <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipofactura2" >
                        Persona Moral
                    </label>
                    </div>
                </div>
                </div>
                    

            </div>
            
            
        </div>
           {
                    hideInputInvoiceRS.value ?

                    <Form
                        id='form-invoicing'
                        form={[
                            
                            {row:[                                                            
                                {size:'col-xl-4 col-xs-12',type:'text',label:'RFC',placeholder:'RFC',name:'id',required:true,onChange:$((e:any)=>getClientInvoice$(e))},  
                                {size:'col-xl-4 col-xs-12',type:'select',label:'Regimen Fiscal',placeholder:'Regimen Fiscal',name:'idregimenfiscal',
                                required:true,options:listadoRegimenesSat.value,},                      
                                {size:'col-xl-4 col-xs-12',type:'select',label:'Forma de Pago',placeholder:'Forma de Pago',name:'formapago',required:true,options:[{value:'PUE',label:'PUE-Contado',codigo:-1},{value:'PPD',label:'PPD-Diferido',codigo:12}]},

                          
                            ]},                                                                                
                            
                            {row:[                                                            
                                {size:'col-xl-12',type:'text',label:'Nombres',placeholder:'Nombres',name:'nombres',required:true},
                                {size:'col-xl-12',type:'text',label:'Apellidos',placeholder:'Apellidos',name:'apellidos',required:true},
                            ]},

                            {row:[
                                {size:'col-xl-6 col-xs-12',type:'email',label:'Correo',placeholder:'Correo',name:'correo',required:true},
                                    {size:'col-xl-6 col-xs-12',type:'tel',label:'Teléfono',placeholder:'Teléfono',name:'telefono',required:true},
                            ]},
                            
                            {row:[
                                
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Estados',placeholder:'Estados',name:'departamento',
                                required:true,options:stateContext.value.listadoestados, onChange:$((e:any)=>changeStateMX$(e.value))},
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Ciudad',placeholder:'Ciudad',name:'ciudad',required:true,options:listadoCiudades.value},

                            ]},


                            {row:[                                                            
                                {size:'col-xl-8 col-xs-12',type:'text',label:'Dirección',placeholder:'Dirección',name:'direccion',required:true},                            
                                {size:'col-xl-4 col-xs-12',type:'text',label:'C.P.',placeholder:'C.P.',name:'codigopostal',required:true}

                            ]}, 
                        ]}
                    />
                    :

                    <Form
                        id='form-invoicing'
                        form={[
                            {row:[                                                            
                                {size:'col-xl-4 col-xs-12',type:'text',label:'RFC',placeholder:'RFC',name:'id',required:true,onChange:$((e:any)=>getClientInvoice$(e))},  
                                {size:'col-xl-4 col-xs-12',type:'select',label:'Regimen Fiscal',placeholder:'Regimen Fiscal',name:'idregimenfiscal',
                                required:true,options:listadoRegimenesSat.value,},     
                                {size:'col-xl-4 col-xs-12',type:'select',label:'Forma de Pago',placeholder:'Forma de Pago',name:'formapago',required:true,options:[{value:'PUE',label:'PUE-Contado',codigo:-1},{value:'PPD',label:'PPD-Diferido',codigo:12}]},                 
                                ]},
                            {row:[
                                {size:'col-xl-12',type:'text',label:'Razón Social',placeholder:'Razón Social',name:'razonsocial',required:true},
                            ]},                                                        
                            
                        
                            {row:[
                                {size:'col-xl-6 col-xs-12',type:'email',label:'Correo',placeholder:'Correo',name:'correo',required:true},
                                    {size:'col-xl-6 col-xs-12',type:'tel',label:'Teléfono',placeholder:'Teléfono',name:'telefono',required:true},
                            ]},
                            
                           {row:[
                                
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Estados',placeholder:'Estados',name:'estado',
                                required:true,options:stateContext.value.listadoestados, onChange:$((e:any)=>changeStateMX$(e.value)),},
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Ciudad',placeholder:'Ciudad',name:'ciudad',required:true,options:listadoCiudades.value,},

                            ]},


                            {row:[                                                            
                                {size:'col-xl-8 col-xs-12',type:'text',label:'Dirección',placeholder:'Dirección',name:'direccion',required:true},                            
                                {size:'col-xl-4 col-xs-12',type:'text',label:'C.P.',placeholder:'C.P.',name:'codigopostal',required:true}

                            ]}, 
                        ]}
                    />

           }
        </>
    )
})