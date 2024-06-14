import { $, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './input-paxs.css?inline'

interface propsInputPaxs {
    [key:string] : any
}

export const InputPaxs = component$((props:propsInputPaxs) => {
    useStylesScoped$(styles)

    const totalPaxs = useSignal(0)
    const totalPaxsNumber = useSignal([])
    const totalPaxsString = useSignal('')
    const readOnly = useSignal(false)

    useVisibleTask$(() => {
        if(props.value)
        {            
            const newTotalstring = (props.value[22] > 0 ? props.value[22] +' Niños y jovenes ' : '') + (props.value[70] > 0 ? props.value[70] +' Adultos ' : '') + (props.value[85]  > 0 ?props.value[85] +' Adultos mayores ' : '')
            totalPaxsString.value = newTotalstring
            totalPaxsNumber.value = props.value
        }

        if(navigator.userAgent.includes('Mobile'))
        {
            readOnly.value = true
        }
    })

    const getPaxs$ = $(() => {
        // const bs = (window as any)['bootstrap']
        // const dropdown = new bs.Dropdown('#dropdown-paxs',{})
        const inputs = Array.from(document.querySelectorAll('input[type=number]'))
        const totalNumber : any = []
        const totalString : any = []

        inputs.map(input => {
            if((input as HTMLInputElement).name == '22')
            {
                totalString[0] = (input as HTMLInputElement).value
                totalNumber[0] = {[(input as HTMLInputElement).name]:(input as HTMLInputElement).value}
            }
            else if((input as HTMLInputElement).name == '70')
            {
                totalString[1] = (input as HTMLInputElement).value
                totalNumber[1] = {[(input as HTMLInputElement).name]:(input as HTMLInputElement).value}
            }
            else if((input as HTMLInputElement).name == '85')
            {
                totalString[2] = (input as HTMLInputElement).value
                totalNumber[1] = {[(input as HTMLInputElement).name]:(input as HTMLInputElement).value}
            }
        })

        const newTotalstring = (totalString[0] > 0 ? totalString[0]+' Niño(s) y joven(es) ' : '') + (totalString[1] > 0 ? totalString[1]+' Adulto(s) ' : '') + (totalString[2] > 0 ? totalString[2]+' Adulto(s) mayor(es) ' : '')
        totalPaxsString.value = newTotalstring
        totalPaxsNumber.value = totalNumber
        
        props.onChange !== undefined && props.onChange({label:totalPaxsString.value, value:totalPaxsNumber.value});
        // dropdown.hide()
    })

    const addPaxs$ = $((id:string) => {          
        const inputs = Array.from(document.querySelectorAll('input[type=number]'))
        const total = inputs.reduce((calc, item) => calc + Number((item as HTMLInputElement).value), 0);
        

        if(total < 8)
        {
            const input = document.querySelector('#'+id) as HTMLInputElement
            input.stepUp()
            totalPaxs.value = total
        }

        getPaxs$()
    })

    const removePaxs$ = $((id:string) => {
        const inputs = Array.from(document.querySelectorAll('input[type=number]'))
        const total = inputs.reduce((calc, item) => calc + Number((item as HTMLInputElement).value), 0);
        const input = document.querySelector('#'+id) as HTMLInputElement

        input.stepDown()
        totalPaxs.value = total

        getPaxs$()
    })

    return(
        <div class='dropdown drop-paxs text-center'>
            <div class="dropdown-toggle"
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                data-bs-reference="toggle" 
            >
                <div class='input-group '>
                    <span class="input-group-text text-dark-blue">
                        <i class={'fa-solid fa-'+props.icon} />
                    </span>
                    <div class="form-floating">
                        <input 
                            type='text'
                            id={props.id} 
                            name={props.name} 
                            class='form-control form-paxs text-bold text-dark-blue' 
                            value={totalPaxsString.value} 
                            data-value={JSON.stringify(totalPaxsNumber.value)} 
                            required={props.required}
                            readOnly={readOnly.value}
                            placeholder="Viajeros"
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
                        />
                        <label class='form-label-pax text-medium text-dark-gray' for={props.id}>Viajeros</label>
                    </div>
                </div>
            </div>
            <hr id={props.id}/>
            <div id={'dropdown-'+props.id} class='dropdown-menu p-4' aria-labelledby={props.id}>
                <div class='container'>
                    <div class='row mb-4 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-bold text-dark-blue mb-0'>Adultos</h6>
                            <small>de 23 a 70 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='input-number-group'>
                                <button type='button' class='btn-icon-circle' onClick$={() => {removePaxs$('input-70')}}>
                                    <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control text-semi-bold text-dark-blue' 
                                    id='input-70' 
                                    name='70' 
                                    min={0} 
                                    max={14} 
                                    value={props.value!= undefined ? props.value[70] : 0} 
                                    readOnly
                                />
                                <button type='button' class='btn-icon-circle' onClick$={() => {addPaxs$('input-70')}}>
                                    <i class="fas fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class='row mb-4 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-bold text-dark-blue mb-0'>Niños y jóvenes</h6>
                            <small>de 0 a 22 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='input-number-group'>
                                <button type='button' class='btn-icon-circle' onClick$={() => {removePaxs$('input-22')}}>
                                   <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control text-semi-bold text-dark-blue' 
                                    id='input-22' 
                                    name='22' 
                                    min={0} 
                                    max={14} 
                                    value={props.value!= undefined ? props.value[22] : 0} 
                                    readOnly
                                />
                                <button type='button' class='btn-icon-circle' onClick$={() => {addPaxs$('input-22')}}>
                                    <i class="fas fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class='row mb-0 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-bold text-dark-blue mb-0'>Adultos mayores</h6>
                            <small>de 71 a 85 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='input-number-group'>
                                <button type='button' class='btn-icon-circle' onClick$={() => {removePaxs$('input-85')}}>
                                <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control text-semi-bold text-dark-blue' 
                                    id='input-85' 
                                    name='85' 
                                    min={0} 
                                    max={14} 
                                    value={props.value!= undefined ? props.value[85] : 0} 
                                    readOnly
                                />
                                <button type='button' class='btn-icon-circle' onClick$={() => {addPaxs$('input-85')}}>
                                    <i class="fas fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})