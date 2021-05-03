cIn = document.getElementById("canvasIn");
tempCan = document.getElementById('temp');
img = document.getElementById("scream");

const img_width = img.width;
const img_height = img.height;

stats = document.getElementById("stats");

var testedRectangles = 0;
var placedRectangles = 0;

cIn.width = img_width;

cIn.height = img_height;


tempCan.height = img_height;
tempCan.width = img_width;

var ctxIn = cIn.getContext("2d");

var tempCtx = tempCan.getContext("2d");

ctxIn.drawImage(img, 0, 0);
goalData = ctxIn.getImageData(0, 0, img_width, img_height);
ctxIn.fillRect(0,0,img_width, img_height);

function compareData(data, goal, rect){
    let diff = 0;
    let width = goal.width;
    for (let x = 0; x < rect[2] && x + rect[0] < goal.width; x++) {
        for (let y = 0; y < rect[3] && y + rect[1] < goal.height; y++) {
            let datindex = (y * rect[2] + x) * 4;
            let goalIndex = ((rect[1] + y) * width + (rect[0] + x)) *4;

            rdiff = Math.abs(data.data[datindex + 0] - goal.data[goalIndex + 0]);
            bdiff = Math.abs(data.data[datindex + 1] - goal.data[goalIndex + 1]);
            gdiff = Math.abs(data.data[datindex + 2] - goal.data[goalIndex + 2]);

            diff += Math.sqrt(rdiff*rdiff + bdiff*bdiff + gdiff*gdiff);
        }
    }
    return diff / (rect[2] * rect[3]);
}

function getRandomColor(){
    return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
    //return `rgb(${Math.floor(Math.random()*51)*5}, ${Math.floor(Math.random()*51)*5}, ${Math.floor(Math.random()*51)*5})`;
}

function getRandomRect(width, height){
    return [
        Math.floor(Math.random() * width), 
        Math.floor(Math.random() * height),
        Math.floor(Math.random() * 20) + 1, 
        Math.floor(Math.random() * 20) + 1
    ]
}

function getNextCtx(inputCtx, rect, color){
    oldData = inputCtx.getImageData(rect[0], rect[1], rect[2], rect[3]);
    oldDiff = compareData(oldData, goalData, rect);

    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, rect[2], rect[3]);

    newDat = tempCtx.getImageData(0, 0, rect[2], rect[3]);

    if(compareData(newDat, goalData, rect) < oldDiff) return true;
    return false;
}

function randomizeData(imgData){
    let tempDat = imgData;
    len = imgData.length;
    for(let i = 0; i < len; i+=4){
        imgData.data[i+0] = Math.floor(Math.random()*255);
        imgData.data[i+1] = Math.floor(Math.random()*255);
        imgData.data[i+2] = Math.floor(Math.random()*255);
    }
    return tempDat;
}

var averageFrametime = 0;
var updateStuffs = setInterval(function(){
    stats.innerHTML = `Checked:${testedRectangles} Placed:${placedRectangles} Frametime:${averageFrametime}, Checks per second:${cps}`;
    cps = 0;
}, 1000);
runStuff = function(){
    var newColor = getRandomColor();
    var newRect = getRandomRect(img_width, img_height);
    var data = getNextCtx(ctxIn, newRect, newColor);
    if(data){
        placedRectangles++;
        ctxIn.fillStyle = newColor;
        ctxIn.fillRect(newRect[0], newRect[1], newRect[2], newRect[3]);
    } else{
        testedRectangles++;
    }
}
var cps = 0;
var interval = setInterval(
    function(){
        startTime = performance.now();
        while(performance.now() - startTime < 16){
            runStuff();
            cps++;
        }
        averageFrametime = performance.now() - startTime;
}, 1);