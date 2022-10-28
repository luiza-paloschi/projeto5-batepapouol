let messages = [];
let ultimaMensagem;
let usuário = {}
//inicio()

function fazerLogin(){
    const nome = document.querySelector('.user').value
    if(nome !== ''){
        usuário = {name: nome}
       const entrar = document.querySelector('.entrar')
        entrar.innerHTML = 
        `<img class ="gif" src ="./images/loading2.gif"/>
        <div>Entrando</div>`
    
        const aa =  axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuário)
       aa.then(entrarnaSala)
        aa.catch(erroAutenticacao)
    } else{
        alert('Por favor, digite um nome!') 
    }

}

function erroAutenticacao(erro){
    console.log("Status code: " + erro.response.status);
	alert('Esse nome já está em uso! Digite outro nome.')
    window.location.reload()
    
} 

function entrarnaSala(){
    recebeMensagens()
    manterConexão
    usuarioLogado()
    const telaLogin = document.querySelector('.tela_login')
    console.log(telaLogin)
    telaLogin.classList.add('hidden')
    const conteudo = document.querySelector('.all')
    conteudo.classList.remove('hidden')
    
    
}

function usuarioLogado(){
    setInterval(manterConexão, 5000)
    setInterval(recebeMensagens, 1000)
}
//window.location.reload()

/*function inicio(){
    
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

} */

/*function erroAutenticacao(erro){
    console.log("Status code: " + erro.response.status);
	alert('Esse nome já está em uso! Digite outro nome.')
    
} */

//setInterval(manterConexão, 5000)
//setInterval(recebeMensagens, 3000)

function manterConexão(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuário)
}

function recebeMensagens(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(respostaMensagens)

}

function respostaMensagens(resposta){
    messages = resposta.data
    renderizarMensagens()
    
}

function renderizarMensagens(){

    const chat = document.querySelector('.messages')
    chat.innerHTML = ''
    for(let i = 0; i < messages.length; i++){
      
        if(messages[i].type === 'status'){
            chat.innerHTML += 
            `<div class = "mensagem status">
                <span class = "time">(${messages[i].time})&nbsp;</span>
                <b>${messages[i].from}&nbsp;</b>
                <span class="text">${messages[i].text}&nbsp;</span>
            </div>`
      
        } else if (messages[i].type === 'message'){
            chat.innerHTML +=
             `<div class = "mensagem message">
                <div class = "time">(${messages[i].time})&nbsp</div>
                <b> ${messages[i].from}&nbsp;</b>
                <div>para&nbsp<b>${messages[i].to}</b>:&nbsp</div>
                <div class="text">${messages[i].text}&nbsp</div>
              </div>`
            
        } else if (messages[i].type === 'private_message'){
                if(messages[i].to === usuário.name || messages[i].from === usuário.name){
                    chat.innerHTML +=
                    `<div class = "mensagem private_message">
                       <div class = "time">(${messages[i].time})&nbsp</div>
                       <b> ${messages[i].from}&nbsp;</b>
                       <div>reservadamente para&nbsp<b>${messages[i].to}</b>:&nbsp</div>
                       <div class="text">${messages[i].text}&nbsp</div>
                     </div>` 
                }
        }
      
        
    }
    Scroll();
}

function Scroll(){
    const mensagens = document.querySelector(".messages")
    const novaMensagem = mensagens.lastElementChild;
    const html = novaMensagem.innerHTML
    if(ultimaMensagem !== html){
        ultimaMensagem = html;
        novaMensagem.scrollIntoView();
    }

}

function enviarMensagem(){
    const mensagem = document.querySelector('.message-box').value
    console.log(mensagem)
    const message = {
        from: usuário.name,
	    to: "Todos",
	    text: mensagem,
	    type: "message" 
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message)
    const input = document.querySelector('.message-box')
    input.value = ''
    promise.then(mensagemEnviada)
    promise.catch(mensagemErro)
    renderizarMensagens()
}

function mensagemEnviada(){
    console.log('mensagem enviada')
    recebeMensagens()
}

function mensagemErro(erro){
    console.log("Status code: " + erro.response.status)
    window.location.reload()
}