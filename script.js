// ==========================================================
// RIFA SOLIDÁRIA - GILFEST
// script.js
// PARTE 1/4
// Inicialização e Estado Global
// ==========================================================

import {
    CONFIG
} from "./config.js";

import {

    db,

    numerosRef,

    configRef,

    estatisticasRef,

    participantesRef,

    avisosRef,

    get,

    onValue,

    push,

    update,

    ref

} from "./firebase.js";

// ==========================================================
// ESTADO DA APLICAÇÃO
// ==========================================================

const APP = {

    numeros:{},

    config:{},

    estatisticas:{},

    avisos:{},

    selecionados:[],

    carregando:false,

    cartelaAtual:1

};

// ==========================================================
// ELEMENTOS
// ==========================================================

const el={

    premio:

        document.getElementById("premio"),

    valor:

        document.getElementById("valor"),

    data:

        document.getElementById("dataSorteio"),

    titulo:

        document.getElementById("titulo"),

    subtitulo:

        document.getElementById("subtitulo"),

    buscar:

        document.getElementById("buscarNumero"),

    resultado:

        document.getElementById("resultadoBusca"),

    btnBuscar:

        document.getElementById("btnBuscarNumero"),

    btnReservar:

        document.getElementById("btnReservar"),

    btnPix:

        document.getElementById("copiarPix"),

    pix:

        document.getElementById("pixKey"),

    whatsapp:

        document.getElementById("btnWhatsapp"),

    comprovante:

        document.getElementById("btnComprovante"),

    numeroSelecionado:

        document.getElementById("numeroSelecionado"),

    valorSelecionado:

        document.getElementById("valorSelecionado"),

    statusNumero:

        document.getElementById("statusNumero"),

    toast:

        document.getElementById("toast"),

    dias:

        document.getElementById("dias"),

    horas:

        document.getElementById("horas"),

    minutos:

        document.getElementById("minutos"),

    segundos:

        document.getElementById("segundos")

};

// ==========================================================
// INICIAR
// ==========================================================

window.addEventListener(

    "DOMContentLoaded",

    iniciarSistema

);

async function iniciarSistema(){

    try{

        registrarEventos();

        iniciarCarrossel();

        iniciarTrevos();

        iniciarContador();

        await carregarConfiguracao();

        sincronizarNumeros();

        sincronizarEstatisticas();

        sincronizarAvisos();

        console.log(

            "Sistema iniciado."

        );

    }

    catch(e){

        console.error(e);

        mostrarToast(

            "Erro ao iniciar.",

            "erro"

        );

    }

}

// ==========================================================
// EVENTOS
// ==========================================================

function registrarEventos(){

    if(el.btnBuscar){

        el.btnBuscar.addEventListener(

            "click",

            pesquisarNumero

        );

    }

    if(el.buscar){

        el.buscar.addEventListener(

            "keydown",

            e=>{

                if(e.key==="Enter"){

                    pesquisarNumero();

                }

            }

        );

    }

    if(el.btnPix){

        el.btnPix.addEventListener(

            "click",

            copiarChavePix

        );

    }

    if(el.btnReservar){

        el.btnReservar.addEventListener(

            "click",

            reservarSelecionados

        );

    }

}

// ==========================================================
// CONFIGURAÇÃO
// ==========================================================

async function carregarConfiguracao(){

    const snap=await get(configRef);

    if(!snap.exists()) return;

    APP.config=snap.val();

    aplicarConfiguracao();

}

function aplicarConfiguracao(){

    const c=APP.config;

    document.title=c.titulo;

    if(el.titulo)

        el.titulo.textContent=c.titulo;

    if(el.subtitulo)

        el.subtitulo.textContent=

        c.subtitulo;

    if(el.premio)

        el.premio.textContent=

        c.premio;

    if(el.valor)

        el.valor.textContent=

        `R$ ${Number(c.valorNumero).toFixed(2)}`;

    if(el.data)

       // ==========================================================
// PARTE 2/4
// FIREBASE + PESQUISA + SELEÇÃO
// ==========================================================

// ---------------------------
// SINCRONIZAÇÃO DOS NÚMEROS
// ---------------------------

function sincronizarNumeros() {

    onValue(numerosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.numeros = snapshot.val();

        atualizarResumo();

    });

}

// ---------------------------
// ESTATÍSTICAS
// ---------------------------

function sincronizarEstatisticas() {

    onValue(estatisticasRef, (snapshot) => {

        if (!snapshot.exists()) return;

        APP.estatisticas = snapshot.val();

    });

}

// ---------------------------
// AVISOS
// ---------------------------

function sincronizarAvisos() {

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

// ==========================================================
// PESQUISAR NÚMERO
// ==========================================================

function pesquisarNumero() {

    if (!el.buscar) return;

    const numero = Number(el.buscar.value);

    if (isNaN(numero)) {

        mostrarToast(

            "Digite um número válido.",

            "erro"

        );

        return;

    }

    if (numero < 0 || numero > 999) {

        mostrarToast(

            "Número deve estar entre 000 e 999.",

            "erro"

        );

        return;

    }

    selecionarNumero(numero);

}

// ==========================================================
// SELECIONAR NÚMERO
// ==========================================================

function selecionarNumero(numero) {

    const chave =

        numero.toString().padStart(3, "0");

    const dados = APP.numeros[chave];

    if (!dados) {

       // ==========================================================
// PARTE 3/4
// CONTADOR + PIX + WHATSAPP + CARROSSEL + TOAST
// ==========================================================

// --------------------------
// CONTAGEM REGRESSIVA
// --------------------------

function iniciarContador() {

    atualizarContador();

    setInterval(atualizarContador, 1000);

}

function atualizarContador() {

    if (!APP.config.dataSorteio) return;

    const destino = new Date(APP.config.dataSorteio).getTime();

    const agora = Date.now();

    const diferenca = destino - agora;

    if (diferenca <= 0) {

        el.dias.textContent = "00";
        el.horas.textContent = "00";
        el.minutos.textContent = "00";
        el.segundos.textContent = "00";

        return;

    }

    const dias = Math.floor(diferenca / 86400000);

    const horas = Math.floor((diferenca % 86400000) / 3600000);

    const minutos = Math.floor((diferenca % 3600000) / 60000);

    const segundos = Math.floor((diferenca % 60000) / 1000);

    el.dias.textContent = String(dias).padStart(2, "0");
    el.horas.textContent = String(horas).padStart(2, "0");
    el.minutos.textContent = String(minutos).padStart(2, "0");
    el.segundos.textContent = String(segundos).padStart(2, "0");

}

// --------------------------
// COPIAR PIX
// --------------------------

    // ==========================================================
// PARTE 4/4
// FINALIZAÇÃO
// ==========================================================

// --------------------------
// ESTATÍSTICAS
// --------------------------

function atualizarEstatisticas() {

    const total = Object.keys(APP.numeros).length;

    let vendidos = 0;
    let reservados = 0;
    let disponiveis = 0;

    Object.values(APP.numeros).forEach((numero) => {

        switch (numero.status) {

            case "vendido":
                vendidos++;
                break;

            case "reservado":
                reservados++;
                break;

            default:
                disponiveis++;
                break;

        }

    });

    const vendidosEl =
        document.getElementById("totalVendidos");

    const reservadosEl =
        document.getElementById("totalReservados");

    const disponiveisEl =
        document.getElementById("totalDisponiveis");

    const arrecadadoEl =
        document.getElementById("totalArrecadado");

    if (vendidosEl)
        vendidosEl.textContent = vendidos;

    if (reservadosEl)
        reservadosEl.textContent = reservados;

    if (disponiveisEl)
        disponiveisEl.textContent = disponiveis;

    if (arrecadadoEl) {

        arrecadadoEl.textContent =
            "R$ " +
            (vendidos * Number(APP.config.valorNumero))
            .toFixed(2);

    }

    atualizarBarraProgresso(

        vendidos,

        total

    );

}

// --------------------------
// BARRA
// --------------------------

function atualizarBarraProgresso(

    vendidos,

    total

) {

    const barra =

        document.getElementById(

            "barraProgresso"

        );

    if (!barra) return;

    const porcentagem =

        total === 0

            ? 0

            : (vendidos / total) * 100;

    barra.style.width =

        porcentagem + "%";

}

// --------------------------
// PARTICIPANTES
// --------------------------

async function salvarParticipante(dados) {

    try {

        await push(

            participantesRef,

            dados

        );

        return true;

    }

    catch (erro) {

        console.error(erro);

        return false;

    }

}

// --------------------------
// FORMATAR
// --------------------------

function formatarNumero(numero) {

    return String(numero)

        .padStart(3, "0");

}

// --------------------------
// LIMPAR
// --------------------------
