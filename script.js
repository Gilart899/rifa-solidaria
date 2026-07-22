/* ==========================================
   RIFA GILSIGNS
========================================== */

let numerosSelecionados = [];
let slideAtual = 0;

/* ==========================================
   ATALHOS DOS ELEMENTOS
========================================== */

const txtNumero = document.getElementById("numeroEscolhido");
const listaNumeros = document.getElementById("numerosSelecionados");

const btnVerificar = document.getElementById("btnVerificar");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnSorte = document.getElementById("btnSorte");
const btnReservar = document.getElementById("btnReservar");
const btnWhatsapp = document.getElementById("btnWhatsapp");
const btnCopiarPix = document.getElementById("copiarPix");

/* ==========================================
   CARREGAR CONFIGURAÇÕES
========================================== */

function carregarConfiguracoes() {

    document.getElementById("beneficiada").textContent =
        CONFIG.beneficiada;

    document.getElementById("premio").textContent =
        CONFIG.premio;

    document.getElementById("valorNumero").textContent =
        `R$ ${CONFIG.valorNumero.toFixed(2)}`;

    document.getElementById("dataSorteio").textContent =
        CONFIG.dataSorteio;

    document.getElementById("resultadoSorteio").textContent =
        CONFIG.resultado;

    document.getElementById("pix").textContent =
        CONFIG.pixChave;

}
