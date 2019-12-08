let canvas = document.getElementById('pplot-canvas');
canvas.width = 512;
canvas.height = 512;

let ctx = canvas.getContext('2d');
let image = ctx.createImageData(canvas.width, canvas.height);
let data = image.data;
let groundColor = [240, 240, 240];
let plantColor = [0, 220, 0];

let prepareData = function(cellsize){
    let pixelInd = 0; 
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let value = noise.simplex2(i / cellsize, j / cellsize);
            pixelInd = (i + j * canvas.width) * 4;
            data[pixelInd] = data[pixelInd + 1] = data[pixelInd + 2] = value;
            data[pixelInd + 3] = 255; 
        }
    }
}


let computeProp=function(value, proportion){
    let counter = 0;
    let pixelInd = 0;
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            pixelInd = (i + j * canvas.width) * 4;
                if (data[pixelInd] > value){
                    counter++;
            }
        }
    }
    return Math.abs(counter / (canvas.height * canvas.width) - proportion);
}



let plotData = function(proportion=0.3, cellsize=100){
    prepareData(cellsize);
    let pixelInd = 0;
    
    let value = -1.0;
    let curValue = computeProp(value, proportion);
    let cnt = 0;
  
    while ((Math.abs(curValue) > 0.05) && cnt < 200) {
        value+=0.01;
        curValue = computeProp(value, proportion);
        cnt+=1;
        console.log(value, curValue);
    }

    if (!(cnt < 20)) {
        console.log("Error occurred when trying to find optimal solution!");
    }

   optimal = curValue;

    //Traverse all data points and change color
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            pixelInd = (i + j * canvas.width) * 4;
                if (data[pixelInd] > optimal){
                    data[pixelInd] = plantColor[0];
                    data[pixelInd + 1] = plantColor[1];
                    data[pixelInd + 2] = plantColor[2];
                 }
                else{
                    data[pixelInd] = groundColor[0];
                    data[pixelInd + 1] = groundColor[1];
                    data[pixelInd + 2] = groundColor[2];
                }
        }
    }
    ctx.putImageData(image, 0, 0);
}


plotData(0.8);
