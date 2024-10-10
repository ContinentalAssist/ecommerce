import { type RequestHandler } from '@builder.io/qwik-city';


export const onPost: RequestHandler = async ({ request , json }) => {
    const body = await request.json()
   
    const url = new URL('https://api.askyourpdf.com/v1/api/knowledge_base_chat');
    url.searchParams.append('language', body.language);
 /*    const data = {
      documents: [
        "6e60e87c-6154-4dff-8e62-ff10d8ed16dd",
        "7f71f98d-7265-5egg-9f73-gg21e9fe27ee"
      ],
      messages: [
        {
          "sender": "user",
          "message": "What is the common theme of the documents?"
        }
      ]
    }; */
    let dataResponse={};

   await fetch(url, {
      method: 'POST',    
      headers: {
      "x-api-key": "ask_430ed091a63748d8b96a840403398a3e",
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
        documents: body.documents,
        messages: [
          {
            sender: "user",
            message: body.message
          }
        ]
      })}
    )
    .then(res => res.json())
    .then(data => {
      dataResponse=data;

      // do something with data
    })
    .catch(rejected => {
        console.log("rejected ",rejected);
    });
  
  
        // Retorna la respuesta al cliente        
          json(200, {data:dataResponse})
};