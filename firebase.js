// ======================================
// firebase.js
// Firebase v10
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    push,
    remove,
    child,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ======================================
// Configuração Firebase
// ======================================

const firebaseConfig = {

    apiKey: "AIzaSyDr4PL2ljt93p9Yyn1vd1bNWQmFHh3DGxI",

    authDomain: "rifa-solidaria-56274.firebaseapp.com",

    databaseURL: "https://rifa-solidaria-56274-default-rtdb.firebaseio.com",

    projectId: "rifa-solidaria-56274",

    storageBucket: "rifa-solidaria-56274.firebasestorage.app",

    messagingSenderId: "279310238107",

    appId: "1:279310238107:web:fd82a20c11e28a4673a13e"

};

// ======================================
// Inicialização
// ======================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);

// ======================================
// Referências principais
// ======================================

const dbRoot = ref(db);

const numerosRef = ref(db, "numeros");

const participantesRef = ref(db, "participantes");

const configRef = ref(db, "config");

const avisosRef = ref(db, "avisos");

const estatisticasRef = ref(db, "estatisticas");

// ======================================
// Exportações
// ======================================

export {

    app,

    db,

    auth,

    dbRoot,

    numerosRef,

    participantesRef,

    configRef,

    avisosRef,

    estatisticasRef,

    ref,

    child,

    get,

    set,

    update,

    remove,

    push,

    onValue,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

};
