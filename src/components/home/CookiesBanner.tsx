import { $, component$ } from '@builder.io/qwik';

export interface CookiesBannerProps {
    terms: boolean;
    getWelcome$: any;
}

export const CookiesBanner = component$((props: CookiesBannerProps) => {
    return (
        <>
            {
                props.terms !== true &&
                <div class='container-fluid fixed-bottom'>
                    {
                        <div id='messageCookies'
                             class='row justify-content-center aling-items-center bg-light p-3 pb-0 shadow-lg'>
                            <div class='col-lg-6'>
                                <p style={{fontSize: '12px'}}>
                                    Usamos cookies para conocer más acerca de la actividad de nuestro sitio web. Las
                                    puedes aceptar haciendo clic en el botón o rechazarlas.
                                    Si continúas navegando e interactuando con el sitio, estás aceptando nuestra <a
                                    title='Cookies'
                                    href='https://storage.googleapis.com/files-continentalassist-web/Pol%C3%ADtica%20de%20cookies-Continental%20Assist.pdf'>Política
                                    de Cookies</a>.
                                </p>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <a title='Cancelar' href='https://www.google.com/'
                                       class='btn btn-primary'>Cancelar</a>
                                </div>
                            </div>
                            <div class='col-lg-2 col-sm-6 col-xs-6 mb-3'>
                                <div class='d-grid gap-2'>
                                    <button type='button' class='btn btn-primary' onClick$={props.getWelcome$}>Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
});
