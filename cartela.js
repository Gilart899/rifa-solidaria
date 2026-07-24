/* ==========================================
   RIFA SOLIDÁRIA
   cartela.js

   Controle da cartela 000 - 999
========================================== */

"use strict";


/* ==========================================
   ELEMENTOS
========================================== */

const gradeCartela =
    document.getElementById("gradeCartela");

const pesquisaNumero =
    document.getElementById("pesquisaNumero");

const modal =
    document.getElementById("modalReserva");

const fecharModal =
    document.getElementById("fecharModal");

const cancelarReserva =
    document.getElementById("cancelarReserva");

const formReserva =
    document.getElementById("formReserva");

const numeroSelecionado =
    document.getElementById("numeroSelecionado");


/* ==========================================
   VARIÁVEIS
========================================== */

let numeroAtual = null;

let listaNumeros = [];

let reservas = [];


/* ==========================================
   GERAR NÚMEROS
========================================== */

function gerarNumeros(){

    if(!gradeCartela) return;


    gradeCartela.innerHTML = "";


    const inicio =
        CONFIG.numeros.inicio;


    const fim =
        CONFIG.numeros.fim;


    for(
        let numero = inicio;
        numero <= fim;
        numero++
    ){

        const numeroFormatado =
            String(numero)
            .padStart(3,"0");


        const botao =
            document.createElement("button");


        botao.className =
            "numero disponivel";


        botao.textContent =
            numeroFormatado;


        botao.dataset.numero =
            numero;


        botao.setAttribute(
            "aria-label",
            `Número ${numeroFormatado}`
        );


        botao.addEventListener(
            "click",
            ()=>{

                selecionarNumero(numero);

            }
        );


        gradeCartela.appendChild(botao);


        listaNumeros.push({

            numero,

            elemento:botao

        });

    }

}


/* ==========================================
   ATUALIZAR STATUS
========================================== */

function atualizarStatus(){

    listaNumeros.forEach(item=>{


        const encontrado =
            reservas.find(
                reserva =>
                Number(reserva.numero)
                === item.numero
            );


        item.elemento.classList.remove(
            "disponivel",
            "reservado",
            "pago"
        );


        if(!encontrado){

            item.elemento.classList.add(
                "disponivel"
            );


            item.elemento.disabled =
                false;


            return;

        }


        if(
            encontrado.status
            === "pago"
        ){

            item.elemento.classList.add(
                "pago"
            );


        }else{


            item.elemento.classList.add(
                "reservado"
            );


        }


        item.elemento.disabled =
            true;


    });

}
/* ==========================================
   FIREBASE - MONITORAMENTO
========================================== */

function iniciarMonitoramento(){

    if(
        typeof reservasRef === "undefined"
    ){

        console.error(
            "Firebase não inicializado."
        );

        return;

    }


    reservasRef.on(
        "value",
        (snapshot)=>{


            reservas = [];


            snapshot.forEach(
                item=>{


                    const dados =
                        item.val();


                    if(dados){

                        reservas.push({

                            id:item.key,

                            ...dados

                        });

                    }


                }
            );


            atualizarStatus();


        }
    );


}


/* ==========================================
   SELECIONAR NÚMERO
========================================== */

function selecionarNumero(numero){


    const existe =
        reservas.find(
            item =>
            Number(item.numero)
            === Number(numero)
        );


    if(existe){

        return;

    }


    numeroAtual =
        numero;


    numeroSelecionado.textContent =
        String(numero)
        .padStart(3,"0");


    abrirModal();


}


/* ==========================================
   MODAL
========================================== */

function abrirModal(){

    if(!modal) return;


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    const campoNome =
        document.getElementById("nome");


    if(campoNome){

        setTimeout(
            ()=>{

                campoNome.focus();

            },
            200
        );

    }

}


function fecharModalReserva(){

    if(!modal) return;


    modal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";


    formReserva.reset();


    numeroAtual =
        null;

}


/* ==========================================
   EVENTOS MODAL
========================================== */


if(fecharModal){

    fecharModal.addEventListener(
        "click",
        fecharModalReserva
    );

}


if(cancelarReserva){

    cancelarReserva.addEventListener(
        "click",
        fecharModalReserva
    );

}


if(modal){

    modal.addEventListener(
        "click",
        (evento)=>{


            if(
                evento.target
                === modal
            ){

                fecharModalReserva();

            }


        }
    );

}
/* ==========================================
   SALVAR RESERVA
========================================== */

if(formReserva){

    formReserva.addEventListener(
        "submit",
        async (evento)=>{


            evento.preventDefault();


            if(
                numeroAtual === null
            ){

                return;

            }


            const nome =
                document
                .getElementById("nome")
                .value
                .trim();


            const telefone =
                document
                .getElementById("telefone")
                .value
                .trim();


            const cidade =
                document
                .getElementById("cidade")
                .value
                .trim();


            const pagamento =
                document
                .getElementById("pagamento")
                .value;



            if(
                !nome ||
                !telefone
            ){

                alert(
                    "Preencha nome e telefone."
                );

                return;

            }



            const jaReservado =
                reservas.some(
                    item =>
                    Number(item.numero)
                    === Number(numeroAtual)
                );


            if(jaReservado){

                alert(
                    "Este número já foi escolhido."
                );


                fecharModalReserva();


                return;

            }



            const dados = {


                numero:

                    String(numeroAtual)
                    .padStart(3,"0"),


                nome,


                telefone,


                cidade,


                pagamento,


                status:
                    "reservado",


                data:
                    Date.now()


            };



            try{


                await salvarReserva(dados);



                alert(
                    "✅ Número reservado com sucesso!"
                );



                fecharModalReserva();



            }catch(erro){


                console.error(
                    "Erro ao salvar:",
                    erro
                );


                alert(
                    "❌ Erro ao reservar número."
                );


            }



        }
    );

}


/* ==========================================
   PESQUISA RÁPIDA
========================================== */

if(pesquisaNumero){


    pesquisaNumero.addEventListener(
        "input",
        ()=>{


            const valor =
                pesquisaNumero.value;


            listaNumeros.forEach(
                item=>{


                    const numero =
                        String(item.numero);


                    if(
                        valor === ""
                        ||
                        numero
                        .startsWith(valor)
                    ){


                        item.elemento.style
                        .display =
                        "block";


                    }else{


                        item.elemento.style
                        .display =
                        "none";


                    }


                }
            );


        }
    );


}


/* ==========================================
   FORMATAR TELEFONE
========================================== */

const telefoneInput =
    document.getElementById("telefone");


if(telefoneInput){


    telefoneInput.addEventListener(
        "input",
        ()=>{


            let valor =
                telefoneInput.value
                .replace(/\D/g,"");


            if(valor.length > 11){

                valor =
                valor.substring(0,11);

            }


            telefoneInput.value =
                valor;


        }
    );


}
/* ==========================================
   INICIALIZAÇÃO DA CARTELA
========================================== */

function iniciarCartela(){


    gerarNumeros();


    iniciarMonitoramento();


    console.log(
        "✅ Cartela carregada."
    );


}


/* ==========================================
   TECLADO - ESC FECHA MODAL
========================================== */

document.addEventListener(
    "keydown",
    (evento)=>{


        if(
            evento.key === "Escape"
            &&
            modal
            &&
            !modal.classList.contains("hidden")
        ){

            fecharModalReserva();

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
            )
            .catch(
                erro=>{

                    console.error(
                        "Erro PWA:",
                        erro
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
    ()=>{

        iniciarCartela();

    }
);


/* ==========================================
   ERROS GERAIS
========================================== */

window.addEventListener(
    "error",
    (evento)=>{


        console.error(
            "Erro:",
            evento.error
            ||
            evento.message
        );


    }
);


/* ==========================================
   FIM cartela.js
========================================== */
