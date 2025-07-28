import { $, component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik"
import styles from './input-select.css?inline'

interface propInputSelect {
    [key:string] : any,
    options : any[]
}

export const InputSelect = component$((props:propInputSelect) => {
    useStylesScoped$(styles)

    const defaultValue = useSignal('')
    const datasetValue = useSignal('')
    const options = useSignal<any[]>([]) 
    const prevOptions = useSignal<any[]>([]) 
    
    useTask$(({ track })=>{
        const value = track(()=>props.options);   
      
        const safeOptions = Array.isArray(value) ? value : [];
        prevOptions.value = safeOptions
        options.value = safeOptions    
    })

    const getOptions$ = $((value:any) => {
        
        if (!Array.isArray(props.options)) {
            console.warn('InputSelect: props.options no es un array válido');
            return;
        }

        const arrayObjects= [...props.options]        
       
        const findItem= arrayObjects.find(item=> item?.value == value)
        defaultValue.value = findItem?.label || ''
        datasetValue.value = findItem?.value || ''

        props.onChange !== undefined && props.onChange({label:defaultValue.value, value:datasetValue.value});
    })

    useTask$(()=>{
        if(props.value)
        {
            getOptions$(props.value)
        }
    })

    const getFiltertList$ = $((e:any) => {
        if(e.target.value == '')
        {
            options.value = prevOptions.value
        }
        else
        {
           
            if (!Array.isArray(prevOptions.value)) {
                return;
            }

            const newList = prevOptions.value.filter((option) => {
         
                if (!option || !option.label) return false;

                const newOption = String(option.label)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

                const normalizedNewOption = String(newOption).toLowerCase();

                const normalizedInput = String(e.target.value)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                const normalizedInputLower = normalizedInput.toLowerCase();

                return normalizedNewOption.includes(normalizedInputLower);
            })

            options.value = newList
        }
    })


    const safeOptions = Array.isArray(options.value) ? options.value : [];

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
                            placeholder={props.label}
                            onBlur$={() => {(document.querySelector('hr[id='+props.id+']') as HTMLHRElement)?.style && ((document.querySelector('hr[id='+props.id+']') as HTMLHRElement).style.opacity = '0')}}
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
                            safeOptions.length > 4 ?
                            <>
                            <div class='col-6'>
                            <ul class='list-group list-group-flush'>
                                {
                                    safeOptions.map((option,iOption) => {
                               
                                        if (!option) return null;
                                        
                                        return(
                                            iOption < (safeOptions.length / 2)
                                            &&
                                            <li 
                                                key={iOption+1}
                                                class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-blue' : 'list-group-item text-medium text-dark-gray'} 
                                                value={option.value} 
                                                onClick$={() => {
                                                    getOptions$(option.value);
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
                                        safeOptions.map((option,iOption) => {
                
                                            if (!option) return null;
                                            
                                            return(
                                                iOption >= (safeOptions.length / 2)
                                                &&
                                                <li 
                                                    key={iOption+1}
                                                    class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-gray' : 'list-group-item text-medium text-dark-gray'} 
                                                    value={option.value} 
                                                    onClick$={() => {
                                                        getOptions$(option.value);
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
                                {
                                    safeOptions.map((option,iOption) => {
                                   
                                        if (!option) return null;
                                        
                                        return(
                                            <li 
                                                key={iOption+1}
                                                class={datasetValue.value == option.value ? 'list-group-item active text-medium text-dark-blue' : 'list-group-item text-medium text-dark-gray'} 
                                                value={option.value} 
                                                onClick$={() => {
                                                    getOptions$(option.value);
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