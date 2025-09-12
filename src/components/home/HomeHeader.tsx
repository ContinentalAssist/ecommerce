import { $, component$, useSignal } from '@builder.io/qwik';
import { QuotesEngine } from '~/components/starter/quotes-engine/QuotesEngine';

export interface HomeHeaderProps {
    modeResumeStep: any;
    headerStep: boolean;
    openQuotesEngine$: any;
}

export const HomeHeader = component$((props: HomeHeaderProps) => {
    return (
        <div class='home' style={{minHeight:'75vh'}}>
            <div class='bg-home-header position-absolute' />
            <div class='container position-relative min-h-[75vh] md:min-h-[75vh] min-[0px]:min-h-screen'>
                <div id='container-quote' class='row align-content-center justify-content-center'
                     style={{minHeight: '75vh'}}>
                    <div class='col-xl-12 text-center primera-seccion pt-4 pb-5'>
                        <div class="collapse" id="collapseBtnQuotesEngine">
                            <h1 class='text-semi-bold text-blue tittle-collapse'>
                                <span class='text-tin mt-4'>¿Buscando un</span><br class='mobile'/> seguro o
                                asistencia?
                            </h1>
                            <h2 class='h5 text-regular text-dark-gray'>Viaja internacionalmente con
                                tranquilidad</h2>
                            <hr class='divider mt-4 mb-1'/>
                            <br></br>
                            <button type="button" class="btn btn-primary btn-lg mt-4" onClick$={() => {
                                props.openQuotesEngine$(true)
                            }}>¡Quiero comprar!
                            </button>
                        </div>
                        <div class="collapse show mt-8" id="collapseQuotesEngine">
                            <h1 class='text-semi-bold text-blue'>
                                <span class='text-tin'>¿Buscando un</span><br class='mobile'/> seguro o
                                asistencia?
                            </h1>
                            <h2 class='h5 text-regular text-dark-gray '>Viaja internacionalmente con
                                tranquilidad</h2>
                            <hr class='divider mt-4 mb-4 '/>
                            <div class="card card-body border-none shadow-lg">
                                <QuotesEngine modeResumeStep={props.modeResumeStep} headerStep={props.headerStep}/>
                            </div>
                        </div>
                        <div class='position-absolute' style={{left: 0, right: 0, bottom: 0, zIndex: 1}}>
                            <div class='text-center justify-content-center scroll-indicator'>
                                <p class='text-blue text-tin mb-0'>Desliza para ver más</p>
                                <span id='scrollIndicatorDown' class='mb-3'>
                                    <i class="fas fa-chevron-down"></i>
                                    <i class="fas fa-chevron-down fa-xl"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});
