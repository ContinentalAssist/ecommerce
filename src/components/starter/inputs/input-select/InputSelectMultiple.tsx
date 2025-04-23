import { $, component$, useSignal, useStylesScoped$, useTask$,useVisibleTask$  } from "@builder.io/qwik";
import styles from './input-select.css?inline'

interface propsInputSelectMultiple {
    [key:string] : any,
    options : any[]
}

export const InputSelectMultiple = component$((props:propsInputSelectMultiple) => {
    useStylesScoped$(styles)

    const array : any[] = []

    const defaultValue = useSignal(array)
    const datasetValue = useSignal(array)
    const options = useSignal(array)
    const prevOptions = useSignal(array)
    const readOnly = useSignal(false)

    useTask$(() => {
        prevOptions.value = props.options
        options.value = props.options
    })

    const getOptions$ = $((option:any) => {
        const newValues: string[] = Object.assign([],defaultValue.value)
        const newDataSetValues: string[] = Object.assign([],datasetValue.value)
        const input = document.querySelector('#'+props.id) as HTMLInputElement     
        options.value = []
        if(datasetValue.value.includes(option.value))
        {
            datasetValue.value.map((item,index) => {
                if(item == option.value)
                {
                    newValues.splice(index,1)
                    newDataSetValues.splice(index,1)
                }
            })
        }
        else
        {
            newValues.push(option.label)
            newDataSetValues.push(option.value)
        }
        
        defaultValue.value = newValues
        datasetValue.value = newDataSetValues
        options.value = prevOptions.value

        input.focus()
    })

    useTask$(({ track })=>{
        const value = track(()=>props.value);        
        if (value) 
        {
            const optionsValues : any[] = props.value

            props.options.map(option => {
                optionsValues.map(value => {
                    if(value == option.value)
                    {
                        getOptions$(option)
                    }
                })
            })
        }
        
    })

    useVisibleTask$(() => {
        //CORREGIR ESTO
        if(navigator.userAgent.includes('Mobile'))
            {
                readOnly.value = true
            }
    })
  /*   useVisibleTask$(() => {
        if(props.value)
        {
            const optionsValues : any[] = props.value

            props.options.map(option => {
                optionsValues.map(value => {
                    if(value == option.value)
                    {
                        getOptions$(option)
                    }
                })
            })
        }

        if(navigator.userAgent.includes('Mobile'))
        {
            readOnly.value = true
        }
    }) */

    const getLastOption$ = $(() => {
        if(defaultValue.value.length > 0)
        {
            defaultValue.value.map((val,iVal) => {
                if(val === '')
                {
                    defaultValue.value.splice(iVal,1)
                }
            })

            defaultValue.value.push('')
        }
    })

    const geFiltertList$ = $((e:any) => {
        if(e.target.value == '')
        {
            options.value = prevOptions.value
        }
        else
        {
            if(defaultValue.value.length === 0)
            {
                const newList = prevOptions.value.filter((option) => {
                // Normaliza la opción y elimina los diacríticos
                const newOption = String(option.label)
                .normalize("NFD") // Descompone caracteres acentuados
                .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos

                // Normaliza el valor de entrada y elimina diacríticos
                const inputValue = String(e.target.value)
                    .normalize("NFD") // Descompone caracteres acentuados
                    .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos

                // Compara si la opción normalizada incluye el valor de entrada normalizado
                return newOption.toLowerCase().includes(inputValue.toLowerCase());
                })

                options.value = newList
            }
            else
            {
                const newValues: string[] = Object.assign([],defaultValue.value)
                newValues[newValues.length - 1] = e.target.value.split(',')[newValues.length - 1]

                const newList = prevOptions.value.filter((option) => {
                    // Normaliza la opción y elimina los diacríticos
                const newOption = String(option.label)
                .normalize("NFD") // Descompone caracteres acentuados
                .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos

                // Normaliza el último valor de newValues y elimina diacríticos
                const lastValue = String(newValues[newValues.length - 1])
                    .normalize("NFD") // Descompone caracteres acentuados
                    .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos

                  // Compara si la opción normalizada incluye el último valor normalizado
                 return newOption.toLowerCase().includes(lastValue.toLowerCase());
                })                
                options.value = newList
            }
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
                            name={props.name}
                            class='form-control form-control-select-multiple text-bold text-dark-blue' 
                            id={props.id}
                            value={defaultValue.value}  
                            data-value={datasetValue.value} 
                            placeholder={props.label} 
                            required={props.required}
                            onKeyUp$={(e) => geFiltertList$(e)}
                            //readOnly={readOnly.value}
                            onFocusin$={getLastOption$}
                            /* onChange$={(e) => {                                
                                if(e.target.value !== '' && e.target.classList.value.includes('is-invalid'))
                                {
                                    e.target.classList.remove('is-invalid')
                                    e.target.classList.add('is-valid')
                                }
                                else
                                {
                                    e.target.classList.remove('is-valid')
                                }
                            }} */
                            onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0',
                            props.onBlur !== undefined && props.onBlur({label:defaultValue.value,value:datasetValue.value});
                            }}
                        />
                        <label class='form-label text-medium text-dark-gray' for={props.id}>{props.label}</label>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr id={props.id}/>
            <div class="row">
                <div 
                    id={'dropdown-'+props.id} 
                    class='dropdown-menu p-4' 
                    aria-labelledby={props.id}
                    style={{ overflow:'hidden'}}
                >
                    <div class='row inside' style={{ overflowY: 'auto' }}>
                        <div class='col-6'>
                            <ul class='list-group list-group-flush'>
                                {options.value.map((option, iOption) => {
                                    if (iOption < options.value.length / 2) {
                                        const isActive = datasetValue.value.includes(option.value);
                                        return (
                                            <li
                                                key={`left-${iOption + 1}`}
                                                class={`list-group-item text-medium ${isActive ? 'active text-dark-blue' : 'text-dark-gray'}`}
                                                value={option.value}
                                            >
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id={`check-left-${iOption}`}
                                                        checked={isActive}
                                                        onClick$={() => getOptions$(option)}
                                                        aria-checked={isActive}
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        onClick$={() => getOptions$(option)}
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            </li>
                                        );
                                    }
                                    return null; // Retorna null si no se cumple la condición
                                })}
                            </ul>
                        </div>
                        <div class='col-6'>
                            <ul class='list-group list-group-flush'>
                                {options.value.map((option, iOption) => {
                                    if (iOption >= options.value.length / 2) {
                                        const isActive = datasetValue.value.includes(option.value);
                                        return (
                                            <li
                                                key={`right-${iOption + 1}`}
                                                class={`list-group-item text-semi-bold ${isActive ? 'active text-dark-blue' : 'text-dark-blue'}`}
                                                value={option.value}
                                            >
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id={`check-right-${iOption}`}
                                                        checked={isActive}
                                                        onClick$={() => getOptions$(option)}
                                                        aria-checked={isActive}
                                                    />
                                                    <label
                                                        class="form-check-label text-medium text-dark-gray"
                                                        onClick$={() => getOptions$(option)}
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            </li>
                                        );
                                    }
                                    return null; // Retorna null si no se cumple la condición
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})