import { type RequestHandler } from '@builder.io/qwik-city';
import ServiceRequest from '~/utils/ServiceRequest';
 
export const onPost: RequestHandler = async ({ request, json, error }) => {
    const body = await request.json();

    try {
        await ServiceRequest('/pw_getPlanesBeneficios', body, (response) => {
            json(200, response);
        }, request);
    } catch (err) {
        error(500, {
            message: 'No se pudo obtener los beneficios',
            details: err instanceof Error ? err.message : err,
        });
    }
};
