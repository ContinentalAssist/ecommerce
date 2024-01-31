const ServiceRequest = async (url ='', dataSend = {}, onSuccess = (data:any) => {return(data)}, payment = "false") => {
    let headers : {[key:string]:any} = {}

    payment === "true"
    ?
    headers = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'PHP-AUTH-USER' : import.meta.env.PUBLIC_WEB_USER
        },
        body: JSON.stringify(dataSend)
    }
    :
    headers = {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
            // 'x-api-key': import.meta.env.PUBLIC_WEB_KEY,
            // 'Authorization': 'Bearer '+import.meta.env.PUBLIC_WEB_USER, 
        },
        body: JSON.stringify(dataSend)
    }

    const response = await fetch(
        payment === "true" 
        ? import.meta.env.PUBLIC_WEB_API_PAY_BACK+url
        : import.meta.env.PUBLIC_WEB_API_BACK+url,headers
    )
        .then((res) => {
            return(res.json())
        })
        
    onSuccess(response)
};

export default ServiceRequest