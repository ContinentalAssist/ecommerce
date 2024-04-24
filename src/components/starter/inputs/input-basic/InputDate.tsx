import { component$, useStylesScoped$ } from "@builder.io/qwik"
import styles from './input-basic.css?inline'

interface propsInputDate {
    [key:string] : any
}

export const InputDate = component$((props:propsInputDate) => {
    useStylesScoped$(styles)

    return(
        <div class='input-basic'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span class="input-group-text text-dark-blue" onClick$={() => {(document.querySelector('input[id='+props.id+']') as HTMLInputElement).showPicker()}}>
                        <i class={'fa-solid fa-'+props.icon} />
                    </span>
                }
                <div class="form-floating">
                    <input 
                        type="date" 
                        id={props.id}
                        class={props.icon ? "form-control form-control-date text-bold text-dark-blue" : "form-control text-bold text-dark-blue"}  
                        name={props.name}
                        placeholder={props.label}
                        required={props.required} 
                        min={props.min} 
                        max={props.max} 
                        onKeyPress$={(e:any) => {
                            if(e.keyCode == 13)
                            {
                                props.onChange && props.onChange(e)
                            }
                        }}
                        onChange$={(e:any) => {
                            if(new Date(e.target.value).getFullYear() > 1000)
                            {
                                props.onChange && props.onChange(e)
                            }
                        }}
                        onBlur$={(e) => {props.onChange && props.onChange(e)}}
                        value={props.value}
                    />
                    <label class='form-label text-semi-bold text-dark-gray' for={props.id}>{props.label}</label>
                </div>
            </div>
        </div>
    )
})