const ServiceRequest = async (url ='', dataSend = {}, onSuccess = (data:any) => {return(data)}) => {
    const headers = {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
            'EVA-AUTH-USER': import.meta.env.PUBLIC_WEB_KEY,
        },
        body: JSON.stringify(dataSend)
    }
    //'Authorization': 'Bearer '+import.meta.env.PUBLIC_WEB_USER, 

    const response = await fetch(import.meta.env.PUBLIC_WEB_API+url,headers)
        .then((res) => {
            return(res.json())
        })
        
    onSuccess(response)
};

export default ServiceRequest