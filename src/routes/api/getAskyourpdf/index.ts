import { type RequestHandler } from '@builder.io/qwik-city';


export const onPost: RequestHandler = async ({ request , json }) => {
    const body = await request.json()
   
    const url = new URL('https://api.askyourpdf.com/v1/api/knowledge_base_chat');
    url.searchParams.append('language', body.language);
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