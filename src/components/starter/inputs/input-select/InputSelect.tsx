import { $, component$, useSignal, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import styles from './input-select.css?inline'

interface propInputSelect {
    [key:string] : any,
    options : any[]
}

export const InputSelect = component$((props:propInputSelect) => {
    useStyles$(styles)

    const array : any[] = []

    const defaultValue = useSignal('')
    const datasetValue = useSignal('')
    const options = useSignal(array)
    const prevOptions = useSignal(array)
    const readOnly = useSignal(false)

    useTask$(() => {
        prevOptions.value = props.options
        options.value = props.options
    })

    const getOptions$ = $((value:any) => {
        props.options.map(item => {
            if(item.value == value)
            {
                defaultValue.value = item.label
                datasetValue.value = item.value
            }
        })
    })

    useVisibleTask$(() => {
        if(props.value)
        {
            getOptions$(props.value)
        }

        if(navigator.userAgent.includes('Mobile'))
        {
            readOnly.value = true
        }

        if(props.readOnly != undefined)
        {
            readOnly.value = props.readOnly
        }
    })

    const geFiltertList$ = $((e:any) => {
        if(e.target.value == '')
        {
            options.value = prevOptions.value
        }
        else
        {
            const newList = prevOptions.value.filter((option) => {
                const newOption = String(option.label).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return String(newOption).toLowerCase().includes(String(e.target.value).toLowerCase())
            })

            options.value = newList
        }
    })

    return(
        <div class='select dropdown'>
            <label class='form-label text-regular text-dark-blue' for={props.id}>{props.label}</label>
            <input 
                type='text' 
                class='form-select dropdown-toggle' 
                id={props.id} 
                name={props.name} 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                data-bs-reference="toggle" 
                required={props.required} 
                value={defaultValue.value}
                data-value={datasetValue.value}
                onKeyUp$={(e) => geFiltertList$(e)}
                readOnly={readOnly.value}
                onChange$={(e) => {
                    if(e.target.value !== '' && e.target.classList.value.includes('is-invalid'))
                    {
                        e.target.classList.remove('is-invalid')
                        e.target.classList.add('is-valid')
                    }
                    else
                    {
                        e.target.classList.remove('is-valid')
                    }
                }}
                {...props.dataAttributes}
            />
            <ul id={'drodown-'+props.id} class='dropdown-menu'>
                <li value=''></li>
                {
                    options.value.map((option,iOption) => {
                        return(
                            <li 
                                key={iOption+1}
                                class={datasetValue.value == option.value ? 'dropdown-item active' : 'dropdown-item'} 
                                value={option.value} 
                                onClick$={() => {
                                    getOptions$(option.value);
                                    props.onChange !== undefined && props.onChange(option);
                                    options.value = prevOptions.value
                                }}
                            >
                                    {option.label}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
})