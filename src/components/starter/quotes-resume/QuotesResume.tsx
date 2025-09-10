import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { QuotesEngine } from '../quotes-engine/QuotesEngine';
import { QuotesEngineSteps } from '../quotes-engine/QuotesEngineSteps';
import { SwitchDivisa } from '../switch/SwitchDivisa';
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from '~/utils/CurrencyFormater';

export const QuotesResume = component$(() => {
    const location = useLocation();
    const stateContext = useContext(WEBContext);
    const contextDivisa = useContext(DIVISAContext);
    
    // Signals para el resumen
    const headerStep = useSignal(true);
    const modeResumeStep = useSignal(true);
    const totalPay = useSignal({divisa:'',total:0});
    const divisaManual = useSignal(contextDivisa.divisaUSD);
    const pathNameURL = useSignal('');
    
    // Mapa de pasos
    const stepsMap = useSignal({
        '/quotes-engine/step-1/': { stepActive: 1, name: 'Planes' },
        '/quotes-engine/step-2/': { stepActive: 2, name: 'Complementos' },
        '/quotes-engine/step-3/': { stepActive: 3, name: 'Método' },
        '/quotes-engine/step-4/': { stepActive: 4, name: 'Método' },
        '/quotes-engine/message/': { stepActive: 5, name: 'Pago' },
    });

    // Función para cambiar divisa
    const changeDivisa$ = $((divisa:string) => {
        if(divisa == 'base')
        {
            divisaManual.value = true
            contextDivisa.divisaUSD = true
        }
        else if(divisa == 'local')
        {
            divisaManual.value = false
            contextDivisa.divisaUSD = false
        }
    })

    // Tasks para actualizar valores dinámicos
    useTask$(({ track }) => {
        const pathName = track(() => location.url.pathname);  
        pathNameURL.value = pathName;
    });

    useTask$(({ track }) => {
        const precioGrupal = track(() => stateContext?.value?.total?.total);  
        if(precioGrupal != undefined && Object.keys(stateContext.value).length > 0 && 'plan' in stateContext.value) {
            totalPay.value = {divisa: stateContext?.value?.plan?.codigomonedapago, total: Number(precioGrupal)};
        }
    });

    return (
        <div style={{maxWidth: '1350px', margin: '0 auto'}}>
            {/* Resumen de compra - Solo para quotes-engine */}
            {
                (pathNameURL.value == '/quotes-engine/step-1/' || pathNameURL.value == '/quotes-engine/step-2/') &&
                <div class="info-quote-wrapper" style={{background: 'white', margin: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '0'}}>
                    <div class="info-quote">
                        <div class="container p-2 contenedor-resumen">
                            <QuotesEngine modeResumeStep={modeResumeStep} headerStep={headerStep.value}/>
                        </div>
                    </div>
                </div>
            }

            {/* Pasos móviles - Solo para quotes-engine */}
            {
                pathNameURL.value != '/' && pathNameURL.value.includes('quotes-engine') &&
                <div class='row mobile text-center justify-content-center align-items-center'>
                    <hr class='m-0' />
                    <div class='col-xs-12 d-flex justify-content-center align-items-center' style={{padding:'20px'}}>
                        <QuotesEngineSteps active={stepsMap.value[pathNameURL.value].stepActive} name={stepsMap.value[pathNameURL.value].name} steps={5}/>
                    </div>
                    <div class="col-xs-12 d-flex justify-content-center align-items-center">
                        <div class='col-xs-5'>
                            {
                                pathNameURL.value === '/quotes-engine/step-2/' &&
                                <div class='icons mx-4' style={{border:'2px solid lightgray',borderRadius:'33px', padding:'9px 0',margin:'0px', minWidth:'120px'}}>
                                    <i class="fa-solid fa-basket-shopping text-end" style={{paddingRight:'5px'}}/>
                                    <span id='header-step-currency' class='text-bold text-dark-blue'>                                                 
                                        {
                                            totalPay.value.total && (divisaManual.value == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) : CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate))
                                        }
                                    </span>
                                </div>
                            }
                        </div>
                        <div class={pathNameURL.value == '/quotes-engine/step-1/'?'col-12':'col-xs-5'}>
                            {
                                pathNameURL.value != '/quotes-engine/step-3/' &&
                                pathNameURL.value != '/quotes-engine/step-4/' &&
                                pathNameURL.value != '/quotes-engine/message/' &&
                                <SwitchDivisa
                                    labels={['USD',stateContext.value?.currentRate?.code]}
                                    value={contextDivisa.divisaUSD ? 'base' : 'local'}
                                    onChange={$((e:any) => {changeDivisa$(e)})}
                                />
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});
