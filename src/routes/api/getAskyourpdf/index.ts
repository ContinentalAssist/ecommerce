import { type RequestHandler } from '@builder.io/qwik-city';
 
export const onPost: RequestHandler = async ({ request , json }) => {
    const body = await request.json()
   

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'ask_430ed091a63748d8b96a840403398a3e'
    }
    
    const data = [{
        "sender": "User",
        "message": "Que vigencia tienen estas codiciones?"
    }]
    
        const responseAsk= await fetch('https://api.askyourpdf.com/v1/chat/6241a75b-2be7-43de-8b44-66fd82456b04',
        {
            method: 'POST',
            headers: headers,
            body:JSON.stringify(body)
        } )

        const responseData = await responseAsk.json();

        // Retorna la respuesta al cliente
          json(200, {data:responseData})
};