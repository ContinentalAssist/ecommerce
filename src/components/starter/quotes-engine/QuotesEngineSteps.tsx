import { component$, useStylesScoped$ } from "@builder.io/qwik";
// import { useNavigate } from "@builder.io/qwik-city";
import styles from './quotes-engine.css?inline'

interface propsQuotesEngineSteps {
    [key:string] : any
}

export const QuotesEngineSteps = component$((props:propsQuotesEngineSteps) => {
    useStylesScoped$(styles)

    // const navigate = useNavigate()

    // const getPreviusStep$ = $((step:number) => {
    //         'event': 'TrackEvent',
    //         'Category': 'Interacciones',
    //         'Action': 'Click',
    //         'Label': 'Anterior',
    //         'Page': '/step-'+step,
    //     });

    //     navigate('/quotes-engine/step-'+step)
    // })

    return(
        <div class='progressbar mx-4 mt-1'>
            <label class='text-dark-blue'>
                Paso { props.active} de {props.steps}
            </label>
            <div class="progress" role="progressbar">
                <div class="progress-bar" style={{width:(25* props.active)+'%'}}/>
            </div>
        </div>
    )
})