import { $, component$, useContext, useSignal, useStylesScoped$, useVisibleTask$, Slot } from "@builder.io/qwik";
import { WEBContext } from "~/root";
import { DIVISAContext } from "~/root";
import CurrencyFormatter from "../../../utils/CurrencyFormater";
import styles from "./card-payment-resume.css?inline";
import ImgContinentalAssistPrintTicket from "../../../media/quotes-engine/continental-assist-print-ticket.webp?jsx";
import ImgOpenpayLogo from "../../../media/banks/LogotipoOpenpay.webp?jsx";
export const CardPaymentResume = component$(() => {

  useStylesScoped$(styles);

  const stateContext = useContext(WEBContext);
  const contextDivisa = useContext(DIVISAContext)

  const objectResume: { [key: string]: any } = {};

  const resume = useSignal(objectResume);
  const loading = useSignal(true);
  const indexPax = useSignal(0)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {       
    if (Object.keys(stateContext.value).length > 0) {
      resume.value = stateContext.value;
      loading.value = false;
    }
  });

  function calculateSubTotal() {
    const paxSub :any[] = [];
    resume.value.asegurados.map((pax: any) => 
      {

        const precioBase = pax.edad >= resume?.value?.plan?.edadprecioincremento
        ? resume?.value?.plan?.precioincrementoedad
        : resume?.value?.plan?.precioindividual;

        if (resume.value.total && contextDivisa.divisaUSD == true) {
          paxSub.push(pax.beneficiosadicionales.reduce((sum: number, value: any) => {    
            return sum + value.precio;
          }, 0) + precioBase)

        }else{
          
        paxSub.push(pax.beneficiosadicionales.reduce((sum: number, value: any) => {
          return sum + value.precio;
          }, 0) *stateContext.value?.currentRate?.rate + (precioBase * stateContext.value?.currentRate?.rate))

        }      
      })
    return paxSub[indexPax.value]
  }

  function calculateIndividualPrice(pax:any) {
    //precio se valida edad viajero para calcular el precio 
  const precioBase = pax.edad >= resume?.value?.plan?.edadprecioincremento
    ? resume?.value?.plan?.precioincrementoedad
    : resume?.value?.plan?.precioindividual;

  const formattedPrice = contextDivisa.divisaUSD
    ? CurrencyFormatter(resume?.value?.total?.divisa, precioBase)
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
     
     
      <ImgContinentalAssistPrintTicket
            class="card-img-top"
            title="continental-assist-print-ticket"
            alt="continental-assist-print-ticket"
          />
          
          <div id="card-pax" class="card  mb-3" >           
          <div class="card-body">
           
          <ul class="list-group" id="list-pax">
                    {Object.keys(resume.value).length > 0 &&
                      Array.isArray(resume.value.asegurados) &&
                      resume.value.asegurados.map((pax: any, index: number) => {
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
                                          <i class="fa-solid fa-plane-departure"></i>
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                          
                                        >
                                          <span class="text-tin">Origen / Destino(s)</span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {resume.value.paisorigen}{" "}
                                            <span class="text-semi-bold text-dark-blue"> a </span>{" "}
                                            {resume.value.paisesdestino &&
                                              String(resume.value.paisesdestino).replaceAll(",", ", ")}
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
                                          <i class="fa-solid fa-user-plus" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                        >
                                          <span class="text-tin">Viajeros </span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {resume.value.pasajeros}
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
                                          <i class="far fa-calendar" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray "
                                         
                                        >
                                          <span class="text-tin">Fechas de tu viaje </span> <br />
                                          <span class="text-bold text-dark-blue" style={{ fontSize: "0.875rem" }}>
                                            {resume.value.desde} <span class="text-semi-bold text-dark-blue"> al </span>{" "}
                                            {resume.value.hasta}
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
                                          <i class="fa-solid fa-clipboard-check" />
                                        </span>
                                        <label
                                          class="label-resume text-dark-gray"
                                        >
                                          <span class="text-tin">Plan </span>
                                          <br />
                                          <span class="text-bold text-light-blue" style={{ fontSize: "0.875rem" }}>
                                            {resume.value.plan.nombreplan}
                                          </span>
                                        </label>
                                      </div>
                                    </div>

                                  
                                    <br />
                                  </div>
                                  <div class="col-6 ps-0">
                                    <h4 class="divisa-plan-sub text-bold text-dark-blue text-end">
                                    {calculateIndividualPrice(pax)}
                                    </h4>
                                  </div>

                                  <br />

                                  {pax.beneficiosadicionales.length > 0 && (
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
                                    {pax.beneficiosadicionales.map((benefit: any, iBenefit: number) => {
                                      return (
                                        <li
                                          key={iBenefit}
                                          class="text-semi-bold text-blue"
                                          style={{ fontSize: "0.875rem" }}
                                        >
                                          <div class="row" style={{paddingBottom:'5px'}}>
                                          {pax?.beneficiosadicionales?.length>1&& iBenefit >= 1&&
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
                    Sub total
                  </span>
                  <br />
                  <h4 class="divisa-plan-sub text-bold text-dark-blue">
                    {resume.value.total &&
                      (contextDivisa.divisaUSD == true
                        ? CurrencyFormatter(
                            resume.value.total.divisa,
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
                    {
                      !contextDivisa.divisaUSD &&
                      stateContext.value?.currentRate?.code ==='MXN'&&
                      <>
                      <p class='text-regular text-regular  mb-0'>Transacciones realizadas vía: </p>
                      <ImgOpenpayLogo class='img-fluid' loading="lazy" style={{height:'50px', width:'auto'}} />
                      </>
                      
                    }
                  </div>
                  {/* <div class='col-6 '>
                    {
                      !contextDivisa.divisaUSD &&
                      stateContext.value?.currentRate?.code ==='MXN'&&
                      <>
                      <i class="fas fa-shield-alt fa-lg"></i>
                      <p class='text-regular text-blue mb-0'>Tus pagos se realizan de forma segura <br/> con encriptación de 256 bits </p>
                      </>
                      
                    }
                  </div> */}

                  <div class='col-6 col-xs-12 text-end'>
                    <p class='text-regular text-blue mb-0'>Total</p>
                    <h3 class='divisa-total text-bold text-blue mb-4'>
                        {
                            resume.value.total && (contextDivisa.divisaUSD == true ? CurrencyFormatter(resume.value?.total?.divisa,resume.value?.total?.total) : CurrencyFormatter(stateContext.value?.currentRate?.code,resume?.value?.total?.total * stateContext.value?.currentRate?.rate))
                        }
                    </h3>
                  </div>
                  <div class="col-12 d-flex flex-row">
                    {
                        !contextDivisa.divisaUSD &&
                        stateContext.value?.currentRate?.code ==='MXN'&&
                        <>
                         <i class="fas fa-shield-alt fa-sm  pe-2" style={{color:'green'}}></i>
                         <small class='text-regular text-dark-gray mb-0'>Tus pagos se realizan de forma segura con encriptación de 256 bits. </small>
                        </>
                    }
                 
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
