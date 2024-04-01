import { $, component$, useContext, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Loading } from "~/components/starter/loading/Loading";
import { QuotesEngineSteps } from "~/components/starter/quotes-engine/QuotesEngineSteps";
import { WEBContext } from "~/root";
import styles from './index.css?inline'
import Wompi from "./wompi";
import OpenPay from "./openPay";
import Authorize from "./authorize";

export const head: DocumentHead = {
    title : 'Continental Assist | Método de pago',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Método de pago'},
        {name:'description',content:'Paso 4 - Método de pago. Continental Assist protege tu información y tu medio de pago. Adquiere nuestros planes con total seguridad.'},
        {property:'og:title',content:'Continental Assist | Método de pago'},
        {property:'og:description',content:'Paso 4 - Método de pago. Continental Assist protege tu información y tu medio de pago. Adquiere nuestros planes con total seguridad.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/quotes-engine/step-4'},
    ],
}

export default component$(() => {
    useStylesScoped$(styles)

    const stateContext = useContext(WEBContext)
    // const navigate = useNavigate()

    const formPayment = useSignal('')
    const divisaManual = useSignal(stateContext.value.divisaManual)
    const loading = useSignal(true)

    useTask$(() => {
        if(Object.keys(stateContext.value).length > 0)
        {
            if(divisaManual.value == true)
            {
                formPayment.value = 'authorize' 
            }
            else
            {
                if(stateContext.value.resGeo.country == 'CO')
                {
                    formPayment.value = 'wompi' 
                }
                else if(stateContext.value.resGeo.country == 'MX')
                {
                    formPayment.value = 'openPay' 
                }
                else
                {
                    formPayment.value = 'authorize' 
                }
            }
        }
    })

    // const closeQuote$ = $(() => {
    //     const bs = (window as any)['bootstrap']
    //     const modalErrorAttemps = bs.Modal.getInstance('#modalErrorAttemps',{})
    //     modalErrorAttemps.hide()

    //     stateContext.value = {}
    // })

    const getLoading$ = $(() => {
        loading.value = false
    })
   
    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <QuotesEngineSteps active={4} hideForm/>
            <div class='container-fluid'>
                <div class='row bg-step-6'>
                    <div class='col-lg-12'>
                        <div class='container p-0'>
                            <div class='row align-content-center justify-content-center'>
                                <div class='col-lg-10 text-center mt-5'>
                                    <h1 class='text-semi-bold text-blue'>Método de pago</h1>
                                    <hr class='divider my-3'/>
                                    <h5 class='text-dark-gray mb-4'>Ingresa la información de tu tarjeta</h5>
                                </div>
                            </div>
                            {/* <div class='row mb-5'>
                                <div class='col-lg-12'>
                                    <div class='card card-body shadow-lg'>
                                        <div class='container'>
                                            <div class='row justify-content-center'>
                                                <div class='col-lg-4 mb-3'>
                                                    <div class='img-card'>
                                                        <div class='card-name'>{tdcname.value}</div>
                                                        <div class='card-number'>{tdcnumber.value}</div>
                                                        <div class='card-expiration'>{tdcexpiration.value}</div>
                                                        <img src='/assets/img/icons/continental-assist-card.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-card'/>
                                                    </div>
                                                </div>
                                                <div class='col-lg-4 offset-lg-1'>
                                                    <Form
                                                        id='form-payment-method'
                                                        form={[
                                                            {row:[
                                                                {size:'col-xl-12',type:'text',label:'Nombre completo',name:'tdctitular',required:true,onChange:$((e:any) => {getName$(e.target.value)}),textOnly:'true', dataAttributes: { 'data-openpay-card':'holder_name' }},
                                                                {size:'col-xl-12 credit-card',type:'number',label:'Número de tarjeta',name:'tdcnumero',required:true,onChange:getCardNumber$,disableArrows:true, dataAttributes: { 'data-openpay-card': 'card_number' }},
                                                            ]},
                                                            {row:[
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Mes',name:'tdcmesexpiracion',readOnly:true,required:true,options:months.value,onChange:$((e:any) => {getMonth$(e)}), dataAttributes: { 'data-openpay-card':'expiration_month' }},
                                                                {size:'col-xl-4 col-xs-4',type:'select',label:'Año',name:'tdcanoexpiracion',readOnly:true,required:true,options:years.value,onChange:$((e:any) => {getYear$(e)}), dataAttributes: { 'data-openpay-card':'expiration_year' }},
                                                                {size:'col-xl-4 col-xs-4 credit-card',type:'number',label:'CVV',name:'tdccvv',min:'0000',maxLength:'9999',required:true,disableArrows:true, dataAttributes: { 'data-openpay-card':'cvv2' }}
                                                            ]}
                                                        ]}
                                                    />
                                                    <div class='container'>
                                                        <div class='row'>
                                                            <div class='col-12'>
                                                                <div class="form-check form-check-inline my-3">
                                                                    <input class="form-check-input" type="checkbox" id={"invoicing"} name='required_invoicing' onClick$={showForm$}/>
                                                                    <label class="form-check-label" for={"invoicing"}>
                                                                        Requiero factura personalizada.
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='d-none' id='invoice'>
                                                        <Form
                                                            id='form-invoicing'
                                                            form={[
                                                                {row:[
                                                                    {size:'col-xl-12',type:'text',label:'Razon Social',name:'razonsocial',required:true,onChange:$((e:any) => {getName$(e.target.value)})},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-4 col-xs-4',type:'select',label:'Tipo ID',name:'tipoid',required:true,options:[
                                                                        {value:'RFC',label:'RFC'},
                                                                        {value:'CC',label:'CC'},
                                                                        {value:'PASAPORTE',label:'Pasaporte'},
                                                                        {value:'NIT',label:'NIT'}
                                                                    ]},
                                                                    {size:'col-xl-8 col-xs-8',type:'text',label:'ID',name:'id',required:true},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-12',type:'email',label:'Correo',name:'correo',required:true},
                                                                ]},
                                                                {row:[
                                                                    {size:'col-xl-6 col-xs-6',type:'tel',label:'Telefono',name:'telefono',required:true},
                                                                    
                                                                    {size:'col-xl-6 col-xs-6',type:'text',label:'C.P.',name:'codigopostal',required:true}
                                                                ]}
                                                            ]}
                                                        />
                                                    </div>
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-lg-6'>
                                                                <div class='d-grid gap-2 mt-4'>
                                                                    <button type='button' class='btn btn-primary' onClick$={getPayment$}>Realizar pago</button>
                                                                    {
                                                                        attempts.value > 0
                                                                        &&
                                                                        <span class='text-center rounded-pill text-bg-warning'>{attempts.value} intentos</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {
                                formPayment.value == 'wompi'
                                &&
                                <Wompi loading={getLoading$}/>
                            }
                            {
                                formPayment.value == 'openPay'
                                &&
                                <OpenPay loading={getLoading$}/>
                            }
                            {
                                formPayment.value == 'authorize'
                                &&
                                <Authorize/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <div id='modalConfirmation' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border border-success">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <img src='/assets/img/icons/continental-assist-success.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-success'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Compra exitosa!</h2>
                            {
                                urlvoucher.value.length > 4
                                ?
                                <>
                                    <p class='px-2 py-1 mb-0'>Ahora tu viaje cuenta con el respaldo ideal para olvidarse de imprevistos.</p>
                                    <p><b>Descargar Vouchers:</b></p>
                                </>
                                :
                                <>
                                    <p class='px-5 py-1 mb-0'>Ahora tu viaje cuenta con el respaldo ideal para olvidarse de imprevistos. Conecta con la magia del mundo, del resto nos encargamos nosotros.</p>
                                    <p><b>Descargar Vouchers:</b></p>
                                </>
                            }
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    {
                                        urlvoucher.value.map((voucher:any,index:number) => {
                                            return(
                                                <div key={index} class='col-lg-6'>
                                                    <div class='d-grid gap-2'>
                                                        <a title='Voucher' class='btn btn-primary btn-sm mt-2' href={voucher.link_voucher} target='_blank'>{voucher.nombrebeneficiario}</a>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-4'>
                                        <div class='d-grid gap-2'>
                                            {
                                                urlvoucher.value.length > 2
                                                ?
                                                <a title='Inicio' class={'btn btn-blue btn-lg mt-3'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                                :
                                                <a title='Inicio' class={'btn btn-blue btn-lg mt-5'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalError' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Pago rechazado!</h2>
                            <p class='px-5 py-3'>Revisa los datos de tu medio de pago e intenta de nuevo.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary btn-lg' data-bs-dismiss="modal">Volver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalErrorPax' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Voucher activo!</h2>
                            <p class='px-5 py-3'>Uno de los beneficiarios ya cuenta con un voucher activo para las fechas seleccionadas.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <button type='button' class='btn btn-primary btn-lg' data-bs-dismiss="modal">Volver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalErrorAttemps' class="modal fade" data-bs-backdrop="static">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content border border-danger">
                        <div class='modal-header text-center' style={{display:'block'}}>
                            <img src='/assets/img/icons/continental-assist-error.webp' class='img-fluid' width={0} height={0} alt='continental-assist-icon-error'/>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class='h1'>¡Has realizado tres intentos!</h2>
                            <p class='px-5 py-3'>Lo sentimos has superado el número de permitidos.</p>
                            <p></p>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-lg-6'>
                                        <div class='d-grid gap-2'>
                                            <a title='Inicio' class={'btn btn-blue btn-lg'} onClick$={closeQuote$} href="/">Volver al inicio</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
})