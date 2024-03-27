import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import styles from './quotes-engine.css?inline'

interface propsQuotesEngineSteps {
    [key:string] : any
}

export const QuotesEngineSteps = component$((props:propsQuotesEngineSteps) => {
    useStylesScoped$(styles)

    const navigate = useNavigate()

    const getPreviusStep$ = $((step:number) => {
        (window as any)['dataLayer'].push({
            'event': 'TrackEvent',
            'Category': 'Interacciones',
            'Action': 'Click',
            'Label': 'Anterior',
            'Page': '/step-'+step,
        });

        navigate('/quotes-engine/step-'+step)
    })

    return(
        <>
            <div class='container-fluid card-breadcrumb p-0'>
                <div class='row'>
                    <div class='col-lg-12 text-center'>
                        <nav class='container p-3'>
                            <div class="row justify-content-center">
                                <div id='1' class="col col-xs-3 offset-lg-1 text-start pe-0" onClick$={() => {getPreviusStep$(1)}}>
                                    <span class='btn btn-primary btn-step'>1</span>
                                    <label for='1' class='px-2'>Planes</label><hr/>
                                </div>
                                <div id='2' class="col col-xs-3 text-start pe-0" onClick$={() => {props.active >= 2 ? getPreviusStep$(2) : () => {}}}>
                                    <span class={props.active >= 2 ? 'btn btn-primary btn-step' : 'btn btn-primary btn-step disabled'}>2</span>
                                    <label for='2' class='px-2'>Complementos</label><hr/>
                                </div>
                                <div id='3' class="col col-xs-3 text-start pe-0" onClick$={() => {props.active >= 3 ? getPreviusStep$(3) : () => {}}}>
                                    <span class={props.active >= 3 ? 'btn btn-primary btn-step' : 'btn btn-primary btn-step disabled'}>3</span>
                                    <label for='3' class='px-2'>Resumen</label><hr/>
                                </div>
                                <div id='4' class="col col-xs-2 text-start pe-0" onClick$={() => {props.active >= 4 ? getPreviusStep$(4) : () => {}}}>
                                    <span class={props.active >= 4 ? 'btn btn-primary btn-step' : 'btn btn-primary btn-step disabled'}>4</span>
                                    <label for='4' class='px-2'>Método</label><hr/>
                                </div>
                                <div id='5' class="col col-xs-2 text-start pe-0">
                                    <span class={props.active >= 5 ? 'btn btn-primary btn-step' : 'btn btn-primary btn-step disabled'}>5</span>
                                    <label for='5' class='px-2'>Pago</label>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
})