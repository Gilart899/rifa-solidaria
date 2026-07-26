// ==========================================================
// admin.js
// Painel Administrativo
// Rifa Solidária
// ==========================================================

import {

    auth,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    numerosRef,

    participantesRef,

    estatisticasRef,

    configRef,

    get,

    onValue,

    update

} from "./firebase.js";

import {

    formatarNumero

} from "./utils.js";

// ==========================================================
// ESTADO
// ==========================================================

const ADMIN = {

    usuario: null,

    numeros: {},

    participantes: {},

    estatisticas: {},

    configuracao: {}

};

// ==========================================================
// ELEMENTOS
// ==========================================================

const loginBox = document.getElementById("login");

const painel = document.getElementById("painel");

const email = document.getElementById("email");

const senha = document.getElementById("senha");

const btnEntrar = document.getElementById("btnEntrar");

const btnSair = document.getElementById("btnSair");

// ==========================================================
// INICIAR
// ==========================================================

window.addEventListener("load", iniciarAdmin);

function iniciarAdmin(){

    verificarLogin();

    registrarEventos();

}

// ==========================================================
// EVENTOS
// ==========================================================

function registrarEventos(){

    if(btnEntrar){

        btnEntrar.addEventListener(

            "click",

            fazerLogin

        );

    }

    if(btnSair){

        btnSair.addEventListener(

            "click",

            sair

        );

    }

}

// ==========================================================
// LOGIN
// ==========================================================

async function fazerLogin(){

    try{

        await signInWithEmailAndPassword(

            auth,

            email.value,

            senha.value

        );

    }

    catch(e){

        alert("Usuário ou senha inválidos.");

    }

}

// ==========================================================
// LOGOUT
// ==========================================================

async function sair(){

    await signOut(auth);

}

// ==========================================================
// OBSERVADOR
// ==========================================================

function verificarLogin(){

    onAuthStateChanged(

        auth,

        async(usuario)=>{

            ADMIN.usuario=usuario;

            if(usuario){

                abrirPainel();

            }

            else{

                abrirLogin();

            }

        }

    );

}

// ==========================================================
// TELAS
// ==========================================================

function abrirPainel(){

    if(loginBox)

        loginBox.style.display="none";

    if(painel)

        painel.style.display="block";

    carregarSistema();

}

function abrirLogin(){

    if(loginBox)

        loginBox.style.display="block";

    if(painel)

        painel.style.display="none";

}// ==========================================================
// CARREGAMENTO DO SISTEMA
// ==========================================================

function carregarSistema() {

    carregarNumeros();

    carregarParticipantes();

    carregarEstatisticas();

    carregarConfiguracoes();

    registrarPesquisa();

}

// ==========================================================
// NÚMEROS
// ==========================================================

function carregarNumeros() {

    onValue(numerosRef, (snapshot) => {

        if (!snapshot.exists()) return;

        ADMIN.numeros = snapshot.val();

        atualizarTabelaNumeros();

    });

}

// ==========================================================
// PARTICIPANTES
// ==========================================================

function carregarParticipantes() {

    onValue(participantesRef, (snapshot) => {

        if (!snapshot.exists()) {

            ADMIN.participantes = {};

            return;

        }

        ADMIN.participantes = snapshot.val();

    });

}

// ==========================================================
// ESTATÍSTICAS
// ==========================================================

function carregarEstatisticas() {

    onValue(estatisticasRef, (snapshot) => {

        if (!snapshot.exists()) return;

        ADMIN.estatisticas = snapshot.val();

        atualizarEstatisticas();

    });

}

// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

function carregarConfiguracoes() {

    onValue(configRef, (snapshot) => {

        if (!snapshot.exists()) return;

        ADMIN.configuracao = snapshot.val();

        preencherConfiguracoes();

    });

}

// ==========================================================
// TABELA DOS NÚMEROS
// ==========================================================

function atualizarTabelaNumeros() {

    const tabela = document.getElementById("listaNumeros");

    if (!tabela) return;

    tabela.innerHTML = "";

    Object.keys(ADMIN.numeros)

        .sort()

        .forEach((numero) => {

            const dados = ADMIN.numeros[numero];

            const linha = document.createElement("tr");

            linha.innerHTML = `

                <td>${numero}</td>

                <td>${dados.nome || "-"}</td>

                <td>${dados.telefone || "-"}</td>

                <td>${dados.status}</td>

                <td>

                    <button class="btnEditar
                    // ==========================================================
// EDITAR NÚMERO
// ==========================================================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btnEditar")) return;

    const numero = e.target.dataset.numero;

    abrirEditor(numero);

});

function abrirEditor(numero) {

    const dados = ADMIN.numeros[numero];

    if (!dados) return;

    document.getElementById("editarNumero").value = numero;

    document.getElementById("editarNome").value =
        dados.nome || "";

    document.getElementById("editarTelefone").value =
        dados.telefone || "";

    document.getElementById("editarStatus").value =
        dados.status || "disponivel";

    document
        .getElementById("modalEditar")
        .classList.add("ativo");

}

// ==========================================================
// SALVAR ALTERAÇÕES
// ==========================================================

const btnSalvar = document.getElementById("btnSalvarNumero");

if (btnSalvar) {

    btnSalvar.addEventListener(

        "click",

        salvarNumero

    );

}

async function salvarNumero() {

    const numero =
        document.getElementById("editarNumero").value;

    const nome =
        document.getElementById("editarNome").value.trim();

    const telefone =
        document.getElementById("editarTelefone").value.trim();

    const status =
        document.getElementById("editarStatus").value;

    try {

        await update(

            ref(db, `numeros/${numero}`),

            {

                nome,

                telefone,

                status

            }

        );

        fecharEditor();

        alert("
