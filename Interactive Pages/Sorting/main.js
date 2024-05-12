

const unsortedCanvas = document.getElementById('unsorted-canvas');
unsortedCanvas.width = 1000;
unsortedCanvas.height = 1000;

//We define a variable called swap, so we can access this function in other scripts
const swap = function swap(array, indexA, indexB){
    let temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
}

var unsortedArray = [];
unsortedArray = generateArray(50);
function generateArray(size){
    //Firstly, generated a sorted array with the specified size:
    let outputArray = [];
    for(let i = 0; i < size; i++){
        outputArray[i] = i + 1;
    }

    //Now randomly unsort the array:
    randomlyUnsortArray(outputArray, size);
    return outputArray;
}

//This function randomly unsorts an array by swapping elements around
function randomlyUnsortArray(array){
    for(let i = 0; i < array.length * 2; i++){
        //Swap with a random element in the array:
        swap(array, i % array.length, Math.floor(Math.random() * array.length));
    }
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
        if(isSelected)
            color = "green";
        
        drawEntry(array, canvas, ctx, i, color, false);
    }
}
drawArray(unsortedArray, unsortedCanvas, []);

//Sleep simply waits the given duration (unless the duration is <= 0)
function sleep(duration){
    if(duration > 0)
        return new Promise(resolve => setTimeout(resolve, duration));
}
//Finalize array draws an animation to show we've sorted the array succesfully!
async function finalizeArray(sortingObject){
    //Make sure we check wether or not this animation should be playing right now:
    let loopIndex = ++sortingObject.loopIndex;

    for(let i = 0; i < sortingObject.entries; i++){
        //If the 'loopIndex' changed mid-animation we should cancel the animation. 
        //This would only happen if the array was unsorted while drawing this animation.
        if(loopIndex != sortingObject.loopIndex)
            return;

        drawEntry(sortingObject.array, sortingObject.ctx.canvas, sortingObject.ctx, i, "#20C020", true);
        
        //This simply waits a specified amount of time before moving on:
        await sleep(sortingObject.delay);
    }
}

function unsortArray(sortObject) {
    sortObject.loopIndex++;
    sortObject.selectedEntries = [];
    sortObject.array = generateArray(sortObject.entries);
    drawArray(sortObject.array, sortObject.ctx.canvas, []);
}

async function drawThenSleep(sortingObject, selected, drawAlways){
    if(drawAlways || sortingObject.delay > 0)
        drawArray(sortingObject.array, sortingObject.ctx.canvas, selected);
    await sleep(sortingObject.delay);
}