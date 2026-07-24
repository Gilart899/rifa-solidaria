/* ==========================================
   RIFA SOLIDÁRIA
   pdf.js

   Geração de comprovante PDF
========================================== */

"use strict";



/* ==========================================
   ELEMENTOS
========================================== */


const nomeCliente =
    document.getElementById(
        "nomeCliente"
    );


const telefoneCliente =
    document.getElementById(
        "telefoneCliente"
    );


const numeroCliente =
    document.getElementById(
        "numeroCliente"
    );


const valorCliente =
    document.getElementById(
        "valorCliente"
    );


const dataCliente =
    document.getElementById(
        "dataCliente"
    );


const qrPix =
    document.getElementById(
        "qrPix"
    );


const gerarPDF =
    document.getElementById(
        "gerarPDF"
    );


const voltar =
    document.getElementById(
        "voltar"
    );



/* ==========================================
   PEGAR DADOS
========================================== */


const dadosCompra =

    JSON.parse(

        localStorage.getItem(
            "rifaCompra"
        )

    )
    ||
    {};




/* ==========================================
   PREENCHER COMPROVANTE
========================================== */


function preencherDados(){


    nomeCliente.textContent =

        dadosCompra.nome
        ||
        "---";



    telefoneCliente.textContent =

        dadosCompra.telefone
        ||
        "---";



    numeroCliente.textContent =

        dadosCompra.numero
        ||
        "---";



    valorCliente.textContent =

        `R$ ${
            CONFIG.valorNumero
            .toFixed(2)
            .replace(".",",")
        }`;



    dataCliente.textContent =

        new Date()

        .toLocaleDateString(
            "pt-BR"
        );


}



/* ==========================================
   GERAR PIX QR CODE
========================================== */


function criarQR(){

    if(!qrPix)
        return;



    const textoPix =

        CONFIG.pix.chave;



    new QRCode(

        qrPix,

        {

            text:
                textoPix,


            width:
                180,


            height:
                180


        }

    );

/* ==========================================
   GERAR PDF
========================================== */


async function gerarComprovantePDF(){


    if(
        !window.jspdf
    ){

        alert(
            "Biblioteca PDF não carregada."
        );

        return;

    }



    const {

        jsPDF

    } = window.jspdf;



    const pdf =

        new jsPDF();



    /* ======================================
       CABEÇALHO
    ====================================== */


    pdf.setFontSize(
        18
    );


    pdf.text(

        "RIFA SOLIDÁRIA",

        20,

        25

    );



    pdf.setFontSize(
        12
    );


    pdf.text(

        "Comprovante de Participação",

        20,

        35

    );




    /* ======================================
       DADOS
    ====================================== */


    pdf.text(

        `Nome: ${
            dadosCompra.nome || "---"
        }`,

        20,

        60

    );



    pdf.text(

        `Telefone: ${
            dadosCompra.telefone || "---"
        }`,

        20,

        70

    );



    pdf.text(

        `Número escolhido: ${
            dadosCompra.numero || "---"
        }`,

        20,

        80

    );



    pdf.text(

        `Valor: R$ ${
            CONFIG.valorNumero
            .toFixed(2)
        }`,

        20,

        90

    );



    pdf.text(

        `PIX: ${
            CONFIG.pix.chave
        }`,

        20,

        100

    );





    /* ======================================
       LOGO
    ====================================== */


    const logo =

        new Image();



    logo.src =

        "img/1784636629590.png";



    logo.onload = ()=>{


        pdf.addImage(

            logo,

            "PNG",

            150,

            15,

            35,

            35

        );



        salvarPDF(
            pdf
        );


    };



} 
  /* ==========================================
   SALVAR PDF
========================================== */


function salvarPDF(pdf){


    pdf.save(

        "comprovante-rifa-solidaria.pdf"

    );


}



/* ==========================================
   BOTÃO PDF
========================================== */


if(gerarPDF){


    gerarPDF.addEventListener(

        "click",

        ()=>{


            gerarComprovantePDF();



        }

    );


}



/* ==========================================
   VOLTAR
========================================== */


if(voltar){


    voltar.addEventListener(

        "click",

        ()=>{


            window.location.href =

                "index.html";


        }

    );


}



/* ==========================================
   INICIALIZAÇÃO
========================================== */


window.addEventListener(

    "load",

    ()=>{


        preencherDados();


        criarQR();



        console.log(

            "✅ Comprovante carregado."

        );


    }

);



/* ==========================================
   TRATAMENTO DE ERROS
========================================== */


window.addEventListener(

    "error",

    (evento)=>{


        console.error(

            "Erro PDF:",

            evento.error ||
            evento.message

        );


    }

);




/* ==========================================
   FIM pdf.js
========================================== */

}
