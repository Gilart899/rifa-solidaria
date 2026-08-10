// ==========================================================
// RIFA SOLIDÁRIA — GILFEST
// AUTENTICAÇÃO DO ADMINISTRADOR
// ==========================================================

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { app } from "./firebase.js";


// ==========================================================
// FIREBASE AUTHENTICATION
// ==========================================================

const auth = getAuth(app);


// ==========================================================
// LOGIN
// ==========================================================

async function entrarAdmin(email, senha) {

    if (!email || !senha) {

        throw new Error(
            "Informe o e-mail e a senha."
        );

    }

    try {

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                senha
            );

        console.log(
            "🔐 Administrador autenticado:",
            resultado.user.email
        );

        return resultado.user;

    } catch (erro) {

        console.error(
            "❌ Erro no login:",
            erro
        );

        let mensagem =
            "Não foi possível entrar.";

        switch (erro.code) {

            case "auth/invalid-email":

                mensagem =
                    "O e-mail informado é inválido.";

                break;


            case "auth/user-not-found":

                mensagem =
                    "Usuário não encontrado.";

                break;


            case "auth/wrong-password":

                mensagem =
                    "Senha incorreta.";

                break;


            case "auth/invalid-credential":

                mensagem =
                    "E-mail ou senha incorretos.";

                break;


            case "auth/too-many-requests":

                mensagem =
                    "Muitas tentativas. Aguarde alguns minutos.";

                break;

        }

        throw new Error(mensagem);

    }

}


// ==========================================================
// SAIR
// ==========================================================

async function sairAdmin() {

    try {

        await signOut(auth);

        console.log(
            "🔓 Administrador desconectado."
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao sair:",
            erro
        );

        throw erro;

    }

}


// ==========================================================
// OBSERVAR ESTADO DO LOGIN
// ==========================================================

function observarAutenticacao(callback) {

    return onAuthStateChanged(
        auth,
        (usuario) => {

            if (usuario) {

                console.log(
                    "🟢 Usuário autenticado:",
                    usuario.email
                );

            } else {

                console.log(
                    "⚪ Nenhum administrador autenticado."
                );

            }

            if (
                typeof callback === "function"
            ) {

                callback(usuario);

            }

        }
    );

}


// ==========================================================
// USUÁRIO ATUAL
// ==========================================================

function usuarioAtual() {

    return auth.currentUser;

}


// ==========================================================
// EXPORTAR
// ==========================================================

export {

    auth,

    entrarAdmin,

    sairAdmin,

    observarAutenticacao,

    usuarioAtual

};
