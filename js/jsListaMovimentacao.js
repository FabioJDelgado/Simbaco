let inputInitialDate = document.querySelector(".datainicial");
let inputFinalDate = document.querySelector(".datafinal");
let buttonFilter = document.querySelector(".btn-filter");



//Chama a função chamada listMovimentation
buttonFilter.addEventListener("click", function() {

    //se existir um tr com a classe tr-table-movimentation, remover todos os tr com a classe tr-table-movimentation
    if (document.querySelector(".tr-table-movimentation")) {
        let trs = document.querySelectorAll(".tr-table-movimentation");
        
        trs.forEach((tr) => {
            tr.remove();
        })
    }

    //data inicial recebe o valor do input com a classe datainicial e a data final recebe o valor do input com a classe datafinal
    let dataInicial = document.querySelector(".datainicial").value;       
    let dataFinal = document.querySelector(".datafinal").value;  

    filterMovimentation(dataInicial, dataFinal);
});

//criar um filtrar movimentacao
function filterMovimentation(dataInicial, dataFinal) {
    // //limpar inputs
    // document.querySelector(".datainicial").value = "";
    // document.querySelector(".datafinal").value = "";

    const id = new URLSearchParams(window.location.search).get("id");

    //capturar movimentacoes no localstoraged
    // let movimentacoes = JSON.parse(localStorage.getItem("movimentacoes"));


    console.log(id);

    let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes'))

    let movimentacao = movimentacoes.filter(x => Number(x.idPC) === Number(id));

    //replace para trocar o - por / em dataInicial e dataFinal
    dataInicial = dataInicial.replace(/-/g, '/');
    dataFinal = dataFinal.replace(/-/g, '/');

    //data final não pode ser menor que data inicial
    if (dataFinal < dataInicial) {
        alert("A data final não pode ser menor que a data inicial");
        return;
    }

    //data final não pode ser maior que a data atual
    let dataAtual = new Date();
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth() + 1;
    let ano = dataAtual.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }

    if (mes < 10) {
        mes = '0' + mes;
    }

    let dataAtualFormatada = ano + '/' + mes + '/' + dia;

    if (dataFinal > dataAtualFormatada) {
        alert("A data final não pode ser maior que a data atual");

        //limpar inputs
        document.querySelector(".datainicial").value = "";
        document.querySelector(".datafinal").value = "";
        
        return;
    }

    

    //a data da movimentacao deve estar entre o inputInitialDate e inputFinalDate
    movimentacao.map((movimentacao) => {

        //movimentacao.dtMovimentacao = deve ter o padrao aaaa-mm-dd
        let dataMovimentacao = new Date(movimentacao.dtMovimentacao);
        let dia = dataMovimentacao.getDate() + 1;
        let mes = dataMovimentacao.getMonth() + 1;
        let ano = dataMovimentacao.getFullYear();

        if (dia < 10) {
            dia = '0' + dia;
        }

        if (mes < 10) {
            mes = '0' + mes;
        }

        let dataFormatada = ano + '/' + mes + '/' + dia;

        //verificar se a data da movimentacao esta entre a data inicial e a data final no padrao aaaa-mm-dd
        if (dataFormatada >= dataInicial && dataFormatada <= dataFinal) {
            listMovimentation(movimentacao)
        }
    })    
}

function listMovimentation(movimentacao) {
    const data = formateDate(movimentacao.dtMovimentacao)
    const contaCredora = nameAccount(movimentacao.idContaCredito)
    const contaDebito = nameAccount(movimentacao.idContaDebito)

    return insertDataTable(data, contaCredora, contaDebito, movimentacao.valor, movimentacao.descricao, movimentacao.idMovimentacao);
}

function formateDate(data) {
    let dataMovimentacao = new Date(data);
    let dia = dataMovimentacao.getDate() + 1;
    let mes = dataMovimentacao.getMonth() + 1;
    let ano = dataMovimentacao.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }
    
    if (mes < 10) {
        mes = '0' + mes;
    }
    
    let dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada;
}

function nameAccount(id) {
    let contas = JSON.parse(localStorage.getItem("contas"));
    
    //encontrar o nome da conta
    if(!(isNull(id))){
        let conta = contas.find((conta) => conta.idConta == id );
        return conta.nome;
    } else{
        return "";
    }
}

function isNull(valor) {
    return valor === null || valor === undefined;
}

function insertDataTable(data, contaCredora, contaDebito, valor, descricao, idMovimentacao) {
    let table = document.querySelector(".table-movimentation");

    let tr = document.createElement("tr");
    let movData = document.createElement("td");
    let movContaCredito = document.createElement("td");
    let movContaDebito = document.createElement("td");
    let movValor = document.createElement("td");
    let movDescricao = document.createElement("td");
    let movCodigo = document.createElement("td");

    movCodigo.innerHTML = idMovimentacao;
    movDescricao.innerHTML = descricao;
    movValor.innerHTML = valor;
    movData.innerHTML = data;
    movContaDebito.innerHTML = contaDebito;
    movContaCredito.innerHTML = contaCredora;

    //adicionar colspan 2 na coluna descricao
    movDescricao.setAttribute("colspan", "4");

    tr.appendChild(movCodigo);
    tr.appendChild(movDescricao);
    tr.appendChild(movValor);
    tr.appendChild(movData);
    tr.appendChild(movContaDebito);
    tr.appendChild(movContaCredito);

    //adicionar classe no tr
    tr.classList.add("tr-table-movimentation");

    table.appendChild(tr);
}

document.getElementById('voltarConta').addEventListener('click', () => {
    window.history.back();
})

function imprimir() {
    window.print();
}