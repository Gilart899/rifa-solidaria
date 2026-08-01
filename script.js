// ==========================================================
// firebase.js
// Rifa Solidária - GilFest
// Firebase v12+
// Parte 1/3
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getDatabase,
    ref,
    child,
    get,
    set,
    update,
    push,
    remove,
    onValue,
    off,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// ==========================================================
// CONFIGURAÇÃO
// ==========================================================

const firebaseConfig = {

    apiKey: "SUA_API_KEY",

    authDomain: "rifa-solidaria-56274.firebaseapp.com",

    databaseURL:
    "https://rifa-solidaria-56274-default-rtdb.firebaseio.com",

    projectId: "rifa-solidaria-56274",

    storageBucket:
    "rifa-solidaria-56274.firebasestorage.app",

    messagingSenderId: "SEU_MESSAGING_SENDER_ID",

    appId: "SEU_APP_ID"

};

// ==========================================================
// APP
// ==========================================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

// ==========================================================
// REFERÊNCIAS PRINCIPAIS
// ==========================================================

const numerosRef =
    ref(db, "numeros");

const participantesRef =
    ref(db, "participantes");

const configRef =
    ref(db, "config");

const estatisticasRef =
    ref(db, "estatisticas");

const avisosRef =
    ref

// ==========================================================
// firebase.js
// Parte 2/3
// Funções auxiliares
// ==========================================================

// ------------------------------
// CRIAR REFERÊNCIA PERSONALIZADA
// ------------------------------

function criarRef(caminho) {

    return ref(db, caminho);

}

// ------------------------------
// OBTER DADOS
// ------------------------------

async function obterDados(referencia) {

    const snapshot = await get(referencia);

    if (snapshot.exists()) {

        return snapshot.val();

    }

    return null;

}

// ------------------------------
// SALVAR DADOS
// ------------------------------

async function salvarDados(referencia, dados) {

    return await set(referencia, dados);

}

// ------------------------------
// ATUALIZAR DADOS
// ------------------------------

async function atualizarDados(referencia, dados) {

    return await update(referencia, dados);

}

// ------------------------------
// ADICIONAR REGISTRO
// ------------------------------

async function adicionarDados(referencia, dados) {

    return await push(referencia, dados);

}

// ------------------------------
// REMOVER REGISTRO
// ------------------------------

async function removerDados(referencia) {

    return await remove(referencia);

}

// ------------------------------
// OUVIR ALTERAÇÕES
// ------------------------------

function ouvirDados(referencia, callback) {

    return onValue(referencia, callback);

}

// ------------------------------
// PARAR DE OUVIR
// ------------------------------

function pararListener(referencia) {

    off(referencia);

}

// ------------------------------
// REFERÊNCIA POR NÚMERO
// ------------------------------

function numeroRef(numero) {

    return ref(db, `numeros/${numero}`);

}

// ------------------------------
// REFERÊNCIA POR PARTICIPANTE
// ------------------------------

function participanteRef(id) {

    return ref(db, `participantes/${id}`);

}

// ------------------------------
// REFERÊNCIA POR RESERVA
// ------------------------------

function reserva

// ==========================================================
// firebase.js
// Parte 3/3
// Exports finais
// ==========================================================

export {

    // Firebase
    db,

    // Métodos
    ref,
    child,
    get,
    set,
    update,
    push,
    remove,
    onValue,
    off,
    serverTimestamp,

    // Referências principais
    numerosRef,
    participantesRef,
    configRef,
    estatisticasRef,
    avisosRef,
    sorteioRef,
    reservasRef,
    administradoresRef,

    // Funções auxiliares
    criarRef,
    obterDados,
    salvarDados,
    atualizarDados,
    adicionarDados,
    removerDados,
    ouvirDados,
    pararListener,

    // Referências específicas
    numeroRef,
    participanteRef,
    reservaRef

};
