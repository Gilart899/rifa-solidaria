"use strict";

/* ==========================================
   RIFA SOLIDÁRIA
   script.js
   Página Inicial
========================================== */

import {
    db,
    ref,
    set,
    get,
    update,
    remove,
    push,
    child,
    onValue
} from "./firebase.js";

/* ==========================================
   ELEMENTOS
========================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const slides = $$(".slide");

const prevBtn = $("#prevSlide");
const nextBtn = $("#nextSlide");

const toast = $("#toast");

const pixButton = $("#copiarPix");
const pixInput = $("#pixKey");

const titulo = $("#titulo");
const subtitulo = $("#subtitulo");

const premio = $("#premio");
const beneficiada = $("#beneficiada");

const valor = $("#valor");

const dias = $("#dias");
const horas = $("#horas");
const minutos = $("#minutos");
const segundos = $("#segundos");

/* ==========================================
   VARIÁVEIS
========================================== */

let slideAtual = 0;

let autoSlide = null;

let touchStartX = 0;
let touchEndX = 0;

/* ==========================================
   CARREGAR CONFIGURAÇÕES
========================================== */

function carregarConfiguracoes() {

    if (typeof CONFIG === "undefined") return;

    document.title =
        `${CONFIG.titulo} | ${CONFIG.subtitulo}`;

    titulo.textContent =
        CONFIG.titulo;

    subtitulo.textContent =
        CONFIG.subtitulo;

    beneficiada.textContent =
        CONFIG.beneficiada;
const whatsapp = document.getElementById("btnWhatsapp");

if (whatsapp && CONFIG.whatsapp) {

    whatsapp.href =
        `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(CONFIG.whatsapp.texto)}`;

}
        whatsapp.href =
            `https://wa.me/${CONFIG.whatsapp}`;

    }
    const whatsapp =
        document.getElementById("btnWhatsapp");

    whatsapp.href =
        `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(CONFIG.whatsapp.texto)}`;

}

/* ==========================================
   CARROSSEL
========================================== */

function mostrarSlide(indice){

    slides.forEach((slide)=>{

        slide.classList.remove("active");

    });

    slideAtual = indice;

    if(slideAtual < 0){

        slideAtual = slides.length - 1;

    }

    if(slideAtual >= slides.length){

        slideAtual = 0;

    }

    slides[slideAtual].classList.add("active");

}

function proximoSlide(){

    mostrarSlide(slideAtual + 1);

}

function slideAnterior(){

    mostrarSlide(slideAtual - 1);

}

function iniciarCarrossel(){

    autoSlide = setInterval(

        proximoSlide,

        5000

    );

}

function reiniciarCarrossel(){

    clearInterval(autoSlide);

    iniciarCarrossel();

}
/* ==========================================
   EVENTOS DO CARROSSEL
========================================== */

if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        slideAnterior();

        reiniciarCarrossel();

    });

}

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        proximoSlide();

        reiniciarCarrossel();

    });

}

/* ==========================================
   SUPORTE A TOUCH (SWIPE)
========================================== */

const carousel = document.querySelector(".carousel");

if (carousel) {

    carousel.addEventListener("touchstart", (event) => {

        touchStartX = event.changedTouches[0].clientX;

    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {

        touchEndX = event.changedTouches[0].clientX;

        const distancia = touchStartX - touchEndX;

        if (Math.abs(distancia) < 50) return;

        if (distancia > 0) {

            proximoSlide();

        } else {

            slideAnterior();

        }

        reiniciarCarrossel();

    }, { passive: true });

}

/* ==========================================
   CONTAGEM REGRESSIVA
========================================== */

function atualizarContador() {

    if (typeof CONFIG === "undefined") return;

    const destino = new Date(CONFIG.dataSorteio).getTime();

    const agora = Date.now();

    const diferenca = destino - agora;

    if (diferenca <= 0) {

        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";
        segundos.textContent = "00";

        return;

    }

    const totalSegundos = Math.floor(diferenca / 1000);

    const diasRestantes = Math.floor(totalSegundos / 86400);

    const horasRestantes = Math.floor((totalSegundos % 86400) / 3600);

    const minutosRestantes = Math.floor((totalSegundos % 3600) / 60);

    const segundosRestantes = totalSegundos % 60;

    dias.textContent =
        String(diasRestantes).padStart(2, "0");

    horas.textContent =
        String(horasRestantes).padStart(2, "0");

    minutos.textContent =
        String(minutosRestantes).padStart(2, "0");

    segundos.textContent =
        String(segundosRestantes).padStart(2, "0");

}

function iniciarContador() {

    atualizarContador();

    setInterval(atualizarContador, 1000);

}
/* ==========================================
   PIX
========================================== */

async function copiarPix() {

    if (!pixInput) return;

    const chave = pixInput.value.trim();

    if (!chave) return;

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(chave);

        } else {

            pixInput.removeAttribute("readonly");

            pixInput.select();

            pixInput.setSelectionRange(0, chave.length);

            document.execCommand("copy");

            pixInput.setAttribute("readonly", true);

            window.getSelection().removeAllRanges();

        }

        mostrarToast("✅ Chave copiada!");

    } catch (erro) {

        console.error("Erro ao copiar a chave PIX:", erro);

        mostrarToast("❌ Não foi possível copiar.");

    }

}

if (pixButton) {

    pixButton.addEventListener("click", copiarPix);

}

/* ==========================================
   TOAST
========================================== */

let toastTimeout = null;

function mostrarToast(mensagem) {

    if (!toast) return;

    toast.textContent = mensagem;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

/* ==========================================
   UTILITÁRIOS
========================================== */

function reproduzirClique() {

    if (
        typeof CONFIG === "undefined" ||
        !CONFIG.sons ||
        !CONFIG.sons.clique
    ) {
        return;
    }

    const audio = new Audio(CONFIG.sons.clique);

    audio.volume = 0.3;

    audio.play().catch(() => {
        /* Ignora bloqueio automático do navegador */
    });

}

document.querySelectorAll(".btn").forEach((botao) => {

    botao.addEventListener("click", reproduzirClique);

});
/* ==========================================
   INICIALIZAÇÃO
========================================== */

function inicializarAplicacao() {

    carregarConfiguracoes();

    if (slides.length > 0) {

        mostrarSlide(0);

        iniciarCarrossel();

    }

    iniciarContador();

    console.log("✅ Rifa Solidária iniciada com sucesso.");

}

/* ==========================================
   VISIBILIDADE DA ABA
========================================== */

document.addEventListener("visibilitychange", () => {

    if (slides.length === 0) return;

    if (document.hidden) {

        clearInterval(autoSlide);

    } else {

        reiniciarCarrossel();

    }

});

/* ==========================================
   CARREGAMENTO DA PÁGINA
========================================== */

window.addEventListener("load", () => {

    inicializarAplicacao();

});

/* ==========================================
   TRATAMENTO DE ERROS
========================================== */

window.addEventListener("error", (event) => {

    console.error("Erro capturado:", event.error || event.message);

});

window.addEventListener("unhandledrejection", (event) => {

    console.error("Promise rejeitada:", event.reason);

});

/* ==========================================
   FIM DO ARQUIVO
========================================== */
