import { $, Fragment, component$, useOnWindow, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";

import ImgContinentalAssistPlane from '~/media/icons/continental-assist-plane.webp?jsx'

import styles from './index.css?inline'

export const head: DocumentHead = {
    title: 'Continental Assist | Buscar Voucher',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Buscar Voucher'},
        {name:'description',content:'Encuentra aquí tu voucher. Continental Assist te ofrecemos alternativas de búsqueda para encuentrar el voucher de tu plan de asistencia en viaje.'},
        {property:'og:title',content:'Continental Assist | Buscar Voucher'},
        {property:'og:description',content:'Encuentra aquí tu voucher. Continental Assist te ofrecemos alternativas de búsqueda para encuentrar el voucher de tu plan de asistencia en viaje.'},
    ],
    links: [
        {rel:'canonical',href: 'https://continentalassist.com/search-voucher'},
    ],
};

export default component$(() => {
    useStylesScoped$(styles)

    const objVoucher : {[key:string]:any,beneficiarios:[{[key:string]:any,beneficiosadicionales:any[]}],contactos:any[],beneficios:[{[key:string]:any,beneficios:any[]}]} = {beneficiarios:[{beneficiosadicionales:[]}],contactos:[{}],beneficios:[{beneficios:[]}]}

    const voucher = useSignal(objVoucher)
    const loading = useSignal(true)

    useOnWindow('load',$(() => {
        loading.value = false
    }))

    const getForm$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const toastError = new bs.Toast('#toast-error',{})
        const modal = new bs.Modal('#modalVoucher',{})
        const form  = document.querySelector('#form-voucher') as HTMLFormElement
        const inputs = Array.from(form.querySelectorAll('input,select'))
        const dataForm : {[key:string]:any} = {}
        let error = false
        
        if(!(form).checkValidity())
        {
            form.classList.add('was-validated')
            error = true
        }
        else
        {
            form.classList.remove('was-validated')

            inputs.map((input) => {
                dataForm[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })

            error = false
        }
       
        if(error == false)
        { 
          
            let resVoucher : {[key:string]:any} = {}

            const resData = await fetch("/api/getVoucher",{method:"POST",body:JSON.stringify(dataForm)});
            const data = await resData.json()
            resVoucher = data

            if(resVoucher.error == false)
            {
                voucher.value = resVoucher.resultado[0]
                modal.show()
            }
            else
            {
                toastError.show()
            }   
        }
    })

    return(
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <div class='container-fluid'>
                <div class='row bg-search-voucher-header'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row justify-content-end align-items-end h-50'>
                                <div class='col-lg-12 text-center'>
                                    <h1 class='text-semi-bold text-dark-blue'>
                                        <span class='text-tin'>Encuentra aquí</span> tu voucher
                                    </h1>
                                    <h2 class='h5 text-dark-gray'>Ingresa los datos y valida tu consulta</h2>
                                    <hr class='divider mt-5 mb-5'/>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <div class='card pt-3 pb-4 px-lg-5 shadow-lg'>
                                        <h2 class='h6 text-center text-gray px-2'>Puedes ingresar uno de los dos datos para realizar la consulta.</h2>
                                        <hr class='text-gray'></hr>
                                        <div class='card-body px-5 text-start'>
                                            <Form
                                                id='form-voucher'
                                                form={[
                                                    {row:[
                                                        {size:'col-lg-6',type:'text',name:'codigovoucher',label:'Número de voucher',placeholder:'Ejemplo: CA-PIKFXP-MX'},
                                                        {size:'col-lg-6',type:'text',name:'documentacion',label:'Identificación / Pasaporte'},
                                                    ]},
                                                ]}
                                            />
                                            <div class='container p-0'>
                                                <div class='row justify-content-center'>
                                                    <div class='col-lg-3'>
                                                        <div class='d-grid gap-2'>
                                                            <button type='button' id='inputVoucher' class='btn btn-primary btn-lg' onClick$={getForm$} >Buscar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class='row h-25'>
                                <div class='col-lg-12'>
                                    <div class='bg-city'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='modalVoucher' class="modal fade">
                    <div class="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <ImgContinentalAssistPlane class='img-fluid' title='continental-assist-plane' alt='continental-assist-plane'/>
                                <h2 class='text-semi-bold text-white'>{voucher.value.codigovoucher}</h2>
                            </div>
                            <div class="modal-body">
                                <div class='container p-0'>
                                    <div class='row'>
                                        <div class='col-lg-12'>
                                            <div class='table-responsive'>
                                                <table class='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={3}>Pasajero</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class='text-dark-gray' colSpan={3}>
                                                                <span class='text-semi-bold text-blue'>{voucher.value.beneficiarios[0].nombrebeneficiario} </span>
                                                                {voucher.value.beneficiarios[0].apellidobeneficiario}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class='text-dark-gray'>{voucher.value.beneficiarios[0].telefono}</td>
                                                            <td class='text-dark-gray'>{voucher.value.beneficiarios[0].documentacion}</td>
                                                            <td class='text-dark-gray'>{voucher.value.beneficiarios[0].edad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td class='text-dark-gray' colSpan={2}>{voucher.value.beneficiarios[0].correobeneficiario}</td>
                                                            <td class='text-dark-gray'>{voucher.value.beneficiarios[0].fechanacimiento}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-lg-12'>
                                            <div class='table-responsive'>
                                                <table class='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2}>Los datos de tu proxima aventura</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span class='text-semi-bold'>Fecha de salida:</span> 
                                                                <span class='float-end'>{voucher.value.fechadesde}</span>
                                                            </td>
                                                            <td>
                                                                <span class='text-semi-bold'>Numero de pasajeros:</span> 
                                                                <span class='float-end'>{voucher.value.beneficiarios.length}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span class='text-semi-bold'>Fecha de llegada:</span> 
                                                                <span class='float-end'>{voucher.value.fechahasta}</span>
                                                            </td>
                                                            <td>
                                                                <span class='text-semi-bold'>Niños y Jovenes:</span> 
                                                                <span class='float-end'>0</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span class='text-semi-bold'>Nro. de días:</span> 
                                                                <span class='float-end'>0</span>
                                                            </td>
                                                            <td>
                                                                <span class='text-semi-bold'>Adultos:</span> 
                                                                <span class='float-end'>0</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span class='text-semi-bold'>Origen:</span> 
                                                                <span class='float-end'>{voucher.value.nombrepais}</span>
                                                            </td>
                                                            <td>
                                                                <span class='text-semi-bold'>Adultos Mayores:</span> 
                                                                <span class='float-end'>0</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span class='text-semi-bold'>Destino:</span> 
                                                                <span class='float-end'>{voucher.value.destinos}</span>
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-lg-12'>
                                            <div class='table-responsive'>
                                                <table class='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={3}>Contacto de emergencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class='text-dark-gray' colSpan={3}>
                                                                <span class='text-semi-bold text-blue'>{voucher.value.contactos[0].nombrecontacto} </span>
                                                                {voucher.value.contactos[0].apellidobcontacto}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class='text-dark-gray' colSpan={2}>{voucher.value.contactos[0].correocontacto}</td>
                                                            <td class='text-dark-gray'>{voucher.value.contactos[0].telefonocontacto}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row table-benefits'>
                                        <div class='col-lg-12'>
                                            <div class='table-responsive'>
                                                <table class='table table-bordered table-striped'>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2}>Beneficos del plan {voucher.value.nombreplan}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            voucher.value.beneficios.map((benefit,bIndex) => {
                                                                return(
                                                                    <Fragment key={bIndex}>
                                                                        <tr>
                                                                            <td class='tr-title text-semi-bold text-dark-blue'>{benefit.nombrefamilia}</td>
                                                                        </tr>
                                                                        {
                                                                            benefit.beneficios.map((item,iIndex) => {
                                                                                return(
                                                                                    <tr key={bIndex+'-'+iIndex}>
                                                                                        <td class='text-blue'>{item.nombrebeneficio+' '+item.cobertura}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Fragment>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        {
                                            voucher.value.beneficiarios[0].beneficiosadicionales.map((benefit,index) => {
                                                return(
                                                    <div key={index} class='col-lg-6'>
                                                        <div class="card">
                                                            <div class='card-body'>
                                                                <div class='container'>
                                                                    <div class="row g-0 align-items-center">
                                                                        <div class="col-md-2 text-center" style={{paddingRight:'10px'}}>
                                                                            {/* {benefit.idbeneficioadicional == '37' && <img src='/assets/img/ca-icon-06.webp' class="img-fluid" alt="continental-assist-icon-06"/>}
                                                                            {benefit.idbeneficioadicional == '36' && <img src='/assets/img/ca-icon-07.webp' class="img-fluid" alt="continental-assist-icon-07"/>}
                                                                            {benefit.idbeneficioadicional == '35' && <img src='/assets/img/ca-icon-05.webp' class="img-fluid" alt="continental-assist-icon-08"/>} */}
                                                                        </div>
                                                                        <div class="col-md-7">
                                                                            <h5 class="card-title text-semi-bold text-light-blue">{benefit.nombrebeneficioadicional}</h5>
                                                                            {benefit.idbeneficioadicional == '37' && <p class="card-text text-gray">Protegemos a madres gestantes, de hasta 32 semanas.</p>}
                                                                            {benefit.idbeneficioadicional == '36' && <p class="card-text text-gray">Contigo, en experiencias recreativas.</p>}
                                                                            {benefit.idbeneficioadicional == '35' && <p class="card-text text-gray">Perfecto para tus condiciones medicas previas.</p>}
                                                                            <h4 class="card-text text-semi-bold color-green">Activo</h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div class='row'>
                                        <div class='col-lg-12'>
                                            <hr/>
                                            <div class='message-voucher'>
                                                <i class="fas fa-check-circle text-success"/>
                                                <small>
                                                    En caso de una emergencia el titular debera SIEMPRE obtener la autorizacion de la Central de Asistencia, antes de comprometer cualquier gasto en relacion a los beneficios de su Plan. 
                                                    De lo contrario perderá el derecho de reembolso por cualquier gasto realizado unilateralmente.
                                                </small>
                                            </div>
                                            <div class='message-voucher'>
                                                <i class="fas fa-check-circle text-success"/>
                                                <small>
                                                    En caso de una emergencia en la cual este en peligro la salud del Titular, debera de acudir de inmediato a un centro de antencion medica para recibir tratamiento, 
                                                    debiendo en todo caso notificar al Centro de Asistencia su emergencia dentro de las 24 horas de haber ocurrido,
                                                    por si o por intermedio de una tercera persona. De lo contrario debera asumir cualquier gasto realizado, sin derecho a reclamo a Continental.
                                                </small>
                                            </div>
                                            <div class='message-voucher'>
                                                <i class="fas fa-check-circle text-success"/>
                                                <small>
                                                    Al comunicarse con nuestra Central de Atencion debera proporcionar su nombre completo, numero de voucher, telefono, 
                                                    y direccion donde se encuentra y seguir las instrucciones que le imparta dicha Central.
                                                </small>
                                            </div>
                                            <hr/>
                                            <div class='message-voucher'>
                                                Si el servicio telefonico desde donde llamase el titular no pernmitiera esta llamada de froma gratuita, pedir una llmada por cobrar a Estados Unidos al numero +1.786.613.7102. 
                                                Tambien puede contactarnos por email a la direccion emergencia@continentalassist.com
                                            </div>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-lg-12'>
                                            <h2 class='text-semi-bold text-blue mb-3'>Descarga tu Voucher</h2>
                                        </div>
                                    </div>
                                    {
                                        voucher.value.urlvoucher
                                        &&
                                        <div class='row'>
                                            <div class='col-lg-3'>
                                                <div class='d-grid gap-2'>
                                                    <a href={voucher.value.urlvoucher} title={voucher.value.urlvoucher} class='btn btn-primary' target='_blank'>PDF</a>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
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
                                    <span>
                                        <b>Voucher no encontrado o datos incorrectos!</b>
                                        <br/>
                                        <small>Si el error persiste llama a nuestros números de contacto.</small>
                                    </span>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})