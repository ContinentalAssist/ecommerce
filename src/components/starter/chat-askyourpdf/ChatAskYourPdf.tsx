import { $, component$, useSignal, } from '@builder.io/qwik';


export const ChatAskYourPdf = component$(() => {
    const array : any[] = []

    const dataChatBox = useSignal(array)
    const lastMessage = useSignal("")
    const disableElement = useSignal(false)

    const getChatAksYourPdf$ =$(async()=>{

        const data = [{
                "sender": "User",
                "message": lastMessage.value
            }]

        disableElement.value = true
        
        const resChat = await fetch("/api/getAskyourpdf",{method:"POST",body:JSON.stringify(data)});
        const dataChat = await resChat.json()

        let tempChat =[...dataChatBox.value]

        if (dataChatBox.value.length<3) {
            tempChat.push(dataChat.data)
        }else{
            tempChat.shift()
            tempChat.push(dataChat.data)

        }
        dataChatBox.value= tempChat
        lastMessage.value=""
        disableElement.value = false

        
    }) 


    return(
        <section>
        <div class="container py-5">

            <div class="row d-flex justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-4">

                <div class="card" id="chat1" style="border-radius: 15px;">
                <div
                    class="card-header d-flex justify-content-center align-items-center  text-center p-3 bg-info text-white border-bottom-0"
                    style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
                  {/*   <i class="fas fa-angle-left"></i> */}
                    <p class="mb-0 fw-bold ">Consulta nuestra política de privacidad</p>
                   {/*  <i class="fas fa-times"></i> */}
                </div>
                <div class="card-body">

                    {
                        dataChatBox.value.length>0&&
                        dataChatBox.value.map((data,key)=>{
                                return <>
                                <div class="d-flex flex-row justify-content-start mb-4">
                                
                                <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
                                    <p class="small text-dark-blue mb-0">{data.question.message}</p>
                                </div>
                                </div>
                           
                                 <div class="d-flex flex-row justify-content-end mb-4">
                                <div class="p-3 me-3 border  bg-body-tertiary" style="border-radius: 15px;">
                                    <p class="small text-dark-blue mb-0">{data.answer.message}</p>
                                </div>

                                </div>
                                
                                </>
                                
                            
                           
                        })
                    }

                    
                    <div data-mdb-input-init class="form-outline">
                    <textarea class="form-control bg-body-tertiary text-dark-blue" id="textAreaChat" value={lastMessage.value}  rows={4} disabled={disableElement.value} onChange$={(e)=>{ lastMessage.value =e.target.value}}></textarea>
                    <label class="form-label text-dark-blue" for="textAreaExample" >{disableElement.value == false?'Escribe tu pregunta':'Respondiendo...'}</label>
                    </div>

                   {/*  <Form
                        id={'form-chat-pdf'}
                        form={[
                            {row:[
                                {size:'col-xl-12',type:'textarea',label:'Escribe tu pregunta',
                                placeholder:'Escribe tu pregunta',name:'mensaje',required:true, 
                                onChange:$(()=>{console.log("sadsad");
                                })
                                },
                            ]},
                            
                        ]}
                        
                    />   */} 
                    <button  class="btn btn-primary mt-2" disabled={disableElement.value} onClick$={getChatAksYourPdf$}>Enviar</button>
                </div>
                </div>

            </div>
            </div>

        </div>
        </section>
    )
})