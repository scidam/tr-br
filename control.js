let canvasSize = 512;
let groundColor = [127, 127, 127];
let grassColor = [0, 200, 0];
let defaultProp = 0.3;
let defaultConn = 100;
let avgScore = 0;

let canvas = document.getElementById('pplot-canvas');
canvas.width = canvasSize;
canvas.height = canvasSize;
let ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.rect(0, 0, canvasSize, canvasSize);
ctx.stroke();

let randomChoice = function(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

let redrawPerlin = function(prop, agg){

    let seeds = [42, 13, 17, 29, 53];
    let perlinData;

    let i, cnt=0, probe=10, pos, minValue=1, optProbe, optValue, currentProp=0;
   
    perlinData = getPerlinData(canvas, agg, agg, randomChoice(seeds));
    
    while ((probe < 255) && (Math.abs(prop - currentProp) > 0.01)){   
        cnt = 0; 
        for (var y = 0; y < canvas.height; y ++) {
            for (var x = 0; x < canvas.width; x ++) {
                pos = (x + y * canvas.width) * 4;
                if (perlinData.data[pos] > probe) {cnt++;}
            }
        }

    currentProp = cnt / (canvas.width * canvas.height);
    if (Math.abs(prop - currentProp) < minValue){
        optProbe = probe;
        optValue = currentProp;
        minValue = Math.abs(prop - currentProp);
        }
    probe++;
    }

    for (var y = 0; y < canvas.height; y ++) {
        for (var x = 0; x < canvas.width; x ++) {
            pos = (x + y * canvas.width) * 4;
            if (perlinData.data[pos] > optProbe){
                perlinData.data[pos + 0] = grassColor[0];
                perlinData.data[pos + 1] = grassColor[1];
                perlinData.data[pos + 2] = grassColor[2];
                perlinData.data[pos + 3] = 255;
            }
            else {
                perlinData.data[pos + 0] = groundColor[0];
                perlinData.data[pos + 1] = groundColor[1];
                perlinData.data[pos + 2] = groundColor[2];
                perlinData.data[pos + 3] = 255;

            }
        }
    }
    ctx.putImageData(perlinData, 0, 0);
    return currentProp;
}


var exact = redrawPerlin(defaultProp, defaultConn);

const connElement = document.getElementById("connectedness");
const propElement = document.getElementById("proportion");
const answerElement = document.getElementById("answer");
const resultElement = document.getElementById("results");

let propValue=parseFloat(propElement.value), connValue=parseFloat(connElement.value);


let redrawScene = function(ev){
    propValue = parseFloat(propElement.value);
    connValue = parseFloat(connElement.value);

    if (isNaN(propValue)) {
        propElement.value = defaultProp;
        propValue = defaultProp;
    }
    
    if (isNaN(connValue)) {
        connElement.value = defaultConn;
        connValue = defaultConn;
    }
    exact = redrawPerlin(propValue, connValue);

    
}

let processAnswer = function(ev){
    let val = ev.target.value;
    const pElement = document.createElement("p");
    pElement.innerText = "Exact proportion is: " + Math.floor(exact * 1000) / 1000;
    resultElement.innerHTML = "";
    resultElement.appendChild(pElement);
}

connElement.addEventListener('change', redrawScene);
propElement.addEventListener('change', redrawScene);
answerElement.addEventListener('change', processAnswer);