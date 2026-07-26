// ==========================================================
// script.js
// Rifa Solidária
// GilFest
// Versão 2.0
// ==========================================================

import { CONFIG } from "./config.js";

import {
    db,
    numerosRef,
    participantesRef,
    configRef,
    avisosRef,
    estatisticasRef,
    onValue,
    get,
    update,
    push,
    ref
} from "./firebase.js";

import {
    formatarNumero,
    obterCartela,
    intervaloCartela,
    copiarPix,
    abrirWhatsapp,
    calcularValor,
    calcularContagem
} from "./utils.js";

// ==========================================================
// ESTADO GLOBAL
// ==========================================================

const APP = {

    numeros: {},

    configuracao: {},

    estatisticas: {},

    avisos: {},

    selecionados: [],

    cartelaAtual: 1,

    carregando: false,

    administrador: false

};

// ==========================================================
// ELEMENTOS DA PÁGINA
// ==========================================================

const el = {

    contador: document.getElementById("contador"),

    dias: document.getElementById("dias"),

    horas: document.getElementById("horas"),

    minutos: document.getElementById("minutos"),

    segundos: document.getElementById("segundos"),

    buscar: document.getElementById("buscarNumero"),

    btnPesquisar: document.getElementById("btnPesquisar"),

    btnPix: document.getElementById("btnPix"),

    btnWhatsapp: document.getElementById("btnWhatsapp"),

    btnCartelas: document.getElementById("btnCartelas"),

    barra: document.getElementById("barraProgresso"),

    vendidos: document.getElementById("totalVendidos"),

    reservados: document.getElementById("totalReservados"),

    disponiveis: document.getElementById("totalDisponiveis"),

    arrecadado: document.getElementById("totalArrecadado"),

    listaSelecionados: document.getElementById("listaSelecionados"),

    totalSelecionados: document.getElementById("totalSelecionados"),

    valorSelecionado: document.getElementById("valorSelecionado")

};

// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

window.addEventListener("load", iniciarSistema);

async function iniciarSistema() {

    try {

        iniciarEventos();

        iniciarContador();

        iniciarTrevos();

        iniciarCarrossel();

        await carregarConfiguracoes();

        await carregarEstatisticas();

        await carregarAvisos();

        sincronizarNumeros();

        verificarSorteio();

        console.log("Sistema iniciado.");

    }

    catch (erro) {

        console.error(erro);

        mostrarToast(

            "Erro ao iniciar o sistema.",

            "erro"

        );

    }

}

// ==========================================================
// EVENTOS
// ==========================================================

function iniciarEventos() {

    if (el.btnPix) {

        el.btnPix.addEventListener(

            "click",

            copiarPix

        );

    }

    if (el.btnPesquisar) {

        el.btnPesquisar.addEventListener(

            "click",

            pesquisarNumero

        );

    }

    if (el.buscar) {

        el.buscar.addEventListener(

            "keydown",

            (e) => {

                if (e.key === "Enter") {

                    pesquisarNumero();

                }

            }

        );

    }

    if (el.btnCartelas) {

        el.btnCartelas.addEventListener(

            "click",

            abrirCartelas

        );

    }

}
