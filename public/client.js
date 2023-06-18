const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)
socket.emit('new-user-joined',name);
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value);
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    appendMessage(msg, 'outgoing');// Append 
    textarea.value = '';
    scrollToBottom();

    socket.emit('message', msg)// Send to server 

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}
function notify(msg,type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');
    mainDiv.innerHTML = msg;
    messageArea.appendChild(mainDiv);
    // socket.emit('message', msg);
}
// socket.on('notification',(msg)=>{

// })
// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})
//If a new user joins receive his/her name from the server
socket.on('user-joined',name=>{
    notify(`${name} joined the chat ✅`,'incoming')
});

socket.on('left',name=>{
    notify(`${name} left the chat 👋`,'incoming')
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
