import { $, component$,  useStylesScoped$,useSignal,useContext} from "@builder.io/qwik";
//import styles from './card-plan.css?inline'
import { WEBContext } from "~/root";
import { Form } from "~/components/starter/form/Form";
import { LoadingContext } from "~/root";

export interface propsCardPlan {
    [key:string]:any,
}

export const InvoiceFormCO = component$((props:propsCardPlan) => {
   // useStylesScoped$(styles)
    const stateContext = useContext(WEBContext)
    const typePersonInvoice = useSignal('RS');
    const showInputInvoiceRS= useSignal(true);
    const disableVerificationCode= useSignal(true);
    const formDefault = useSignal()
    const array : any[] = []
    const listadoCiudades = useSignal(array)
    const idestado = useSignal(0)
    const idciudad = useSignal(0)
    const contextLoading = useContext(LoadingContext)
    
    const changeTypePerson$ = $((person:string) => {
        
        typePersonInvoice.value = person

        if(person == 'RS')
        {
            showInputInvoiceRS.value = true
        }else{
            showInputInvoiceRS.value = false
        }

    })

    const changeTypeIdPerson$ = $((e:any) => {
      
        if(e.value == 'NIT'){
            disableVerificationCode.value = false
        }else{
            disableVerificationCode.value = true
        }     
    })
     
    const changeStateCO$  =  $(async(value:any) => {
        
        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getCityMXCO",
                  {method:"POST",body:JSON.stringify({idestado:Number(value),codigopais:stateContext.value.country})});
                const listadociudad =await response.json();
                var ciudadesDefault = [];
                const resCity : any[] = [];

                  if (listadociudad && listadociudad.resultado[0]  && listadociudad.resultado[0].ciudades &&Array.isArray(listadociudad.resultado[0].ciudades)) {
                    ciudadesDefault = listadociudad.resultado[0]
                      listadociudad.resultado[0].ciudades.map((ciudades:any) => {
                          resCity.push({value:ciudades.idciudad,label:ciudades.nombreciudad,codigociudad:ciudades.codigociudad})
                      })
                    listadoCiudades.value = resCity
                    
                  }   

                stateContext.value = { ...stateContext.value, listadociudades:resCity }
                contextLoading.value = {status:false, message:''}
    })

    const getClientInvoice$ = $(async(e:any) => {
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const inputNombres = formInvoicing.querySelector('input[name="nombres"]') as HTMLInputElement;
        const inputApellidos = formInvoicing.querySelector('input[name="apellidos"]') as HTMLInputElement;
        const inputCorreo = formInvoicing.querySelector('input[name="correo"]') as HTMLInputElement;
        const inputDireccion = formInvoicing.querySelector('input[name="direccion"]') as HTMLInputElement;
        const inputCodigoPostal = formInvoicing.querySelector('input[name="codigopostal"]') as HTMLInputElement;
        const inputTelefono = formInvoicing.querySelector('input[name="telefono"]') as HTMLInputElement;
        const selectEstado = formInvoicing.querySelector('#form-invoicing-select-4-0') as HTMLSelectElement;
        const selectCiudad = formInvoicing.querySelector('#form-invoicing-select-4-1') as HTMLSelectElement;
        contextLoading.value = {status:true, message:''}

        const body = {
            tipoid: e.target.form.tipoid.value,
            id: e.target.form.id.value,
            origen: stateContext.value.country
        }

        const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getClientInvoice",
                  {method:"POST",body:JSON.stringify(body)});
        const data =await response.json();
        
        if(data && data.resultado && data.resultado[0]){            
            typePersonInvoice.value = data.resultado[0].tipopersona || 'RS';
            changeStateCO$(data.resultado[0].idestado);
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
            
            
        }else
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
                    id="radiotipofactura1" checked={showInputInvoiceRS.value} value={'RS'} onClick$={()=>changeTypePerson$('RS')}/>
                    <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipofactura1" >
                        Persona Natural
                        </label>
                    </div>
                </div>
        
                <div class="col-6 mb-3 my-3">
                    <div class="form-check">
                    <input class="form-check-input" type="radio" name="radiotipofactura" 
                    id="radiotipofactura2" onClick$={()=>changeTypePerson$('RC')} value={'RC'}/>
                    <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipofactura2" >
                        Persona Jurídica
                    </label>
                    </div>
                </div>
                </div>
                    

            </div>
            
            
        </div>
           {
                    showInputInvoiceRS.value ?

                    <Form
                        id='form-invoicing'
                        form={[

                            {row:[
                                {size:'col-xl-4 col-xs-4',type:'select',label:'Tipo ID',placeholder:'Tipo ID',name:'tipoid',required:true,options:[
                                    {value:'CC',label:'CC'},
                                    {value:'PASAPORTE',label:'Pasaporte'},
                                    {value:'NIT',label:'NIT'},
                                ], onChange:$((e:any)=>changeTypeIdPerson$(e))},
                            ]}, 
                            {row:[                                                            
                                {size:'col-xl-8 col-xs-8',type:'text',label:'ID',placeholder:'ID',name:'id',required:true,onChange:$((e:any)=>getClientInvoice$(e))},
                                {size:'col-xl-4 col-xs-4',type:'number',label:'Código Verificación',placeholder:'Código Verificación',name:'codigoverificacion',required:true,disabled:disableVerificationCode.value},
                            ]},
                                                                                
                            
                            {row:[                                                            
                                {size:'col-xl-6',type:'text',label:'Nombres',placeholder:'Nombres',name:'nombres',required:true},
                                {size:'col-xl-6',type:'text',label:'Apellidos',placeholder:'Apellidos',name:'apellidos',required:true},
                            ]},

                            {row:[
                                {size:'col-xl-6 col-xs-6',type:'email',label:'Correo',placeholder:'Correo',name:'correo',required:true},
                                {size:'col-xl-6 col-xs-6',type:'tel',label:'Teléfono',placeholder:'Teléfono',name:'telefono',required:true},
                            ]},
                            
                            {row:[

                                {size:'col-xl-6 col-xs-6',type:'select',label:'Departamento',placeholder:'Departamento',name:'departamento',
                                required:true,options:stateContext.value.listadoDepartamentos, onChange:$((e:any)=>changeStateCO$(e.value)),},
                                {size:'col-xl-6 col-xs-6',type:'select',label:'Ciudad',placeholder:'Ciudad',name:'ciudad',required:true,options:listadoCiudades.value,},

                            ]},

                            {row:[                                                            
                                {size:'col-xl-8 col-xs-8',type:'text',label:'Dirección',placeholder:'Dirección',name:'direccion',required:true},                            
                                {size:'col-xl-4 col-xs-4',type:'text',label:'C.P.',placeholder:'C.P.',name:'codigopostal',required:true}

                            ]}, 
                        ]}
                    />
                    :
                    <Form
                        id='form-invoicing'
                        form={[                            

                            {row:[
                                {size:'col-xl-4 col-xs-4',type:'select',label:'Tipo ID',placeholder:'Tipo ID',name:'tipoid',required:true,options:[
                                    {value:'CC',label:'CC'},
                                    {value:'PASAPORTE',label:'Pasaporte'},
                                    {value:'NIT',label:'NIT'},
                                ], onChange:$((e:any)=>changeTypeIdPerson$(e))},
                            ]}, 
                            {row:[                                                            
                                {size:'col-xl-8 col-xs-8',type:'text',label:'ID',placeholder:'ID',name:'id',required:true},
                                {size:'col-xl-4 col-xs-4',type:'number',label:'Código Verificación',placeholder:'Código Verificación',name:'codigoverificacion',required:true, disabled:disableVerificationCode.value},
                            ]},
                            {row:[
                                {size:'col-xl-12',type:'text',label:'Razón Social',placeholder:'Razón Social',name:'razonsocial',required:true},
                            ]},                                                        
                            
                        
                            {row:[
                                {size:'col-xl-6 col-xs-6',type:'email',label:'Correo',placeholder:'Correo',name:'correo',required:true},
                                    {size:'col-xl-6 col-xs-6',type:'tel',label:'Teléfono',placeholder:'Teléfono',name:'telefono',required:true},
                            ]},
                            
                            {row:[
                                
                                {size:'col-xl-6 col-xs-6',type:'select',label:'Departamento',placeholder:'Departamento',name:'departamento',
                                required:true,options:stateContext.value.listadoDepartamentos, onChange:$((e:any)=>changeStateCO$(e.value)),},
                                {size:'col-xl-6 col-xs-6',type:'select',label:'Ciudad',placeholder:'Ciudad',name:'ciudad',required:true,options:listadoCiudades.value,},

                            ]},

                            {row:[                                                            
                                {size:'col-xl-8 col-xs-8',type:'text',label:'Dirección',placeholder:'Dirección',name:'direccion',required:true},                            
                                {size:'col-xl-4 col-xs-4',type:'text',label:'C.P.',placeholder:'C.P.',name:'codigopostal',required:true}
                            ]}, 
                        ]}
                    />

           }
        </>
    )
})