import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import ImgContinentalAssist404Caracter from '~/media/[404]/continental-assist-404-caracter.webp?jsx'
import ImgContinentalAssist404Number from '~/media/[404]/continental-assist-404-number.webp?jsx'


import styles from './index.css?inline'

export const head: DocumentHead = {
    title: 'Continental Assist | 404',
};

export default component$(() => {
    useStylesScoped$(styles)

    return(
        <div class='container-fluid bg-404'>
            <div class='row'>
                <div class='col-lg-12'>
                    <div class='container'>
                        <div class='row align-items-center h-100'>
                            <div class='col-lg-12 text-center'>
                                <ImgContinentalAssist404Caracter class='img-fluid img-caracter' title='continental-assist-404-caracter' alt='continental-assist-404-caracter'/>
                                <ImgContinentalAssist404Number class='img-fluid img-number' title='continental-assist-404-number' alt='continental-assist-404-number'/>
                                <h3 class='text-semi-bold text-dark-gray'>¡Oops! página no encontrada</h3>
                                <p class='text-dark-gray'>
                                    El espacio exterior es un territorio fuera de nuestra zona de cobertura, 
                                    pero puedes volver al resto de nustras secciones con toda tranquilidad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})