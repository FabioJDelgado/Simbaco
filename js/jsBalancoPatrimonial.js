const urlParams = new URLSearchParams(window.location.search);
const idPC = Number(urlParams.get("idPC"));
const nomePC = urlParams.get("nomePC");

let lista = getContas();
let total = 0;
let tableBodyAtivo = document.getElementById('tableBalancoAtivo');
let tableBodyPassivo = document.getElementById('tableBalancoPassivo');


function transformaTextoEmNumero(valor){
    return Number(valor.replaceAll(".", "").replaceAll(",", "."));
}

// function transformaNumeroEmTexto(valor){
//     return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
// }


//let row = document.createElement('tr');

const arrPassivoLiquido = [];
let totalAtivo = 0;

lista.forEach(element => {

    if(element.idPC === Number(idPC)){

        if(element.tipoContaA === "ATIVO"){

            tableBodyAtivo.innerHTML += `<tr>
            <td>${element.nome}</td>
            <td>R$ ${element.saldoAtual}</td>
            </tr>
            `;

            totalAtivo += transformaTextoEmNumero(element.saldoAtual);
        } 

        if(element.tipoContaA === "PASSIVO" || element.tipoContaA === "PLIQUIDO"){

            arrPassivoLiquido.push(element);

            tableBodyPassivo.innerHTML += `<tr>
            <td>${element.nome}</td>
            <td>R$ ${element.saldoAtual}</td>
            </tr>`;

        } 
    }
});

tableBodyAtivo.innerHTML += `<tr>
        <td>Total</td>
        <td>R$ ${totalAtivo}</td>
        </tr>`;



preencheTablePassivoLiquido(tableBodyPassivo);



function preencheTablePassivoLiquido(table){

    const t = arrPassivoLiquido.sort((a, b) =>  a.tipoContaA.localeCompare(b.tipoContaA));

    table.innerHTML = `
                    <tr>
                        <td>Nome Passivo</td>
                        <td>Valor Passivo</td>
                    </tr>
                    `;

    t.forEach(element => {
        table.innerHTML += `<tr>
        <td>${element.nome}</td>
        <td>R$ ${element.saldoAtual}</td>
        </tr>
        `;
    });

    totalPassivo(t);

    table.innerHTML += `<tr>
        <td>Total</td>
        <td>R$ ${totalPassivo(t)}</td>
        </tr>
        `;
}

function totalPassivo(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += transformaTextoEmNumero(arr[i].saldoAtual);
    }
    return total;
}

function voltar() {
    window.history.back();
}

function imprimir() {
    window.print();
}