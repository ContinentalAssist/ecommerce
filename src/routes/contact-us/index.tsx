import { $, component$, useOnWindow, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import styles from './index.css?inline'
import ImgContinentalAssistDots from '~/media/img/icons/continental-assist-dots.png?jsx'
import ImgContinentalAssistQrPhone from '~/media/img/icons/continental-assist-qr-phone.webp?jsx'
import ImgContinentalAssistPhone from '~/media/img/icons/continental-assist-phone.webp?jsx'
import ImgContinentalAssistMail from '~/media/img/icons/continental-assist-mail.webp?jsx'



export const head: DocumentHead = {
    title: 'Continental Assist | Contactanos',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Contactanos'},
        {name:'description',content:'Contáctanos por alguno de estos medios en caso requerir nuestra asistencia. Continental Assist cuenta con los siguientes: WhatsApp, Email, línea de atención.'},
        {property:'og:title',content:'Continental Assist | Contactanos'},
        {property:'og:description',content:'Contáctanos por alguno de estos medios en caso requerir nuestra asistencia. Continental Assist cuenta con los siguientes: WhatsApp, Email, línea de atención.'},
    ],
    links: [
        {rel:'canonical',href: 'https://continentalassist.com/contact-us'},
    ],
};

export default component$(() => {
    useStylesScoped$(styles)

    const array : any[] = []

    const countries = useSignal(array)
    const subjects = useSignal(array)
    const loading = useSignal(true)

    useVisibleTask$(async() => {
        const resCountries : any[] = []
        const resSubjects : any[] = [
            {value:1,label:'Emergencia'},
            {value:2,label:'Consulta sobre su plan de asistencia'},
            {value:3,label:'Quiero ser agente de venta'}
        ]
        let resSelects : {[key:string]:any} = {}

        const resDefaults = await fetch("/api/getDefaults",{method:"GET"});
        const dataDefaults = await resDefaults.json()
        resSelects = dataDefaults

        if(resSelects.error == false)
        {
            resSelects.resultado[0].origenes.map((pais:any) => {
                resCountries.push({value:pais.idpais,label:pais.nombrepais})
            })

            countries.value = resCountries
            subjects.value = resSubjects
        }
        else
        {
            countries.value = []
            subjects.value = []
        }
    })

    useOnWindow('load',$(() => {
        loading.value = false
    }))

    const getForm$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const toastSuccess = new bs.Toast('#toast-success',{})
        const toastError = new bs.Toast('#toast-error',{})
        
        const form  = document.querySelector('#form-contact') as HTMLFormElement
        const inputs = Array.from(form.querySelectorAll('input,select,textarea'))
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

                if(input.classList.value.includes('form-select'))
                {
                    dataForm[(input as HTMLInputElement).name] = String((input as HTMLInputElement).dataset.value)
                }
            })

            error = false
        }

        if(error === false)
        {
            dataForm.ps = 'www.continentalassist.com'
            dataForm.idmotivo = Number(dataForm.idmotivo)
            dataForm.idpais = Number(dataForm.dondecontactame)
            
            let resContact : {[key:string]:any} = {}

            const resCont = await fetch("/api/getContact",{method:"POST",body:JSON.stringify(dataForm)});
            const dataContac = await resCont.json()
            resContact = dataContac
    
            if(resContact.error == false)
            {
                toastSuccess.show()
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
                <div class='row bg-contact-us-header'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row justify-content-center align-items-end h-50'>
                                <div class='col-lg-12 text-center'>
                                    <h1 class='text-semi-bold text-blue'>3 opciones</h1>
                                    <hr class='divider my-5'/>
                                    <h2 class='h5 text-center text-dark-gray'>Contáctanos por alguno de estos medios en caso requerir nuestra asistencia.</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='co-lg-12'>
                        <div class='container' style={{maxWidth:'1140px'}}>
                            <div class='row mt-4'>
                                <div class='col-lg-4 text-center mb-5'>
                                    <a title='QR' href='https://wa.me/18602187561?text=¡Hola!%20Necesito%20asistencia' target="_blank">
                                        <ImgContinentalAssistQrPhone style={{margin:'20px'}} class='img-contact' title='continental-assist-qr-phone' alt='continental-assist-qr-phone'/>
                                    </a>
                                    <h3 class='text-semi-bold text-blue'>WhatsApp</h3>
                                    <p class='text-dark-blue'><span class='text-semi-bold'>Escanea o cliquea</span> este QR para<br/>contactarnos al número:</p>
                                    <a title='WhatsApp Asistencia' class='text-mark text-semi-bold' href='https://wa.me/18602187561?text=¡Hola!%20Necesito%20asistencia' target="_blank">+18602187561</a>
                                    <br/>
                                    <ImgContinentalAssistDots class='img-fluid line-dots-left' title='continental-assist-dots' alt='continental-assist-dots'/>
                                </div>
                                <div class='col-lg-4 text-center mb-5'>
                                    <ImgContinentalAssistPhone class='img-contact' title='continental-assist-phone' alt='continental-assist-phone'/>
                                    <h3 class='text-semi-bold text-blue'>Llamada</h3>
                                    <p class='text-dark-blue'><span class='text-semi-bold'>Llámanos</span> a la línea<br/>internacional:</p>
                                    <a title="Telefono Asistencia" class='text-mark text-semi-bold' href="tel:1-305-722-5824">1-305-722-5824</a>
                                    <br/>
                                    <ImgContinentalAssistDots class='img-fluid line-dots-left' title='continental-assist-dots' alt='continental-assist-dots'/>
                                </div>
                                <div class='col-lg-4 text-center mb-5'>
                                    <ImgContinentalAssistMail class='img-contact' title='continental-assist-mail' alt='continental-assist-mail'/>
                                    <h3 class='text-semi-bold text-blue'>Correo</h3>
                                    <br/>
                                    <p class='text-semi-bold text-dark-blue'>Envíanos un correo a:</p>
                                    <a title='Correo Asistencia' class='text-mark text-semi-bold' href="mailto:asistencia@continentalassist.com">asistencia@continentalassist.com</a>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row bg-image bg-contact-us-option-1 mt-5'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12 text-center'>
                                    <h2 class='h1 text-semi-bold text-dark-blue mb-3'>Formulario</h2>
                                    <hr class='divider my-5'></hr>
                                    <h3 class='h5 text-dark-gray'>¡Puedes dejarnos también aquí un mensaje!</h3>
                                    <div class='card mt-5 pt-3 pb-4 px-lg-5 shadow-lg'>
                                        <div class='card-body px-5 text-start'>
                                            {
                                                countries.value.length > 0 
                                                &&
                                                <Form
                                                    id='form-contact'
                                                    form={[
                                                        {row:[
                                                            {size:'col-lg-6',type:'text',label:'¿Cuál es tu nombre?',name:'nombrecontactame',required:true},
                                                            {size:'col-lg-6',type:'phone',label:'Indícanos tu teléfono de contacto',name:'telefonocontactame',required:true},
                                                        ]},
                                                        {row:[
                                                            {size:'col-lg-12',type:'email',label:'Tu correo electrónico',name:'correocontactame',required:true},
                                                        ]},
                                                        {row:[
                                                            {size:'col-lg-6',type:'select',label:'¿Desde dónde nos escribes?',name:'dondecontactame',required:true,options:countries.value},
                                                            {size:'col-lg-6',type:'select',label:'¿Cuál es tu motivo de contacto?',name:'idmotivo',required:true,options:subjects.value},
                                                        ]},
                                                        {row:[
                                                            {size:'col-lg-12',type:'textarea',label:'Escríbenos tu mensaje',name:'mensaje',required:true},
                                                        ]}
                                                    ]}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <br/>
                                    <div class='container'>
                                        <div class='row justify-content-center'>
                                            <div class='col-lg-2 col-sm-12'>
                                                <div class='d-grid gap-2'>
                                                    <button class='btn btn-primary btn-lg' onClick$={getForm$}>Enviar</button>
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
                                        <b>Tu mensaje se ha enviado!</b>
                                        <br/>
                                        <small>En unos minutos responderemos tus dudas.</small>
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
                                    <span class='text-start'>
                                        <b>Ocurrio un error!</b>
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