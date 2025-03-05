import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onPost: RequestHandler = async ({ request , json }) => {
    const body = await request.json()

    await ServiceRequest('/pw_createContactame',body,(response) => {
        json(200, response);
    },request)
};