import { $, component$, useContext, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, type DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { WEBContext } from '~/root';
import styles from './index.css?inline';
import ImgContinentalAssistPrintTicket from '~/media/quotes-engine/continental-assist-print-ticket.webp?jsx';
import ImgContinentalAssistBagEssential from '~/media/icons/continental-assist-bag-essential.webp?jsx';
import ImgContinentalAssistBagComplete from '~/media/icons/continental-assist-bag-complete.webp?jsx';
import ImgContinentalAssistBagElite from '~/media/icons/continental-assist-bag-elite.webp?jsx';
import CurrencyFormatter from '~/utils/CurrencyFormater';
import { LoadingContext } from '~/root';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const head: DocumentHead = {
  title: 'Continental Assist | Mensaje de compra',
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'title', content: 'Continental Assist | Mensaje de compra' },
    { name: 'description', content: 'Paso 6 - Mensaje de compra.' },
    { property: 'og:title', content: 'Continental Assist | Mensaje de compra' },
    { property: 'og:description', content: 'Paso 6 - Mensaje de compra. ' },
  ],
  links: [
    {
      rel: 'canonical',
      href: 'https://continentalassist.com/quotes-engine/message',
    },
  ],
};

export default component$(() => {
  useStylesScoped$(styles);
  const stateContext = useContext(WEBContext);
  const navigate = useNavigate();
  const obj: { [key: string]: any } = {};
  const resume = useSignal(obj);
  const locationEnv = useLocation();
  const typeMessage = useSignal(0);
  const desktop = useSignal(false);
  const contextLoading = useContext(LoadingContext);
  const purchaseTracked = useSignal(false);

  // Función local para guardar datos con QRL (igual que en los steps)
  const saveData = $((data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('continental_assist_quote_data', JSON.stringify(data));
      } catch (error) {
        console.warn('Error al guardar datos del cotizador:', error);
      }
    }
  });

  // Función para cargar datos desde localStorage
  const loadData = $(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('continental_assist_quote_data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          return parsedData;
        }
      } catch (error) {
        console.warn('Error al cargar datos del cotizador:', error);
      }
    }
    return null;
  });

  useTask$(({ track }) => {
    const messageType = track(() => typeMessage.value);
    const resumeData = track(() => resume.value);

    // Solo ejecutar para compra exitosa y cuando tengamos datos
    if (
      messageType === 1 &&
      !purchaseTracked.value &&
      Object.keys(resumeData).length > 0 &&
      resumeData.codigovoucher &&
      typeof window !== 'undefined' &&
      'dataLayer' in window
    ) {
      // Extraer el código de país del paisorigen (asumiendo formato "MÉXICO" -> "MX")
      const countryCode = resumeData.paisorigen?.substring(0, 2).toUpperCase() || '';

      // Crear el item_id combinando país y algún identificador del plan
      const itemId = `${countryCode}_${resumeData.codigovoucher}`;

      // Enviar el evento purchase usando dataLayer
      (window as any)['dataLayer'].push({
        event: 'purchase',
        transaction_id: resumeData.codigovoucher,
        value: Number(resumeData.total) || 0,
        currency: resumeData.codigomoneda || 'USD',
        ecommerce: {
          transaction_id: resumeData.codigovoucher,
          value: Number(resumeData.total) || 0,
          tax: 0.0,
          shipping: 0.0,
          currency: resumeData.codigomoneda || 'USD',
          coupon: '',
          items: [
            {
              item_id: itemId,
              item_name: resumeData.nombreplan || '',
              coupon: '',
              discount: 0.0,
              index: 0,
              item_brand: 'Continental Assist',
              item_category: countryCode,
              item_list_id: '',
              item_list_name: '',
              item_variant: '',
              location_id: '',
              price: Number(resumeData.total) || 0,
              quantity: 1,
            },
          ],
        },
      });

      // Marcar como rastreado para evitar duplicados
      purchaseTracked.value = true;
    }
  });

  const getVoucher = $(async (vouchercode: string) => {
    let resVoucher: { [key: string]: any } = {};

    const resData = await fetch('/api/getVoucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigovoucher: vouchercode }),
    });
    const data = await resData.json();
    resVoucher = data;

    if (resVoucher.error == false) {
      // Verificar si tenemos datos válidos del voucher
      if (resVoucher.resultado && resVoucher.resultado.length > 0) {
        const voucherData = resVoucher.resultado[0];

        // Mapeo mejorado de datos del voucher
        const mappedVoucherData = {
          // Voucher
          codvoucher: voucherData.codvoucher,

          // Fechas
          fechasalida: voucherData.fechasalida || 'Fecha no especificada',
          fecharegreso: voucherData.fecharegreso || 'Fecha no especificada',
        };

        // Asignar los datos del voucher
        resume.value = {
          ...resume.value, // Mantener datos del contexto si existen
          ...mappedVoucherData, // Sobrescribir con datos mapeados del voucher
        };

        typeMessage.value = 1;
      } else {
        typeMessage.value = 4; // Mostrar error
      }
    } else {
      typeMessage.value = 4; // Mostrar error
    }
    contextLoading.value = { status: false, message: '' };
  });

  useTask$(() => {
    if (Object.keys(stateContext.value).length > 0) {
      // Asignar datos del contexto al resume
      const mappedContextData = {
        // Plan
        nombreplan: stateContext.value?.plan?.nombreplan || 'Plan no especificado',

        // País/Origen
        paisorigen: stateContext.value?.paisorigen || 'País no especificado',

        // Destinos
        paisesdestino: stateContext.value?.paisesdestino
          ? Array.isArray(stateContext.value.paisesdestino)
            ? stateContext.value.paisesdestino.join(', ')
            : stateContext.value.paisesdestino
          : 'Destino no especificado',

        // Voucher
        codigovoucher: stateContext.value?.codevoucher || '',

        // Total y moneda
        total: stateContext.value?.total?.total || 0,

        // Moneda
        codigomoneda: stateContext.value?.total?.divisa || 'USD',
      };

      // Asignar directamente los datos mapeados para evitar problemas de reactividad
      resume.value = mappedContextData;

      // Guardar datos en localStorage (igual que en los steps)
      saveData(stateContext.value);

      if (resume?.value?.codevoucher != '' && stateContext.value?.paymentstutus == 'completed') {
        if (stateContext?.value?.typeMessage == 1) {
          getVoucher(resume?.value?.codevoucher);
        }
      } else if (stateContext?.value?.codevoucher && stateContext?.value?.paymentstutus == 'completed') {
        getVoucher(stateContext?.value?.codevoucher);
      } else {
        typeMessage.value = stateContext?.value?.typeMessage;
      }
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Intentar cargar datos desde localStorage al inicializar
    const savedData = await loadData();

    // Si hay datos guardados y no hay parámetros de URL, restaurar el contexto
    if (
      savedData &&
      Object.keys(savedData).length > 0 &&
      !locationEnv.url.search.includes('id') &&
      !locationEnv.url.search.includes('env')
    ) {
      // Restaurar el contexto completo
      stateContext.value = savedData;

      // Mapear los datos para el resume
      const mappedContextData = {
        // Plan
        nombreplan: savedData?.plan?.nombreplan || 'Plan no especificado',

        // País/Origen
        paisorigen: savedData?.paisorigen || 'País no especificado',

        // Destinos
        paisesdestino: savedData?.paisesdestino
          ? Array.isArray(savedData.paisesdestino)
            ? savedData.paisesdestino.join(', ')
            : savedData.paisesdestino
          : 'Destino no especificado',

        // Voucher
        codigovoucher: savedData?.codevoucher || '',

        // Total y moneda
        total: savedData?.total?.total || 0,

        // Moneda
        codigomoneda: savedData?.total?.divisa || 'USD',
      };

      resume.value = mappedContextData;

      // Si tenemos datos del voucher, mostrar mensaje de éxito
      if (savedData.codevoucher) {
        typeMessage.value = 1;
        // Intentar obtener el voucher si no tenemos los datos completos
        if (!savedData.codvoucher) {
          getVoucher(savedData.codevoucher);
        }
      } else {
        typeMessage.value = savedData.typeMessage || 1;
      }
      return;
    }

    if (locationEnv.url.search.includes('id') || locationEnv.url.search.includes('env')) {
      if (locationEnv.url.search.includes('id') && !locationEnv.url.search.includes('env')) {
        const resValidation = await fetch('/api/getValidationTransactionOP', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: locationEnv.url.searchParams.get('id') }),
        });
        const dataValidation = await resValidation.json();

        if (dataValidation.resultado?.status == 'completed') {
          getVoucher(dataValidation.resultado.order_id);
        } else {
          typeMessage.value = 4;
        }
      } else {
        const resValidation = await fetch('/api/getValidationTransactionW', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_transaction: locationEnv.url.searchParams.get('id'),
          }),
        });
        const dataValidation = await resValidation.json();

        if (dataValidation.resultado.status == 'APPROVED') {
          getVoucher(dataValidation.resultado.reference);
        } else {
          typeMessage.value = 4;
        }
      }
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!navigator.userAgent.includes('Mobile')) {
      desktop.value = true;
    }
    contextLoading.value = { status: false, message: '' };
  });

  // Función para limpiar datos del localStorage (igual que en index.tsx)
  const clearData = $(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('continental_assist_quote_data');
        // También limpiar el contexto actual
        stateContext.value = {};
      } catch (error) {
        console.warn('Error al limpiar datos del cotizador:', error);
      }
    }
  });

  const redirectHome$ = $(() => {
    // Limpiar datos antes de redirigir
    clearData();
    navigate('/');
    setTimeout(() => location.reload(), 300);
  });

  return (
    <div class='container-fluid px-0'>
      <div class='container-fluid'>
        <div class='row bg-message'>
          <div class='col-xl-12'>
            <div class='container '>
              <div class='row'>
                <div class='col-lg-12 col-xl-12 '>
                  {Number(typeMessage.value) == 1 && (
                    <div class='row justify-content-center'>
                      <div class='col-lg-12 text-center '>
                        <p class='h1 text-semi-bold text-blue'>
                          <i class='fa-regular fa-circle-check fa-xl' style={{ color: 'green' }} /> Gracias por tu
                          compra!{' '}
                        </p>
                        <br />
                      </div>


                      <div class='col-lg-6 col-sm-12'>
                        <div class='card mt-4 shadow-ms card-message-container' id='card-pax'>
                          {/* Header con imagen de fondo */}
                          <div class='card-header-image card-header-message'>
                            {/* Overlay opcional para mejor contraste */}
                            <div class='card-header-overlay'></div>

                            {/* Contenido del header con estructura row */}
                            <div class='row h-auto card-header-content'>
                              {/* Columna para el texto "Disfruta tu viaje" como imagen */}
                              <div class='col-6 d-flex justify-content-start card-header-text-column'>
                                <img
                                  src='/assets/img/icons/tipografia-mesagge.png'
                                  alt='Disfruta tu viaje'
                                  class='card-header-text-image'
                                />
                              </div>

                              {/* Columna para la imagen de la familia */}
                              <div class='col-6 d-flex align-items-end justify-content-end card-header-image-column'>
                                <img
                                  src='/assets/img/icons/personas-mesagge.png'
                                  alt='Familia de viajeros'
                                  class='card-header-family-image'
                                />
                              </div>
                            </div>
                          </div>
                          <div class='card-body'>
                            <div class='container  m-2'>
                              <div class='row not-mobile'>
                                {/*<div class='col-lg-6 col-sm-12 '>
                                  <div class='input-group'>
                                    <p>
                                      <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '1.188rem' }}>
                                        Plan
                                      </span>
                                      <br />
                                      <span class='text-bold text-light-blue' style={{ fontSize: '1.375rem' }}>
                                        {resume.value?.nombreplan}
                                      </span>
                                    </p>
                                  </div>
                                </div> */}
                                <div class='col-lg-12 col-sm-12  text-start'>
                                  <p class='text-regular text-dark-gray mb-0' style={{ fontSize: '1.1rem' }}>
                                    Código de voucher:
                                  </p>
                                  <p class='text-semi-bold text-blue mb-0' style={{ fontSize: '1.375rem' }}>
                                    {resume.value.codvoucher}
                                  </p>
                                </div>
                              </div>
                              <div class='row mobile'>
                                <div class='col-sm-12 col-xs-12 '>
                                  <div class='d-flex justify-content-center'>
                                <div class='col-sm-6 col-xs-6'>
                                  <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                    Código de voucher:
                                  </span>
                                  <br />
                                  <span class='text-medium text-dark-blue' style={{ fontSize: '1.1rem' }}>
                                    {resume.value.codvoucher}
                                  </span>
                                </div>
                                <div class='col-sm-6 col-xs-6 d-flex justify-content-end'>
                                  <div class='input-group'>
                                     <span class='input-group-text border border-0 ' style={{ backgroundColor: 'white' }}>
                                     <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-passengers.png" alt="Viajeros" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                     </span>
                                     <p style={{ textAlign: 'left' }}>
                                       <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                         Viajeros
                                       </span>{' '}
                                       <br />
                                       <span class='text-regular text-dark-blue' style={{ fontSize: '1rem' }}>
                                         {resume.value?.viajeros || '1'} viajero{resume.value?.viajeros > 1 ? 's' : ''}
                                       </span>
                                     </p>
                                   </div>
                                </div>
                                </div>
                                <div class='col-lg-12 col-sm-12'>
                                <hr class='hr-compra' />
                                <div class='input-group' style={{ backgroundColor: 'white' }}>
                                  <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                  <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png" alt="Avión" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                  </span>
                                  <p style={{ marginLeft: '-6px' }}>
                                    <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.70rem' }}>
                                      Origen / Destino(s)
                                    </span>{' '}
                                    <br />
                                    <span class='text-regular text-dark-blue' style={{ fontSize: '0.85rem' }}>
                                      {resume.value.paisorigen} <span class='text-regular text-dark-blue'> a </span>{' '}
                                      {resume.value.paisesdestino &&
                                        String(resume.value.paisesdestino).replaceAll(',', ', ')}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div class='row '>
                                
                                  <div class='d-flex justify-content-start gap-2'>
                                <div class='col-lg-4 col-sm-6 col-xs-6'>
                                  <div class='input-group'>
                                    <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                    <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                    </span>
                                    <p style={{ textAlign: 'left' }}>
                                      <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.70rem' }}>
                                        Ida
                                      </span>{' '}
                                      <br />
                                      <span class='text-regular text-dark-blue' style={{ fontSize: '0.85rem' }}>
                                        {' '}
                                        {resume.value.fechasalida}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                 <div class='col-lg-4 col-sm-6 col-xs-6'>
                                   <div class='input-group'>
                                     <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                     <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                     </span>
                                     <p style={{ textAlign: 'left' }}>
                                       <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.70rem' }}>
                                         Vuelta
                                       </span>{' '}
                                       <br />
                                       <span class='text-regular text-dark-blue' style={{ fontSize: '0.85rem' }}>
                                         {' '}
                                         {resume.value.fecharegreso}
                                       </span>
                                     </p>
                                   </div>
                                 </div>
                                 </div>
                                 </div>
                                </div>
                              </div>
                            

                              <div class='row not-mobile'>
                              <div class='col-lg-12 col-sm-12'>
                                <hr class='hr-compra' />
                                <div class='input-group' style={{ backgroundColor: 'white' }}>
                                  <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                  <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png" alt="Avión" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                  </span>
                                  <p style={{ marginLeft: '-6px' }}>
                                    <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                      Origen / Destino(s)
                                    </span>{' '}
                                    <br />
                                    <span class='text-regular text-dark-blue' style={{ fontSize: '1rem' }}>
                                      {resume.value.paisorigen} <span class='text-regular text-dark-blue'> a </span>{' '}
                                      {resume.value.paisesdestino &&
                                        String(resume.value.paisesdestino).replaceAll(',', ', ')}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div class='row'>
                                <div class='col-lg-4 col-sm-12 pe-0'>
                                  <div class='input-group pe-0'>
                                    <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                    <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                    </span>
                                    <p style={{ textAlign: 'left' }}>
                                      <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                        Ida
                                      </span>{' '}
                                      <br />
                                      <span class='text-regular text-dark-blue' style={{ fontSize: '1rem' }}>
                                        {' '}
                                        {resume.value.fechasalida}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                 <div class='col-lg-4 col-sm-12 pe-0'>
                                   <div class='input-group'>
                                     <span class='input-group-text border border-0 ps-0' style={{ backgroundColor: 'white' }}>
                                     <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png" alt="Calendario" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                     </span>
                                     <p style={{ textAlign: 'left' }}>
                                       <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                         Vuelta
                                       </span>{' '}
                                       <br />
                                       <span class='text-regular text-dark-blue' style={{ fontSize: '1rem' }}>
                                         {' '}
                                         {resume.value.fecharegreso}
                                       </span>
                                     </p>
                                   </div>
                                 </div>
                                 <div class='col-lg-4 col-sm-12 pe-0'>
                                   <div class='input-group'>
                                     <span class='input-group-text border border-0 ' style={{ backgroundColor: 'white' }}>
                                     <img src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-passengers.png" alt="Viajeros" style="width: 1.2rem; height: 1.2rem; margin-right: 0.5rem;"/>
                                     </span>
                                     <p style={{ textAlign: 'left' }}>
                                       <span class='text-regular text-dark-gray ps-0' style={{ fontSize: '0.80rem' }}>
                                         Viajeros
                                       </span>{' '}
                                       <br />
                                       <span class='text-regular text-dark-blue' style={{ fontSize: '1rem' }}>
                                         {resume.value?.viajeros || '1'} viajero{resume.value?.viajeros > 1 ? 's' : ''}
                                       </span>
                                     </p>
                                   </div>
                                 </div>
                              </div>
                              </div>
                              <hr class='hr-compra' />

                              {/* Sección de resumen del plan - replicando CardPaymentResume */}
                              <div class="col-12 col-xs-12 text-start mx-2 d-lg-none">
                              <div class="row">
                                <div class="col-12 d-flex justify-content-center align-items-center h-auto">
                                  <div class="col-2 col-xs-2 col-md-2 d-flex flex-column">
                                    {/* Imagen del plan seleccionado */}
                                    {resume.value?.nombreplan?.toLowerCase().includes('essential') && (
                                      <ImgContinentalAssistBagEssential 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-essential"
                                        alt="continental-assist-bag-essential"
                                        style={{ maxWidth: "60px", height: "auto" }}
                                      />
                                    )}
                                    {resume.value?.nombreplan?.toLowerCase().includes('complete') && (
                                      <ImgContinentalAssistBagComplete 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-complete"
                                        alt="continental-assist-bag-complete"
                                        style={{ maxWidth: "60px", height: "auto" }}
                                      />
                                    )}
                                    {resume.value?.nombreplan?.toLowerCase().includes('elite') && (
                                      <ImgContinentalAssistBagElite 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-elite"
                                        alt="continental-assist-bag-elite"
                                        style={{ maxWidth: "60px", height: "auto" }}
                                      />
                                    )}
                                  </div>
                                  <div class="col-3 col-xs-3 col-md-3 d-flex flex-column text-center">
                                    <label class="label-resume text-dark-gray">
                                      <span class="text-tin">Plan </span>
                                      <br />
                                      <span
                                        class="text-medium text-dark-blue"
                                        style={{ fontSize: "0.80rem" }}
                                      >
                                        {resume.value?.nombreplan}
                                      </span>
                                    </label>
                                  </div>
                                  <div class="col-7 col-xs-7 col-md-7 d-flex flex-column text-end">
                                    <p class="text-regular text-blue mb-0 pe-4" style={{ fontSize: "0.80rem" }}>
                                      {`Total para ${resume.value?.viajeros || "1"} viajero${resume.value?.viajeros > 1 ? 's' : ''}`}
                                    </p>
                                    <h2 class="divisa-total text-bold text-blue mb-0 pe-4">
                                      {CurrencyFormatter(resume.value?.codigomoneda, resume.value?.total)}
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div class="col-12 col-xs-12 text-end mx-2 d-none d-lg-block">
                              <div class="row">
                                <div class="col-12 d-flex justify-content-center align-items-center h-auto px-0">
                                  <div class="col-4 col-xs-2 col-md-2 d-flex flex-column">
                                    {/* Imagen del plan seleccionado */}
                                    {resume.value?.nombreplan?.toLowerCase().includes('essential') && (
                                      <ImgContinentalAssistBagEssential 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-essential"
                                        alt="continental-assist-bag-essential"
                                        style={{ maxWidth: "100px", height: "auto" }}
                                      />
                                    )}
                                    {resume.value?.nombreplan?.toLowerCase().includes('complete') && (
                                      <ImgContinentalAssistBagComplete 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-complete"
                                        alt="continental-assist-bag-complete"
                                        style={{ maxWidth: "100px", height: "auto" }}
                                      />
                                    )}
                                    {resume.value?.nombreplan?.toLowerCase().includes('elite') && (
                                      <ImgContinentalAssistBagElite 
                                        class="img-fluid" 
                                        loading="lazy"
                                        title="continental-assist-bag-elite"
                                        alt="continental-assist-bag-elite"
                                        style={{ maxWidth: "100px", height: "auto" }}
                                      />
                                    )}
                                  </div>
                                  <div class="col-3 col-xs-3 col-md-3 d-flex flex-column text-center">
                                    <label class="label-resume text-dark-gray">
                                      <span class="text-tin">Plan </span>
                                      <br />
                                      <span
                                        class="text-medium text-dark-blue"
                                        style={{ fontSize: "0.80rem" }}
                                      >
                                        {resume.value?.nombreplan}
                                      </span>
                                    </label>
                                  </div>
                                  <div class="col-5 col-xs-7 col-md-7 d-flex flex-column">
                                    <p class="text-regular text-blue mb-0 pe-5">
                                      {`Total para ${resume.value?.viajeros || "1"} viajero${resume.value?.viajeros > 1 ? 's' : ''}`}
                                    </p>
                                    <h6 class="divisa-total text-bold text-blue mb-0 pe-5">
                                      {CurrencyFormatter(resume.value?.codigomoneda, resume.value?.total)}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class='row d-flex justify-content-center mb-0 mx-auto mt-4'>
                        <div class='col-lg-6 d-flex justify-content-center'>
                          <div class='d-grid gap-2'>
                            <p class='text-regular text-dark-gray'>
                              <span class='text-regular text-dark-gray'  style={{ fontSize: '1rem' }}>
                                En breve recibirás un correo con la confirmación de tu compra.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                        <div class='row justify-content-center m-4'>
                          <div class='col-lg-auto'>
                            <div class='d-flex justify-content-center'>
                              <button type='button' class='btn btn-primary btn_cotizar_1 px-4' onClick$={() => redirectHome$()}>
                                Volver al inicio
                              </button>
                            </div>
                          </div>
                        </div>
                    </div>
                  )}

                  {Number(typeMessage.value) == 2 && (
                    <>
                      <div class='row justify-content-center' style={{ minHeight: '70vh' }}>
                        <div class='col-lg-12 text-center mt-5'>
                          <p class='h1 text-semi-bold text-blue'>
                            <i class='fa-regular fa-circle-xmark fa-xl' style={{ color: 'red' }} /> Compra
                            rechazada{' '}
                          </p>
                          <hr class='divider my-3' />
                        </div>
                        <div class='col-lg-6'>
                          <h5 class='text-dark-blue mb-4 text-center'>
                            Lo sentimos, tu pago ha sido rechazado.
                            <br />
                            Intenta nuevamente o cambia el método de pago.
                          </h5>
                          <div class='d-grid gap-2'>
                            <button
                              type='button'
                              class='btn btn-primary btn-lg'
                              onClick$={() => navigate('/quotes-engine/step-3')}
                            >
                              Intentar de nuevo
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {Number(typeMessage.value) == 3 && (
                    <>
                      <div class='row justify-content-center' style={{ minHeight: '70vh' }}>
                        <div class='col-lg-12 text-center mt-5'>
                          <p class='h1 text-semi-bold text-blue'>
                            <i class='fa-regular fa-circle-xmark fa-xl' style={{ color: 'red' }} /> ¡Has realizado tres
                            intentos!{' '}
                          </p>
                          <hr class='divider my-3' />
                        </div>

                        <div class='col-lg-6'>
                          <h5 class='text-dark-blue mb-4 text-center'>
                            Lo sentimos has superado el número de intentos permitidos.
                          </h5>
                          <div class='d-grid gap-2'>
                            <button type='button' class='btn btn-primary btn-lg' onClick$={() => redirectHome$()}>
                              Volver al inicio
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {Number(typeMessage.value) == 4 && (
                    <>
                      <div class='row justify-content-center' style={{ minHeight: '70vh' }}>
                        <div class='col-lg-12 text-center mt-5'>
                          <p class='h1 text-semi-bold text-blue'>
                            <i class='fa-regular fa-circle-xmark fa-xl' style={{ color: 'red' }} /> Compra
                            rechazada{' '}
                          </p>
                          <hr class='divider my-3' />
                        </div>
                        <div class='col-lg-6'>
                          <h5 class='text-dark-blue mb-4 text-center'>Lo sentimos, tu pago ha sido rechazado.</h5>
                          <div class='d-grid gap-2'>
                            <button type='button' class='btn btn-primary btn-lg' onClick$={() => redirectHome$()}>
                              Volver al inicio
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
