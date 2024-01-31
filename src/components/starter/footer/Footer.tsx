import { Fragment, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './footer.css?inline'

import ImgContinentalAssistWhatsappChat from '~/media/icons/continental-assist-whatsapp-chat.png?jsx';
import ImgContinentalAssistLogo from '~/media/ca/continental-assist-logo.webp?jsx';

export const Footer = component$(() => {
    useStylesScoped$(styles)

    const urls : any[] = [
        {country:'CO',label:'Anexo A',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20A%20-%20Seguro%20aplicable%20a%20Colombia%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
        {country:'MX',urls:[
            {label:'Anexo B',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20B%20-%20Seguro%20aplicable%20a%20M%C3%A9xico%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
            {label:'Anexo D',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20D%20-%20Responsabilidad%20Civil%20Familiar%20(Exclusivamente%20Para%20Planes%20Emitidos%20En%20Me%CC%81xico).pdf'}
        ]},
        {country:'',label:'Anexo C',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20C%20-%20Seguro%20aplicable%20a%20Otros%20Pa%C3%ADses%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'}
    ]

    const attachment = useSignal(urls[2])

    useVisibleTask$(async() => {
        const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
            .then((response) => {return(response.json())})

        urls.map(url => {
            if(url.country === resGeo.country)
            {
                attachment.value = url
            }
        })
    })

    return(
        <footer class='container-fluid'>
            <div id='icon-chat' class="dropup-end dropup">
                <ImgContinentalAssistWhatsappChat data-bs-toggle="dropdown" aria-expanded="false" title='continental-assist-whatsapp-chat' alt='continental-assist-whatsapp-chat'/>
                <ul class="dropdown-menu">
                    <h2 class='h6 text-blue'>¿Desde dónde te contactas?</h2>
                    <li>
                        <a title='WhatsApp Mexico' class="dropdown-item" href="https://wa.me/525545669880?text=¡Hola!%20Necesito%20asistencia" target="_blank" rel="noopener">México</a>
                    </li>
                    <li>
                        <a title='WhatsApp Colombia' class="dropdown-item" href="https://wa.me/573176216304?text=¡Hola!%20Necesito%20asistencia" target="_blank" rel="noopener">Colombia</a>
                    </li>
                    <li>
                        <a title='WhatsApp Otros' class="dropdown-item" href="https://wa.me/573157349522?text=¡Hola!%20Necesito%20asistencia" target="_blank" rel="noopener">Otro lugar</a>
                    </li>
                </ul>
            </div>
            <div class='row bg-primary'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row align-content-center mt-2 mb-3'>
                            <div class='col-lg-6 text-lg-start text-center '>
                                <a title='Agentes' class="text-regular text-white" href="https://www.continentalassist.co/backmin/signin.php" target="_blank">Acceso Agentes</a>
                                <br/>
                                <a title='Corporativos' class="text-regular text-white" href="https://www.continentalassist.co/backmin/corp/signin.php" target="_blank">Acceso Corporativo</a>
                                <br/>
                                <a title='Condiciones Generales' href="/general-conditions" target='_blank' class='text-regular text-white mb-2'>Condiciones Generales</a>
                                <br/>
                                {
                                    attachment.value.urls != undefined
                                    ?
                                    attachment.value.urls.map((data:any,index:number) => {
                                        return(
                                            <Fragment key={index}>
                                                <a title={data.label} class="text-regular text-white" href={data.url} target='_blank' rel="noopener">{data.label}</a>
                                                {
                                                    (index+1) == Array(attachment.value.urls).length
                                                    &&
                                                    <br/>
                                                }
                                            </Fragment>
                                        )
                                    })
                                    :
                                    <a title={attachment.value.label} class="text-regular text-white" href={attachment.value.url} target='_blank'>{attachment.value.label}</a>
                                }
                                <br/>
                                <a title='Tratamiento Informacion' href='/information-treatment-privacy-policies' target='_blank' class='text-regular text-white'>Políticas de Tratamiento de la Información y Privacidad</a>
                            </div>
                            <div class='col-lg-6 col-sm-12 mt-3'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-lg-3 col-sm-12 col-xs-12 text-center mb-3'>
                                            <a title='Inicio' href="/">
                                                <ImgContinentalAssistLogo title='continental-assist-logo' alt='continental-assist-logo'/>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center'>
                                            <a title='LinkedIn' href="https://www.linkedin.com/company/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-linkedin"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center'>
                                            <a title='Instagram' href="https://instagram.com/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-instagram-square"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center'>
                                            <a title='Facebook' href='https://www.facebook.com/continentalassist' rel="noopener" target="_blank">
                                                <i class="fab fa-facebook-square"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center'>
                                            <a title='Youtube' href="https://www.youtube.com/channel/UCzEhpTYaKckVnVKIR_thZHg" rel="noopener" target="_blank">
                                                <i class="fab fa-youtube-square"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='row bg-secondary'>
                <div class='col-xl-12 text-center'>
                    <p><b>Continental Assist</b> © {new Date().getFullYear()} Todos los Derechos Reservados</p>
                </div>
            </div>
        </footer>
    )
})