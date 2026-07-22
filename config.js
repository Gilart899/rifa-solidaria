/* ==========================================
   CONFIGURAÇÕES DA RIFA
========================================== */

const CONFIG = {

    // Informações principais
    titulo: "Rifa Beneficente",

    beneficiada: "Benedita Laranjeiras dos Santos",

    premio: "Geladeira Midea Frost Free",

    valorNumero: 10,

    dataSorteio: "30/12/2026",

    resultado:
    "1ª Premiação da Loteria Federal",


    // Números da rifa
    quantidadeNumeros: 1000,

    numerosPorCartela: 100,


    // Pagamento
    pixChave:
    "588.472.355-53",


    // Contato
    whatsapp:
    "5579999145044",


    // Firebase
    caminhoReservas:
    "reservas",

    // Admin
    senhaAdmin: "123456",

    // Cartelas
    quantidadeCartelas: 10,

    // Imagens
    imagens: [
        "img/premio1.jpg",
        "img/premio2.jpg",
        "img/premio3.jpg"
    ]

};

/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */

function formatarNumero(numero) {
    return numero.toString().padStart(3, "0");
}

function totalDisponiveis(reservados) {
    return CONFIG.quantidadeNumeros - reservados;
}

function percentualReservado(reservados) {
    return (
        (reservados / CONFIG.quantidadeNumeros) * 100
    ).toFixed(1);
}
