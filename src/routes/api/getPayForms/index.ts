import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onPost: RequestHandler = async ({request , json }) => {
    await ServiceRequest('/pw_getSapFormaPago',{},(response) => {  
        json(200, response);
    },request)
};