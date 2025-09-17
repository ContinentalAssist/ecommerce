import { $, component$ } from '@builder.io/qwik';
import { Carousel } from '~/components/starter/carrucel-cards/Carrucel-cards';
import ImgContinentalAssistPerson from '~/media/home/continental-assist-person.webp?jsx';

export const SpecialCoveragesSection = component$(() => {
    return (
        <section class="qd-section">
            <div class="qd-background">
                <div class="qd-bg-left"></div>
                <div class="qd-bg-center"></div>
                <div class="qd-bg-right"></div>
            </div>

            <div class="qd-content">
                <div class="qd-top">
                    <div class="qd-info">
                        <div class="qd-title">
                            <h2 class="qd-title-light text-tin">Conoce algunas de</h2>
                            <h6 class="qd-title-bold">nuestras coberturas <br/>especiales</h6>
                        </div>
                        <button onClick$={() => {
                            const el = document.getElementById('container-quote');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }} class="btn qd-button pb-2">¡Quiero comprar!</button>
                    </div>
                    <div class="qd-video">
                        <ImgContinentalAssistPerson loading="lazy"
                                                    title='continental-assist-pets'
                                                    alt='continental-assist-pets'/>
                    </div>
                </div>
                <div>
                    <Carousel/>
                </div>
            </div>
        </section>
    );
});
