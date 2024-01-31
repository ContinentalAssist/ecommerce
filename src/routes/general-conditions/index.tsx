import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Loading } from "~/components/starter/loading/Loading";

export const head: DocumentHead = {
    title: 'Continental Assist | Condiciones Generales',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Condiciones Generales'},
        {name:'description',content:'Te damos a conocer las condiciones generales de Continental Assist, aplican para todos nuestros planes de asistencia en viaje.'},
        {property:'og:title',content:'Continental Assist | Condiciones Generales'},
        {property:'og:description',content:'Te damos a conocer las condiciones generales de Continental Assist, aplican para todos nuestros planes de asistencia en viaje.'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/general-conditions'},
    ],
};

export default component$(() => {
    const loading = useSignal(true)

    useVisibleTask$(() => {
        loading.value = false
    })

    return(
        <>
            {
                loading.value
                &&
                <Loading/>
            }
            <div class='container'>
                <div class='row align-items-center h-50'>
                    <div class='col-lg-12 text-center'>
                        <h1 class='text-semi-bold text-blue mt-5'>Condiciones Generales</h1>
                        <hr class='divider mt-2 mb-2'/>
                        <h2 class='h5 text-regular text-dark-gray'>Aplicables a nuestros planes de asistencia en viaje.</h2>
                    </div>
                </div>
                <div class='row mb-5'>
                    <div class='col-lg-12'>
                        <object title='Condiciones Generales' class='pdf-viewer' data='https://storage.googleapis.com/files-continentalassist-web/Condiciones%20Generales-Continental%20Assist.pdf'/>
                    </div>
                </div>
            </div>
        </>
    )
})