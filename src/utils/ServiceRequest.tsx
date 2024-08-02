const ServiceRequest = async (url = '', dataSend = {}, onSuccess = (data: any) => { return data }) => {
    const headers = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'EVA-AUTH-USER': import.meta.env.VITE_MY_PUBLIC_WEB_KEY,
        },
        body: JSON.stringify(dataSend),
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_MY_PUBLIC_WEB_API}${url}`, { ...headers });
        const data = await response.json(); // Espera la respuesta del fetch aquí

        onSuccess(data); // Llama a la función onSuccess con los datos recibidos
    } catch (error) {
        console.error('Falló al obtener datos:', error);
    }
};

export default ServiceRequest;