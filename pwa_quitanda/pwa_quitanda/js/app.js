//Interceptar o prompt de instalação
let installPrompt = null;
const btInstall = document.getElementById('btInstall');

let iniciarInstalacao = function(){

    btInstall.removeAttribute('hidden');
    btInstall.addEventListener('click', function(){

        installPrompt.prompt();

        installPrompt.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){

                console.log("Usuário aceitou a instalação!");

            }else{

                console.log("Usuário NÃO aceitou a instalação!");
            }

        });

    });

}

window.addEventListener('beforeinstallprompt', gravarPrompt);

function gravarPrompt(evt){
    installPrompt = evt;
}

//Botao de Mapa atualizar o iframe do

var processar_mapa = function(url){
    document.getElementById("iframeMapa").src = url;
}

//Carregamento de Conteúdo
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    //Encerramento com sucesso
    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);

        var content = document.getElementById("content");

        if(data_json.length == 0){

            content.innerHTML = '<div class="col-12"><div class="alert alert-warning" role="alert">Não existem estabelecimentos cadastrados!</div></div>';

        }else{
           
            var html_content = "";

            for(var i=0; i< data_json.length; i++){

                html_content+='<div class="col-12"><h2>'+data_json[i].categoria+'</h2></div>';

                for(var j=0; j<data_json[i].itens.length; j++){

                    html_content+= card_item(data_json[i].itens[j].nome,data_json[i].itens[j].imagem,data_json[i].itens[j].descricao,data_json[i].itens[j].link,data_json[i].itens[j].mapa);

                }

            }

            content.innerHTML = html_content;
        }


    }

}

//Template do Card do Estabelecimento
var card_item = function (nome, imagem, descricao, link, mapa)
{
    return '<div class="col-12 col-md-6">'+
                '<div class="card">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="...">'+
                    '<div class="card-body">'+
                    '<h5 class="card-title">'+nome+'</h5>'+
                    '<p class="card-text">'+descricao+'</p>'+
                    '<button type="button" onclick="javascript:processar_mapa(\''+mapa+'\')" class="btn btn-primary btMapa" data-bs-toggle="modal" data-bs-target="#mapaModal">Endereço/Mapa</button>&nbsp;&nbsp;'+
                    '<a href="'+link+'" target="_blank" class="btn btn-success">Site do Produtor</a>'+
                    '</div>'+
                '</div>'+
            '</div>';
}