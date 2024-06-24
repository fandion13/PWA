//Carregar dados dinâmicos
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var content = document.getElementById('content');

    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);


        //Não tem produtos
        if(data_json.length == 0){

            content.innerHTML = '<div class="col-12"><div class="alert alert-warning" role="alert">Ainda não temos produtos cadastrados</div></div>';
        
        //Tem produtos
        }else{

            var html_content = "";
            
            for(var i=0; i<data_json.length;i++){

                html_content += "<h2>"+data_json[i].categoria+":</h2>";

                if(data_json[i].itens.length == 0){
                    html_content += '<div class="col-12"><div class="alert alert-warning" role="alert">Não há produtos cadastrados para esta categoria</div></div>';
                }else{
                    for(var j=0; j<data_json[i].itens.length; j++){
                        html_content += card_produto(data_json[i].itens[j].nome,data_json[i].itens[j].imagem,data_json[i].itens[j].descricao,data_json[i].itens[j].link);
                    }
                }

            }
            
            content.innerHTML = html_content;
            cache_dinamico(data_json);

        }
    //Erro no processamento
    }else{
        content.innerHTML = '<div class="col-12"><div class="alert alert-danger" role="alert">Ops! Erro ao processar sua solicitação</div></div>';
    }

}

//Template card
var card_produto = function(nome, imagem, descricao, link){

    return '<div class="col-12 col-sm-6">'+
            '<div class="card">'+
            '<img src="'+imagem+'" class="card-img-top" alt="Hamburguer">'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+nome+'</h5>'+
            '<p class="card-text">'+descricao+'</p>'+
            '<a href="'+link+'" target="_blank" class="btn btn-danger">Comprar</a>'+
            '</div>'+
            '</div>'+
            '</div>';

}

//Construir cache dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        console.log("Deletando cache dinâmico antigo...");
        caches.delete('ogro-app-v1-dinamico').then(function(){

            if(data_json.length >0){

                var files = ['dados.json'];

                for(var i=0; i<data_json.length;i++){
    
                    for(var j=0; j<data_json[i].itens.length; j++){
                        
                        if(files.indexOf(data_json[i].itens[j].imagem) == -1){
                            files.push(data_json[i].itens[j].imagem);
                        }
                    }
                }
    
            }

            caches.open('ogro-app-v1-dinamico').then(function (cache){

                cache.addAll(files).then(function(){
                    console.log("Novo cache dinâmico adicionado");
                });

            })

        });

    }

}

//Experiencia de Instalação

let disparoInstalacao = null;
const btInstall = document.getElementById("btInstall");

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener('click', function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação");
            }else{
                console.log("Usuário não fez a instalação");
            }

        });

    });


}

window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt){
    disparoInstalacao = evt;
}