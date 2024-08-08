import { $, component$, useOnWindow, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { Loading } from "~/components/starter/loading/Loading";
import ImgContinentalAssistLogo from "~/media/ca/continental-assist-favicon.webp?jsx";

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

  const loading = useSignal(true);
  const dataChatBox = useSignal(array);
  const lastMessage = useSignal("");
  const disableElement = useSignal(false);

  useOnWindow(
    "load",
    $(() => {
      loading.value = false;
    })
  );
  // Funcion para obtener respuesta de la iA
  const getChatAksYourPdf$ = $(async () => {
    const data = 
      {
        documents: ["dc49b407-f5aa-467d-8ef5-976e5dbd111e", "6241a75b-2be7-43de-8b44-66fd82456b04"],
        message:  lastMessage.value, 
      }


    disableElement.value = true;

    const resChat = await fetch("/api/getAskyourpdf", { method: "POST", body: JSON.stringify(data) });
    const dataChat = await resChat.json();

    const tempChat = [...dataChatBox.value];
    if ('question' in dataChat) {

      if (dataChatBox.value.length < 3) {
        tempChat.push(dataChat.data);
      } else {
        tempChat.shift();
        tempChat.push(dataChat.data);
      }
      if (dataChat.data != undefined) {
        dataChatBox.value = tempChat;
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
      .catch(function (err) {});
  });

  const changeText$ = $(async (value: any) => {
    lastMessage.value = value;
  });

  return (
    <div class="container-fluid m-4">
      {loading.value === true && <Loading />}
      <div class="row bg-step-5">
        <div class="col-xl-12">
          <div class="container">
            <div class="row  mt-5 justify-content-center">
              <div class="col-lg-10 text-center mt-5 mb-3">
                <h1 class="text-semi-bold text-blue">
                  <span class="text-tin">Hazle una pregunta a nuestras </span>
                  <br /> condiciones generales
                </h1>
                <p class="text-regular text-dark-blue"> Inicia tu consulta y resuelve todas tus dudas al instante</p>
                <hr class="divider my-3" />
              </div>
            </div>

            <br />
            <div class="row mb-5 d-flex justify-content-center">
              <div class="card" id="chat1" style={{ borderRadius: "15px", width: "800px", height: "500px" }}>
                <div class="card-body " style={{ height: "365px" }}>
                  <div class="row bg-chat" style={{ height: "365px", overflowY: "auto" }}>
                    {dataChatBox.value.length > 0 &&
                      dataChatBox.value.map((data, key) => {
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
                                <p class="small text-dark-blue mb-0"> {data?.answer?.message}</p>
                                <div
                                  class="mt-auto p-2"
                                  onClick$={(e: any) => {
                                    copyToClipboard(String(data?.answer?.message));
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

                <div class="card-footer">
                  <div class="row">
                    <div class="col-1 mt-1">
                    <div
                      class="circle-dark-blue d-flex align-items-center align-self-center justify-content-center    text-center"
                      style={{ cursor: "pointer" }}
                      onClick$={()=>{dataChatBox.value=[]}}
                    >
                      <i class="fa-regular fa-trash-can text-white"/>

                    </div>            
                    </div>
                    <div class="col-10">
                      <Form
                        id="form-message"
                        form={[
                          {
                            row: [
                              {
                                size: "col-lg-12 col-sm-6 col-6",
                                type: "text",
                                label: "Haga cualquier pregunta a nuestras Condiciones Generales",
                                placeholder: "Haga cualquier pregunta a nuestras Condiciones Generales",
                                name: "message",
                                required: true,
                                value: lastMessage.value,
                                onChange: $((e: any) => {
                                  changeText$(e.target.value);
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    </div>
                    <div class="col-1 mt-1">

                    <div
                      class="circle-light-blue d-flex align-items-center align-self-center justify-content-center   text-center"
                      style={{ cursor: "pointer" }}
                      onClick$={getChatAksYourPdf$}
                    >
                      <i class="fa-regular fa-paper-plane text-white" />

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
  );
});
