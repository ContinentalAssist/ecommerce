import { component$ } from '@builder.io/qwik';
import ImgContinentalAssistBlueAccess from '~/media/home/continental-assist-blue-access.webp?jsx';
import ImgContinentalAssistClock from '~/media/icons/BlueCyren-Ecommerce-relog.webp?jsx';

export interface BlueAccessSectionProps {
    urlBlueAccess: string;
}

export const BlueAccessSection = component$((props: BlueAccessSectionProps) => {
    return (
        <div id='blue-access' class='bg-home-blue-access' style={{minHeight: '980px !important'}}>
            <div class='col-lg-12'>
                <div class='container'>
                    <div class='row align-content-center'>
                        <div class='col-xl-12'>
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <div class='col-xl-12 col-xs-12 text-center'>
                                        <ImgContinentalAssistBlueAccess class='img-fluid img-blue-access mt-5'
                                                                        title='continental-assist-blue-access-logo'
                                                                        alt='continental-assist-blue-access-logo'/>
                                    </div>

                                    <div class="col-xl-6 col-xs-12">
                                        <h3 class='text-message h3 text-bold text-white'>
                                            Transforma los vuelos <br/>
                                            demorados en <span class='text-light-blue'>experiencias VIP</span>
                                        </h3>
                                        <p class='text-message text-white text-regular'> Registra a continuación
                                            tus
                                            vuelos y olvídate de los imprevistos.</p>
                                        <div class="row">
                                            <div id="div-clock"
                                                 class="col-xl-8 col-xs-12 align-items-center p-3 mx-0">
                                                <div class="row">
                                                    <div class="d-flex flex-row col-xl-6 col-xs-6 pt-2 px-0">
                                                        <ImgContinentalAssistClock class='img-clock img-fluid px-1'
                                                                                   title='continental-assist-blue-access-reloj'
                                                                                   alt='continental-assist-blue-access-reloj'/>

                                                        <p class='text-semi-bold text-white px-2'>
                                                            <small style={{fontSize: '12px'}}>
                                                                Cubrimos a partir de <br/>
                                                            </small>
                                                            <b class='text-yellow' style={{fontSize: '16px'}}>60
                                                                minutos</b><br/>
                                                            <small style={{fontSize: '12px'}}>
                                                                de retraso
                                                            </small>
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="col-xl-6 col-xs-6 justify-content-center p-2 px-3"
                                                        style={{borderLeft: '1px solid #FEDF84'}}>

                                                        <p class='text-regular text-white'
                                                           style={{fontSize: '14px'}}>
                                                            Contamos con <br/>
                                                            una red mundial de<br/>
                                                            salas exclusivas.
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div class="row pt-4">
                                            <div class="col">
                                                <p class='text-message text-regular text-white '>
                                                    <b>Este es un servicio de acceso a salas VIP por demora en
                                                        vuelos.</b><br/>
                                                    Solo debes tener contratado un plan de asistencia
                                                    internacional <br/>
                                                    y tener a la mano tu número de voucher.
                                                </p>
                                            </div>
                                        </div>
                                        <div class="row not-mobile pt-4">
                                            <div class="col">
                                                <p class='text-message text-regular text-white '>
                                                    Aplican Términos y Condiciones.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 p-3">
                                        <div class="row align-items-center">
                                        <iframe
                                            id='blueaccess-widget'
                                            src={props.urlBlueAccess}
                                            frameBorder="0"
                                            title="BlueAccess Widget"
                                        />
                                        </div>
                                        <div class="row text-center mobile pt-4">
                                            <div class="col">
                                                <p class='text-message text-regular text-white '>
                                                    Aplican Términos y Condiciones.
                                                </p>
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
