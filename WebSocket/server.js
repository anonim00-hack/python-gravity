// -----modules----- //
const Websocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();
app.use(express.static(__dirname));
// -----servers----- //
const server = http.createServer(app);
const webServer = new Websocket.Server({server});
// function of user count //
const users=new Map();
let userNum=1;
const PosOfUsers=new Map();
const ColorOfUsers=new Map();
const jumpStatus=new Map();
const jumpHeightMap=new Map()
const playerVelocity=new Map();
const Cubs=[{
    w:400,
    h:20,
    x:350,
    y:500,
    color:'#1a1a1a'
}]
function GenerateColor(){
    const Colors=['red','yellow','blue','white','pink','green'];
    return Colors[Math.floor(Math.random()*Colors.length)];
};
webServer.on('connection',(ws)=>{
    const UserColor=GenerateColor();
    let Num=userNum++;
    // ----user info---- //
    users.set(Num,ws);
    PosOfUsers.set(Num,{x:100,y:100});
    ColorOfUsers.set(Num,UserColor);
    jumpStatus.set(Num, false);
    jumpHeightMap.set(Num, 0);
    playerVelocity.set(Num,{x:0,y:0});
    if(Num===2){
        console.log('TWO PLAYERS IN SERVER');
    };
    ws.send(JSON.stringify({
        type:'init',
        Num:Num,
        color:UserColor
    }));
    // --- VERY IMPORTANT THING --- //
    const allUsers=[];
    PosOfUsers.forEach((position,id)=>{
        allUsers.push({
            Num:id,
            x:position.x,
            y:position.y,
            color:ColorOfUsers.get(id)
        });
    });
    ws.send(JSON.stringify({
        type:'users',
        users:allUsers
    }));
    broadcastToAll(JSON.stringify({
        type:'user_joined',
        Num:Num,
        x:PosOfUsers.get(Num).x,
        y:PosOfUsers.get(Num).y,
        color:UserColor
    }));
    ws.send(JSON.stringify({
        type:'create',
        cubs:Cubs.length,
        cubColor:Cubs[0]['color'],
        cubW:Cubs[0]['w'],
        cubH:Cubs[0]['h'],
        cubX:Cubs[0]['x'],
        cubY:Cubs[0]['y']
    }));
    ws.on('message',(message)=>{
        try{
            const data=JSON.parse(message.toString());
            if(data.type==='move'){
                const currentPos=PosOfUsers.get(Num);
                let newX=currentPos.x;
                let newY=currentPos.y;
                const velocity=playerVelocity.get(Num);
                if(data.direction.includes('up')&&!jumpStatus.get(Num)&&currentPos.y>=580){
                    jumpStatus.set(Num,true);
                    jumpHeightMap.set(Num,-20);
                };
                if(data.direction.includes('down')){newY+=10};
                if(data.direction.includes('left')){velocity.x=-10};
                if(data.direction.includes('right')){velocity.x=10};
                playerVelocity.set(Num,velocity);
                // ----- max and min cords for borders ----- //
                newX=Math.max(0,Math.min(780,newX));
                newY=Math.max(0,Math.min(580,newY));
                PosOfUsers.set(Num,{x:newX,y:newY})
                broadcastToAll(JSON.stringify({
                    type:'move',
                    Num:Num,
                    x:newX,
                    y:newY
                }))
            };
        }catch(error){
            console.log('Something wrong or you are offline, or if you are coder'+error);
        };
    });
    ws.on('close',()=>{
        users.delete(Num);
        PosOfUsers.delete(Num)
        ColorOfUsers.delete(Num)
        broadcastToAll(JSON.stringify({
            type:'user_left',
            Num:Num
        }))
    });
});
// -----checking a user online or offline ----- //
function broadcastToAll(message){
    users.forEach((client,Num)=>{
        if(client.readyState===Websocket.OPEN){
            client.send(message);
        };
    });
};
// ---- player functions ----- //
setInterval(()=>{
    users.forEach((ws,Num)=>{
        const currentPos=PosOfUsers.get(Num);
        let newX=currentPos.x;
        let newY=currentPos.y;
        const velocity=playerVelocity.get(Num);
        newX+=velocity.x*1.2;
        newX=Math.max(0,Math.min(780,newX))
        velocity.x*=0.8;
        if(Math.abs(velocity.x)<0.1)velocity.x=0;
        if(jumpStatus.get(Num)){
            newY+=jumpHeightMap.get(Num);
            jumpHeightMap.set(Num,jumpHeightMap.get(Num)+1.5);
            if(jumpHeightMap.get(Num)>0){
                jumpStatus.set(Num,false);
            };
        }else{newY+=10;};
        if(newY>=580){newY=580}
        newY=Math.max(0,Math.min(580,newY));
        if(newY!==currentPos.y || newX!==currentPos.x){
            PosOfUsers.set(Num,{x:newX,y:newY});
            broadcastToAll(JSON.stringify({
                type:'move',
                Num:Num,
                x:newX,
                y:newY
            }))
        };
    });
},50);
// ----- open a server ----- //
server.listen(PORT);