import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import styles from './card-resume.css?inline'

interface propsCardResume {
    [key:string]:any
}

export const CardResume = component$((props:propsCardResume) => {
    useStyles$(styles)

    return(
        <div class='card-resume'>
            <div class='card-img'>
                <Slot/>
            </div>
            <div class='card text-center mb-4'>
                <div class='card-body'>
                    <h3 class="h6 card-title text-semi-bold text-dark-blue">{props.title}</h3>
                    {
                        props.subTitle
                        &&
                        <h4 class='text-bold text-dark-blue'>{props.subTitle}</h4>
                    }
                    {
                        props.description
                        &&
                        <p class="card-text text-dark-gray">{props.description}</p>
                    }
                </div>
            </div>
        </div>
    )
})