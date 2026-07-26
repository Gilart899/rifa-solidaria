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
// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

async function carregarConfiguracoes() {

    try {

        const snapshot = await get(configRef);

        if (snapshot.exists()) {

            APP.configuracao = snapshot.val();

            aplicarConfiguracoes();

        }

    } catch (erro) {

        console.error("Erro ao carregar configurações:", erro);

    }

}

function aplicarConfiguracoes() {

    const cfg = APP.configuracao;

    if (cfg.titulo) {

        document.title = cfg.titulo;

    }

    const premio = document.getElementById("nomePremio");

    if (premio && cfg.premio) {

        premio.textContent = cfg.premio;

    }

    const beneficiada = document.getElementById("beneficiada");

    if (beneficiada && cfg.beneficiada) {

        beneficiada.textContent = cfg.beneficiada;

    }

}

// ==========================================================
// AVISOS
// ==========================================================

async function carregarAvisos() {

    try {

        onValue(avisosRef, (snapshot) => {

            if (!snapshot.exists()) return;

            APP.avisos = snapshot.val();

            atualizarAvisos();

        });

    } catch (erro) {

        console.error(erro);

    }

}

function atualizarAvisos() {

    const aviso = document.getElementById("textoAviso");

    if (!aviso) return;

    aviso.textContent = APP.avisos.texto || "";

}

// ==========================================================
// ESTATÍSTICAS
// ==========================================================

async function carregarEstatisticas() {

    try {

        onValue(estatisticasRef, (snapshot) => {

            if (!snapshot.exists()) return;

            APP.estatisticas = snapshot.val();

            atualizarEstatisticas();

        });

    } catch (erro) {

        console.error(erro);

    }

}

function atualizarEstatisticas() {

    const dados = APP.estatisticas;

    atualizarTexto("totalVendidos", dados.vendidos || 0);

    atualizarTexto("totalReservados", dados.reservados || 0);

    atualizarTexto("totalDisponiveis", dados.disponiveis || 0);

    atualizarTexto(

        "totalArrecadado",

        "R$ " + Number(dados.arrecadado || 0).toFixed(2)

    );

    atualizarBarraProgresso();

}

function atualizarBarraProgresso() {

    if (!el.barra) return;

    const vendidos = APP.estatisticas.vendidos || 0;

    const percentual =

        (vendidos / CONFIG.totalNumeros) * 100;

    el.barra.style.width = percentual + "%";

}

// ==========================================================
// FIREBASE
// ==========================================================

function sincronizarNumeros() {

    onValue(numerosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.numeros = snapshot.val();

        atualizarInterfaceNumer
        // ==========================================================
// PESQUISA
// ==========================================================

function pesquisarNumero() {

    if (!el.buscar) return;

    const valor = el.buscar.value.trim();

    if (valor === "") {

        mostrarToast("Digite um número.", "aviso");

        return;

    }

    const numero = Number(valor);

    if (isNaN(numero) || numero < 0 || numero > 999) {

        mostrarToast("Número inválido.", "erro");

        return;

    }

    const numeroFormatado = formatarNumero(numero);

    const cartela = obterCartela(numero);

    abrirCartela(cartela);

    destacarNumero(numeroFormatado);

}

// ==========================================================
// CARTELAS
// ==========================================================

function abrirCartela(cartela) {

    APP.cartelaAtual = cartela;

    const evento = new CustomEvent("abrir-cartela", {

        detail: {

            cartela

        }

    });

    window.dispatchEvent(evento);

}

function destacarNumero(numero) {

    setTimeout(() => {

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

    }, 400);

}

// ==========================================================
// SELEÇÃO
// ==========================================================

function selecionarNumero(numero) {

    numero = formatarNumero(numero);

    const dados = APP.numeros[numero];

    if (!dados) return;

    if (dados.status === CONFIG.status.VENDIDO) {

        mostrarToast(

            "Número vendido.",

            "erro"

        );

        return;

    }

    const indice = APP.selecionados.indexOf(numero);

    if (indice >= 0) {

        APP.selecionados.splice(indice, 1);

    } else {

        APP.selecionados.push(numero);

    }

   // ==========================================================
// TOAST
// ==========================================================

let toastTimeout = null;

function mostrarToast(texto, tipo = "info") {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.className = "";

    toast.classList.add("toast");

    toast.classList.add(tipo);

    toast.textContent = texto;

    toast.classList.add("mostrar");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 3500);

}

// ==========================================================
// MODAL DE RESERVA
// ==========================================================

function abrirModalReserva() {

    const modal = document.getElementById("modalReserva");

    if (!modal) return;

    modal.classList.add("ativo");

}

function fecharModalReserva() {

    const modal = document.getElementById("modalReserva");

    if (!modal) return;

    modal.classList.remove("ativo");

}

// ==========================================================
// CARROSSEL
// ==========================================================

let slideAtual = 0;

function iniciarCarrossel() {

    const slides = document.querySelectorAll(".carousel img");

    if (!slides.length) return;

    slides.forEach((img, i) => {

        img.style.display = i === 0 ? "block" : "none";

    });

    setInterval(() => {

        slides[slideAtual].style.display = "none";

        slideAtual++;

        if (slideAtual >= slides.length) {

            slideAtual = 0;

        }

        slides[slideAtual].style.display = "block";

    }, 5000);

}

// ==========================================================
// TREVOS
// ==========================================================

function iniciarTrevos() {

    document.querySelectorAll(".trevo").forEach((trevo) => {

        trevo.style.animationDelay =
            `${Math.random() * 5}s`;

    });

}

// ==========================================================
// SORTEIO
// ==========================================================

function verificarSorteio() {

    const tempo = calcularContagem();

    if (!tempo) {

        mostrarToast(

            "A data do sorteio foi alcançada.",

            "info"

        );

    }

}

// ==========================================================
// BOTÃO FLUTUANTE
// ==========================================================

function abrirCartelas() {

    window.location.href = "cartela.html";

}

// ==========================================================
// ESC
// ==========================================================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        fecharModalReserva();

    }

});

// ==========================================================
// CONTADOR
// ==========================================================

function atualizarContador() {

    const tempo = calcularContagem();

    if (!tempo) return;

    atualizarTexto("dias", tempo.dias);

    atualizarTexto("horas", tempo.horas);

    atualizarTexto("minutos", tempo.minutos);

    atualizarTexto("segundos", tempo.segundos);

}

function iniciarContador() {

    atualizarContador();

    setInterval(atualizarContador, 1000);

}

// ==========================================================
// FINAL
// ==========================================================

console.log("script.js carregado com sucesso.");
