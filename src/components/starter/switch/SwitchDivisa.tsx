import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import styles from './switch.css?inline'

interface propsSwitch
{
    [key:string] : any
}

export const SwitchDivisa = component$((props:propsSwitch) => {
    useStylesScoped$(styles)

    const active = useSignal('')

    useTask$(() => {
        active.value = props.value
    })

    useVisibleTask$(() => {
        active.value = props.value
    })

    const changeActive$ = $((e:string) => {
        active.value = e
        props.onChange !== undefined && props.onChange(e)
    })

    return(
        <div class='switch'>
            <div class='badge rounded-pill text-bg-primary'>
                <div class="btn-group" role="group">
                    <button 
                        type="button" 
                        class={active.value == 'base' ? 'btn btn-primary border border-0' : 'btn'} 
                        onClick$={() => {changeActive$('base')}}
                    >
                            {props.labels[0]}
                    </button>
                    <button 
                        type="button" 
                        class={active.value == 'local' ? 'btn btn-primary border border-0' : 'btn'}  
                        onClick$={() => {changeActive$('local')}}
                    >
                            {props.labels[1]}
                    </button>
                </div>
            </div>
        </div>
    )
})