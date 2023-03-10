/* funções para tela de planosdecontas.html */

document.getElementById("addContaPC").addEventListener("click", addContasPC);
document.getElementById("cancelaAddPC").addEventListener("click", limpaAddConta);
document.getElementById("salvaAddPC").addEventListener("click", salvaNovoPC);
document.getElementById("cancelarNovaContaPC").addEventListener("click", limpaAddContaNovaPC);
document.getElementById("saldoConta").addEventListener("keyup", formatarMoeda); 
document.getElementById("saldoContaAdd").addEventListener("keyup", formatarMoeda); 
document.getElementById("salvaEdicaoPC").addEventListener("click", salvarEdicaoPC);
document.getElementById("salvaNovaContaPC").addEventListener("click", addContaNovaPC);
document.getElementById("salvaLimparPC").addEventListener("click", limparPlanoContas);
document.getElementById("salvaExcluiPC").addEventListener("click", excluirPlanoContas);
window.addEventListener("load", lerPCTelaInicial);

function formatarMoeda(e) {
    let v = e.target.value.replace(/\D/g,"");
    v = (v/100).toFixed(2) + "";
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = v;
}

function geraTdTbl(text){
    let td = document.createElement("td");
    td.textContent = text;
    return td;
}

function limpaAddContaPc(){
    document.getElementById("codigoConta").value = "";
    document.getElementById("nomeConta").value = "";
    document.getElementById("saldoConta").value = "";
    document.getElementById("tipoConta").value = "";
    document.getElementById("natSaldoConta").value = "";
}

function addContasPC(){
    let codigoConta = document.getElementById("codigoConta");
    let codigo = codigoConta.value;

    let nomeConta = document.getElementById("nomeConta");
    let nome = nomeConta.value;

    let tipoConta = document.getElementById("tipoConta");
    let tConta = tipoConta.options[tipoConta.selectedIndex].value;

    let saldoConta = document.getElementById("saldoConta");
    let saldo = saldoConta.value;

    let natSaldoConta = document.getElementById("natSaldoConta");
    let nSConta = natSaldoConta.options[natSaldoConta.selectedIndex].value;

    if((saldo.trim().length === 0 || saldo.trim() === "0,00") && nSConta.trim().length !== 0){
        alert("Não é possível adicionar um conta com tipo (natureza) do saldo sem informar o valor do saldo inicial dela.");
        return;
    }

    if(saldo.trim().length !== 0 && saldo.trim() !== "0,00" && nSConta.trim().length === 0){
        alert("Não é possível adicionar um conta com saldo inical sem selecionar o tipo (natureza) do saldo.");
        return;
    }

    if(saldo.trim().length === 0){
        saldo = "0,00";
    }
 
    if(codigo.trim().length !== 0 && nome.trim().length !== 0 && tConta.trim().length !== 0){
        let tdContasCod = geraTdTbl(codigo);
        let tdContasNome = geraTdTbl(nome);
        let tdContasTConta = geraTdTbl((tConta === "PLIQUIDO" ? "PATRIMÔNIO LÍQUIDO" : tConta));
        let tdContasSaldo = geraTdTbl("R$" + saldo);
        let tdContasNConta = geraTdTbl(nSConta);

        let trContas = document.createElement("tr");
        trContas.appendChild(tdContasCod);
        trContas.appendChild(tdContasNome);
        trContas.appendChild(tdContasTConta);
        trContas.appendChild(tdContasSaldo);
        trContas.appendChild(tdContasNConta);

        document.getElementById("tbContasPC").appendChild(trContas);

        document.getElementById("divContasPC").style.display = "block";

        limpaAddContaPc();
    } else{
        alert("Para adicionar uma nova conta é necessário preencher todos os campos, menos o saldo caso queira um saldo igual a R$0,00");
    }
}

function limpaAddConta(){
    document.getElementById("nomePC").value = "";
    document.getElementById("tbContasPC").innerHTML = "";
    document.getElementById("divContasPC").style.display = "none";
    limpaAddContaPc();
}

function transformaTextoEmNumero(valor){
    return Number(valor.replaceAll(".", "").replaceAll(",", "."));
}

function transformaNumeroEmTexto(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function salvaNovoPC(){
    let nomePC = document.getElementById("nomePC").value;
    if(nomePC.trim().length !== 0){
        let pc = {
            idPC: getContadorPC(),
            nome: nomePC
        }
        let planoContas = getPlanoContas();
        planoContas.push(pc);
        setPlanoContas(planoContas);

        let contasPC = Array.from(document.getElementById("tbContasPC").children);
        contasPC.forEach(element =>{
            let conta = {
                idConta: getContadorContas(),
                codigo: element.childNodes[0].textContent,
                nome: element.childNodes[1].textContent,
                tipoContaA: (element.childNodes[2].textContent === "PATRIMÔNIO LÍQUIDO" ? "PLIQUIDO" : element.childNodes[2].textContent),
                saldoInicial: element.childNodes[3].textContent.substring(2),
                saldoAtual: element.childNodes[3].textContent.substring(2),
                natSaldoIniConta: (element.childNodes[4].textContent.trim().length === 0 ? null : element.childNodes[4].textContent),
                natSaldoAtualConta: (element.childNodes[4].textContent.trim().length === 0 ? null : element.childNodes[4].textContent),
                idPC: pc.idPC
            }
            let contas = getContas();
            contas.push(conta);
            setContas(contas);
        });

        limpaAddConta();
        document.getElementById("tbPlanoContas").appendChild(criaLinhaTblPC(pc));
    } else{
        alert("Para adicionar um novo Plano de Contas é necessário adicionar seu nome");
    }
}

function geraIcone(text){
    let icone = document.createElement("i");
    icone.setAttribute("class", text + " dist-icones");
    return icone;
}

function salvarEdicaoPC(){
    let idPC = Number(document.getElementById("idPCEditar").value);
    let nomePC = document.getElementById("nomePCEditar").value;
    if(nomePC.trim().length === 0){
        alert("Não é possível salvar um Plano de Contas sem nome");
        return;
    }

    let pcs = getPlanoContas();
    pcs = pcs.map(element =>{
        if(element.idPC === idPC)
            element.nome = nomePC;
        return element;
    });
    setPlanoContas(pcs);

    window.location.reload();
    alert("Plano de Contas editado com sucesso!!!");
}

function limpaAddContaNovaPC(){
    document.getElementById("codigoContaAdd").value = "";
    document.getElementById("nomeContaAdd").value = "";
    document.getElementById("saldoContaAdd").value = "";
    document.getElementById("tipoContaAdd").value = "";
    document.getElementById("natSaldoContaAdd").value = "";
}

function addContaNovaPC(){
    let idPC = Number(document.getElementById("idPCNovaConta").value);

    let codigoConta = document.getElementById("codigoContaAdd");
    let codigo = codigoConta.value;

    let nomeConta = document.getElementById("nomeContaAdd");
    let nome = nomeConta.value;

    let tipoContaAdd = document.getElementById("tipoContaAdd");
    let tContaAdd = tipoContaAdd.options[tipoContaAdd.selectedIndex].value;

    let saldoConta = document.getElementById("saldoContaAdd");
    let saldo = saldoConta.value;

    let natSaldoContaAdd = document.getElementById("natSaldoContaAdd");
    let nSContaAdd = natSaldoContaAdd.options[natSaldoContaAdd.selectedIndex].value;

    if((saldo.trim().length === 0 || saldo.trim() === "0,00") && nSContaAdd.trim().length !== 0){
        alert("Não é possível adicionar um conta com tipo (natureza) do saldo sem informar o valor do saldo inicial dela.");
        return;
    }

    if(saldo.trim().length !== 0 && saldo.trim() !== "0,00" && nSContaAdd.trim().length === 0){
        alert("Não é possível adicionar um conta com saldo inical sem selecionar o tipo (natureza) do saldo.");
        return;
    }

    if(saldo.trim().length === 0){
        saldo = "0,00";
    }

    if(codigo.trim().length !== 0 && nome.trim().length && tContaAdd.trim().length !== 0){
        let conta = {
            idConta: getContadorContas(),
            codigo: codigo,
            nome: nome,
            tipoContaA: tContaAdd,
            natSaldoIniConta: (nSContaAdd.trim().length === 0 ? null : nSContaAdd),
            natSaldoAtualConta: (nSContaAdd.trim().length === 0 ? null : nSContaAdd),
            saldoInicial: saldo,
            saldoAtual: saldo,
            idPC: idPC
        }
        let contas = getContas();
        contas.push(conta);
        setContas(contas);

        limpaAddContaNovaPC();
        alert("Nova conta cadastrada com sucesso!!!");
    } else{
        alert("Para adicionar uma nova conta é necessário preencher todos os campos, menos o saldo caso queira um saldo igual a R$0,00");
    }
}

function limpaMovimentacoes(contasPC){
    let movimentacoesParaLimpar = [];
    let movimentacoes = getMovimentacoes();
    contasPC.forEach(element =>{
        movimentacoes.forEach(elementMov =>{
            if(element === elementMov.idContaCredito || element === elementMov.idContaDebito){
                movimentacoesParaLimpar.push(elementMov);
            }
        });
    });

    let movimentacoesLimpas = [];
    movimentacoes.forEach(element =>{
        if(!movimentacoesParaLimpar.includes(element)){
            movimentacoesLimpas.push(element);
        }
    });
    setMovimentacoes(movimentacoesLimpas);
}

function isNull(valor) {
    return valor === null || valor === undefined;
}

function limparPlanoContas(){
    let idPC = Number(document.getElementById("idLimpaPC").value);

    let contasPC = [];
    let contas = getContas();
    let contasLimpas = contas.map(element => {
        if(element.idPC === idPC){
            element.saldoAtual = element.saldoInicial;
            if(isNull(element.natSaldoIniConta)){
                element.natSaldoAtualConta = null;
            }
            contasPC.push(element.idConta);
        }
        return element;
    });
    setContas(contasLimpas);

    limpaMovimentacoes(contasPC);

    setDre([]);

    alert("Limpeza do Plano de Contas " + document.getElementById("nomeLimparPC").textContent + " realizada com sucesso");
}

function excluirPlanoContas(){
    let idPC = Number(document.getElementById("idExcluiPC").value);

    let contasExcluidas = [];
    let contas = getContas();
    let contasSalvar = contas.filter(element => {
        if(element.idPC === idPC){
            contasExcluidas.push(element.idConta);
        } else{
            return element;
        }
    });
    setContas(contasSalvar);

    limpaMovimentacoes(contasExcluidas);

    let pcs = getPlanoContas();
    let pcsNovos = pcs.filter(element => element.idPC !== idPC);
    setPlanoContas(pcsNovos);

    window.location.reload();
    alert("Exclusão do Plano de Contas " + document.getElementById("nomeExcluiPC").textContent + " realizada com sucesso");
}

function criaLinhaTblPC(element){
    let tdNome = geraTdTbl(element.nome);
    tdNome.setAttribute("class", "td-nome-tbl-pc")
    
    let tdAcao = geraTdTbl("");
    tdAcao.setAttribute("class", "td-acao-tbl-pc text-center");

    let aVisualizar = document.createElement("a");
    aVisualizar.setAttribute("class", "cursor-pointer");
    aVisualizar.setAttribute("data-toggle", "tooltip");
    aVisualizar.setAttribute("title", "Visualizar Informações");
    aVisualizar.setAttribute("href", "./contas.html?idPC=" + element.idPC + "&nomePC=" + element.nome);
    aVisualizar.appendChild(geraIcone("bi bi-search"));

    let aEditar = document.createElement("a");
    aEditar.setAttribute("class", "cursor-pointer");
    aEditar.setAttribute("data-toggle", "tooltip");
    aEditar.setAttribute("title", "Editar Informações");
    aEditar.setAttribute("data-bs-toggle", "modal");
    aEditar.setAttribute("data-bs-target", "#modalEditaPC");
    aEditar.addEventListener("click", () => {
        document.getElementById("nomePCEditar").value = element.nome;
        document.getElementById("idPCEditar").value = element.idPC;
    })
    aEditar.appendChild(geraIcone("bi bi-pencil-square"));

    let aAddConta = document.createElement("a");
    aAddConta.setAttribute("class", "cursor-pointer");
    aAddConta.setAttribute("data-toggle", "tooltip");
    aAddConta.setAttribute("title", "Adicionar nova Conta");
    aAddConta.setAttribute("data-bs-toggle", "modal");
    aAddConta.setAttribute("data-bs-target", "#modalAddContaPC");
    aAddConta.addEventListener("click", () => {
        document.getElementById("idPCNovaConta").value = element.idPC;
        document.getElementById("nomePCAdd").textContent = element.nome;
    })
    aAddConta.appendChild(geraIcone("bi bi-plus-circle-fill"));

    let aLimparPC = document.createElement("a");
    aLimparPC.setAttribute("class", "cursor-pointer");
    aLimparPC.setAttribute("data-toggle", "tooltip");
    aLimparPC.setAttribute("title", "Limpar Plano de Contas");
    aLimparPC.setAttribute("data-bs-toggle", "modal");
    aLimparPC.setAttribute("data-bs-target", "#modalLimpaPC");
    aLimparPC.addEventListener("click", () => {
        document.getElementById("idLimpaPC").value = element.idPC;
        document.getElementById("nomeLimparPC").textContent = element.nome;
    })
    aLimparPC.appendChild(geraIcone("bi bi-database-fill-slash"));

    let aExcluirPC = document.createElement("a");
    aExcluirPC.setAttribute("class", "cursor-pointer");
    aExcluirPC.setAttribute("data-toggle", "tooltip");
    aExcluirPC.setAttribute("title", "Excluir Plano de Contas");
    aExcluirPC.setAttribute("data-bs-toggle", "modal");
    aExcluirPC.setAttribute("data-bs-target", "#modalExcluiPC");
    aExcluirPC.addEventListener("click", () => {
        document.getElementById("idExcluiPC").value = element.idPC;
        document.getElementById("nomeExcluiPC").textContent = element.nome;
    })
    aExcluirPC.appendChild(geraIcone("bi bi-x-circle-fill"));

    tdAcao.appendChild(aVisualizar);
    tdAcao.appendChild(aEditar);
    tdAcao.appendChild(aAddConta);
    tdAcao.appendChild(aLimparPC);
    tdAcao.appendChild(aExcluirPC);

    let tr = document.createElement("tr");
    tr.appendChild(tdNome);
    tr.appendChild(tdAcao);

    return tr;
}

function lerPCTelaInicial(){
    const pcs = getPlanoContas();
    pcs.forEach(element =>{
        document.getElementById("tbPlanoContas").appendChild(criaLinhaTblPC(element));
    });
}