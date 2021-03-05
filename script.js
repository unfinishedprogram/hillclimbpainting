
cIn = document.getElementById("canvasIn");

tempCan = document.getElementById('temp');

img = document.getElementById("scream");

const img_width = img.width;
const img_height = img.height;


cIn.width = img_width;

cIn.height = img_height;


tempCan.height = img_height;
tempCan.width = img_width;

var ctxIn = cIn.getContext("2d");

var tempCtx = tempCan.getContext("2d");

ctxIn.drawImage(img, 0, 0);
goalData = ctxIn.getImageData(0, 0, img_width, img_height);
ctxIn.fillRect(0,0,img_width, img_height);


function compareData(data, goal){
    let dif = 0;
    for( let i = 0; i < data.data.length; i += 4 ){

        nextDif = Math.abs( data.data[i] - goal.data[i]);
        if(nextDif)dif += nextDif;
        nextDif = Math.abs( data.data[i+1] - goal.data[i+1]);
        if(nextDif)dif += nextDif;
        nextDif = Math.abs( data.data[i+2] - goal.data[i+2]);
        if(nextDif)dif += nextDif;
    }
    //console.log(dif/ data.data.length);
    return dif / data.data.length;
}

function getRandomColor(){
    return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
}

function getRandomRect(width, height){
    return [Math.random() *width, Math.random() * height, Math.random()*20, Math.random()*20]
}

function getNextCtx(oldData){
    let rectDims = getRandomRect(img_width, img_height);
    tempCtx.fillStyle = getRandomColor();

    tempCtx.width = img_width;
    tempCtx.height = img_height;

    
    tempCtx.putImageData(oldData, 0, 0);
    
    tempCtx.fillRect(rectDims[0], rectDims[1], rectDims[2], rectDims[3]);

    newDat = tempCtx.getImageData(0, 0, img_width, img_height)

    return newDat;
}

function reverseData(data){
    mydata = ctxIn.createImageData(img_width, img_height);

    for (let i = 0; i < data.length; i++) {
        mydata[i] = Math.abs(data[i]);
    }

    console.log(data)
    return mydata;
}

var interval = setInterval(function() {
    ctxInData = ctxIn.getImageData(0,0,img_width,img_height)
    var data = getNextCtx(ctxInData);
    while(compareData(data, goalData) > compareData(ctxInData, goalData)){
        data = getNextCtx(ctxInData);
    }

    ctxIn.putImageData(data, 0, 0);
}, 0.1);
