import { component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from  './loading.css?inline'

export const Loading = component$((props:any) => {
    useStylesScoped$(styles)

    return(
      
          <div class="loading container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
          <img 
          class="mb-3"
                src='/assets/img/ca/continental-assist-loading.webp' 
               // class='img-fluid' 
                alt='continental-assist-loading'
            />
            <p class=' text-semi-bold text-blue  text-center'>
            { props.message}
            </p>
    </div>
   
       
    )
})