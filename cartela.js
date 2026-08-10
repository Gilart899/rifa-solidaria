// ============================================================
// 🎟️ CARTELAS — RIFA SOLIDÁRIA
// 10 cartelas × 100 números
// ============================================================

import {
    database,
    ref,
    onValue
} from "./firebase.js";

import {
    CONFIG
} from "./config.js";


// ============================================================
// ⚙️ CONFIGURAÇÕES
// ============================================================

const TOTAL_CARTELAS =
    CONFIG.quantidadeCartelas;

const NUMEROS_POR_CARTELA =
    CONFIG.numerosPorCartela;


// ============================================================
// 📦 ESTADO
// ============================================================

let cartelaAtual = 0;

let numerosFirebase = {};


// ============================================================
// 🔢 FORMATAR NÚMERO
// ============================================================

function formatarNumero(numero) {

    return String(numero)
        .padStart(3, "0");

}


// ============================================================
// 🎯 DESCOBRIR CARTELA PELO NÚMERO
// ============================================================

export function descobrirCartela(numero) {

    numero = Number(numero);


    if (
        Number.isNaN(numero) ||
        numero < 0 ||
        numero > 999
    ) {

        return null;

    }


    return Math.floor(
        numero / NUMEROS_POR_CARTELA
    );

}


// ============================================================
// 📍 MOSTRAR CARTELA
// ============================================================

export function irParaCartela(indice) {

    if (
        indice < 0 ||
        indice >= TOTAL_CARTELAS
    ) {

        return;

    }


    cartelaAtual = indice;


    renderizarCartela();

    atualizarNavegacao();

}


// ============================================================
// ⬅️ CARTELA ANTERIOR
// ============================================================

export function cartelaAnterior() {

    if (cartelaAtual > 0) {

        irParaCartela(
            cartelaAtual - 1
        );

    }

}


// ============================================================
// ➡️ PRÓXIMA CARTELA
// ============================================================

export function proximaCartela() {

    if (
        cartelaAtual <
        TOTAL_CARTELAS - 1
    ) {

        irParaCartela(
            cartelaAtual + 1
        );

    }

}


// ============================================================
// 🎟️ RENDERIZAR CARTELA
// ============================================================

function renderizarCartela() {

    const container =
        document.getElementById(
            "cartelaNumeros"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const inicio =
        cartelaAtual *
        NUMEROS_POR_CARTELA;


    const fim =
        inicio +
        NUMEROS_POR_CARTELA;


    for (
        let numero = inicio;
        numero < fim;
        numero++
    ) {

        const numeroFormatado =
            formatarNumero(numero);


        const dados =
            numerosFirebase[
                numeroFormatado
            ] || {};


        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.className =
            "numero-rifa";


        botao.dataset.numero =
            numeroFormatado;


        botao.textContent =
            numeroFormatado;


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        const status =
            dados.status ||
            "disponivel";


        botao.classList.add(
            status
        );


        // ----------------------------------------------------
        // NÚMERO RESERVADO/VENDIDO
        // ----------------------------------------------------

        if (
            status === "reservado" ||
            status === "vendido"
        ) {

            botao.disabled =
                true;

        }


        // ----------------------------------------------------
        // CLIQUE
        // ----------------------------------------------------

        botao.addEventListener(
            "click",
            () => {

                selecionarNumero(
                    numeroFormatado,
                    botao
                );

            }
        );


        container.appendChild(
            botao
        );

    }


    atualizarTituloCartela();

}


// ============================================================
// 🏷️ TÍTULO DA CARTELA
// ============================================================

function atualizarTituloCartela() {

    const titulo =
        document.getElementById(
            "numeroCartela"
        );


    if (!titulo) {

        return;

    }


    titulo.textContent =
        `CARTELA ${cartelaAtual + 1}`;


    const intervalo =
        document.getElementById(
            "intervaloCartela"
        );


    if (intervalo) {

        const inicio =
            cartelaAtual *
            NUMEROS_POR_CARTELA;


        const fim =
            inicio +
            NUMEROS_POR_CARTELA -
            1;


        intervalo.textContent =
            `${formatarNumero(inicio)} — ${formatarNumero(fim)}`;

    }

}


// ============================================================
// 🧭 ATUALIZAR NAVEGAÇÃO
// ============================================================

function atualizarNavegacao() {

    const anterior =
        document.getElementById(
            "btnCartelaAnterior"
        );


    const proxima =
        document.getElementById(
            "btnProximaCartela"
        );


    if (anterior) {

        anterior.disabled =
            cartelaAtual === 0;

    }


    if (proxima) {

        proxima.disabled =
            cartelaAtual ===
            TOTAL_CARTELAS - 1;

    }


    const indicador =
        document.getElementById(
            "indicadorCartela"
        );


    if (indicador) {

        indicador.textContent =
            `${cartelaAtual + 1} / ${TOTAL_CARTELAS}`;

    }

}


// ============================================================
// 🎯 SELECIONAR NÚMERO
// ============================================================

function selecionarNumero(
    numero,
    elemento
) {

    const evento =
        new CustomEvent(
            "numeroSelecionado",
            {
                detail: {
                    numero,
                    elemento
                }
            }
        );


    document.dispatchEvent(
        evento
    );


    elemento.classList.toggle(
        "selecionado"
    );

}


// ============================================================
// 🔍 IR PARA UM NÚMERO
// ============================================================

export function irParaNumero(
    numero
) {

    numero =
        Number(numero);


    const cartela =
        descobrirCartela(
            numero
        );


    if (
        cartela === null
    ) {

        return false;

    }


    irParaCartela(
        cartela
    );


    setTimeout(
        () => {

            const numeroFormatado =
                formatarNumero(
                    numero
                );


            const elemento =
                document.querySelector(
                    `.numero-rifa[data-numero="${numeroFormatado}"]`
                );


            if (!elemento) {

                return;

            }


            elemento.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            });


            elemento.classList.add(
                "numero-destaque"
            );


            setTimeout(
                () => {

                    elemento.classList.remove(
                        "numero-destaque"
                    );

                },
                1800
            );


        },
        100
    );


    return true;

}


// ============================================================
// 👆 TOUCH / DESLIZAR
// ============================================================

function ativarSwipe() {

    const area =
        document.getElementById(
            "cartelaSwipe"
        );


    if (!area) {

        return;

    }


    let inicioX = 0;

    let inicioY = 0;


    area.addEventListener(
        "touchstart",
        evento => {

            const toque =
                evento.touches[0];


            inicioX =
                toque.clientX;

            inicioY =
                toque.clientY;

        },
        {
            passive: true
        }
    );


    area.addEventListener(
        "touchend",
        evento => {

            const toque =
                evento.changedTouches[0];


            const fimX =
                toque.clientX;

            const fimY =
                toque.clientY;


            const diferencaX =
                fimX - inicioX;


            const diferencaY =
                fimY - inicioY;


            // Ignorar movimento predominantemente vertical

            if (
                Math.abs(diferencaX) <
                Math.abs(diferencaY)
            ) {

                return;

            }


            // Movimento pequeno não conta

            if (
                Math.abs(diferencaX) <
                50
            ) {

                return;

            }


            if (
                diferencaX < 0
            ) {

                proximaCartela();

            }
            else {

                cartelaAnterior();

            }

        },
        {
            passive: true
        }
    );

}


// ============================================================
// 🔥 OUVIR FIREBASE
// ============================================================

function observarNumeros() {

    const referencia =
        ref(
            database,
            "rifa/numeros"
        );


    onValue(
        referencia,
        snapshot => {

            if (
                snapshot.exists()
            ) {

                numerosFirebase =
                    snapshot.val();

            }
            else {

                numerosFirebase =
                    {};

            }


            renderizarCartela();

            atualizarNavegacao();

        },

        erro => {

            console.error(
                "Erro ao carregar números:",
                erro
            );

        }
    );

}


// ============================================================
// 🚀 INICIALIZAÇÃO
// ============================================================

export function iniciarCartelas() {

    renderizarCartela();

    atualizarNavegacao();

    ativarSwipe();

    observarNumeros();

}


// ============================================================
// ▶️ EXECUTAR QUANDO A PÁGINA ESTIVER PRONTA
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCartelas
    );

}
else {

    iniciarCartelas();

}
