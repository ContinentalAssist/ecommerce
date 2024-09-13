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