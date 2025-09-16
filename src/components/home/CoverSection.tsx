import { $, component$ } from '@builder.io/qwik';

export const CoverSection = component$(() => {
  return (
      <div class="content-cover py-1 py-sm-5">
          <div class="row justify-content-center">
              {/* Título principal */}
              <div class="col-lg-4 text-center mb-4 flex-column justify-content-center items-center d-flex">
                  <h1 class="section-title">
                      Conoce algunas de nuestras <span class="highlight">coberturas especiales</span>
                  </h1>
                  <button
                      onClick$={() => {
                          const el = document.getElementById('container-quote');
                          el?.scrollIntoView({behavior: 'smooth'});
                      }}
                      class="btn qs-button d-none d-sm-block">Cotizar
                  </button>
              </div>

              {/* Coberturas */}
              <div class="col-lg-8">
                  <div class="row">
                      {/* Blue Access */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/creation-outline.png"
                                   alt="blue-acces"/>
                              <div>
                                  <h4 class="coverage-title">Blue Access</h4>
                                  <p class="coverage-description">Accede más de 1.600 salas VIP en el mundo si tu
                                      vuelo se demora.</p>
                              </div>
                          </div>
                      </div>

                      {/* Cese de operaciones de aerolínea */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/clock-fast.png"
                                   alt="operacion"/>
                              <div>
                                  <h4 class="coverage-title">Cese de operaciones de aerolínea</h4>
                                  <p class="coverage-description">Vuelve a casa si tu vuelo se cancela.</p>
                              </div>
                          </div>
                      </div>

                      {/* Teleconsulta médica */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/cellphone-text.png"
                                   alt="telemedicina"/>
                              <div>
                                  <h4 class="coverage-title">Teleconsulta médica pre y post viaje</h4>
                                  <p class="coverage-description">Asistencia médica antes, durante y después de tu
                                      viaje.</p>
                              </div>
                          </div>
                      </div>

                      {/* Repatriación administrativa */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/account-convert.png" alt="telemedicina"/>
                              <div>
                                  <h4 class="coverage-title">Repatriación administrativa</h4>
                                  <p class="coverage-description">Te respaldamos si tienes imprevistos
                                      migratorios.</p>
                              </div>
                          </div>
                      </div>

                      {/* Conferencia con médico */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/medical-bag.png"
                                   alt="telemedicina"/>
                              <div>
                                  <h4 class="coverage-title">Conferencia con médico de cabecera en país de
                                      origen</h4>
                                  <p class="coverage-description">Habla con tu médico de cabecera desde el
                                      exterior.</p>
                              </div>
                          </div>
                      </div>

                      {/* Compra protegida */}
                      <div class="col-md-6 cover-pading">
                          <div class="coverage-item">
                              <img src="https://cabiometrics.nyc3.cdn.digitaloceanspaces.com/file-alert-outline.png" alt="telemedicina"/>
                              <div>
                                  <h4 class="coverage-title">Compra protegida</h4>
                                  <p class="coverage-description">Robo cubierto por compras tecnológicas en el
                                      exterior.</p>
                              </div>
                          </div>
                      </div>
                      <button
                          onClick$={() => {
                              const el = document.getElementById('container-quote');
                              el?.scrollIntoView({behavior: 'smooth'});
                          }}
                          class="btn qs-button d-block d-sm-none mb-4" >Cotizar
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );
});

