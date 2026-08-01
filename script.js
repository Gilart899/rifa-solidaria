// ==========================================================
// config.js
// Rifa Solidária - GilFest
// Configurações Globais
// ==========================================================

export const CONFIG = {

    // Dados da Rifa
    titulo: "🎟️ Rifa Solidária",

    subtitulo: "Em prol da saúde de Dona Benedita",

    premio: "Geladeira Midea Frost Free",

    valorNumero: 10,

    totalNumeros: 1000,
primeiroNumero: 0,
    primeiraCartela: 1,

    ultimaCartela: 10,

    numerosPorCartela: 100,

    // Sorteio
    dataSorteio: "2026-12-30T20:00:00",

    // PIX
    chavePix: "",

    titularPix: "Maria Josivania Claudino França",

    bancoPix: "Banco Neon",

    // WhatsApp
    whatsapp: "55799988730207",

    mensagemWhatsapp:
        "Olá! Gostaria de participar da Rifa Solidária.",

    mensagemComprovante:
        "Olá! Estou enviando meu comprovante de pagamento.",

    // Status dos números
    status: {

        DISPONIVEL: "disponivel",

        RESERVADO: "reservado",

        VENDIDO: "vendido"

    },

    // Tema
    tema: {

        azul: "#2563eb",

        rosa: "#ec4899",

        branco: "#ffffff"

    },

    // Animações
    animacao: {

    carrossel: 5000,

    toast: 3000

},

reserva: {

    tempoMinutos: 30

}
};// ==========================================================
// config.js
// Parte 2/2
// Funções auxiliares
// ==========================================================

// ----------------------------------------------------------
// FORMATAÇÃO
// ----------------------------------------------------------

export function formatarNumero(numero) {

    return String(numero).padStart(3, "0");

}

export function formatarMoeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}

// ----------------------------------------------------------
// CARTELAS
// ----------------------------------------------------------

export function obterCartela(numero) {

    return Math.floor(Number(numero) / 100) + 1;

}

export function intervaloCartela(cartela) {

    const inicio = (cartela - 1) * 100;

    const fim = inicio + 99;

    return {

        inicio,

        fim

    };

}

// ----------------------------------------------------------
// WHATSAPP
// ----------------------------------------------------------

export function criarLinkWhatsapp(texto = "") {

    const mensagem = encodeURIComponent(

        texto || CONFIG.mensagemWhatsapp

    );

    return `https://wa.me/${CONFIG.whatsapp}?text=${mensagem}`;

}

// ----------------------------------------------------------
// VALIDAÇÕES
// ----------------------------------------------------------

export function numeroValido(numero) {

    return (

        Number.isInteger(Number(numero)) &&

        Number(numero) >= 0 &&

        Number(numero) < CONFIG.totalNumeros

    );

}

// ----------------------------------------------------------
// CONTAGEM
// ----------------------------------------------------------

export function calcularTempoRestante() {

    const destino = new Date(CONFIG.dataSorteio).getTime();

    const agora = Date.now();

    const diferenca = Math.max(0, destino - agora);

    return {

        dias: Math.floor(diferenca / 86400000),

        horas: Math.floor((diferenca % 86400000) / 3600000),

        minutos: Math.floor((diferenca % 3600000) / 60000),

        segundos: Math.floor((diferenca % 60000) / 1000)

    };

}

// ----------------------------------------------------------
// CONGELAR CONFIGURAÇÃO
// ----------------------------------------------------------

Object.freeze(CONFIG.status);
Object.freeze(CONFIG.tema);
Object.freeze(CONFIG.animacao);
Object.freeze(CONFIG);
