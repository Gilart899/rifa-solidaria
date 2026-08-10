// ==========================================================
// RIFA SOLIDÁRIA — GILFEST
// INICIALIZAÇÃO DO BANCO FIREBASE
// ==========================================================

import {
    db,
    ref,
    get,
    set
} from "./firebase.js";


// ==========================================================
// CONFIGURAÇÃO INICIAL
// ==========================================================

const CONFIGURACAO = {

    nome: "RIFA ENTRE AMIGOS",

    beneficiada: "Dona Bené",

    premioPrincipal:
        "Geladeira Midea Frost Free",

    valorNumero: 10,

    totalNumeros: 1000,

    numerosPorCartela: 100,

    totalCartelas: 10,

    dataSorteio: "2026-12-30"

};


// ==========================================================
// CONFIGURAÇÃO DA RASPADINHA
// ==========================================================

const CONFIGURACAO_RASPADINHA = {

    ativa: true,

    novasChances: 20,

    permitirEncadeamento: true

};


// ==========================================================
// PRÊMIOS DA RASPADINHA
// ==========================================================
//
// Inicialmente deixamos os números vazios.
// Você poderá definir pelo painel administrativo.
//
// NÃO coloque números aqui manualmente.
// O sistema administrativo fará isso depois.
// ==========================================================

const PREMIOS_RASPADINHA = {

    liquidificador: {

        numero: "",

        ativo: true

    },

    ferroEletrico: {

        numero: "",

        ativo: true

    }

};


// ==========================================================
// CRIAR CARTELAS
// ==========================================================

function criarCartelas() {

    const cartelas = {};

    for (
        let cartela = 1;
        cartela <= CONFIGURACAO.totalCartelas;
        cartela++
    ) {

        const inicio =
            (cartela - 1) *
            CONFIGURACAO.numerosPorCartela;

        const fim =
            inicio +
            CONFIGURACAO.numerosPorCartela -
            1;

        cartelas[cartela] = {

            numero: cartela,

            inicio: inicio,

            fim: fim,

            quantidade:
                CONFIGURACAO.numerosPorCartela

        };

    }

    return cartelas;

}


// ==========================================================
// DESCOBRIR CARTELA DO NÚMERO
// ==========================================================

function descobrirCartela(numero) {

    return (
        Math.floor(
            numero /
            CONFIGURACAO.numerosPorCartela
        ) + 1
    );

}


// ==========================================================
// FORMATAR NÚMERO
// ==========================================================

function formatarNumero(numero) {

    return String(numero).padStart(3, "0");

}


// ==========================================================
// CRIAR OS 1.000 NÚMEROS
// ==========================================================

function criarNumeros() {

    const numeros = {};

    for (
        let i = 0;
        i < CONFIGURACAO.totalNumeros;
        i++
    ) {

        const numero =
            formatarNumero(i);

        numeros[numero] = {

            numero: numero,

            cartela:
                descobrirCartela(i),

            status:
                "disponivel",

            nome: "",

            whatsapp: "",

            pagamento: false,

            raspadinhaLiberada: false,

            raspadinhaUsada: false,

            criadoEm:
                new Date().toISOString()

        };

    }

    return numeros;

}


// ==========================================================
// CRIAR ESTRUTURA DE NOVAS CHANCES
// ==========================================================

function criarNovasChances() {

    const novasChances = {};

    // Criamos somente a estrutura.
    //
    // Os 20 números serão definidos posteriormente
    // pelo painel administrativo.
    //
    // Isso evita que sejam escolhidos automaticamente
    // sem você confirmar.

    for (let i = 1; i <= 20; i++) {

        novasChances[`chance${i}`] = {

            numero: "",

            ativo: false

        };

    }

    return novasChances;

}


// ==========================================================
// CRIAR ESTRUTURA COMPLETA
// ==========================================================

async function inicializarBanco() {

    console.log(
        "🚀 Iniciando configuração da Rifa Solidária..."
    );


    // ------------------------------------------------------
    // VERIFICAR SE JÁ EXISTE
    // ------------------------------------------------------

    const rifaRef =
        ref(db, "rifa");

    const snapshot =
        await get(rifaRef);


    if (snapshot.exists()) {

        console.warn(
            "⚠️ A estrutura 'rifa' já existe no Firebase."
        );

        console.warn(
            "Nenhum dado foi sobrescrito."
        );

        return;

    }


    // ------------------------------------------------------
    // CRIAR ESTRUTURA
    // ------------------------------------------------------

    const estrutura = {

        configuracao:
            CONFIGURACAO,


        cartelas:
            criarCartelas(),


        numeros:
            criarNumeros(),


        raspadinha: {

            configuracao:
                CONFIGURACAO_RASPADINHA,

            premios:
                PREMIOS_RASPADINHA,

            novasChances:
                criarNovasChances(),

            jogadas: {}

        },


        criadoEm:
            new Date().toISOString()

    };


    // ------------------------------------------------------
    // GRAVAR NO FIREBASE
    // ------------------------------------------------------

    await set(
        rifaRef,
        estrutura
    );


    console.log(
        "✅ Banco criado com sucesso!"
    );

    console.log(
        "🎟️ 10 cartelas criadas."
    );

    console.log(
        "🔢 1.000 números criados."
    );

    console.log(
        "🍀 Estrutura da raspadinha criada."
    );

    console.log(
        "🥤 Liquidificador preparado."
    );

    console.log(
        "🔥 Ferro elétrico preparado."
    );

    console.log(
        "🎲 20 espaços de nova chance preparados."
    );

}


// ==========================================================
// EXECUTAR
// ==========================================================

inicializarBanco()

    .then(() => {

        console.log(
            "🏁 Processo finalizado."
        );

    })

    .catch((erro) => {

        console.error(
            "❌ Erro ao inicializar o Firebase:"
        );

        console.error(erro);

    });
