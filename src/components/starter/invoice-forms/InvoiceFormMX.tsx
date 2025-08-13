import { $, component$,useSignal,useContext, useTask$} from "@builder.io/qwik";
//import styles from './card-plan.css?inline'
import { WEBContext } from "~/root";
import { Form } from "~/components/starter/form/Form";
import { LoadingContext } from "~/root";


export const InvoiceFormMX = component$((props:any) => {
   // useStylesScoped$(styles)
    const stateContext = useContext(WEBContext)
    const typePersonInvoice = useSignal('RS');
    const hideInputInvoiceRS= useSignal(true);
    const array : any[] = []
    const listadoCiudades = useSignal(array)
    const listadoRegimenesSat = useSignal(array)
    const listadoMethods = useSignal(array)
    const defaultListadoTiposPagos = useSignal(array)
    const listadoTiposPagos = useSignal(array)
    const contextLoading = useContext(LoadingContext)
    //const dateVoucher= useSignal(dayjs().format('YYYY-MM-DD'));
    const hideInputDataPayment= useSignal(false);
    const hideInputSelectDataPayment= useSignal(false);
    const typepaymentSelected= useSignal('');
    const paymentMethodSelected= useSignal('');
    const disabledInpuTypePayment= useSignal(true);
    const disabledInputDataPayment= useSignal(false);
    
     const  objectInfo = {
        created_at: '',
        preciototal: 0,
        codigomoneda: '',
        referenciapagofactura:'',
        valorpagadofactura: 0,
        fechapagofactura: '',
        idformapagofactura: 0,
        paymentgroupcode: null

    }
    
   const infoVoucher = useSignal(objectInfo)
    

    useTask$(({ track })=>{
                const value = track(()=>props.modeFormPayment);   
                
               if (value == true) {
                   hideInputDataPayment.value =true;  
                   hideInputSelectDataPayment.value =true;      
               }
                
               // contextLoading.value = {status:false, message:''};
        })

        useTask$(({ track })=>{
                const value = track(()=>stateContext.value.infopayment);   
              
                
               if (value?.referenciapagofactura !== undefined &&value?.referenciapagofactura !== '' && value?.referenciapagofactura !== null) {
                paymentMethodSelected.value = value.paymentgroupcode;
                 setTimeout(() => {
                     infoVoucher.value = value;
                    disabledInputDataPayment.value = true;
                    typepaymentSelected.value = value.idformapagofactura;  
                     disabledInpuTypePayment.value = true;
                }, 600);
               
               }
                
               // contextLoading.value = {status:false, message:''};
        })



    useTask$(async()=>{
        let res : {[key:string]:any[]} = {}
        const resTaxRegime : any[] = []
        const taxRegime = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getTaxRegime",{method:"POST",headers: { 'Content-Type': 'application/json' }});
        const dataDefaults = await taxRegime.json()
        res = dataDefaults.resultado[0]
        if (res && res.regimenfiscal) 
        {
            res.regimenfiscal.map((regimen) => {
                resTaxRegime.push({value:regimen.idregimenfiscal,label:`${regimen.clave} - ${regimen.regimenfiscal}`,clave:regimen.clave, usocfdi:regimen.usocfdi})
            })
            listadoRegimenesSat.value = resTaxRegime;
        }

        let resMethods : {[key:string]:any[]} = {}
        const listMethods : any[] = []
        const paymentMethods = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPaymentMethods",{method:"POST",headers: { 'Content-Type': 'application/json' }});
        const dataDefaultsMethods = await paymentMethods.json()
        resMethods = dataDefaultsMethods.resultado[0]
         if (resMethods && resMethods.metodosPago) 
        {
            resMethods.metodosPago.map((methods) => {
                listMethods.push({value:methods.id,label:methods.nombre})
            })
            listadoMethods.value = listMethods;
        }
        

        

        stateContext.value = { ...stateContext.value, listadoRegimenesSat:resTaxRegime }
    })
    
    useTask$(async()=>{
        let resForma : {[key:string]:any[]} = {}
        const resFormaPago : any[] = []
        const formaPagoSap = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getPayForms",{method:"POST"});
        const dataDefaultsFormaPAgo = await formaPagoSap.json()
        resForma = dataDefaultsFormaPAgo.resultado[0]
        if (resForma && resForma.formaspago) 
        {
            resForma.formaspago.map((forma) => {
                resFormaPago.push({value:forma.id, label:`${forma.nombre}`, clave:forma.clave})
            })
            listadoTiposPagos.value = resFormaPago;
            defaultListadoTiposPagos.value = resFormaPago;
        }
        stateContext.value = { ...stateContext.value, listadoTiposPagos:resFormaPago }
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

    useTask$(() => {
        let observer: MutationObserver;

        const setupObserver = () => {
            if (observer) {
            observer.disconnect();
            }

            observer = new MutationObserver(() => {
            const input = document.querySelector('input[name="id"]');
            if (input && !input.getAttribute('data-uppercase-applied')) {
                input.addEventListener('input', (e) => {
                const el = e.target as HTMLInputElement;
                el.value = el.value.toUpperCase();
                });
                input.setAttribute('data-uppercase-applied', 'true');
            }
            });

            observer.observe(document.body, {
            childList: true,
            subtree: true,
            });
        };

        setupObserver();

        // Limpia el observer cuando el componente se desmonta
        return () => {
            if (observer) {
            observer.disconnect();
            }
        };
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
        
        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getCityMXCO",{method:"POST",headers: { 'Content-Type': 'application/json' },
             body:JSON.stringify({idestado:Number(value),codigopais:stateContext.value.country})});
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
        const inputRazonSocial = formInvoicing.querySelector('input[name="razonsocial"]') as HTMLInputElement;
        const selectRegimenFiscal = formInvoicing.querySelector('[name="idregimenfiscal"]') as HTMLSelectElement;
        const selectEstado = formInvoicing.querySelector('[name="estado"]') as HTMLSelectElement;
        const selectCiudad = formInvoicing.querySelector('[name="ciudad"]') as HTMLSelectElement;
        contextLoading.value = {status:true, message:''}

        const body = {
            tipoid:'RFC',// México solo maneja RFC
            id: e.target.form.id.value,
            origen: stateContext.value.country
        }

        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getClientInvoice",
                  {method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify(body)});
        const data =await response.json();
        if (data && data.resultado && data.resultado[0]) {
            const resultado = data.resultado[0];

            typePersonInvoice.value = resultado.tipopersona || 'RS';
            changeStateMX$(resultado.idestado);

            if (inputNombres)         inputNombres.value = resultado.nombres || '';
            if (inputApellidos)       inputApellidos.value = resultado.apellidos || '';
            if (inputCorreo)          inputCorreo.value = resultado.email || '';
            if (inputTelefono)        inputTelefono.value = resultado.telefono || '';
            if (inputDireccion)       inputDireccion.value = resultado.direccion || '';
            if (inputCodigoPostal)    inputCodigoPostal.value = resultado.codigopostal || '';
            if (selectEstado)         selectEstado.value = resultado.nombreestado;
            if (selectCiudad)         selectCiudad.value = resultado.nombreciudad;
            if (selectEstado)         selectEstado.dataset.value = resultado.idestado;
            if (selectCiudad)         selectCiudad.dataset.value = resultado.idciudad;
            if (selectRegimenFiscal)  selectRegimenFiscal.dataset.value = resultado.idregimenfiscal;
            if (selectRegimenFiscal)  selectRegimenFiscal.value = `${resultado.clave} - ${resultado.regimenfiscal}`;
            if (inputRazonSocial)     inputRazonSocial.value = resultado.razonsocial || '';

            contextLoading.value = { status: false, message: '' };
        } else {
            contextLoading.value = { status: false, message: '' };
        }

        
    })

    const changePaymentSelected$ = $(async (e:any) => {
console.log(e);

          if (e.label !== 'Contado') {
            disabledInpuTypePayment.value = true;
            typepaymentSelected.value ='';
            hideInputDataPayment.value =true;
             const selectedDefault = defaultListadoTiposPagos.value.find((item:any) => item.clave == '99');
             
             listadoTiposPagos.value = Array(selectedDefault) ;
            typepaymentSelected.value = selectedDefault.value;
            
          }else{
            disabledInpuTypePayment.value = false;
            const selectedDefault = defaultListadoTiposPagos.value.filter((item:any) => item.clave !== '99');             
            listadoTiposPagos.value = selectedDefault;
            hideInputDataPayment.value =false;
            typepaymentSelected.value ='';
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
                                {size:'col-xl-6 col-xs-12',type:'text',label:'RFC',placeholder:'RFC',name:'id',required:true,onChange:$((e:any)=>getClientInvoice$(e))},  
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Regimen Fiscal',placeholder:'Regimen Fiscal',name:'idregimenfiscal',
                                required:true,options:listadoRegimenesSat.value,},               


                            ]},                                                                                
                            
                            {row:[
                                 {size:'col-xl-6 col-xs-12',type:'select',label:'Método de Pago',placeholder:'Método de Pago',name:'formapago',
                                    required:true,options:listadoMethods.value,
                                    onChange:$((e:any)=>changePaymentSelected$(e)), hidden:hideInputSelectDataPayment.value, value:paymentMethodSelected.value,  disabled:disabledInputDataPayment.value
                                },
                                {size:'col-xl-6 col-xs-12', type: 'select', label:'Forma de Pago', placeholder:'Forma de Pago', name:'tipopago',
                                    required:true, options:listadoTiposPagos.value,value: typepaymentSelected.value, 
                                    disabled: disabledInpuTypePayment.value, hidden:hideInputSelectDataPayment.value
                                }, 
                            ]},

                            {row:[
                                {size:'col-xl-4 col-xs-12', type: 'date', label: 'Fecha de Pago', placeholder: 'Fecha', name: 'fechapagofactura', required: !hideInputSelectDataPayment.value, hidden:hideInputDataPayment.value, value: infoVoucher.value.fechapagofactura, disabled:disabledInputDataPayment.value},
                                {size:'col-xl-4 col-xs-12', type: 'float', label: 'Valor Pagado', placeholder: 'Valor Pagado', name: 'valorpagado', required: !hideInputSelectDataPayment.value, step: 'any', min: 0, hidden:hideInputDataPayment.value, value: infoVoucher.value.valorpagadofactura,disabled:disabledInputDataPayment.value},
                                {size:'col-xl-4 col-xs-12', type: 'text', label:'Referencia de Pago', placeholder:'Referencia de Pago', name:'referenciapago', required:!hideInputSelectDataPayment.value,hidden:hideInputDataPayment.value, value: infoVoucher.value.referenciapagofactura,disabled:disabledInputDataPayment.value},
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
                                
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Estados',placeholder:'Estados',name:'estado',
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
                                {size:'col-xl-6 col-xs-12',type:'text',label:'RFC',placeholder:'RFC',name:'id',required:true,onChange:$((e:any)=>getClientInvoice$(e))},  
                                {size:'col-xl-6 col-xs-12',type:'select',label:'Regimen Fiscal',placeholder:'Regimen Fiscal',name:'idregimenfiscal',
                                required:true,options:listadoRegimenesSat.value,},               


                            ]},                                                                                
                            
                            {row:[
                                 {size:'col-xl-6 col-xs-12',type:'select',label:'Método de Pago',placeholder:'Método de Pago',name:'formapago',
                                    required:true,options:listadoMethods.value,
                                    onChange:$((e:any)=>changePaymentSelected$(e)), hidden:hideInputSelectDataPayment.value, value:paymentMethodSelected.value,  disabled:disabledInputDataPayment.value
                                },
                                {size:'col-xl-6 col-xs-12', type: 'select', label:'Forma de Pago', placeholder:'Forma de Pago', name:'tipopago',
                                    required:true, options:listadoTiposPagos.value,value: typepaymentSelected.value, 
                                    disabled: disabledInpuTypePayment.value, hidden:hideInputSelectDataPayment.value
                                }, 
                            ]},

                            {row:[
                                {size:'col-xl-4 col-xs-12', type: 'date', label: 'Fecha de Pago', placeholder: 'Fecha', name: 'fechapagofactura', required: !hideInputSelectDataPayment.value, hidden:hideInputDataPayment.value, value: infoVoucher.value.fechapagofactura, disabled:disabledInputDataPayment.value},
                                {size:'col-xl-4 col-xs-12', type: 'float', label: 'Valor Pagado', placeholder: 'Valor Pagado', name: 'valorpagado', required: !hideInputSelectDataPayment.value, step: 'any', min: 0, hidden:hideInputDataPayment.value, value: infoVoucher.value.valorpagadofactura,disabled:disabledInputDataPayment.value},
                                {size:'col-xl-4 col-xs-12', type: 'text', label:'Referencia de Pago', placeholder:'Referencia de Pago', name:'referenciapago', required:!hideInputSelectDataPayment.value,hidden:hideInputDataPayment.value, value: infoVoucher.value.referenciapagofactura,disabled:disabledInputDataPayment.value},
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