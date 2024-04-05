import { component$, useStylesScoped$ } from "@builder.io/qwik";

// import ImgContinentalAssistLoading from '~/media/ca/continental-assist-loading.webp?jsx'

import styles from  './loading.css?inline'

export const Loading = component$(() => {
    useStylesScoped$(styles)

    return(
        <div class={'loading'}>
            <div class="loader"></div>
            <img 
                src='/assets/img/ca/continental-assist-loading.webp' 
                class='img-fluid' 
                alt='continental-assist-loading'
                width={100}
                height={100}
            />
            {/* <ImgContinentalAssistLoading class='img-fluid'/> */}
        </div>
    )
})