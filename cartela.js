// ==========================================================
// cartela.js
// Rifa Solidária
// Controle das 10 Cartelas (000–999)
// ==========================================================

import { CONFIG } from "./config.js";

import {

    numerosRef,
    onValue

} from "./firebase.js";

import {

    formatarNumero,
    obterCartela

} from "./utils.js";

// ==========================================================
// ESTADO
// ==========================================================

const CARTELAS = [];

const STATUS = {};

let cartelaAtual = 1;

// ==========================================================
// INICIAR
// ==========================================================

window.addEventListener("load", () => {

    criarCartelas();

    carregarFirebase();

    registrarEventos();

});

// ==========================================================
// GERAR CARTELAS
// ==========================================================

function criarCartelas() {

    const container = document.getElementById("containerCartelas");

    if (!container) return;

    container.innerHTML = "";

    for (let c = 1; c <= 10; c++) {

        const cartela = document.createElement("section");

        cartela.className = "cartela";

        cartela.dataset.cartela = c;

        if (c !== 1) {

            cartela.style.display = "none";

        }

        const titulo = document.createElement("h2");

        titulo.textContent = `Cartela ${c}`;

        cartela.appendChild(titulo);

        const grade = document.createElement("div");

        grade.className = "gradeCartela";

        const inicio = (c - 1) * 100;

        const fim = inicio + 99;

        for (let numero = inicio; numero <= fim; numero++) {

            const botao = document.createElement("button");

            const texto = formatarNumero(numero);

            botao.textContent = texto;

            botao.dataset.numero = texto;

            botao.className = "numero disponivel";

            botao.addEventListener(

                "click",

                clicarNumero

            );

            grade.appendChild(botao);

        }

        cartela.appendChild(grade);

        container.appendChild(cartela);

        CARTELAS.push(cartela);

    }

}// ==========================================================
// FIREBASE
// ==========================================================

function carregarFirebase() {

    onValue(numerosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        Object.assign(STATUS, snapshot.val());

        atualizarNumeros();

    });

}

// ==========================================================
// ATUALIZA CORES DOS NÚMEROS
// ==========================================================

function atualizarNumeros() {

    document
        .querySelectorAll(".numero")
        .forEach((botao) => {

            const numero = botao.dataset.numero;

            const dados = STATUS[numero];

            if (!dados) return;

            botao.classList.remove(

                "disponivel",
                "reservado",
                "vendido",
                "selecionado"

            );

            switch (dados.status) {

                case "vendido":

                    botao.classList.add("vendido");

                    break;

                case "reservado":

                    botao.classList.add("reservado");

                    break;

                default:

                    botao.classList.add("disponivel");

                    break;

            }

        });

}

// ==========================================================
// EVENTOS
// ==========================================================

function registrarEventos() {

    document
        .querySelectorAll("[data-cartela]")
        .forEach((botao) => {

            botao.addEventListener("click", () => {

                abrirCartela(

                    Number(botao.dataset.cartela)

                );

            });

        });

    const pesquisar = document.getElementById("buscarNumero");

    if (pesquisar) {

        pesquisar.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                pesquisarNumero();

            }

        });

    }

    const btnPesquisar = document.getElementById("btnPesquisar");

    if (btnPesquisar) {

        btnPesquisar.addEventListener(

            "click",

            pesquisarNumero

        );

    }

}

// ==========================================================
// ABRIR CARTELA
// ==========================================================

function abrirCartela(numeroCartela) {

    cartelaAtual = numeroCartela;

    CARTELAS.forEach((cartela, indice) => {

        cartela.style.display =

            indice + 1 === numeroCartela

                ? "block"

                : "none";

    });

}

// ==========================================================
// PESQUISA
// ==========================================================

function pesquisarNumero() {

    const campo = document.getElementById("buscarNumero");

    if (!campo) return;

    const numero = Number(campo.value);

    if (isNaN(numero)) return;

    if (numero < 0 || numero > 999) return;

    abrirCartela(

        obterCartela(numero)

    );

    destacarNumero(

        formatarNumero(numero)

    );

}

// ==========================================================
// DESTAQUE
// ==========================================================

function destacarNumero(numero) {

    const botao = document.querySelector(

        `[data-numero="${numero}"]`

    );

    if (!botao) return;

    botao.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

    botao.classList.add("destacado");

    setTimeout(() => {

        botao.classList.remove("destacado");

    }, 2500);

               }
// ==========================================================
// SELEÇÃO
// ==========================================================

const selecionados = new Set();

function clicarNumero(evento) {

    const botao = evento.currentTarget;

    const numero = botao.dataset.numero;

    const dados = STATUS[numero];

    if (!dados) return;

    if (dados.status === "vendido") {

        mostrarMensagem(

            "Este número já foi vendido.",

            "erro"

        );

        return;

    }

    if (dados.status === "reservado") {

        mostrarMensagem(

            "Este número está reservado.",

            "aviso"

        );

        return;

    }

    if (selecionados.has(numero)) {

        selecionados.delete(numero);

        botao.classList.remove("selecionado");

    } else {

        selecionados.add(numero);

        botao.classList.add("selecionado");

    }

    atualizarResumo();

}

// ==========================================================
// RESUMO
// ==========================================================

function atualizarResumo() {

    const lista = document.getElementById("listaSelecionados");

    const quantidade = document.getElementById("quantidadeSelecionados");

    const total = document.getElementById("valorSelecionado");

    if (lista) {

        lista.innerHTML = "";

        [...selecionados]

            .sort()

            .forEach(numero => {

                const item = document.createElement("div");

                item.className = "itemSelecionado";

                item.textContent = numero;

                lista.appendChild(item);

            });

    }

    if (quantidade) {

        quantidade.textContent = selecionados.size;

    }

    if (total) {

        total.textContent =
            "R$ " +
            (selecionados.size * CONFIG.valorNumero)
            .toFixed(2)
            .replace(".", ",");

    }

}

// ==========================================================
// LIMPAR
// ==========================================================

function limparSelecao() {

    selecionados.clear();

    document
        .querySelectorAll(".numero.selecionado")
        .forEach(botao => {

            botao.classList.remove("selecionado");

        });

    atualizarResumo();

}

// ==========================================================
// BOTÃO RESERVAR
// ==========================================================

const btnReservar = document.getElementById("btnReservar");

if (btnReservar) {

    btnReservar.addEventListener(

        "click",

        abrirFormularioReserva

    );

}

// ==========================================================
// FORMULÁRIO
// ==========================================================

function abrirFormularioReserva() {

    if (selecionados.size === 0) {

        mostrarMensagem(

            "Escolha pelo menos um número.",

            "aviso"

        );

        return;

    }

    const modal = document.getElementById("modalReserva");

    if (modal) {

        modal.classList.add("ativo");

    }

}

// ==========================================================
// DADOS DA RESERVA
// ==========================================================

function obterDadosReserva() {

    return {

        numeros: [...selecionados],

        quantidade: selecionados.size,

        valor: selecionados.size * CONFIG.valorNumero,

        data: Date.now()

    };

}// ==========================================================
// CONFIRMAR RESERVA
// ==========================================================

const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");

if (btnConfirmarReserva) {

    btnConfirmarReserva.addEventListener(

        "click",

        confirmarReserva

    );

}

async function confirmarReserva() {

    const nome = document
        .getElementById("nomeParticipante")
        ?.value
        .trim();

    const telefone = document
        .getElementById("telefoneParticipante")
        ?.value
        .trim();

    if (!nome) {

        mostrarMensagem(

            "Informe seu nome.",

            "erro"

        );

        return;

    }

    if (!telefone) {

        mostrarMensagem(

            "Informe seu WhatsApp.",

            "erro"

        );

        return;

    }

    if (selecionados.size === 0) {

        mostrarMensagem(

            "Nenhum número selecionado.",

            "erro"

        );

        return;

    }

    try {

        const snapshot = await get(numerosRef);

        if (!snapshot.exists()) {

            mostrarMensagem(

                "Erro ao acessar o banco.",

                "erro"

            );

            return;

        }

        const banco = snapshot.val();

        const atualizacoes = {};

        for (const numero of selecionados) {

            if (

                banco[numero] &&

                banco[numero].status !== "disponivel"

            ) {

                mostrarMensagem(

                    `O número ${numero} não está mais disponível.`,

                    "erro"

                );

                return;

            }

            atualizacoes[`${numero}/status`] = "reservado";
            atualizacoes[`${numero}/nome`] = nome;
            atualizacoes[`${numero}/telefone`] = telefone;
            atualizacoes[`${numero}/dataReserva`] = Date.now();

        }

        await update(numerosRef, atualizacoes);

        abrirWhatsappReserva(nome, telefone);

        fecharModalReserva();

        limparSelecao();

        mostrarMensagem(

            "Reserva realizada com sucesso!",

            "sucesso"

        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(

            "Erro ao reservar números.",

            "erro"

        );

    }

}

// ==========================================================
// WHATSAPP
// ==========================================================

function abrirWhatsappReserva(nome, telefone) {

    const numeros =

        [...selecion
