// ===============================
// Firebase v10+
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    push,
    child,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDr4PL2ljt93p9Yyn1vd1bNWQmFHh3DGxI",
// ===================================
// Referência raiz do banco
// ===================================

const dbRoot = ref(db);
    authDomain: "rifa-solidaria-56274.firebaseapp.com",

    databaseURL: "https://rifa-solidaria-56274-default-rtdb.firebaseio.com",

    projectId: "rifa-solidaria-56274",

    storageBucket: "rifa-solidaria-56274.firebasestorage.app",

    messagingSenderId: "279310238107",

    appId: "1:279310238107:web:fd82a20c11e28a4673a13e"

};

const app = initializeApp(firebaseConfig);
const dbRoot = ref(db);
const db = getDatabase(app);

const auth = getAuth(app);

export {
    dbRoot,
    firebaseConfig,
    app,

    db,

    auth,

    firebaseConfig,

    ref,

    set,

    get,

    update,

    remove,

    push,

    child,

    onValue,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

};
