const id = new URLSearchParams(window.location.search).get("id");
const conta = JSON.parse(localStorage.getItem('contas')).find(x => x.idConta == id);
document.querySelector('#titulo_tabela').innerHTML = `Livro Razão - ${conta.nome}`;

const movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')).filter(x =>
    x.idContaCredito == id || x.idContaDebito == id)

const bodyTableRazao = document.querySelector('#bodyTableRazao');
const footerTableRazao = document.querySelector('#footerTableRazao');

let valorTotalDebito = 0;
let valorTotalCredito = 0;
let row = '';

if (!(isNull(conta.natSaldoIniConta))){
    row = `
    <tr>
        <td>(SA)</td>
        <td></td>
        <td>Saldo cadastrado juntamente com a conta</td>
        <td>${conta.natSaldoIniConta === "D" ? conta.saldoInicial : '—'}</td>
        <td>${conta.natSaldoIniConta === "C" ? conta.saldoInicial : '—'}</td>
    </tr>`;

    if (conta.natSaldoIniConta === "D") {
        //TODO: o valor esta em string converter para numero
        valorTotalDebito += transformaTextoEmNumero(conta.saldoInicial);
    } else {
        valorTotalCredito += transformaTextoEmNumero(conta.saldoInicial);
    }

    bodyTableRazao.innerHTML += row;
}

movimentacoes.forEach(element => {

    const contaContrapartida = conta.idConta == element.idContaCredito && element.idContaDebito != null
        ? JSON.parse(localStorage.getItem('contas')).filter(x => element.idContaDebito == x.idConta)[0]
        : JSON.parse(localStorage.getItem('contas')).filter(x => element.idContaCredito == x.idConta)[0]


    row = `
    <tr>
        <td>${element.idMovimentacao}</td>
        <td>${contaContrapartida.nome}</td>
        <td>${element.descricao}</td>
        <td>${conta.idConta === element.idContaDebito ? element.valor : '—'}</td>
        <td>${conta.idConta === element.idContaCredito ? element.valor : '—'}</td>
    </tr>`

    if (conta.idConta === element.idContaDebito) {
        //TODO: o valor esta em string converter para numero
        valorTotalDebito += transformaTextoEmNumero(element.valor);
    } else {
        valorTotalCredito += transformaTextoEmNumero(element.valor);
    }
    bodyTableRazao.innerHTML += row;
});


const footerTable = `
    <tr>
        <td><b>Saldo: </b></td>
        <td></td>
        <td></td>
        <td>${valorTotalDebito > valorTotalCredito ? transformaNumeroEmTexto(valorTotalDebito - valorTotalCredito).replaceAll("R$ ", "") : ''}</td>
        <td>${valorTotalDebito < valorTotalCredito ? transformaNumeroEmTexto(valorTotalCredito - valorTotalDebito).replaceAll("R$ ", "") : ''}</td>
    </tr>`;

footerTableRazao.innerHTML += footerTable;


function transformaTextoEmNumero(valor){
    return Number(valor.replaceAll(".", "").replaceAll(",", "."));
}

function transformaNumeroEmTexto(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function isNull(valor) {
    return valor === null || valor === undefined;
}

(function () {
    const idPlanoConta = conta.idPC;
    const planoDeConta = JSON.parse(localStorage.getItem('planoContas')).find(x => x.idPC === idPlanoConta);
    const btnVoltar = document.getElementById('btn-voltar');
    btnVoltar.setAttribute('href', `./contas.html?idPC=${planoDeConta.idPC}&nomePC=${planoDeConta.nome}`)
})()

function imprimir() {
    window.print();
}