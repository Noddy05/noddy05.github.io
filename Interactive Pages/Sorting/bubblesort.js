//This is the algorithm without sleeping and drawing:
function bubbleSort(sortingObject){
    for(let i = 0; i < sortingObject.entries; i++){
        for(let j = 0; j < sortingObject.entries - 1 - i; j++){
            if(sortingObject.array[j] > sortingObject.array[j + 1]){
                swap(sortingObject.array, j, j + 1);
            }
        }
    }
}

const bubbleSortObj = Object.create(sortingObject);
sortingObjects.set("bubbleSort", bubbleSortObj);
bubbleSortObj.ctx = document.getElementById("bubbleSort").getContext('2d');

bubbleSortObj.array = generateArray(bubbleSortObj.entries);
bubbleSortVisual(bubbleSortObj);
async function bubbleSortVisual(sortingObject){
    //For keeping track of which instance of this sorting algorithm is currently running.
    //To prevent multiple instances of sorting the same array at the same time.
    let loopIndex = ++sortingObject.loopIndex;

    for(let i = 0; i < sortingObject.entries; i++){
        for(let j = 0; j < sortingObject.entries - 1 - i; j++){
            if(sortingObject.array[j] > sortingObject.array[j + 1]){
                swap(sortingObject.array, j, j + 1);
            }

            //This will stop sorting the 'Sort' button has been pressed while running
            if(loopIndex != sortingObject.loopIndex)
                return;
            await drawThenSleep(sortingObject, [ j + 1 ], false);        
        }
            
        if(loopIndex != sortingObject.loopIndex)
            return;
        await drawThenSleep(sortingObject, [ 0 ], false);    
    }

    finalizeArray(sortingObject);
}
