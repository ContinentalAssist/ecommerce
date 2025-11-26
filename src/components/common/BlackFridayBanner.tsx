import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export const BlackFridayBanner = component$(() => {
    const isVisible = useSignal(false);
    const days = useSignal(0);
    const hours = useSignal(0);
    const minutes = useSignal(0);
    const seconds = useSignal(0);
    const location = useLocation();

    // Función para calcular el tiempo restante
    const calculateTimeLeft = $(() => {
        const endDate = new Date('2025-12-01T23:59:59').getTime();
        const now = new Date().getTime();
        const difference = endDate - now;

        if (difference > 0) {
            days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
            hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
        } else {
            isVisible.value = false;
        }
    });
    useVisibleTask$(() => {
        setTimeout(() => {
            isVisible.value = true;
        }, 2000);
        calculateTimeLeft();
        const interval = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearInterval(interval);
    });

    const closeBanner = $(() => {
        isVisible.value = false;
    });

    if (!isVisible.value || location.url.pathname !== '/') {
        return null;
    }

    return (
        <div class="black-friday-banner">
            <div class="banner-container">
                <div class="banner-content">
                    <div class="banner-text">
                        <h3 class="banner-title">Asegura tu viaje antes de que el <span class="color-white"><strong>tiempo se agote:</strong></span></h3>
                        <p class="banner-subtitle">Exclusivo online. <span class="color-white" style={{ textDecoration: 'underline' }}>*Aplican términos y condiciones</span></p>
                    </div>

                    <div class="countdown-container">
                        <div class="countdown-item">
                            <div class="countdown-value">{days.value.toString().padStart(2, '0')}</div>
                            <div class="countdown-label">días</div>
                        </div>
                        <div class="countdown-item">
                            <div class="countdown-value">{hours.value.toString().padStart(2, '0')}</div>
                            <div class="countdown-label">horas</div>
                        </div>
                        <div class="countdown-item">
                            <div class="countdown-value">{minutes.value.toString().padStart(2, '0')}</div>
                            <div class="countdown-label">minutos</div>
                        </div>
                        <div class="countdown-item">
                            <div class="countdown-value">{seconds.value.toString().padStart(2, '0')}</div>
                            <div class="countdown-label">segundos</div>
                        </div>
                    </div>
                </div>

                <button class="close-button" onClick$={closeBanner} aria-label="Cerrar banner">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
            </div>

            <style>{`
                .black-friday-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 0.5rem 0.75rem;
                    animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .banner-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #00184C;
                    border-radius: 12px;
                    padding: 0.75rem 3rem 0.75rem 1rem;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .banner-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .banner-text {
                    flex: 1;
                    min-width: 180px;
                }

                .banner-title {
                    font-size: 1.1rem;
                    color: #ffffff;
                    margin: 0 0 0.15rem 0;
                    line-height: 1.2;
                }

                .banner-subtitle {
                    font-size: 0.8rem;
                    color: #e0e0e0;
                    margin: 0;
                    line-height: 1.4;
                }

                .countdown-container {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .countdown-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 45px;
                }

                .countdown-value {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    padding: 0.25rem 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #ffffff;
                    min-width: 45px;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .countdown-label {
                    font-size: 0.65rem;
                    color: #b0b0b0;
                    margin-top: 0.2rem;
                    text-transform: lowercase;
                    font-weight: 500;
                }

                .close-button {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #ffffff;
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .close-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .close-button:active {
                    transform: scale(0.95);
                }

                /* Responsive para mobile */
                @media (max-width: 768px) {
                    .black-friday-banner {
                        padding: 0.25rem;
                    }

                    .banner-container {
                        padding: 0.75rem;
                        border-radius: 10px;
                    }

                    .banner-content {
                        flex-direction: column;
                        gap: 0.75rem;
                        align-items: flex-start;
                    }

                    .banner-text {
                        padding-right: 1.5rem;
                    }

                    .banner-title {
                        font-size: 1rem;
                    }

                    .banner-subtitle {
                        font-size: 0.75rem;
                    }

                    .countdown-container {
                        width: 100%;
                        justify-content: space-between;
                        gap: 0.25rem;
                    }

                    .countdown-item {
                        min-width: auto;
                        flex: 1;
                    }

                    .countdown-value {
                        font-size: 1.1rem;
                        padding: 0.25rem 0.35rem;
                        min-width: auto;
                        width: 100%;
                    }

                    .countdown-label {
                        font-size: 0.6rem;
                    }

                    .close-button {
                        top: 0.5rem;
                        right: 0.5rem;
                        width: 24px;
                        height: 24px;
                    }
                }

                /* Responsive para tablets */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .banner-title {
                        font-size: 1.1rem;
                    }

                    .countdown-value {
                        font-size: 1.25rem;
                        min-width: 45px;
                    }
                }
            `}</style>
        </div >
    );
});
