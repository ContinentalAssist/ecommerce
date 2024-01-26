import { component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './card-comment.css?inline'

interface propsCardComment {
    [key:string] : any
}

export const CardComment = component$((props:propsCardComment) => {
    useStylesScoped$(styles)

    const flag = useSignal('')
    const altText = useSignal('')

    useTask$(() => {
        flag.value = props.flag

        const newArray = flag.value.split('/')
        altText.value = flag.value.split('/')[newArray.length-1].split('.')[0]
    })

    useVisibleTask$(() => {
        flag.value = props.flag

        const newArray = flag.value.split('/')
        altText.value = flag.value.split('/')[newArray.length-1].split('.')[0]
    })
    
    return(
        <div class='card'>
            <div class='card-body'>
                <h4 class='text-dark-gray'>{props.title} 
                    <img src={flag.value} alt={altText.value} width={60} height={28} title={altText.value}/>
                </h4>
                <h5 class='text-bold text-dark-blue mb-4'>{props.subTitle}</h5>
                <p class='card-text'>
                    <i class="fas fa-quote-left"></i>
                        <span class='ms-2'>{props.description}</span>
                    <i class="fas fa-quote-right"></i>
                </p>
            </div>
        </div>
    )
})