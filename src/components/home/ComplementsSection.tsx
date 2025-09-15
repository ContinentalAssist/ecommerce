import { component$ } from '@builder.io/qwik';

export const ComplementsSection = component$(() => {
    return (
        <div class='bg-home-complements'>
            <div class='col-lg-12 d-flex align-items-center justify-content-center p-5'>
                <div class="col-md-6 text-right">
                    <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/complementos.png" alt="prexistencia" />
                </div>
                <div class='col-md-6 text-left margin-left-complements'>
                   <div class=" margin-bottom-complements margin-curvada">
                       <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group39.png" alt="mama" height="130" />
                   </div>
                    <div class="margin-bottom-complements">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group40.png" alt="furamaa" height="130" />
                    </div>
                    <div class="margin-bottom-complements margin-curvada">
                        <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/Group41.png" alt="deporte" height="130"/>
                    </div>
                </div>
            </div>
        </div>
    );
});
