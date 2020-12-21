$(function () {
    $('[data-toggle="popover"]').popover()
})

function Incluir_Beneficiario(txtid) {
    let btnIncluirBenef = document.getElementById("btnIncluirBenef");
    let txtcpf = document.getElementById("CPFBenef").value;
    let txtnome = document.getElementById("NomeBenef").value;    

    let dataTable = document.getElementById("dtBenef");
    let tbody = dataTable.children[1];

    if (tbody == null || tbody == undefined) {
        tbody = document.createElement("tbody");
        tbody.id = "tbodyBenef";
    }

    let tr = document.createElement("tr");
    tr.id = "tr" + txtid;

    let id = document.createElement("td");
    id.textContent = txtid;
    id.id = "id" + txtid;
    id.style = "display: none";
    tr.appendChild(id);

    let cpf = document.createElement("td");
    cpf.textContent = txtcpf;
    cpf.id = "cpf" + txtid;
    cpf.setAttribute("class", "CPF");
    tr.appendChild(cpf);


    let nome = document.createElement("td");
    nome.textContent = txtnome;
    nome.id = "nome" + txtid;
    nome.setAttribute("class", "NOME");
    tr.appendChild(nome);

    let btns = document.createElement("td");
    btns.innerHTML = '<button id="btnEditarBenef' + txtid + '" type="button" class="btn btn-primary" onclick="editarBenefModal(' + txtid + ');" >Alterar</button>';
    btns.innerHTML = btns.innerHTML + '<button id="btnExcluirBenef' + txtid + '" type="button" class="btn btn-primary" style="margin-left:10px" onclick="excluirBenefModal(' + txtid + ');" >Excluir</button>';
    tr.appendChild(btns);

    if (dataTable.children.length == 1) {
        tbody.appendChild(tr);
        dataTable.appendChild(tbody);
    }
    else {
        tbody.appendChild(tr);
    }

    btnIncluirBenef.setAttribute("onclick", "Incluir_Beneficiario(" + (txtid + 1) + ");");

}

function excluirBenefModal(txtid) {
    let dataTable = document.getElementById("tbodyBenef");
    let linha = document.getElementById("tr" + txtid);

    dataTable.removeChild(linha);
}

function editarBenefModal(txtid) {
    let nome = document.getElementById("nome" + txtid);
    let cpf = document.getElementById("cpf" + txtid);
    let btneditar = document.getElementById("btnEditarBenef" + txtid);
    let btnexcluir = document.getElementById("btnExcluirBenef" + txtid);


    let txtnome = nome.textContent;
    let txtcpf = cpf.textContent;

    nome.textContent = "";
    cpf.textContent = "";


    let input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "form-control";
    input1.id = "inputNome" + txtid;
    input1.value = txtnome;
    nome.appendChild(input1);

    let input2 = document.createElement("input");
    input2.type = "text";
    input2.className = "form-control";
    input2.id = "inputCPF" + txtid;
    input2.value = txtcpf;
    input2.style = "width: 130px";
    input2.setAttribute("onKeyUp", "formatarCampo(this);");
    input2.setAttribute("onKeyDown", "formatarCampo(this);");
    input2.setAttribute("onKeyPress", "return onlynumber();");
    input2.setAttribute("maxlength", "14");
    
    cpf.appendChild(input2);

    btnexcluir.style = "display: none";
    btneditar.className = "btn btn-success";
    btneditar.textContent = "Salvar";
    btneditar.setAttribute("onclick", "salvarBenefModal(" + txtid + ");");

}

function salvarBenefModal(txtid) {
    let inputcpf = document.getElementById("inputCPF" + txtid);
    let inputnome = document.getElementById("inputNome" + txtid);
    let btneditar = document.getElementById("btnEditarBenef" + txtid);
    let btnexcluir = document.getElementById("btnExcluirBenef" + txtid);
    let nome = document.getElementById("nome" + txtid);
    let cpf = document.getElementById("cpf" + txtid);

    nome.textContent = inputnome.value;
    cpf.textContent = inputcpf.value;

    btnexcluir.style = "margin-left:10px";
    btneditar.className = "btn btn-primary";
    btneditar.textContent = "Alterar";
    btneditar.setAttribute("onclick", "editarBenefModal(" + txtid + ");");
}

function encapsularDadosTabela() {
    var listaTabela = [];
    $.each($("#dtBenef > tbody > tr"), function (index, value) {
        var linhaTabela = $(this);
        var itemTabela = {
            cpf: linhaTabela[0].children[1].textContent,
            nome: linhaTabela[0].children[2].textContent
        };
        listaTabela.push(itemTabela);
    });
    return listaTabela;
};

function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[0-9.]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
function formatarCampo(campoTexto) {
    campoTexto.value = campoTexto.value.replace(/(\.|\/|\-)/g, "");
    if (campoTexto.value.length <= 11) {
        campoTexto.value = mascaraCpf(campoTexto.value);
    }
}
function retirarFormatacao(campoTexto) {
    campoTexto.value = campoTexto.value.replace(/(\.|\/|\-)/g, "");
}
function mascaraCpf(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
}


function carregarBenef(idDataTable, id) {
    let btnIncluirBenef = document.getElementById("btnIncluirBenef");
    let dataTable = document.getElementById(idDataTable);
    let tbodyOld = dataTable.children[1];

    tbodyOld.remove();
    let tbody = document.createElement("tbody");
    tbody.id = "tbodyBenef";

    $.ajax({
        url: "/Beneficiario/ListarBeneficiarios",
        type: "POST",
        data: {
            id: id
        }
    }).done(function (rest) {
        //console.log(rest);
        let count = rest.length - 1;

        for (let i = 0; i <= count; i++) {

            let tr = document.createElement("tr");
            tr.id = "tr" + i;

            let cpf = document.createElement("td");
            cpf.textContent = rest[i].CPF;
            cpf.id = "cpf" + i;
            cpf.setAttribute("class", "CPF");
            tr.appendChild(cpf);


            let nome = document.createElement("td");
            nome.textContent = rest[i].Nome;
            nome.id = "nome" + i;
            nome.setAttribute("class", "NOME");
            tr.appendChild(nome);

            let btns = document.createElement("td");
            btns.innerHTML = '<button id="btnEditarBenef' + i + '" type="button" class="btn btn-primary" onclick="editarBenefModal(' + i + ');" >Alterar</button>';
            btns.innerHTML = btns.innerHTML + '<button id="btnExcluirBenef' + i + '" type="button" class="btn btn-primary" style="margin-left:10px" onclick="excluirBenefModal(' + i + ');" >Excluir</button>';
            tr.appendChild(btns);

            tbody.appendChild(tr);

            btnIncluirBenef.setAttribute("onclick", "Incluir_Beneficiario(" + (i + 1) + ");");
        }

        dataTable.appendChild(tbody);
        loadDataTable(idDataTable);

    }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
    });
} 