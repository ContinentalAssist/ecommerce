import {
  $,
  component$,
  useContext,
  useSignal,
  useStylesScoped$,
  Slot,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import { LoadingContext } from "~/root";
import CurrencyFormatter from "../../../utils/CurrencyFormater";
import styles from "./card-payment-resume.css?inline";
import inputBasicStyles from "../inputs/input-basic/input-basic.css?inline";
import quotesEngineStyles from "../quotes-engine/quotes-engine.css?inline";
import ImgContinentalAssistPrintTicket from "../../../media/quotes-engine/continental-assist-print-ticket.webp?jsx";
import ImgContinentalAssistBagEssential from "../../../media/icons/continental-assist-bag-essential.webp?jsx";
import ImgContinentalAssistBagComplete from "../../../media/icons/continental-assist-bag-complete.webp?jsx";
import ImgContinentalAssistBagElite from "../../../media/icons/continental-assist-bag-elite.webp?jsx";
import { Form } from "../form/Form";
//import ImgOpenpayLogo from "../../../media/banks/LogotipoOpenpay.webp?jsx";
export const CardPaymentResume = component$(() => {
  useStylesScoped$(styles);
  useStylesScoped$(quotesEngineStyles);

  const stateContext = useContext(WEBContext);
  const contextDivisa = useContext(DIVISAContext);
  const contextLoading = useContext(LoadingContext);
  const location = useLocation();
  const indexPax = useSignal(0);
  const totalPay = useSignal({ divisa: "", total: 0 });
  const messageCupon = useSignal({
    error: "",
    cupon: { codigocupon: "", idcupon: 0, porcentaje: 0 },
    aplicado: false,
  });
  const showQuoteForm = useSignal(false);

  // Función local para guardar datos con QRL (igual que en step-3)
  const saveData = $((data: any) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "continental_assist_quote_data",
          JSON.stringify(data)
        );
      } catch (error) {
        console.warn("Error al guardar datos del cotizador:", error);
      }
    }
  });

  // Inicializar el cupón desde el estado global si existe
  useVisibleTask$(async () => {
    if (Object.keys(stateContext.value).length > 0) {
      // Si ya hay un cupón en el estado global, sincronizarlo
      if (stateContext.value.cupon && stateContext.value.cupon.codigocupon) {
        messageCupon.value = {
          error: "success",
          cupon: stateContext.value.cupon,
          aplicado: true,
        };
      }

      // Guardar datos en localStorage
      saveData(stateContext.value);
    }
  });

  /* 
  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      const cardPax = document.getElementById('card-pax');
      const cardRight = document.getElementById('card-right');
  
      if (cardPax && cardRight) {
        const newHeight = cardRight.offsetHeight + 52;
       // cardPax.style.height = `${newHeight}px`;
      }
    }
   

 }); */

  useTask$(({ track }) => {
    const precioGrupal = track(() => stateContext?.value?.plan?.precio_grupal);

    if (
      precioGrupal != undefined &&
      Object.keys(stateContext.value).length > 0 &&
      "plan" in stateContext.value
    ) {
      totalPay.value = {
        divisa: stateContext?.value?.plan?.codigomonedapago,
        total: Number(precioGrupal),
      };
    }
  });

  function calculateSubTotal() {
    const paxSub: any[] = [];
    stateContext.value?.asegurados.map((pax: any) => {
      // Calcular beneficios adicionales
      const beneficiosAdicionales = pax.beneficiosadicionalesSeleccionados.reduce(
        (sum: number, value: any) => {
          return sum + Number(value.precio);
        },
        0
      );

      // Verificar si aplica promoción menor (plan familiar + edad 0-24)
      const aplicaPromocionMenor =
        stateContext.value?.planfamiliar === "t" && pax.edad >= 0 && pax.edad <= 24;

      // Si aplica promoción menor, solo cobrar beneficios adicionales
      if (aplicaPromocionMenor) {
        if (stateContext.value?.total && contextDivisa.divisaUSD == true) {
          paxSub.push(beneficiosAdicionales);
        } else {
          paxSub.push(beneficiosAdicionales * stateContext.value?.currentRate?.rate);
        }
      } else {
        // Lógica normal: precio del plan + beneficios adicionales
        const precioBase =
          pax.edad >= stateContext.value?.plan?.edadprecioincremento
            ? stateContext.value?.plan?.precioincrementoedad
            : stateContext.value?.plan?.precioindividual;

        if (stateContext.value?.total && contextDivisa.divisaUSD == true) {
          paxSub.push(beneficiosAdicionales + precioBase);
        } else {
          paxSub.push(
            beneficiosAdicionales * stateContext.value?.currentRate?.rate +
            precioBase * stateContext.value?.currentRate?.rate
          );
        }
      }
    });
    return paxSub[indexPax.value];
  }

  function calculateIndividualPrice(pax: any) {
    //precio se valida edad viajero para calcular el precio
    const precioBase =
      pax.edad >= stateContext.value?.plan?.edadprecioincremento
        ? stateContext.value?.plan?.precioincrementoedad
        : stateContext.value?.plan?.precioindividual;

    const formattedPrice = contextDivisa.divisaUSD
      ? CurrencyFormatter(stateContext.value?.total?.divisa, precioBase)
      : CurrencyFormatter(
        stateContext?.value?.currentRate?.code,
        precioBase * stateContext?.value?.currentRate?.rate
      );

    return formattedPrice;
  }

  function calculateIndividualSubTotal(pax: any) {
    // Calcular beneficios adicionales
    const beneficiosAdicionales = pax.beneficiosadicionalesSeleccionados.reduce(
      (sum: number, value: any) => {
        return sum + Number(value.precio);
      },
      0
    );

    // Verificar si aplica promoción menor (plan familiar + edad 0-24)
    const aplicaPromocionMenor =
      stateContext.value?.planfamiliar === "t" && pax.edad >= 0 && pax.edad <= 24;

    // Si aplica promoción menor, solo cobrar beneficios adicionales
    if (aplicaPromocionMenor) {
      if (stateContext.value?.total && contextDivisa.divisaUSD == true) {
        return beneficiosAdicionales;
      } else {
        return beneficiosAdicionales * stateContext.value?.currentRate?.rate;
      }
    }

    // Lógica normal: precio del plan + beneficios adicionales
    const precioBase =
      pax.edad >= stateContext.value?.plan?.edadprecioincremento
        ? stateContext.value?.plan?.precioincrementoedad
        : stateContext.value?.plan?.precioindividual;

    if (stateContext.value?.total && contextDivisa.divisaUSD == true) {
      return beneficiosAdicionales + precioBase;
    } else {
      return (
        beneficiosAdicionales * stateContext.value?.currentRate?.rate +
        precioBase * stateContext.value?.currentRate?.rate
      );
    }
  }

  // Función para determinar si un viajero debe estar expandido por defecto
  const shouldBeExpandedByDefault = (index: number) => {
    const totalTravelers = stateContext.value?.asegurados?.length || 0;
    // Si hay solo 1 viajero, expandir por defecto
    // Si hay más de 1 viajero, colapsar todo por defecto
    return totalTravelers === 1;
  };

  const openCollapsPax$ = $((key: string) => {
    const targetElement = document.getElementById(key) as HTMLElement;
    if (!targetElement) return;

    // Verificar si el elemento está actualmente visible
    const isCurrentlyVisible = targetElement.classList.contains("show");

    // Cerrar todos los otros elementos de colapso
    const allCollapses = document.querySelectorAll(".collapse-pax");
    allCollapses.forEach((item) => {
      if (item.id !== key) {
        const element = item as HTMLElement;

        // Añadir clase de transición de cierre
        element.classList.add("collapsing");
        element.classList.remove("show");

        // Obtener altura actual para animación suave
        const currentHeight = element.scrollHeight;
        element.style.height = currentHeight + "px";

        // Forzar reflow para que el navegador registre la altura inicial
        element.offsetHeight;

        // Aplicar altura 0 para cerrar
        element.style.height = "0px";

        // Limpiar después de la transición
        setTimeout(() => {
          element.classList.remove("collapsing");
          element.style.height = "";
        }, 500);
      }
    });

    if (isCurrentlyVisible) {
      // Colapsar el elemento actual
      targetElement.classList.add("collapsing");
      targetElement.classList.remove("show");

      // Establecer altura actual antes de colapsar
      const currentHeight = targetElement.scrollHeight;
      targetElement.style.height = currentHeight + "px";

      // Forzar reflow
      targetElement.offsetHeight;

      // Colapsar a altura 0
      targetElement.style.height = "0px";

      // Limpiar después de la transición
      setTimeout(() => {
        targetElement.classList.remove("collapsing");
        targetElement.style.height = "";
      }, 500);
    } else {
      // Expandir el elemento actual
      targetElement.classList.add("collapsing");

      // Establecer altura inicial en 0
      targetElement.style.height = "0px";

      // Forzar reflow
      targetElement.offsetHeight;

      // Calcular y aplicar altura final
      const contentHeight = targetElement.scrollHeight;
      targetElement.style.height = contentHeight + "px";

      // Después de la transición, añadir clase show y limpiar
      setTimeout(() => {
        targetElement.classList.add("show");
        targetElement.classList.remove("collapsing");
        targetElement.style.height = ""; // Permite que sea responsive
      }, 500);
    }

    // Actualizar el ícono de chevron
    updateChevronIcon(key, !isCurrentlyVisible);
  });

  // Función auxiliar para actualizar el ícono del chevron
  const updateChevronIcon = (key: string, isOpen: boolean) => {
    const targetElement = document.getElementById(key);
    if (targetElement) {
      const parentListItem = targetElement.closest("li");
      if (parentListItem) {
        const chevronIcon = parentListItem.querySelector(".fa-chevron-down");
        if (chevronIcon) {
          if (isOpen) {
            chevronIcon.classList.add("rotated");
          } else {
            chevronIcon.classList.remove("rotated");
          }
        }
      }
    }
  };

  // Función para calcular descuento
  const calculateDiscount = $((subTotal: number, percentage: number) => {
    const decimalValue = percentage / 100;

    const discount = subTotal * decimalValue;

    return Math.round(discount * 100) / 100;
  });

  const getCupon$ = $(async () => {
    // Detectar si estamos en móvil de forma más robusta
    const isMobile = window.innerWidth <= 991 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const input = isMobile
      ? (document.querySelector("#input-cupon-mobile") as HTMLInputElement)
      : (document.querySelector("#input-cupon") as HTMLInputElement);

    if (!input) {
      console.error("No se pudo encontrar el input de cupón");
      contextLoading.value = { status: false, message: "" };
      return;
    }

    if (input.value != "") {
      if (
        stateContext.value?.resGeo?.ip_address != "" ||
        stateContext.value?.resGeo?.ip_ != undefined
      ) {
        const dataRequest = {
          idplan: stateContext.value.plan.idplan,
          codigocupon: input.value,
          ip: stateContext.value.resGeo.ip_address,
        };

        let resCupon: { [key: string]: any } = {};
        contextLoading.value = {
          status: true,
          message: "Espere un momento...",
        };

        //loading.value = true;

          const resCuponValid = await fetch(import.meta.env.VITE_MY_PUBLIC_WEB_ECOMMERCE+"/api/getCupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataRequest),
        });
        const dataCupon = await resCuponValid.json();
        resCupon = dataCupon;

        if (
          resCupon.error == false &&
          Number(resCupon.resultado[0]?.porcentaje) > 0
        ) {
          const dataCupon = Object.assign({}, resCupon.resultado[0]);
          const newResume = Object.assign({}, stateContext.value);

          try {
            // Cálculo del descuento
            const discount = await calculateDiscount(
              stateContext.value?.subTotal,
              Number(resCupon.resultado[0].porcentaje)
            );
            const newTotal = stateContext.value?.subTotal - discount;

            newResume.total = {
              divisa: newResume.total.divisa,
              total: newTotal,
            };

            stateContext.value = newResume;
            dataCupon.descuento = discount;
            messageCupon.value = {
              error: "success",
              cupon: dataCupon,
              aplicado: true,
            };
            newResume.cupon = messageCupon.value.cupon;
            stateContext.value = newResume;

            // Guardar datos en localStorage
            saveData(stateContext.value);
            contextLoading.value = { status: false, message: "" };
          } catch (error) {
            console.error("Error en el cálculo del descuento:", error);
            contextLoading.value = { status: false, message: "" };
            messageCupon.value = {
              error: "error",
              cupon: { codigocupon: input.value, idcupon: 0, porcentaje: 0 },
              aplicado: false,
            };
          }
        } else {
          contextLoading.value = { status: false, message: "" };
          messageCupon.value = {
            error: "error",
            cupon: { codigocupon: input.value, idcupon: 0, porcentaje: 0 },
            aplicado: false,
          };
        }
        //loading.value = false;
      }
      // updateHeight$(); // Ya no es necesario con fit-content
    }
  });

  const removeCupon$ = $(async () => {
    messageCupon.value = {
      error: "",
      cupon: { codigocupon: "", idcupon: 0, porcentaje: 0 },
      aplicado: false,
    };
    const newResume = Object.assign({}, stateContext.value);
    newResume.cupon = {
      idcupon: 0,
      codigocupon: "",
      porcentaje: 0,
    };
    newResume.total = {
      divisa: newResume.total.divisa,
      total: stateContext.value.subTotal,
    };
    stateContext.value = newResume;

    // Guardar datos en localStorage
    saveData(stateContext.value);

    // Detectar si estamos en móvil de forma más robusta
    const isMobile = window.innerWidth <= 991 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const input = isMobile
      ? (document.querySelector("#input-cupon-mobile") as HTMLInputElement)
      : (document.querySelector("#input-cupon") as HTMLInputElement);

    if (input) {
      input.value = "";
    }
    // updateHeight$(); // Ya no es necesario con fit-content
  });

  // Función para mostrar/ocultar el formulario de envío de cotización
  const toggleQuoteForm$ = $((e: any) => {
    showQuoteForm.value = e.target.checked;
    // updateHeight$(); // Ya no es necesario con fit-content
  });

  // Función para enviar la cotización por email (replicada exactamente del step-3)
  const sendQuote$ = $(async () => {
    const form = document.querySelector(
      "#form-send-quote-email"
    ) as HTMLFormElement;
    const inputs = Array.from(form.querySelectorAll("input"));
    const bs = (window as any)["bootstrap"];
    const toastSuccess = new bs.Toast("#toast-success", {});
    const toastError = new bs.Toast("#toast-error", {});
    let error = false;
    const dataForm: { [key: string]: any } = {};

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      error = true;
    } else {
      form.classList.remove("was-validated");

      inputs.map((input) => {
        dataForm[(input as HTMLInputElement).name] = (
          input as HTMLInputElement
        ).value;
      });
    }

    if (error == false) {
      const planescotizados: any[] = [];

      stateContext.value.planescotizados.map((plan: any) => {
        planescotizados.push({
          idplan: plan.idplan,
          precio: plan.precio_grupal,
        });
      });

      dataForm.cotizacion = {
        fecha: {
          desde: stateContext.value.desde,
          hasta: stateContext.value.hasta,
          dias: stateContext.value.dias,
        },
        origen: stateContext.value.origen,
        destinos: stateContext.value.destinos,
        pasajeros: stateContext.value.asegurados,
        planfamiliar: stateContext.value.planfamiliar,
        plan: {
          idplan: stateContext.value.plan.idplan,
          nombreplan: stateContext.value.plan.nombreplan,
          precio: stateContext.value.plan.precio_grupal,
        },
        total: stateContext.value.total.total,
        moneda: { codigomoneda: stateContext.value.total.divisa },
        planescotizados: planescotizados,
        contacto: stateContext.value.contacto,
        edades: stateContext.value.edades,
        ip_address: stateContext.value.resGeo.ip_address,
      };

      let resQuote: { [key: string]: any } = {};

      const resSendQuote = await fetch("/api/getSendEmailQuote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForm),
      });
      const dataSendQuote = await resSendQuote.json();

      resQuote = dataSendQuote;

      if (resQuote.error == false) {
        toastSuccess.show();
        // Limpiar el formulario después del envío exitoso
        showQuoteForm.value = false;
        form.reset();
      } else {
        toastError.show();
      }
    }
  });

  return (
    <div class="container ">
      <div class="row">
        <div class="col-right col-lg-7 col-md-12">
          {/* Header del formulario de pago */}
          <div class="row justify-content-center">
            {stateContext?.value?.total?.total > 0 &&
              !location.url.pathname.includes("/step-4") ? (
              <div class="col-lg-10 text-center mb-3">
                <h3 class="text-semi-bold text-blue">
                  Todo listo para tu viaje
                </h3>
                <h4 class="text-regular text-blue">Elije como pagar</h4>
              </div>
            ) : stateContext?.value?.total?.total <= 0 ? (
              <div class="col-lg-12 text-center mt-5 mb-5">
                <h2 class="h1 text-semi-bold text-dark-blue">Lo sentimos!</h2>
                <h5 class="text-dark-blue">
                  Hubo un error en la búsqueda, vuelve a intentarlo.
                </h5>
              </div>
            ) : null}
          </div>

          {/* Card del Cupón - Mobile */}
          {!location.url.pathname.includes("/step-4") && (
            <div
              class="card mb-3 shadow-sm border-0 d-lg-none"
              style={{ borderRadius: "15px !important" }}
            >
              <div class="card-body p-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="flex-grow-1">
                    <input
                      id="input-cupon-mobile"
                      name="cupon"
                      type="text"
                      class="form-control text-center"
                      placeholder="Ingresar código de cupón"
                      disabled={messageCupon.value.aplicado}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "30px",
                        padding: "8px",
                      }}
                    />
                  </div>

                  <div class="flex-shrink-0">
                    {messageCupon.value.aplicado == false &&
                      messageCupon.value.cupon.codigocupon == "" ? (
                      <button
                        type="button"
                        class="btn btn-primary btn_cotizar_1"
                        onClick$={getCupon$}
                        style={{
                          minWidth: "80px",
                          fontSize: "1rem !important",
                        }}
                      >
                        Validar
                      </button>
                    ) : (
                      <button
                        type="button"
                        class="btn btn-primary btn_cotizar_1"
                        onClick$={removeCupon$}
                        style={{
                          minWidth: "80px",
                          fontSize: "1rem !important",
                        }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {messageCupon.value.error != "" && (
                  <div
                    class="col-lg-12 
               "
                  >
                    {messageCupon.value.error == "error" && (
                      <div
                        class="alert alert-danger text-semi-bold text-blue mb-0"
                        role="alert"
                      >
                        Cupón{" "}
                        <span class="text-semi-bold text-danger">
                          {messageCupon.value.cupon.codigocupon} no es valido!
                        </span>
                      </div>
                    )}
                    {messageCupon.value.error == "success" && (
                      <div
                        class="alert alert-success text-semi-bold text-blue mb-0"
                        role="alert"
                      >
                        Cupón{" "}
                        <span class="text-semi-bold text-success">
                          {" "}
                          {messageCupon.value.cupon.codigocupon}{" "}
                        </span>{" "}
                        aplicado con éxito!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner Cupón - Mobile */}
          {!location.url.pathname.includes("/step-4") && (
            <div
              class="card mb-3 shadow-sm border-0 d-lg-none"
              style={{ borderRadius: "15px !important" }}
            >
              <div class="card-body p-0">
                <img
                  src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-navidad.png"
                  class="img-fluid"
                  style={{ borderRadius: "15px", width: "100%" }}
                  alt="Banner Cupón"
                />
              </div>
            </div>
          )}

          {/* Card de Resumen de Viajeros - Solo Mobile */}
          <div
            id="card-pax-mobile"
            class="card border-0 mb-3 shadow-sm d-lg-none"
          >
            <div class="card-body">
              <div class="col-lg-12 col-xs-12 d-lg-flex px-3">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <div class="d-flex align-items-center">
                    <h5 class="text-dark-blue text-start text-semi-bold mb-0">
                      Resumen
                    </h5>
                  </div>
                  <div class="d-flex align-items-center">
                    <img
                      src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-passengers.png"
                      alt="Usuario"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        marginRight: "0.5rem",
                      }}
                    />
                    <div>
                      <div
                        class="text-semi-bold text-dark-blue"
                        style={{ fontSize: "0.875rem", lineHeight: "1" }}
                      >
                        {typeof stateContext.value.pasajeros === "string"
                          ? stateContext.value.pasajeros.split(" ")[0]
                          : stateContext.value.pasajeros}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 px-2">
                <hr class="hr-gray" />
              </div>
              <ul class="list-group" id="list-pax-mobile">
                {Object.keys(stateContext.value).length > 0 &&
                  Array.isArray(stateContext.value?.asegurados) &&
                  stateContext.value?.asegurados.map(
                    (pax: any, index: number) => {
                      return (
                        <li class="list-group" key={index + 1}>
                          <div class="row">
                            <div class="col-12 d-flex">
                              <div class="col-lg-8  col-md-8  col-sm-8  col-xs-8  px-3">
                                <div class="d-none d-lg-flex align-items-start">
                                  <h5
                                    class="text-medium text-dark-blue text-align-start"
                                    style={{
                                      marginBottom: 0,
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    {pax.nombres} {pax.apellidos}
                                  </h5>
                                </div>

                                <div class="d-flex d-lg-none align-items-start justify-content-start">
                                  <h5
                                    class="text-medium text-dark-blue text-align-start"
                                    style={{
                                      marginBottom: 0,
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    {pax.nombres} {pax.apellidos}
                                  </h5>
                                </div>
                              </div>
                              <div class="col-lg-4 ps-0 pe-1"></div>
                              <div class="mobile text-center">
                                <p
                                  class="text-light-blue"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                  }}
                                  onClick$={() => {
                                    openCollapsPax$(
                                      String("collapse-" + (index + 1))
                                    );
                                    indexPax.value = index;
                                  }}
                                >
                                  <span
                                    class="text-semi-bold"
                                    style={{ marginRight: "5px" }}
                                  >
                                    Viajero #{index + 1}
                                  </span>
                                  <i class="fa-solid fa-chevron-down"></i>
                                </p>
                              </div>
                            </div>

                            <div
                              id={"collapse-" + (index + 1)}
                              class={`collapse-pax collapse ${shouldBeExpandedByDefault(index) ? "show" : ""}`}
                              aria-labelledby="headingTwo"
                              data-parent="#accordion"
                              style={{
                                backgroundColor: "#fff",
                                marginLeft: 0,
                                marginRight: 0,
                              }}
                            >
                              <div class="row px-3">
                                <div class="col-lg-8 col-xs-12">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0.438rem",
                                        }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png"
                                          alt="Avión"
                                          style="width: 1.2rem; height: 1.2rem; margin-right: 0.3rem;"
                                        />
                                      </span>
                                      <label class="label-resume text-dark-gray">
                                        <span
                                          class="text-medium text-dark-blue"
                                          style={{ fontSize: "0.80rem" }}
                                        >
                                          {stateContext.value?.paisorigen}{" "}
                                          <span class="text-medium text-dark-blue">
                                            {" "}
                                            -{" "}
                                          </span>{" "}
                                          {stateContext.value?.paisesdestino &&
                                            String(
                                              stateContext.value?.paisesdestino
                                            ).replaceAll(",", ", ")}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-lg-12 col-xs-12 mt-1">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{ paddingLeft: "0px" }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png"
                                          alt="Calendario"
                                          style="width: 1.2rem; height: 1.2rem;"
                                        />
                                      </span>
                                      <label class="label-resume text-dark-gray ">
                                        <span
                                          class="text-medium text-dark-blue"
                                          style={{ fontSize: "0.80rem" }}
                                        >
                                          {stateContext.value?.desde}{" "}
                                          <span class="text-medium text-dark-blue">
                                            {" "}
                                            al{" "}
                                          </span>{" "}
                                          {stateContext.value?.hasta}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{ paddingLeft: "0px" }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plan.png"
                                          alt="Editar"
                                          style="width: 1rem; height: 1rem; margin-right: 0.2rem;"
                                        />
                                      </span>

                                      <span
                                        class="text-medium text-dark-blue"
                                        style={{ fontSize: "0.80rem" }}
                                      >
                                        {stateContext.value?.plan.nombreplan}
                                      </span>
                                    </div>
                                  </div>

                                  <br />
                                </div>
                                <div class="col-6 ps-0">
                                  {stateContext.value?.planfamiliar == "t" &&
                                    pax.edad <= 23 ? (
                                    <p
                                      class="text-bold text-dark-blue text-end"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      Promoción Menor
                                    </p>
                                  ) : (
                                    <h6 class="divisa-plan-sub text-medium text-dark-blue text-end mb-0 mt-0">
                                      {calculateIndividualPrice(pax)}
                                    </h6>
                                  )}
                                </div>

                                {pax.beneficiosadicionalesSeleccionados.length >
                                  0 && (
                                    <div class="beneficios-adicionales-container">
                                      <div class="col-lg-12 col-xs-12">
                                        <div class="input-group">
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span
                                              class="icon-container"
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "0.2rem",
                                              }}
                                            >
                                              <img
                                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-beneficios.png"
                                                alt="Beneficios"
                                                style="width: 1.8rem; height: 1.8rem;"
                                              />
                                            </span>
                                            <p class="label-resume">
                                              <span class="text-tin text-dark-gray ps-0">
                                                Beneficios adicionales
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <ul>
                                        {pax.beneficiosadicionalesSeleccionados.map(
                                          (benefit: any, iBenefit: number) => {
                                            return (
                                              <li
                                                key={iBenefit}
                                                class="text-semi-bold text-blue"
                                                style={{ fontSize: "0.875rem" }}
                                              >
                                                <div class="row">
                                                  <div
                                                    class="col-lg-8 col-xs-6 text-medium"
                                                    style={{ fontSize: "0.875rem" }}
                                                  >
                                                    {
                                                      benefit.nombrebeneficioadicional
                                                    }
                                                  </div>
                                                  <div class="col-lg-4 col-xs-6">
                                                    <h4
                                                      class="divisa-beneficio text-medium mb-2"
                                                      style={{
                                                        fontSize: "0.875rem",
                                                      }}
                                                    >
                                                      {contextDivisa.divisaUSD ==
                                                        true
                                                        ? CurrencyFormatter(
                                                          benefit.codigomonedapago,
                                                          benefit.precio
                                                        )
                                                        : CurrencyFormatter(
                                                          stateContext.value
                                                            ?.currentRate?.code,
                                                          benefit.precio *
                                                          stateContext.value
                                                            ?.currentRate
                                                            ?.rate
                                                        )}
                                                    </h4>
                                                  </div>
                                                </div>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>

                              <hr class="hr-gray mt-0 mx-2" />

                              {/* Subtotal individual por viajero */}
                              <div class="beneficios-adicionales-container ms-3 mt-2">
                                <div class="row">
                                  <div
                                    class="col-lg-7 col-xs-6 text-medium"
                                    style={{ fontSize: "0.80rem" }}
                                  >
                                    Sub total por persona
                                  </div>
                                  <div class="col-lg-5 col-xs-6">
                                    <h4
                                      class="divisa-plan-sub text-bold text-dark-blue text-end me-3"
                                      style={{ fontSize: "1.1rem" }}
                                    >
                                      {stateContext.value?.total &&
                                        (contextDivisa.divisaUSD == true
                                          ? CurrencyFormatter(
                                            stateContext.value?.total.divisa,
                                            calculateIndividualSubTotal(pax)
                                          )
                                          : CurrencyFormatter(
                                            stateContext.value?.currentRate
                                              ?.code,
                                            calculateIndividualSubTotal(pax)
                                          ))}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index <
                            stateContext.value?.asegurados.length - 1 && (
                              <div class="col-12 px-2 pb-2">
                                <hr class="hr-gray" />
                              </div>
                            )}
                        </li>
                      );
                    }
                  )}
              </ul>
              <div class="col-12 col-xs-12 text-end mx-2 ">
                <div class="col-12 pe-3 pb-1 pt-1">
                  <hr class="hr-gray" />
                </div>
                <div class="row">
                  <div class="col-12 d-flex justify-content-center align-items-center h-auto">
                    <div class="col-2 col-xs-2 col-md-2 d-flex flex-column ">
                      {/* Imagen del plan seleccionado */}
                      {stateContext.value?.plan?.nombreplan
                        ?.toLowerCase()
                        .includes("essential") && (
                          <ImgContinentalAssistBagEssential
                            class="img-fluid"
                            loading="lazy"
                            title="continental-assist-bag-essential"
                            alt="continental-assist-bag-essential"
                            style={{ maxWidth: "50px", height: "auto" }}
                          />
                        )}
                      {stateContext.value?.plan?.nombreplan
                        ?.toLowerCase()
                        .includes("complete") && (
                          <ImgContinentalAssistBagComplete
                            class="img-fluid"
                            loading="lazy"
                            title="continental-assist-bag-complete"
                            alt="continental-assist-bag-complete"
                            style={{ maxWidth: "50px", height: "auto" }}
                          />
                        )}
                      {stateContext.value?.plan?.nombreplan
                        ?.toLowerCase()
                        .includes("elite") && (
                          <ImgContinentalAssistBagElite
                            class="img-fluid"
                            loading="lazy"
                            title="continental-assist-bag-elite"
                            alt="continental-assist-bag-elite"
                            style={{ maxWidth: "50px", height: "auto" }}
                          />
                        )}
                    </div>
                    <div class="col-3 col-xs-3 col-md-3 d-flex flex-column ">
                      <label class="label-resume text-dark-gray">
                        <span class="text-tin">Plan </span>
                        <br />
                        <span
                          class="text-medium text-dark-blue"
                          style={{ fontSize: "0.80rem" }}
                        >
                          {stateContext.value?.plan.nombreplan}
                        </span>
                      </label>
                    </div>
                    <div class="col-7 col-xs-7 col-md-7 d-flex flex-column ">
                      <h6 class="divisa-total text-bold text-blue mb-0 pe-4">
                        {stateContext.value?.cupon &&
                          stateContext.value?.cupon?.codigocupon && (
                            <>
                              <strike class="precio-strike">
                                {stateContext.value?.total &&
                                  (contextDivisa.divisaUSD == true
                                    ? CurrencyFormatter(
                                      stateContext.value?.total?.divisa,
                                      stateContext.value?.subTotal
                                    )
                                    : CurrencyFormatter(
                                      stateContext.value?.currentRate?.code,
                                      stateContext.value?.subTotal *
                                      stateContext.value?.currentRate?.rate
                                    ))}
                              </strike>
                              <br />
                            </>
                          )}
                        {
                          /* totalPay.value.total && (contextDivisa.divisaUSD == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) :
                                CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate)) */
                          stateContext.value?.total &&
                          (contextDivisa.divisaUSD == true
                            ? CurrencyFormatter(
                              stateContext.value?.total?.divisa,
                              stateContext.value?.total?.total
                            )
                            : CurrencyFormatter(
                              stateContext.value?.currentRate?.code,
                              stateContext.value?.total?.total *
                              stateContext.value?.currentRate?.rate
                            ))
                        }
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div
                id="card-right"
                style={{
                  borderRadius: "15px !important",
                  border: "none !important",
                }}
              >
                <div class=" mx-0 mb-2">
                  {<Slot />}
                  <div class="container">
                    <div class="row pt-2">
                      <div class="col-6 col-xs-12">
                        {/* {
                      !contextDivisa.divisaUSD &&
                      stateContext.value?.currentRate?.code ==='MXN'&&
                      <>
                      <p class='text-regular text-regular  mb-0'>Transacciones realizadas vía: </p>
                      <ImgOpenpayLogo class='img-fluid' loading="lazy" style={{height:'50px', width:'auto'}} />
                      </>
                      
                    } */}
                      </div>
                      <div class="col-12 d-flex flex-row">
                        {/*  {
                        !contextDivisa.divisaUSD &&
                        stateContext.value?.currentRate?.code ==='MXN'&&
                        <>
                         <i class="fas fa-shield-alt fa-sm  pe-2" style={{color:'green'}}></i>
                         <small class='text-regular text-dark-gray mb-0'>Tus pagos se realizan de forma segura con encriptación de 256 bits. </small>
                        </>
                    } */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-left col-lg-5 col-md-12 ">
          {/* Card del Cupón - Desktop */}
          {!location.url.pathname.includes("/step-4") && (
            <div
              class="card mb-3 shadow-sm border-0 d-none d-lg-block"
              style={{ borderRadius: "15px !important" }}
            >
              <div class="card-body p-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="flex-grow-1">
                    <input
                      id="input-cupon"
                      name="cupon"
                      type="text"
                      class="form-control text-center"
                      placeholder="Ingresar código de cupón"
                      disabled={messageCupon.value.aplicado}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "30px",
                        padding: "8px",
                      }}
                    />
                  </div>

                  <div class="flex-shrink-0">
                    {messageCupon.value.aplicado == false &&
                      messageCupon.value.cupon.codigocupon == "" ? (
                      <button
                        type="button"
                        class="btn btn-primary btn_cotizar_1"
                        onClick$={getCupon$}
                        style={{
                          minWidth: "80px",
                          fontSize: "1rem !important",
                        }}
                      >
                        Validar
                      </button>
                    ) : (
                      <button
                        type="button"
                        class="btn btn-primary btn_cotizar_1"
                        onClick$={removeCupon$}
                        style={{
                          minWidth: "80px",
                          fontSize: "1rem !important",
                        }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {messageCupon.value.error != "" && (
                  <div
                    class="col-lg-12 
               "
                  >
                    {messageCupon.value.error == "error" && (
                      <div
                        class="alert alert-danger text-semi-bold text-blue mb-0"
                        role="alert"
                      >
                        Cupón{" "}
                        <span class="text-semi-bold text-danger">
                          {messageCupon.value.cupon.codigocupon} no es valido!
                        </span>
                      </div>
                    )}
                    {messageCupon.value.error == "success" && (
                      <div
                        class="alert alert-success text-semi-bold text-blue mb-0"
                        role="alert"
                      >
                        Cupón{" "}
                        <span class="text-semi-bold text-success">
                          {" "}
                          {messageCupon.value.cupon.codigocupon}{" "}
                        </span>{" "}
                        aplicado con éxito!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner Cupón - Desktop */}
          {!location.url.pathname.includes("/step-4") && (
            <div
              class="card mb-3 shadow-sm border-0 d-none d-lg-block"
              style={{ borderRadius: "15px !important" }}
            >
              <div class="card-body p-0">
                <img
                  src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/Banner-navidad.png"
                  class="img-fluid"
                  style={{ borderRadius: "15px", width: "100%" }}
                  alt="Banner Cupón"
                />
              </div>
            </div>
          )}

          {/* Card de Resumen de Viajeros - Solo Desktop */}
          <div id="card-pax" class="card  mb-3 shadow-sm d-none d-lg-block">
            <div class="card-body">
              <div class="col-lg-12 col-xs-12 d-none d-lg-flex px-3">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <div class="d-flex align-items-center">
                    <h5 class="text-dark-blue text-start text-semi-bold mb-0">
                      Resumen
                    </h5>
                  </div>
                  <div class="d-flex align-items-center">
                    <i
                      class="fa-solid fa-users text-light-blue me-2"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <div>
                      <div
                        class="text-dark-gray"
                        style={{ fontSize: "0.75rem", lineHeight: "1" }}
                      >
                        Viajeros
                      </div>
                      <div
                        class="text-semi-bold text-dark-blue"
                        style={{ fontSize: "0.875rem", lineHeight: "1" }}
                      >
                        {stateContext.value?.pasajeros} viajeros
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 px-2">
                <hr class="hr-gray" />
              </div>
              <ul class="list-group" id="list-pax-desktop">
                {Object.keys(stateContext.value).length > 0 &&
                  Array.isArray(stateContext.value?.asegurados) &&
                  stateContext.value?.asegurados.map(
                    (pax: any, index: number) => {
                      return (
                        <li class="list-group" key={index + 1}>
                          <div class="row">
                            <div class="col-lg-8 px-4">
                              <div class="d-none d-lg-flex align-items-center">
                                <h5
                                  class="text-medium text-dark-blue text-start"
                                  style={{ marginBottom: 0 }}
                                >
                                  {pax.nombres} {pax.apellidos}
                                </h5>
                              </div>

                              <div class="d-flex d-lg-none align-items-center justify-content-center">
                                <h5
                                  class="text-medium text-dark-blue text-center"
                                  style={{ marginBottom: 0 }}
                                >
                                  {pax.nombres} {pax.apellidos}
                                </h5>
                              </div>
                            </div>
                            <div class="col-lg-4 ps-0 pe-4">
                              <div class="not-mobile d-flex flex-column text-end">
                                <p
                                  class="text-light-blue"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                  }}
                                  onClick$={() => {
                                    openCollapsPax$(
                                      String("collapse-desktop-" + (index + 1))
                                    );
                                    indexPax.value = index;
                                  }}
                                >
                                  <span
                                    class="text-semi-bold"
                                    style={{ marginRight: "5px" }}
                                  >
                                    Viajero #{index + 1}
                                  </span>
                                  <i class="fa-solid fa-chevron-down"></i>
                                </p>
                              </div>

                              <div class="mobile text-center">
                                <p
                                  class="text-light-blue"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                  }}
                                  onClick$={() => {
                                    openCollapsPax$(
                                      String("collapse-" + (index + 1))
                                    );
                                    indexPax.value = index;
                                  }}
                                >
                                  <span
                                    class="text-semi-bold"
                                    style={{ marginRight: "5px" }}
                                  >
                                    Viajero #{index + 1}
                                  </span>
                                  <i class="fa-solid fa-chevron-down"></i>
                                </p>
                              </div>
                            </div>

                            <div
                              id={"collapse-desktop-" + (index + 1)}
                              class={`collapse-pax collapse ${shouldBeExpandedByDefault(index) ? "show" : ""}`}
                              aria-labelledby="headingTwo"
                              data-parent="#accordion"
                              style={{
                                backgroundColor: "#fff",
                                marginLeft: 0,
                                marginRight: 0,
                              }}
                            >
                              <br />
                              <div class="row px-3">
                                <div class="col-lg-8 col-xs-12">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{
                                          paddingLeft: "0px",
                                          paddingRight: "0.438rem",
                                        }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plane-from.png"
                                          alt="Avión"
                                          style="width: 1.2rem; height: 1.2rem; margin-right: 0.3rem;"
                                        />
                                      </span>
                                      <label class="label-resume text-dark-gray">
                                        <span class="text-tin">
                                          Origen / Destino(s)
                                        </span>{" "}
                                        <br />
                                        <span
                                          class="text-medium text-dark-blue"
                                          style={{ fontSize: "1.1rem" }}
                                        >
                                          {stateContext.value?.paisorigen}{" "}
                                          <span class="text-medium text-dark-blue">
                                            {" "}
                                            a{" "}
                                          </span>{" "}
                                          {stateContext.value?.paisesdestino &&
                                            String(
                                              stateContext.value?.paisesdestino
                                            ).replaceAll(",", ", ")}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-lg-12 col-xs-12 mt-3">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{ paddingLeft: "0px" }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-date.png"
                                          alt="Calendario"
                                          style="width: 1.2rem; height: 1.2rem;"
                                        />
                                      </span>
                                      <label class="label-resume text-dark-gray ">
                                        <span class="text-tin">
                                          Fechas de tu viaje{" "}
                                        </span>{" "}
                                        <br />
                                        <span
                                          class="text-medium text-dark-blue"
                                          style={{ fontSize: "1.1rem" }}
                                        >
                                          {stateContext.value?.desde}{" "}
                                          <span class="text-medium text-dark-blue">
                                            {" "}
                                            al{" "}
                                          </span>{" "}
                                          {stateContext.value?.hasta}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                  <br />
                                </div>
                                <div class="col-6">
                                  <div class="input-group">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        class="input-group-text border border-0 align-self-center text-dark-blue"
                                        style={{ paddingLeft: "0px" }}
                                      >
                                        <img
                                          src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-plan.png"
                                          alt="Editar"
                                          style="width: 1rem; height: 1rem; margin-right: 0.2rem;"
                                        />
                                      </span>
                                      <label class="label-resume text-dark-gray">
                                        <span class="text-tin">Plan </span>
                                        <br />
                                        <span
                                          class="text-medium text-dark-blue"
                                          style={{ fontSize: "1.1rem" }}
                                        >
                                          {stateContext.value?.plan.nombreplan}
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  <br />
                                </div>
                                <div class="col-6 ps-0">
                                  {stateContext.value?.planfamiliar == "t" &&
                                    pax.edad >= 0 && pax.edad <= 24 ? (
                                    <p
                                      class="text-bold text-dark-blue text-end"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      Promoción Menor
                                    </p>
                                  ) : (
                                    <h4 class="divisa-plan-sub text-medium text-dark-blue text-end mb-0 mt-3">
                                      {calculateIndividualPrice(pax)}
                                    </h4>
                                  )}
                                </div>
                                <br />

                                {pax.beneficiosadicionalesSeleccionados.length >
                                  0 && (
                                    <div class="beneficios-adicionales-container">
                                      <div class="col-lg-12 col-xs-12">
                                        <div class="input-group">
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span
                                              class="icon-container"
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "0.2rem",
                                              }}
                                            >
                                              <img
                                                src="https://evacotizacion.nyc3.cdn.digitaloceanspaces.com/imagenes/icon-beneficios.png"
                                                alt="Beneficios"
                                                style="width: 1.8rem; height: 1.8rem;"
                                              />
                                            </span>
                                            <p class="label-resume">
                                              <span class="text-tin text-dark-gray ps-0">
                                                Beneficios adicionales
                                              </span>
                                              <br />
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <ul>
                                        {pax.beneficiosadicionalesSeleccionados.map(
                                          (benefit: any, iBenefit: number) => {
                                            return (
                                              <li
                                                key={iBenefit}
                                                class="text-semi-bold text-blue"
                                                style={{ fontSize: "0.875rem" }}
                                              >
                                                <div class="row">
                                                  <div
                                                    class="col-lg-8 col-xs-6 text-medium"
                                                    style={{ fontSize: "0.875rem" }}
                                                  >
                                                    {
                                                      benefit.nombrebeneficioadicional
                                                    }
                                                  </div>
                                                  <div class="col-lg-4 col-xs-6">
                                                    <h4
                                                      class="divisa-beneficio text-medium mb-2"
                                                      style={{
                                                        fontSize: "0.80rem",
                                                      }}
                                                    >
                                                      {contextDivisa.divisaUSD ==
                                                        true
                                                        ? CurrencyFormatter(
                                                          benefit.codigomonedapago,
                                                          benefit.precio
                                                        )
                                                        : CurrencyFormatter(
                                                          stateContext.value
                                                            ?.currentRate?.code,
                                                          benefit.precio *
                                                          stateContext.value
                                                            ?.currentRate
                                                            ?.rate
                                                        )}
                                                    </h4>
                                                  </div>
                                                </div>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>

                              <hr class="hr-gray mt-3 mx-2" />

                              {/* Subtotal individual por viajero */}
                              <div class="beneficios-adicionales-container ms-5 mt-3">
                                <div class="row">
                                  <div
                                    class="col-lg-7 col-xs-6 text-medium"
                                    style={{ fontSize: "1.1rem" }}
                                  >
                                    Sub total por persona
                                  </div>
                                  <div class="col-lg-5 col-xs-6">
                                    <h4
                                      class="divisa-plan-sub text-bold text-dark-blue text-end me-3"
                                      style={{ fontSize: "1.1rem" }}
                                    >
                                      {stateContext.value?.total &&
                                        (contextDivisa.divisaUSD == true
                                          ? CurrencyFormatter(
                                            stateContext.value?.total.divisa,
                                            calculateIndividualSubTotal(pax)
                                          )
                                          : CurrencyFormatter(
                                            stateContext.value?.currentRate
                                              ?.code,
                                            calculateIndividualSubTotal(pax)
                                          ))}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index <
                            stateContext.value?.asegurados.length - 1 && (
                              <div class="col-12 px-2 pb-2">
                                <hr class="hr-gray" />
                              </div>
                            )}
                        </li>
                      );
                    }
                  )}
              </ul>
              <div class="col-12 col-xs-12 text-end mx-2 ">
                <div class="col-12 pe-3 pb-3 pt-1">
                  <hr class="hr-gray" />
                </div>
                <div class="row">
                  <div
                    class="col-3 col-xs-12 d-flex flex-column justify-content-center align-items-center text-center"
                    style={{ minHeight: "120px" }}
                  >
                    {/* Imagen del plan seleccionado */}
                    {stateContext.value?.plan?.nombreplan
                      ?.toLowerCase()
                      .includes("essential") && (
                        <ImgContinentalAssistBagEssential
                          class="img-fluid"
                          loading="lazy"
                          title="continental-assist-bag-essential"
                          alt="continental-assist-bag-essential"
                          style={{
                            maxWidth: "120px",
                            height: "auto",
                            paddingBottom: "30px",
                          }}
                        />
                      )}
                    {stateContext.value?.plan?.nombreplan
                      ?.toLowerCase()
                      .includes("complete") && (
                        <ImgContinentalAssistBagComplete
                          class="img-fluid"
                          loading="lazy"
                          title="continental-assist-bag-complete"
                          alt="continental-assist-bag-complete"
                          style={{
                            maxWidth: "120px",
                            height: "auto",
                            paddingBottom: "30px",
                          }}
                        />
                      )}
                    {stateContext.value?.plan?.nombreplan
                      ?.toLowerCase()
                      .includes("elite") && (
                        <ImgContinentalAssistBagElite
                          class="img-fluid"
                          loading="lazy"
                          title="continental-assist-bag-elite"
                          alt="continental-assist-bag-elite"
                          style={{
                            maxWidth: "120px",
                            height: "auto",
                            paddingBottom: "30px",
                          }}
                        />
                      )}
                  </div>
                  <div
                    class="col-3 col-xs-12 d-flex flex-column justify-content-center align-items-center text-center"
                    style={{ minHeight: "120px" }}
                  >
                    <label class="label-resume text-dark-gray">
                      <span class="text-tin">Plan </span>
                      <br />
                      <span
                        class="text-medium text-dark-blue"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {stateContext.value?.plan.nombreplan}
                      </span>
                    </label>
                  </div>
                  <div
                    class="col-6 col-xs-12 d-flex flex-column justify-content-center align-items-center text-center"
                    style={{ minHeight: "120px" }}
                  >
                    <p class="text-regular text-blue mb-0">
                      {" "}
                      {`Total para ${stateContext.value?.pasajeros || ""}`}
                    </p>
                    <h3 class="divisa-total text-bold text-blue mb-4">
                      {stateContext.value?.cupon &&
                        stateContext.value?.cupon?.codigocupon && (
                          <>
                            <strike class="precio-strike">
                              {stateContext.value?.total &&
                                (contextDivisa.divisaUSD == true
                                  ? CurrencyFormatter(
                                    stateContext.value?.total?.divisa,
                                    stateContext.value?.subTotal
                                  )
                                  : CurrencyFormatter(
                                    stateContext.value?.currentRate?.code,
                                    stateContext.value?.subTotal *
                                    stateContext.value?.currentRate?.rate
                                  ))}
                            </strike>
                            <br />
                          </>
                        )}
                      {
                        /* totalPay.value.total && (contextDivisa.divisaUSD == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) :
                            CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate)) */
                        stateContext.value?.total &&
                        (contextDivisa.divisaUSD == true
                          ? CurrencyFormatter(
                            stateContext.value?.total?.divisa,
                            stateContext.value?.total?.total
                          )
                          : CurrencyFormatter(
                            stateContext.value?.currentRate?.code,
                            stateContext.value?.total?.total *
                            stateContext.value?.currentRate?.rate
                          ))
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
