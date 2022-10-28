let messages = [];
let ultimaMensagem;
let usuário = {}
let nomeValido = false
inicio()

function inicio(){
    
    while(nomeValido === false){
        const nome = prompt("Digite o nome de usuário");
        
        if(nome !== ''){
            nomeValido = true
            usuário = {name: nome}
            const aa =  axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuário)
            aa.then(recebeMensagens)
            aa.catch(erroAutenticacao)
        } else{
            alert('Por favor, digite um nome!')
        }
    }

}

function erroAutenticacao(erro){
    console.log("Status code: " + erro.response.status);
	alert('Esse nome já está em uso! Digite outro nome.')
    inicio()
}

function recebeMensagens(){
    
}