import { $, component$ } from '@builder.io/qwik';
import { QuotesEngine } from '~/components/starter/quotes-engine/QuotesEngine';

export interface HomeHeaderProps {
    modeResumeStep: any;
    headerStep: boolean;
    openQuotesEngine$: any;
}

export const HomeHeader = component$((props: HomeHeaderProps) => {
    return (
        <div class='home' style={{minHeight:'75vh', marginTop: '70px'}}>
            <div class='bg-home-header position-absolute' />
            <div class='container position-relative min-h-[75vh] md:min-h-[75vh] min-[0px]:min-h-screen position-top-home'>
                <div id='container-quote' class='row align-content-center justify-content-center'
                     style={{minHeight: '75vh'}}>
                    <div class='col-xl-12 text-center home-magin'>
                        <div class="col-md-12 text-center d-none justify-content-center" id="collapseQuotesEngine-moblie">
                            <div>
                                <h1 class="color-text-blue-primary">
                                    Viaja con tranquilidad,<br/> <span
                                    class="text-bold ">protegido</span> en todo <br/>momento
                                </h1>
                            </div>
                        </div>
                        <div class="card card-body border-none shadow-lg">
                            <QuotesEngine modeResumeStep={props.modeResumeStep} headerStep={props.headerStep}/>
                        </div>
                        <div class="d-flex col-md-12" id="banner-text-mobile">

                            <div class="collapse margin-header col-md-6" id="collapseBtnQuotesEngine">

                                <button type="button" class="btn btn-primary btn-lg mt-4" onClick$={() => {
                                    props.openQuotesEngine$(true)
                                }}>¡Quiero comprar!
                                </button>
                            </div>
                            <div class="collapse show mt-8 margin-header col-md-6" id="collapseQuotesEngine">
                                <div>
                                    <h1 class='text-while'>
                                        viaja con tranquilidad,<br/> <span
                                        class="text-bold color-text-blue-home">protegido</span> en todo <br/>momento
                                    </h1>
                                    <h2 class='h5 text-regular text-sub-while'>
                                        Más de <span class='text-bold'>10 millones de viajeros </span> han
                                        confiado<br/>
                                        en nuestras asistencias en <br/>todo el mundo
                                    </h2>
                                </div>
                            </div>
                            <div class="show margin-header col-md-6 image-mujer" id="collapseQuotesEngine">
                                <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/ecommchica.png"
                                     alt="mujer-header" width="420" height="420"/>
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
                </div>
            </div>
        </div>
    )
});
