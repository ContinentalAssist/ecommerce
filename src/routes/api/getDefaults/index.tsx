import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onGet: RequestHandler = async ({ json }) => {
    await ServiceRequest('/bk_getSelectsPorDefectoCotizadorViajes',{},(response) => {  
        json(200, response);
    })
};