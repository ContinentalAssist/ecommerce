import { component$, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import styles from './index.css?inline'

export default component$(() => {
    useStyles$(styles)

    const location = useLocation()

    useVisibleTask$(() => {
        if(location.params.catchall == 'cotifrm2.php')
        {
            const queryParams = new URLSearchParams(location.url.search);
            const ux = queryParams.get('ux');
            const lang = queryParams.get('lang');
            const uen = queryParams.get('uen');

            let url = 'https://frames.continentalassist.com/cotifrm2.php?ux='+ux;

            if (lang) 
            {
                url += '&lang=' + lang
            }
            if (uen) 
            {
                url += '&uen=' + uen
            }

            window.location.href = url 
        }
    })

    return(
        <div class='container'>
            <div class='row align-content-center h-100'>
                <div class='col-12 text-center'>
                    <p class='mt-4'></p>
                </div>
            </div>
        </div>
    )
})