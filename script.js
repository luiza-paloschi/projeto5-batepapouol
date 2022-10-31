let messages = [];
let ultimaMensagem;
let usuário = {};
let participantes = [];
let destinatario;
let tipo;

function fazerLogin(){
    const nome = document.querySelector('.user').value;
    if(nome !== ''){
        usuário = {name: nome};
        const entrar = document.querySelector('.entrar');
        entrar.innerHTML =
        `<img class ="gif" alt="carregando" src ="./images/loading2.gif"/>
        <div>Entrando</div>`;
        const enviarNome =  axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuário);
        enviarNome.then(entrarnaSala);
        enviarNome.catch(erroAutenticacao);
    } else if(nome === ''){
        alert('Por favor, digite um nome!');
    }
}

function erroAutenticacao(erro){
    console.log("Status code: " + erro.response.status);
	alert('Esse nome já está em uso! Digite outro nome.');
    window.location.reload(); 
}

function entrarnaSala(){
    recebeMensagens();
    manterConexão();
    pegaParticipantes();
    usuarioLogado();
    selTodos();
    const telaLogin = document.querySelector('.tela_login');
    telaLogin.classList.add('hidden');
    const conteudo = document.querySelectorAll('.content');
    for(let i = 0; i< conteudo.length; i++){
        conteudo[i].classList.remove('hidden');
    }
}

function usuarioLogado(){
    setInterval(manterConexão, 5000);
    setInterval(recebeMensagens, 3000);
    setInterval(pegaParticipantes, 6000);
}

function manterConexão(){
    const resposta =axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuário);
    resposta.catch(erroConexao);
}
function erroConexao(erro){
    alert("Erro de conexão. Por favor, entre novamente.");
    window.location.reload();
}

function recebeMensagens(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then( (resposta) => {
        messages = resposta.data;
        renderizarMensagens();
    })
}

function renderizarMensagens(){
    const chat = document.querySelector('.messages');
    chat.innerHTML = '';
    for(let i = 0; i < messages.length; i++){
        if(messages[i].type === 'status'){
            chat.innerHTML +=
            `<div class = "mensagem status">
                <span class = "time">(${messages[i].time})&nbsp;</span>
                <b>${messages[i].from}&nbsp;</b>
                <span class="text">${messages[i].text}&nbsp;</span>
            </div>`;
        } else if (messages[i].type === 'message'){
            chat.innerHTML +=
             `<div class = "mensagem message">
                <div class = "time">(${messages[i].time})&nbsp</div>
                <b> ${messages[i].from}&nbsp;</b>
                <div>para&nbsp<b>${messages[i].to}</b>:&nbsp</div>
                <div class="text">${messages[i].text}&nbsp</div>
              </div>`;
        } else if (messages[i].type === 'private_message'){
                if(messages[i].to === usuário.name || messages[i].from === usuário.name){
                    chat.innerHTML +=
                    `<div class = "mensagem private_message">
                       <div class = "time">(${messages[i].time})&nbsp</div>
                       <b> ${messages[i].from}&nbsp;</b>
                       <div>reservadamente para&nbsp<b>${messages[i].to}</b>:&nbsp</div>
                       <div class="text">${messages[i].text}&nbsp</div>
                     </div>`;
                }
        }
    }
    Scroll();
}

function Scroll(){
    const mensagens = document.querySelector(".messages");
    const novaMensagem = mensagens.lastElementChild;
    const html = novaMensagem.innerHTML;
    if(ultimaMensagem !== html){
        ultimaMensagem = html;
        novaMensagem.scrollIntoView();
    }
}

function enviarMensagem(){
    const mensagem = document.querySelector('.message-box').value;
    const mensagemSemEspaco = mensagem.replace(/ /g, '');
    if (mensagem ==='' || mensagemSemEspaco === ''){
        return;
    }
    const message = {
        from: usuário.name,
	    to: destinatario,
	    text: mensagem,
	    type: tipo 
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);
    const input = document.querySelector('.message-box');
    input.value = '';
    promise.then(recebeMensagens);
    promise.catch(mensagemErro);
}

function mensagemErro(erro){
    console.log("Status code: " + erro.response.status);
    alert('O usuário não se encontra mais na sala.');
    window.location.reload();
}

function showMenu(){
    const background = document.querySelector('.side_menu_background');
    background.style.display = 'flex';
    const lateral = document.querySelector('.side_menu')
    lateral.style.visibility = 'visible';
}
function hideMenu(){
    const background = document.querySelector('.side_menu_background');
    background.style.display = 'none';
    const lateral = document.querySelector('.side_menu')
    lateral.style.visibility = 'hidden';
} 


function pegaParticipantes(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then((resposta)=> {
        participantes = resposta.data;
        renderizarParticipantes();
    })
}
function renderizarParticipantes(){
    const lista = document.querySelector('.online_users');
    lista.innerHTML = '';
    for(let i = 0; i< participantes.length; i++){

        if(participantes[i].name !== usuário.name){
            lista.innerHTML +=
            `<div id="${participantes[i].name}" class="participante" onclick="selParticipante(this)">
            <ion-icon name="person-circle"></ion-icon>
            <p>${participantes[i].name}</p>
            </div>`;
        }
    }
    if(destinatario !== "Todos"){
        const to = document.getElementById(destinatario);
        if(to !== null){
            to.classList.add('selected');
            const divIcon = criarIcone('ícone');
            to.appendChild(divIcon);
        } else{
            selTodos();
        }
    }
}

function criarIcone(id){
    const elDiv = document.createElement('div');
    elDiv.className = 'icon';
    elDiv.id = id;
    elDiv.innerHTML = '<ion-icon name="checkmark"></ion-icon>';
    return elDiv;
}

function selTodos(){
    const todos = document.getElementById('todos');
    todos.classList.add('selected');
    const divIcon = criarIcone('ícone');
    todos.appendChild(divIcon);
    destinatario = "Todos";
    selPublic();
}

function selPublic(){
    if (tipo === "private_message"){
        const private = document.getElementById('private_message');
        private.classList.remove('selected');
        const removeIcon = document.getElementById('ícone2');
        removeIcon.parentNode.removeChild(removeIcon);
    }
    const public = document.getElementById('public');
    public.classList.add('selected');
    const divIconVisibility = criarIcone('ícone2');
    public.appendChild(divIconVisibility);
    tipo = "message";
    const legenda = document.getElementById('legenda');
    legenda.innerHTML = `Enviando para ${destinatario} (publicamente)`;
}

function selParticipante(participante){
    const selAnterior = document.querySelector('.listaParticipantes .selected');
    const legenda = document.getElementById('legenda');

    if (selAnterior !== null){
        selAnterior.classList.remove('selected');
        const removeIcon = document.getElementById('ícone');
        removeIcon.parentNode.removeChild(removeIcon);
    }

    participante.classList.add('selected');
    const divIcon = criarIcone('ícone');
    participante.appendChild(divIcon);
    const selecionado = document.querySelector('.listaParticipantes .selected p');
    destinatario = selecionado.innerHTML;
    if(destinatario ==='Todos'){
        if (tipo ==='private_message'){
            selPublic();
        }
    }
    if (tipo === 'private_message'){
        legenda.innerHTML = `Enviando para ${destinatario} (reservadamente)`;
    } else {
        legenda.innerHTML = `Enviando para ${destinatario} (publicamente)`;
    }
}

function selVisibilidade(visibilidade){
    const legenda = document.getElementById('legenda');
    if (destinatario === 'Todos'){
        if(visibilidade.id === 'private_message'){
            return;
        }
    }
    
    const selAnteriorVis = document.querySelector('.options_visibility .selected');
    if (selAnteriorVis !== null){
        selAnteriorVis.classList.remove('selected');
        const removeIcon = document.getElementById('ícone2');
        removeIcon.parentNode.removeChild(removeIcon);
    }
    visibilidade.classList.add('selected');
    const divIcon = criarIcone('ícone2');
    visibilidade.appendChild(divIcon);
    if (visibilidade.id === 'private_message'){
        tipo = 'private_message';
        legenda.innerHTML = `Enviando para ${destinatario} (reservadamente)`;
    } else {
        tipo = 'message';
        legenda.innerHTML = `Enviando para ${destinatario} (publicamente)`;
    }
}