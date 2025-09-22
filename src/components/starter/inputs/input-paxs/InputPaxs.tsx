import { $, component$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import styles from './input-paxs.css?inline'

interface propsInputPaxs {
    [key:string] : any
}

export const InputPaxs = component$((props:propsInputPaxs) => {
    useStyles$(styles)

    // Signals para manejar los valores individuales
    const adultos = useSignal(0)
    const ninos = useSignal(0)
    const adultosM = useSignal(0)
    
    const totalPaxsString = useSignal('')
    const readOnly = useSignal(false)

    // Inicializar valores desde props
    useTask$(({ track })=>{
        const value = track(()=>props.value);        
        if (value) {
            adultos.value = value[75] || 0
            ninos.value = value[23] || 0
            adultosM.value = value[85] || 0
        }
        readOnly.value = true
    })

    // Actualizar string cuando cambien los valores
    useTask$(({ track }) => {
        const a = track(() => adultos.value)
        const n = track(() => ninos.value)  
        const am = track(() => adultosM.value)

        const parts = [];
        if (n > 0) parts.push(`${n} Niño(s) y joven(es)`);
        if (a > 0) parts.push(`${a} Adulto(s)`);
        if (am > 0) parts.push(`${am} Adulto(s) mayor(es)`);
        
        totalPaxsString.value = parts.join(' ');

        // Notificar cambio al padre
        if (props.onChange !== undefined) {
            const totalNumber = {
                23: n,
                75: a, 
                85: am
            };
            props.onChange({
                label: totalPaxsString.value, 
                value: totalNumber
            });
        }
    })

    const addPaxs$ = $((tipo: string) => {
        const total = adultos.value + ninos.value + adultosM.value;
        
        if (total < 8) {
            switch(tipo) {
                case '75':
                    adultos.value = Math.min(adultos.value + 1, 14);
                    break;
                case '23':
                    ninos.value = Math.min(ninos.value + 1, 14);
                    break;
                case '85':
                    adultosM.value = Math.min(adultosM.value + 1, 14);
                    break;
            }
        }
    })

    const removePaxs$ = $((tipo: string) => {
        switch(tipo) {
            case '75':
                adultos.value = Math.max(adultos.value - 1, 0);
                break;
            case '23':
                ninos.value = Math.max(ninos.value - 1, 0);
                break;
            case '85':
                adultosM.value = Math.max(adultosM.value - 1, 0);
                break;
        }
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
                            class='form-control form-paxs text-medium text-dark-blue' 
                            value={totalPaxsString.value} 
                            data-value={JSON.stringify({23: ninos.value, 75: adultos.value, 85: adultosM.value})} 
                            required={props.required}
                            readOnly={readOnly.value}
                            placeholder="Viajeros"
                            onFocus$={() => {
                                const hr = document.querySelector('hr[id='+props.id+']') as HTMLHRElement;
                                if (hr) hr.style.opacity = '1';
                            }}
                            onBlur$={() => {
                                const hr = document.querySelector('hr[id='+props.id+']') as HTMLHRElement;
                                if (hr) hr.style.opacity = '0';
                            }}
                        />
                        <label class='form-label text-medium text-dark-gray' for={props.id}>Viajeros</label>
                    </div>
                </div>
            </div>
            <hr id={props.id}/>
            <div id={'dropdown-'+props.id} class='dropdown-menu p-4' aria-labelledby={props.id}>
                <div class='container'>
                    <div class='row mb-4 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-medium text-dark-blue mb-0'>Adultos</h6>
                            <small>de 24 a 75 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='d-flex align-items-baseline input-number-group'>
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {removePaxs$('75')}}
                                    disabled={adultos.value <= 0}
                                >
                                    <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control-plaintext text-semi-bold text-dark-blue p-0' 
                                    id='input-75' 
                                    name='75' 
                                    min={0} 
                                    max={14} 
                                    value={adultos.value} 
                                    readOnly
                                />
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {addPaxs$('75')}}
                                    disabled={(adultos.value + ninos.value + adultosM.value) >= 8}
                                >
                                    <i class="fas fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class='row mb-4 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-medium text-dark-blue mb-0'>Niños y jóvenes</h6>
                            <small>de 0 a 23 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='d-flex align-items-baseline input-number-group'>
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {removePaxs$('23')}}
                                    disabled={ninos.value <= 0}
                                >
                                   <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control-plaintext form-control-sm text-semi-bold text-dark-blue p-0' 
                                    id='input-23' 
                                    name='23' 
                                    min={0} 
                                    max={14} 
                                    value={ninos.value} 
                                    readOnly
                                />                               
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {addPaxs$('23')}}
                                    disabled={(adultos.value + ninos.value + adultosM.value) >= 8}
                                >
                                    <i class="fas fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class='row mb-0 align-items-center'>
                        <div class='col-6 col-md-7'>
                            <h6 class='h5 text-medium text-dark-blue mb-0'>Adultos mayores</h6>
                            <small>de 76 a 85 años</small>
                        </div>
                        <div class='col-6 col-md-5'>
                            <div class='d-flex align-items-baseline input-number-group'>
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {removePaxs$('85')}}
                                    disabled={adultosM.value <= 0}
                                >
                                <i class="fas fa-minus text-light-blue"/>
                                </button>
                                <input 
                                    type='number' 
                                    class='form-control-plaintext text-semi-bold text-dark-blue p-0' 
                                    id='input-85' 
                                    name='85' 
                                    min={0} 
                                    max={14} 
                                    value={adultosM.value} 
                                    readOnly
                                />
                                <button 
                                    type='button' 
                                    class='btn-icon-circle' 
                                    onClick$={() => {addPaxs$('85')}}
                                    disabled={(adultos.value + ninos.value + adultosM.value) >= 8}
                                >
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