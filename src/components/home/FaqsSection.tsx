import { component$ } from '@builder.io/qwik';


export const FaqsSection = component$(() => {
    return (
        <div class='bg-home-faqs'>
            <div class='col-xl-12'>
                <div class='container d-flex flex-column align-items-center py-5'>
                    <div class='text-center'>
                        <h1 class='text-bold-pq'>Preguntas frecuentes</h1>
                        <p>Todo lo que necesitas saber de tu seguro de viaje </p>
                    </div>
                    <div class="accordion" id="faqsAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    ¿Los planes tienen cobertura para casos de Covid-19?
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show"
                                 aria-labelledby="headingOne" data-bs-parent="#faqsAccordion">
                                <div class="accordion-body">
                                    Cualquiera de nuestros planes te acompañará, si se llegase a presentar un caso
                                    positivo. Consulta nuestros límites de edad al momento de realizar tu compra.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    ¿Qué países exigen contar con una asistencia médica en viaje?
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                                 data-bs-parent="#faqsAccordion">
                                <div class="accordion-body">
                                    Los países cambian constantemente sus regulaciones, por lo que te sugerimos
                                    consultar el mapa interactivo del portal de la IATA.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree" aria-expanded="false"
                                        aria-controls="collapseThree">
                                    ¿Tienes una emergencia?
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse"
                                 aria-labelledby="headingThree" data-bs-parent="#faqsAccordion">
                                <div class="accordion-body">
                                    ¡Estamos contigo!<br/>
                                    Operamos 24 horas, los 7 días de la semana, todo el año. Si necesitas de nosotros,
                                    llámanos o escríbenos vía WhatsApp al +13057225824.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
