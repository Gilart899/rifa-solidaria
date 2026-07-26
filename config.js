// ======================================
// config.js
// Configurações da Rifa Solidária
// ======================================

export const CONFIG = {

    // Informações da campanha
    campanha: "Rifa Solidária",

    beneficiada: "Maria Josivania Claudino França",

    premio: "TV LG 32 Polegadas",

    descricao:
        "Participe da nossa rifa solidária e concorra a uma TV LG 32 polegadas.",

    // Valores
    valorNumero: 10.00,

    moeda: "BRL",

    // Quantidade de números
    totalNumeros: 1000,

    totalCartelas: 10,

    numerosPorCartela: 100,

    // PIX
    pix: {

        titular: "Maria Josivania Claudino França",

        chave: "79988730207",

        banco: "Neon"

    },

    // WhatsApp
    whatsapp: {

        numero: "5579988730207",

        mensagem:
`Olá!
Gostaria de reservar os seguintes números da Rifa Solidária:

{NUMEROS}

Nome:

Vou realizar o pagamento via PIX e enviar o comprovante.`

    },

    // Sorteio
    sorteio: {

        data: "2026-08-21",

        hora: "18:00"

    },

    // Firebase
    firebase: {

        databaseURL:
            "https://rifa-solidaria-56274-default-rtdb.firebaseio.com/"

    },

    // Status dos números
    status: {

        DISPONIVEL: "disponivel",

        RESERVADO: "reservado",

        VENDIDO: "vendido"

    }

};

// ======================================
// Funções auxiliares
// ======================================

export function formatarNumero(numero) {

    return Number(numero)
        .toString()
        .padStart(3, "0");

}

export function descobrirCartela(numero) {

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
