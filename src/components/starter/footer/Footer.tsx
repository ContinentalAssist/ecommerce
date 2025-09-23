import {component$, useSignal, useStylesScoped$,  useVisibleTask$ ,Fragment} from "@builder.io/qwik";
//import { useLocation } from '@builder.io/qwik-city';

//import ImgContinentalAssistWhatsappChat from '~/media/icons/continental-assist-whatsapp-chat.png?jsx';
import ImgContinentalAssistLogo from '~/media/ca/continental-assist-logo.webp?jsx';

import styles from './footer.css?inline'

export const Footer = component$(() => {
    useStylesScoped$(styles)
 //   const location = useLocation()

 //   const showQuestion = useSignal(true)
   // const showChat = useSignal(false)
    const urlsWhats : any[] = [
        {country:'CO',url:'https://wa.me/573176216304'},
        {country:'MX',url:'https://wa.me/525545669880'},
        {country:'',url:'https://wa.me/573157349522'}
    ]

    const urls : any[] = [
        {country:'CO',label:'Anexo A',url:'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/ANEXO%20A%20-%20Seguro%20aplicable%20a%20Colombia%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
        {country:'MX',urls:[
            {label:'Anexo B',url:'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/ANEXO%20B%20-%20Seguro%20aplicable%20a%20M%C3%A9xico%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'},
            {label:'Anexo D',url:'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/ANEXO%20D%20-%20Responsabilidad%20Civil%20Familiar%20%28Exclusivamente%20Para%20Planes%20Emitidos%20En%20M%C3%A9xico%29.pdf'}
        ]},
        {country:'',label:'Anexo C',url:'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/ANEXO%20C%20-%20Seguro%20aplicable%20a%20Otros%20Pa%C3%ADses%20-%20Muerte%20accidental%20y%20p%C3%A9rdidas%20org%C3%A1nicas.pdf'}
    ]

    const attachment = useSignal(urls[2])
    const whats = useSignal(urlsWhats[2].url)

    useVisibleTask$(async() => {
        const resGeo = await fetch('https://us-central1-db-service-01.cloudfunctions.net/get-location')
          .then((response) => {
              return(response.json())
          })

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
/*         if(location.url.pathname == '/')
            {
                showQuestion.value = true
            }
            else
            {
                showQuestion.value = false
            }     */
       
    })
      

    return(
        <footer class='container-fluid'>
            <div class='row bg-primary'>
                <div class='col-xl-12'>
                    <div class='container'>
                        <div class='row align-content-center mt-2 mb-3'>
                         <div class='mobile'>
                            <div class='col-sm-12 mt-3'>
                                <div class='container'>
                                    <div class='row justify-content-center align-items-center flex-nowrap'>
                                        <div class='col-auto text-center me-3 mt-0'>
                                            <a title='Inicio' href="/">
                                            <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/logo-min-02.png" style="width: 60px; height: 35px;" title='continental-assist-logo' alt='continental-assist-logo' />
                                            </a>
                                        </div>
                                        <div class='col-auto text-center align-content-center me-2'>
                                        <a title='LinkedIn' href="https://www.linkedin.com/company/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-linkedin text-white fa-2xl"></i>
                                            </a>
                                        </div>
                                        <div class='col-auto text-center align-content-center me-2'>
                                            <a title='Instagram' href="https://instagram.com/continentalassist" rel="noopener" target="_blank">
                                                <i class="fab fa-instagram-square text-white fa-2xl"></i>
                                            </a>
                                        </div>
                                        <div class='col-auto text-center align-content-center me-2'>
                                            <a title='Facebook' href='https://www.facebook.com/continentalassist' rel="noopener" target="_blank">
                                                <i class="fab fa-facebook-square text-white fa-2xl"></i>
                                            </a>
                                        </div>
                                        <div class='col-auto text-center align-content-center'>
                                            <a title='Youtube' href="https://www.youtube.com/channel/UCzEhpTYaKckVnVKIR_thZHg" rel="noopener" target="_blank">
                                                <i class="fab fa-youtube-square text-white fa-2xl"></i>
                                            </a>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            </div>

                            <div class='col-lg-6 text-lg-start  text-xs-start'>
                                <a title='Agentes' class="text-regular text-white" href="https://eva.continentalassist.com" target="_blank">Acceso Agentes</a>
                                <br/>
                                {/*   <a title='Corporativos' class="text-regular text-white" href="https://www.continentalassist.co/backmin/corp/signin.php" target="_blank">Acceso Corporativo</a>
                                <br/> */}
                                <a title='Condiciones' href="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/Continental%20Assist%20-%20Condiciones%20Generales%20Enero%202025.pdf" target='_blank' rel="noopener" class='text-regular text-white mb-2'>Condiciones generales para planes emitidos el 13 de enero de 2025 y posteriores.
                                </a>
                                <br/>
                                <a title='Condiciones' href="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/Condiciones%20Generales%20-%20Versi%C3%B3n%203.pdf" target='_blank' rel="noopener" class='text-regular text-white mb-2'>Condiciones generales para planes emitidos el 12 de enero de 2025 y anteriores.</a>
                                <br/>                                
                                {
                                    attachment.value.urls != undefined
                                    ?
                                    attachment.value.urls.map((data:any,index:number) => {
                                        return(
                                           <Fragment key={index}>
                                                <a key={'url-'+index} title={data.label} class="text-regular text-white" href={data.url} target='_blank'>{data.label}</a>
                                                {
                                                    (index+1) == Array(attachment.value.urls).length
                                                    &&
                                                    <br/>
                                                }
                                            </Fragment>
                                        )
                                    })
                                    :
                                    <a class="text-regular text-white" href={attachment.value.url} target='_blank'>{attachment.value.label}</a>
                                }
                                <br/>
                                <a title='Tratamiento Informacion' href='https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/terminosycondiciones/Pol%C3%ADtica%20de%20Tratamiento%20de%20la%20Informaci%C3%B3n%20y%20Privacidad%20Continental%20Assist.pdf' target='_blank' rel="noopener" class='text-regular text-white'>Políticas de Tratamiento de la Información y Privacidad</a>
                            </div>
                            <div class='not-mobile col-lg-6 col-sm-12 mt-3'>
                                <div class='container'>
                                    <div class='row justify-content-center'>
                                        <div class='col-lg-3 col-sm-12 col-xs-12 text-center mb-3'>
                                            <a title='Inicio' href="/">
                                                <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/logo-min-02.png" style="margin: 18px 15px 0 0; width: 75px; height: 45px;" title='continental-assist-logo' alt='continental-assist-logo' />
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

                        <div class="row m-0 mb-3">
           
                        <div class="col-lg-4 col-sm-12  d-flex justify-content-start mt-4" style={{borderLeft:'2px solid #505051'}}>
                            <span>
                                <p class='title-country text-white ms-2 text-semi-bold'>Aventura, Florida </p>
                                <p class='text-white ms-2 text-regular-1'>20803 Biscayne Boulevard, suite 370</p> 
                                <p class='text-white ms-2 text-regular-1'>+1(786) 800 2764</p>
                                <p class='text-white ms-2 text-regular-1'>info@continentalassist.com</p>      
                            </span>                           
                        </div>
                        <div class="col-lg-4 col-sm-12 d-flex justify-content-start mt-4" style={{borderLeft:'2px solid #505051'}}>
                        
                            <span>
                                <p class='title-country text-white ms-2 text-semi-bold'>Ciudad de México, México </p>
                                <p class='text-white ms-2 text-regular-1'>Avenida Insurgentes 662, piso 7A</p>  
                                <p class='text-white ms-2 text-regular-1'>+52 1 (55) 30987684 - +52 1 (55) 7928 1978</p>   
                                <p class='text-white ms-2 text-regular-1'>info@continentalassist.com</p>   
                            </span>
                        </div>
                        <div class="col-lg-4 col-sm-12 d-flex justify-content-start mt-4" style={{borderLeft:'2px solid #505051'}}>
                        
                            <span>
                                <p class='title-country text-white ms-2 text-semi-bold'>Bogotá, Colombia  </p>
                                <p class='text-white ms-2 text-regular-1'>Autopista norte # 114 – 44, oficina 603</p>
                                <p class='text-white ms-2 text-regular-1'> +(57) 601 508 6267</p>  
                                <p class='text-white ms-2 text-regular-1'>info@continentalassist.com</p>                         
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