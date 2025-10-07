import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { WEBContext } from "~/root";


import styles from './index.css?inline'
import { LoadingContext } from "~/root";
import { InvoiceFormCO } from "~/components/starter/invoice-forms/InvoiceFormCO";
import { InvoiceFormMX } from "~/components/starter/invoice-forms/InvoiceFormMX";
import dayjs from "dayjs";



export default component$(() =>{
    useStylesScoped$(styles)
    const  objectInfo = {
        created_at: '',
        preciototal: 0,
        codigomoneda: '',
        referenciapagofactura:'',
        valorpagadofactura: 0,
        fechapagofactura: '',
        idformapagofactura: 0,
        paymentgroupcode: '',
        tasacambio:0

    }
    const stateContext = useContext(WEBContext)
    const contextLoading = useContext(LoadingContext)
    const country = useSignal('');
    const msgTost =useSignal('')
    const infoVoucher = useSignal(objectInfo)
    
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
        const inputPago = (document.querySelector('input[name="valorpagadofactura"]') as HTMLInputElement);
        const valorpagado = inputPago && inputPago.value ? parseFloat(inputPago.value) : 0;

        contextLoading.value = {status:true, message:''}        
        if(country.value === 'MX' )
        {
            if(!formInvoicing.checkValidity() || codvoucher == ''|| valorpagado == 0)
            {
                formInvoicing.classList.add('was-validated');
                (document.querySelector('#input-voucher') as HTMLInputElement).classList.add('is-invalid');
                errorInvoicing = true
                contextLoading.value = {status:false, message:''}
            }
            
        }else if (country.value === 'CO' ) {
            if(!formInvoicing.checkValidity())
            {
                formInvoicing.classList.add('was-validated');
                (document.querySelector('#input-voucher') as HTMLInputElement).classList.add('is-invalid');
                errorInvoicing = true
                contextLoading.value = {status:false, message:''}
            }
             
        }
        
        
        if(errorInvoicing == false && formInvoicing.checkValidity()) 
        {
            formInvoicing.classList.remove('was-validated')
            errorInvoicing = false

            const inputs = Array.from(formInvoicing.querySelectorAll('input,select'))

            inputs.map((input) => {
                dataFormInvoicing[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })

            if (country.value === 'CO') 
            {
                /*const inputState = document.querySelector('#form-invoicing-select-4-0') as HTMLInputElement
                const inputCity = document.querySelector('#form-invoicing-select-4-1') as HTMLInputElement
                const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;*/
                dataFormInvoicing.idciudad = null //Number(inputCity.dataset?.value);
                dataFormInvoicing.idestado = null //Number(inputState.dataset?.value); 
                dataFormInvoicing.codigociudad = null //codigoCiudad;
                dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);

            }
            else if (country.value === 'MX')
            {
                const inputState = document.querySelector('[name="estado"]') as HTMLSelectElement;
                const inputCity = document.querySelector('[name="ciudad"]') as HTMLSelectElement;
                const inputTaxRegime = document.querySelector('[name="idregimenfiscal"]') as HTMLSelectElement;
                const inputPaymentGroupCode = document.querySelector('[name="formapago"]') as HTMLSelectElement;
                const codigoEstado = stateContext.value.listadoestados.find((state: any) => state.value == inputState?.dataset?.value)?.codigoestado || null;    
                const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
                const regimenfiscal = stateContext.value.listadoRegimenesSat.find((tax: any) => tax.value == inputTaxRegime?.dataset?.value);

                const inputTipoPAgo = document.querySelector('[name="tipopago"]') as HTMLSelectElement;
                const tipoPago = stateContext.value.listadoTiposPagos.find((pay: any) => pay.value == inputTipoPAgo?.dataset?.value);
                dataFormInvoicing.idtipopago = Number(tipoPago.value);
                const monedafactura = document.querySelector('[name="idmonedafactura"]') as HTMLSelectElement;
                const idmonedafactura = stateContext.value.listadoMonedas.find((currency: any) => currency.value == monedafactura?.dataset?.value)?.value || null;
                dataFormInvoicing.idciudad = Number(inputCity.dataset?.value);
                dataFormInvoicing.idestado = Number(inputState.dataset?.value);
                dataFormInvoicing.codigoestado = codigoEstado;
                dataFormInvoicing.codigociudad = codigoCiudad;
                dataFormInvoicing.idregimenfiscal = Number(regimenfiscal.value);
                dataFormInvoicing.claveregimenfiscal =regimenfiscal.clave ||'';
                dataFormInvoicing.usocfdi =regimenfiscal.usocfdi||'';
                dataFormInvoicing.tipoid ='RFC';
                dataFormInvoicing.grupopagocodigo =Number(inputPaymentGroupCode?.dataset?.value);
                dataFormInvoicing.valorpagadofactura= valorpagado;
                dataFormInvoicing.idmonedafactura=idmonedafactura;
                dataFormInvoicing.fechapagofactura=dayjs(dataFormInvoicing.fechapagofactura).isValid() ? dayjs(dataFormInvoicing.fechapagofactura).format('YYYY-MM-DD'):'';
                
            }
            
            
            dataFormInvoicing.tipoPersona = radioTypePerson.value;
            dataFormInvoicing.origenFactura = country.value;
            dataFormInvoicing.codigovoucher = codvoucher;
        }    
        
        if(errorInvoicing == false )
        {        

            const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getRelationOrderInvoice", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataFormInvoicing)});
            const data =await response.json();

            if (!data.error) 
            {
                (document.querySelector('#input-voucher') as HTMLInputElement).value = '';
                (formInvoicing as HTMLFormElement).reset(); 
                contextLoading.value = {status:false, message:''}
               
                 infoVoucher.value = objectInfo
                stateContext.value = { ...stateContext.value, infopayment: objectInfo}
               
                 toastSuccess.show()
                 setTimeout(() => {
                     window.location.reload();
                 }, 1000);
            }
            else{
                msgTost.value = data.mensaje || 'Ocurrió un error';
                toastError.show()
                contextLoading.value = {status:false, message:''}
            }
        }




         
    })
     
    const validationCodeVoucher$ = $(async(e:any) => {
        e.preventDefault();
        if (e.target.value != '') {
             const bs = (window as any)['bootstrap']
            //const toastSuccess = new bs.Toast('#toast-success',{})
            const toastError = new bs.Toast('#toast-error',{})
            contextLoading.value = {status:true, message:''}
            const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getValidationVoucher",
                    {method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({codigovoucher:e.target.value,codigopais:country.value})});
            const data =await response.json();

                if (data.error) 
                {
                    contextLoading.value = {status:false, message:''}
                    msgTost.value = data.mensaje || 'Ocurrió un error';
                    toastError.show()

                }
                else{
                contextLoading.value = {status:false, message:''}
                data.resultado.preciototal = parseFloat(data.resultado.preciototal);
                stateContext.value = { ...stateContext.value, infopayment: data.resultado }
                infoVoucher.value =data.resultado
                }
        }
       
        
    });

    return (
        <div class='container-fluid'>
                             
                <div class='row bg-image bg-contact-us-option-1 mt-5'>
                    <div class='col-xl-12 mt-5'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12 text-center'>
                                    <h2 class='h1 text-semi-bold text-dark-blue mb-3'>Facturación</h2>
                                    <hr class='divider my-5'></hr>
                                    <h3 class='h5 text-dark-gray'>¡Importante antes de enviar el formulario, verifica tus datos de facturación!</h3>
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
                                                        onBlur$={validationCodeVoucher$}
                                                        required={true}
                                                    />

                                                </div>
                            {
                                infoVoucher.value.created_at &&
                                <ul class="list-group list-group-horizontal mt-3 align-items-center justify-content-center">
                                    <li class="list-group-item list-group-item-light"><b>Fecha de emisión:</b> {infoVoucher.value.created_at}</li>
                                    <li class="list-group-item list-group-item-light"><b>Tasa de Cambio:</b> {infoVoucher.value.tasacambio}</li>
                                    <li class="list-group-item list-group-item-light"><b>Total voucher:</b> ${infoVoucher.value.preciototal} {infoVoucher.value.codigomoneda} </li>
                                </ul>
                            }
                                               
                                                        
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