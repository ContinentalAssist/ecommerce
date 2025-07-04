import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
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
    const showDropdown = useSignal(false) // Nuevo signal para controlar la visibilidad

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
        
        defaultValue.value = [...newValues.filter(val => val !== ''), ''];
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
        if(navigator.userAgent.includes('Mobile'))
            {
                readOnly.value = true
            }

        // Función para cerrar el dropdown al hacer clic fuera
        const handleClickOutside = (event: Event) => {
            const dropdownElement = document.querySelector('#dropdown-toggle-' + props.id);
            const dropdownMenuElement = document.querySelector('#dropdown-' + props.id);
            
            if (dropdownElement && dropdownMenuElement) {
                const target = event.target as Node;
                if (!dropdownElement.contains(target) && !dropdownMenuElement.contains(target)) {
                    showDropdown.value = false;
                }
            }
        };

        // Agregar event listener
        document.addEventListener('click', handleClickOutside);

        // Cleanup: remover el event listener cuando el componente se desmonte
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    })

    const getLastOption$ = $(() => {
        const last = defaultValue.value[defaultValue.value.length - 1]
        if (last !== '') {
            defaultValue.value.push('')
        }
    })
     

    const geFiltertList$ = $((e: any) => {
        const inputRawValue = e.target.value;
    
        if (inputRawValue === '') {
            // Si el input está vacío, mostrar todas las opciones y ocultar el dropdown
            options.value = prevOptions.value;
            showDropdown.value = false;
            return;
        }
    
        showDropdown.value = true;
    
        // Asegurar que el arreglo defaultValue tenga al menos un campo editable al final
        if (defaultValue.value.length === 0 || defaultValue.value.at(-1) !== '') {
            defaultValue.value.push('');
        }
    
        // Extraer el texto que el usuario está escribiendo después de la última coma
        const searchTerm = inputRawValue.split(',').at(-1)?.trim() || '';
    
        // Normalizar y filtrar las opciones basadas en el término actual
        const newList = prevOptions.value.filter((option) => {
            const optionText = String(option.label)
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
    
            const inputText = searchTerm
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
    
            return optionText.includes(inputText);
        });
    
        options.value = newList;
    });

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
                            name={props.name}
                            class='form-control form-control-select-multiple text-bold text-dark-blue' 
                            id={props.id}
                            value={
                                (() => {
                                    const cleanList = defaultValue.value.filter((val) => val !== '');
                                    if (cleanList.length === 0) {
                                        return ''; // Si no hay elementos seleccionados, mostrar vacío
                                    }
                                    return cleanList.join(', ') + (defaultValue.value.at(-1) === '' ? ', ' : '');
                                })()
                            }                           
                            data-value={datasetValue.value} 
                            placeholder={props.label} 
                            required={props.required}
                            onKeyUp$={(e) => {
                                geFiltertList$(e);
                            }}
                            onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0',
                            props.onBlur !== undefined && props.onBlur({label:defaultValue.value,value:datasetValue.value});
                            }}
                            onFocusin$={getLastOption$}
                            {...props.dataAttributes}
                        />
                        <label class='form-label text-medium text-dark-gray' for={props.id}>{props.label}</label>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr id={props.id} style={{ margin: '0' }}/>
            
            {/* Usar renderizado condicional con showDropdown.value */}
            {showDropdown.value && (
                <div 
                    id={'dropdown-'+props.id} 
                    class='dropdown-menu show' 
                    aria-labelledby={props.id} 
                    style={{ 
                        position: 'absolute',
                        top: 'calc(100% - 1rem)',
                        left: '0',
                        zIndex: '1050',
                        overflow: 'hidden',
                        padding: '0.5rem 0.5rem 0.5rem 0rem',
                        marginTop: '0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '1rem',
                        backgroundColor: 'white',
                        width: '100%',                 
                    }}
                >

                    <div class='row inside g-0' style={{ overflowY: 'auto' }}>
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
                                    return null;
                                })}
                            </ul>
                        </div>
                        <div class='col-6' style={{ padding: '0rem 0.5rem 0rem 0rem'}}>
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
                                    return null;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})