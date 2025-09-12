import { component$ } from '@builder.io/qwik';
// import ImgContinentalAssistWeb from 'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png';


export const MetricSection = component$(() => {
    return (
        <section class="metrics-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-center text-center">
                        <div class="col-md-4 mt-4">
                            <div class='mb-4'>
                                <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png" alt="" width='100' height='100'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold text-blue">+30 Años Experiencia </span>
                                </p>
                                <p class="font-tamanio"> Líderes en el mercado de seguros de viaje </p>
                            </div>
                        </div>
                        <div class="col-md-4 mt-4">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png"
                                    alt="" width='100' height='100'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold text-blue">100% respaldo global </span>
                                </p>
                                <p class="font-tamanio">Cobertura en más de 90 países </p>
                            </div>
                        </div>
                        <div class="col-md-4 mt-4">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png"
                                    alt="" width='100' height='100'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold text-blue">Atención 24/7 </span>
                                </p>
                                <p class="font-tamanio"> Asistencia inmediata cuando la necesites </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
});
