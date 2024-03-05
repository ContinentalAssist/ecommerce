import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onGet: RequestHandler = async ({ json }) => {
    console.log('aqui')
    // await ServiceRequest('/bk_getTasasCambiosActual',{},(response) => {  
    //     json(200, response);
    // })
};