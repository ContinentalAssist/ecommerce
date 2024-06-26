import { component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from '@builder.io/qwik-city';

import ImgContinentalAssistWhatsappChat from '~/media/icons/continental-assist-whatsapp-chat.png?jsx';
import ImgContinentalAssistLogo from '~/media/ca/continental-assist-logo.webp?jsx';

import styles from './footer.css?inline'

export const Footer = component$(() => {
    useStylesScoped$(styles)
    const location = useLocation()

    const showQuestion = useSignal(true)

    const urlsWhats : any[] = [
        {country:'CO',url:'https://wa.me/573176216304'},
        {country:'MX',url:'https://wa.me/525545669880'},
        {country:'',url:'https://wa.me/573157349522'}
    ]

    const urls : any[] = [
        {country:'CO',label:'Anexo A',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20A%20-%20Seguro%20aplicable%20a%20Colombia%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
        {country:'MX',urls:[
            {label:'Anexo B',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20B%20-%20Seguro%20aplicable%20a%20M%C3%A9xico%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
            {label:'Anexo D',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20D%20-%20Responsabilidad%20Civil%20Familiar%20(Exclusivamente%20Para%20Planes%20Emitidos%20En%20Me%CC%81xico).pdf'}
        ]},
        {country:'',label:'Anexo C',url:'https://storage.googleapis.com/files-continentalassist-web/ANEXO%20C%20-%20Seguro%20aplicable%20a%20Otros%20Pa%C3%ADses%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'}
    ]

    const attachment = useSignal(urls[2])
    const whats = useSignal(urlsWhats[2].url)

    useTask$(async() => {
        const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
            .then((response) => {return(response.json())})

        urls.map(url => {
            if(url.country === resGeo.country)
            {
                attachment.value = url
            }
        })

        urlsWhats.map(what => {
            if(what.country === resGeo.country)
            {
                whats.value = what.url
            }
        })
    })

   useVisibleTask$(() => {                
        
        if(!location.url.pathname.includes('quotes-engine'))
        {
            showQuestion.value = true
        }
        else
        {
            showQuestion.value = false
        }
    })

    return(
        <footer class='container-fluid'>
            {
            showQuestion.value&&
            <div id='icon-chat' class="dropup-end dropup">
                <ImgContinentalAssistWhatsappChat data-bs-toggle="dropdown" aria-expanded="false" title='continental-assist-whatsapp-chat' alt='continental-assist-whatsapp-chat'/>
                <ul class="dropdown-menu">
                    <h2 class='h6 text-blue'>¿Desde dónde te contactas?</h2>
                    <li>
                        <a title='WhatsApp Mexico' class="dropdown-item" href="https://wa.me/525545669880?text=¡Hola!%20Necesito%20asistencia" target="_blank">México</a>
                    </li>
                    <li>
                        <a title='WhatsApp Colombia' class="dropdown-item" href="https://wa.me/573176216304?text=¡Hola!%20Necesito%20asistencia" target="_blank">Colombia</a>
                    </li>
                    <li>
                        <a title='WhatsApp Otros' class="dropdown-item" href="https://wa.me/573157349522?text=¡Hola!%20Necesito%20asistencia" target="_blank">Otro lugar</a>
                    </li>
                </ul>
            </div>
            }
            <div class='row bg-primary'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row align-content-center mt-2 mb-3'>
                            <div class='col-lg-6 text-lg-start text-center '>
                                <a title='Agentes' class="text-regular text-white" href="https://www.continentalassist.co/backmin/signin.php" target="_blank">Acceso Agentes</a>
                                <br/>
                                <a title='Corporativos' class="text-regular text-white" href="https://www.continentalassist.co/backmin/corp/signin.php" target="_blank">Acceso Corporativo</a>
                                <br/>
                                <a title='Condiciones' href="https://storage.googleapis.com/files-continentalassist-web/Condiciones%20Generales-Continental%20Assist.pdf" target='_blank' rel="noopener" class='text-regular text-white mb-2'>Condiciones Generales</a>
                                <br/>
                                {
                                    attachment.value.urls != undefined
                                    ?
                                    attachment.value.urls.map((data:any,index:number) => {
                                        return(
                                            <>
                                                <a title={data.label} class="text-regular text-white" href={data.url} target='_blank'>{data.label}</a>
                                                {
                                                    (index+1) == Array(attachment.value.urls).length
                                                    &&
                                                    <br/>
                                                }
                                            </>
                                        )
                                    })
                                    :
                                    <a class="text-regular text-white" href={attachment.value.url} target='_blank'>{attachment.value.label}</a>
                                }
                                <br/>
                                <a title='Tratamiento Informacion' href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20Tratamiento%20de%20la%20Informaci%C3%B3n%20y%20Privacidad%20Continental%20Assist.pdf' target='_blank' rel="noopener" class='text-regular text-white'>Políticas de Tratamiento de la Información y Privacidad</a>
                            </div>
                            <div class='col-lg-6 col-sm-12 mt-3'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-lg-3 col-sm-12 col-xs-12 text-center mb-3'>
                                            <a title='Inicio' href="/">
                                                <ImgContinentalAssistLogo title='continental-assist-logo' alt='continental-assist-logo'/>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-12 col-xs-2 text-center align-content-center'>
                                        <a title='LinkedIn' href="https://www.linkedin.com/company/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-linkedin text-white fa-3x"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center align-content-center'>
                                            <a title='Instagram' href="https://instagram.com/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-instagram-square text-white fa-3x"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center align-content-center'>
                                            <a title='Facebook' href='https://www.facebook.com/continentalassist' rel="noopener" target="_blank">
                                                <i class="fab fa-facebook-square text-white fa-3x"></i>
                                            </a>
                                        </div>
                                        <div class='col-lg-2 col-sm-1 col-xs-2 text-center align-content-center'>
                                            <a title='Youtube' href="https://www.youtube.com/channel/UCzEhpTYaKckVnVKIR_thZHg" rel="noopener" target="_blank">
                                                <i class="fab fa-youtube-square text-white fa-3x"></i>
                                            </a>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <hr style={{
                                    border: "1px solid white",
                                    }} />

            <div class="row mb-4">
           
           <div class="col-lg-4 col-sm-12 d-flex justify-content-start mt-4">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.985735448096!2d-80.14569492378439!3d25.968508177222603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9ac61deeaaaab%3A0x1f8ebcfc710b3a6!2s20803%20Biscayne%20Blvd%20%23370%2C%20Aventura%2C%20FL%2033180%2C%20USA!5e0!3m2!1sen!2smx!4v1719328736587!5m2!1sen!2smx" title="miami" width="130" height="100" style="border:0;" /* allowfullscreen="" */ loading="lazy"  referrerPolicy="no-referrer-when-downgrade"></iframe>
            <span>
            <h5 class='text-semi-bold text-white ms-3'>Aventura, Florida </h5>
            <p class='text-regular text-white ms-3'>20803 Biscayne Boulevard,<br/> suite 370</p>    
            </span>                           
          
                                                    
           </div>
           <div class="col-lg-4 col-sm-12 d-flex justify-content-start mt-4">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.4076889522435!2d-99.17450592393863!3d19.39478328187658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff726b264c77%3A0xff64be6d1cb1c152!2sAv.%20Insurgentes%20Sur%20662-piso%207A%2C%20Col%20del%20Valle%20Nte%2C%20Benito%20Ju%C3%A1rez%2C%2003103%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1sen!2smx!4v1719328936535!5m2!1sen!2smx" title="mexico" width="130" height="100" style="border:0;"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
           
           <span>
            <h5 class='text-semi-bold text-white ms-3'>Ciudad de México, México </h5>
            <p class='text-regular text-white ms-3'>Avenida Insurgentes 662, <br/>piso 7A</p>    
            </span>
           </div>
           <div class="col-lg-4 col-sm-12 d-flex justify-content-start mt-4">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.415730743903!2d-74.05644322412469!3d4.6976112952774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9ac821600df1%3A0xacb559c08b88e4ad!2sAutopista%20Nte.%20%23114-44%20oficina%20504%2C%20Bogot%C3%A1%2C%20Colombia!5e0!3m2!1sen!2smx!4v1719329016879!5m2!1sen!2smx" title="colombia" width="130" height="100" style="border:0;"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
           
           <span>
            <h5 class='text-semi-bold text-white ms-3'>Bogotá, Colombia  </h5>
            <p class='text-regular text-white ms-3'>Autopista norte # 114 – 44,<br class="not-mobile"/> oficina 504</p>    
            </span>
      
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