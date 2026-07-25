/* ==========================================================
   GILFEST - SCRIPT PRINCIPAL
   ========================================================== */

import {
    db,
    ref,
    onValue,
    update
} from "./firebase.js";

/* ==========================================================
   ELEMENTOS
   ========================================================== */

const premio = document.getElementById("premio");
const valor = document.getElementById("valor");
const dataSorteio = document.getElementById("dataSorteio");

const pixKey = document.getElementById("pixKey");

const btnWhatsapp =
document.getElementById("btnWhatsapp");

/* ==========================================================
   REFERÊNCIAS
   ========================================================== */

const configRef = ref(db,"config");

const numerosRef = ref(db,"numeros");

/* ==========================================================
   CONFIGURAÇÕES
   ========================================================== */

onValue(configRef,(snapshot)=>{

const cfg=snapshot.val();

if(!cfg) return;

premio.textContent=cfg.premio;

valor.textContent="R$ "+cfg.valor;

dataSorteio.textContent=cfg.data;

pixKey.value=cfg.pix;

btnWhatsapp.href=

`https://wa.me/557988730207?text=${encodeURIComponent(
"Olá! Gostaria de participar da rifa."
)}`;

});

/* ==========================================================
   CARTELAS
   ========================================================== */

let numerosBanco = {};
let numeroSelecionado = null;

/* Carregar números em tempo real */

onValue(numerosRef, (snapshot) => {

    numerosBanco = snapshot.val() || {};

    atualizarCartelas();

});

/* ==========================================================
   ATUALIZAR CARTELAS
   ========================================================== */

function atualizarCartelas() {

    document
        .querySelectorAll(".numero")
        .forEach((botao) => {

            const numero = botao.dataset.numero;

            const dados = numerosBanco[numero];

            botao.classList.remove(
                "disponivel",
                "reservado",
                "vendido",
                "selecionado"
            );

            if (!dados || dados.status === "disponivel") {

                botao.classList.add("disponivel");

            } else if (dados.status === "reservado") {

                botao.classList.add("reservado");

            } else {

                botao.classList.add("vendido");

            }

            if (numeroSelecionado === numero) {

                botao.classList.add("selecionado");

            }

        });

}

/* ==========================================================
   CLIQUE NO NÚMERO
   ========================================================== */

document
.querySelectorAll(".numero")
.forEach((botao) => {

    botao.addEventListener("click", () => {

        if (botao.classList.contains("vendido")) {

            alert("Este número já
      /* ==========================================================
   RESERVA DE NÚMEROS
   ========================================================== */

const modalReserva =
document.getElementById("modalReserva");

const nomeReserva =
document.getElementById("nomeReserva");

const whatsappReserva =
document.getElementById("whatsappReserva");

const btnConfirmarReserva =
document.getElementById("btnConfirmarReserva");

const btnCancelarReserva =
document.getElementById("btnCancelarReserva");

let numeroAtual = null;

/* Abrir modal */

document.querySelectorAll(".numero").forEach((botao)=>{

    botao.addEventListener("dblclick",()=>{

        if(botao.classList.contains("vendido")){

            alert("Este número já foi vendido.");

            return;

        }

        numeroAtual = botao.dataset.numero;

        modalReserva.classList.add("ativo");

        nomeReserva.focus();

    });

});

/* Cancelar */

btnCancelarReserva.addEventListener("click",()=>{

    modalReserva.classList.remove("ativo");

    nomeReserva.value="";

    whatsappReserva.value="";

});

/* Confirmar */

btnConfirmarReserva.addEventListener("click",salvarReserva);

async function salvarReserva(){

    const nome = nomeReserva.value.trim();

    const whatsapp = whatsappReserva.value.trim();

    if(nome===""){
       /* ==========================================================
   MÚLTIPLA SELEÇÃO DE NÚMEROS
   ========================================================== */

let numerosSelecionados = [];

const listaSelecionados =
document.getElementById("listaSelecionados");

const totalSelecionados =
document.getElementById("totalSelecionados");

const valorTotal =
document.getElementById("valorTotal");

const btnFinalizar =
document.getElementById("btnFinalizarReserva");

const VALOR_NUMERO = 10;

/* ==========================================================
   SELEÇÃO
   ========================================================== */

document.querySelectorAll(".numero").forEach((botao)=>{

    botao.addEventListener("click",()=>{

        if(botao.classList.contains("vendido")) return;

        const numero = botao.dataset.numero;

        if(numerosSelecionados.includes(numero)){

            numerosSelecionados =
            numerosSelecionados.filter(n=>n!==numero);

        }else{

            numerosSelecionados.push(numero);

        }

        atualizarSelecao();

    });

});

/* ==========================================================
   ATUALIZA PAINEL
   ========================================================== */

function atualizarSelecao(){

    listaSelecionados.innerHTML="";

    numerosSelecionados.sort((a,b)=>Number(a)-Number(b));

    numerosSelecionados.forEach(numero=>{

        const tag=document.createElement("span");

        tag.className="numero-escolhido";

        tag.innerHTML=`

${numero}

<button
class="remover-numero"
data-numero="${numero}">

✕

</button>

`;

        listaSelecionados.appendChild(tag);

    });

    totalSelecionados.textContent=
    numerosSelecionados.length;

    valorTotal.textContent=

    (numerosSelecionados.length*VALOR_NUMERO)

    .toLocaleString(

    "pt-BR",

    {

    style:"currency",

    currency:"BRL"

    });

    document.querySelectorAll(".numero").forEach(btn=>{

        btn.classList.remove("selecionado");

    });

    numerosSelecionados.forEach(numero=>{

        const item=document.querySelector(

`.numero[data-numero="${numero}"]`

        );

        if(item){

            item.classList.add("selecionado");

        }

    });

}

/* ==========================================================
   REMOVER DA LISTA
   ========================================================== */

listaSelecionados.addEventListener("click",(e)=>{

if(

e.target.classList.contains("remover-numero")

){

const numero=

e.target.dataset.numero;

numerosSelecionados=

numerosSelecionados.filter(

n=>n!==numero

);

atualizarSelecao();

}

});

/* ==========================================================
   FINALIZAR
   ========================================================== */

btnFinalizar.addEventListener("click",()=>{

if(

numerosSelecionados.length===0

){

alert(

"Escolha pelo menos um número."

);

return;

}

modalReserva.classList.add("ativo");

});
       /* ==========================================================
   CONFIRMAR RESERVA DE VÁRIOS NÚMEROS
   ========================================================== */

btnConfirmarReserva.addEventListener("click", confirmarReservaMultipla);

async function confirmarReservaMultipla() {

    const nome = nomeReserva.value.trim();
    const whatsapp = whatsappReserva.value.trim();

    if (nome === "") {
        alert("Informe seu nome.");
        return;
    }

    if (whatsapp === "") {
        alert("Informe seu WhatsApp.");
        return;
    }

    if (numerosSelecionados.length === 0) {
        alert("Selecione pelo menos um número.");
        return;
    }

    btnConfirmarReserva.disabled = true;
    btnConfirmarReserva.textContent = "Salvando...";

    try {

        for (const numero of numerosSelecionados) {

            await update(
                ref(db, "numeros/" + numero),
                {
                    numero: numero,
                    nome: nome,
                    whatsapp: whatsapp,
                    status: "reservado",
                    pagamento: "Pendente",
                    dataReserva: Date.now()
                }
            );

        }

        modalReserva.classList.remove("ativo");

        mostrarToast("Reserva realizada com sucesso!");

        copiarPix();

        enviarWhatsapp(nome, whatsapp);

        nomeReserva.value = "";
        whatsappReserva.value = "";

        numerosSelecionados = [];

        atualizarSelecao();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao reservar números.");

    }

    btnConfirmarReserva.disabled = false;
    btnConfirmarReserva.textContent = "Confirmar Reserva";

}

/* ==========================================================
   COPIAR PIX
   ========================================================== */

function copiarPix() {

    const chave = pixKey.value;

    navigator.clipboard.writeText(chave);

}

/* ==========================================================
   WHATSAPP
   ========================================================== */

function enviarWhatsapp(nome, whatsapp) {

    const numeros = numerosSelecionados.join(", ");

    const valor = numerosSelecionados.length * VALOR_NUMERO;

    const mensagem =

`🎟️ *RIFA SOLIDÁRIA*

Olá!

Acabei de reservar os seguintes números:

🎯 ${numeros}

👤 Nome:
${nome}

📱 WhatsApp:
${wh
  /* ==========================================================
   CONTAGEM REGRESSIVA
   ========================================================== */

const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

let dataSorteioObj = null;

onValue(configRef, (snapshot) => {

    const cfg = snapshot.val();

    if (!cfg || !cfg.data) return;

    const hora = cfg.hora || "20:00";

    dataSorteioObj = new Date(`${cfg.data}T${hora}:00`);

});

function atualizarContador() {

    if (!dataSorteioObj) return;

    const agora = new Date();

    const diferenca = dataSorteioObj - agora;

    if (diferenca <= 0) {

        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";
        segundos.textContent = "00";

        return;

    }

    const d = Math.floor(diferenca / 86400000);

    const h = Math.floor((diferenca % 86400000) / 3600000);

    const m = Math.floor((diferenca % 3600000) / 60000
    /* ==========================================================
   TREVOS ANIMADOS
   ========================================================== */

function iniciarTrevos() {

    const container = document.querySelector(".background-clovers");

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 20; i++) {

        const trevo = document.createElement("img");

        trevo.src = "img/trevo.png";

        trevo.alt = "";

        trevo.setAttribute("aria-hidden", "true");

        trevo.className = "trevo";

        trevo.style.left = Math.random() * 100 + "%";

        trevo.style.animationDuration =
            (12 + Math.random() * 10) + "s";

        trevo.style.animationDelay =
            (Math.random() * 10) + "s";

        trevo.style.opacity =
            (0.08 + Math.random() * 0.12);

        trevo.style.width =
            (22 + Math.random() * 26) + "px";

        container.appendChild(trevo);

    }

}

/* ==========================================================
   BRILHO DA FOTO
   ========================================================== */

const foto = document.querySelector(".foto-beneficiada");

if (foto) {

    setInterval(() => {

        foto.classList.add("foto-brilho");

        setTimeout(() => {

            foto.classList.remove("foto-brilho");

        }, 1800);

    }, 7000);

}

/* ==========================================================
   ANIMAÇÃO DO SUBTÍTULO
   ========================================================== */

const subtitulo = document.getElementById("subtitulo");

if (subtitulo) {

    const frases = [

        "💙 Sua ajuda faz a diferença.",

        "🍀 Cada número comprado é uma esperança.",

        "🙏 Obrigado por apoiar Dona Bené.",

        "🎟️ Boa sorte no sorteio!"

    ];

    let indice = 0;

    setInterval(() => {

        indice++;

        if (indice >= frases.length) {
        /* ==========================================================
   AVISOS EM TEMPO REAL
   ========================================================== */

const avisoPrincipal = document.getElementById("avisoPrincipal");

const avisoRef = ref(db, "avisos/principal");

onValue(avisoRef, (snapshot) => {

    const aviso = snapshot.val();

    if (!avisoPrincipal || !aviso) return;

    avisoPrincipal.textContent = aviso.texto || "";

});

/* ==========================================================
   COPIAR PIX
   ========================================================== */

const btnCopiarPix = document.getElementById("copiarPix");

if (btnCopiarPix) {

    btnCopiarPix.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(pixKey.value);

            mostrarToast("✅ Chave PIX copiada.");

        } catch {

            alert("Não foi possível copiar a chave PIX.");

        }

    });

}

/* ==========================================================
   TOAST
   ========================================================== */

function mostrarToast(texto) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = texto;

    toast.classList.add("mostrar");

    setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 3000);

}

/* ==========================================================
   STATUS FIREBASE
   ========================================================== */

window.addEventListener("online", () => {

    console.log("🟢 Conectado.");

});

window.addEventListener("offline", () => {

    mostrarToast("⚠️ Sem conexão com a internet.");

});

/* ==========================================================
   SORTEIO ENCERRADO
   ========================================================== */

function verificarSorteio() {

    if (!dataSorteioObj) return;

    if (new Date() >= dataSorteioObj) {

        document.querySelectorAll(".numero").forEach((botao) => {

            botao.disabled = true;

        });

        mostrarToast("🎉 O sorteio foi encerrado.");

    }

}

setInterval(verificarSorteio, 10000);

/* ==========================================================
   ATALHOS DE TECLADO
   ========================================================== */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && modalReserva) {

        modalReserva.classList.remove("ativo");

    }

});

/* ==========================================================
   INICIALIZAÇÃO FINAL
   ========================================================== */

window.addEventListener("load", () => {

    iniciarTrevos();

    atualizarContador();

   
