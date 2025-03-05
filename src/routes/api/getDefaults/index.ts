import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onGet: RequestHandler = async ({request , json }) => {
    await ServiceRequest('/pw_getSelectsPorDefectoCotizadorViajes',{},(response) => {  
        json(200, response);
    },request)
};