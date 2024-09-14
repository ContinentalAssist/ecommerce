import { component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
//import ImgContinentalAssistWhatsappChat from '~/media/icons/continental-assist-whatsapp-chat.png?jsx';

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
                WGenesys("command", "Launcher.show",
                    {},
                        function() {
                            console.log("hola");
                            showChat.value =true;
                            /*fulfilled callback*/
                        },
                        function() {
                            /*rejected callback*/
                        }
                    );
             /*    //Inicia chat
                WGenesys("command", "Messenger.open", {},
                    function(o:any){
                        showChat.value =true;

                    },  // if resolved
                  ) */
                //Valida cuando se borra la conversacion
                WGenesys("subscribe", "MessagingService.conversationCleared", function(){

                    showChat.value =false;
                    showButtonQuestion.value = true;
                });
               
               
                WGenesys('command', 'Messenger.minimize', {}, function() {
                    console.log('Chat minimizado');
                    // Aquí puedes agregar tu lógica personalizada
                  });

                  WGenesys("subscribe", "Launcher.hidden", function(){
                    console.log('Launcher.hidden');
                  });

            }
        }, 5000);
       
    
    })
/* 
    const openMessenger$ = $(() => {
        const WGenesys = (window as any)['Genesys']
        console.log('Opening messenger...');
        WGenesys('command', 'Messenger.open',{},
            function(o:any){
                showChat.value =true;
                showButtonQuestion.value = false;
            },);

    }); */

/*     const closeMessenger$ = $(() => {
        console.log('Closing messenger...');

        const WGenesys = (window as any)['Genesys']
        //showButtonQuestion.value = true;

        console.log('Closing messenger...');
        WGenesys('command', 'Messenger.close');
    }); */

   /*  const toggleMessenger$ = $(async()=>{

       !showChat.value? closeMessenger$() : openMessenger$();   
    }) */
      
    return(
        <>
        <div id="custom-launcher"></div>
        
        </>

        
    )
})