import { component$ } from '@builder.io/qwik';

export const ComplementsSection = component$(() => {
    return (
        <div class='bg-home-complements'>
            <div class='d-none d-md-block' id="complements-section-mobile">
                <div class='col-lg-12 d-flex align-items-center justify-content-center p-5' >
                    <div class="col-md-6 text-right">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/complementos.png"
                             alt="prexistencia"/>
                    </div>
                    <div class='col-md-6 text-left margin-left-complements'>
                        <div class=" margin-bottom-complements margin-curvada">
                            <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group39.png" alt="mama"
                                 height="130"/>
                        </div>
                        <div class="margin-bottom-complements">
                            <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group40.png" alt="furamaa"
                                 height="130"/>
                        </div>
                        <div class="margin-bottom-complements margin-curvada">
                            <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group41.png" alt="deporte"
                                 height="130"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class='p-5 d-block d-md-none text-center ' id="complements-section-desktop">

                <div>
                    <h1 class="text-title-complements text-semi-bold ">Complementos ideales para tu viaje</h1>
                </div>
                <div class='col-md-6 text-center '>
                    <div class=" margin-bottom-complements">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group39.png" alt="mama"
                             height="100"/>
                    </div>
                    <div class="margin-bottom-complements">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group40.png" alt="furamaa"
                             height="100"/>
                    </div>
                    <div class="margin-bottom-complements">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group41.png" alt="deporte"
                             height="100"/>
                    </div>
                </div>
            </div>
        </div>
    );
});
