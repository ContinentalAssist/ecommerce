// import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async ({ redirect, url }) => {
    if(url.href.includes('cotifrm2.php'))
    {
        throw redirect(308,`http://frame.continentalassist.com/${url.searchParams.get('ux')}/${url.searchParams.get('lang')}`)
    }
};

// export default component$(() => {
//     return(
//         <div class='container'>
//             <div class='row align-content-center h-100'>
//                 <div class='col-12 text-center'>
//                     <p class='mt-4'>continentalassist.com redireccionando a frame.continentalassist.com</p>
//                 </div>
//             </div>
//         </div>
//     )
// })