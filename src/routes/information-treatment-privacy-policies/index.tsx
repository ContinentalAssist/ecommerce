import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Loading } from "~/components/starter/loading/Loading";

export const head: DocumentHead = {
    title: 'Continental Assist | Políticas de la Información y Privacidad',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | Políticas de Tratamiento de la Información y Privacidad'},
        {name:'description',content:'Documento de políticas de tratamiento de la información y privacidad, Continental Assist aplicables a nuestros planes de asistencia en viaje'},
        {property:'og:title',content:'Continental Assist | Políticas de Tratamiento de la Información y Privacidad'},
        {property:'og:description',content:'Documento de políticas de tratamiento de la información y privacidad, Continental Assist aplicables a nuestros planes de asistencia en viaje'},
    ],
    links: [
        {rel:'canonical',href:'https://continentalassist.com/information-treatment-privacy-policies'},
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
                        <h1 class='text-semi-bold text-blue mt-5'>Políticas de Tratamiento de la Información y Privacidad</h1>
                        <hr class='divider mt-2 mb-2'/>
                        <h2 class='h5 text-regular text-dark-gray'>Aplicables a nuestros planes de asistencia en viaje.</h2>
                    </div>
                </div>
                <div class='row mb-5'>
                    <div class='col-lg-12'>
                        <object title='Tratamiento Informacion' class='pdf-viewer' data='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20Tratamiento%20de%20la%20Informaci%C3%B3n%20y%20Privacidad%20Continental%20Assist.pdf'/>
                    </div>
                </div>
            </div>
        </>
    )
})