// ==========================================================
// script.js
// Rifa Solidária - GilFest
// Versão 3.0
// PARTE 1/4
// ==========================================================

import { CONFIG } from "./config.js";

import {
  db,
  numerosRef,
  participantesRef,
  configRef,
  estatisticasRef,
  avisosRef,
  ref,
  get,
  push,
  set,
  update,
  onValue
} from "./firebase.js";

// ==========================================================
// ESTADO GLOBAL
// ==========================================================

const APP = {
  numeros: {},
  config: {},
  estatisticas: {},
  avisos: {},
  selecionados: [],
  carregando: false,
  cartelaAtual: 1
};

// ==========================================================
// ELEMENTOS
// ==========================================================

const $ = (id) => document.getElementById(id);

const UI = {
  titulo: $("titulo"),
  subtitulo: $("subtitulo"),
  premio: $("premio"),
  valor: $("valor"),
  dataSorteio: $("dataSorteio"),

  buscarNumero: $("buscarNumero"),
  btnBuscarNumero: $("btnBuscarNumero"),
  resultadoBusca: $("resultadoBusca"),

  numeroSelecionado: $("numeroSelecionado"),
  valorSelecionado: $("valorSelecionado"),
  statusNumero: $("statusNumero"),
  btnReservar: $("btnReservar"),

  pixKey: $("pixKey"),
  copiarPix: $("copiarPix"),

  btnWhatsapp: $("btnWhatsapp"),
  btnComprovante: $("btnComprovante"),

  dias: $("dias"),
  horas: $("horas"),
  minutos: $("minutos"),
  segundos: $("segundos"),

  toast: $("toast")
};

// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

  try {

    registrarEventos();

    iniciarTrevos();

    iniciarCarrossel();

    iniciarContador();

    await carregarConfiguracao();

    ouvirNumeros();

    ouvirEstatisticas();

    ouvirAvisos();

    console.log("Sistema iniciado.");

  } catch (e) {

    console.error(e);

    mostrarToast(
      "Erro ao iniciar o sistema.",
      "erro"
    );

  }

}

// ==========================================================
// EVENTOS
// ==========================================================

function registrarEventos() {

  if (UI.btnBuscarNumero) {

    UI.btnBuscarNumero.addEventListener(
      "click",
      pesquisarNumero
    );

  }

  if (UI.buscarNumero) {

    UI.buscarNumero.addEventListener(
      "keydown",
      (e) => {

        if (e.key === "Enter") {

          pesquisarNumero();

        }

      }
    );

  }

  if (UI.copiarPix) {

    UI.copiarPix.addEventListener(
      "click",
      copiarChavePix
    );

  }

  if (UI.btnReservar) {

    UI.btnReservar.addEventListener(
      "click",
      reservarNumero
    );

  }

}

// ==========================================================
// CONFIGURAÇÃO
// ==========================================================

async function carregarConfiguracao() {

  const snap = await get(configRef);

  if (!snap.exists()) return;

  APP.config = snap.val();

  aplicarConfiguracao();

}

function aplicarConfiguracao() {

  const c = APP.config;

  document.title = c.titulo || "Rifa Solidária";

  if (UI.titulo)
    UI.titulo.textContent = c.titulo || "";

  if (UI.subtitulo)
    UI.subtitulo.textContent = c.subtitulo || "";

  if (UI.premio)
    UI.premio.textContent = c.premio || "";

  if (UI.valor)
    UI.valor.textContent =
      "R$ " +
      Number(c.valorNumero || 0).toFixed(2);

  if (UI.dataSorteio)
    UI.dataSorteio.textContent =
      c.dataSorteio || "";

  if (UI.pixKey)
    UI.pixKey.value = c.pix || "";

  configurarWhatsapp();

}

// ==========================================================
// PARTE 2/4
// FIREBASE + NÚMEROS + PESQUISA + RESERVA
// ==========================================================

// ----------------------------------------------------------
// OUVIR NÚMEROS
// ----------------------------------------------------------

function ouvirNumeros() {

    onValue(numerosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.numeros = snapshot.val();

        atualizarResumo();

        atualizarEstatisticas();

    });

}

// ----------------------------------------------------------
// OUVIR ESTATÍSTICAS
// ----------------------------------------------------------

function ouvirEstatisticas() {

    onValue(estatisticasRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.estatisticas = snapshot.val();

    });

}

// ----------------------------------------------------------
// OUVIR AVISOS
// ----------------------------------------------------------

function ouvirAvisos() {

    onValue(avisosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.avisos = snapshot.val();

        const aviso = document.getElementById("textoAviso");

        if (aviso) {

            aviso.textContent =

                APP.avisos.texto || "";

        }

    });

}

// ----------------------------------------------------------
// PESQUISA
// ----------------------------------------------------------

function pesquisarNumero() {

    const valor = UI.buscarNumero.value

// ==========================================================
// PARTE 3/4
// CONTADOR + PIX + WHATSAPP + CARROSSEL + TREVOS + TOAST
// ==========================================================

// ----------------------------------------------------------
// CONTADOR
// ----------------------------------------------------------

let contadorInterval = null;

function iniciarContador() {

    atualizarContador();

    if (contadorInterval) {
        clearInterval(contadorInterval);
    }

    contadorInterval = setInterval(
        atualizarContador,
        1000
    );

}

function atualizarContador() {

    if (!APP.config.dataSorteio) return;

    const destino = new Date(
        APP.config.dataSorteio
    ).getTime();

    const agora = Date.now();

    let restante = destino - agora;

    if (restante < 0) restante = 0;

    const dias = Math.floor(
        restante / 86400000
    );

    restante %= 86400000;

    const horas = Math.floor(
        restante / 3600000
    );

    restante %= 3600000;

    const minutos = Math.floor(
        restante / 60000
    );

    restante %= 60000;

    const segundos = Math.floor(
        restante / 1000
    );

    if (UI.dias)
        UI.dias.textContent =
            String(dias).padStart(2, "0");

    if (UI.horas)
        UI.horas.textContent =
            String(horas).padStart(2, "0");

    if (UI.minutos)
        UI.minutos.textContent =
            String(minutos).padStart(2, "0");

    if (UI.segundos)
        UI.segundos.textContent =
            String(segundos).padStart(

            // ==========================================================
// LIMPAR SELEÇÃO
// ==========================================================

function limparSelecao() {

    APP.selecionados = [];

    if (el.numeroSelecionado) {
        el.numeroSelecionado.textContent = "Nenhum";
    }

    if (el.valorSelecionado) {
        el.valorSelecionado.textContent =
            "R$ " + Number(APP.config.valorNumero || 0).toFixed(2);
    }

    if (el.statusNumero) {
        el.statusNumero.textContent = "🟢 Disponível";
        el.statusNumero.className = "status disponivel";
    }

}

// ==========================================================
// RESUMO
// ==========================================================

function atualizarResumo() {

    if (!APP.selecionados.length) {

        limparSelecao();

        return;

    }

    const numero = APP.selecionados[0];

    if (el.numeroSelecionado) {
        el.numeroSelecionado.textContent = numero;
    }

    if (el.valorSelecionado) {

        const total =
            APP.selecionados.length *
            Number(APP.config.valorNumero || 0);

        el.valorSelecionado.textContent =
            "R$ " + total.toFixed(2);

    }

}

// ==========================================================
// COPIAR CHAVE PIX
// ==========================================================

async function copiarChavePix() {

    if (!APP.config.chavePix) {

        mostrarToast(
            "Chave PIX não configurada.",
            "erro"
        );

        return;

    }

    try {

        await navigator.clipboard.writeText(
            APP.config.chavePix
        );

        mostrarToast(
            "Chave PIX copiada.",
            "sucesso"
        );

    }

    catch {

        mostrarToast(
            "Não foi possível copiar.",
            "erro"
        );

    }

}

// ==========================================================
// RESERVAR NÚMEROS
// ==========================================================

async function reservarSelecionados() {

    if (!APP.selecionados.length) {

        mostrarToast(
            "Selecione um número.",
            "erro"
        );

        return;

    }

    try {

        const atualizacao = {};

        APP.selecionados.forEach(numero => {

            atualizacao[numero] = {

                ...APP.numeros[numero],

                status: "reservado",

               
