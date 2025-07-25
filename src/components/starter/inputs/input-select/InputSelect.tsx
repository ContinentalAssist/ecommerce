import { $, component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik"
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
    //const readOnly = useSignal(false)
     useTask$(({ track })=>{
        const value = track(()=>props.options);   
        prevOptions.value = value
        options.value = value    
     })
 

    const getOptions$ = $((value:any) => {
        const arrayObjects= [...props.options]        
        /* arrayObjects.map(item => {
            if(item.value == value)
            {
                defaultValue.value = item.label
                datasetValue.value = item.value
            }
        }) */
       
        const findItem= arrayObjects.find(item=> item.value == value)
        defaultValue.value = findItem?.label||''
        datasetValue.value = findItem?.value||''

        props.onChange !== undefined && props.onChange({label:defaultValue.value, value:datasetValue.value});
    })

    useTask$(()=>{
        if(props.value)
        {
            getOptions$(props.value)
        }
    })

    //useVisibleTask$(() => {
       

        /* if(navigator.userAgent.includes('Mobile'))
        {
            readOnly.value = true
        }

        if(props.readOnly != undefined)
        {
            readOnly.value = props.readOnly
        } */
    //})

    const getFiltertList$ = $((e:any) => {
        if(e.target.value == '')
        {
            options.value = prevOptions.value
        }
        else
        {
            const newList = prevOptions.value.filter((option) => {
                // Normaliza la opción y elimina los diacríticos
                const newOption = String(option.label)
                .normalize("NFD") // Descompone caracteres acentuados
                .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos

                // Normaliza la opción sin diacríticos y convierte a minúsculas
                const normalizedNewOption = String(newOption).toLowerCase();

                // Normaliza el valor de entrada y convierte a minúsculas
                const normalizedInput = String(e.target.value)
                    .normalize("NFD") // Descompone caracteres acentuados
                    .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos
                const normalizedInputLower = normalizedInput.toLowerCase();

                // Compara si la opción normalizada incluye el valor de entrada normalizado
                return normalizedNewOption.includes(normalizedInputLower);
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
//                            data-label={defaultValue.value}
                            onKeyUp$={(e) => getFiltertList$(e)}
                            //readOnly={readOnly.value}
                            placeholder={props.label}
                           /*  onChange$={(e:any) => {
                                if(e.target.value !== '' && e.target.classList.value.includes('is-invalid'))
                                {
                                    e.target.classList.remove('is-invalid')
                                    e.target.classList.add('is-valid')
                                }
                                else
                                {
                                    e.target.classList.remove('is-valid')
                                }
                                getOptions$(e.target.value);
                                //props.onChange !== undefined && props.onChange({label:defaultValue.value, value:e.target.value});
                                
                            }} */
                            ///onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0'}}
                            {...props.dataAttributes}
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
                    data-toggle="dropdown"
                    >
                    <div class='row inside' style={{ overflowY:'auto'}}>
                        {
                            options.value.length > 4 ?
                            <>
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
                                                class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-blue' : 'list-group-item text-medium text-dark-gray'} 
                                                value={option.value} 
                                                onClick$={() => {
                                                    getOptions$(option.value);
                                                    //props.onChange !== undefined && props.onChange(option);
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
                                                    class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-gray' : 'list-group-item text-medium text-dark-gray'} 
                                                    value={option.value} 
                                                    onClick$={() => {
                                                        getOptions$(option.value);
                                                        //props.onChange !== undefined && props.onChange(option);
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
                            </>
                            :
                            <div class='col-12'>
                            <ul class='list-group list-group-flush'>
                                {/* <li class='list-group-item' value=''>Deseleccionar</li> */}
                                {
                                    options.value.map((option,iOption) => {
                                        return(
                                            <li 
                                                key={iOption+1}
                                                class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-blue' : 'list-group-item text-medium text-dark-gray'} 
                                                value={option.value} 
                                                onClick$={() => {
                                                    getOptions$(option.value);
                                                    //props.onChange !== undefined && props.onChange(option);
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
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
})