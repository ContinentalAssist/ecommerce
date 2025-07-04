import { $,  useContext, component$, useOnWindow, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form } from "~/components/starter/form/Form";
import { LoadingContext } from "~/root";

import styles from './index.css?inline'

export const head: DocumentHead = {
    title: 'Continental Assist | Buscar Voucher',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Buscar Voucher'},
        {name:'description',content:'Encuentra aquí tu voucher. Continental Assist te ofrecemos alternativas de búsqueda para encuentrar el voucher de tu plan de asistencia en viaje.'},
        {property:'og:title',content:'Continental Assist | Buscar Voucher'},
        {property:'og:description',content:'Encuentra aquí tu voucher. Continental Assist te ofrecemos alternativas de búsqueda para encuentrar el voucher de tu plan de asistencia en viaje.'},
    ],
    links: [
        {rel:'canonical',href: 'https://continentalassist.com/search-voucher'},
    ],
};

export default component$(() => {
    useStylesScoped$(styles)

    //const objVoucher : {[key:string]:any,beneficiarios:[{[key:string]:any,beneficiosadicionales:any[]}],contactos:any[],beneficios:[{[key:string]:any,beneficios:any[]}]} = {beneficiarios:[{beneficiosadicionales:[]}],contactos:[{}],beneficios:[{beneficios:[]}]}
    //const objectVoucher: {[key:string]:any} = {}
    const vouchers = useSignal([])
    const contextLoading = useContext(LoadingContext)
    const msg =useSignal('')

    useOnWindow('load',$(() => {
         contextLoading.value = {status:false, message:''}
    }))

    const getForm$ = $(async() => {
        const bs = (window as any)['bootstrap']
        const toastError = new bs.Toast('#toast-error',{})
        const form  = document.querySelector('#form-voucher') as HTMLFormElement
        
        const inputs = Array.from(form.querySelectorAll('input'))
        const dataForm : {[key:string]:any} = {}
        let error = false
        if(!(form).checkValidity())
        {
            form.classList.add('was-validated')
            error = true
        }
        else
        {
            form.classList.remove('was-validated')

            inputs.map((input) => {
                dataForm[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })

            error = false
        }
       
        if(error == false&&(dataForm.codigovoucher !=''||dataForm.documentacion !=''))
        { 
             contextLoading.value = {status:true, message:''}
          
            let resVoucher : {[key:string]:any} = {}

            const resData = await fetch("/api/getVoucher",{method:"POST",body:JSON.stringify(dataForm)});
            const data = await resData.json()
            resVoucher = data

            if(resVoucher.error == false)
            {
                vouchers.value = resVoucher.resultado
                 contextLoading.value = {status:false, message:''}
            }
            else
            {
                msg.value = '<span><b>Voucher no encontrado o datos incorrectos!</b><br/><small>Si el error persiste llama a nuestros números de contacto.</small> </span>'
                contextLoading.value = {status:false, message:''}
                toastError.show()
            }   
        }
         else
            {
                msg.value = '<b>Ingresa uno de los dos campos<b>'
                contextLoading.value = {status:false, message:''}
                toastError.show()
            }   
    })

    const getVoucher$ = $(async(value:any)=>{
        contextLoading.value = {status:true, message:''}
     
        if (value.escorporativo == 1) 
        {
            const resData = await fetch("/api/getCorpVoucher",{method:"POST",
            body:JSON.stringify({
            voucher:  value.codindividual,
            beneficiarioDocumento: value.documento,
            locale:value.idioma,
            mostrarPrecio: true,
            corpindividual: true,
            idorden: value.idorden,
            documento: value.documento??'',
            formatoURL:true
            })});
            const data = await resData.json()
            if (data?.url !== '' ) {
                window.open(data?.url, '_blank');
                console.log(data.url);
            }
            contextLoading.value = {status:false, message:''}
        }
        else{

 

          const resData = await fetch("/api/getIndVoucher", {
                method: "POST",
                body: JSON.stringify({
                    voucher: value.codindividual ?? value.codvoucher,
                    beneficiarioDocumento: value.documento ?? '',
                    locale: value.idioma,
                    mostrarPrecio: true,
                      formatoURL:true
                }),
            });
                const data = await resData.json()
            if (data?.url !== '') {
                const url =data?.url;   
                window.open(url, "_blank");
            } 
             contextLoading.value = {status:false, message:''}


        }
        

        
    })

    return(
            <div class='container-fluid'>
                <div class='row bg-search-voucher-header'>
                    <div class='col-xl-12'>
                        <div class='container'>
                            <div class='row justify-content-end align-items-end h-50'>
                                <div class='col-lg-12 text-center'>
                                    <h1 class='text-semi-bold text-dark-blue'>
                                        <span class='text-tin'>Encuentra aquí</span> tu voucher
                                    </h1>
                                    <h2 class='h5 text-dark-gray'>Ingresa los datos y valida tu consulta</h2>
                                    <hr class='divider mt-5 mb-5'/>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <div class='card pt-3 pb-4 px-lg-5 shadow-lg'>
                                        <h2 class='h6 text-center text-dark-gray px-2'>Puedes ingresar uno de los dos datos para realizar la consulta.</h2>
                                        <hr class='text-gray'></hr>
                                        <div class='card-body px-5 text-start'>
                                            <p class="text-dark-gray mb-4">
                                                Para poder visualizar correctamente su voucher, es necesario que habilite las ventanas emergentes (pop-ups) en su navegador. <br/>
                                                El voucher se abrirá en una nueva ventana.
                                            </p>
                                            <Form
                                                id='form-voucher'
                                                form={[
                                                    {row:[
                                                        {size:'col-lg-6',type:'text',name:'codigovoucher',label:'Número de voucher',placeholder:'Ejemplo: CA-XXXXX-MX'},
                                                        {size:'col-lg-6',type:'text',name:'documentacion',label:'Identificación / Pasaporte'},
                                                    ]},
                                                ]}
                                            />
                                            <div class='container p-0'>
                                                <div class='row justify-content-center'>
                                                    <div class='col-lg-3'>
                                                        <div class='d-grid gap-2'>
                                                            <button type='button' id='inputVoucher' class='btn btn-primary btn-lg' onClick$={getForm$} >Buscar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="table-responsive mt-5 mx-1">
                                            {
                                                vouchers.value.length>0
                                                &&<table class="table ">
                                                <thead>
                                                    <tr>
                                                    <th scope="col" class="text-nowrap">#</th>
                                                    <th scope="col" class="text-nowrap">Codigo Voucher</th>
                                                    <th scope="col" class="d-none d-sm-table-cell text-nowrap">Fecha Salida</th>
                                                    <th scope="col" class="d-none d-sm-table-cell text-nowrap">Fecha Regreso</th>
                                                    <th scope="col" class="text-nowrap">Ver</th>
                                                   {/*  <th scope="col">Descargar</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        vouchers.value.map((value:any,key)=>{
                                                            return (
                                                            <tr>
                                                                <th scope="row">{key+1}</th>
                                                                <td class="text-nowrap">{value.codindividual??value.codvoucher}</td>
                                                                <td class="d-none d-sm-table-cell text-nowrap">{value.fechasalida}</td>
                                                                <td class="d-none d-sm-table-cell text-nowrap">{value.fecharegreso}</td>
                                                                <td class="text-nowrap icon-eye" onClick$={()=>getVoucher$(value)}><i class="fa-solid fa-eye text-light-blue "></i></td>
                                                                {/* <td><i class="fa-solid fa-file-pdf"></i></td> */}
                                                            </tr>
                                                            ) 
                                                        })


                                                    }
                                                   
                                                </tbody>
                                            </table>
                                            }
                                            
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class='row h-25'>
                                <div class='col-lg-12'>
                                    <div class='bg-city'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                <div class="toast-container position-fixed bottom-0 p-3">
                    <div id='toast-error' class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <div class='message'>
                                    <div dangerouslySetInnerHTML={msg.value} />
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
    )
})