import { $, component$, useOnWindow, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { CardResume } from '~/components/starter/card-resume/CardResume';
import { Loading } from '~/components/starter/loading/Loading';
import styles from './index.css?inline'

export const head: DocumentHead = {
    title: 'Continental Assist | ¿Quienes somos?',
    meta : [
        {name:'robots',content:'index, follow'},
        {name:'title',content:'Continental Assist | ¿Quienes somos?'},
        {name:'description',content:'Conoce a quien te conecta con la tranquilidad. Continental Assist es una compañía de asistencia en viaje con ADN 100% latino, con más de 30 años de experiencia.'},
        {property:'og:title',content:'Continental Assist | ¿Quienes somos?'},
        {property:'og:description',content:'Conoce a quien te conecta con la tranquilidad. Continental Assist es una compañía de asistencia en viaje con ADN 100% latino, con más de 30 años de experiencia.'},
    ],
    links: [
        {rel:'canonical',href: 'https://continentalassist.com/about-us'},
    ],
};

export default component$(() => {
    useStylesScoped$(styles)

    const loading = useSignal(true)

    useOnWindow('load',$(() => {
        loading.value = false
    }))

    return (
        <>
            {
                loading.value === true
                &&
                <Loading/>
            }
            <div class='container-fluid bg-about-us'>
                <div class='row bg-about-us-header'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row align-items-end h-50'>
                                <div class='col-lg-10 offset-lg-1 text-center'>
                                    <h1 class='text-semi-bold text-blue'>
                                        <span class='text-tin'>Conoce a quien te</span> conecta con la tranquilidad
                                    </h1>
                                    <h2 class='h5 text-dark-gray'>Averigua por qué nada es seguro, pero nosotros... sí</h2>
                                    <hr class='divider mt-5'/>
                                </div>
                            </div>
                            <div class='row justify-content-center mt-5'>
                                <div class='col-lg-9 text-center'>
                                    <p class='mb-3 text-dark-gray'>
                                        <b class='text-blue'>Somos una compañía norteamericana de asistencia en viaje, con ADN 100% latino,  </b>
                                        que te cubre con un servicio de alcance global para hacer frente a todos los desafíos que se pueden presentar en un viaje al extranjero. 
                                        Contamos con más de 30 años de experiencia en el mercado y te respaldamos de forma integral en caso de imprevistos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 not-mobile'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row justify-content-center align-items-center'>
                                <div class='col-lg-2'>
                                    <h2 class='h1 card-title text-bold text-dark-blue'>En dónde estamos</h2>
                                </div>
                                <div class='col-lg-6'>
                                    <img class='img-fluid' src='/assets/img/icons/continental-assist-mision-vision.webp' width={741} height={300} alt='continental-assist-mision-vision'/>
                                </div>
                                <div class='col-lg-2 text-end'>
                                    <h2 class='h1 card-title text-bold text-dark-blue'>Hacia dónde vamos</h2>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class='col-lg-4 text-center'>
                                    <h2 class='h1'>Misión</h2>
                                    <p class='card-text text-dark-gray'>
                                        Proteger de forma oportuna a los viajeros internacionales que descubren la magia del mundo.  
                                    </p>
                                </div>
                                <div class='col-lg-4 text-center'>
                                    <h2 class='h1'>Visión</h2>
                                    <p class='card-text text-dark-gray'>
                                    Ser líderes en el desarrollo de un ecosistema asistencial que permita a los viajeros conectar con soluciones innovadoras.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 mb-5 mobile'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-xs-5 text-center'>
                                    <h3 class='card-title text-bold text-dark-blue mb-2'>En dónde estamos</h3>
                                </div>
                            </div>
                            <div class='row align-items-center'>
                                <div class='col-xs-5 text-center'>
                                    <img class='img-fluid' src='/assets/img/icons/continental-assist-mision-vision-vertical.webp' width={300} height={741} alt='continental-assist-mision-vision-vertical'/>
                                </div>
                                <div class='col-xs-7 text-center'>
                                    <h3>Misión</h3>
                                    <p class='card-text text-dark-gray' style={{fontSize:'12px'}}>
                                        Proteger de forma oportuna a los viajeros internacionales que descubren la magia del mundo.
                                    </p>
                                    <br/>
                                    <br/>
                                    <h3>Visión</h3>
                                    <p class='card-text text-dark-gray' style={{fontSize:'12px'}}>
                                        Ser líderes en el desarrollo de un ecosistema asistencial que permita a los viajeros conectar con soluciones innovadoras.
                                    </p>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-xs-5 text-center'>
                                    <h3 class='card-title text-bold text-dark-blue'>Hacia dónde vamos</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 mb-5'>
                    <div class='col-lg-12 text-center'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <hr class='divider mt-4'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 mb-5 not-mobile'>
                    <div class='col-lg-12 text-center'>
                        <div class='container'>
                            <div class='row align-items-end'>
                                <div class='col-lg-3'>
                                    <h2 class='text-semi-bold text-dark-blue'>Cobertura</h2>
                                    <p class='mb-5'>Tenemos + de 40 soluciones disponibles para ti.</p>
                                </div>
                                <div class='col-lg-3'>
                                    <img src='/assets/img/icons/continental-assist-conversation.webp' width={150} height={150} alt='continental-assist-icon-conversation'/>
                                    <br/>
                                    <img class='stick rotate-180' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                </div>
                                <div class='col-lg-3'>
                                    <h2 class='text-semi-bold text-dark-blue'>Alcance</h2>
                                    <p class='mb-5'>Nuestro servicio de asistencia opera de manera global.</p>
                                </div>
                                <div class='col-lg-3'>
                                    <img src='/assets/img/icons/continental-assist-ideas.webp' width={150} height={150} alt='continental-assist-icon-ideas'/>
                                    <br/>
                                    <img class='stick rotate-180' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                </div>
                            </div>
                        </div>
                        <img src='/assets/img/icons/continental-assist-line.webp' class='img-fluid line-time' width={1980} height={135} alt='continental-assist-icon-line'/>
                        <div class='container p-0'>
                            <div class='row'>
                                <div class='col-lg-3'>
                                    <img class='stick' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                    <br/>
                                    <img src='/assets/img/icons/continental-assist-star-ball.webp' width={150} height={150} alt='continental-assist-icon-star-ball'/>
                                </div>
                                <div class='col-lg-3'>
                                    <h2 class='text-semi-bold text-dark-blue mt-5'>Operadores 24/7</h2>
                                    <p>Contamos con equipo multilingüe y de operación continua.</p>
                                </div>
                                <div class='col-lg-3'>
                                    <img class='stick' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                    <br/>
                                    <img src='/assets/img/icons/continental-assist-map.webp' width={150} height={150} alt='continental-assist-icon-map'/>
                                </div>
                                <div class='col-lg-3'>
                                    <h2 class='text-semi-bold text-dark-blue mt-5'>Tecnología</h2>
                                    <p>Contamos con desarrollos a la vanguardia de las nuevas tendencias.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 mb-5 mobile'>
                    <div class='col-lg-12'>
                        <div class='container'>
                            <div class='row align-items-center'>
                                <div class='col-xs-5 text-center p-2'>
                                    <div class='mt-4'>
                                        <img src='/assets/img/icons/continental-assist-star-ball.webp' width={100} height={100} alt='continental-assist-icon-star-ball'/>
                                        <img class='stick rotate-90' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                    </div>
                                    <div class='mt-4'>
                                        <h2 class='h6 text-semi-bold text-dark-blue'>Operadores 24/7</h2>
                                        <p style={{fontSize:'10px'}}>Contamos con equipo multilingüe y de operación continua.</p>
                                    </div>
                                    <div class='mt-4'>
                                        <img src='/assets/img/icons/continental-assist-map.webp' width={100} height={100} alt='continental-assist-icon-map'/>
                                        <img class='stick rotate-90' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                    </div>
                                    <div class='mt-4'>
                                        <h2 class='h6 text-semi-bold text-dark-blue'>Tecnología</h2>
                                        <p style={{fontSize:'10px'}}>Contamos con desarrollos a la vanguardia de las nuevas tendencias.</p>
                                    </div>
                                </div>
                                <div class='col-xs-2 text-center'>
                                    <img src='/assets/img/icons/continental-assist-line-vertical.webp' class='img-fluid line-time' width={135} height={1980} alt='continental-assist-icon-line-vertical'/>
                                </div>
                                <div class='col-xs-5 text-center'>
                                    <div class='mt-4'>
                                        <h2 class='h6 text-semi-bold text-dark-blue'>Cobertura</h2>
                                        <p style={{fontSize:'10px'}}>Tenemos + de 40 soluciones disponibles para ti.</p>
                                    </div>
                                    <div class='mt-4'>
                                        <img class='stick rotate-270' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                        <img src='/assets/img/icons/continental-assist-conversation.webp' width={100} height={100} alt='continental-assist-icon-conversation'/>
                                    </div>
                                    <div class='mt-4'>
                                        <h2 class='h6 text-semi-bold text-dark-blue'>Alcance</h2>
                                        <p style={{fontSize:'10px'}}>Nuestro servicio de asistencia opera de manera global.</p>
                                    </div>
                                    <div class='mt-4'>
                                        <img class='stick rotate-270' src='/assets/img/icons/continental-assist-stick.webp' width={113} height={300} alt='continental-assist-icon-stick'/>
                                        <img src='/assets/img/icons/continental-assist-ideas.webp' width={100} height={100} alt='continental-assist-icon-ideas'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row mt-5 mb-5'>
                    <div class='col-lg-12 text-center'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <hr class='divider mt-4'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='row bg-about-us-solutions'>
                    <div class='col-lg-12 mb-3'>
                        <div class='container mb-5 cards-solutions'>
                            <div class='row '>
                                <div class='col-lg-12 text-center'>
                                    <h2 class='h1 text-semi-bold text-dark-blue'>Nuestro universo de soluciones</h2>
                                    <h3 class='h5 text-dark-blue'>Descubre los tipos de beneficios que tenemos a tu disposición</h3>
                                </div>
                            </div>
                            <div class='row mt-4 mb-5 not-mobile'>
                                <div class='col-xl-4 col-md-6'>
                                    <CardResume
                                        img='/assets/img/icons/continental-assist-ambulance.webp'
                                        title='Acompañamiento médico'
                                        description='Gastos, traslados, medicamentos, telemedicina, asistencia funeraria y mucho más.'
                                    />
                                </div>
                                <div class='col-xl-4 col-md-6'>
                                    <CardResume
                                        img='/assets/img/icons/continental-assist-global.webp'
                                        title='Acompañamiento en viaje'
                                        description='Pérdida de documentos, equipaje y vuelos. Compensaciones, orientación telefónica, entre otros.'
                                    />
                                </div>
                                <div class='col-xl-4 col-md-6'>
                                    <CardResume
                                        img='/assets/img/icons/continental-assist-legal.webp'
                                        title='Servicio'
                                        description='Asistencia remota con equipo especializado para temas legales, consultas y transferencias.'
                                    />
                                </div>
                            </div>
                            <div class='row mobile'>
                                <div class='col-lg-12'>
                                    <div id="carouselSolutions" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">
                                        <div class="carousel-indicators">
                                            <button type="button" data-bs-target="#carouselSolutions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                            <button type="button" data-bs-target="#carouselSolutions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                            <button type="button" data-bs-target="#carouselSolutions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                        </div>
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <div class='container'>
                                                    <div class='row justify-content-center'>
                                                        <div class='col-sm-6'>
                                                            <CardResume
                                                                img='/assets/img/icons/continental-assist-ambulance.webp'
                                                                title='Acompañamiento médico y funerario'
                                                                description='Gastos, traslados, medicamentos, telemedicina y más.'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="carousel-item">
                                                <div class='container'>
                                                    <div class='row justify-content-center'>
                                                        <div class='col-sm-6'>
                                                            <CardResume
                                                                img='/assets/img/icons/continental-assist-global.webp'
                                                                title='Acompañamiento en viaje'
                                                                description='Pérdida de documentos, equipaje y vuelos. Compensaciones, orientación telefónica, entre otros.'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="carousel-item">
                                                <div class='container'>
                                                    <div class='row justify-content-center'>
                                                        <div class='col-sm-6'>
                                                            <CardResume
                                                                img='/assets/img/icons/continental-assist-legal.webp'
                                                                title='Servicio'
                                                                description='Asistencia remota con equipo especializado para temas legales, consultas y transferencias.'
                                                            />
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
        </>
    );
});