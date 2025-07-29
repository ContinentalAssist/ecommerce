import { $, component$, useOnWindow, useSignal, useStylesScoped$,useContext} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import ImgContinentalAssistLogo from "~/media/ca/continental-assist-favicon.webp?jsx";
import { LoadingContext } from "~/root";

import styles from "./index.css?inline";

export const head: DocumentHead = {
  title: "Continental Assist | Chatea con nuestras Condiciones",
  meta: [
    { name: "robots", content: "index, follow" },
    { name: "title", content: "Continental Assist | Chatea con nuestras Condiciones" },
    {
      name: "description",
      content: "Chatea con nuestra Condiciones. Resuelve tus dudas respecto a nuestras politicas",
    },
    { property: "og:title", content: "Continental Assist | Chatea con nuestras Condiciones" },
    {
      property: "og:description",
      content: "Chatea con nuestra Condiciones. Resuelve tus dudas respecto a nuestras politicas",
    },
  ],
  links: [{ rel: "canonical", href: "https://continentalassist.com/chat-conditions" }],
};

export default component$(() => {
  useStylesScoped$(styles);
  const array: any[] = [];

  const dataChatBox = useSignal(array);
  const lastMessage = useSignal("");
  const disableElement = useSignal(false);
  const contextLoading = useContext(LoadingContext)

  useOnWindow(
    "load",
    $(() => {
      contextLoading.value = {status:false, message:''}
    })
  );
  // Funcion para obtener respuesta de la iA
  const getChatAksYourPdf$ = $(async () => {
    const data = 
      {
        pregunta:  lastMessage.value
      }


    disableElement.value = true;

    const resChat = await fetch("/api/getAskQuestion", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const dataChat = await resChat.json() ?? {};

    const tempChat = [...dataChatBox.value];    
    if ('resultado' in dataChat) {
      if ('question' in dataChat.resultado) {
        if (dataChatBox.value.length < 3) {
          tempChat.push(dataChat.resultado);
        } else {
          tempChat.shift();
          tempChat.push(dataChat.resultado);
        }
        if (dataChat.resultado != undefined) {
          dataChatBox.value = tempChat;
        }
        
      }
    }
    
    lastMessage.value = "";
    disableElement.value = false;

  });

  // Copiar a portapapeles
  const copyToClipboard = $((texto: string) => {
    navigator.clipboard
      .writeText(texto)
      .then(function () {})
      .catch(function () {});
  });

  const changeText$ = $(async (value: any) => {
    lastMessage.value = value;
  });

  return (
    <>

  <div class='container-fluid'>
      <div class='row bg-contact-us-header  pt-5'>
          <div class='col-xl-12  pt-4'>
              <div class='container'>
                  <div class='row justify-content-center align-items-end pt-4'>
                      <div class='col-lg-12 text-center '>
                          <h1 class="text-semi-bold text-blue">
                            <span class="text-tin">Hazle una pregunta a nuestras </span>
                            <br /> condiciones generales más recientes                            
                          </h1>                         
                          <p class="text-regular text-dark-blue">
                          *Recuerda revisar cuál es el condicionado que aplica a tu plan según la fecha de emisión*
                          <br /> Inicia tu consulta y resuelve todas tus dudas al instante</p>
                          <hr class="divider my-3" />
                      
                      </div>
                  </div>
              </div>
          </div>

          <div class='col-xl-12 '>
          <div class='container  mb-5'>
            <div class='row justify-content-center '>
            <div class="card" id="chat1" style={{ borderRadius: "15px",}}>
                <div class="card-body " >
                  <div class="row bg-chat" style={{ height: "390px", overflowY: "auto" }}>
                    {dataChatBox.value.length > 0 &&
                      dataChatBox.value.map((data) => {
                        return (
                          <>
                            <div class="d-flex flex-row justify-content-end mb-4">
                              <div
                                class="p-3 me-3 border  bg-body-tertiary"
                                style={{ borderRadius: "15px", backgroundColor: "#1D2546 !important" }}
                              >
                                <p class="small text-white mb-0">{data?.question?.message}</p>
                              </div>
                              <div
                                class="circle-dark-blue d-flex align-items-center align-self-center justify-content-center   text-center"
                                
                              >
                                <i class="fa-solid fa-user text-white" />
                              </div>
                            </div>

                            <div class="d-flex flex-row justify-content-start mb-4">
                              <div
                                class="d-flex align-items-center align-self-center justify-content-center   text-center"
                                style={{ borderRadius: "50%", backgroundColor: "white", height: "45px", width: "45px" }}
                              >
                                <ImgContinentalAssistLogo
                                  title="continental-assist-logo"
                                  alt="continental-assist-logo"
                                  style={{ height: "30px", width: "30px" }}
                                />
                              </div>

                              <div
                                class="d-flex align-items-end flex-column p-3 ms-3"
                                style="border-radius: 15px; background-color: white;"
                              >
                                <div class="small text-dark-blue mb-0" dangerouslySetInnerHTML={data?.answer?.message}/>
                               
                                <div
                                  class="mt-auto p-2"
                                  onClick$={() => {
                                    copyToClipboard(String(data?.answer?.message));{{data?.answer?.message}}
                                  }}
                                >
                                  <i class="fa-regular fa-copy" style={{ cursor: "pointer" }} />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>

                <div class="card-footer ">
                  <div class="row ">
                    <div class="col-2 mt-1 ">
                    <div
                      class="circle-dark-blue d-flex align-items-center align-self-center justify-content-center    text-center"
                      style={{ cursor: "pointer" }}
                      onClick$={()=>{dataChatBox.value=[]}}
                    >
                      <i class="fa-regular fa-trash-can text-white"/>

                    </div>            
                    </div>

                    <div class='col-8'>
                        <input 
                            id='input-cupon' 
                            name='message' 
                            type='text' 
                            class='form-control text-center' 
                            placeholder="Escribe tu pregunta"
                            required= {true}
                            onChange$={(e: any) => {                                  
                              changeText$(e.target.value);
                            }}
                            disabled={disableElement.value}
                            value={lastMessage.value}
                            autocomplete="off"
                            // onBlur$={getCupon$}
                        />

                    </div>
              
                    <div class="col-2 mt-1 ">
                      <div class="row  justify-content-end pe-1">
                     {disableElement.value?
                      <img class="mb-3" src='/assets/img/ca/continental-assist-loading.webp' alt='continental-assist-loading' style={{width:'60px'}}/>
                     :
                     <div
                     class="circle-light-blue d-flex align-items-center align-self-center justify-content-center   text-center"
                     style={{ cursor: "pointer" }}
                     onClick$={()=>{getChatAksYourPdf$()}}>
                     <i class="fa-regular fa-paper-plane text-white" />

                   </div> 
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
          </div>

    
    </>

  );
});
