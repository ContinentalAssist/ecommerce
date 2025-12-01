import { $, component$ } from '@builder.io/qwik';
import { QuotesEngine } from '~/components/starter/quotes-engine/QuotesEngine';
import MujerNavidad from '~/media/quotes-engine/Woman-Navidad.png?jsx';
export interface HomeHeaderProps {
    modeResumeStep: any;
    headerStep: boolean;
    openQuotesEngine$: any;
}


export const HomeHeader = component$((props: HomeHeaderProps) => {
    return (
        <div class='home'>
            <div class='bg-home-header position-absolute' />
            <div class='container position-relative min-h-[75vh] md:min-h-[75vh] min-[0px]:min-h-[85vh] position-top-home'>
                <div id='container-quote' class='row align-content-center justify-content-center'>
                    <div class='col-xl-12 text-center home-magin pt-0 md:pt-12 mt-6 md:mt-6'>
                        <div class="col-md-12 text-center d-none justify-content-center" id="collapseQuotesEngine-moblie">
                            <div>
                                <h1 class="text-white">
                                        Regálate un viaje <br />seguro <span
                                        class="text-bold ">esta Navidad</span>
                                </h1>
                            </div>
                        </div>
                        <div class="col-12 text-center  justify-content-center">
                            <div class="d-block d-md-none margin-header col-md-6 image-mujer" id="collapseQuotesEngine">
                                <MujerNavidad alt="mujer-header" class="img-fluid-mujer-BF" />
                            </div>
                        </div>
                        <div class="card card-body border-none shadow-lg qoutes-card">
                            <QuotesEngine modeResumeStep={props.modeResumeStep} headerStep={props.headerStep} />
                        </div>
                        <div class="d-flex " id="banner-text-mobile">

                            <div class="collapse d-none margin-header col-md-6" id="collapseBtnQuotesEngine">

                                <button type="button" class="btn btn-primary btn-lg mt-4" onClick$={() => {
                                    props.openQuotesEngine$(true)
                                }}>¡Quiero comprar!
                                </button>
                            </div>
                            <div class="collapse show mt-8 margin-header col-md-6" id="collapseQuotesEngine">
                                <div>
                                    <h1 class='text-while'>
                                    Regálate un viaje<br />seguro <span
                                            class="text-bold color-text-blue-home">esta Navidad</span>
                                    </h1>
                                    <h2 class='h5 text-regular text-sub-while'>
                                        <span style={{ fontSize: '25px', marginRight: '13px' }}>⭐⭐⭐⭐⭐</span> Más de <span class='text-bold'>10 millones de viajeros </span> han
                                        confiado en nuestras asistencias en todo el mundo
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/*<div class='position-absolute' style={{left: 0, right: 0, bottom: 0, zIndex: 1}}>*/}
                        {/*    <div class='text-center justify-content-center scroll-indicator'>*/}
                        {/*        <p class='text-blue text-tin mb-0'>Desliza para ver más</p>*/}
                        {/*        <span id='scrollIndicatorDown' class='mb-3'>*/}
                        {/*            <i class="fas fa-chevron-down"></i>*/}
                        {/*            <i class="fas fa-chevron-down fa-xl"></i>*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div class="d-none d-md-block col-md-6 image-mujer" id="collapseQuotesEngine-desktop">
                        <MujerNavidad alt="mujer-header" class="img-fluid-mujer-BF" />
                    </div>
                </div>
            </div>
        </div>
    )
});
