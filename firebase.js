/* ==========================================
   FIREBASE
========================================== */

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}


const database =
    firebase.database();


const reservasRef =
    database.ref(
        CONFIG.caminhoReservas
    );
/* ===========================
   Firebase
=========================== */

caminhoReservas: "reservas",

/* ==========================================
   VARIÁVEIS
========================================== */

let numerosReservados = [];

/* ==========================================
   CARREGAR RESERVAS
========================================== */

function carregarReservas(callback) {

    reservasRef.on("value", (snapshot) => {

        numerosReservados = [];

        snapshot.forEach((item) => {

            const dados = item.val();

            if (dados && dados.numero) {
                numerosReservados.push(dados.numero);
            }

        });

        if (typeof callback === "function") {
            callback();
        }

    });

}
/* ==========================================
   SALVAR RESERVA
========================================== */

function salvarReserva(dados) {

    return reservasRef.push({
        numero: dados.numero,
        nome: dados.nome,
        telefone: dados.telefone,
        cidade: dados.cidade || "",
        observacao: dados.observacao || "",
        status: "reservado",
        data: Date.now()
    });

}

/* ==========================================
   CONFIRMAR PAGAMENTO
========================================== */

function confirmarPagamento(id) {

    return reservasRef.child(id).update({
        status: "pago"
    });

}

/* ==========================================
   EXCLUIR RESERVA
========================================== */

function excluirReserva(id) {

    if (!confirm("Deseja realmente excluir esta reserva?")) {
        return;
    }

    return reservasRef.child(id).remove();

}

/* ==========================================
   BUSCAR NÚMERO
========================================== */

function numeroReservado(numero) {

    return numerosReservados.includes(numero);

}
/* ==========================================
   MONITORAR CONEXÃO
========================================== */

const conectadoRef = firebase.database().ref(".info/connected");

conectadoRef.on("value", (snapshot) => {

    if (snapshot.val() === true) {

        console.log("✅ Firebase conectado.");

    } else {

        console.warn("⚠️ Firebase desconectado.");

    }

});

/* ==========================================
   TRATAMENTO DE ERROS
========================================== */

reservasRef.on("error", (erro) => {

    console.error("Erro no Firebase:", erro);

});

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    carregarReservas(() => {

        console.log(
            `Reservas carregadas: ${numerosReservados.length}`
        );

    });

});
