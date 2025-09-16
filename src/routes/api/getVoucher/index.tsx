import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onPost: RequestHandler = async ({ request , json }) => {
    try {
        const body = await request.json()

        await ServiceRequest('/pw_getVoucher', body, (response) => {
            json(200, response);
        }, request);
    } catch (error) {
        console.error('❌ Error en getVoucher API:', error);
        
        // Devolver un error estructurado en lugar de fallar silenciosamente
        json(500, {
            error: true,
            message: error instanceof Error ? error.message : 'Error desconocido al obtener voucher',
            resultado: null
        });
    }
};