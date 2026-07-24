/* ==========================================
   RIFA SOLIDÁRIA
   admin.js

   Painel Administrativo
========================================== */

"use strict";


/* ==========================================
   ELEMENTOS
========================================== */


const loginArea =
    document.getElementById("loginArea");


const dashboard =
    document.getElementById("dashboard");


const senhaAdmin =
    document.getElementById("senhaAdmin");


const entrarAdmin =
    document.getElementById("entrarAdmin");


const erroLogin =
    document.getElementById("erroLogin");



const listaReservas =
    document.getElementById("listaReservas");



const totalNumeros =
    document.getElementById("totalNumeros");


const totalReservados =
    document.getElementById("totalReservados");


const totalPagos =
    document.getElementById("totalPagos");


const totalDisponiveis =
    document.getElementById("totalDisponiveis");


const valorArrecadado =
    document.getElementById("valorArrecadado");



const pesquisarNumero =
    document.getElementById("pesquisarNumero");


const pesquisarCliente =
    document.getElementById("pesquisarCliente");



/* ==========================================
   VARIÁVEIS
========================================== */


let todasReservas = [];

let autenticado = false;


/* ==========================================
   LOGIN
========================================== */


function entrarPainel(){


    const senha =
        senhaAdmin.value.trim();



    if(
        senha === CONFIG.admin.senha
    ){


        autenticado = true;


        loginArea.classList.add(
            "hidden"
        );


        dashboard.classList.remove(
            "hidden"
        );


        carregarPainel();



    }else{


        erroLogin.textContent =
            "❌ Senha incorreta.";


    }


}



if(entrarAdmin){


    entrarAdmin.addEventListener(
        "click",
        entrarPainel
    );


}



if(senhaAdmin){


    senhaAdmin.addEventListener(
        "keydown",
        (evento)=>{


            if(
                evento.key === "Enter"
            ){

                entrarPainel();

            }


        }
    );


}


/* ==========================================
   CARREGAR DADOS
========================================== */


function carregarPainel(){


    if(
        typeof reservasRef === "undefined"
    ){

        console.error(
            "Firebase indisponível."
        );

        return;

    }



    reservasRef.on(
        "value",
        (snapshot)=>{


            todasReservas = [];



            snapshot.forEach(
                item=>{


                    todasReservas.push({

                        id:item.key,

                        ...item.val()

                    });


                }
            );



            atualizarDashboard();


            mostrarReservas(
                todasReservas
            );


        }
    );

  /* ==========================================
   ATUALIZAR DASHBOARD
========================================== */

function atualizarDashboard(){


    const total =
        CONFIG.numeros.fim -
        CONFIG.numeros.inicio +
        1;



    const reservados =
        todasReservas.filter(
            item =>
            item.status === "reservado"
        ).length;



    const pagos =
        todasReservas.filter(
            item =>
            item.status === "pago"
        ).length;



    const disponiveis =
        total -
        todasReservas.length;



    const arrecadado =
        pagos *
        CONFIG.valorNumero;



    totalNumeros.textContent =
        total;



    totalReservados.textContent =
        reservados;



    totalPagos.textContent =
        pagos;



    totalDisponiveis.textContent =
        disponiveis;



    valorArrecadado.textContent =

        `R$ ${arrecadado
        .toFixed(2)
        .replace(".",",")}`;


}


/* ==========================================
   MOSTRAR RESERVAS
========================================== */

function mostrarReservas(lista){


    if(!listaReservas) return;



    listaReservas.innerHTML = "";



    lista.forEach(
        reserva=>{


            const linha =
                document.createElement("tr");



            const data =
                new Date(
                    reserva.data
                )
                .toLocaleDateString(
                    "pt-BR"
                );



            linha.innerHTML = `

                <td>
                    ${reserva.numero}
                </td>

                <td>
                    ${reserva.nome || ""}
                </td>

                <td>
                    ${reserva.telefone || ""}
                </td>

                <td>
                    ${reserva.cidade || ""}
                </td>

                <td>

                    <span class="status-admin 
                    status-${reserva.status}">

                    ${reserva.status}

                    </span>

                </td>


                <td>
                    ${data}
                </td>


                <td>


                    <button

                    class="acao-btn btn-editar"

                    onclick="editarReserva('${reserva.id}')">

                    ✏️

                    </button>



                    ${
                    reserva.status !== "pago"

                    ?

                    `

                    <button

                    class="acao-btn btn-pagar"

                    onclick="pagarReserva('${reserva.id}')">

                    💰

                    </button>

                    `

                    :

                    ""

                    }



                    <button

                    class="acao-btn btn-excluir"

                    onclick="removerReserva('${reserva.id}')">

                    🗑️

                    </button>


                </td>

            `;



            listaReservas.appendChild(
                linha
            );


        }
    );


}
  /* ==========================================
   PESQUISAS
========================================== */


function aplicarFiltros(){


    const numero =
        pesquisarNumero.value
        .trim()
        .toLowerCase();



    const cliente =
        pesquisarCliente.value
        .trim()
        .toLowerCase();



    const filtradas =
        todasReservas.filter(
            item=>{


                const bateNumero =

                    String(item.numero)
                    .includes(numero);



                const bateCliente =

                    (item.nome || "")
                    .toLowerCase()
                    .includes(cliente);



                return (
                    bateNumero
                    &&
                    bateCliente
                );


            }
        );



    mostrarReservas(
        filtradas
    );


}



if(pesquisarNumero){


    pesquisarNumero.addEventListener(
        "input",
        aplicarFiltros
    );


}



if(pesquisarCliente){


    pesquisarCliente.addEventListener(
        "input",
        aplicarFiltros
    );


}



/* ==========================================
   PAGAR RESERVA
========================================== */


async function pagarReserva(id){


    if(
        !confirm(
            "Confirmar pagamento?"
        )
    ){

        return;

    }



    try{


        await confirmarPagamento(
            id
        );



        alert(
            "✅ Pagamento confirmado."
        );



    }catch(erro){


        console.error(
            erro
        );


        alert(
            "Erro ao confirmar pagamento."
        );


    }


}




/* ==========================================
   EXCLUIR RESERVA
========================================== */


async function removerReserva(id){


    try{


        await excluirReserva(
            id
        );



    }catch(erro){


        console.error(
            erro
        );


    }


}



/* ==========================================
   EDITAR RESERVA
========================================== */


function editarReserva(id){


    const reserva =

        todasReservas.find(
            item =>
            item.id === id
        );



    if(!reserva)
        return;



    document
    .getElementById("editarId")
    .value =
        reserva.id;



    document
    .getElementById("editarNome")
    .value =
        reserva.nome || "";



    document
    .getElementById("editarTelefone")
    .value =
        reserva.telefone || "";



    document
    .getElementById("editarStatus")
    .value =
        reserva.status;



    document
    .getElementById("modalEditar")
    .classList
    .remove("hidden");


}
  /* ==========================================
   MODAL EDITAR
========================================== */

const modalEditar =
    document.getElementById("modalEditar");


const fecharEditar =
    document.getElementById("fecharEditar");


const salvarEdicao =
    document.getElementById("salvarEdicao");



if(fecharEditar){


    fecharEditar.addEventListener(
        "click",
        ()=>{


            modalEditar
            .classList
            .add("hidden");


        }
    );


}



if(salvarEdicao){


    salvarEdicao.addEventListener(
        "click",
        async ()=>{


            const id =
                document
                .getElementById("editarId")
                .value;



            const dados = {


                nome:

                    document
                    .getElementById("editarNome")
                    .value,


                telefone:

                    document
                    .getElementById("editarTelefone")
                    .value,


                status:

                    document
                    .getElementById("editarStatus")
                    .value


            };



            try{


                await reservasRef
                .child(id)
                .update(dados);



                modalEditar
                .classList
                .add("hidden");



            }catch(erro){


                console.error(
                    erro
                );


            }


        }
    );


}



/* ==========================================
   EXPORTAR PDF
========================================== */


const exportarPDF =
    document.getElementById(
        "exportarPDF"
    );


if(exportarPDF){


    exportarPDF.addEventListener(
        "click",
        ()=>{


            window.print();


        }
    );


}



/* ==========================================
   EXPORTAR EXCEL
========================================== */


const exportarExcel =
    document.getElementById(
        "exportarExcel"
    );



if(exportarExcel){


    exportarExcel.addEventListener(
        "click",
        ()=>{


            let csv =

                "Numero,Nome,Telefone,Cidade,Status\n";



            todasReservas.forEach(
                item=>{


                    csv +=

                    `${item.numero},` +

                    `${item.nome},` +

                    `${item.telefone},` +

                    `${item.cidade},` +

                    `${item.status}\n`;


                }
            );



            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                        "text/csv"
                    }
                );



            const link =
                document
                .createElement("a");



            link.href =
                URL.createObjectURL(
                    blob
                );



            link.download =
                "reservas-rifa.csv";



            link.click();


        }
    );


}



/* ==========================================
   COMPROVANTE
========================================== */


const gerarComprovante =
    document.getElementById(
        "gerarComprovante"
    );



if(gerarComprovante){


    gerarComprovante.addEventListener(
        "click",
        ()=>{


            alert(
                "Selecione uma reserva para gerar o comprovante."
            );


        }
    );


}



/* ==========================================
   FIM ADMIN.JS
========================================== */

}
