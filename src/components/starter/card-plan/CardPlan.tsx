import { $, Slot, component$, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './card-plan.css?inline'

export interface propsCardPlan {
    [key:string]:any,
}

export const CardPlan = component$((props:propsCardPlan) => {
    useStylesScoped$(styles)
    
    const benefits = useSignal([])

    useTask$(() => {
        benefits.value = props.benefits
    })

    useVisibleTask$(() => {
        benefits.value = props.benefits
    })

    const toggleModal$ = $((id:string) => {
        const bs = (window as any)['bootstrap']
        const modal = new bs.Modal('#modalBenefits'+id,{})
        const modalElement = document.querySelector('#modalBenefits'+id) as HTMLDialogElement

        if(((modalElement.parentElement as HTMLDivElement).parentElement as HTMLDivElement).classList[2] != 'not-mobile')
        {
            const carousel = bs.Carousel.getInstance('#carouselPlans',{})

            carousel.dispose()

            modalElement.addEventListener('hidden.bs.modal', function () {
                const carousel = new bs.Carousel('#carouselPlans',{})
                carousel.cycle()
            });
        }
        
        modal.show();

        (window as any)['dataLayer'].push({
            'event': 'TrackEventGA4',
            'category': 'interacciones usuario',
            'action': 'clic',
            'label': 'Ver mas',
            'option': id,
            'page': 'Home',
            'cta': 'Ver mas'
        });
    }) 

    return(
        <>
            <div class='card text-center shadow-lg'>
                <div class='card-body'>
                    <div class='card-img'>
                        <Slot/>
                    </div>
                    <h2 class="h1 text-semi-bold text-light-blue">{props.title}</h2>
                    <p class="card-text fs-5 text-dark-gray mb-4">{props.description}</p>
                    <button type='button' class='btn-link text-regular text-light-blue mb-2' onClick$={() => {toggleModal$(props.id)}}>Ver más</button> 
                    <p class="card-text-footer text-bold text-dark-blue">{props.footer}</p>
                </div>
                <button class="btn btn-outline-primary btn-lg text-semi-bold" disabled>{props.btnLabel}</button>
            </div>
            <div id={'modalBenefits'+props.id} class="modal fade">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <Slot/>
                            <h2 class='text-semi-bold text-white p-3'>
                                {props.title}
                            </h2>
                        </div>
                        <div class="modal-body">
                            <table class='table table-borderless table-striped'>
                                <tbody>
                                    {
                                        benefits.value
                                        &&
                                        benefits.value.map((benefit:any,iBenefit:number) => {
                                            return(
                                                <>
                                                    <tr key={iBenefit+1}>
                                                        <td class='tr-title text-semi-bold text-dark-blue' colSpan={2}>{benefit.nombrefamilia}</td>
                                                    </tr>
                                                    {
                                                        benefit.beneficios.map((item:any,iItem:number) => {
                                                            return(
                                                                
                                                                <tr key={(iBenefit+1)+(iItem+1)}>
                                                                      <td class='td-beneficio text-blue'>{item.nombrebeneficio}</td>
                                                                      <td class='td-cobertura text-blue text-start'><span >{item.cobertura}</span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})