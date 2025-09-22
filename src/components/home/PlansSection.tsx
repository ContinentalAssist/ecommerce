import { component$ } from '@builder.io/qwik';
import { CardPlan } from '~/components/starter/card-plan/CardPlan';
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx';
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx';
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx';

export interface PlansSectionProps {
    dataPlan: any[];
}

export const PlansSection = component$((props: PlansSectionProps) => {
    return (
        <div class='bg-home-plans mt-4'>
            <div class='col-lg-12'>
                <div class='container'>
                    <div class='row'>
                        <div class='col-lg-12'>
                            <div class='container'>
                                <div class='row'>
                                    <div class='col-xl-10 offset-xl-1 text-center'>
                                        <h2 class='h1 text-semi-bold text-blue mt-5'>
                                            <span class='text-tin'>Conoce</span> nuestros planes
                                        </h2>
                                        <hr class='divider my-3'/>
                                        <h3 class='h5 text-dark-gray'>Te cubrimos <b>24/7/365</b> en <br
                                            class='mobile'/> cualquier parte del mundo.</h3>
                                    </div>
                                </div>
                                <div class='row not-mobile'>
                                    <div class='col-xl-4 col-md-4'>
                                        <CardPlan
                                            id={'plan-' + props.dataPlan[0]['idplan']}
                                            title={props.dataPlan[0]['nombreplan']}
                                            description='Con lo necesario para tus aventuras.'
                                            btnLabel={props.dataPlan[0]['cobertura']}
                                            footer='Cubre hasta'
                                            benefits={props.dataPlan[0]['beneficiosasignados']}
                                        >
                                            <ImgContinentalAssistBagEssential class="img-fluid" loading="lazy"
                                                                              title='continental-assist-bag-essential'
                                                                              alt='continental-assist-bag-essential'/>
                                        </CardPlan>
                                    </div>
                                    <div class='col-xl-4 col-md-4'>
                                        <CardPlan
                                            id={'plan-' + props.dataPlan[1]['idplan']}
                                            title={props.dataPlan[1]['nombreplan']}
                                            description='El ideal para conectar con tu tranquilidad.'
                                            btnLabel={props.dataPlan[1]['cobertura']}
                                            footer='Cubre hasta'
                                            benefits={props.dataPlan[1]['beneficiosasignados']}
                                        >
                                            <ImgContinentalAssistBagComplete class="img-fluid" loading="lazy"
                                                                             title='continental-assist-bag-complete'
                                                                             alt='continental-assist-bag-complete'/>
                                        </CardPlan>
                                    </div>
                                    <div class='col-xl-4 col-md-4'>
                                        <CardPlan
                                            id={'plan-' + props.dataPlan[2]['idplan']}
                                            title={props.dataPlan[2]['nombreplan']}
                                            description='El que te conecta con la máxima cobertura.'
                                            btnLabel={props.dataPlan[2]['cobertura']}
                                            footer='Cubre hasta'
                                            benefits={props.dataPlan[2]['beneficiosasignados']}
                                        >
                                            <ImgContinentalAssistBagElite class="img-fluid" loading="lazy"
                                                                          title='continental-assist-bag-elite'
                                                                          alt='continental-assist-bag-elite'/>
                                        </CardPlan>
                                    </div>
                                </div>
                                <div class='row mobile'>
                                    <div class='col-xl-12 card-planes'>
                                        <div id="carouselPlans" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-touch="true">

                                            <button class="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#carouselPlans" data-bs-slide="prev">
                                                <span class="custom-carousel-icon" aria-hidden="true">‹</span>
                                                <span class="visually-hidden">Anterior</span>
                                            </button>
                                            <button class="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#carouselPlans" data-bs-slide="next">
                                                <span class="custom-carousel-icon" aria-hidden="true">›</span>
                                                <span class="visually-hidden">Siguiente</span>
                                            </button>

                                            <div class="carousel-indicators">
                                                <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                <button type="button" data-bs-target="#carouselPlans" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                            </div>

                                            <div class="carousel-inner py-2">
                                                <div class="carousel-item active">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 '>
                                                                <CardPlan
                                                                    id='TotalCarousel'
                                                                    title={props.dataPlan[0]['nombreplan']}
                                                                    description='Con lo necesario para tus aventuras.'
                                                                    btnLabel={props.dataPlan[0]['cobertura']}
                                                                    footer='Cubre hasta'
                                                                    benefits={props.dataPlan[0]['beneficiosasignados']}
                                                                >
                                                                    <ImgContinentalAssistBagEssential
                                                                        class="img-fluid" loading="lazy"
                                                                        title='continental-assist-bag-essential'
                                                                        alt='continental-assist-bag-essential'/>
                                                                </CardPlan>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 '>
                                                                <CardPlan
                                                                    id='MaximusCarousel'
                                                                    title={props.dataPlan[1]['nombreplan']}
                                                                    description='El ideal para conectar con tu tranquilidad.'
                                                                    btnLabel={props.dataPlan[1]['cobertura']}
                                                                    footer='Cubre hasta'
                                                                    benefits={props.dataPlan[1]['beneficiosasignados']}
                                                                >
                                                                    <ImgContinentalAssistBagComplete
                                                                        class="img-fluid" loading="lazy"
                                                                        title='continental-assist-bag-complete'
                                                                        alt='continental-assist-bag-complete'/>
                                                                </CardPlan>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="carousel-item">
                                                    <div class='container'>
                                                        <div class='row justify-content-center'>
                                                            <div class='col-sm-6 '>
                                                                <CardPlan
                                                                    id='SupremeCarousel'
                                                                    title={props.dataPlan[2]['nombreplan']}
                                                                    description='El que te conecta con la máxima cobertura.'
                                                                    btnLabel={props.dataPlan[2]['cobertura']}
                                                                    footer='Cubre hasta'
                                                                    benefits={props.dataPlan[2]['beneficiosasignados']}
                                                                >
                                                                    <ImgContinentalAssistBagElite class="img-fluid"
                                                                                                  loading="lazy"
                                                                                                  title='continental-assist-bag-elite'
                                                                                                  alt='continental-assist-bag-elite'/>
                                                                </CardPlan>
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
