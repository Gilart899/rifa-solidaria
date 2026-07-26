// ======================================
// utils.js
// Funções auxiliares da Rifa Solidária
// ======================================

import { CONFIG } from "./config.js";

// Formata número para 3 dígitos
export function formatarNumero(numero) {
    return Number(numero).toString().padStart(3, "0");
}

// Descobre a cartela (1 a 10)
export function obterCartela(numero) {
    numero = Number(numero);

    if (numero < 0 || numero > 999) {
        return null;
    }

    return Math.floor(numero / 100) + 1;
}

// Retorna intervalo da cartela
export function intervaloCartela(cartela) {

    const inicio = (cartela - 1) * CONFIG.numerosPorCartela;

    const fim = inicio + CONFIG.numerosPorCartela - 1;

    return {
        inicio,
        fim
    };
}

// Valor total
export function calcularValor(qtd) {

    return qtd * CONFIG.valorNumero;

}

// Copiar PIX
export async function copiarPix() {

    try {

        await navigator.clipboard.writeText(CONFIG.pix.chave);

        alert("Chave PIX copiada!");

    } catch (e) {

        alert("Não foi possível copiar o PIX.");

    }

}

// Abrir WhatsApp
export function abrirWhatsapp(nome, numeros) {

    const lista = numeros
        .map(formatarNumero)
        .join(", ");

    const texto = CONFIG.whatsapp.mensagem
        .replace("{NUMEROS}", lista)
        .replace("{NOME}", nome || "");

    window.open(
        `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(texto)}`,
        "_blank"
    );

}

// Data brasileira
export function formatarData(data) {

    return new Date(data).toLocaleDateString("pt-BR");

}

// Hora brasileira
export function formatarHora(data) {

    return new Date(data).toLocaleTimeString("pt-BR");

}

// Contagem regressiva
export function calcularContagem() {

    const alvo = new Date(
        `${CONFIG.sorteio.data}T${CONFIG.sorteio.hora}:00`
    );

    const agora = new Date();

    const diff = alvo - agora;

    if (diff <= 0) {

        return null;

    }

    return {

        dias: Math.floor(diff / 86400000),

        horas: Math.floor(diff % 86400000 / 3600000),

        minutos: Math.floor(diff % 3600000 / 60000),

        segundos: Math.floor(diff % 60000 / 1000)

    };

}
