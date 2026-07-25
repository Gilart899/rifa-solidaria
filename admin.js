/* ==========================================================
   GILFEST - PAINEL ADMINISTRATIVO
   admin.js
   ========================================================== */

"use strict";

/* ========= CONFIGURAÇÕES ========= */

const SENHA_ADMIN = "GilFest2026";

/* ========= ELEMENTOS ========= */

const loginBox = document.querySelector(".login-admin");
const painel = document.getElementById("painelAdmin");

const senhaInput = document.getElementById("senhaAdmin");
const btnEntrar = document.getElementById("btnEntrar");

const toast = document.getElementById("toastAdmin");

const totalDisponiveis = document.getElementById("totalDisponiveis");
const totalReservados = document.getElementById("totalReservados");
const totalVendidos = document.getElementById("totalVendidos");
const totalNumeros = document.getElementById("totalNumeros");
const valorArrecadado = document.getElementById("valorArrecadado");

const barra = document.getElementById("barraProgresso");
const percentual = document.getElementById("percentualRifa");

const listaParticipantes =
document.getElementById("listaParticipantes");

/* ========= LOGIN ========= */

btnEntrar.addEventListener("click", verificarSenha);

senhaInput.addEventListener("keydown", function(e){

if(e.key==="Enter"){

verificarSenha();

}

});

function verificarSenha(){

const senha = senhaInput.value.trim();

if(senha===SENHA_ADMIN){

loginBox.style.display="none";

painel.style.display="block";

mostrarToast("Bem-vindo ao painel!");

carregarDashboard();

carregarParticipantes();

}else{

mostrarToast("Senha incorreta.");

senhaInput.focus();

}

}

/* ========= TOAST ========= */

function mostrarToast(texto){

toast.textContent=texto;

toast.classList.add("mostrar");

setTimeout(()=>{

toast.classList.remove("mostrar");

},3000);

}

/* ========= FIREBASE ========= */

const db = firebase.database();

const numerosRef = db.ref("numeros");

const configRef = db.ref("config");

/* ========= DASHBOARD ========= */

function carregarDashboard(){

numerosRef.on("value",(snapshot)=>{

const dados=snapshot.val()||{};

let disponiveis=0;
let reservados=0;
let vendidos=0;

Object.values(dados).forEach(item=>{

switch(item.status){

case "disponivel":

disponiveis++;

break;

case "reservado":

reservados++;

break;

case "vendido":

vendidos++;

break;

}

});

const total=disponiveis+reservados+vendidos;

const arrecadado=vendidos*10;

totalDisponiveis.textContent=disponiveis;

totalReservados.textContent=reservados;

totalVendidos.textContent=vendidos;

totalNumeros.textContent=total;

valorArrecadado.textContent=
arrecadado.toLocaleString("pt-BR",{

style:"currency",

currency:"BRL"

});

const porcentagem=
total===0
?0
:(vendidos/total)*100;

barra.style.width=
porcentagem+"%";

percentual.textContent=
porcentagem.toFixed(1)+"%";

});

}
/* ==========================================================
   PARTICIPANTES
   ========================================================== */

let participantes = [];
let participantesFiltrados = [];

function carregarParticipantes() {

    numerosRef.on("value", (snapshot) => {

        const dados = snapshot.val() || {};

        participantes = [];

        Object.keys(dados).forEach((id) => {

            participantes.push({
                id,
                ...dados[id]
            });

        });

        participantes.sort((a, b) => Number(a.numero) - Number(b.numero));

        participantesFiltrados = [...participantes];

        atualizarTabela();

    });

}

/* ==========================================================
   TABELA
   ========================================================== */

function atualizarTabela() {

    listaParticipantes.innerHTML = "";

    document.getElementById("quantidadeRegistros").textContent =
        participantesFiltrados.length + " registros";

    participantesFiltrados.forEach((item) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>${item.numero || "-"}</td>

<td>${item.cartela || "-"}</td>

<td>${item.nome || "-"}</td>

<td>${item.whatsapp || "-"}</td>

<td>

<span class="status ${item.status || "disponivel"}">

${textoStatus(item.status)}

</span>

</td>

<td>

${item.pagamento || "Pendente"}

</td>

<td>

<div class="acoes">

<button
class="btn-editar"
onclick="abrirEdicao('${item.id}')">

✏️

</button>

<button
class="btn-confirmar"
onclick="confirmarPagamento('${item.id}')">

✅

</button>

<button
class="btn-transferir"
onclick="transferirNumero('${item.id}')">

🔄

</button>

<button
class="btn-excluir"
onclick="excluirParticipante('${item.id}')">

🗑

</button>

</div>

</td>

`;

        listaParticipantes.appendChild(tr);

    });

}

/* ==========================================================
   STATUS
   ========================================================== */

function textoStatus(status) {

    switch (status) {

        case "vendido":
            return "🔴 Vendido";

        case "reservado":
            return "🟡 Reservado";

        default:
            return "🟢 Disponível";

    }

}

/* ==========================================================
   PESQUISA
   ========================================================== */

document
.getElementById("btnPesquisar")
.addEventListener("click", pesquisar);

function pesquisar() {

    const numero =
        document.getElementById("buscarNumero")
        .value
        .trim();

    const nome =
        document.getElementById("buscarNome")
        .value
        .toLowerCase()
        .trim();

    const telefone =
        document.getElementById("buscarTelefone")
        .value
        .trim();

    participantesFiltrados = participantes.filter((item) => {

        const okNumero =
            !numero ||
            String(item.numero).includes(numero);

        const okNome =
            !nome ||
            (item.nome || "")
            .toLowerCase()
            .includes(nome);

        const okTelefone =
            !telefone ||
            (item.whatsapp || "")
            .includes(telefone);

        return okNumero && okNome && okTelefone;

    });

    atualizarTabela();

}

/* ==========================================================
   FILTROS
   ========================================================== */

document
.querySelectorAll(".filtro")
.forEach((botao) => {

    botao.addEventListener("click", () => {

        document
            .querySelectorAll(".filtro")
            .forEach((b) => b.classList.remove("ativo"));

        botao.classList.add("ativo");

        const status = botao.dataset.status;

        if (status === "todos") {

            participantesFiltrados = [...participantes];

        } else {

            participantesFiltrados =
                participantes.filter((item) =>
                    item.status === status
                );

        }

        atualizarTabela();

    });
   

});
/* ==========================================================
   MODAL DE EDIÇÃO
   ========================================================== */

const modal = document.getElementById("modalParticipante");

const editNome = document.getElementById("editNome");
const editWhatsapp = document.getElementById("editWhatsapp");
const editCartela = document.getElementById("editCartela");
const editNumero = document.getElementById("editNumero");
const editObservacao = document.getElementById("editObservacao");

let participanteAtual = null;

/* Abrir modal */

function abrirEdicao(id){

const participante = participantes.find(p => p.id === id);

if(!participante) return;

participanteAtual = participante;

editNome.value = participante.nome || "";

editWhatsapp.value = participante.whatsapp || "";

editCartela.value = participante.cartela || "";

editNumero.value = participante.numero || "";

editObservacao.value = participante.observacao || "";

modal.classList.add("ativo");

}

/* Fechar modal */

document
.getElementById("fecharModal")
.addEventListener("click",()=>{

modal.classList.remove("ativo");

});

/* Clique fora */

window.addEventListener("click",(e)=>{

if(e.target===modal){

modal.classList.remove("ativo");

}

});

/* ==========================================================
   SALVAR
   ========================================================== */

document
.getElementById("formParticipante")
.addEventListener("submit",salvarParticipante);

function salvarParticipante(e){

e.preventDefault();

if(!participanteAtual) return;

numerosRef.child(participanteAtual.id).update({

nome:editNome.value.trim(),

whatsapp:editWhatsapp.value.trim(),

observacao:editObservacao.value.trim()

}).then(()=>{

registrarHistorico(

"✏️ Dados atualizados do número " +

participanteAtual.numero

);

mostrarToast("Dados atualizados.");

modal.classList.remove("ativo");

});

}

/* ==========================================================
   CONFIRMAR PAGAMENTO
   ========================================================== */

function confirmarPagamento(id){

if(!confirm("Confirmar pagamento deste número?"))

return;

numerosRef.child(id).update({

status:"vendido",

pagamento:"Confirmado",

dataPagamento:new Date().toLocaleString("pt-BR")

}).then(()=>{

registrarHistorico(

"✅ Pagamento confirmado."

);

mostrarToast("Pagamento confirmado.");

});

}

/* ==========================================================
   TRANSFERIR NÚMERO
   ========================================================== */

function transferirNumero(id){

const novoNome = prompt("Nome do novo participante:");

if(!novoNome) return;

const novoWhatsapp = prompt("WhatsApp do novo participante:");

if(!novoWhatsapp) return;

numerosRef.child(id).update({

nome:novoNome,

whatsapp:novoWhatsapp

}).then(()=>{

registr

        /* ==========================================================
   CONFIGURAÇÕES DA RIFA
   ========================================================== */

const btnSalvarConfiguracoes =
document.getElementById("btnSalvarConfiguracoes");

btnSalvarConfiguracoes.addEventListener("click", salvarConfiguracoes);

function salvarConfiguracoes(){

const config={

premio:
document.getElementById("cfgPremio").value.trim(),

valor:
document.getElementById("cfgValor").value.trim(),

data:
document.getElementById("cfgData").value,

hora:
document.getElementById("cfgHora").value,

whatsapp:
document.getElementById("cfgWhatsapp").value.trim(),

pix:
document.getElementById("cfgPix").value.trim(),

titular:
document.getElementById("cfgTitular").value.trim(),

banco:
document.getElementById("cfgBanco").value.trim()

};

configRef.set(config)

.then(()=>{

mostrarToast("Configurações salvas.");

registrarHistorico(
"⚙️ Configurações alteradas."
);

});

}

/* ==========================================================
   AVISOS
   ========================================================== */

document
.getElementById("btnSalvarAviso")
.addEventListener("click",()=>{

const aviso=
document
.getElementById("textoAviso")
.value.trim();

db.ref("avisos/principal")

.set({

texto:aviso,

data:
new Date().toLocaleString("pt-BR")

})

.then(()=>{

mostrarToast("Aviso publicado.");

registrarHistorico(
"📢 Aviso publicado."
);

});

});

/* ==========================================================
   FOTO DO PRÊMIO
   ========================================================== */

const fotoInput=
document.getElementById("fotoPremio");

const preview=
document.getElementById("previewPremio");

fotoInput.addEventListener("change",(e)=>{

const arquivo=e.target.files[0];

if(!arquivo) return;

const leitor=new FileReader();

leitor.onload=function(event){

preview.src=event.target.result;

};

leitor.readAsDataURL(arquivo);

});

document
.getElementById("btnAtualizarFoto")
.addEventListener("click",()=>{

mostrarToast(
"
   /* ==========================================================
   EXPORTAR PDF
   ========================================================== */

document
.getElementById("btnExportarPDF")
.addEventListener("click",exportarPDF);

function exportarPDF(){

window.print();

registrarHistorico(

"📄 Exportação em PDF."

);

mostrarToast(

"Use 'Salvar como PDF' na janela de impressão."

);

}

/* ==========================================================
   EXPORTAR EXCEL (CSV)
   ========================================================== */

document
.getElementById("btnExportarExcel")
.addEventListener("click",exportarCSV);

function exportarCSV(){

let csv="Numero;Cartela;Nome;WhatsApp;Status;Pagamento\n";

participantes.forEach(item=>{

csv+=`${item.numero||""};${item.cartela||""};${item.nome||""};${item.whatsapp||""};${item.status||""};${item.pagamento||""}\n`;

});

const blob=new Blob([csv],{

type:"text/csv;charset=utf-8;"

});

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download="participantes.csv";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);

registrarHistorico("📊 Exportação CSV.");

mostrarToast("Planilha exportada.");

}

/* ==========================================================
   ÚLTIMO ACESSO
   ========================================================== */

function registrarUltimoAcesso(){

const agora=new Date().toLocaleString("pt-BR");

localStorage.setItem(

"ultimoAcessoAdmin",

agora

);

const campo=

document.getElementById("ultimoAcesso");

if(campo){

campo.textContent=agora;

}

}

window.addEventListener("load",()=>{

const ultimo=

localStorage.getItem("ultimoAcessoAdmin");

if(ultimo){

document.getElementById("ultimoAcesso").textContent=ultimo;

}

});

/* ==========================================================
   LOGOUT
   ==========================================================
