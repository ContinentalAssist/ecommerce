import { component$ } from '@builder.io/qwik';
import ImgContinentalAssistVibe from '~/media/icons/continental-assist-vibe.webp?jsx';
import ImgContinentalAssistCovid19 from '~/media/icons/continental-assist-covid-19.webp?jsx';
import ImgContinentalAssistStick from '~/media/icons/continental-assist-stick.webp?jsx';
import ImgContinentalAssistAttendance from '~/media/icons/continental-assist-attendance.webp?jsx';
import ImgContinentalAssistContact from '~/media/icons/continental-assist-contact.webp?jsx';

export const FaqsSection = component$(() => {
    return (
        <div class='bg-home-faqs'>
            <div class='col-xl-12'>
                <div class='container'>
                    <div class='row'>
                        <div class='col-xl-12'>
                            <div class='container' style={{maxWidth: '1140px'}}>
                                <div class='row align-items-center'>
                                    <div class='col-lg-12 text-center'>
                                        <h2 class='h1 text-semi-bold text-blue'>
                                            <span class='text-tin'>Preguntas </span> <br
                                            class='mobile'/> frecuentes
                                        </h2>
                                    </div>
                                </div>
                                <div class='row bg-vibe not-mobile'>
                                    <ImgContinentalAssistVibe class='bg-vibe' title='continental-assist-vibe'
                                                              alt='continental-assist-vibe'/>
                                    <div class='col-lg-4 text-center'>
                                        <ImgContinentalAssistCovid19 class='img-fluid left'
                                                                     title='continental-assist-covid-19'
                                                                     alt='continental-assist-covid-19'/>
                                        <ImgContinentalAssistStick class='stick-left'
                                                                   title='continental-assist-stick'
                                                                   alt='continental-assist-stick'/>
                                        <p class='text-semi-bold text-dark-blue left'>¿Los planes tienen
                                            cobertura
                                            para casos de Covid-19?</p>
                                        <small class='text-semi-bold text-dark-gray left'>Cualquiera de nuestros
                                            planes te acompañará, si se llegase a presentar un caso positivo.
                                            Consulta nuestros límites de edad al momento de realizar tu
                                            compra.</small>
                                    </div>
                                    <div class='col-lg-4 text-center'>
                                        <ImgContinentalAssistAttendance class='img-fluid center'
                                                                        title='continental-assist-attendance'
                                                                        alt='continental-assist-attendance'/>
                                        <ImgContinentalAssistStick class='stick-center'
                                                                   title='continental-assist-stick'
                                                                   alt='continental-assist-stick'/>
                                        <p class='text-semi-bold text-dark-blue center'>¿Qué países exigen
                                            contar
                                            con una asistencia médica en viaje?</p>
                                        <small class='text-semi-bold text-dark-gray center'>Los países cambian
                                            constantemente sus regulaciones, por lo que te sugerimos consultar el <a
                                                title='IATA' class='text-semi-bold'
                                                href='https://www.iatatravelcentre.com/world.php' target='_black'>mapa
                                                interactivo del portal de la IATA.</a></small>
                                    </div>
                                    <div class='col-lg-4 text-center'>
                                        <ImgContinentalAssistContact class='img-fluid right'
                                                                     title='continental-assist-contact'
                                                                     alt='continental-assist-contact'/>
                                        <ImgContinentalAssistStick class='stick-right'
                                                                   title='continental-assist-stick'
                                                                   alt='continental-assist-stick'/>
                                        <p class='text-semi-bold text-dark-blue right'>¿Tienes una
                                            emergencia?<br/>¡Estamos
                                            contigo!</p>
                                        <small class='text-semi-bold text-dark-gray right'>Operamos 24 horas, los 7
                                            días de la semana, todo el año. Si necesitas de nosotros, llámanos o
                                            escríbenos vía WhatsApp al <a title='WhatsApp'
                                                                          class='text-semi-bold'
                                                                          href='tel:+13057225824'>+13057225824.</a></small>
                                    </div>
                                </div>
                                <div class='row mobile'>
                                    <div class='col-lg-12 card-planes'>
                                        <div id="carouselCommentss" class="carousel carousel-dark slide"
                                             data-bs-ride="carousel" data-bs-touch="true">

                                            <button class="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#carouselCommentss" data-bs-slide="prev">
                                                <span class="custom-carousel-icon" aria-hidden="true">‹</span>
                                                <span class="visually-hidden">Anterior</span>
                                            </button>

                                            <button class="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#carouselCommentss" data-bs-slide="next">
                                                <span class="custom-carousel-icon" aria-hidden="true">›</span>
                                                <span class="visually-hidden">Siguiente</span>
                                            </button>

                                            <div class="carousel-indicators">
                                                <button type="button" data-bs-target="#carouselCommentss"
                                                        data-bs-slide-to="0" class="active" aria-current="true"
                                                        aria-label="Slide 1"></button>
                                                <button type="button" data-bs-target="#carouselCommentss"
                                                        data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                <button type="button" data-bs-target="#carouselCommentss"
                                                        data-bs-slide-to="2" aria-label="Slide 3"></button>
                                            </div>
                                            <div class="carousel-inner">
                                                <div class="carousel-item active">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'
                                                             style={{height: '550px'}}>
                                                            <div class='col-sm-6 text-center'>
                                                                <ImgContinentalAssistCovid19 class='img-fluid'
                                                                                             loading="lazy"
                                                                                             title='continental-assist-covid-19'
                                                                                             alt='continental-assist-covid-19'/>
                                                                <br/>
                                                                <ImgContinentalAssistStick class='stick'
                                                                                           title='continental-assist-stick'
                                                                                           alt='continental-assist-stick'/>
                                                                <p class='text-semi-bold text-dark-blue left'>¿Los
                                                                    planes tienen cobertura para casos de
                                                                    Covid-19?</p>
                                                                <small class='text-semi-bold text-dark-gray left'>
                                                                    Cualquiera de nuestros planes te acompañará, si
                                                                    se llegase a presentar un caso positivo.
                                                                    Consulta nuestros límites de edad al momento de
                                                                    realizar tu compra.
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'
                                                             style={{height: '550px'}}>
                                                            <div class='col-sm-6 text-center'>
                                                                <ImgContinentalAssistAttendance class='img-fluid'
                                                                                                loading="lazy"
                                                                                                title='continental-assist-attendance'
                                                                                                alt='continental-assist-attendance'/>
                                                                <br/>
                                                                <ImgContinentalAssistStick class='stick'
                                                                                           title='continental-assist-stick'
                                                                                           alt='continental-assist-stick'/>
                                                                <p class='text-semi-bold text-dark-blue center'>¿Qué
                                                                    países exigen contar con una asistencia médica
                                                                    en viaje?</p>
                                                                <small class='text-semi-bold text-dark-gray center'>
                                                                    Los países cambian constantemente sus
                                                                    regulaciones,
                                                                    por lo que te sugerimos consultar el <a
                                                                    title='IATA' class='text-semi-bold'
                                                                    href='https://www.iatatravelcentre.com/world.php'
                                                                    rel="noopener" target='_black'>mapa interactivo
                                                                    del portal de la IATA.</a>
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'
                                                             style={{height: '550px'}}>
                                                            <div class='col-sm-6 text-center'>
                                                                <ImgContinentalAssistContact class='img-fluid'
                                                                                             loading="lazy"
                                                                                             title='continental-assist-contact'
                                                                                             alt='continental-assist-contact'/>
                                                                <br/>
                                                                <ImgContinentalAssistStick class='stick'
                                                                                           title='continental-assist-stick'
                                                                                           alt='continental-assist-stick'/>
                                                                <p class='text-semi-bold text-dark-blue right'>¿Tienes
                                                                    una emergencia?<br/>¡Estamos contigo!</p>
                                                                <small class='text-semi-bold text-dark-gray right'>
                                                                    Operamos 24 horas, los 7 días de la semana, todo
                                                                    el año.
                                                                    Si necesitas de nosotros, llámanos o escríbenos
                                                                    vía WhatsApp al <a title='WhatsApp'
                                                                                       class='text-semi-bold'
                                                                                       rel="noopener"
                                                                                       href='tel:+13057225824'>+13057225824.</a>
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
