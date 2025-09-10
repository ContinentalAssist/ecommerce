import { $, component$, useContext, useSignal, useStylesScoped$,  Slot, useTask$ } from "@builder.io/qwik";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from "../../../utils/CurrencyFormater";
import styles from "./card-payment-resume.css?inline";
import ImgContinentalAssistPrintTicket from "../../../media/quotes-engine/continental-assist-print-ticket.webp?jsx";
//import ImgOpenpayLogo from "../../../media/banks/LogotipoOpenpay.webp?jsx";
export const CardPaymentResume = component$(() => {

  useStylesScoped$(styles);

  const stateContext = useContext(WEBContext);
  const contextDivisa = useContext(DIVISAContext)
  const indexPax = useSignal(0)
  const totalPay = useSignal({divisa:'',total:0})

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
  const precioGrupal = track(()=>stateContext?.value?.plan?.precio_grupal);  

  if(precioGrupal != undefined&&Object.keys(stateContext.value).length > 0&& 'plan' in stateContext.value)
      {

          totalPay.value = {divisa:stateContext?.value?.plan?.codigomonedapago,total:Number(precioGrupal)}

      }
})

  function calculateSubTotal() {
    const paxSub :any[] = [];
    stateContext.value?.asegurados.map((pax: any) => 
      {
        const precioBase = pax.edad >= stateContext.value?.plan?.edadprecioincremento
        ? stateContext.value?.plan?.precioincrementoedad
        : stateContext.value?.plan?.precioindividual;

        if (stateContext.value?.total && contextDivisa.divisaUSD == true) {
          paxSub.push(pax.beneficiosadicionalesSeleccionados.reduce((sum: number, value: any) => {    
            return sum +  Number(value.precio);
          }, 0) + precioBase)

        }else{
          
        paxSub.push(pax.beneficiosadicionalesSeleccionados.reduce((sum: number, value: any) => {          
          return sum + Number(value.precio);
          }, 0) *stateContext.value?.currentRate?.rate + (precioBase * stateContext.value?.currentRate?.rate))

        }      
      })
    return paxSub[indexPax.value]
  }

  function calculateIndividualPrice(pax:any) {
    //precio se valida edad viajero para calcular el precio 
  const precioBase = pax.edad >= stateContext.value?.plan?.edadprecioincremento
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


  const openCollapsPax$ = $((key: string) => {
    const bs = (window as any)["bootstrap"];

    const collapseTwo = new bs.Collapse("#" + key, {});
    collapseTwo.hide();

    const collapse = document.querySelectorAll(".collapse");

    collapse.forEach((item) => {
      if (item.id != key) {
        //item.classList.add('collapsing')
        //item.classList.remove('collapsing')
        item.classList.remove("show");
      }
    });
  });

  return (
    <div class="container ">
    <div class="row">
      <div class="col-left col-lg-5 col-md-12">
        <div id="card-pax" class="card  mb-3" >           
          <div class="card-body">
          <ul class="list-group" id="list-pax">
                    {Object.keys(stateContext.value).length > 0 &&
                      Array.isArray(stateContext.value?.asegurados) &&
                      stateContext.value?.asegurados.map((pax: any, index: number) => {
                        return (
                          <li class="list-group" key={index + 1}>
                            <div class="row">
                              <div class="col-lg-12 px-4">
                                <div class="not-mobile">
                                <p class="text-dark-blue text-start" style={{  padding: 0, margin: 0 }}>
                                  Viajero # {index + 1}
                                </p>
                                </div>

                                <div class="mobile">
                                <p class="text-dark-blue text-center" style={{  padding: 0, margin: 0 }}>
                                  Viajero # {index + 1}
                                </p>
                                </div>
                                
                              </div>
                            </div>
                            <div class="row ">
                              <div class="col-lg-9 ps-4 pe-0">
                              <div class="not-mobile">
                              <h4 class="text-bold text-dark-blue text-start" style={{  marginBottom: 0 }}>
                                  {pax.nombres} {pax.apellidos}
                                </h4>
                              </div>

                              <div class="mobile">
                              <h4 class="text-bold text-dark-blue text-center" style={{  marginBottom: 0 }}>
                                  {pax.nombres} {pax.apellidos}
                                </h4>
                              </div>
                               
                              </div>
                              <div class="col-lg-3 ps-0 pe-4">
                                <div  class="row not-mobile">
                                  <div class=" d-flex flex-column text-end">
                                  <p class="text-light-blue" 
                                  style={{  padding: 0, margin: 0, cursor: "pointer" }}
                                  onClick$={() => {
                                    openCollapsPax$(String("collapse-" + (index + 1)));
                                    indexPax.value = index;
                                  }}
                                  >
                                    Ver detalles
                                  </p>
                                </div>

                                </div>
                              

                              <div class="mobile text-center">
                              <p
                                  class="text-light-blue"
                                  style={{  padding: 0, margin: 0, cursor: "pointer" }}
                                  onClick$={() => {
                                    openCollapsPax$(String("collapse-" + (index + 1)));
                                    indexPax.value = index;
                                  }}
                                >
                                  Ver detalles
                                </p>
                              </div>
                               
                              </div>
                              <div  class="col-12 px-4">
                              <hr
                                class="hr-blue"
                              />
                              </div>
                              

                              <div
                                id={"collapse-" + (index + 1)}
                                class={index == 0 ? "collapse-pax collapse show" : " collapse-pax collapse"}
                                aria-labelledby="headingTwo"
                                data-parent="#accordion"
                                style={{ backgroundColor: "#FAFAFA", marginLeft: 0, marginRight: 0 }}
                              >
                                <br />
                                <div class="row px-3">
           

                                  <div class="col-lg-6 col-xs-12">
                                    <div class="input-group">
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span
                                          class="input-group-text border border-0 align-self-center text-dark-blue"
                                          style={{ paddingLeft: "0px", paddingRight: "0.438rem" }}
                                        >
                                          <i class="fa-solid fa-plane-departure fa-lg"></i>
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                          
                                        >
                                          <span class="text-tin">Origen / Destino(s)</span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {stateContext.value?.paisorigen}{" "}
                                            <span class="text-semi-bold text-dark-blue"> a </span>{" "}
                                            {stateContext.value?.paisesdestino &&
                                              String(stateContext.value?.paisesdestino).replaceAll(",", ", ")}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                 
                                  <div class="col-lg-6 col-xs-12">
                                    <div class="input-group">
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span
                                          class="input-group-text border border-0 align-self-center text-dark-blue"
                                          style={{ paddingLeft: "0px" }}
                                        >
                                          <i class="fa-solid fa-user-plus fa-lg" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                        >
                                          <span class="text-tin">Viajeros </span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {stateContext.value?.pasajeros}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                 
                                  <div class="col-lg-12 col-xs-12">
                                    <div class="input-group">
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span
                                          class="input-group-text border border-0 align-self-center text-dark-blue"
                                          style={{ paddingLeft: "0px" }}
                                        >
                                          <i class="far fa-calendar fa-lg" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray "
                                         
                                        >
                                          <span class="text-tin">Fechas de tu viaje </span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {stateContext.value?.desde} <span class="text-semi-bold text-dark-blue"> al </span>{" "}
                                            {stateContext.value?.hasta}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                    <br />
                                  </div>
                                  <hr class="hr-gray" />

                                  <div class="col-6">
                                    <div class="input-group">
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span
                                          class="input-group-text border border-0 align-self-center text-dark-blue"
                                          style={{ paddingLeft: "0px" }}
                                        >
                                          <i class="fa-solid fa-clipboard-check fa-lg" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                        >
                                          <span class="text-tin">Plan </span>
                                          <br />
                                          <span class="text-bold text-light-blue" style={{ fontSize: "0.875rem" }}>
                                            {stateContext.value?.plan.nombreplan}
                                          </span>
                                        </label>
                                      </div>
                                    </div>

                                  
                                    <br />
                                  </div>
                                  <div class="col-6 ps-0">
                                    
                                      
                                    {stateContext.value?.planfamiliar=='t'&&pax.edad<=23?      
                                    <p class="text-bold text-dark-blue text-end" style={{ fontSize: "0.875rem" }}>
                                    Promoción Menor
                                    </p>
                                    :
                                    <h4 class="divisa-plan-sub text-bold text-dark-blue text-end">
                                    {calculateIndividualPrice(pax)}
                                    </h4>
                                    }
                                    
                                  </div>

                                  <br />

                                  {pax.beneficiosadicionalesSeleccionados.length > 0 && (
                                    <>
                                      <hr class="hr-gray"/>
                                      <div class="col-lg-12 col-xs-12">
                                        <div class="input-group">
                                          <p class="label-resume">
                                            <span class="text-tin text-dark-gray ps-0">
                                              Benenficios adicionales
                                            </span>
                                            <br />
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <ul>
                                    {pax.beneficiosadicionalesSeleccionados.map((benefit: any, iBenefit: number) => {
                                      return (
                                        <li
                                          key={iBenefit}
                                          class="text-semi-bold text-blue"
                                          style={{ fontSize: "0.875rem" }}
                                        >
                                          <div class="row" style={{paddingBottom:'5px'}}>
                                          {pax?.beneficiosadicionalesSeleccionados?.length>1&& iBenefit >= 1&&
                                              <hr class="hr-gray"/>
                                          }
                                            <div class="col-lg-7 col-xs-6">{benefit.nombrebeneficioadicional}</div>
                                            <div class="col-lg-5 col-xs-6">
                                              <h4 class="divisa-beneficio text-bold" >
                                                {contextDivisa.divisaUSD == true
                                                  ? CurrencyFormatter(benefit.codigomonedapago, benefit.precio)
                                                  : CurrencyFormatter(
                                                      stateContext.value?.currentRate?.code,
                                                      benefit.precio * stateContext.value?.currentRate?.rate
                                                    )}
                                              </h4>
                                            </div>
                                          </div>
                                          <br/>
                                        </li>
                                      );
                                    })}
               
                                  </ul>
                                
                                </div>

                              </div>
                            </div>
                          </li>
                        );
                      })}                                
          </ul>
          </div>

          <div class="card-footer bg-transparent">
            <div class="row px-3">
                <div class="col-lg-12 text-end">
                  <span class="text-regular text-blue" style={{ padding: 0, margin: 0 }}>
                    Sub total por persona
                  </span>
                  <br />
                  <h4 class="divisa-plan-sub text-bold text-dark-blue">
                    {stateContext.value?.total &&
                      (contextDivisa.divisaUSD == true
                        ? CurrencyFormatter(
                            stateContext.value?.total.divisa,
                            calculateSubTotal()
                          )
                        : CurrencyFormatter(
                            stateContext.value?.currentRate?.code,
                            calculateSubTotal()
                          ))}
                  </h4>
                </div>
              </div>
          </div>

        </div>
      
        

      </div>
      <div class="col-right col-lg-7 col-md-12" >
        <div class="row">
          <div class="col-12" >
          <div id="card-right" class="card">
          <div class="card-body m-2">
              {             
                <Slot />
              }
              <div class="container">
                <div class="row pt-2">
                <div class='col-6 col-xs-12'>
                    {/* {
                      !contextDivisa.divisaUSD &&
                      stateContext.value?.currentRate?.code ==='MXN'&&
                      <>
                      <p class='text-regular text-regular  mb-0'>Transacciones realizadas vía: </p>
                      <ImgOpenpayLogo class='img-fluid' loading="lazy" style={{height:'50px', width:'auto'}} />
                      </>
                      
                    } */}
                  </div>
                  <div class='col-6 col-xs-12 text-end'>
                    <p class='text-regular text-blue mb-0'> {`Total para ${stateContext.value?.pasajeros||''}`}</p>
                    <h3 class='divisa-total text-bold text-blue mb-4'>
                      
                        {
                           stateContext.value?.cupon && stateContext.value?.cupon?.codigocupon&&
                           <>
                           <strike class="precio-strike">
                            {                                                
                              stateContext.value?.total && (contextDivisa.divisaUSD == true ? 
                                CurrencyFormatter(stateContext.value?.total?.divisa, stateContext.value?.subTotal) 
                                : CurrencyFormatter(stateContext.value?.currentRate?.code,stateContext.value?.subTotal * stateContext.value?.currentRate?.rate))
                            }
                            </strike>
                            <br/>
                           </>
                          

                        }
                        {
                           /* totalPay.value.total && (contextDivisa.divisaUSD == true ? CurrencyFormatter(totalPay.value.divisa,totalPay.value.total) :
                            CurrencyFormatter(stateContext.value.currentRate.code,totalPay.value.total * stateContext.value.currentRate.rate)) */
                            stateContext.value?.total && (contextDivisa.divisaUSD == true ? 
                              CurrencyFormatter(stateContext.value?.total?.divisa,stateContext.value?.total?.total) 
                              : CurrencyFormatter(stateContext.value?.currentRate?.code,stateContext.value?.total?.total * stateContext.value?.currentRate?.rate))
                        }
                    </h3>
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
    </div>
  </div>
  );
});
