import { $,component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import ImgContinentalAssistWhatsappChat from '~/media/icons/continental-assist-whatsapp-chat.png?jsx';

import styles from './chat-genesys.css?inline'

/* interface propsCardResume {
    [key:string]:any
}
 */
export const ChatGenesys = component$(() => {
    useStyles$(styles)
    const showChat = useSignal(false);
    const showButtonQuestion =useSignal(true);
    useVisibleTask$(()=>{
       
        setInterval(() => {
            
            if ((window as any)['Genesys']&& !showChat.value) {
                const WGenesys = (window as any)['Genesys']

                //Inicia chat
            /*     WGenesys("command", "Messenger.open", {},
                    function(o:any){
                        showChat.value =true;

                    },  // if resolved
                  ) */
                //Valida cuando se borra la conversacion
                WGenesys("subscribe", "MessagingService.conversationCleared", function(data:any){

                    showChat.value =false;
                    showButtonQuestion.value = true;
                });
                  
            }
        }, 5000);
       
    
    })

    const openMessenger$ = $(() => {
        const WGenesys = (window as any)['Genesys']
        console.log('Opening messenger...');
        WGenesys('command', 'Messenger.open',{},
            function(o:any){
                showChat.value =true;
                showButtonQuestion.value = false;
            },);

    });

    const closeMessenger$ = $(() => {
        console.log('Closing messenger...');

        const WGenesys = (window as any)['Genesys']
        //showButtonQuestion.value = true;

        console.log('Closing messenger...');
        WGenesys('command', 'Messenger.close');
    });

   /*  const toggleMessenger$ = $(async()=>{

       !showChat.value? closeMessenger$() : openMessenger$();   
    }) */
      
    return(
        <>
        <div id="custom-launcher"></div>
        {
        showButtonQuestion.value && 
        <div id='icon-chat' class="dropup-end dropup">
               <ImgContinentalAssistWhatsappChat data-bs-toggle="dropdown" aria-expanded="false" title='continental-assist-whatsapp-chat' alt='continental-assist-whatsapp-chat'/>
                <ul id="custom-launcher"  class="dropdown-menu">
                    <h2 class='h6 text-blue'>Iniciar Chat </h2>
                    <li>
                        <a  title='WhatsApp Mexico' class="dropdown-item"  target="_blank"  onClick$={()=>openMessenger$()}>Messenger</a>
                    </li>
                    {/* <li>
                        <a title='WhatsApp Mexico' class="dropdown-item"  target="_blank" onClick$={()=>{openCoBrowsing$()}}>Sesión remota </a>
                    </li>
                    <h2 class='h6 text-blue'>¿Desde dónde te contactas?</h2>
                    <li>
                        <a title='WhatsApp Mexico' class="dropdown-item" href="https://wa.me/525545669880?text=¡Hola!%20Necesito%20asistencia" target="_blank">México</a>
                    </li>
                    <li>
                        <a title='WhatsApp Colombia' class="dropdown-item" href="https://wa.me/573176216304?text=¡Hola!%20Necesito%20asistencia" target="_blank">Colombia</a>
                    </li>
                    <li>
                        <a title='WhatsApp Otros' class="dropdown-item" href="https://wa.me/573157349522?text=¡Hola!%20Necesito%20asistencia" target="_blank">Otro lugar</a>
                    </li> */}
                </ul>
        </div>
        }
        </>

        
    )
})