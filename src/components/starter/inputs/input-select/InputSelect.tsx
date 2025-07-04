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

    useTask$(() => {
        prevOptions.value = props.options
        options.value = props.options      
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
        <div class='dropdown drop-select text-center' style={{ position: 'relative', width: '100%' }}>
            <div class="dropdown-toggle"
                id={'dropdown-toggle-'+props.id}
                style={{ position: 'relative', width: '100%' }}
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
                            placeholder={props.label}
                            onKeyUp$={(e) => {
                                const target = e.target as HTMLInputElement | null;
                                getFiltertList$(e);
                                // Mostrar el dropdown solo si hay texto
                                const dropdown = document.getElementById('dropdown-'+props.id);
                                if(target && target.value.length > 0) {
                                    dropdown && (dropdown.style.display = 'block');
                                } else {
                                    dropdown && (dropdown.style.display = 'none');
                                }
                            }}
                            onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0'}}
                            {...props.dataAttributes}
                        />
                        <label class='form-label text-medium text-dark-gray' for={props.id}>{props.label}</label>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr id={props.id} style={{ margin: '0' }}/>
            
            <div 
                id={'dropdown-'+props.id} 
                class='dropdown-menu' 
                aria-labelledby={props.id} 
                style={{ 
                    position: 'absolute',
                    top: 'calc(100% - 1rem)',
                    left: '0',
                    right: '0',
                    width: '100%',
                    zIndex: '1050',
                    display: 'none',
                    overflow: 'hidden',
                    padding: '0.5rem 0.5rem 0.5rem 0rem',
                    marginTop: '0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    backgroundColor: 'white'
                }}
            >
                <div class='row inside g-0' style={{ overflowY:'auto', maxHeight: '300px'}}>
                    {
                        options.value.length > 4 ?
                        <>
                        <div class='col-6'>
                        <ul class='list-group list-group-flush'>
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
                                                options.value = prevOptions.value
                                                // Ocultar la lista después de seleccionar
                                                const dropdown = document.getElementById('dropdown-'+props.id);
                                                dropdown && (dropdown.style.display = 'none');
                                            }}
                                        >
                                            {option.label}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        </div>
                        <div class='col-6' style={{ padding: '0rem 0.5rem 0rem 0rem'}}>
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
                                                    options.value = prevOptions.value
                                                    // Ocultar la lista después de seleccionar
                                                    const dropdown = document.getElementById('dropdown-'+props.id);
                                                    dropdown && (dropdown.style.display = 'none');
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
                            {
                                options.value.map((option,iOption) => {
                                    return(
                                        <li 
                                            key={iOption+1}
                                            class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-blue' : 'list-group-item text-medium text-dark-gray'} 
                                            value={option.value} 
                                            onClick$={() => {
                                                getOptions$(option.value);
                                                options.value = prevOptions.value
                                                // Ocultar la lista después de seleccionar
                                                const dropdown = document.getElementById('dropdown-'+props.id);
                                                dropdown && (dropdown.style.display = 'none');
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
    )
})