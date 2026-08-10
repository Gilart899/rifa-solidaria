// ============================================================
// FIREBASE — RIFA SOLIDÁRIA | DONA BENÉ
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ============================================================
// CONFIGURAÇÃO DO PROJETO FIREBASE
// ============================================================

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "rifa-solidaria-56274.firebaseapp.com",
    databaseURL: "https://rifa-solidaria-56274-default-rtdb.firebaseio.com",
    projectId: "rifa-solidaria-56274",
    storageBucket: "rifa-solidaria-56274.firebasestorage.app",
    messagingSenderId: "279310238107",
    appId: "1:279310238107:web:fd82a20c11e28a4673a13e"
};


// ============================================================
// INICIALIZAÇÃO
// ============================================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);


// ============================================================
// EXPORTAÇÕES
// ============================================================

export {
    app,
    db,
    auth,

    ref,
    set,
    get,
    update,
    remove,
    onValue
};
