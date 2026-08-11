// ==========================================================
// RIFA SOLIDÁRIA — GILFEST
// CLOUD FUNCTIONS
// ==========================================================

const {
    onCall,
    HttpsError
} = require("firebase-functions/v2/https");

const {
    initializeApp
} = require("firebase-admin/app");

const {
    getDatabase
} = require("firebase-admin/database");

const crypto = require("crypto");


// ==========================================================
// FIREBASE ADMIN
// ==========================================================

initializeApp();

const db = getDatabase();


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const REGIAO = "southamerica-east1";


// ==========================================================
// GERADOR DE ID
// ==========================================================

function gerarId() {

    return crypto.randomUUID();

}


// ==========================================================
// NORMALIZAR NÚMERO DA RIFA
// ==========================================================

function normalizarNumero(numero) {

    const valor = String(numero ?? "").trim();

    if (!/^\d{1,3}$/.test(valor)) {
        return null;
    }

    const numeroNormalizado =
        valor.padStart(3, "0");

    const numeroInteiro =
        Number(numeroNormalizado);

    if (
        numeroInteiro < 0 ||
        numeroInteiro > 999
    ) {
        return null;
    }

    return numeroNormalizado;

}


// ==========================================================
// CRIAR JOGADA DA RASPADINHA
// ==========================================================

exports.criarJogadaRaspadinha = onCall(
    {
        region: REGIAO
    },

    async (request) => {

        // --------------------------------------------------
        // 1. VERIFICAR AUTENTICAÇÃO
        // --------------------------------------------------

        if (!request.auth) {

            throw new HttpsError(
                "unauthenticated",
                "É necessário estar autenticado."
            );

        }


        const participanteId =
            request.auth.uid;


        // --------------------------------------------------
        // 2. RECEBER NÚMERO
        // --------------------------------------------------

        const numeroRifa =
            normalizarNumero(
                request.data?.numeroRifa
            );


        if (!numeroRifa) {

            throw new HttpsError(
                "invalid-argument",
                "Número da rifa inválido."
            );

        }


        // --------------------------------------------------
        // 3. LOCALIZAR PARTICIPAÇÃO
        // --------------------------------------------------

        const numeroRef =
            db.ref(
                `rifa/numeros/${numeroRifa}`
            );


        const numeroSnapshot =
            await numeroRef.once("value");


        if (!numeroSnapshot.exists()) {

            throw new HttpsError(
                "not-found",
                "Número da rifa não encontrado."
            );

        }


        const numero =
            numeroSnapshot.val();


        // --------------------------------------------------
        // 4. VERIFICAR STATUS
        // --------------------------------------------------

        if (
            numero.status !== "vendido"
        ) {

            throw new HttpsError(
                "failed-precondition",
                "Este número ainda não está confirmado como vendido."
            );

        }


        // --------------------------------------------------
        // 5. VERIFICAR PAGAMENTO
        // --------------------------------------------------

        if (
            numero.pagamento !== true
        ) {

            throw new HttpsError(
                "failed-precondition",
                "O pagamento deste número ainda não foi confirmado."
            );

        }


        // --------------------------------------------------
        // 6. VERIFICAR PARTICIPANTE
        // --------------------------------------------------

        if (
            numero.participanteId &&
            numero.participanteId !== participanteId
        ) {

            throw new HttpsError(
                "permission-denied",
                "Este número pertence a outro participante."
            );

        }


        // --------------------------------------------------
        // 7. LOCALIZAR JOGADAS DO PARTICIPANTE
        // --------------------------------------------------

        const jogadasRef =
            db.ref(
                "rifa/raspadinha/jogadas"
            );


        const jogadasSnapshot =
            await jogadasRef
                .orderByChild("participanteId")
                .equalTo(participanteId)
                .once("value");


        const jogadas =
            jogadasSnapshot.val() || {};


        // --------------------------------------------------
        // 8. PROCURAR JOGADA JÁ LIBERADA
        // --------------------------------------------------

        for (
            const [jogadaId, jogada]
            of Object.entries(jogadas)
        ) {

            if (
                jogada.numeroRifa === numeroRifa &&
                jogada.liberada === true &&
                jogada.utilizada === false
            ) {

                return {

                    sucesso: true,

                    jogadaId,

                    mensagem:
                        "Você já possui uma raspadinha liberada."

                };

            }

        }


        // --------------------------------------------------
        // 9. CONTAR JOGADAS UTILIZADAS
        // --------------------------------------------------

        let jogadasUtilizadas = 0;


        for (
            const jogada
            of Object.values(jogadas)
        ) {

            if (
                jogada.numeroRifa === numeroRifa &&
                jogada.utilizada === true
            ) {

                jogadasUtilizadas++;

            }

        }


        // --------------------------------------------------
        // 10. LIMITE DE SEGURANÇA
        // --------------------------------------------------

        if (
            jogadasUtilizadas >= 2
        ) {

            throw new HttpsError(
                "failed-precondition",
                "Esta participação já utilizou todas as raspadinhas disponíveis."
            );

        }


        // --------------------------------------------------
        // 11. CRIAR ID DA JOGADA
        // --------------------------------------------------

        const jogadaId =
            gerarId();


        const agora =
            Date.now();


        // --------------------------------------------------
        // 12. CRIAR REGISTRO
        // --------------------------------------------------

        const novaJogada = {

            numeroRifa,

            participanteId,

            liberada: true,

            utilizada: false,

            resultado: null,

            premio: null,

            novaChance: false,

            dataCriacao: agora,

            dataUtilizacao: null

        };


        // --------------------------------------------------
        // 13. GRAVAR NO FIREBASE
        // --------------------------------------------------

        await db
            .ref(
                `rifa/raspadinha/jogadas/${jogadaId}`
            )
            .set(novaJogada);


        // --------------------------------------------------
        // 14. RETORNO
        // --------------------------------------------------

        return {

            sucesso: true,

            jogadaId,

            numeroRifa,

            mensagem:
                "Raspadinha liberada com sucesso."

        };

    }
);
