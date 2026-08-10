// ============================================================
// 🎟️ RIFA SOLIDÁRIA — CONTROLE DA PÁGINA PRINCIPAL
// ============================================================

import {
    database,
    ref,
    get,
    onValue
} from "./firebase.js";

import {
    CONFIG
} from "./config.js";


// ============================================================
// ELEMENTOS DA INTERFACE
// ============================================================

const elementos = {

    premio:
        document.getElementById("premio"),

    valor:
        document.getElementById("valor"),

    dataSorteio:
        document.getElementById("dataSorteio"),

    pixKey:
        document.getElementById("pixKey"),

    btnWhatsapp:
        document.getElementById("btnWhatsapp"),

    btnComprovante:
        document.getElementById("btnComprovante")

};


// ============================================================
// 💰 FORMATAÇÃO DE VALORES
// ============================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ============================================================
// 📅 ATUALIZAR INFORMAÇÕES DA RIFA
// ============================================================

function atualizarInterface() {

    if (elementos.premio) {

        elementos.premio.textContent =
            CONFIG.premio;

    }


    if (elementos.valor) {

        elementos.valor.textContent =
            formatarMoeda(
                CONFIG.valorNumero
            );

    }


    if (elementos.dataSorteio) {

        elementos.dataSorteio.textContent =
            CONFIG.textoDataSorteio;

    }


    if (elementos.pixKey) {

        elementos.pixKey.value =
            CONFIG.pix.chave;

    }

}


// ============================================================
// 📲 WHATSAPP
// ============================================================

function configurarWhatsApp() {

    if (!CONFIG.whatsapp) {

        return;

    }


    const numero =
        CONFIG.whatsapp.replace(
            /\D/g,
            ""
        );


    const mensagem =
        encodeURIComponent(
            "Olá! Quero participar da Rifa Entre Amigos."
        );


    const url =
        `https://wa.me/${numero}?text=${mensagem}`;


    if (elementos.btnWhatsapp) {

        elementos.btnWhatsapp.href =
            url;

    }


    if (elementos.btnComprovante) {

        const mensagemComprovante =
            encodeURIComponent(
                "Olá! Estou enviando o comprovante do pagamento da Rifa Entre Amigos."
            );


        elementos.btnComprovante.href =
            `https://wa.me/${numero}?text=${mensagemComprovante}`;

    }

}


// ============================================================
// 🔥 VERIFICAR CONEXÃO COM FIREBASE
// ============================================================

async function verificarFirebase() {

    try {

        const referencia =
            ref(
                database,
                "rifa/configuracao"
            );


        const snapshot =
            await get(
                referencia
            );


        if (snapshot.exists()) {

            console.log(
                "🔥 Firebase conectado."
            );

            console.log(
                "⚙️ Configuração encontrada:",
                snapshot.val()
            );

        }
        else {

            console.warn(
                "⚠️ A estrutura da rifa ainda não foi criada."
            );

        }

    }

    catch (erro) {

        console.error(
            "❌ Erro ao conectar ao Firebase:",
            erro
        );

    }

}


// ============================================================
// 👂 OBSERVAR ALTERAÇÕES NO FIREBASE
// ============================================================

function observarConfiguracao() {

    const referencia =
        ref(
            database,
            "rifa/configuracao"
        );


    onValue(
        referencia,
        snapshot => {

            if (!snapshot.exists()) {

                return;

            }


            const dados =
                snapshot.val();


            console.log(
                "🔄 Configuração atualizada:",
                dados
            );

        },

        erro => {

            console.error(
                "❌ Erro ao observar Firebase:",
                erro
            );

        }

    );

}


// ============================================================
// 🚀 INICIALIZAÇÃO
// ============================================================

function iniciar() {

    console.log(
        "🎟️ Rifa Solidária iniciada."
    );


    atualizarInterface();

    configurarWhatsApp();

    verificarFirebase();

    observarConfiguracao();

}


// ============================================================
// ▶️ EXECUTAR
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciar
    );

}
else {

    iniciar();

}
