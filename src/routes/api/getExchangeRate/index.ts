import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onPost: RequestHandler = async ({ request , json }) => {
    const body = await request.json()

    await ServiceRequest('/obtenertasa',body,(response) => {
       
        const obj: Record<string, string> = {};
        request.headers.forEach((v, k) => (obj[k] = v));
        console.log("headers originales -> ",request);
        json(200, response);
    },request)
};