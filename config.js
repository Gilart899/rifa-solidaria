// ============================================================
// 🎟️ RIFA ENTRE AMIGOS — CONFIGURAÇÕES
// Projeto: Rifa Solidária | Dona Bené
// ============================================================

export const CONFIG = {

    // --------------------------------------------------------
    // 🎟️ IDENTIFICAÇÃO DA RIFA
    // --------------------------------------------------------

    nomeRifa: "RIFA ENTRE AMIGOS",

    titulo: "Rifa Solidária",

    beneficiada: "Dona Bené",

    descricao:
        "Em prol da realização dos exames de Dona Benedita",

    // --------------------------------------------------------
    // 🎁 PREMIAÇÃO
    // --------------------------------------------------------

    premio:
        "Geladeira Midea Frost Free",

    // --------------------------------------------------------
    // 💰 VALORES
    // --------------------------------------------------------

    valorNumero: 10.00,

    moeda: "BRL",

    // --------------------------------------------------------
    // 🎟️ NÚMEROS
    // --------------------------------------------------------

    quantidadeNumeros: 1000,

    primeiroNumero: 0,

    ultimoNumero: 999,

    numerosPorCartela: 100,

    quantidadeCartelas: 10,

    // --------------------------------------------------------
    // 🛒 COMPRA
    // --------------------------------------------------------

    minimoNumerosPorCompra: 1,

    maximoNumerosPorCompra: 10,

    // --------------------------------------------------------
    // 📅 SORTEIO
    // --------------------------------------------------------

    dataSorteio: "2026-12-30T19:00:00-03:00",

    textoSorteio:
        "30 de dezembro de 2026",

    // --------------------------------------------------------
    // 🎟️ CARTELAS
    // --------------------------------------------------------

    cartelas: [
        {
            numero: 1,
            inicio: 0,
            fim: 99
        },

        {
            numero: 2,
            inicio: 100,
            fim: 199
        },

        {
            numero: 3,
            inicio: 200,
            fim: 299
        },

        {
            numero: 4,
            inicio: 300,
            fim: 399
        },

        {
            numero: 5,
            inicio: 400,
            fim: 499
        },

        {
            numero: 6,
            inicio: 500,
            fim: 599
        },

        {
            numero: 7,
            inicio: 600,
            fim: 699
        },

        {
            numero: 8,
            inicio: 700,
            fim: 799
        },

        {
            numero: 9,
            inicio: 800,
            fim: 899
        },

        {
            numero: 10,
            inicio: 900,
            fim: 999
        }
    ],

    // --------------------------------------------------------
    // 💳 PIX
    // --------------------------------------------------------

    pix: {

        chave: "",

        titular:
            "Maria Josivania Claudino França",

        banco:
            "Banco Neon"

    },

    // --------------------------------------------------------
    // 📱 WHATSAPP
    // --------------------------------------------------------

    whatsapp: {

        numero: "",

        mensagemInicial:
            "Olá! Tenho interesse em participar da Rifa Solidária."

    },

    // --------------------------------------------------------
    // 🎁 RASPADINHA
    // --------------------------------------------------------

    raspadinha: {

        ativa: true,

        nome:
            "Raspadinha da Amizade",

        premios: [
            "Liquidificador",
            "Ferro elétrico"
        ]

    },

    // --------------------------------------------------------
    // 🎨 APARÊNCIA
    // --------------------------------------------------------

    tema: {

        principal: "#071b08",

        verde:
            "#7cff00",

        verdeEscuro:
            "#0b3d0d",

        azul:
            "#1597ff",

        texto:
            "#ffffff"

    }

};


// ============================================================
// 🔧 FUNÇÕES AUXILIARES
// ============================================================

/**
 * Formata um número da rifa com três dígitos.
 *
 * Exemplos:
 * 0   → 000
 * 7   → 007
 * 63  → 063
 * 750 → 750
 */
export function formatarNumero(numero) {

    return String(numero)
        .padStart(3, "0");

}


/**
 * Descobre automaticamente em qual cartela
 * determinado número está.
 *
 * Exemplo:
 * 063 → cartela 1
 * 250 → cartela 3
 * 750 → cartela 8
 */
export function descobrirCartela(numero) {

    numero = Number(numero);

    if (
        Number.isNaN(numero) ||
        numero < CONFIG.primeiroNumero ||
        numero > CONFIG.ultimoNumero
    ) {

        return null;

    }

    return Math.floor(
        numero / CONFIG.numerosPorCartela
    ) + 1;

}


/**
 * Retorna os limites da cartela.
 *
 * Exemplo:
 * descobrirLimitesCartela(8)
 *
 * retorna:
 * {
 *   inicio: 700,
 *   fim: 799
 * }
 */
export function descobrirLimitesCartela(cartela) {

    const dados =
        CONFIG.cartelas.find(
            item => item.numero === Number(cartela)
        );

    return dados || null;

}


/**
 * Formata valores em reais.
 *
 * Exemplo:
 * 10 → R$ 10,00
 */
export function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}
