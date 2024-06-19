import { $, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { InputPaxs } from "../inputs/input-paxs/InputPaxs";
import { InputSelectMultiple } from "../inputs/input-select/InputSelectMultiple";
import { InputSelect } from "../inputs/input-select/InputSelect";
import styles from './form.css?inline'
import stylesInputBasic from '../inputs/input-basic/input-basic.css?inline'

interface propsInput
{
    [key:string] : any
}

export const Input = (props:propsInput) => {    
    const dataAttributes = props.dataAttributes ? { ...props.dataAttributes } : {};

    const validateKeyUp$= $((target: any) => {
        
        if ((target.type == 'text') && (target.dataset.textonly === 'true')) 
        {
            const input = document.querySelector('#'+target.id) as HTMLInputElement

            const regex = new RegExp(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
            
            if(regex.test(input.value)){
                input.value = String(input.value);
            }else{
                let str= input.value;
                str = str.slice(0, -1);
                input.value= str;

            }
        }
    }) 

    return(
        <div class='input-basic text-center'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span 
                        class="input-group-text text-dark-blue" 
                        onClick$={() => {
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).showPicker();
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).focus();
                            }
                        }
                    >
                        <i class={'text-dark-blue  fa-solid fa-'+props.icon} />
                    </span>
                }
                 <div class="form-floating">
                    <input class='form-control text-bold text-dark-blue' 
                        id={props.id} 
                        name={props.name} 
                        type='text'
                        required={props.required} 
                        min={props.min} 
                        max={props.max} 
                        maxLength={props.maxLength} 
                        onChange$={(e) => {props.onChange && props.onChange(e)}}
                        onClick$={(e) => {props.onClick && props.onClick(e)}}
                        value={props.value}
                        placeholder={props.placeholder}
                        data-textonly={props.textOnly}
                        onKeyUp$={e=>validateKeyUp$(e.target)}
                        readOnly={props.readOnly}
                        tabIndex={props.tabIndex}
                        disabled={props.disabled}
                        {...dataAttributes}
                        
                    />
                    <label 
                        class='form-label text-medium text-gray' 
                        for={props.id}
                    >
                        {props.label}
                    </label>
                 </div>
            </div>
        </div>                                            
    )
}

interface propsInputDate {
    [key:string] : any
}

export const InputDate = (props:propsInputDate) => {
    const dataAttributes = props.dataAttributes ? { ...props.dataAttributes } : {};

    return(
        <div class='input-basic text-center'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span 
                        class="input-group-text text-dark-blue" 
                        onClick$={() => {
                                (document.querySelector('input[id='+props.id+']') as HTMLInputElement).showPicker();
                                (document.querySelector('input[id='+props.id+']') as HTMLInputElement).focus();
                            }
                        }
                    >
                        <i class={'fa-regular fa-'+props.icon} />
                    </span>
                }
                <div class="form-floating">
                    <input 
                        type="date" 
                        id={props.id}
                        class={props.icon ? "form-control form-control-date text-bold text-dark-blue" : "form-control text-bold text-dark-blue"}  
                        name={props.name}
                        placeholder={props.placeholder}
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
                        onFocus$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '1'}}
                        onBlur$={(e) => {
                                props.onChange && props.onChange(e);
                                (document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0'
                            }
                        }
                        onClick$={() => {
                            (document.querySelector('input[id='+props.id+']') as HTMLInputElement).showPicker();
                            (document.querySelector('input[id='+props.id+']') as HTMLInputElement).focus();
                             }
                         }
                        value={props.value}
                        {...dataAttributes}
                    />
                    <label class='form-label text-medium text-dark-gray' for={props.id}>{props.label}</label>
                </div>
            </div>
            <hr id={props.id}/>
        </div>
    )
}

interface propsInputMail
{
    [key:string] : any
}

export const InputMail = (props:propsInputMail) => {
    const dataAttributes = props.dataAttributes ? { ...props.dataAttributes } : {};

    const validateBlur$= $((target: any)=>{
        const input = document.querySelector('#'+target.id) as HTMLInputElement

        if(input.type === 'email')
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
    })

    return(
        <div class='input-basic text-center'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span 
                        class="input-group-text text-dark-gray" 
                        onClick$={() => {
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).showPicker();
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).focus();
                            }
                        }
                    >
                        <i class={'fa-solid fa-'+props.icon} />
                    </span>
                }
                <div class="form-floating">
                    <input class='form-control text-bold text-dark-blue' 
                        id={props.id} 
                        name={props.name} 
                        type='email' 
                        required={props.required} 
                        min={props.min} 
                        max={props.max} 
                        maxLength={props.maxLength} 
                        onChange$={(e) => {props.onChange && props.onChange(e)}}
                        value={props.value}
                        placeholder={props.placeholder}
                        data-textonly={props.textOnly}
                        onBlur$={e=>validateBlur$(e.target)}
                        {...dataAttributes}
                        
                    />
                    <label 
                        class='form-label text-medium text-gray' 
                        for={props.id}
                    >
                        {props.label} 
                    </label>       
                    <div id={props.id+'-feedback'} class="invalid-feedback">
                        Por favor ingrese un correo valido.
                    </div>
                </div>
            </div>
        </div>
    )
}

interface propsInputPhone
{
    [key:string] : any
}

export const InputPhone = (props:propsInputPhone) => {
    const dataAttributes = props.dataAttributes ? { ...props.dataAttributes } : {};

    const validateBlur$= $((target: any)=>{
        const input = document.querySelector('#'+target.id) as HTMLInputElement

        if(input.type === 'tel')
        {
            const regex = new RegExp(/^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.\-\s]){2}\d{3}|(\d{2}[*.\-\s]){3}\d{2}|(\d{4}[*.\-\s]){1}\d{4})|\d{8}|\d{10}|\d{12}$/)

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
    })

    return(
        <div class='input-basic text-center'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span 
                        class="input-group-text text-dark-blue" 
                        onClick$={() => {
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).showPicker();
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).focus();
                            }
                        }
                    >
                        <i class={'fa-solid fa-'+props.icon} />
                    </span>
                }
                <div class="form-floating">
                    <input class='form-control text-bold text-dark-blue' 
                        id={props.id} 
                        name={props.name} 
                        type={'tel'} 
                        required={props.required} 
                        min={props.min} 
                        max={props.max} 
                        maxLength={props.maxLength} 
                        onChange$={(e) => {props.onChange && props.onChange(e)}}
                        value={props.value}
                        placeholder={props.placeholder}
                        data-textonly={props.textOnly}
                        onBlur$={e=>validateBlur$(e.target)}
                        {...dataAttributes}
                    />
                    
                    <label 
                        class='form-label text-medium text-gray' 
                        for={props.id}
                    >
                        {props.label} 
                    </label>       
                    <div id={props.id+'-feedback'} class="invalid-feedback">
                        Por favor ingrese un telefono valido.
                    </div>
                </div>
            </div>
        </div>
    )
}

interface propsInputNumber
{
    [key:string] : any
}

export const InputNumber = (props:propsInputNumber) => {
    const dataAttributes = props.dataAttributes ? { ...props.dataAttributes } : {};
    const validateKeyUp$= $((target: any) => {
        
        if ((target.type == 'number') ) 
        {
            const input = document.querySelector('#'+target.id) as HTMLInputElement
            input.value = String(input.value);
        }
        else
        {
            const input = document.querySelector('#'+target.id) as HTMLInputElement
            input.classList.add('is-invalid')
            input.focus()
        }
    }) 

    return(
        <div class='input-basic text-center'>
            <div class='input-group'>
                {
                    props.icon
                    &&
                    <span 
                        class="input-group-text text-dark-blue" 
                        onClick$={() => {
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).showPicker();
                                (document.querySelector('input[name='+props.name+']') as HTMLInputElement).focus();
                            }
                        }
                    >
                        <i class={'fa-solid fa-'+props.icon} />
                    </span>
                }
                 <div class="form-floating">
                    <input class='form-control text-bold text-dark-blue' 
                        id={props.id} 
                        name={props.name} 
                        type={'number'}
                        required={props.required} 
                        min={props.min} 
                        max={props.max} 
                        maxLength={props.maxLength} 
                        onChange$={(e) => {props.onChange && props.onChange(e)}}
                        value={props.value}
                        placeholder={props.placeholder}
                        data-textonly={props.textOnly}
                        onKeyUp$={e=>validateKeyUp$(e.target)}
                        {...dataAttributes}
                    />
                    <label 
                        class='form-label text-bold text-dark-gray' 
                        for={props.id}
                    >
                        {props.label}
                    </label>
                    <div id={props.id+'-feedback'} class="invalid-feedback">
                         Por favor ingrese solamente numeros.
                    </div>
                 </div>
            </div>
        </div>                                            
    )
}


interface propsForm {
    [key:string] : any,
    form : any[]
}

export const Form = component$((props:propsForm) => {
    useStylesScoped$(styles)
    useStylesScoped$(stylesInputBasic)

    const forms : {row:[{[key:string]:any,options:any[]}]}[] = []

    const form = useSignal(forms)

    useTask$(() => {
        form.value = props.form
    })

    useVisibleTask$(() => {
        form.value = props.form
    })

    /* const validateKeyUp$= $((target: any)=>{
        
        if ((target.type == 'text') && (target.dataset.textonly === 'true')) 
        {
            const input = document.querySelector('#'+target.id) as HTMLInputElement

            const regex = new RegExp(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)
            
            if(regex.test(input.value)){
                input.value = String(input.value);
            }else{
                let str= input.value;
                str = str.slice(0, -1);
                input.value= str;

            }
        }
    })  */

    /* const validateBlur$= $((target: any)=>{
        const input = document.querySelector('#'+target.id) as HTMLInputElement

         if(input.type === 'tel')
        {
            const regexp = new RegExp(/^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.\-\s]){2}\d{3}|(\d{2}[*.\-\s]){3}\d{2}|(\d{4}[*.\-\s]){1}\d{4})|\d{8}|\d{10}|\d{12}$/)

            if(regexp.test(input.value))
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

    }) */

    return(
        <form id={props.id} class='needs-validation' noValidate autoComplete='off'>
            <div class='container p-0'>
                {
                    form.value.map((rowInput,rIndex) => {
                        return(
                            <div key={rIndex} class='row row-mobile'>
                                {
                                    rowInput.row.map((columnInput,iIndex) => {
                                        const dataAttributes = columnInput.dataAttributes ? { ...columnInput.dataAttributes } : {};
                                        if(columnInput.type === 'textarea')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size}>
                                                    <label 
                                                        class='form-label text-regular text-' 
                                                        for={props.id+'-input-'+rIndex+'-'+iIndex}>
                                                        {columnInput.label} 
                                                    </label>
                                                    <textarea class='form-control' id={props.id+'-input-'+rIndex+'-'+iIndex} name={columnInput.name} style={{minHeight:'200px'}} required={columnInput.required} />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select-native')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size}>
                                                    <label class='form-label text-regular text-'>
                                                        {columnInput.label} 
                                                    </label>
                                                    <select class='form-select' id={columnInput.id} name={columnInput.name} required={columnInput.required} onChange$={(e) => {columnInput.onChange(e)}} {...dataAttributes}>
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
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size}>
                                                    <InputPaxs
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                         {...columnInput}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size}>
                                                    <InputSelect
                                                        id={props.id+'-select-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'select-multiple')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size}>
                                                     <InputSelectMultiple
                                                        id={props.id+'-select-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'date')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size} style={{marginBottom:'10px'}}>
                                                    <InputDate
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex} 
                                                        {...columnInput}
                                                    />
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'phone')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size} style={{marginBottom:'10px'}}>
                                                     <InputPhone
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
                                                    />                                        
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'email')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size} style={{marginBottom:'10px'}}>
                                                    <InputMail
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
                                                    />                                                  
                                                </div>
                                            )
                                        }
                                        else if(columnInput.type === 'number')
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size} style={{marginBottom:'10px'}}>
                                                   <InputNumber
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
                                                    /> 
                                                </div>
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <div key={props.id+'-'+rIndex+'-'+iIndex} class={columnInput.size} style={{marginBottom:'10px'}}>
                                                    <Input
                                                        id={props.id+'-input-'+rIndex+'-'+iIndex}
                                                        {...columnInput}
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