// ==========================================================
// RIFA SOLIDÁRIA — GILFEST
// FIREBASE CONFIGURAÇÃO CENTRAL
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    onValue,
    onChildAdded,
    onChildChanged,
    onChildRemoved
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================================

const firebaseConfig = {

    apiKey: "AIzaSyDr4PL2ljt93p9Yyn1vd1bNWQmFHh3DGxI",

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


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// ==========================================================
// EXPORTAÇÕES
// ==========================================================

export {
    app,
    db,

    ref,
    get,
    set,
    update,
    remove,

    onValue,
    onChildAdded,
    onChildChanged,
    onChildRemoved
};


// ==========================================================
// TESTE DE CONEXÃO
// ==========================================================

const conexaoRef = ref(db, ".info/connected");

onValue(conexaoRef, (snapshot) => {

    const conectado = snapshot.val();

    if (conectado === true) {

        console.log(
            "🔥 Firebase conectado com sucesso!"
        );

    } else {

        console.log(
            "⚠️ Firebase desconectado."
        );

    }

});
