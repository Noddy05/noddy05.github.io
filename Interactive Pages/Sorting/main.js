

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

const sortingObjects = new Map();
const sortingObject = {
    //For drawing:
    delay: 150,
    ctx: null,
    loopIndex: 0,
    //Array generation:
    entries: 50,
    array: [],
}

function drawEntry(array, canvas, ctx, i, color, drawBackground){
    let margin = 10;
    let spaceBetweenBars = canvas.width / array.length / 10;
    
    //Always assume max(array) = array.length
    let unitHeight = 1 / array.length;
    let width = (canvas.width - 2 * margin) / array.length;
    let height = array[i] * unitHeight * (canvas.height - 2 * margin);

    ctx.fillStyle = "#000000";
    if(drawBackground)
        ctx.fillRect(i * width + margin - 1, 0, width + 2, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(i * width + margin + spaceBetweenBars / 2, canvas.height - height - margin, width - spaceBetweenBars, height);
}
function drawArray(array, canvas, selectedEntries){
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < array.length; i++){
        let isSelected = false;
        let color = "white";
        for(let j = 0; j < selectedEntries.length; j++){
            if(selectedEntries[j] == i){
                isSelected = true;
                break;
            }
        }
        if(isSelected){
            color = "green";
        } else {
            color = "white";
        }
        drawEntry(array, canvas, ctx, i, color, false);
    }
}
drawArray(unsortedArray, unsortedCanvas, []);

async function finalizeArray(sortingObject){
    for(let i = 0; i < sortingObject.entries; i++){
        drawEntry(sortingObject.array, sortingObject.ctx.canvas, sortingObject.ctx, i, "#20C020", true);
        await sleep(sortingObject.delay);
    }
}

function unsortArray(sortObject) {
    sortObject.loopIndex++;
    sortObject.selectedEntries = [];
    sortObject.array = generateArray(sortObject.entries);
    drawArray(sortObject.array, sortObject.ctx.canvas, []);
}

function sleep(duration){
    if(duration > 0)
        return new Promise(resolve => setTimeout(resolve, duration));
}
async function drawThenSleep(sortingObject, selected, drawAlways){
    if(drawAlways || sortingObject.delay > 0)
        drawArray(sortingObject.array, sortingObject.ctx.canvas, selected);
    await sleep(sortingObject.delay);
}

//Generate figures
const figures = document.getElementsByClassName('display');
for(let i = 0; i < figures.length; i++){
    let sortingAlgorithm = figures[i].classList[1];
    figures[i].innerHTML= `
        <canvas id="${sortingAlgorithm}" class="display-sort" width="300" height="300"></canvas>
        <br>
        <button onclick="${sortingAlgorithm}Visual(${sortingAlgorithm}Obj);">Sort Array</button>
        <button onclick="unsortArray(${sortingAlgorithm}Obj);">Unsort Array</button>
        <br>

        <div>
            <span>Entries: </span>
            <span id="${sortingAlgorithm}-entries-display"></span>
        </div>
        <input id="${sortingAlgorithm}-entries" type="range" min="1" max="100" value="20">
        <br>
        
        <div>
            <span>Time between iterations: </span>
            <span id="${sortingAlgorithm}-delay-display"></span>
        </div>
        <input id="${sortingAlgorithm}-delay" type="range" min="0" max="1000" value="150">`;
    const delaySlider = document.getElementById(`${sortingAlgorithm}-delay`);
    const delayDisplay = document.getElementById(`${sortingAlgorithm}-delay-display`);
    const entriesSlider = document.getElementById(`${sortingAlgorithm}-entries`);
    const entriesDisplay = document.getElementById(`${sortingAlgorithm}-entries-display`);
    
    delayDisplay.innerHTML = delaySlider.value + "ms";
    sortingObject.delay = delaySlider.value;
    delaySlider.addEventListener('input', function() { 
        sortingObjects.get(sortingAlgorithm).delay = delaySlider.value;
        delayDisplay.innerHTML = delaySlider.value + "ms";
    });
    entriesDisplay.innerHTML = entriesSlider.value;
    sortingObject.entries = entriesSlider.value;
    entriesSlider.addEventListener('input', function() { 
        const sortingObject = sortingObjects.get(sortingAlgorithm);
        sortingObject.entries = entriesSlider.value;
        unsortArray(sortingObject);
        entriesDisplay.innerHTML = sortingObject.entries;
    });
}