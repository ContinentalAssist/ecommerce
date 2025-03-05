type HeadersType = {
    method: string;
    headers: {
        'Content-Type': string;
        'EVA-AUTH-USER': string;
        [key: string]: string;
    };
    body?: string;
};


const ServiceRequest = async (url = '', dataSend = {}, onSuccess = (data: any) => { return data }, request:any) => {
    const headers: HeadersType = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'EVA-AUTH-USER': import.meta.env.VITE_MY_PUBLIC_WEB_KEY,
        },
        body: JSON.stringify(dataSend),
    };


    // Validar si el encabezado x-forwarded-for existe
    const forwardedForHeader = request.headers.get('x-forwarded-for');
    
    if (forwardedForHeader) {
        headers.headers['X-FORWARDED-FOR'] = forwardedForHeader;
    }
    
    const logHeaders = (req: any) => {
        console.log('Headers antes de enviar:', req);
        return req;
    };

    try {
        const config = {
            ...headers,
            ...logHeaders
        };
        console.log('Configuración de fetch:', config);

        const response = await fetch(`${import.meta.env.VITE_MY_PUBLIC_WEB_API}${url}`, config);
                
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        onSuccess(data);
    } catch (error) {
    
            console.error('Falló al obtener datos:', error);
        
    }
};

export default ServiceRequest;