/* ==========================================
   RIFA SOLIDÁRIA
   raspadinha.js

   Sistema de raspagem Canvas
========================================== */

"use strict";



/* ==========================================
   ELEMENTOS
========================================== */


const canvas =
    document.getElementById(
        "canvasRaspadinha"
    );


const ctx =
    canvas
    ?
    canvas.getContext("2d")
    :
    null;



const premioResultado =
    document.getElementById(
        "premioResultado"
    );


const mensagemPremio =
    document.getElementById(
        "mensagemPremio"
    );


const iniciarBotao =
    document.getElementById(
        "iniciarRaspagem"
    );


const voltarInicio =
    document.getElementById(
        "voltarInicio"
    );


const areaConfetes =
    document.getElementById(
        "confetes"
    );



/* ==========================================
   VARIÁVEIS
========================================== */


let raspando = false;


let iniciado = false;


let porcentagemRaspada = 0;


let vencedor = false;



/* ==========================================
   CONFIGURAÇÃO CANVAS
========================================== */


function ajustarCanvas(){


    if(!canvas)
        return;



    const largura =
        canvas.clientWidth;



    const altura =
        canvas.clientHeight;



    canvas.width =
        largura *
        window.devicePixelRatio;



    canvas.height =
        altura *
        window.devicePixelRatio;



    ctx.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
    );


}



/* ==========================================
   CRIAR COBERTURA
========================================== */


function criarCobertura(){


    if(!ctx)
        return;



    ctx.globalCompositeOperation =
        "source-over";



    ctx.fillStyle =
        "#94a3b8";



    ctx.fillRect(

        0,

        0,

        canvas.clientWidth,

        canvas.clientHeight

    );



    ctx.fillStyle =
        "white";



    ctx.font =
        "bold 28px Arial";



    ctx.textAlign =
        "center";



    ctx.fillText(

        "RASPE AQUI",

        canvas.clientWidth / 2,

        canvas.clientHeight / 2

    );


}



/* ==========================================
   PREPARAR PRÊMIO
========================================== */


function carregarPremio(){


    if(!CONFIG.raspadinha)
        return;



    const premio =

        CONFIG.raspadinha.premio;



    premioResultado.textContent =

        premio;



}
/* ==========================================
   INICIAR RASPAGEM
========================================== */


function iniciarRaspadinha(){


    if(iniciado)
        return;



    iniciado = true;


    porcentagemRaspada = 0;


    criarCobertura();



}



/* ==========================================
   RASPAR CANVAS
========================================== */


function raspar(x,y){


    if(!ctx || !iniciado)
        return;



    ctx.globalCompositeOperation =
        "destination-out";



    ctx.beginPath();



    ctx.arc(

        x,

        y,

        25,

        0,

        Math.PI * 2

    );



    ctx.fill();



    calcularRaspagem();



}



/* ==========================================
   CALCULAR ÁREA REVELADA
========================================== */


function calcularRaspagem(){


    if(!ctx)
        return;



    const dados =

        ctx.getImageData(

            0,

            0,

            canvas.width,

            canvas.height

        ).data;



    let transparentes = 0;



    for(
        let i = 3;
        i < dados.length;
        i += 4
    ){


        if(
            dados[i] === 0
        ){

            transparentes++;

        }


    }



    porcentagemRaspada =

        (
            transparentes /
            (dados.length / 4)
        )
        *
        100;



    if(
        porcentagemRaspada >= 55
    ){

        revelarPremio();

    }


}



/* ==========================================
   EVENTOS MOUSE
========================================== */


if(canvas){


canvas.addEventListener(
    "mousedown",
    ()=>{

        raspando = true;

    }
);



canvas.addEventListener(
    "mouseup",
    ()=>{

        raspando = false;

    }
);



canvas.addEventListener(
    "mouseleave",
    ()=>{

        raspando = false;

    }
);



canvas.addEventListener(
    "mousemove",
    (evento)=>{


        if(!raspando)
            return;



        const rect =
            canvas
            .getBoundingClientRect();



        raspar(

            evento.clientX -
            rect.left,

            evento.clientY -
            rect.top

        );


    }
);


}
/* ==========================================
   EVENTOS TOUCH (CELULAR)
========================================== */


if(canvas){


canvas.addEventListener(
    "touchstart",
    (evento)=>{


        raspando = true;


        evento.preventDefault();


    },
    {
        passive:false
    }
);



canvas.addEventListener(
    "touchend",
    ()=>{


        raspando = false;


    }
);



canvas.addEventListener(
    "touchmove",
    (evento)=>{


        if(!raspando)
            return;



        const toque =
            evento.touches[0];



        const rect =
            canvas
            .getBoundingClientRect();



        raspar(

            toque.clientX -
            rect.left,

            toque.clientY -
            rect.top

        );



        evento.preventDefault();


    },
    {
        passive:false
    }
);


}



/* ==========================================
   REVELAR PRÊMIO
========================================== */


function revelarPremio(){


    if(vencedor)
        return;



    vencedor = true;



    const premio =

        CONFIG.raspadinha.premio;



    mensagemPremio.textContent =

        `🎉 Parabéns! Você ganhou: ${premio}`;



    mensagemPremio.classList.add(
        "sucesso"
    );



    premioResultado.classList.add(
        "premio-vencedor"
    );



    criarConfetes();



    tocarSom();



}



/* ==========================================
   CONFETES
========================================== */


function criarConfetes(){


    if(!areaConfetes)
        return;



    for(
        let i = 0;
        i < 80;
        i++
    ){


        const confete =
            document.createElement(
                "span"
            );



        confete.className =
            "confete";



        confete.style.left =

            Math.random() *
            100 +
            "%";



        confete.style.animationDelay =

            Math.random()
            *
            1.5 +
            "s";



        areaConfetes.appendChild(
            confete
        );



        setTimeout(
            ()=>{

                confete.remove();

            },

            4000

        );


    }


}



/* ==========================================
   SOM
========================================== */


function tocarSom(){


    if(
        !CONFIG.sons ||
        !CONFIG.sons.vitoria
    ){

        return;

    }



    const audio =

        new Audio(
            CONFIG.sons.vitoria
        );



    audio.volume =
        0.5;



    audio.play()
    .catch(
        ()=>{}
    );


}
/* ==========================================
   BOTÃO INICIAR
========================================== */


if(iniciarBotao){


    iniciarBotao.addEventListener(
        "click",
        ()=>{


            iniciarRaspadinha();



        }
    );


}



/* ==========================================
   VOLTAR PARA INÍCIO
========================================== */


if(voltarInicio){


    voltarInicio.addEventListener(
        "click",
        ()=>{


            window.location.href =
                "index.html";


        }
    );


}



/* ==========================================
   INICIALIZAÇÃO
========================================== */


function iniciarPagina(){


    ajustarCanvas();


    carregarPremio();


    criarCobertura();


    console.log(
        "✅ Raspadinha carregada."
    );


}



/* ==========================================
   AJUSTE DE TELA
========================================== */


window.addEventListener(
    "resize",
    ()=>{


        if(!iniciado){

            ajustarCanvas();

            criarCobertura();

        }


    }
);





/* ==========================================
   SERVICE WORKER
========================================== */


if(
    "serviceWorker"
    in navigator
){


    window.addEventListener(
        "load",
        ()=>{


            navigator.serviceWorker
            .register(
                "sw.js"
            )
            .then(
                ()=>{


                    console.log(
                        "✅ PWA ativa."
                    );


                }
            );


        }
    );


}



/* ==========================================
   CARREGAMENTO
========================================== */


window.addEventListener(
    "load",
    iniciarPagina
);




/* ==========================================
   ERROS
========================================== */


window.addEventListener(
    "error",
    (evento)=>{


        console.error(

            "Erro raspadinha:",

            evento.error ||
            evento.message

        );


    }
);



/* ==========================================
   FIM raspadinha.js
========================================== */

