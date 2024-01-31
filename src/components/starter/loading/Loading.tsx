import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from  './loading.css?inline'

export const Loading = component$(() => {
    useStylesScoped$(styles)

    return(
        <div class={'loading'}>
            <img 
                src='/assets/img/ca/continental-assist-loading.webp' 
                class='img-fluid' 
                alt='continental-assist-loading'
            />
        </div>
    )
})