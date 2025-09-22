import { component$ } from '@builder.io/qwik';
// import ImgContinentalAssistWeb from 'https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-Ecommerce-Circulos.png';


export const MetricSection = component$(() => {
    return (
        <section class="metrics-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-center align-items-center text-center mt-4" id="metrics-section">
                        <div class="col-6 col-md-3 mt-3 p-2 d-flex flex-column align-items-center">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/experiencia-ecommerce.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                                <div class="mb-2" style="min-height: 60px; display: flex; align-items: center; justify-content: center; text-align: center;">
                                    <span class="h4 text-bold-metric text-blue text-center">+30 años de experiencia</span>
                                </div>
                                <div class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Amplia trayectoria en el mercado de asistencia internacional.</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3 mt-4 p-2 d-flex flex-column align-items-center">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/respaldo-ecommerce.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                                <div class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                    <span class="h3 text-bold-metric text-blue">100% respaldo</span>
                                </div>
                                <div class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Somos la única compañía de asistencia en viaje que cuenta con reaseguro.</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3 mt-4 p-2 d-flex flex-column align-items-center">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/global%20red-ecommerce.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                                <div class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                    <span class="h3 text-bold-metric text-blue">178.000 Red Global</span>
                                </div>
                                <div class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Contamos con más de 178 mil proveedores listos para asistirte en cualquier parte del mundo.</div>
                            </div>
                        </div>
                        <div class="col-6 col-md-3 mt-2 p-2 d-flex flex-column align-items-center">
                            <div class='mb-4'>
                                <img
                                    src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/atenci%C3%B3n%20247-ecommerce.png"
                                    alt="" width='80' height='80'/>
                            </div>
                            <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                                <div class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                    <span class="h3 text-bold-metric text-blue">Atención 24/7</span>
                                </div>
                                <div class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Operamos de manera ininterrumpida a nivel global.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 d-none" id="metrics-section-mobile">
                <div class="row px-2">
                    <div class="col-6 col-md-6 mt-4 d-flex flex-column align-items-center">
                        <div class='mb-4'>
                            <img
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/experiencia-ecommerce.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                            <p class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                <span class="h3 text-bold-metric text-blue text-center">+30 años de experiencia</span>
                            </p>
                            <p class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Amplia trayectoria en el mercado de asistencia internacional.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-6 mt-4 d-flex flex-column align-items-center">
                        <div class='mb-4'>
                            <img
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/respaldo-ecommerce.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                            <p class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                <span class="h3 text-bold-metric text-blue">100% respaldo</span>
                            </p>
                            <p class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Somos la única compañía de asistencia en viaje que cuenta con reaseguro.</p>
                        </div>
                    </div>
                </div>
                <div class="row padignt-top">
                    <div class="col-6 col-md-6 mt-4 d-flex flex-column align-items-center">
                        <div class='mb-4'>
                            <img
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/global%20red-ecommerce.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                            <p class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                <span class="h3 text-bold-metric text-blue">178.000 Red Global</span>
                            </p>
                            <p class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Contamos con más de 178 mil proveedores listos para asistirte en cualquier parte del mundo.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-6 mt-4 d-flex flex-column align-items-center">
                        <div class='mb-4'>
                            <img
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/atenci%C3%B3n%20247-ecommerce.png"
                                alt="" width='80' height='80'/>
                        </div>
                        <div class="qs-metrics-titulo d-flex flex-column align-items-center">
                            <p class="mb-2" style="min-height: 60px; display: flex; align-items: center;">
                                <span class="h3 text-bold-metric text-blue">Atención 24/7</span>
                            </p>
                            <p class="font-tamanio" style="min-height: 60px; display: flex; align-items: flex-start;">Operamos de manera ininterrumpida a nivel global.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    );
});