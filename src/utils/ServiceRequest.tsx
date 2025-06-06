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
            'Accept-Language':request.headers.get('Accept-Language')||'es'
        },
        body: JSON.stringify(dataSend),
    };
    
    // Validar si el encabezado x-forwarded-for existe
    const forwardedForHeader = request.headers.get('x-forwarded-for');
    
    if (forwardedForHeader) {
        headers.headers['X-FORWARDED-FOR'] = forwardedForHeader;
    }/* else{
        headers.headers['X-FORWARDED-FOR'] = '2806:10be:7:2e9:62fc:9d:7f21:a6cc'
    } */
    
    const logHeaders = (req: any) => {
        return req;
    };

    try {
        const config = {
            ...headers,
            ...logHeaders
        };

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