import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { InputPaxs } from "../inputs/input-paxs/InputPaxs";
import { InputSelectMultiple } from "../inputs/input-select-multiple/InputSelectMultiple";
import { InputSelect } from "../inputs/input-select/InputSelect";
import styles from './form.css?inline'

interface propsForm {
    [key:string] : any,
    form : any[]
}

export const Form = component$((props:propsForm) => {
    useStylesScoped$(styles)

    const forms : {row:[{[key:string]:any,options:any[]}]}[] = []

    const form = useSignal(forms)

    useTask$(() => {
        form.value = props.form
    })

    useVisibleTask$(() => {
        form.value = props.form
    })

    const valiadateKeyUp$= $((target: any)=>{
        
        if ((target.type == 'text') && (target.dataset.textonly == 'true')) 
        {
            const input = document.querySelector('#'+target.id) as HTMLInputElement

            const regex = new RegExp(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
            
            if(regex.test(input.value))
            {
                input.value = String(input.value);
            }
            else
            {
                let str= input.value;
                str = str.slice(0, -1);
                input.value= str;
            }
        }
    }) 

    const valiadateBlur$= $((target: any)=>{
        const input = document.querySelector('#'+target.id) as HTMLInputElement

         if(input.type === 'tel')
        {
            const regexp = new RegExp(/^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.\-\s]){2}\d{3}|(\d{2}[*.\-\s]){3}\d{2}|(\d{4}[*.\-\s]){1}\d{4})|\d{8}|\d{10}|\d{12}$/)

            if(regexp.test(input.value))
            {
                input.value= String(input.value);
                input.classList.remove('is-invalid')
            }
            else 
            {
                // input.value= '';
                input.classList.add('is-invalid')
                input.focus()
            }
        }
        else  if(input.type === 'email')
        {
            const regex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)

            if(regex.test(input.value))
            {
                input.value = String(input.value);
                input.classList.remove('is-invalid')
            }
            else
            {
                // input.value= '';
                input.classList.add('is-invalid')
                input.focus()
            }
        }
        else  if(input.type === 'number')
        {
            
            if(Number(input.value))
            {
                input.value=  String(input.value);
                input.classList.remove('is-invalid')
            }
            else
            {
                // input.value= '';
                input.classList.add('is-invalid')
                input.focus()
            }
        }

    })

    return(
        <form id={props.id} class='needs-validation' noValidate autoComplete='off'>
            <div class='container p-0'>
                {
                    form.value.map((rowInput,rIndex) => {
                        return(
                            <div key={rIndex} class='row row-mobile'>
                                {
                                    rowInput.row.map((columnInput,iIndex) => {
                                        if(columnInput.type === 'textarea')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}>
                                                        {columnInput.label} 
                                                        {/* {
                                                            columnInput.required
                                                            &&
                                                            <>
                                                                {' '}<img src='/assets/img/icons/continental-assist-icon-star.webp' class='img-fluid' width={16} height={16} alt='continental-assist-icon-star'/>
                                                            </>
                                                        } */}
                                                    </label>
                                                    <textarea class='form-control' id={props.id+'-input-'+rIndex+'-'+iIndex} name={columnInput.name} style={{minHeight:'200px'}} required={columnInput.required}/>
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <InputSelect
                                                        id={props.id+'-select-'+rIndex+'-'+iIndex}
                                                        name={columnInput.name}
                                                        label={columnInput.label}
                                                        options={columnInput.options}
                                                        readOnly={columnInput.readOnly}
                                                        required={columnInput.required}
                                                        value={columnInput.value}
                                                        onChange={columnInput.onChange}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select-native')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label class='form-label text-regular text-dark-blue'>
                                                        {columnInput.label} 
                                                        {/* {
                                                            columnInput.required
                                                            &&
                                                            <>
                                                                {' '}<img src='/assets/img/icons/continental-assist-icon-star.webp' class='img-fluid' width={16} height={16} alt='continental-assist-icon-star'/>
                                                            </>
                                                        } */}
                                                    </label>
                                                    <select class='form-select' id={columnInput.id} name={columnInput.name} required={columnInput.required} onChange$={(e) => {columnInput.onChange(e)}}>
                                                        <option value='' selected={true} disabled={true}></option>
                                                        {
                                                            columnInput.options.map((option:any,index:number) => {
                                                                return(
                                                                    <option key={index} selected={columnInput.value == option.value} value={option.value}>{option.label}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'paxs')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <InputPaxs
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        required={columnInput.required}
                                                        value={columnInput.value}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select-multiple')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                     <InputSelectMultiple
                                                        label={columnInput.label}
                                                        id={props.id+'-select-'+rIndex+'-'+iIndex}
                                                        name={columnInput.name}
                                                        required={columnInput.required}
                                                        options={columnInput.options}
                                                        value={columnInput.value}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'date')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}
                                                    >
                                                        {columnInput.label}
                                                    </label>
                                                    <input class='form-control' 
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        type={'date'} 
                                                        required={columnInput.required} 
                                                        min={columnInput.min} 
                                                        max={columnInput.max} 
                                                        maxLength={columnInput.maxLength} 
                                                        onKeyPress$={(e:any) => {
                                                            if(e.keyCode == 13)
                                                            {
                                                                columnInput.onChange && columnInput.onChange(e)
                                                            }
                                                        }}
                                                        onChange$={(e:any) => {
                                                            if(new Date(e.target.value).getFullYear() > 1000)
                                                            {
                                                                columnInput.onChange && columnInput.onChange(e)
                                                            }
                                                        }}
                                                        onBlur$={(e) => {columnInput.onChange && columnInput.onChange(e)}}
                                                        value={columnInput.value}
                                                        // onClick$={() => {(document.querySelector('input[id='+props.id+'-input-'+rIndex+'-'+iIndex+']') as HTMLInputElement).showPicker()}}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'phone')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}
                                                    >
                                                        {columnInput.label} 
                                                    </label>
                                                    <input class='form-control' 
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        type={'tel'} 
                                                        required={columnInput.required} 
                                                        min={columnInput.min} 
                                                        max={columnInput.max} 
                                                        maxLength={columnInput.maxLength} 
                                                        onChange$={(e) => {columnInput.onChange && columnInput.onChange(e)}}
                                                        value={columnInput.value}
                                                        placeholder={columnInput.placeholder}
                                                        data-textonly={columnInput.textOnly}
                                                        onBlur$={e=>valiadateBlur$(e.target)}
                                                    />
                                                    <div id={props.id+'-input-'+rIndex+'-'+iIndex+'-feedback'} class="invalid-feedback">
                                                        Por favor ingrese un telefono valido.
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'email')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}
                                                    >
                                                        {columnInput.label} 
                                                    </label>
                                                    <input class='form-control' 
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        type={'email'} 
                                                        required={columnInput.required} 
                                                        min={columnInput.min} 
                                                        max={columnInput.max} 
                                                        maxLength={columnInput.maxLength} 
                                                        onChange$={(e) => {columnInput.onChange && columnInput.onChange(e)}}
                                                        value={columnInput.value}
                                                        placeholder={columnInput.placeholder}
                                                        data-textonly={columnInput.textOnly}
                                                        onBlur$={e=>valiadateBlur$(e.target)}
                                                    />
                                                    <div id={props.id+'-input-'+rIndex+'-'+iIndex+'-feedback'} class="invalid-feedback">
                                                        Por favor ingrese un correo valido.
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'number')
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}
                                                    >
                                                        {columnInput.label} 
                                                    </label>
                                                    <input class='form-control' 
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        type={'number'} 
                                                        required={columnInput.required} 
                                                        min={columnInput.min} 
                                                        max={columnInput.max} 
                                                        maxLength={columnInput.maxLength} 
                                                        onChange$={(e) => {columnInput.onChange && columnInput.onChange(e)}}
                                                        value={columnInput.value}
                                                        placeholder={columnInput.placeholder}
                                                        data-textonly={columnInput.textOnly}
                                                        onBlur$={e=>valiadateBlur$(e.target)}
                                                    />
                                                    <div id={props.id+'-input-'+rIndex+'-'+iIndex+'-feedback'} class="invalid-feedback">
                                                        Por favor ingrese solamente numeros.
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <div key={rowInput+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-dark-blue' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}
                                                    >
                                                        {columnInput.label} 
                                                    </label>
                                                    <input class='form-control' 
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        name={columnInput.name} 
                                                        type={columnInput.type} 
                                                        required={columnInput.required} 
                                                        min={columnInput.min} 
                                                        max={columnInput.max} 
                                                        maxLength={columnInput.maxLength} 
                                                        onChange$={(e) => {columnInput.onChange && columnInput.onChange(e)}}
                                                        value={columnInput.value}
                                                        placeholder={columnInput.placeholder}
                                                        data-textonly={columnInput.textOnly}
                                                        onKeyUp$={e=>valiadateKeyUp$(e.target)}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </form>
    )
})