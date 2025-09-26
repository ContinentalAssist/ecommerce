import { $, component$, useOnWindow, useStylesScoped$, useContext } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { LoadingContext } from "~/root";

import styles from './index.css?inline'

export const head: DocumentHead = {
    title: 'Continental Assist | Concurso 2025',
    meta: [
        {name: 'robots', content: 'index, follow'},
        {name: 'title', content: 'Continental Assist | Concurso 2025'},
        {name: 'description', content: 'Participa en nuestro concurso 2025 y gana increíbles premios con Continental Assist.'},
        {property: 'og:title', content: 'Continental Assist | Concurso 2025'},
        {property: 'og:description', content: 'Participa en nuestro concurso 2025 y gana increíbles premios con Continental Assist.'},
    ],
    links: [
        {rel: 'canonical', href: 'https://continentalassist.com/concurso2025'},
    ],
};

export default component$(() => {
    useStylesScoped$(styles)

    const contextLoading = useContext(LoadingContext)

    useOnWindow('load', $(() => {
        contextLoading.value = {status: false, message: ''}
    }))

    return (
        <>
            <div class='container-fluid bg-concurso2025'>

                {/* Contenido principal - Términos y Condiciones */}
                <div class='row bg-concurso2025-content'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row justify-content-center mt-4'>
                                <div class='col-lg-10 col-xl-8'>
                                    <div class='text-center mb-5 mt-4'>
                                        <h1 class='text-blue mb-3'>
                                            Octubre Viajero con
                                            Continental Assist
                                        </h1>
                                        <h2 class='h4 text-dark-gray mb-4'>Términos y Condiciones</h2>
                                        <hr class='divider'/>
                                    </div>

                                    <div class='terminos-container'>
                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>1. Organizadores</h3>
                                            <p class='termino-contenido'>
                                                La actividad denominada <strong>"Octubre Viajero con Continental Assist"</strong> (en adelante "la Actividad") es organizada por <strong>Continental Assist</strong>.
                                            </p>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>2. Vigencia de la Actividad</h3>
                                            <p class='termino-contenido'>
                                                La Actividad estará vigente desde su publicación en la cuenta oficial de Instagram de Continental Assist hasta el <strong>03 de octubre de 2025, 11:59 p.m. hora Colombia/México</strong>.
                                            </p>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>3. Mecánica de participación</h3>
                                            <p class='termino-contenido'>
                                                Para participar, los usuarios deberán cumplir con todos los pasos descritos en la publicación oficial del concurso:
                                            </p>
                                            <ol class='termino-lista'>
                                                <li>Seguir la cuenta oficial de Instagram de Continental Assist <strong>@continentalassist</strong></li>
                                                <li>Comentar en la publicación a dónde viajan y por qué deberían ganarse la asistencia.</li>
                                                <li>Etiquetar a <strong>dos (2) amigos viajeros</strong> en el comentario.</li>
                                                <li><strong>(Opcional)</strong> Compartir la publicación en stories para tener doble oportunidad de visibilidad.</li>
                                            </ol>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>4. Requisitos de participación</h3>
                                            <ul class='termino-lista'>
                                                <li>Podrán participar personas naturales, <strong>mayores de 18 años</strong>, residentes en <strong>Colombia o México</strong>, con viajes internacionales programados entre <strong>octubre y noviembre de 2025</strong>.</li>
                                                <li>No podrán participar empleados de Continental Assist, sus familiares en primer grado, ni agencias o proveedores vinculados a la actividad.</li>
                                                <li>La participación es <strong>gratuita</strong> y no requiere compra.</li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>5. Premio</h3>
                                            <p class='termino-contenido'>
                                                El participante ganador recibirá:
                                            </p>
                                            <ul class='termino-lista'>
                                                <li>Una asistencia de viaje de Continental Assist, con un <strong>valor máximo de USD $50</strong>.</li>
                                                <li>Acceso al servicio de <strong>Concierge 24/7</strong> para apoyo en su viaje internacional (reservas, recomendaciones, cambios y más).</li>
                                            </ul>
                                            <div class='termino-nota'>
                                                <p><strong>Importante:</strong></p>
                                                <ul class='termino-lista'>
                                                    <li>El premio es personal e intransferible y aplicará exclusivamente para viajes internacionales realizados entre <strong>octubre y noviembre de 2025</strong>.</li>
                                                    <li>El premio no es canjeable por dinero en efectivo, otros productos o servicios.</li>
                                                    <li>En caso de que el costo de la asistencia elegida supere el monto máximo indicado (USD $50), el participante podrá redimir el valor equivalente y cubrir la diferencia directamente con Continental Assist.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>6. Selección del ganador</h3>
                                            <ul class='termino-lista'>
                                                <li>El ganador será elegido entre los participantes que hayan cumplido correctamente con la mecánica.</li>
                                                <li>El criterio de selección será el <strong>comentario más creativo y relevante</strong>, de acuerdo con el jurado interno designado por Continental Assist.</li>
                                                <li>La decisión del jurado será <strong>inapelable</strong>.</li>
                                                <li>La selección se realizará el <strong>7 de octubre de 2025</strong> y se anunciará en las redes sociales oficiales de Continental Assist.</li>
                                                <li>El ganador deberá responder dentro de los <strong>3 días calendario</strong> posteriores al anuncio. De no hacerlo, se seleccionará un suplente.</li>
                                                <li>El viaje deberá ser posterior a la fecha del anuncio del ganador, <strong>mínimo con 1 semana de anticipación</strong>.</li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>7. Entrega del premio</h3>
                                            <ul class='termino-lista'>
                                                <li>Para reclamar el premio, el ganador deberá presentar <strong>prueba del viaje internacional</strong> entre octubre y noviembre de 2025 (ejemplo: tiquete aéreo, reserva confirmada u otro comprobante válido).</li>
                                                <li>La asistencia se emitirá a nombre del ganador, previo cumplimiento de las condiciones.</li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>8. Prevención de fraude</h3>
                                            <ul class='termino-lista'>
                                                <li>Se descalificarán de inmediato las participaciones múltiples desde cuentas falsas, bots, cuentas duplicadas o creadas únicamente para concursos.</li>
                                                <li>No se permitirá modificar comentarios ni usar información fraudulenta.</li>
                                                <li>Continental Assist se reserva el derecho de verificar la autenticidad de los participantes y su cumplimiento con las reglas.</li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>9. Responsabilidad</h3>
                                            <ul class='termino-lista'>
                                                <li>Continental Assist no se hace responsable por fallas técnicas, problemas de conectividad o cualquier otra situación ajena que pueda impedir la participación.</li>
                                                <li>La responsabilidad de Continental Assist se limita exclusivamente a la entrega del premio en los términos aquí señalados.</li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>10. Autorización de uso de datos e imagen</h3>
                                            <ul class='termino-lista'>
                                                <li>Al participar, los concursantes autorizan a Continental Assist a utilizar sus nombres, fotografías, comentarios e imágenes en piezas publicitarias relacionadas con la Actividad, sin que esto genere compensación adicional.</li>
                                                <li>La información personal será tratada conforme a la <strong>Política de Privacidad</strong> de Continental Assist disponible en <a href="https://www.continentalassist.com" class='text-blue' target='_blank'>www.continentalassist.com</a></li>
                                            </ul>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>11. Modificaciones</h3>
                                            <p class='termino-contenido'>
                                                Continental Assist se reserva el derecho de modificar los presentes Términos y Condiciones, así como de suspender o cancelar la Actividad en cualquier momento, informando oportunamente en sus canales oficiales.
                                            </p>
                                        </div>

                                        <div class='termino-item'>
                                            <h3 class='termino-titulo'>12. Aceptación</h3>
                                            <p class='termino-contenido'>
                                                La participación en esta Actividad implica la <strong>aceptación total</strong> de estos Términos y Condiciones.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});
