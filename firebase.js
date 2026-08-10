// ============================================================
// 🔥 FIREBASE — RIFA SOLIDÁRIA
// Projeto: Rifa Solidária | Dona Bené
// ============================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    onValue
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ============================================================
// 🔥 CONFIGURAÇÃO DO FIREBASE
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyDr4PL2ljt93p9Yyn1vd1bNWQmFHh3DGxI",

    authDomain:
        "rifa-solidaria-56274.firebaseapp.com",

    databaseURL:
        "https://rifa-solidaria-56274-default-rtdb.firebaseio.com",

    projectId:
        "rifa-solidaria-56274",

    storageBucket:
        "rifa-solidaria-56274.firebasestorage.app",

    messagingSenderId:
        "279310238107",

    appId:
        "1:279310238107:web:fd82a20c11e28a4673a13e"

};


// ============================================================
// 🚀 INICIALIZAÇÃO
// ============================================================

const app =
    initializeApp(firebaseConfig);

const database =
    getDatabase(app);


// ============================================================
// 📌 REFERÊNCIA PRINCIPAL DA RIFA
// ============================================================

const rifaRef =
    ref(database, "rifa");


// ============================================================
// 📤 EXPORTAÇÕES
// ============================================================

export {

    app,

    database,

    rifaRef,

    ref,

    get,

    set,

    update,

    remove,

    onValue

};
