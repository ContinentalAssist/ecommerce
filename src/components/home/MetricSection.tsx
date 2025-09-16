import { component$ } from '@builder.io/qwik';
// import ImgContinentalAssistWeb from 'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png';


export const MetricSection = component$(() => {
    return (
        <section class="metrics-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-center align-items-center text-center mt-4"
                         id="metrics-section">

                        <div class="col-6 col-md-4 mt-4">
                            <div class='mb-4'>
                                <img
                                    src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/shield-account-outline.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold-metric text-blue">+30 Años Experiencia </span>
                                </p>
                                <p class="font-tamanio"> Líderes en el mercado de seguros de viaje </p>
                            </div>
                        </div>
                        <div class="col-6 col-md-4 mt-4">
                            <div class='mb-4'>
                                <img
                                    src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/web.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold-metric text-blue">100% respaldo global </span>
                                </p>
                                <p class="font-tamanio">Cobertura en más de 190 países </p>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 mt-4">
                            <div class='mb-4'>
                                <img
                                    src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/headphones.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo">
                                <p>
                                    <span class="h3 text-bold-metric text-blue">Atención 24/7 </span>
                                </p>
                                <p class="font-tamanio"> Asistencia inmediata cuando la necesites </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 d-none" id="metrics-section-mobile">
                <div class="row px-2">
                    <div class="col-6 col-md-4 mt-4">
                        <div class='mb-4'>
                            <img
                                src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/shield-account-outline.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo">
                            <p>
                                <span class="h3 text-bold-metric text-blue">+30 Años Experiencia </span>
                            </p>
                            <p class="font-tamanio"> Líderes en el mercado de seguros de viaje </p>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mt-4">
                        <div class='mb-4'>
                            <img
                                src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/web.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo">
                            <p>
                                <span class="h3 text-bold-metric text-blue">100% respaldo global </span>
                            </p>
                            <p class="font-tamanio">Cobertura en más de 190 países </p>
                        </div>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col-md-4 mt-4">
                        <div class='mb-4'>
                            <img
                                src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/headphones.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo">
                            <p>
                                <span class="h3 text-bold-metric text-blue">Atención 24/7 </span>
                            </p>
                            <p class="font-tamanio"> Asistencia inmediata cuando la necesites </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    );
});