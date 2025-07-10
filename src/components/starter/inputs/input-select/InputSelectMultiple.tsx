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

 /*     const getOptions$ = $((option: any) => {
        // Crear copias independientes de los arrays
        const newValues: string[] = [...defaultValue.value];
        const newDataSetValues: string[] = [...datasetValue.value];
        const input = document.querySelector('#' + props.id) as HTMLInputElement;
        options.value = [];
        
        
        if (datasetValue.value.includes(option.value)) {
            // Eliminar el valor de datasetValue
            datasetValue.value.forEach((item, index) => {
                if (item === option.value) {
                    newValues.splice(index, 1);
                    newDataSetValues.splice(index, 1);
                }
            });
        } else {
            // Agregar el nuevo valor
            newValues.push(option.label);
            newDataSetValues.push(option.value);
        }
        
        
        // Actualizar los valores originales
        defaultValue.value = newValues;
        datasetValue.value = newDataSetValues;
        
        // Asegúrate de que esto sea lo que deseas
        options.value = prevOptions.value;

        input.focus();
    });
 */
/* const getOptions$ = $((option: any) => {
    const newDataSetValues = datasetValue.value.includes(option.value)
        ? datasetValue.value.filter(item => item !== option.value) // Eliminar
        : [...datasetValue.value, option.value]; // Agregar

    datasetValue.value = newDataSetValues;
    defaultValue.value = newDataSetValues.map(value => {
        const foundOption = props.options.find(opt => opt.value === value);
        return foundOption ? foundOption.label : '';
    });
});
 */

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


useTask$(({ track }) => {
    track(() => props.value);
    
    if (props.value) {
        const currentSelectedIds = new Set(datasetValue.value);
        const newValuesFromProps = props.value || [];

        if (datasetValue.value.length === 0) {
            // Caso: datasetValue está vacío → seleccionar todos los valores de props.value
            const newLabels: string[] = [];
            const newIds: string[] = [];
            props.options.forEach(option => {
                if (newValuesFromProps.includes(String(option.value))||newValuesFromProps.includes(Number(option.value))) {
                    newLabels.push(option.label);
                    newIds.push(option.value);
                }
            });

             // Agregar una coma al final del último valor
           /*  if (newLabels.length > 0) {
                newLabels[newLabels.length - 1] += ',';
            } */

            // Actualización INMUTABLE de los signals
            defaultValue.value = newLabels;
            datasetValue.value = newIds;
        } else {
            // Caso: Agregar solo valores faltantes
            const newLabels = [...defaultValue.value];
            const newIds = [...datasetValue.value];
            
            newValuesFromProps.forEach((id:any)=> {
                if (!currentSelectedIds.has(id)) {
                    const option = props.options.find(opt => opt.value === id);
                    if (option) {
                        newLabels.push(option.label);
                        newIds.push(option.value);
                    }
                }
            });

             // Agregar una coma al final del último valor
            /* if (newLabels.length > 0) {
                newLabels[newLabels.length - 1] += ',';
            } */
            //datasetValue.value
            // Actualización INMUTABLE
            defaultValue.value = newLabels;
            datasetValue.value = newIds;
            
        }
    }
});





    useVisibleTask$(() => {
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

    /* const geFiltertList$ = $((e:any) => {
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
    }) */


const geFiltertList$ = $((e: any) => {
    if (e.target.value == '') {
        options.value = prevOptions.value;
    } else {
        if (defaultValue.value.length === 0) {
            const newList = prevOptions.value.filter((option) => {
                const newOption = String(option.label)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                const inputValue = String(e.target.value)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                return newOption.toLowerCase().includes(inputValue.toLowerCase());
            });
            options.value = newList;
        } else {
            const newValues: string[] = [...defaultValue.value]; // Usamos spread operator para clonar
            const splitValues = e.target.value.split(',');
            
            // Obtenemos el último valor de forma segura
            const lastIndex = newValues.length - 1;
            const lastInputValue = splitValues.length > lastIndex 
                ? splitValues[lastIndex].trim()
                : '';
            
            if (lastInputValue) {
                // Verificamos si hay una coma a la izquierda (en el valor anterior)
                const leftCommaExists = lastIndex > 0 
                    && newValues[lastIndex - 1].endsWith(',');
                
                // Actualizamos el valor actual
                newValues[lastIndex] = lastInputValue;
                
                // Solo agregamos coma a la derecha si:
                // 1. No existe coma a la izquierda
                // 2. El valor no está vacío
                if (!leftCommaExists && lastInputValue.length > 0) {
                    newValues[lastIndex] += ',';
                }
            }

            const newList = prevOptions.value.filter((option) => {
                const newOption = String(option.label)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                
                // Usamos el último valor sin la coma para comparar
                const lastValue = newValues[lastIndex].replace(/,$/, '')
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                
                return newOption.toLowerCase().includes(lastValue.toLowerCase());
            });
            
            options.value = newList;
        }
    }
});

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
                                                 onClick$={(e) =>{ e.stopPropagation(); getOptions$(option);}}
                                            >
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id={`check-left-${iOption}`}
                                                        checked={isActive}
                                                        onClick$={(e) =>{ e.stopPropagation();getOptions$(option);}}
                                                        aria-checked={isActive}
                                                    />
                                                    <label
                                                        class="form-check-label"                                                       
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
                                                onClick$={(e) =>{ e.stopPropagation(); getOptions$(option);}}
                                            >
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id={`check-right-${iOption}`}
                                                        checked={isActive}
                                                        onClick$={(e) =>{ e.stopPropagation(); getOptions$(option);}}
                                                        aria-checked={isActive}
                                                    />
                                                    <label
                                                        class="form-check-label text-medium text-dark-gray"                                                      
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