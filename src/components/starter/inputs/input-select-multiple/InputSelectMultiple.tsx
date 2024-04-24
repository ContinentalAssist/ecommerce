import { $, component$, useSignal, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './input-select-multiple.css?inline'

interface propsInputSelectMultiple {
    [key:string] : any,
    options : any[]
}

export const InputSelectMultiple = component$((props:propsInputSelectMultiple) => {
    useStyles$(styles)

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

    useVisibleTask$(() => {
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
    })

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
                    const newOption = String(option.label).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return String(newOption).toLowerCase().includes(String(e.target.value).toLowerCase())
                })

                options.value = newList
            }
            else
            {
                const newValues: string[] = Object.assign([],defaultValue.value)
                newValues[newValues.length - 1] = e.target.value.split(',')[newValues.length - 1]

                const newList = prevOptions.value.filter((option) => {
                    const newOption = String(option.label).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return String(newOption).toLowerCase().includes(String(newValues[newValues.length - 1]).toLowerCase())
                })

                options.value = newList
            }
        }
    })

    return(
        <></>
        // <div class='select-multiple dropdown'>
        //     <label class='form-label text-regular text-dark-blue' for={props.id}>{props.label}</label>
        //     <input 
        //         type='text'
        //         name={props.name}
        //         class='form-select form-select-multiple dropdown-toggle' 
        //         id={props.id}
        //         value={defaultValue.value}  
        //         data-value={datasetValue.value} 
        //         placeholder={props.placeholder}
        //         data-bs-toggle="dropdown" 
        //         data-bs-auto-close="outside" 
        //         data-bs-reference="toggle" 
        //         required={props.required}
        //         onKeyUp$={(e) => geFiltertList$(e)}
        //         readOnly={readOnly.value}
        //         onFocusin$={getLastOption$}
        //         onChange$={(e) => {
        //             if(e.target.value !== '' && e.target.classList.value.includes('is-invalid'))
        //             {
        //                 e.target.classList.remove('is-invalid')
        //                 e.target.classList.add('is-valid')
        //             }
        //             else
        //             {
        //                 e.target.classList.remove('is-valid')
        //             }
        //         }}
        //         // onFocus$={getLastOption$}
        //     />
        //     <ul id={'drodown-'+props.id} class='dropdown-menu'>
        //         {
        //             options.value.map((option,iOption) => {
        //                 return(
        //                     <li 
        //                         key={iOption+1}
        //                         class={datasetValue.value.includes(option.value) ? 'dropdown-item active' : 'dropdown-item'}
        //                         value={option.value} 
        //                         // onClick$={() => getOptions$(option)}
        //                     >
        //                         <div class="form-check">
        //                             <input 
        //                                 class="form-check-input" 
        //                                 type="checkbox" 
        //                                 id={"check-"+iOption} 
        //                                 checked={datasetValue.value.includes(option.value)}
        //                                 onClick$={() => getOptions$(option)}
        //                             />
        //                             <label 
        //                                 class="form-check-label" 
        //                                 // for={"check-"+iOption} 
        //                                 onClick$={() => getOptions$(option)}
        //                             >
        //                                 {option.label}
        //                             </label>
        //                         </div>
        //                     </li>
        //                 )
        //             })
        //         }
        //     </ul>
        // </div>
    )
})