
async function standardBubbleSort(array){
    const start = Date.now();
    await function() {
        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < array.length - 1 - i; j++){
                if(array[i] > array[i + 1]){
                    swap(array, i, i + 1);
                }
            }
        }
    }
    const end = Date.now();
    console.log(`Execution time for an array with ${array.length} entries took ${end - start}ms`)
}

const bubbleSort = async function bubbleSort(array, canvas, timeBetween){
    //To meassure the time it took to run (realtime):
    standardBubbleSort(array);

    await waitLoop(0, array.length, 5, async function(i) {
        await waitLoop(0, array.length - 1 - i, timeBetween, async function(j) {
            if(array[j] > array[j + 1]){
                swap(array, j, j + 1);
            }
            selectedPins[0] = j + 1;
            if(timeBetween > 0)
                drawArray(array, canvas);
        });
        if(timeBetween <= 0)
            drawArray(array, canvas);
    });
    selectedPins[0] = 0;
    drawArray(array, canvas);
    setTimeout(function() {
        finalizeArray(array, canvas, Math.max(timeBetween * 2, 5));
    }, Math.max(timeBetween * 2, 5));
}
bubbleSort(unsortedArray, unsortedCanvas, 10);