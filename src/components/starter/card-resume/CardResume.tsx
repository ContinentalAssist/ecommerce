import { component$, Slot, useSignal, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './card-resume.css?inline'

interface propsCardResume {
    [key:string]:any
}

export const CardResume = component$((props:propsCardResume) => {
    useStyles$(styles)

    const img = useSignal('')
    const altText = useSignal('')

    useTask$(() => {
        img.value = props.img

        const newArray = img.value.split('/')
        altText.value = img.value.split('/')[newArray.length-1].split('.')[0]
    })

    useVisibleTask$(() => {
        img.value = props.img

        const newArray = img.value.split('/')
        altText.value = img.value.split('/')[newArray.length-1].split('.')[0]
    })

    return(
        <div class='card-resume'>
            <div class='card-img'>
                <img src={img.value} class="img-fluid" width={160} height={160} alt={altText.value} title={altText.value}/>
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
                        <p class="card-text text-dark-gray mt-3">{props.description}</p>
                    }
                    <Slot/>
                </div>
            </div>
        </div>
    )
})