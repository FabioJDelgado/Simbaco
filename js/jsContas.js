const urlParams = new URLSearchParams(window.location.search);
const idPC = Number(urlParams.get("idPC"));
const nomePC = urlParams.get("nomePC");
const msg = urlParams.get("msg");

document.getElementById("salvaEdicaoConta").addEventListener("click", contaEditar);
window.addEventListener("load", lerContasPC);

function geraTdTbl(text){
    let td = document.createElement("td");
    td.textContent = text;
    return td;
}

function geraIcone(text){
    let icone = document.createElement("i");
    icone.setAttribute("class", text + " dist-icones");
    return icone;
}

function contaEditar(){
    let nome = document.getElementById("nomeCEditar").value;
    if(nome.trim().length !== 0){
        let idConta = Number(document.getElementById("idCEditar").value);

        let contas = getContas();
        contas.forEach(element => {
            if(element.idConta === idConta){
                element.nome = nome;
            }
        });
        setContas(contas);
        alert("Conta editada com sucesso!!!");
        window.location.reload();
    } else{
        alert("O nome da conta não pode estar vazio!!!");
    }   
}

function montaTblContas(element){

    let tdCodigo = geraTdTbl(element.codigo);
    tdCodigo.setAttribute("class", "posicao-text-tbl");
    let tdNome = geraTdTbl(element.nome);
    let tdTipoConta = geraTdTbl((element.tipoContaA === "PLIQUIDO" ? "PATRIMÔNIO LÍQUIDO" : element.tipoContaA));
    let tdSaldoAtual = geraTdTbl("R$ " + element.saldoAtual);
    let tdNatSaldoAtual = geraTdTbl(element.natSaldoAtualConta);

    let aEditar = document.createElement("a");
    aEditar.setAttribute("class", "cursor-pointer");
    aEditar.setAttribute("data-toggle", "tooltip");
    aEditar.setAttribute("title", "Editar Informações");
    aEditar.setAttribute("data-bs-toggle", "modal");
    aEditar.setAttribute("data-bs-target", "#modalEditaConta");
    aEditar.addEventListener("click", () => {
        document.getElementById("nomeCEditar").value = element.nome;
        document.getElementById("idCEditar").value = element.idConta;
    })
    aEditar.appendChild(geraIcone("bi bi-pencil-square"));

    let aLivroRazao = document.createElement("a");
    aLivroRazao.setAttribute("class", "cursor-pointer");
    aLivroRazao.setAttribute("data-toggle", "tooltip");
    aLivroRazao.setAttribute("title", "Gerar Livro Razão");
    aLivroRazao.setAttribute("href", `./livro-razao.html?id=${element.idConta}`);
    aLivroRazao.appendChild(geraIcone("bi bi-search"));

    document.getElementById('gerarLivroDiario').setAttribute('href', `./listamovimentacao.html?id=${element.idPC}`);

    let tdAcao = geraTdTbl("");
    tdAcao.appendChild(aEditar);
    tdAcao.appendChild(aLivroRazao);

    let tr = document.createElement("tr");
    tr.appendChild(tdCodigo);
    tr.appendChild(tdNome);
    tr.appendChild(tdTipoConta);
    tr.appendChild(tdSaldoAtual);
    tr.appendChild(tdNatSaldoAtual);
    tr.appendChild(tdAcao);

    return tr;
}

function lerContasPC(){

    let gerarBalancoPatrimonial = document.getElementById("gerarBalancoPatrimonial");
    gerarBalancoPatrimonial.setAttribute("href", "balancoPatrimonial.html?idPC=" + idPC + "&nomePC=" + nomePC);

    let addNovaMov = document.getElementById("addNovaMov");
    addNovaMov.setAttribute("href", "movimentacao.html?idPC=" + idPC + "&nomePC=" + nomePC);

    let gerarRelatorioDRE = document.getElementById("gerarRelatorioDRE");
    gerarRelatorioDRE.setAttribute("href", "dre.html?idPC=" + idPC + "&nomePC=" + nomePC);

    document.getElementById("nomePC").textContent = nomePC;

    let contas = getContas();
    contas.forEach(element => {
        if(element.idPC === idPC){
            document.getElementById("tbContas").appendChild(montaTblContas(element));
        }
    });

    if(msg == 1){
        alert("O DRE já foi gerado e adicionado em uma conta, não é possível adicionar mais movimentações" +
              " Para adicionar novas movimentações cancele a operação do DRE.");
    }
}