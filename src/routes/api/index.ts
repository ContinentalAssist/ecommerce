import { type RequestHandler } from '@builder.io/qwik-city';
 
export const onGet: RequestHandler = async ({ json }) => {
    json(200, { 
        mensaje : 'Continental Assist API',
        error : false,
        resultado : []
    });
};