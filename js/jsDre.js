const urlParams = new URLSearchParams(window.location.search);
const idPC = Number(urlParams.get("idPC"));
const nomePC = urlParams.get("nomePC");

window.addEventListener("load", lerContasPC);
document.getElementById("cencelarAddDre").addEventListener("click", cancelaAddDreConta);
document.getElementById("addDre").addEventListener("click", addDreConta);
document.getElementById("cancelDre").addEventListener("click", cancelaDre);
document.getElementById("imprimir").addEventListener("click", imprimirTela);

function geraTdTbl(text){
    let td = document.createElement("td");
    td.textContent = text;
    return td;
}

function transformaTextoEmNumero(valor){
    return Number(valor.replaceAll(".", "").replaceAll(",", "."));
}

function transformaNumeroEmTexto(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function criaElementoTbl(element){

    let tdnome = geraTdTbl(element.nome);
    let tdSaldoAtual = geraTdTbl(element.saldoAtual);

    let trTbl = document.createElement("tr");

    trTbl.appendChild(tdnome);
    trTbl.appendChild(tdSaldoAtual);

    return trTbl;
}

function montaOptionsPl(){
    let selectPl = document.getElementById("selectPl");
    let contas = getContas();
    contas.forEach(element => {
        if(element.idPC === idPC && element.tipoContaA === "PLIQUIDO"){
            let option = document.createElement("option");
            option.value = element.idConta;
            option.textContent = element.nome;
            selectPl.appendChild(option);
        }
    });
}

function verificaDre(){
    let dre = getDre();
    if(dre.length > 0){
        let relDre = document.getElementById("relDre");
        relDre.style.display = "none";
    } else{
        let cancelDre = document.getElementById("cancelDre");
        cancelDre.style.display = "none";
    }
}

function lerContasPC(){
    document.getElementById("nomeCabecalho").innerText = "DRE - " + nomePC;
    let tbContasDre = document.getElementById("tbContasDre");

    //
    let contas = getContas();
    let contasReceita = [];
    let contasDespesa = [];
    contas.forEach(element => {
        if(element.idPC === idPC && element.tipoContaA === "RECEITA"){
            contasReceita.push(element);
        }
        if(element.idPC === idPC && element.tipoContaA === "DESPESA"){
            contasDespesa.push(element);
        }
    });

    //
    let saldoReceita = 0;
    let saldoDespesa = 0;

    contasReceita.forEach(element => {
        saldoReceita += transformaTextoEmNumero(element.saldoAtual);
        element.nome = "(+) " + element.nome;
        element.saldoAtual = "" + element.saldoAtual;
        let trTbl = criaElementoTbl(element);
        tbContasDre.appendChild(trTbl);
    });   


    contasDespesa.forEach(element => {
        saldoDespesa += transformaTextoEmNumero(element.saldoAtual);
        element.nome = "(-) " + element.nome;
        element.saldoAtual = "(" + element.saldoAtual + ")";
        let trTbl = criaElementoTbl(element);
        tbContasDre.appendChild(trTbl);
    });

    //
    let identificadorNegativo = false;
    let lucroLiquido = saldoReceita - saldoDespesa;
    if(Math.sign(lucroLiquido) === -1){
        lucroLiquido *= -1;
        identificadorNegativo = true;
    }

    //
    let lucroLiquidoTxt = "";
    if(identificadorNegativo){
        lucroLiquidoTxt = "(" + transformaNumeroEmTexto(lucroLiquido) + ")";
    } else {
        lucroLiquidoTxt = "" + (transformaNumeroEmTexto(lucroLiquido)).replaceAll("R$ ", "");
    }

    let tdLucro = document.createElement("td");
    tdLucro.textContent = "(=) Lucro";

    let tdCalcLucro = document.createElement("td");
    tdCalcLucro.setAttribute("id", "valorLucro");
    tdCalcLucro.textContent = lucroLiquidoTxt;

    let trLucro = document.createElement("tr");
    trLucro.appendChild(tdLucro);
    trLucro.appendChild(tdCalcLucro);

    tbContasDre.appendChild(trLucro);

    montaOptionsPl();
    verificaDre();
}

function isNull(valor){
    return (valor === null || valor === "" || valor.length === 0);
}

function cancelaAddDreConta(){
    window.location.href = "contas.html?idPC=" + idPC + "&nomePC=" + nomePC;
}

function addZeroEsquerda(valor){
    if(Number(valor) < 10){
        return "0" + valor;
    } else {
        return valor;
    }
}

function addMovimentacao(idContaCredito, valor){
    let idMovimentacao = getContadorMovimentacao();
    let descricao = "Lucro do DRE";
    let idContaDebito = null;
    let data = new Date();
    let dataFormatada = data.getFullYear() + "-" + addZeroEsquerda(data.getMonth() + 1) + "-" + addZeroEsquerda(data.getDate());
    
    let movimentacao = {
        idMovimentacao: idMovimentacao,
        descricao: descricao,
        idContaCredito: Number(idContaCredito),
        idContaDebito: idContaDebito,
        valor: valor,
        dtMovimentacao: dataFormatada
    }

    let movimentacoes = getMovimentacoes();
    movimentacoes.push(movimentacao);
    setMovimentacoes(movimentacoes);

    return movimentacao.idMovimentacao;
}

function criaDre(idMovimentacao, idConta, valor){

    let dre = {
        idMovimentacao: idMovimentacao,
        idConta: idConta,
        valor: valor
    }

    let dres = getDre();
    dres.push(dre);
    setDre(dres);
}

function addDreConta(){
    let idConta = document.getElementById("selectPl").value;
    if(!(isNull(idConta))){
        let valor = document.getElementById("valorLucro").textContent;
        let valorN = transformaTextoEmNumero(valor);
        
        let contas = getContas();
        contas.forEach(element => {
            if(element.idConta === Number(idConta)){
                element.saldoAtual = (transformaNumeroEmTexto(transformaTextoEmNumero(element.saldoAtual) + valorN)).replaceAll("R$ ", "");
            }
        });
        setContas(contas);

        let idMovimentacao = addMovimentacao(idConta, valor);

        criaDre(idMovimentacao, Number(idConta), valor);
        
        window.location.href = "contas.html?idPC=" + idPC + "&nomePC=" + nomePC;
    } else{
        alert("É preciso selecionar uma conta para adicionar o lucro do resultado do DRE.");
    }
}

function cancelaDre(){
    let dre = getDre();

    let movs = getMovimentacoes();
    let movsMod = movs.filter(element => element.idMovimentacao !== dre[0].idMovimentacao);
    setMovimentacoes(movsMod);

    let contas = getContas();
    contas.forEach(element => {
        if(element.idConta === dre[0].idConta){
            element.saldoAtual = (transformaNumeroEmTexto(transformaTextoEmNumero(element.saldoAtual) - transformaTextoEmNumero(dre[0].valor))).replaceAll("R$ ", "");
        }
    });
    setContas(contas);

    setDre([]);

    alert("DRE cancelado com sucesso!");

    window.location.href = "dre.html?idPC=" + idPC + "&nomePC=" + nomePC;
}

function imprimirTela(){
    window.print();
}