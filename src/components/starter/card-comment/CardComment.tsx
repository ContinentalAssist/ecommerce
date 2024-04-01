import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './card-comment.css?inline'

interface propsCardComment {
    [key:string] : any
}

export const CardComment = component$((props:propsCardComment) => {
    useStylesScoped$(styles)
    
    return(
        <div class='card'>
            <div class='card-body'>
                <h4 class='text-dark-gray'>{props.title} 
                    <Slot/>
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