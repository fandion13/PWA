
//Carregamento AJAX
let ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

//Monitorar o retorno da requisição
ajax.onreadystatechange = function() {

    //Especificar o container que recebe o conteúdo gerado neste arquivo
    let content = document.getElementById("content");

    if(this.readyState == 4 && this.status == 200) {

        let data_json = JSON.parse(ajax.responseText);

        if(data_json.length == 0) {

            content.innerHTML = '<div class="alert alert-warning" role="alert">Desculpe, ainda não temos brinquedos cadastrados!</div>';

        } else {

            let html_content = "";

            data_json.forEach(element => {

                html_content += '<div class="row"><div class="col-12"><h2><span></span> ' + element.categoria + '</h2></div></div>'

                if(element.brinquedos.length == 0) {

                    html_content += '<div class="row"><div class="col-12"><div class="alert alert-warning" role="alert">Desculpe, não temos brinquedos para essa categoria!</div></div></div>'

                } else {

                    html_content += '<div class="row">';

                    element.brinquedos.forEach(brinquedo => {

                        html_content += card_brinquedo(brinquedo.nome, brinquedo.imagem, brinquedo.valor, brinquedo.whatsapp);
                    
                    });

                    html_content += '</div>';

                }    

            });

            content.innerHTML = html_content;

            cache_dinamico(data_json);

        }

    }

}

//Template Card Brinquedo
var card_brinquedo = function(nome, imagem, valor, whatsapp) {

    return '<div class="col-lg-6">' +
                '<div class="card">' +
                    '<img src="' + imagem + '" class="card-img-top" alt="' + nome + '">' +
                    '<div class="card-body">' +
                        '<h5 class="card-title">' + nome + '</h5>'+
                        '<p class="card-text"><strong>Valor:</strong>' + valor + '</p>' +
                        '<div class="d-grid gap-2">' +
                            '<a href="https://api.whatsapp.com/send?phone=55' + whatsapp + '&text=Olá! Gostaria de mais informações sobre o brinquedo: ' + nome + '" target="_blank" class="btn btn-info">' +
                                'Contato Proprietário' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

}

// Construir o cache dinâmico
var cache_dinamico = function(data_json) {

    if('caches' in window) {

        console.log("Detelando cache dinâmico antigo!");

        caches.delete("brinquedo-app-dinamico").then(function() {

            if(data_json.length > 0) {

                var files = ['dados.json'];

                data_json.forEach(element => {

                    element.brinquedos.forEach(brinquedo => { 

                        if(files.indexOf(brinquedo.imagem) == -1){

                            files.push(brinquedo.imagem);

                        }    
                    
                    });
                })

            }

            caches.open("brinquedo-app-dinamico").then(function(cache) {

                cache.addAll(files).then(function() {

                    console.log("Novo cache dinâmico adcionado!");

                })

            });

        });

    }

}

// Botão de Instalação do APP
let disparoInstalacao = null;
const btInstall = document.getElementById("btInstall")

let inicializarInstalacao = function() {

    btInstall.removeAttribute("hidden");

    btInstall.addEventListener('click', function() {

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted') {
                console.log("Usuário realizou a instalação!");
            } else {
                console.log("Usuário não realizou a instalação!");
            }

        })

    })

}

window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt) {
    disparoInstalacao = evt;
}