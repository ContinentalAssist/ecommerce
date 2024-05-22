import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import styles from './input-select.css?inline'

interface propInputSelect {
    [key:string] : any,
    options : any[]
}

export const InputSelect = component$((props:propInputSelect) => {
    useStylesScoped$(styles)

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

    const getFiltertList$ = $((e:any) => {
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
        <div class='dropdown drop-select text-center'>
            <div class="dropdown-toggle"
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                data-bs-reference="toggle" 
                id={'dropdown-toggle-'+props.id}
            >
                <div class='input-group '>
                    {
                        props.icon
                        &&
                        <span class="input-group-text text-dark-blue">
                            <i class={'fa-solid fa-'+props.icon} />
                        </span>
                    }
                    <div class="form-floating">
                        <input 
                            type='text' 
                            class='form-control form-control-select text-bold text-dark-blue' 
                            id={props.id} 
                            name={props.name} 
                            required={props.required} 
                            value={defaultValue.value}
                            data-value={datasetValue.value}
                            onKeyUp$={(e) => getFiltertList$(e)}
                            readOnly={readOnly.value}
                            placeholder={props.label}
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
                            onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0'}}
                            {...props.dataAttributes}
                        />
                        <label class='form-label text-semi-bold text-dark-gray' for={props.id}>{props.label}</label>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr id={props.id}/>
            <div 
                id={'dropdown-'+props.id} 
                class='dropdown-menu p-4' 
                aria-labelledby={props.id} 
                style={{
                        width:props.menuSize ? props.menuSize.width : 'auto',
                        height:props.menuSize ? props.menuSize.height : 'auto',
                        zIndex: '3001 !important',

                    }}
                >
                <div class='row'>
                    <div class='col-6'>
                        <ul class='list-group list-group-flush'>
                            {/* <li class='list-group-item' value=''>Deseleccionar</li> */}
                            {
                                options.value.map((option,iOption) => {
                                    return(
                                        iOption < (options.value.length / 2)
                                        &&
                                        <li 
                                            key={iOption+1}
                                            class={datasetValue.value == option.value ? 'list-group-item active text-semi-bold text-dark-blue' : 'list-group-item text-semi-bold text-dark-blue'} 
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
                    <div class='col-6'>
                        <ul class='list-group list-group-flush'>
                            {
                                options.value.map((option,iOption) => {
                                    return(
                                        iOption >= (options.value.length / 2)
                                        &&
                                        <li 
                                            key={iOption+1}
                                            class={datasetValue.value == option.value ? 'list-group-item active text-semi-bold text-dark-blue' : 'list-group-item text-semi-bold text-dark-blue'} 
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
                </div>
            </div>
        </div>
    )
})