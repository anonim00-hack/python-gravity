const gameContainer=document.getElementById('gameContainer');
const userInfo=document.getElementById('userInfo');
const userCount=document.getElementById('userCount');

let ws;
let myUserId;
let myColor;
const users=new Map();
// -----function for connect ----- //        
function connect(){
    ws=new WebSocket('ws://192.168.1.61:3000');
    // ws=new WebSocket('ws://localhost:3000');
    // ----- open ----- //
    ws.onopen=()=>{
        console.log('Connected to server');
    };
    ws.onmessage=(event)=>{
        try {
            const data=JSON.parse(event.data);
            handleMessage(data);
        } catch (error){
            console.error('Error parsing message:', error);
        }
    };

    ws.onclose=()=>{
        console.log('Disconnected from server');
        setTimeout(connect, 3000); // Reconnect after 3 seconds
    };

    ws.onerror=(error)=>{
        console.error('WebSocket error:', error);
    };
}
function handleMessage(data){
    switch (data.type){
        case 'init':
            myUserId=data.Num;
            myColor=data.color;
            userInfo.innerHTML=`Your ID:${myUserId} | Color:<span style="color:${myColor}">${myColor}</span>`;
            break;

        case 'users':
            data.users.forEach(user=>{
                addUser(user.Num, user.x, user.y, user.color);
            });
            updateUserCount();
            break;

        case 'user_joined':
            addUser(data.Num, data.x, data.y, data.color);
            updateUserCount();
            break;

        case 'user_left':
            removeUser(data.Num);
            updateUserCount();
            break;
        case 'move':
            moveUser(data.Num, data.x, data.y);
            break;
        case 'create':
            createEl(data.cubX,data.cubY,data.cubW,data.cubH,data.cubColor,data.cubs);
            break
    }
}
function addUser(Num, x, y, color){
    if (users.has(Num)) return;
    const square=document.createElement('div');
    square.className='user-square';
    square.id=`user-${Num}`;
    square.style.backgroundColor=color;
    square.style.left=x+'px';
    square.style.top=y+'px';
    const label=document.createElement('div');
    label.style.cssText=`
        position:absolute;
        top:-20px;
        left:0;
        font-size:12px;
        color:white;
        background:rgba(0,0,0,0.7);
        padding:2px 4px;
        border-radius:3px;
        white-space:nowrap;
    `;
    label.textContent=`User ${Num}`;
    square.appendChild(label);

    gameContainer.appendChild(square);
    users.set(Num, square);
}
function createEl(x,y,w,h,color,cubs){
    const border=document.createElement('div');
    border.style.position='absolute';
    border.style.background=color;
    border.style.width=w+'px';
    border.style.height=h+'px';
    border.style.left=x+'px';
    border.style.top=y+'px';
    gameContainer.appendChild(border)
};
function removeUser(Num){
    const square=users.get(Num);
    if (square){
        gameContainer.removeChild(square);
        users.delete(Num);
    }
}
function moveUser(Num, x, y){
    const square=users.get(Num);
    if (square){
        square.style.left=x+'px';
        square.style.top=y+'px';
    }
}
function updateUserCount(){
    userCount.textContent=users.size;
}
let activeDirections=new Set();
document.addEventListener('keydown', (event)=>{
    if (!ws || ws.readyState !==WebSocket.OPEN) return;
    if (event.key==='a' || event.key==='A') activeDirections.add('left');
    if (event.key==='d' || event.key==='D') activeDirections.add('right');
    if (event.key==='w' || event.key==='W') activeDirections.add('up');
    if (event.key==='s' || event.key==='S') activeDirections.add('down');
    if (activeDirections.size >0){
        ws.send(JSON.stringify({
            type:'move',
            direction:Array.from(activeDirections)
        }));
    }
});
document.addEventListener('keyup', (event)=>{
    if (event.key==='a' || event.key==='A') activeDirections.delete('left');
    if (event.key==='d' || event.key==='D') activeDirections.delete('right');
    if (event.key==='w' || event.key==='W') activeDirections.delete('up');
    if (event.key==='s' || event.key==='S') activeDirections.delete('down');
});
connect();