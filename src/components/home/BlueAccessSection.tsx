import { component$ } from '@builder.io/qwik';

export interface BlueAccessSectionProps {
    urlBlueAccess: string;
}

export const BlueAccessSection = component$((_props: BlueAccessSectionProps) => {
    return (
        <div class="bg-home-blue-access" id="blue-access-section d-flex align-items-center justify-content-center " style={{ minHeight: '75vh' }}>
            <div class="col-md-12">
                <div class="container py-5 text-center d-none">
                    <img
                        class="img-bluaccess-logo"
                        src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/xentralpass.png"
                        alt="Blue Access"
                    />
                    <div title="Blue Access" class="text-center mt-5">
                        <h1 class="text-while-blueaccess">
                            Blue Access ahora es <span class="color-text-cyan">Xentral Pass</span>
                        </h1>
                    </div>
                    <div>
                        <p class="text-white-blue">
                            Transforma los vuelos demorados en experiencias VIP <br/>
                            Registra tus vuelos con 24 horas de anticipación y olvídate de los imprevistos.
                        </p>
                    </div>
                    <div class="d-flex justify-content-center div-btn-blueaccess">
                        <div class="blue-cuadreado d-flex justify-content-center align-items-center">
                            <div class="coverage-item">
                                <img
                                    src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/xentralpassbottomleft.png"
                                    alt="telemedicina"
                                />
                                <div>
                                    <p class="coverage-description text-white-blue-cuadrado mt-4 text-left">
                                        Cubrimos a partir de <br/>
                                        <span class='color-text-cyan'>60 minutos</span> <br/>
                                        de retraso
                                    </p>
                                </div>
                            </div>
                            <div>
                                <span class="vertical-line-cyan"></span>
                            </div>
                            <div>
                                <p class="text-white-blue-cuadrado text-left">
                                    Contamos con una
                                    <br/>red mundial de salas <br/>
                                    exclusivas
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="div-btn-blueaccess">
                        <button class="btn btn-blueaccess btn-lg mt-4 mb-4" onClick$={() => {
                            window.open('https://xentralpass.testingcontinentalassist.tech/', '_blank');
                        }}>Registra tus vuelos aquí
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});
