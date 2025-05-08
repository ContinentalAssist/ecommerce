// src/components/AsistenciasCarrusel.tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import './carrucel-cards.css';


export const Carousel  = component$(() => {
    const carouselRef = useSignal<HTMLElement>();

    useVisibleTask$(() => {
        const carousel = carouselRef.value;
        const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
        const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;


        function getScrollAmount() {
            const card = carousel?.querySelector('div.flex-shrink-0') as HTMLElement;
            if (!card) return 244;
            const style = window.getComputedStyle(card);
            const marginRight = parseInt(style.marginRight) || 0;


            return card.offsetWidth + marginRight;
        }

        function updateButtons() {
            if (!carousel) return;
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            if (prevBtn && nextBtn) {
                prevBtn.disabled = carousel.scrollLeft <= 0;
                nextBtn.disabled = carousel.scrollLeft >= maxScrollLeft - 1;
                prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
                nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
            }
        }

        prevBtn?.addEventListener('click', () => {
            carousel?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn?.addEventListener('click', () => {
            carousel?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        carousel?.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons();
    });

    return (



            <div class="carousel-wrapper container position-relative px-0 px-md-3">
                <div ref={carouselRef} id="carousel" class="carousel d-flex flex-nowrap ">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            class={`cardsg ${i === 0 ? 'card-main' : 'card-secondary'}`}
                        >
                            <div class="card-image-container">
                                <img
                                    src={card.img}
                                    alt={card.alt}
                                    class="card-image"
                                    height={140}
                                    width={220}
                                />
                                {i === 0 && (
                                    <div class="card-icon">
                                        <i class="fas fa-hand-pointer"></i>
                                    </div>
                                )}
                            </div>
                            <h3 class="card-title">{card.title}</h3>
                            <div class="card-content">

                                {card.description && (
                                    <p class="card-description">{card.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    id="prevBtn"
                    class="carousel-button carousel-button-left"
                    aria-label="Anterior"
                >
                    <i class="fas fa-chevron-left text-sm"></i>
                </button>
                <button
                    id="nextBtn"
                    class="carousel-button carousel-button-right"
                    aria-label="Siguiente"
                >
                    <i class="fas fa-chevron-right text-sm"></i>
                </button>
            </div>


    );
});

const cards = [
    {
        title: 'Blue Access',
        description: 'Accede más de 1.600 salas VIP en el mundo si tu vuelo se demora.',
        img: 'https://storage.googleapis.com/a1aa/image/5882cf33-98d4-4d93-6f9a-0214a09ef50e.jpg',
        alt: 'Mujer sonriendo brindando con copa de vino en restaurante con hombre',
    },
    {
        title: 'Teleconsulta médica pre y post viaje en país de origen',
        description: 'Asistencia médica antes, durante y después de tu viaje.',
        img: 'https://storage.googleapis.com/a1aa/image/72d5a091-5ecc-4eba-ad26-7e73ad7d3ba4.jpg',
        alt: 'Mujer sonriente con sombrero y maleta hablando por teléfono',
    },
    {
        title: 'Conferencia con médico de cabecera en país de origen',
        description: 'Habla con tu médico de cabecera desde el exterior.',
        img: 'https://storage.googleapis.com/a1aa/image/9999380f-802a-4f13-1633-043c9ed50a79.jpg',
        alt: 'Hombre doctor en oficina hablando por teléfono con portapapeles',
    },
    {
        title: 'Cese de operaciones de aerolínea',
        description: 'Vuelve a casa si tu vuelo se cancela.',
        img: 'https://storage.googleapis.com/a1aa/image/4a119dbb-fd7f-4e29-3b10-965c951c801c.jpg',
        alt: 'Mujer sentada con maleta en sala de aeropuerto',
    },
    {
        title: 'Repatriación administrativa',
        description: 'Te respaldamos si tienes imprevistos migratorios.',
        img: 'https://storage.googleapis.com/a1aa/image/7915fa24-60c2-4b5c-e474-f436b22d286f.jpg',
        alt: 'Hombre y mujer revisando teléfonos en tienda de tecnología',

    },
    {
        title: 'Compra protegida',
        description: 'Robo cubierto por compras tecnológicas en el exterior.',
        img: 'https://storage.googleapis.com/a1aa/image/7915fa24-60c2-4b5c-e474-f436b22d286f.jpg',
        alt: 'Hombre y mujer revisando teléfonos en tienda de tecnología',

    },
];
