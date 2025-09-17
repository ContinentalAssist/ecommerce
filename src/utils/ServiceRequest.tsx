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
            console.error('❌ Error en respuesta HTTP:', {
                status: response.status,
                statusText: response.statusText,
                url: `${import.meta.env.VITE_MY_PUBLIC_WEB_API}${url}`,
                response: raw.substring(0, 500) // Solo primeros 500 caracteres
            });
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Verificar si la respuesta está vacía
        if (!raw || raw.trim() === '') {
            console.error('❌ Respuesta vacía del servidor');
            throw new Error('Empty response from server');
        }

        // Intentar parsear JSON de forma segura
        try {
            const data = JSON.parse(raw);
            onSuccess(data);
        } catch (err) {
            console.error('❌ Error al parsear JSON:', {
                error: err,
                responseType: response.headers.get('content-type'),
                responseLength: raw.length,
                responsePreview: raw.substring(0, 200),
                fullResponse: raw
            });
            
            // Si la respuesta parece ser HTML (error del servidor), dar un mensaje más específico
            if (raw.toLowerCase().includes('<html') || raw.toLowerCase().includes('<!doctype')) {
                throw new Error('Server returned HTML instead of JSON - possible server error');
            }
            
            throw new Error(`Invalid JSON response: ${err instanceof Error ? err.message : 'Unknown parsing error'}`);
        }

    } catch (error) {
        console.error('❌ Falló al obtener datos:', {
            error: error instanceof Error ? error.message : error,
            url: `${import.meta.env.VITE_MY_PUBLIC_WEB_API}${url}`,
            method: headers.method
        });
        // Re-lanzar para que el handler sepa que hubo un error
        throw error;
    }
};


export default ServiceRequest;