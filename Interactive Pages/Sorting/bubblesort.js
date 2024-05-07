
//This is the Bubble Sort Algorithm implemented in JS:
function standardBubbleSort(array){
    //We set up the two loops:
    for(let i = 0; i < array.length; i++){
        //Since we know that after i iterations, the last i elements will
        //sorted we can stop checking after j >= array.length - 1 - i.
        for(let j = 0; j < array.length - 1 - i; j++){
            //We compare to see if the two entries are locally sorted
            if(array[i] > array[i + 1]){
                //If not, we swap:
                swap(array, i, i + 1);
            }
        }
    }
}

//Find the canvas:
const bubbleSortCanvas = document.getElementById('bubblesort');
bubbleSortCanvas.width = 1000;
bubbleSortCanvas.height = 1000;
var bubbleSortEntries = 10;
var bubbleSortArray = [];
var bubbleSortLoop = { running: true};

//This is for the visualization part:
const bubbleSort = async function bubbleSort(array, canvas, timeBetween){
    //To meassure the time it took to run (realtime):
    //We use this to compare how long it took to sort the array:
    const start = Date.now();
    let copiedArray = array.map((x) => x);
    await standardBubbleSort(copiedArray);

    if(timeBetween == 0){
        drawArray(copiedArray, canvas, [0]);
        setTimeout(function() {
            finalizeArray(copiedArray, canvas, 5);
        }, 5);
        return;
    }

    //The difference between end and start is the time it took to run the sorting algorithm.
    const end = Date.now();
    console.log(`Execution time for an array with ${array.length} entries took ${end - start}ms`)
    
    bubbleSortLoop.running = true;
    var selectedEntries = [];
    //Now we draw it using the waitLoop (Defined in main.js)
    //waitLoop works like a for loop, but it waits between each iteration.
    await waitLoop(0, array.length, 5, async function(i) {
        await waitLoop(0, array.length - 1 - i, timeBetween, async function(j) {
            if(array[j] > array[j + 1]){
                swap(array, j, j + 1);
            }
            selectedEntries[0] = j + 1;
            if(timeBetween > 0){
                drawArray(array, canvas, selectedEntries);
            } else {
                bubbleSortLoop.running = false;
            }
        }, bubbleSortLoop.running);
        if(timeBetween <= 0){
            drawArray(array, canvas, selectedEntries);
            bubbleSortLoop.running = false;
        }
    }, bubbleSortLoop.running);

    //Stop if loop was stopped during sorting:
    if(!bubbleSortLoop.running)
        return;

    drawArray(array, canvas, [0]);
    setTimeout(function() {
        finalizeArray(array, canvas, Math.max(timeBetween * 2, 5));
    }, Math.max(timeBetween * 2, 5));
}
bubbleSortArray = unsortArray(bubbleSortEntries, bubbleSortCanvas, bubbleSortLoop);