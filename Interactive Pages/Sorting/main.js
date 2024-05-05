//First we need 
const unsortedCanvas = document.getElementById('unsorted-canvas');
unsortedCanvas.width = 1000;
unsortedCanvas.height = 1000;

var unsortedArray = [];
const swap = function swap(array, indexA, indexB){
    let temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
}

unsortedArray = generateArray(50);
function generateArray(size){
    let outputArray = [];
    for(let i = 0; i < size; i++){
        outputArray[i] = i + 1;
    }
    randomlyUnsortArray(outputArray, size);
    return outputArray;
}

function randomlyUnsortArray(array){
    for(let i = 0; i < array.length * 2; i++){
        swap(array, i % array.length, Math.floor(Math.random() * array.length));
    }
}

var selectedPins = [];
const drawEntry = function drawEntry(array, canvas, ctx, i, color){
    let margin = 10;
    let spaceBetweenBars = canvas.width / array.length / 10;
    
    //Always assume max(array) = array.length
    let unitHeight = 1 / array.length;
    let width = (canvas.width - 2 * margin) / array.length;
    let height = array[i] * unitHeight * (canvas.height - 2 * margin);
    ctx.fillStyle = color;
    ctx.fillRect(i * width + margin + spaceBetweenBars / 2, canvas.height - height - margin, width - spaceBetweenBars, height);
}
const drawArray = function drawArray(array, canvas){
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < array.length; i++){
        let isSelected = false;
        let color = "white";
        for(let j = 0; j < selectedPins.length; j++){
            if(selectedPins[j] == i){
                isSelected = true;
                break;
            }
        }
        if(isSelected){
            color = "green";
        } else {
            color = "white";
        }
        drawEntry(array, canvas, ctx, i, color);
    }
}
drawArray(unsortedArray, unsortedCanvas);


const waitLoop = async function waitLoop(index, endIndexNonInclusive, timeBetween, callback){
    if(timeBetween > 0){
        if(index < endIndexNonInclusive){
            //First we call the function and wait for it to complete:
            await callback(index);
            //Then we wait the specified 'timeBetween' before we resolve this promise
            await new Promise(resolve => setTimeout(resolve, timeBetween)); 
            //And finally, once the promise is resolved we can call the loop again (now with increased index):
            await waitLoop(index + 1, endIndexNonInclusive, timeBetween, callback);
        } 
    } else {
        //In case we have timeBetween of 0, we just want to call the callback function as fast as possible:
        while(index < endIndexNonInclusive){
            callback(index++);
        }
    }
}

const finalizeArray = function finalizeArray(array, canvas, timeBetween){
    const ctx = canvas.getContext('2d');
    waitLoop(0, array.length, timeBetween, function(i) {
        drawEntry(array, canvas, ctx, i, "#20C020");
    });
}