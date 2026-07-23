/* ==========================================
   CONFIGURAÇÕES GERAIS
   RIFA SOLIDÁRIA - GILFEST
========================================== */

const CONFIG = {

    /* Dados da campanha */

    titulo: "🎟️ RIFA ENTRE AMIGOS",

    subtitulo: "💙 Em prol da saúde de Dona Bené",

    beneficiada: "Dona Bené",

    premio: "Geladeira Midea Frost Free",

    descricaoPremio:
        "Geladeira Midea Frost Free - Excelente estado.",

    valorNumero: 10.00,

    moeda: "R$",

    /* Sorteio */

    dataSorteio: "2026-12-30T20:00:00",

    localSorteio: "Instagram / WhatsApp",

    /* Quantidade de números */

    totalNumeros: 1000,

    inicioNumero: 0,

    fimNumero: 999,

    digitosNumero: 3,

    /* WhatsApp */

    telefone: "5579999145044",

    telefoneVisual: "(79) 9 9914-5044",

    mensagemWhatsApp:
`Olá!
Tenho interesse em participar da Rifa Solidária da Dona Bené.`,

    /* PIX */

    chavePix: "045.761.515-09",

    nomePix: "GilFest",

    copiarPixMensagem:
        "Chave Pix copiada com sucesso!",

    /* Firebase */

    caminhoReservas: "reservas",

    caminhoPagamentos: "pagamentos",

    caminhoCompradores: "compradores",

    caminhoConfiguracoes: "configuracoes",

    caminhoRaspadinha: "raspadinha",

    caminhoHistorico: "historico",

    /* Raspadinha */

    raspadinha: {

        ativa: true,

        premio: "Liquidificador",

        mensagemPerdeu: [

            "Obrigado por ajudar a Dona Bené ❤️",

            "Sua ajuda faz toda diferença 💙",

            "Boa sorte na rifa principal 🍀",

            "Continue acompanhando o sorteio 🎉"

        ]

    },

    /* Cores */

    tema: {

        primaria: "#1E88E5",

        secundaria: "#EC407A",

        sucesso: "#43A047",

        alerta: "#FB8C00",

        erro: "#E53935",

        fundo: "#F5F8FF",

        texto: "#2C3E50"

    },

    /* Imagens */

    imagens: {

        logo: "img/logo-gilfest.png",

        donaBene: "img/1783887880857.png",

        geladeira1: "img/IMG-20260722-WA0037.jpg",

        geladeira2: "img/IMG-20260722-WA0038.jpg",

        trevo: "img/1784635553196.png"

    }

};

/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */

function numeroFormatado(numero){

    return numero
        .toString()
        .padStart(CONFIG.digitosNumero,"0");

}

function valorFormatado(valor){

    return `${CONFIG.moeda} ${valor.toFixed(2).replace(".",",")}`;

}

console.log("Configurações carregadas.");
