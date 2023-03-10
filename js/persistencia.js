/* funções de persistência */

// funções para o plano de contas
function getContadorPC(){
    let contador = 1;
    if(window.localStorage.getItem('contadorPC') !== null){
        contador = Number(window.localStorage.getItem('contadorPC')) + 1;
    }
    setContadorPC(contador);
	return contador;
}

function setContadorPC(contador){
	window.localStorage.setItem('contadorPC', contador);
}

function setPlanoContas(planoContas){
    window.localStorage.setItem("planoContas", JSON.stringify(planoContas));
}

function getPlanoContas(){
    return JSON.parse(window.localStorage.getItem("planoContas")) || [];
}

// funções para as contas
function getContadorContas(){
    let contador = 1;
    if(window.localStorage.getItem('contadorContas') !== null){
        contador = Number(window.localStorage.getItem('contadorContas')) + 1;
    }
    setContadorContas(contador);
	return contador;
}

function setContadorContas(contador){
	window.localStorage.setItem('contadorContas', contador);
}

function setContas(contas){
    window.localStorage.setItem("contas", JSON.stringify(contas));
}

function getContas(){
    return JSON.parse(window.localStorage.getItem("contas")) || [];
}

//funções paras movimentações
function getContadorMovimentacao(){
    let contador = 1;
    if(window.localStorage.getItem('contadorMovimentacao') !== null){
        contador = Number(window.localStorage.getItem('contadorMovimentacao')) + 1;
    }
    setContadorMovimentacao(contador);
	return contador;
}

function setContadorMovimentacao(contador){
	window.localStorage.setItem('contadorMovimentacao', contador);
}

function setMovimentacoes(movimentacao){
    window.localStorage.setItem("movimentacoes", JSON.stringify(movimentacao));
}

function getMovimentacoes(){
    return JSON.parse(window.localStorage.getItem("movimentacoes")) || [];
}

//DRE
function setDre(dre){
    window.localStorage.setItem("dre", JSON.stringify(dre));
}

function getDre(){
    return JSON.parse(window.localStorage.getItem("dre")) || [];
}