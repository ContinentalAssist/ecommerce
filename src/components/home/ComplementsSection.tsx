import { component$ } from '@builder.io/qwik';
import { CardResume } from '~/components/starter/card-resume/CardResume';
import ImgContinentalAssistMedicine from '~/media/icons/continental-assist-medicine.webp?jsx';
import ImgContinentalAssistPregnancy from '~/media/icons/continental-assist-pregnancy.webp?jsx';
import ImgContinentalAssistSports from '~/media/icons/continental-assist-sports.webp?jsx';
import ImgContinentalAssistTickets from '~/media/icons/continental-assist-tickets.webp?jsx';

export const ComplementsSection = component$(() => {
    return (
        <div class='bg-home-complements'>
            <div class='col-lg-12'>
                <div class='container'>
                    <div class='row align-content-center'>
                        <div class='col-xl-12'>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-xl-11 text-center'>
                                        <h2 class='h1 text-semi-bold text-blue mt-5'>
                                            <span class='text-tin'>Complementos</span><br
                                            class='mobile'/> ideales
                                            para tu viaje
                                        </h2>
                                        <hr class='divider my-3'/>
                                        <h3 class='h5 text-dark-gray'>Extras imperdibles, si requieres <br
                                            class='mobile'/> protección adicional.</h3>
                                    </div>
                                </div>
                                <div class='row not-mobile'>
                                    <div class='col-lg-4'>
                                        <CardResume
                                            title='Preexistencias'
                                            description='El beneficio perfecto para tus condiciones médicas previas.'
                                        >
                                            <ImgContinentalAssistMedicine class='img-fluid' loading="lazy"
                                                                          title='continental-assist-medicine'
                                                                          alt='continental-assist-medicine'/>
                                        </CardResume>
                                    </div>
                                    <div class='col-lg-4'>
                                        <CardResume
                                            title='Futura mamá'
                                            description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                        >
                                            <ImgContinentalAssistPregnancy class='img-fluid' loading="lazy"
                                                                           title='continental-assist-pregnancy'
                                                                           alt='continental-assist-pregnancy'/>
                                        </CardResume>
                                    </div>
                                    <div class='col-lg-4'>
                                        <CardResume
                                            title='Práctica deportiva'
                                            description='Estamos contigo, en experiencias deportivas para aficionados.'
                                        >
                                            <ImgContinentalAssistSports class='img-fluid' loading="lazy"
                                                                        title='continental-assist-sports'
                                                                        alt='continental-assist-sports'/>
                                        </CardResume>
                                    </div>
                                </div>
                                <div class='row mobile'>
                                    <div class='col-xl-12 card-planes'>
                                        <div id="carouselAdditionals" class="carousel carousel-dark slide"
                                             data-bs-ride="carousel" data-bs-touch="true">

                                            <button class="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#carouselAdditionals" data-bs-slide="prev">
                                                <span class="custom-carousel-icon" aria-hidden="true">‹</span>
                                                <span class="visually-hidden">Anterior</span>
                                            </button>

                                            <button class="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#carouselAdditionals" data-bs-slide="next">
                                                <span class="custom-carousel-icon" aria-hidden="true">›</span>
                                                <span class="visually-hidden">Siguiente</span>
                                            </button>


                                            <div class="carousel-indicators">
                                                <button type="button" data-bs-target="#carouselAdditionals"
                                                        data-bs-slide-to="0" class="active" aria-current="true"
                                                        aria-label="Slide 1"></button>
                                                <button type="button" data-bs-target="#carouselAdditionals"
                                                        data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                <button type="button" data-bs-target="#carouselAdditionals"
                                                        data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                <button type="button" data-bs-target="#carouselAdditionals"
                                                        data-bs-slide-to="3" aria-label="Slide 4"></button>
                                            </div>
                                            <div class="carousel-inner">
                                                <div class="carousel-item active">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 mb-5'>
                                                                <CardResume
                                                                    title='Enfermedades preexistentes'
                                                                    description='El beneficio perfecto para tus condiciones médicas previas.'
                                                                >
                                                                    <ImgContinentalAssistMedicine class='img-fluid'
                                                                                                  loading="lazy"
                                                                                                  title='continental-assist-medicine'
                                                                                                  alt='continental-assist-medicine'/>
                                                                </CardResume>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 mb-5'>
                                                                <CardResume
                                                                    title='Futura mamá'
                                                                    description='Protegemos a madres gestantes, de hasta 32 semanas.'
                                                                >
                                                                    <ImgContinentalAssistPregnancy class='img-fluid'
                                                                                                   loading="lazy"
                                                                                                   title='continental-assist-pregnancy'
                                                                                                   alt='continental-assist-pregnancy'/>
                                                                </CardResume>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 mb-5'>
                                                                <CardResume
                                                                    title='Práctica deportiva'
                                                                    description='Estamos contigo, en experiencias deportivas para aficionados.'
                                                                >
                                                                    <ImgContinentalAssistSports class='img-fluid'
                                                                                                loading="lazy"
                                                                                                title='continental-assist-sports'
                                                                                                alt='continental-assist-sports'/>
                                                                </CardResume>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 mb-5'>
                                                                <CardResume
                                                                    title='Modificación de viaje multicausa'
                                                                    description='Protege la inversión en tus viajes por cancelación multicausa.'
                                                                >
                                                                    <ImgContinentalAssistTickets class='img-fluid'
                                                                                                 loading="lazy"
                                                                                                 title='continental-assist-tickets'
                                                                                                 alt='continental-assist-tickets'/>
                                                                </CardResume>
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
