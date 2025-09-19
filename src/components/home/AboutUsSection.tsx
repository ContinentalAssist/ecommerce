import { $, component$ } from '@builder.io/qwik';

export const AboutUsSection = component$(() => {
    return (
        <section class="qs-section">
            <div class="qs-content">
                <div class="qs-top">
                    <div class="qs-video">
                        <video
                            class="img-fluid-planet"
                            controls
                            poster="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/img-Cover-Video.png"
                        >
                            <source
                                class="img-fluid-planet"
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/videos/Quienes%20Somos-V03.mp4"
                                type="video/mp4"
                            />
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    </div>
                    <div class="qs-info">
                        <div class="qs-title">
                            <h5 class="section-title-about">¿Quiénes Somos?</h5>
                        </div>
                        <div>
                            <p class="qs-description-about ">
                                Somos una compañía norteamericana de asistencia en viaje con ADN 100% latino. Te protegemos con un servicio de alcance global para afrontar cualquier desafío que pueda surgir en el extranjero.
                                Con más de 30 años de experiencia, respaldamos a nuestros viajeros de forma integral, brindando tranquilidad y confianza en cada recorrido.
                            </p>
                        </div>

                    </div>
                </div>
                <div class="qs-top d-none" id='qs-top-mobile'>
                    <div class="qs-info">
                        <div class="qs-title">
                            <h5 class="section-title-about text-semi-bold">¿Quiénes Somos?</h5>
                        </div>
                    </div>
                    <div class="qs-video">
                        <video
                            class="img-fluid-planet"
                            controls
                            poster="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/img-Cover-Video.png"
                        >
                            <source
                                class="img-fluid-planet"
                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/videos/Quienes%20Somos-V03.mp4"
                                type="video/mp4"
                            />
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
});
