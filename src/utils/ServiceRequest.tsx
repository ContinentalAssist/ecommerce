type HeadersType = {
    method: string;
    headers: {
        'Content-Type': string;
        'EVA-AUTH-USER': string;
        [key: string]: string;
    };
    body?: string;
};


const ServiceRequest = async (url = '', dataSend = {}, onSuccess = (data: any) => { return data }, request: any) => {
    const headers: HeadersType = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'EVA-AUTH-USER': import.meta.env.VITE_MY_PUBLIC_WEB_KEY,
            'Accept-Language': request.headers.get('Accept-Language') || 'es',
        },
        body: JSON.stringify(dataSend),
    };

    const forwardedForHeader = request.headers.get('x-forwarded-for');
    if (forwardedForHeader) {
        headers.headers['X-FORWARDED-FOR'] = forwardedForHeader;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_MY_PUBLIC_WEB_API}${url}`, headers);

        const raw = await response.text(); // Leer como texto por si no es JSON

        if (!response.ok) {
            console.error('❌ Error en respuesta HTTP:', raw);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Intentar parsear JSON de forma segura
        try {
            const data = JSON.parse(raw);
            onSuccess(data);
        } catch (err) {
            console.error('❌ Error al parsear JSON:', err, '\n📦 Respuesta cruda:', raw);
            throw new Error('Invalid JSON response');
        }

    } catch (error) {
        console.error('Falló al obtener datos:', error);
        // Re-lanzar para que el handler sepa que hubo un error
        throw error;
    }
};


export default ServiceRequest;