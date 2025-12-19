import { $, component$, useContext, useSignal, useStylesScoped$, Signal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { WEBContext, LoadingContext } from "~/root";
import styles from './index.css?inline'
import { InvoiceFormCO } from "~/components/starter/invoice-forms/InvoiceFormCO";
import { InvoiceFormMX } from "~/components/starter/invoice-forms/InvoiceFormMX";
import dayjs from "dayjs";

// 1. Estructura de datos por fila
interface ItemDetalle {
    id: number;
    voucher: string;
    referencia: string;
    montoPagado: string;
    precioOriginal: string; // Precio base
    idagencia: number;
    fechacreacion: string;
    tasacambio: number;
    codigomoneda: string;
}
    const round2 = (v: number) => Math.round(v * 100) / 100;

export default component$(() => {
    useStylesScoped$(styles)
    
    // --- Contextos y Signals ---
    const stateContext = useContext(WEBContext);
    const contextLoading = useContext(LoadingContext);
    const country = useSignal('');
    const msgTost = useSignal('');
    const montototalvoucher = useSignal(0);
    const monedaseleccionada = useSignal(''); 
    const grupoDOM = useSignal<Record<number, any[]>>({});

    const objectItem: ItemDetalle = { 
        id: Date.now(), voucher: '', referencia: '', montoPagado: '', precioOriginal: '', 
        idagencia: 0, fechacreacion: '', tasacambio: 0, codigomoneda: '' 
    };

    const items: Signal<ItemDetalle[]> = useSignal([objectItem]);

    // --- Utilidades ---


    const updateSumaTotal = $(() => {
        const sumaTotal = items.value.reduce((acum: number, obj) => {
            const v = parseFloat(obj.montoPagado || '0');
            return acum + (isNaN(v) ? 0 : v);
        }, 0);
        montototalvoucher.value = parseFloat(sumaTotal.toFixed(2));
    });

    const updateValue = $((id: number, key: keyof ItemDetalle, val: any) => {
        items.value = items.value.map(it => it.id === id ? { ...it, [key]: val } : it);
    });


       // --- Acciones de Formulario ---
    const addInput = $(() => { items.value = [...items.value, { ...objectItem, id: Date.now() }]; });
    const removeInput = $((id: number) => {
        items.value = items.value.filter(it => it.id !== id);
        const copy = { ...grupoDOM.value }; delete copy[id]; grupoDOM.value = copy;
        updateSumaTotal();
    });
    
    // --- Lógica de Conversión ---

    // Convierte SOLO el item actual (usado al validar nuevos vouchers)
    const convertirSoloUnItem$ = $((id: number, monedaDestino: string) => {
        if (!monedaDestino) return;

        items.value = items.value.map(it => {
            if (it.id !== id || !it.tasacambio) return it;
            
            const precioBase = parseFloat(it.precioOriginal);
            let convertido = precioBase;

            if (it.codigomoneda === 'USD' && monedaDestino === 'MXN') {
                convertido = round2(precioBase * it.tasacambio);
            } else if (it.codigomoneda === 'MXN' && monedaDestino === 'USD') {
                convertido = it.tasacambio > 0 ? round2(precioBase / it.tasacambio) : precioBase;
            }
            return { ...it, montoPagado: convertido.toFixed(2) };
        });
        
        // Convertir también su desglose en grupoDOM
        if (grupoDOM.value[id]) {
            const nuevosGrupos = { ...grupoDOM.value };
            nuevosGrupos[id] = nuevosGrupos[id].map(g => {
                const precioBase = parseFloat(g.precioOriginalItem || g.preciototal);
                let convertido = precioBase;
                const itPadre = items.value.find(i => i.id === id);
                if (itPadre && itPadre.codigomoneda === 'USD' && monedaDestino === 'MXN') {
                    convertido = round2(precioBase * itPadre.tasacambio);
                } else if (itPadre && itPadre.codigomoneda === 'MXN' && monedaDestino === 'USD') {
                    convertido = itPadre.tasacambio > 0 ? round2(precioBase / itPadre.tasacambio) : precioBase;
                }
                return { ...g, preciototal: convertido.toFixed(2), precioOriginalItem: precioBase };
            });
            grupoDOM.value = nuevosGrupos;
        }
        updateSumaTotal();
    });

    // Conversión masiva (cuando cambia el selector global)
    const getExchangeRate$ = $(async (monedaDestino: string) => {
        if (!monedaDestino) return;
        
        items.value = items.value.map((it) => {
            if (!it.fechacreacion || !it.tasacambio) return it;
            const precioBase = parseFloat(it.precioOriginal);
            let convertido = precioBase;

            if (it.codigomoneda === 'USD' && monedaDestino === 'MXN') {
                convertido = round2(precioBase * it.tasacambio);
            } else if (it.codigomoneda === 'MXN' && monedaDestino === 'USD') {
                convertido = it.tasacambio > 0 ? round2(precioBase / it.tasacambio) : precioBase;
            }
            return { ...it, montoPagado: convertido.toFixed(2) };
        });

        const nuevosGrupos = { ...grupoDOM.value };
        for (const id in nuevosGrupos) {
            const itemPadre = items.value.find(it => it.id === Number(id));
            if (!itemPadre) continue;
            nuevosGrupos[id] = nuevosGrupos[id].map((g: any) => {
                const precioBase = parseFloat(g.precioOriginalItem || g.preciototal);
                let convertido = precioBase;
                if (itemPadre.codigomoneda === 'USD' && monedaDestino === 'MXN') {
                    convertido = round2(precioBase * itemPadre.tasacambio);
                } else if (itemPadre.codigomoneda === 'MXN' && monedaDestino === 'USD') {
                    convertido = itemPadre.tasacambio > 0 ? round2(precioBase / itemPadre.tasacambio) : precioBase;
                }
                return { ...g, preciototal: convertido.toFixed(2), precioOriginalItem: precioBase };
            });
        }
        grupoDOM.value = nuevosGrupos;
        updateSumaTotal();
    });

    // --- Tasks de Reactividad ---
    useTask$(({ track }) => {
        const changeCurrency = track(() => stateContext.value.changeCurrency);
        
        if (changeCurrency != undefined && changeCurrency !== monedaseleccionada.value) {
            monedaseleccionada.value = changeCurrency;
            getExchangeRate$(changeCurrency);
        }
    });

    useTask$(({ track }) => {
        country.value = track(() => stateContext.value.country);
    });

    useVisibleTask$(() => {
        contextLoading.value = { status: false, message: '' };
    });

    // --- Handlers de Validación ---

    const validatePayment$ = $(async (e: any, id: number, index: number) => {
        const valorIngresado = Number((e.target.value as string).trim());
        const item = items.value[index];
        const bs = (window as any)['bootstrap'];

        if (isNaN(valorIngresado) || valorIngresado <= 0) {
            (e.target as HTMLInputElement).value = item.montoPagado;
            return;
        }

        const monedaActual = monedaseleccionada.value || item.codigomoneda;
        let precioBaseRef = parseFloat(item.precioOriginal);
        if (item.codigomoneda === 'USD' && monedaActual === 'MXN') {
            precioBaseRef = round2(precioBaseRef * item.tasacambio);
        } else if (item.codigomoneda === 'MXN' && monedaActual === 'USD') {
            precioBaseRef = item.tasacambio > 0 ? round2(precioBaseRef / item.tasacambio) : precioBaseRef;
        }

        const porcentaje = 0.05;
        const min = round2(precioBaseRef * (1 - porcentaje));
        const max = round2(precioBaseRef * (1 + porcentaje));

        if (valorIngresado >= min && valorIngresado <= max) {
            // 1. Persistencia: Actualizar precioOriginal (fuente de verdad) para que no se resetee
            let nuevoPrecioOriginal = item.precioOriginal;
            if (monedaActual === item.codigomoneda) {
                nuevoPrecioOriginal = valorIngresado.toFixed(2);
            } else {
                if (item.codigomoneda === 'USD' && monedaActual === 'MXN') {
                    nuevoPrecioOriginal = (valorIngresado / item.tasacambio).toFixed(2);
                } else if (item.codigomoneda === 'MXN' && monedaActual === 'USD') {
                    nuevoPrecioOriginal = (valorIngresado * item.tasacambio).toFixed(2);
                }
            }

            items.value = items.value.map(it => it.id === id ? { 
                ...it, 
                montoPagado: valorIngresado.toFixed(2),
                precioOriginal: nuevoPrecioOriginal 
            } : it);

            // 2. Sincronizar tabla de grupo (Delta)
            if (grupoDOM.value[id]) {
                const grupoActual = [...grupoDOM.value[id]];
                const sumaHijos = grupoActual.reduce((acc, g) => acc + parseFloat(g.preciototal), 0);
                const delta = round2(valorIngresado - sumaHijos);
                if (Math.abs(delta) > 0) {
                    const lastIdx = grupoActual.length - 1;
                    const valAnterior = parseFloat(grupoActual[lastIdx].preciototal);
                    grupoActual[lastIdx] = { ...grupoActual[lastIdx], preciototal: round2(valAnterior + delta).toFixed(2) };
                    grupoDOM.value = { ...grupoDOM.value, [id]: grupoActual };
                }
            }
            updateSumaTotal();
        } else {
            msgTost.value = `Error: El monto está fuera del rango permitido (${min} - ${max}).`;
            new bs.Toast('#toast-validation-error').show();
            (e.target as HTMLInputElement).value = item.montoPagado;
        }
    });

    const validationCodeVoucher$ = $(async (e: any, id: number, index: number) => {
        const nuevoVoucher = (e.target.value as string).toUpperCase().trim();
        if (!nuevoVoucher) return;

        const duplicado = items.value.some(it => it.id !== id && it.voucher.toUpperCase() === nuevoVoucher) ||
                         Object.values(grupoDOM.value).flat().some((g: any) => g.codvoucher.toUpperCase() === nuevoVoucher);

        if (duplicado) {
            msgTost.value = `ERROR: El voucher ${nuevoVoucher} ya ha sido ingresado o forma parte de un grupo.`;
            new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
            updateValue(id, 'voucher', '');
            return;
        }

        contextLoading.value = { status: true, message: 'Validando voucher...' };
        try {
            const resp = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE + "/api/getValidationVoucher", {
                method: "POST", headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigovoucher: nuevoVoucher, codigopais: country.value })
            });
            const data = await resp.json();

            if (data.error) {
                msgTost.value = data.mensaje;
                new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                updateValue(id, 'voucher', '');
            } else {
                const r = data.resultado;
                const esG = r.grupo?.length > 0;
                const fechaA = data.resultado.created_at;
                const fechaB = items.value[0].fechacreacion;

                // Convertir ambas fechas a objetos Day.js
                const dayjsA = dayjs(fechaA);
                const dayjsB = dayjs(fechaB);

                if (items.value.length>1 && !dayjsA.isSame(dayjsB, 'month')
                ){
                    removeInput(id);
                    
                    msgTost.value = 'Para solicitar una factura con más de un voucher este debe ser del mismo mes de emision.';
                    new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                    return;
                }


                
                // Si es el primer voucher, establece la moneda base de la sesión
                if (items.value.filter(it => it.fechacreacion !== '').length === 0) {                    
                    monedaseleccionada.value =   monedaseleccionada.value == ''? r.codigomoneda :monedaseleccionada.value;
                }

                const totalOriginal = esG ? r.grupo.reduce((a:any, b:any) => a + parseFloat(b.preciototal), 0) : r.preciototal;

                items.value = items.value.map(it => it.id === id ? {
                    ...it,
                    voucher: r.codigovoucher || nuevoVoucher,
                    montoPagado: parseFloat(totalOriginal).toFixed(2),
                    precioOriginal: parseFloat(totalOriginal).toFixed(2),
                    referencia: r.referenciapagofactura || '',
                    idagencia: r.idagencia,
                    fechacreacion: r.created_at,
                    tasacambio: r.tasacambio,
                    codigomoneda: r.codigomoneda
                } : it);

                if (esG) {
                    grupoDOM.value = { 
                        ...grupoDOM.value, 
                        [id]: r.grupo.map((g:any)=>({...g, precioOriginalItem: g.preciototal})) 
                    };
                }

                // Convierte solo este nuevo item a la moneda activa
                convertirSoloUnItem$(id, monedaseleccionada.value);
            }
        } finally {
            contextLoading.value = { status: false, message: '' };
        }
    });

 

    const saveRelationOrderInvoice$ = $(async (e: any) => {
        e.preventDefault();
        const radios = Array.from(document.querySelectorAll('input[name="radiotipogrupo"]')) as HTMLInputElement[];
        const radiosExist = radios.length > 0;
        const checked = radiosExist ? radios.find(r => r.checked) ?? null : null;
        let radioGroupValue: number | null = checked ? Number(checked.value) : null;
        if (radiosExist && !checked) {
                msgTost.value = `ERROR: Selecciona un tipo de facturación.`;
                new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                contextLoading.value = {status:false, message:''};
                return;
        }
        let facturaAplanada: any[] = [];
        items.value.forEach(it => {
            if (grupoDOM.value[it.id]) {
                grupoDOM.value[it.id].forEach(g => {
                    facturaAplanada.push({ voucher: g.codvoucher, montoPagado: g.preciototal, referencia: it.referencia });
                });
            } else {
                facturaAplanada.push({ voucher: it.voucher, montoPagado: it.montoPagado, referencia: it.referencia });
            }
        });
        
        if (Object.keys(grupoDOM.value).length > 0 ) {
             radioGroupValue = 3;
        }else if (items.value.length == 1 && Object.keys(grupoDOM.value).length == 0){
             radioGroupValue = 1;
        }

         for (let i = 0; i < items.value.length; i++) {
                const it = items.value[i];
                const fila = i + 1;

                if (!it.voucher || it.voucher.trim() === '') {
                    msgTost.value = `ERROR: Voucher vacío en la fila ${fila}.`;
                   new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                    return;
                }

                if (!it.referencia || it.referencia.trim() === '') {
                    msgTost.value = `ERROR: Referencia vacía en la fila ${fila}.`;
                   new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                    return;
                }

                const monto = parseFloat((it.montoPagado || '').toString());
                if (isNaN(monto) || monto <= 0) {
                    msgTost.value = `ERROR: Monto inválido en la fila ${fila}.`;
                   new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                    return;
                }
            }

        const bs = (window as any)['bootstrap']
        // const toastError = new bs.Toast('#toast-error',{})
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const dataFormInvoicing : {[key:string]:any} = {}
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;
        let errorInvoicing = false;
        let factura: any[] = [];



       //  contextLoading.value = {status:true, message:''}        
        if(country.value === 'MX' )
        {
            if(!formInvoicing.checkValidity())
            {
                formInvoicing.classList.add('was-validated');
                // (document.querySelector('#input-voucher') as HTMLInputElement).classList.add('is-invalid');
                errorInvoicing = true
                contextLoading.value = {status:false, message:''}
            }
            
        }else if (country.value === 'CO' ) {
            if(!formInvoicing.checkValidity())
            {
                formInvoicing.classList.add('was-validated');
                ///(document.querySelector('#input-voucher') as HTMLInputElement).classList.add('is-invalid');
                errorInvoicing = true
                contextLoading.value = {status:false, message:''}
            }
                
        }
        
        
        if(errorInvoicing == false && formInvoicing.checkValidity()) 
        {
            formInvoicing.classList.remove('was-validated')
            errorInvoicing = false

            const inputs = Array.from(formInvoicing.querySelectorAll('input,select'))

            inputs.map((input) => {
                dataFormInvoicing[(input as HTMLInputElement).name] = (input as HTMLInputElement).value
            })

            if (country.value === 'CO') 
            {
                dataFormInvoicing.idciudad = null //Number(inputCity.dataset?.value);
                dataFormInvoicing.idestado = null //Number(inputState.dataset?.value); 
                dataFormInvoicing.codigociudad = null //codigoCiudad;
                dataFormInvoicing.codigoverificacion = Number(dataFormInvoicing.codigoverificacion);

            }
            else if (country.value === 'MX')
            {
                const inputState = document.querySelector('[name="estado"]') as HTMLSelectElement;
                const inputCity = document.querySelector('[name="ciudad"]') as HTMLSelectElement;
                const inputTaxRegime = document.querySelector('[name="idregimenfiscal"]') as HTMLSelectElement;
                const inputPaymentGroupCode = document.querySelector('[name="formapago"]') as HTMLSelectElement;
                const codigoEstado = stateContext.value.listadoestados.find((state: any) => state.value == inputState?.dataset?.value)?.codigoestado || null;    
                const codigoCiudad = stateContext.value.listadociudades.find((city: any) => city.value == inputCity?.dataset?.value)?.codigociudad || null;
                const regimenfiscal = stateContext.value.listadoRegimenesSat.find((tax: any) => tax.value == inputTaxRegime?.dataset?.value);

                const inputTipoPAgo = document.querySelector('[name="tipopago"]') as HTMLSelectElement;
                const tipoPago = stateContext.value.listadoTiposPagos.find((pay: any) => pay.value == inputTipoPAgo?.dataset?.value);
                dataFormInvoicing.idtipopago = Number(tipoPago.value);
                const monedafactura = document.querySelector('[name="idmonedafactura"]') as HTMLSelectElement;
                const idmonedafactura = stateContext.value.listadoMonedas.find((currency: any) => currency.value == monedafactura?.dataset?.value)?.value || null;
                dataFormInvoicing.idciudad = Number(inputCity.dataset?.value);
                dataFormInvoicing.idestado = Number(inputState.dataset?.value);
                dataFormInvoicing.codigoestado = codigoEstado;
                dataFormInvoicing.codigociudad = codigoCiudad;
                dataFormInvoicing.idregimenfiscal = Number(regimenfiscal.value);
                dataFormInvoicing.claveregimenfiscal =regimenfiscal.clave ||'';
                dataFormInvoicing.usocfdi =regimenfiscal.usocfdi||'';
                dataFormInvoicing.tipoid ='RFC';
                dataFormInvoicing.grupopagocodigo =Number(inputPaymentGroupCode?.dataset?.value);
                //dataFormInvoicing.valorpagadofactura= valorpagado;
                dataFormInvoicing.idmonedafactura=idmonedafactura;
                dataFormInvoicing.fechapagofactura=dayjs(dataFormInvoicing.fechapagofactura).isValid() ? dayjs(dataFormInvoicing.fechapagofactura).format('YYYY-MM-DD'):'';
                
            }
            
            
            dataFormInvoicing.tipoPersona = radioTypePerson.value;
            dataFormInvoicing.origenFactura = country.value;
            dataFormInvoicing.facturar = facturaAplanada;
            dataFormInvoicing.idtipoagrupacionfactura = radioGroupValue;
        }    

        if(errorInvoicing == false )
        {        

            const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getRelationOrderInvoice", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataFormInvoicing)});
            const data =await response.json();

            if (!data.error) 
            {
                    // Limpiamos los campos
                items.value =[objectItem];
            
                //(document.querySelector('#input-voucher') as HTMLInputElement).value = '';
                (formInvoicing as HTMLFormElement).reset(); 
                contextLoading.value = {status:false, message:''}
                
                    msgTost.value = '¡Solicitud de facturación enviada con éxito!';
                    new (window as any)['bootstrap'].Toast('#toast-success').show();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
            }
            else{
                msgTost.value = data.mensaje || 'Ocurrió un error';
               new (window as any)['bootstrap'].Toast('#toast-validation-error').show();
                contextLoading.value = {status:false, message:''}
            }
        }


       
    });

    return (
        <div class="container-fluid py-5">
            <div class="row justify-content-center">
                <div class="col-lg-10 mt-5 text-center">
                    <h2 class='h1 text-semi-bold text-dark-blue mb-3'>Facturación</h2>
                    <hr class='divider my-5'></hr>
                    <h3 class='h5 text-dark-gray'>¡Importante antes de enviar el formulario, verifica tus datos de facturación!</h3>
                    <h3 class='h5 text-dark-gray'>Todos los campos son requeridos</h3>        
                </div>
                
                <div class='col-lg-10'>
                    <div class='card shadow-lg border-0 mt-4'>
                        <div class='card-body p-lg-5'>
                            <div class="d-flex justify-content-end mb-4">
                                <div class="p-3 rounded border text-end shadow-sm">
                                    <span class="text-muted  d-block">Total a facturar</span>
                                    <h3 class="fw-bold mb-0 text-primary">
                                        ${montototalvoucher.value} {monedaseleccionada.value}
                                    </h3>
                                </div>
                            </div>
                             <h6 class="text-semi-bold text-dark-blue">Ingrese los vouchers que requiere facturar </h6>       
                            {items.value.map((item, index) => (
                                <div key={item.id} class="card mb-4 bg-white border-light shadow-sm">
                                    <div class="card-body">
                                        <div class="row g-3 align-items-center">
                                             
                                            <div class="col-auto"><span class="badge bg-dark">#{index + 1}</span></div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control" placeholder="Voucher" 
                                                    value={item.voucher}
                                                    onInput$={(e) => updateValue(item.id, 'voucher', (e.target as HTMLInputElement).value)}
                                                    onBlur$={(e) => validationCodeVoucher$(e, item.id, index)} />
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control" placeholder="Referencia" 
                                                    value={item.referencia}
                                                    onInput$={(e) => updateValue(item.id, 'referencia', (e.target as HTMLInputElement).value)} />
                                            </div>
                                            <div class="col-md-3">
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input type="text" class="form-control" 
                                                        value={item.montoPagado} 
                                                        onChange$={(e) => validatePayment$(e, item.id, index)} />
                                                </div>
                                            </div>
                                            <div class="col-md-1 text-center">
                                                {items.value.length > 1 && (
                                                    <button class="btn btn-outline-danger btn-sm border-0" onClick$={() => removeInput(item.id)}>
                                                        <i class="fas fa-trash fa-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {item.fechacreacion && (
                                            <div class="mt-3">
                                                <a class="btn btn-sm btn-link text-decoration-none p-0 text-muted" type="button" 
                                                    data-bs-toggle="collapse" href={`#collapse-${item.id}`}>
                                                    <i class="fas fa-chevron-circle-down me-1"></i> Ver detalles de emisión 
                                                </a>
                                                <div class="collapse mt-2" id={`collapse-${item.id}`}>
                                                    <div class="card card-body bg-light border-0 py-2">
                                                        <div class="row small mb-2 text-muted">
                                                            <div class="col-6"><strong>Fecha:</strong> {item.fechacreacion}</div>
                                                            <div class="col-6 text-end"><strong>Tasa:</strong> {item.tasacambio} </div>
                                                        </div>
                                                        {grupoDOM.value[item.id] && (
                                                            <div class="table-responsive">
                                                                <table class="table table-sm table-bordered bg-white mb-0 small shadow-sm">
                                                                    <thead class="table-dark">
                                                                        <tr><th>Voucher Grupal</th><th class="text-end">Monto ({monedaseleccionada.value})</th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {grupoDOM.value[item.id].map((g: any, i: number) => (
                                                                            <tr key={i}><td>{g.codvoucher}</td><td class="text-end">${g.preciototal}</td></tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button class="btn btn-outline-primary mb-4" type="button" onClick$={addInput}>
                                <i class="fas fa-plus-circle me-2"></i>Añadir otro Voucher
                            </button>


                       {
                        Object.keys(grupoDOM.value).length == 0 && items.value.length >1&& 
                        <div class="col-12 mb-1 my-3">
                            <hr class="mt-3" />
                            <h6 class="text-semi-bold text-dark-blue">Tipo de facturación</h6>
                            <div class="row">    
                                <div class="col-6">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radiotipogrupo" title='Genera una factura individual por voucher'
                                id="radiotipogrupo1" value={1}  />
                                <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipogrupo1" >
                                    Individual por cada voucher
                                    </label>
                                </div>
                            </div>
                    
                            <div class="col-6 ">
                                <div class="form-check">
                                <input class="form-check-input" type="radio" name="radiotipogrupo" title='Genera una solo factura con los vouchers solicitados'
                                id="radiotipogrupo2" value={3} />
                                <label class="form-check-label text-semi-bold text-dark-blue" for="radiotipogrupo2" >
                                    Una sola factura con el desglose por voucher
                                </label>
                                </div>
                            </div>
                            </div>
                        </div>

                       }      

                           
                            {country.value === 'CO' ? <InvoiceFormCO /> : <InvoiceFormMX />}
                            
                            <div class='row justify-content-center my-5'>
                                 <div class='col-lg-4 col-sm-12'>
                                                <div class='d-grid gap-2'>
                                                    <button class="btn btn-primary btn-lg" onClick$={saveRelationOrderInvoice$}>
                                            Enviar Solicitud
                                        </button>
                                                     </div>
                                    
                                        
                                   
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id='toast-validation-error' class="toast align-items-center text-bg-danger border-0" role="alert">
                    <div class="d-flex">
                        <div class="toast-body"><i class="fas fa-exclamation-triangle me-2"></i>     
                            <span class='text-start mx-2'>
                                <b>
                                    {msgTost.value}
                                </b>
                            </span>
                            </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            </div>

             <div class="toast-container position-fixed bottom-0 p-3">
                    <div id='toast-success' class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <div class='message'>
                                    <i class="fas fa-check-circle"/>
                                    <span  class='text-start'>
                                        <b>Solicitud de factura enviada, favor de estar atento al correo que proporciono</b>
                                    </span>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
             </div>
        </div>
    )
})