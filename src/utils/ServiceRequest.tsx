const ServiceRequest = async (url ='', dataSend = {}, onSuccess = (data:any) => {return(data)}) => {
    const headers = {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.PUBLIC_WEB_KEY,
            'Authorization': 'Bearer '+import.meta.env.PUBLIC_WEB_USER, 
        },
        body: JSON.stringify(dataSend)
    }

    const response = await fetch(import.meta.env.PUBLIC_WEB_API+url,headers)
        .then((res) => {
            return(res.json())
        })
        
    onSuccess(response)
};

export default ServiceRequest