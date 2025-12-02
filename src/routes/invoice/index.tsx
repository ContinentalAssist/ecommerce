import { $, component$, useContext, useSignal, useStylesScoped$, Signal,useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { WEBContext } from "~/root";


import styles from './index.css?inline'
import { LoadingContext } from "~/root";
import { InvoiceFormCO } from "~/components/starter/invoice-forms/InvoiceFormCO";
import { InvoiceFormMX } from "~/components/starter/invoice-forms/InvoiceFormMX";
import dayjs from "dayjs";

// 1. Definición de la estructura de datos para cada fila
interface ItemDetalle {
  id: number;
  voucher: string;
  referencia: string;
  montoPagado: string;
  precioOriginal: string; 
  idagencia: number;
  fechacreacion: string;
}
    interface InfoVoucher {
      created_at: string;
      preciototal: number;
      codigomoneda: string;
      referenciapagofactura: string;
      valorpagadofactura: number;
      fechapagofactura: string;
      idformapagofactura: number;
      paymentgroupcode: number | null;
      idmonedafactura: number | null;
      tasacambio: number;
      tokenfile: string | null;
      grupo: any[];
    }

export default component$(() =>{
    useStylesScoped$(styles)
      const  objectInfo :InfoVoucher= {
        created_at: '',
        preciototal: 0,
        codigomoneda: '',
        referenciapagofactura:'',
        valorpagadofactura: 0,
        fechapagofactura: '',
        idformapagofactura: 0,
        paymentgroupcode: null,
        idmonedafactura: null,
        tasacambio:0,
        tokenfile: null,
        grupo: [],

    }
    const stateContext = useContext(WEBContext)
    const contextLoading = useContext(LoadingContext)
    const country = useSignal('');
    const msgTost =useSignal('')
    const infoVoucher = useSignal(objectInfo)
    const montototalvoucher = useSignal(0);
    const grupoOriginal = useSignal([]);
    const objectItem=  { 
      id: Date.now(), 
      voucher: '', 
      referencia: '', 
      montoPagado: '', 
      precioOriginal: '', 
      idagencia: 0,
      fechacreacion: '',
    };
  // 2. Estado reactivo para la lista de ítems (inicializado con una fila)
  const items: Signal<ItemDetalle[]> = useSignal([
   objectItem
  ]);

    const getExchangeRate$ = $(async (moneda: string) => {
        // Si no hay información del voucher no hacemos nada
        if (!infoVoucher.value || !infoVoucher.value.codigomoneda) return;
    
        const origen = infoVoucher.value.codigomoneda;
        const tasa = Number(infoVoucher.value.tasacambio) || 0;
    
        // función helper para redondear a 2 decimales
        const round2 = (v: number) => Math.round(v * 100) / 100;
    
        // convertir cada item basándose en el precioOriginal si existe, si no usar el preciototal del voucher
        const nuevosItems = items.value.map((it) => {
            const precioOriginal = Number(it.precioOriginal);
    
            let convertido = precioOriginal;
    
            // USD -> MXN
            if (origen === 'USD' && moneda === 'MXN') {
                convertido = round2(precioOriginal * tasa);
            }
            // MXN -> USD
            else if (origen === 'MXN' && moneda === 'USD') {
                // evitar división por 0
                convertido = tasa > 0 ? round2(precioOriginal / tasa) : precioOriginal;
            }
            // mismo tipo de moneda -> no cambiar
            else {
                convertido = round2(precioOriginal);
            }
    
            return {
                ...it,
                // montoPagado representa el valor en la moneda seleccionada
                montoPagado: convertido.toFixed(2).toString(),
                // preservar precioOriginal en la moneda del voucher para referencia
                precioOriginal: it.precioOriginal || String(precioOriginal),
            };
        });
    
        // asignar y recalcular total
        items.value = nuevosItems;
        const sumaTotal = items.value.reduce((acum: number, obj: any) => {
            const v = parseFloat(obj.montoPagado || '0');
            return acum + (isNaN(v) ? 0 : v);
        }, 0);
        montototalvoucher.value = parseFloat(sumaTotal.toFixed(2));
    });

     useTask$(({ track }) => {
          const changeCurrency = track(() => stateContext.value.changeCurrency);
          console.log(changeCurrency);
          
          if (changeCurrency) {
              getExchangeRate$(changeCurrency);
          }
        });
    
    useTask$(({ track })=>{
            const value = track(()=>stateContext.value.country);   
            country.value = value;
            
           // contextLoading.value = {status:false, message:''};
    })

    useVisibleTask$(()=>{
        contextLoading.value = {status:false, message:''};
    })


    /**
       * Agrega un nuevo conjunto de inputs a la lista.
       */
      const addInput = $(() => {
        items.value = [
          ...items.value,
          { 
            id: Date.now(), 
            voucher: '', 
            referencia: '', 
            montoPagado: '', 
            precioOriginal: '', 
            idagencia: 0,
            fechacreacion: '',
          }
        ];
      });
    
      /**
       * Quita un conjunto de inputs de la lista basado en su ID.
       * @param id El ID del elemento a quitar.
       */
      const removeInput = $((id: number) => {
        items.value = items.value.filter(item => item.id !== id);
    
    
       const sumaTotal = items.value.reduce((acumulador:number, objetoActual:any) => {
                            return acumulador + parseFloat(objetoActual.montoPagado);
                        }, 0); 
        montototalvoucher.value = sumaTotal;
      });
    
      /**
       * Actualiza el valor de una propiedad específica en un ítem específico.
       * @param id El ID del ítem a actualizar.
       * @param key La clave (nombre del campo) a modificar (e.g., 'voucher').
       * @param newValue El nuevo valor del campo.
       */
      const updateValue = $(
        (id: number, key: keyof Omit<ItemDetalle, 'id'>, newValue: string) => {
          items.value = items.value.map(item =>
            item.id === id ? { ...item, [key]: newValue } : item
          );
        }
      );
    
    
      const getToastInstance = $(() => {
            const bs = (window as any)['bootstrap'];
            return new bs.Toast('#toast-validation-error', {});
        });
    
        const validationCodeVoucher$ = $(async(e:any, id:number,index: number) => {
            e.preventDefault();
           
          const nuevoVoucher = (e.target.value as string).toUpperCase().trim();
          if (nuevoVoucher === '') {
            return; 
          }
    
          const voucherDuplicado = items.value.some(item => 
            // 1. Excluimos el ítem actual (item.id !== id)
            // 2. Comparamos el voucher (en mayúsculas)
            item.id !== id && item.voucher.toUpperCase().trim() === nuevoVoucher
        );
          if (voucherDuplicado) {
            msgTost.value = `ERROR: El voucher ${nuevoVoucher} ya ha sido ingresado previamente.`;
           // toastError.show();
            
            // Limpiamos el campo voucher que causó el conflicto
            updateValue(id, 'voucher', ''); 
            
            // Limpiamos los demás campos asociados si es necesario
            updateValue(id, 'montoPagado', '');
            updateValue(id, 'referencia', '');
            
            return;
    
          }
            
            if (e.target.value != '') {
                const bs = (window as any)['bootstrap']
                const toastError = new bs.Toast('#toast-validation-error', {});
                //const toastSuccess = new bs.Toast('#toast-success',{})
                //contextLoading.value = {status:true, message:''}
                const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getValidationVoucher",
                        {method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify({codigovoucher:e.target.value,codigopais:country.value})});
                const data =await response.json();
                //var sumaTotal = 0;
                    if (data.error) 
                    {
                           updateValue(id, 'voucher', ''); 
                           updateValue(id, 'montoPagado', '');
                           updateValue(id, 'referencia', '');
                        //contextLoading.value = {status:false, message:''}
                        msgTost.value = data.mensaje || 'Ocurrió un error';
                        toastError.show()
    
                    }
                    else{
                    //contextLoading.value = {status:false, message:''}
                    //data.resultado.preciototal = parseFloat(data.resultado.preciototal);
                    const fechaA = data.resultado.created_at;
                    const fechaB = items.value[0].fechacreacion;
    
                    // Convertir ambas fechas a objetos Day.js
                    const dayjsA = dayjs(fechaA);
                    const dayjsB = dayjs(fechaB);
                    if (items.value.length>0&&items.value[0].idagencia !=0 && (data.resultado.idagencia != items.value[0].idagencia||
                       !dayjsA.isSame(dayjsB, 'day'))
                    ){
                      removeInput(id);
                     
                        msgTost.value = 'Para solicitar una factura con más de un voucher este debe ser de la misma agencia y  fecha de emision.';
                        toastError.show()
                        return;
                    }
    
                    stateContext.value = { ...stateContext.value, infopayment: data.resultado }
                    infoVoucher.value =data.resultado
                    
                      if (data.resultado?.grupo.length >0){ 
                         msgTost.value = 'Error: ocurrio un problema';
                        toastError.show()
                        grupoOriginal.value=data.resultado?.grupo;
                       // Suma el preciototal de todos los objetos en el array
                        const  sumaTotal = data.resultado?.grupo.reduce((acumulador:number, objetoActual:any) => {
                                // 1. Tomamos el acumulador (la suma hasta el momento)
                                // 2. Le sumamos el preciototal del objeto actual
                                return acumulador + parseFloat(objetoActual.preciototal);
                            }, 0); // El '0' es el valor inicial del acumulador
                             montototalvoucher.value = sumaTotal.toFixed(2)  as number;
                             
                              items.value[index].montoPagado =parseFloat(sumaTotal.toFixed(2)).toString();
                              items.value[index].referencia = data.resultado.referenciapagofactura ?? '';
                              items.value[index].idagencia =  data.resultado.idagencia;
                              items.value[index].fechacreacion =  data.resultado.created_at;
                              items.value[index].precioOriginal = parseFloat(sumaTotal.toFixed(2)).toString();
                             
                      }else{
                        
                        montototalvoucher.value += parseFloat(data.resultado.preciototal);
                        items.value[index].montoPagado = parseFloat(data.resultado.preciototal).toString();
                        items.value[index].referencia = data.resultado.referenciapagofactura ?? '';
                        items.value[index].idagencia =  data.resultado.idagencia;
                        items.value[index].fechacreacion =  data.resultado.created_at;
                        items.value[index].precioOriginal = parseFloat(data.resultado.preciototal).toString();
                      }
                     
                    
                    }                
            }
        
        
        });
    
        const updateSumaTotal = $(() => {
            const sumaTotal = items.value.reduce((acumulador: number, objetoActual) => {
                const monto = parseFloat(objetoActual.montoPagado);
                return acumulador + (isNaN(monto) ? 0 : monto);
            }, 0);
            montototalvoucher.value = parseFloat(sumaTotal.toFixed(2));
        });
    
    const validatePayment$ = $(async (e: any, id: number, index: number) => {
        e.preventDefault();

        const porcentaje = 0.05;
        const toastError = await getToastInstance();
        
        // 1. Obtener el valor ingresado por el usuario (sin actualizar el Signal aún)
        const valorIngresado = Number((e.target.value as string).trim());
        const itemActual = items.value[index];
        
        // 2. Validación numérica inicial
        if (isNaN(valorIngresado) || valorIngresado <= 0) {
            msgTost.value = `ERROR: El valor ingresado no es un número válido.`;
            toastError.show();
            (e.target as HTMLInputElement).value = itemActual.montoPagado; 
            return;
        }

        // 3. Calcular precio base según si hay grupo (tokenfile) o item individual
        let precioBase = 0;
        const selectedCurrencyEl = document.querySelector('input[name="idmonedafactura"]') as HTMLInputElement;
        const selectedCurrency = selectedCurrencyEl ? selectedCurrencyEl.value : '';

        const tasa = Number(infoVoucher.value?.tasacambio || 0);

        let sumaOriginal = 0;
        const isGrupo = Array.isArray(infoVoucher.value?.grupo) && infoVoucher.value.grupo.length > 0;

        if (isGrupo) {
            // Suma original del grupo en moneda origen
            sumaOriginal = infoVoucher.value.grupo.reduce((acc: number, g: any) => acc + (parseFloat(g.preciototal || 0)), 0);
            console.log("sumaOriginal", sumaOriginal);
            
            if (infoVoucher.value.codigomoneda === 'USD' && selectedCurrency === 'MXN') {
                precioBase = Math.round(sumaOriginal * tasa * 100) / 100;
            } else if (infoVoucher.value.codigomoneda === 'MXN' && selectedCurrency === 'USD') {
                precioBase = tasa > 0 ? Math.round((sumaOriginal / tasa) * 100) / 100 : sumaOriginal;
            } else {
                precioBase = Math.round(sumaOriginal * 100) / 100;
            }
        } else {
            const originalPrice = parseFloat(items.value[index].precioOriginal || '0');

            if (infoVoucher.value.codigomoneda === 'USD' && selectedCurrency === 'MXN') {
                precioBase = Math.round(originalPrice * tasa * 100) / 100;
            } else if (infoVoucher.value.codigomoneda === 'MXN' && selectedCurrency === 'USD') {
                precioBase = Math.round((originalPrice / tasa) * 100) / 100;
            } else {
                precioBase = Math.round(originalPrice * 100) / 100;
            }
        }

        // 4. Calcular rango permitido
        const minimo = Math.round(precioBase * (1 - porcentaje) * 100) / 100;
        const maximo = Math.round(precioBase * (1 + porcentaje) * 100) / 100;

        // 5. Validar valor ingresado dentro del rango
        if (valorIngresado >= minimo && valorIngresado <= maximo) {
            // VÁLIDO
            if (isGrupo) {
                // El input representa el total del grupo. Distribuir delta proporcionalmente entre líneas.
                const sumaOrig = sumaOriginal;
                const delta = Number((valorIngresado - sumaOrig).toFixed(2)); // puede ser positivo/negativo

                // Si delta == 0 sólo actualizar total y item visible
                if (Math.abs(delta) < 0.005) {
                    updateValue(id, 'montoPagado', valorIngresado.toFixed(2));
                    montototalvoucher.value = parseFloat(valorIngresado.toFixed(2));
                    return;
                }

                // Grupo original como números
                const grupoNum = infoVoucher.value.grupo.map((g: any) => ({ ...g, preciototal: parseFloat(g.preciototal || 0) }));
                const suma = grupoNum.reduce((s: number, x: any) => s + x.preciototal, 0) || 1;

                // asignaciones proporcionales (pueden sumar ligeramente distinto por redondeo)
                const asignaciones = grupoNum.map(g =>
                    Math.round((delta * (g.preciototal / suma)) * 100) / 100
                );

                // aplicar asignaciones y contabilizar aplicado
                let aplicado = 0;
                const nuevoGrupo = grupoNum.map((g: any, i: number) => {
                    const adj = asignaciones[i];
                    aplicado += adj;
                    const nuevo = Number((g.preciototal + adj).toFixed(2));
                    return { ...g, preciototal: nuevo };
                });

                // corregir resto por redondeo en la última línea
                const resto = Number((delta - aplicado).toFixed(2));
                if (resto !== 0) {
                    const li = nuevoGrupo.length - 1;
                    nuevoGrupo[li].preciototal = Number((nuevoGrupo[li].preciototal + resto).toFixed(2));
                }

                // validar que no haya precios <= 0
                const tieneNegativo = nuevoGrupo.some((g: any) => g.preciototal <= 0);
                if (tieneNegativo) {
                    // fallback: aplicar delta sólo a la última línea
                    const lastIndex = grupoNum.length - 1;
                    const newLast = Number((grupoNum[lastIndex].preciototal + delta).toFixed(2));
                    if (newLast <= 0) {
                        msgTost.value = 'ERROR: Ajuste inválido; distribución produciría valor negativo.';
                        toastError.show();
                        (e.target as HTMLInputElement).value = sumaOriginal.toFixed(2);
                        updateValue(id, 'montoPagado', sumaOriginal.toFixed(2));
                        montototalvoucher.value = parseFloat(sumaOriginal.toFixed(2));
                        return;
                    }
                    grupoNum[lastIndex].preciototal = newLast;
                    infoVoucher.value = {
                        ...infoVoucher.value,
                        grupo: grupoNum.map(g => ({ ...g, preciototal: g.preciototal.toFixed(2) }))
                    };
                } else {
                    // asignar nuevo grupo distribuido (string con 2 decimales)
                    infoVoucher.value = {
                        ...infoVoucher.value,
                        grupo: nuevoGrupo.map(g => ({ ...g, preciototal: g.preciototal.toFixed(2) }))
                    };
                }

                // actualizar item visible (total) y montos
                updateValue(id, 'montoPagado', valorIngresado.toFixed(2));
                // si quieres mantener precioOriginal del item como suma original:
                updateValue(id, 'precioOriginal', sumaOriginal.toFixed(2));
                montototalvoucher.value = parseFloat(valorIngresado.toFixed(2));

                // Si tienes una sincronización que mapea infoVoucher.grupo -> items, esa tarea actualizará las líneas visibles.
                return;
            } else {
                // individual
                updateValue(id, 'montoPagado', valorIngresado.toFixed(2));
                updateSumaTotal();
                return;
            }
        } else {
            // INVÁLIDO: restaurar valor original convertido según moneda seleccionada
            let displayOriginal = 0;
            if (isGrupo) {
                if (infoVoucher.value.codigomoneda === 'USD' && selectedCurrency === 'MXN') {
                    displayOriginal = Math.round(sumaOriginal * tasa * 100) / 100;
                } else if (infoVoucher.value.codigomoneda === 'MXN' && selectedCurrency === 'USD') {
                    displayOriginal = tasa > 0 ? Math.round((sumaOriginal / tasa) * 100) / 100 : sumaOriginal;
                } else {
                    displayOriginal = Math.round(sumaOriginal * 100) / 100;
                }
                msgTost.value = `ERROR: El valor (${valorIngresado.toFixed(2)}) está fuera del rango permitido (${minimo} - ${maximo}). Se restauró el valor original.`;
                toastError.show();
                (e.target as HTMLInputElement).value = displayOriginal.toFixed(2);
                updateValue(id, 'montoPagado', displayOriginal.toFixed(2));
                montototalvoucher.value = parseFloat(displayOriginal.toFixed(2));
                return;
            } else {
                const originalPrice = parseFloat(itemActual.precioOriginal || '0');
                if (infoVoucher.value?.codigomoneda === 'USD' && selectedCurrency === 'MXN') {
                    displayOriginal = Math.round(originalPrice * tasa * 100) / 100;
                } else if (infoVoucher.value?.codigomoneda === 'MXN' && selectedCurrency === 'USD') {
                    displayOriginal = tasa > 0 ? Math.round((originalPrice / tasa) * 100) / 100 : originalPrice;
                } else {
                    displayOriginal = Math.round(originalPrice * 100) / 100;
                }
                msgTost.value = `ERROR: El valor (${valorIngresado.toFixed(2)}) está fuera del rango permitido (${minimo} - ${maximo}). Se restauró el valor original.`;
                toastError.show();
                (e.target as HTMLInputElement).value = displayOriginal.toFixed(2);
                updateValue(id, 'montoPagado', displayOriginal.toFixed(2));
                updateSumaTotal();
                return;
            }
        }
    });




    const saveRelationOrderInvoice$ = $(async(e:any) => {
        e.preventDefault();
        
         const toastError = await getToastInstance();
          const radios = Array.from(document.querySelectorAll('input[name="radiotipogrupo"]')) as HTMLInputElement[];
           const radiosExist = radios.length > 0;
           const checked = radiosExist ? radios.find(r => r.checked) ?? null : null;
            if (radiosExist && !checked) {
               msgTost.value = `ERROR: Selecciona un tipo de facturación.`;
               toastError.show();
               contextLoading.value = {status:false, message:''};
               return;
           }
        for (let i = 0; i < items.value.length; i++) {
                const it = items.value[i];
                const fila = i + 1;

                if (!it.voucher || it.voucher.trim() === '') {
                    msgTost.value = `ERROR: Voucher vacío en la fila ${fila}.`;
                    toastError.show();
                    return;
                }

                if (!it.referencia || it.referencia.trim() === '') {
                    msgTost.value = `ERROR: Referencia vacía en la fila ${fila}.`;
                    toastError.show();
                    return;
                }

                const monto = parseFloat((it.montoPagado || '').toString());
                if (isNaN(monto) || monto <= 0) {
                    msgTost.value = `ERROR: Monto inválido en la fila ${fila}.`;
                    toastError.show();
                    return;
                }
            }
         
              let radioGroupValue: number | null = checked ? Number(checked.value) : null;
           // Forzar valores según tokenfile / cantidad de items (mantener reglas previas)
           if (infoVoucher.value?.tokenfile != null && infoVoucher.value?.grupo) {
               radioGroupValue = 3; // Forzar valor de grupo si viene con tokenfile
           } else if (items.value.length == 1 && infoVoucher.value?.tokenfile == null) {
               radioGroupValue = 1; // Forzar valor individual si solo hay un voucher
           }
        

        const bs = (window as any)['bootstrap']
        const toastSuccess = new bs.Toast('#toast-success',{})
       // const toastError = new bs.Toast('#toast-error',{})
        const formInvoicing = document.querySelector('#form-invoicing') as HTMLFormElement
        const dataFormInvoicing : {[key:string]:any} = {}
        const radioTypePerson = document.querySelector('input[name="radiotipofactura"]:checked') as HTMLInputElement;
        let errorInvoicing = false;
        const factura =[...items.value];
      
            
        contextLoading.value = {status:true, message:''}        
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
            dataFormInvoicing.facturar = factura;
            dataFormInvoicing.idtipoagrupacionfactura = radioGroupValue;
        }    
        
        if(errorInvoicing == false )
        {        

            const response = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getRelationOrderInvoice", {method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataFormInvoicing)});
            const data =await response.json();

            if (!data.error) 
            {
                 // Limpiamos el campo voucher que causó el conflicto
                items.value =[objectItem];
            
                //(document.querySelector('#input-voucher') as HTMLInputElement).value = '';
                (formInvoicing as HTMLFormElement).reset(); 
                contextLoading.value = {status:false, message:''}
               
                 infoVoucher.value = objectInfo
                stateContext.value = { ...stateContext.value, infopayment: objectInfo}
               
                 toastSuccess.show()
                 setTimeout(() => {
                     window.location.reload();
                 }, 1000);
            }
            else{
                msgTost.value = data.mensaje || 'Ocurrió un error';
                toastError.show()
                contextLoading.value = {status:false, message:''}
            }
        }




         
    })

    return (
        <div class='container-fluid'>
                             
                <div class='row bg-image bg-contact-us-option-1 mt-5'>
                    <div class='col-xl-12 mt-5'>
                        <div class='container'>
                            <div class='row'>
                                <div class='col-lg-12 text-center'>
                                    <h2 class='h1 text-semi-bold text-dark-blue mb-3'>Facturación</h2>
                                    <hr class='divider my-5'></hr>
                                    <h3 class='h5 text-dark-gray'>¡Importante antes de enviar el formulario, verifica tus datos de facturación!</h3>
                                    <h3 class='h5 text-dark-gray'>Todos los campos son requeridos</h3>
                                    <div class='card mt-5 pt-3 pb-4 px-lg-5 shadow-lg'>
                                        <div class='card-body px-5 text-start'>

                                            <div class='row'>
                                                    <h6 class="text-semi-bold text-dark-blue">Ingrese los vouchers que requiere facturar </h6>
                                                    
                                            
                                            <div class="container mt-5 mb-0">
                                                {
                                                    infoVoucher.value.created_at &&
                                                    <ul class="list-group list-group-horizontal pb-4 align-items-center justify-content-center">
                                                        <li class="list-group-item list-group-item-light"><b>Fecha de emisión:</b> {infoVoucher.value.created_at}</li>
                                                        <li class="list-group-item list-group-item-light"><b>Tasa de Cambio:</b> {infoVoucher.value.tasacambio}</li>
                                                        <li class="list-group-item list-group-item-light"><b>Total :</b> ${montototalvoucher.value} {stateContext.value.changeCurrency||infoVoucher.value.codigomoneda} </li>
                                                    </ul>
                                                }

                                                {/* Títulos de las Columnas */}
                                                <div class="row d-none d-md-flex fw-bold text-secondary mb-2 border-bottom pb-1">
                                                    <div class="col-md-1">#</div>
                                                    <div class="col-md-4">Voucher</div>
                                                    {/* <div class="col-md-2">Tasa de Cambio</div> */}
                                                    <div class="col-md-3">Referencia</div>
                                                    <div class="col-md-3">Valor Pagado</div>
                                                    <div class="col-md-1"></div>
                                                </div>

                                                {/* Mapeo de la lista de filas de inputs */}
                                                {items.value.map((item, index) => (
                                                    <div key={item.id} class="row g-2 align-items-center mb-3">
                                                      <div class="col-md-1">{`# ${index + 1}`}</div>
                                                    {/* Columna: Voucher */}
                                                    <div class="col-12 col-md-4">
                                                        <label class="d-md-none">Voucher:</label>
                                                        <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder={`Voucher ${index + 1}`}
                                                        value={item.voucher}
                                                        onInput$={(e) => updateValue(item.id, 'voucher', (e.target as HTMLInputElement).value)}
                                                        onBlur$={(e) =>validationCodeVoucher$(e, item.id,index)}
                                                        required={true}
                                                        />
                                                    </div>

                                                    

                                                    {/* Columna: Referencia */}
                                                    <div class="col-12 col-md-3">
                                                        <label class="d-md-none">Referencia:</label>
                                                        <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="Referencia"
                                                        required={true}
                                                        value={item.referencia}
                                                        onInput$={(e) => updateValue(item.id, 'referencia', (e.target as HTMLInputElement).value)}
                                                        />
                                                    </div>

                                                    {/* Columna: Monto Pagado */}
                                                    <div class="col-12 col-md-3">
                                                        <label class="d-md-none">Monto Pagado:</label>
                                                        <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="Valor Pagado"
                                                        //defaultValue={montototalvoucher.value.toString()}
                                                        value={item.montoPagado}
                                                        required={true}
                                                        //onInput$={(e) => updateValue(item.id, 'montoPagado', (e.target as HTMLInputElement).value)}
                                                        onChange$={(e)=>validatePayment$(e, item.id,index)}
                                                        
                                                        />
                                                    </div>

                                                    {/* Columna: Botón Quitar */}
                                                    <div class="col-12 col-md-1 d-grid">
                                                        {
                                                        infoVoucher.value?.tokenfile == null &&  items.value.length >1 &&
                                                        <button
                                                            class="btn btn-outline-danger btn-sm"
                                                            type="button"
                                                            onClick$={() => removeInput(item.id)}
                                                            // Deshabilita si es el único elemento
                                                            disabled={items.value.length === 1}
                                                        >
                                                            Quitar
                                                        </button>
                                                        }
                                                    
                                                    </div>
                                                    </div>
                                                ))}

                                                {
                                                    infoVoucher.value?.tokenfile != null && infoVoucher.value?.grupo &&
                                                    <a class="btn btn-primary mb-2" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Ver Grupo</a>
                                                }
                                                {
                                                    infoVoucher.value?.tokenfile != null &&infoVoucher.value?.grupo &&
                                                    infoVoucher.value?.grupo.map((itemg:any, indexg:number) => (
                                                    <div key={indexg} class="row g-2 align-items-center my-1">
                                                        <div class="collapse" id="collapseExample">
                                                        <div class="card card-body py-1  my-1">
                                                            <table class="table-responsive table-sm">
                                                                <tbody>
                                                                <tr>
                                                                    <th scope="row" style={{ width: '80px' }}>{indexg}</th>
                                                                    <td style={{ width: '120px' }}>{itemg.codvoucher}</td>              
                                                                    <td style={{ width: '100px' }}>{itemg.preciototal}</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        </div>
                                                        </div>
                                                    ))
                                                }

                                                {/* Botón principal para AGREGAR filas */}
                                                <div class="mt-4">
                                                    {
                                                    infoVoucher.value?.tokenfile == null &&
                                                    <button
                                                    class="btn btn-primary"
                                                    type="button"
                                                    onClick$={addInput}
                                                    >
                                                    ➕ Agregar Voucher
                                                    </button>
                                                    }
                                                    
                                                </div>
                                                    {
                                                    infoVoucher.value?.tokenfile == null && items.value.length >1 &&
                                                    <div class="col-12 mb-1 my-3">
                                                            <hr/>
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

                                                    <div id='toast-validation-error' class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                                                                    <div class="d-flex">
                                                                        <div class="toast-body">
                                                                            <div class='message'>
                                                                                <i class="fas fa-times-circle"/>
                                                                                <span class='text-start mx-2'>
                                                                                    <b>{msgTost.value}</b>
                                                                                {/*   <br/>
                                                                                    <small>Si el error persiste llama a nuestros números de contacto.</small> */}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                                                    </div>
                                                    </div>
                                                

                                            </div>
                                               
                                                        
                                            </div>
                                            {
                                               country.value === 'CO'&&
                                                <InvoiceFormCO/>
                                                
                                            }
                                            {
                                                country.value === 'MX'&&
                                                <InvoiceFormMX/>
                                            }
                                        </div>
                                    </div>
                                    <br/>
                                    <div class='container mb-5'>
                                        <div class='row justify-content-center'>
                                            <div class='col-lg-2 col-sm-12'>
                                                <div class='d-grid gap-2'>
                                                    <button class='btn btn-primary btn-lg'  onClick$={(e)=>saveRelationOrderInvoice$(e)} disabled={infoVoucher.value?.tokenfile == null?false:true}>Enviar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                        {/* <br/>
                                        <small>En unos minutos responderemos tus dudas.</small> */}
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