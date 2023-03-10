const urlParams = new URLSearchParams(window.location.search);
const idPC = Number(urlParams.get("idPC"));
const nomePC = urlParams.get("nomePC");

document.getElementById("inpValorMov").addEventListener("keyup", formatarMoeda);
document.getElementById("salvarNovaMov").addEventListener("click", salvarMovimentacao);
window.addEventListener("load", carregarValoresSelect);

function formatarMoeda(e) {
    let v = e.target.value.replace(/\D/g,"");
    v = (v/100).toFixed(2) + "";
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = v;
}

function geraOptionSelect(id, nome){
    let option = document.createElement("option");
    option.value = id;
    option.textContent = nome;
    return option;
}

function carregarValoresSelect(){
    
    let dre = getDre();
    if(dre.length === 0) {
        document.getElementById("cencelarNovaMov").setAttribute("href", "./contas.html?idPC=" + idPC + "&nomePC=" + nomePC)

        let contas = getContas();
        contas.forEach(element => {
            if(element.idPC === idPC){
                document.getElementById("inpCCreditoMov").appendChild(geraOptionSelect(element.idConta, element.nome));
                document.getElementById("inpCDebitoMov").appendChild(geraOptionSelect(element.idConta, element.nome));
            }
        });
    } else{
        window.location.href = "./contas.html?idPC=" + idPC + "&nomePC=" + nomePC + "&msg=1";
    }
}

function transformaTextoEmNumero(valor){
    return Number(valor.replaceAll(".", "").replaceAll(",", "."));
}

function transformaNumeroEmTexto(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

/*
function calcImpactMov(mov){
    let contas = getContas();
    contas.forEach(element => {
        if(element.idConta === mov.idContaCredito){
            let teste = transformaTextoEmNumero(mov.valor);
            console.log(teste);
            teste = "" + transformaNumeroEmTexto(teste);
            console.log(teste.replaceAll("R$ ", ""));
            //element.saldoAtual += Number(mov.valor);
        } else if(element.idConta === mov.idContaDebito){
            //element.saldoAtual -= Number(mov.valor);
        }
    }); 
    setContas(contas);
}
*/

function isNull(valor){
    return (valor === null || valor === "" || valor.length === 0);
}

function calcImpactMov(mov){
    let contas = getContas();
    let movValor = transformaTextoEmNumero(mov.valor);
    contas.forEach(element => {
        let saldoAtual = transformaTextoEmNumero(element.saldoAtual);
        let saldoAtualFinal = 0;
        if(element.idConta === mov.idContaCredito){
                if(isNull(element.natSaldoAtualConta)){
                    element.natSaldoAtualConta = "C";  
                    saldoAtualFinal = saldoAtual + movValor;           
                } else{
                    if(element.natSaldoAtualConta === "C"){
                        saldoAtualFinal = saldoAtual + movValor;
                    } else if(element.natSaldoAtualConta === "D"){
                        saldoAtualFinal = saldoAtual - movValor;
                    }
                }
        } else if(element.idConta === mov.idContaDebito){
            if(isNull(element.natSaldoAtualConta)){
                element.natSaldoAtualConta = "D";   
                saldoAtualFinal = saldoAtual + movValor;            
            } else {
                if(element.natSaldoAtualConta === "C"){
                    saldoAtualFinal = saldoAtual - movValor;
                } else if(element.natSaldoAtualConta === "D"){
                    saldoAtualFinal = saldoAtual + movValor;
                }
            }
        }
        if(saldoAtualFinal !== 0){
            element.saldoAtual = (transformaNumeroEmTexto(saldoAtualFinal)).replaceAll("R$ ", "");
        }
    }); 
    setContas(contas);
}


function isNumber(valor){
    return (isNaN(valor) ? 0 : valor);
}

function salvarMovimentacao(){
    let dtMov = document.getElementById("inpDataMov").value;
    let valorMov = document.getElementById("inpValorMov").value;

    let ctCreditadaMov = document.getElementById("inpCCreditoMov");
    let ctCreditada = Number(ctCreditadaMov.options[ctCreditadaMov.selectedIndex].value);

    let ctDebitadaMov = document.getElementById("inpCDebitoMov");
    let ctDebitada = Number(ctDebitadaMov.options[ctDebitadaMov.selectedIndex].value);

    let descMov = document.getElementById("inpDescMov").value;

    if(dtMov.trim().length !== 0 && valorMov.trim().length !== 0 && isNumber(ctCreditada) !== 0 && isNumber(ctDebitada) !== 0 && descMov.trim().length !== 0){
        
        let mov = {
            idMovimentacao: getContadorMovimentacao(),
            descricao: descMov,
            valor: valorMov,
            dtMovimentacao: dtMov,
            idContaCredito: ctCreditada,
            idContaDebito: ctDebitada,
            idPC: idPC
        }

        let movs = getMovimentacoes();
        movs.push(mov);
        setMovimentacoes(movs);
        
        calcImpactMov(mov);

        window.location.href = "./contas.html?idPC=" + idPC + "&nomePC=" + nomePC + "&sucess=true";
    } else{
        alert("É necessário preencher todos os campos!!!");
    }
}