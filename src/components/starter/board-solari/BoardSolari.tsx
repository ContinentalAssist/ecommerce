import { $, Fragment, component$, useSignal, useStylesScoped$, useTask$, useOnWindow } from "@builder.io/qwik"
import { useLocation } from '@builder.io/qwik-city'
import styles from './board-solari.css?inline'

interface propsBoardSolari {
    [key:string] : any
}

export const BoardSolari = component$((props:propsBoardSolari) => {
    useStylesScoped$(styles)

    const word = useSignal(props.words[0])
    const wordPosition = useSignal(1)
    const location = useLocation()

    useTask$(({ track }) => {
        track(() => {
            wordPosition.value
        })
    })


    const randomRotation$ = $(() => {
        const rotationClass = Math.random() < 0.5 ? 'rotate-180' : 'rotate';
        return rotationClass;
    })

    const fadeDescription$ = $(() => {
        const panels = document.querySelector('#panels-'+props.id) as HTMLDivElement
        const description = document.querySelector('#description-'+props.id) as HTMLHeadingElement

        const prevPosition = props.words[wordPosition.value - 1].position

        if(word.value.position == 'bottom')
        {
            if(prevPosition == 'top' &&'classList' in panels)
            {
                panels.classList.add('panel-fade-in-bottom')

                setTimeout(() => {
                    panels.classList.remove('panel-fade-in-bottom')
                },600)
            }

            if (description) {
                description.classList?.add('fade-in-top')

            setTimeout(() => {
                description.classList.remove('fade-in-top')
            },600)
            }
           

            
        }
        else
        {
            if (description) {
                description.classList.add('fade-in-bottom')

                setTimeout(() => {
                    description.classList.remove('fade-in-bottom')
                },600)
            }
          
            
            if(prevPosition == 'bottom' && 'classList' in panels)
            {
                panels.classList.add('panel-fade-in-top')

                setTimeout(() => {
                    panels.classList.remove('panel-fade-in-top')
                },600)
            }
        }
    })

    const boardSolari$ = $(() => {
        
            const panels = Array.from(document.querySelectorAll('.panel'))
            const topPanels = Array.from(document.querySelectorAll('.top-panel'))
            const bottomPanels = Array.from(document.querySelectorAll('.bottom-panel'))
            const backPanels = Array.from(document.querySelectorAll('.back-panel'))
    
            panels.map(async(panel,index) => {
                const rotationClass = await randomRotation$();
    
                (topPanels[index] as HTMLDivElement).classList.add(rotationClass);
                (bottomPanels[index] as HTMLDivElement).classList.remove(rotationClass);
                (bottomPanels[index] as HTMLDivElement).style.zIndex = '20';
                
                setTimeout(() => {
                    (backPanels[index] as HTMLDivElement).style.zIndex = '20';
                },300)
    
                setTimeout(() => {
                    (topPanels[index] as HTMLDivElement).classList.remove(rotationClass);
                    (bottomPanels[index] as HTMLDivElement).classList.add(rotationClass);
    
                    setTimeout(() => {
                        (backPanels[index] as HTMLDivElement).style.zIndex = '0';
                    },300)
    
                    setTimeout(() => {
                        (bottomPanels[index] as HTMLDivElement).style.zIndex = '10'
                    },600)
                },600)
            })
    
            setTimeout(() => {
                if(wordPosition.value < props.words.length)
                {
                    word.value = props.words[wordPosition.value]
                    fadeDescription$()
                    wordPosition.value = wordPosition.value+1
                }
                else
                {
                    word.value = props.words[0]
                    fadeDescription$()
                    wordPosition.value = 1
                }
            },900)
      
    })

    useOnWindow(
        'load',
        $(() => {
            const intervalId = setInterval(() => {
                if (location.url.pathname === '/') {
                    boardSolari$()
                }
            }, 6000)
    
            return () => {
                clearInterval(intervalId)
            }
        })
      );


    return(
        <div id={'board-solari-'+props.id} class='w-100' onClick$={()=>{boardSolari$()}}>
            {
                word.value.position == 'top'
                &&
                <h3 id={'description-'+props.id} class='description text-semi-bold text-white mb-4'>{word.value.description}</h3>
            }
            {
                props.mobile == undefined
                ?
                <div id={'panels-'+props.id} class='panels'>
                    {
                        word.value.panel.split('').map((word:any,index:number) => {
                            return(
                                <Fragment key={index}>
                                    <div class="back-panel"></div>
                                    <div class="bottom-panel"></div>
                                    <div class="top-panel"></div>
                                    {
                                        word == '+' || word == 'M' || word == 'K' || word == '.'
                                        ?
                                        <div class="panel text-light-blue">{word}</div>
                                        :
                                        <div class="panel">{word}</div>
                                    }
                                </Fragment>
                            )
                        })
                    }
                </div>
                :
                <div id={'panels-'+props.id} class='panels'>
                    {
                        word.value.panel[0].split('').map((word:any,index:number) => {
                            return(
                                <Fragment key={'0'+index}>
                                    <div class="back-panel"></div>
                                    <div class="bottom-panel"></div>
                                    <div class="top-panel"></div>
                                    {
                                        word == '+' || word == 'M' || word == 'K' || word == '.'
                                        ?
                                        <div class="panel text-light-blue">{word}</div>
                                        :
                                        <div class="panel">{word}</div>
                                    }
                                </Fragment>
                            )
                        })
                    }
                    <br/>
                    <br/>
                    {
                        
                        word.value.panel[1].split('').map((word:any,index:number) => {
                            return(
                                <Fragment key={'1'+index}>
                                    <div class="back-panel"></div>
                                    <div class="bottom-panel"></div>
                                    <div class="top-panel"></div>
                                    {
                                        word == '+' || word == 'M' || word == 'K' || word == '.'
                                        ?
                                        <div class="panel text-light-blue">{word}</div>
                                        :
                                        <div class="panel">{word}</div>
                                    }
                                </Fragment>
                            )
                        })
                    }
                </div>
            }
            {
                word.value.position == 'bottom'
                &&
                <h3 id={'description-'+props.id} class='description text-semi-bold text-white mt-4'>{word.value.description}</h3>
            }
        </div>
    )
})