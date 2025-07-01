import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { WEBContext } from "~/root";


import styles from './index.css?inline'
import { LoadingContext } from "~/root";
import { InvoiceFormCO } from "~/components/starter/invoice-forms/InvoiceFormCO";
import { InvoiceFormMX } from "~/components/starter/invoice-forms/InvoiceFormMX";



export default component$(() =>{
    useStylesScoped$(styles)
    const stateContext = useContext(WEBContext)
    const contextLoading = useContext(LoadingContext)
    const country = useSignal('');
    const msgTost =useSignal('')
    
    useTask$(({ track })=>{
            const value = track(()=>stateContext.value.country);   
            country.value = value;
            
           // contextLoading.value = {status:false, message:''};
    })

    useVisibleTask$(()=>{
        contextLoading.value = {status:false, message:''};
    })



    const saveRelationOrderInvoice$ = $(async() => {

        const bs = (window as any)['bootstrap']
        const toastSuccess = new bs.Toast('#toast-success',{})
        const toastError = new bs.Toast('#toast-error',{})
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const dataFormInvoicing : {[key:string]:any} = {}
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;
        let errorInvoicing = false;
        const codvoucher = (document.querySelector('#input-voucher') as HTMLInputElement).value || '';
        contextLoading.value = {status:true, message:''}
        if(!formInvoicing.checkValidity() || codvoucher == '')
        {
            formInvoicing.classList.add('was-validated');
            (document.querySelector('#input-voucher') as HTMLInputElement).classList.add('is-invalid');
            errorInvoicing = true
            contextLoading.value = {status:false, message:''}
        }
        else
        {
            formInvoicing.classList.remove('was-validated')
            errorInvoicing = false

            const inputs = Array.from(formInvoicing.querySelectorAll('input,select'))

            inputs.map((input) => {
                dataFormInvoicing[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })

            if (country.value === 'CO') 
            {
             const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
             const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement
             const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
             dataFormInvoicing.idciudad = Number(inputCity.dataset?.value);
             dataFormInvoicing.idestado = Number(inputState.dataset?.value); 
             dataFormInvoicing.codigociudad = codigoCiudad;
             dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);

            }
            else if (country.value === 'MX')
            {
            const inputState = document.querySelector('#form-invoicing-select-3-0') as HTMLInputElement
            const inputCity = document.querySelector('#form-invoicing-select-3-1') as HTMLInputElement
            const inputTaxRegime = document.querySelector('#form-invoicing-select-0-1') as HTMLSelectElement;
                
            const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
            const regimenfiscal = stateContext.value.listadoRegimenesSat.find((tax: any) => tax.value == inputTaxRegime?.dataset?.value);
            dataFormInvoicing.idciudad = Number(inputCity.dataset?.value);
            dataFormInvoicing.idestado = Number(inputState.dataset?.value);
            dataFormInvoicing.codigociudad = codigoCiudad;
            dataFormInvoicing.idregimenfiscal = Number(regimenfiscal.value);
            dataFormInvoicing.claveregimenfiscal =regimenfiscal.clave ||'';
            dataFormInvoicing.usocfdi =regimenfiscal.usocfdi||'';
            dataFormInvoicing.tipoid ='RFC';
            
            }
            dataFormInvoicing.tipoPersona = radioTypePerson.value;
            dataFormInvoicing.origenFactura = country.value;
            dataFormInvoicing.codigovoucher = codvoucher;
        }
        
        if(errorInvoicing == false )
        {        

            const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getRelationOrderInvoice",
                  {method:"POST",body:JSON.stringify(dataFormInvoicing)});
            const data =await response.json();

            if (!data.error) 
            {
                (document.querySelector('#input-voucher') as HTMLInputElement).value = '';
                (formInvoicing as HTMLFormElement).reset(); 
                contextLoading.value = {status:false, message:''}
                toastSuccess.show()

            }
            else{
                msgTost.value = data.mensaje || 'Ocurrió un error';
                toastError.show()
                contextLoading.value = {status:false, message:''}
            }
        }




         
    })
     

    return (
        <div class='container-fluid'>
                             
                <div class='row bg-image bg-contact-us-option-1 mt-5'>
                    <div class='col-xl-12 mt-5'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12 text-center'>
                                    <h2 class='h1 text-semi-bold text-dark-blue mb-3'>Facturación</h2>
                                    <hr class='divider my-5'></hr>
                                    <h3 class='h5 text-dark-gray'>¡Importante antes de enviar el formulario, verificar sus datos de facturación!</h3>
                                    <h3 class='h5 text-dark-gray'>Todos los campos son requeridos</h3>

                                    <div class='card mt-5 pt-3 pb-4 px-lg-5 shadow-lg'>
                                        <div class='card-body px-5 text-start'>

                                            <div class='row'>

                                                                <div class='col-xl-12 col-sm-12 col-12'>
                                                                    <input 
                                                                        id='input-voucher' 
                                                                        name='voucher' 
                                                                        type='text' 
                                                                        class='form-control text-center' 
                                                                        placeholder="Ingresa tu voucher CA-XXXXXX-XX"
                                                                      //  disabled={messageCupon.value.error == 'success'}
                                                                       // onBlur$={getCupon$}
                                                                       required={true}
                                                                    />

                                                                </div>
                                                                     
                                                            </div>
                                            {
                                               country.value === 'CO'&&
                                                <InvoiceFormCO/>
                                                
                                            }
                                            {
                                                country.value === 'MX'&&
                                                <InvoiceFormMX/>
                                            }
                                        </div>
                                    </div>
                                    <br/>
                                    <div class='container mb-5'>
                                        <div class='row justify-content-center'>
                                            <div class='col-lg-2 col-sm-12'>
                                                <div class='d-grid gap-2'>
                                                    <button class='btn btn-primary btn-lg' onClick$={saveRelationOrderInvoice$}>Enviar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toast-container position-fixed bottom-0 p-3">
                    <div id='toast-success' class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <div class='message'>
                                    <i class="fas fa-check-circle"/>
                                    <span  class='text-start'>
                                        <b>Solicitud de factura enviada, favor de estar atento al correo que proporciono</b>
                                        {/* <br/>
                                        <small>En unos minutos responderemos tus dudas.</small> */}
                                    </span>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                    <div id='toast-error' class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <div class='message'>
                                    <i class="fas fa-times-circle"/>
                                    <span class='text-start mx-2'>
                                        <b>{msgTost.value}</b>
                                      {/*   <br/>
                                        <small>Si el error persiste llama a nuestros números de contacto.</small> */}
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