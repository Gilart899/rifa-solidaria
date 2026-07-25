/* ==========================================================
   RIFA SOLIDÁRIA
   script.js
   Parte 1
========================================================== */

"use strict";

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    iniciarCarrossel();

    iniciarContagem();

    configurarPix();

});

/* ==========================================================
   CARROSSEL
========================================================== */

function iniciarCarrossel() {

    const slides = document.querySelectorAll(".slide");

    const btnPrev = document.getElementById("prevSlide");

    const btnNext = document.getElementById("nextSlide");

    if (!slides.length) return;

    let indice = 0;

    function mostrarSlide(posicao) {

        slides.forEach(slide => {

            slide.classList.remove("active");

        });

        slides[posicao].classList.add("active");

    }

    function proximo() {

        indice++;

        if (indice >= slides.length) {

            indice = 0;

        }

        mostrarSlide(indice);

    }

    function anterior() {

        indice--;

        if (indice < 0) {

            indice = slides.length - 1;

        }

        mostrarSlide(indice);

    }

    btnNext?.addEventListener("click", proximo);

    btnPrev?.addEventListener("click", anterior);

    setInterval(proximo, 5000);

}

/* ==========================================================
   CONTAGEM REGRESSIVA
========================================================== */

function iniciarContagem() {

    if (typeof CONFIG === "undefined") return;

    const destino = new Date(CONFIG.dataSorteio);

    atualizar();

    setInterval(atualizar, 1000);

    function atualizar() {

        const agora = new Date();

        const diferenca = destino - agora;

        if (diferenca <= 0) {

            document.getElementById("dias").textContent = "00";

            document.getElementById("horas").textContent = "00";

            document.getElementById("minutos").textContent = "00";

            document.getElementById("segundos").textContent = "00";

            return;

        }

        const dias = Math.floor(diferenca / 86400000);

        const horas = Math.floor((diferenca % 86400000) / 3600000);

        const minutos = Math.floor((diferenca % 3600000) / 60000);

        const segundos = Math.floor((diferenca % 60000) / 1000);

        document.getElementById("dias").textContent =
            String(dias).padStart(2, "0");

        document.getElementById("horas").textContent =
            String(horas).padStart(2, "0");

        document.getElementById("minutos").textContent =
            String(minutos).padStart(2, "0");

        document.getElementById("segundos").textContent =
            String(segundos).padStart(2, "0");

    }

}

/* ==========================================================
   PIX
========================================================== */

function configurarPix() {

    const campo = document.getElementById("pixKey");

    const botao = document.getElementById("copiarPix");

    const toast = document.getElementById("toast");

    if (!campo || !botao) return;

    if (typeof CONFIG !== "undefined") {

        campo.value = CONFIG.pix;
/* ==========================================
   BOTÃO ENVIAR COMPROVANTE
========================================== */

const btnComprovante =
document.getElementById("btnComprovante");

if(btnComprovante){

    const mensagem = encodeURIComponent(

`Olá!

Acabei de realizar o pagamento da Rifa Solidária.

Segue meu comprovante para confirmação.

Obrigado(a)!`

    );

    btnComprovante.href =
    `https://wa.me/557988730207?text=${mensagem}`;

}
    }

    botao.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(campo.value);

            toast.classList.add("show");

            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);

        } catch {

            campo.select();

            document.execCommand("copy");

        }

    });

}
/* =====================================
   RESUMO DA COMPRA
===================================== */

let numeroEscolhido = null;

function atualizarResumo(numero, status = "Disponível") {

    numeroEscolhido = numero;

    document.getElementById("numeroSelecionado").textContent = numero;

    const statusEl = document.getElementById("statusNumero");

    statusEl.textContent = status;

    statusEl.className = "status";

    if (status.includes("Disponível")) {

        statusEl.classList.add("disponivel");

    } else if (status.includes("Reservado")) {

        statusEl.classList.add("reservado");

    } else {

        statusEl.classList.add("vendido");

    }

}
/* ==========================================================
   CONFIGURAÇÃO DA PÁGINA
========================================================== */

function carregarConfiguracoes() {

    if (typeof CONFIG === "undefined") return;

    const premio = document.getElementById("premio");
    const valor = document.getElementById("valor");
    const data = document.getElementById("dataSorteio");
    const whatsapp = document.getElementById("btnWhatsapp");

    if (premio) {
        premio.textContent = CONFIG.premio;
    }

    if (valor) {
        valor.textContent = CONFIG.valor;
    }

    if (data) {
        data.textContent = CONFIG.dataTexto;
    }

    if (whatsapp) {

        const mensagem = encodeURIComponent(
            "Olá! Gostaria de participar da Rifa Solidária."
        );

        whatsapp.href =
            `https://wa.me/${CONFIG.whatsapp}?text=${mensagem}`;
    }

}

/* ==========================================================
   ANIMAÇÃO DOS TREVOS
========================================================== */

function iniciarTrevos() {

    const trevos = document.querySelectorAll(".trevo");

    trevos.forEach((trevo) => {

        trevo.style.animationPlayState = "running";

    });

}

/* ==========================================================
   ANIMAÇÕES DE ENTRADA
========================================================== */

function iniciarAnimacoes() {

    const elementos = document.querySelectorAll(".glass");

    const observer = new IntersectionObserver((entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

            }

        });

    }, {
        threshold: 0.15
    });

    elementos.forEach((elemento) => {

        observer.observe(elemento);

    });

}

/* ==========================================================
   OTIMIZAÇÕES
========================================================== */

window.addEventListener("load", () => {

    carregarConfiguracoes();

    iniciarTrevos();

    iniciarAnimacoes();

});

/* ==========================================================
   REDIMENSIONAMENTO
========================================================== */

window.addEventListener("resize", () => {

    document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
    );

});
/* ==========================================================
   RIFA SOLIDÁRIA
   script.js
   Parte 3 (Final)
========================================================== */

/* ==========================================================
   FIREBASE
========================================================== */

async function atualizarCartelas() {

    try {

        if (typeof carregarCartelas !== "function") {

            console.warn("carregarCartelas() não encontrada.");

            return;

        }

        await carregarCartelas();

    } catch (erro) {

        console.error(
            "Erro ao atualizar cartelas:",
            erro
        );

    }

}

/* ==========================================================
   ATUALIZAÇÃO AUTOMÁTICA
========================================================== */

function iniciarAtualizacaoAutomatica() {

    atualizarCartelas();

    setInterval(() => {

        atualizarCartelas();

    }, 30000);

}

/* ==========================================================
   VISIBILIDADE DA ABA
========================================================== */

document.addEventListener("visibilitychange", () => {

    if (!document.hidden) {

        atualizarCartelas();

    }

});

/* ==========================================================
   CONEXÃO
========================================================== */

window.addEventListener("online", () => {

    console.log("Conexão restaurada.");

    atualizarCartelas();

});

window.addEventListener("offline", () => {

    console.warn("Sem conexão com a internet.");

});

/* ==========================================================
   TRATAMENTO DE ERROS
========================================================== */

window.addEventListener("error", (evento) => {

    console.error(
        "Erro detectado:",
        evento.message
    );

});

window.addEventListener("unhandledrejection", (
