const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room =document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    console.log(message)
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText= message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const message = input.value;
    socket.emit(
        "new_message", 
        message,
        roomName,
        () => {addMessage(`You: ${message}`)}
    );

    input.value = "";

}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const nickName = input.value;
    socket.emit(
        "nickname", 
        nickName,
    );

    input.value = "";

}


const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const roomnameInput = form.querySelector("#roomname");
    const nicknameInput = form.querySelector("#nickname");

    const roomname = roomnameInput.value;
    const nickname = nicknameInput.value;
    socket.emit(
        "enter_room", 
        {roomname, nickname},
        showRoom
        );
    roomName = roomname
    roomnameInput.value = "";
    nicknameInput.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined!!`);
});

socket.on("bye", (user, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} left!!`);
});
socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});