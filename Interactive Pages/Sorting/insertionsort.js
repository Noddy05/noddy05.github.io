//This is the algorithm without sleeping and drawing:
function insertionSort(sortingObject){
    for(let i = 0; i < sortingObject.entries - 1; i++){
        j = i;
        while(j >= 0 && sortingObject.array[j + 1] < sortingObject.array[j]){
            swap(sortingObject.array, j + 1, j);
            j--;   
        }  
    }
}

const insertionSortObj = Object.create(sortingObject);
sortingObjects.set("insertionSort", insertionSortObj);
insertionSortObj.ctx = document.getElementById("insertionSort").getContext('2d');

insertionSortObj.array = generateArray(insertionSortObj.entries);
insertionSortVisual(insertionSortObj);
async function insertionSortVisual(sortingObject){
    //For keeping track of which instance of this sorting algorithm is currently running.
    //To prevent multiple instances of sorting the same array at the same time.
    let loopIndex = ++sortingObject.loopIndex;

    for(let i = 0; i < sortingObject.entries - 1; i++){
        j = i;
        while(j >= 0 && sortingObject.array[j + 1] < sortingObject.array[j]){
            swap(sortingObject.array, j + 1, j);
            j--;

            //This will stop sorting the 'Sort' button has been pressed while running
            if(loopIndex != sortingObject.loopIndex)
                return;
            
            //This is only for visualization purposes
            //It simply draws to the canvas, and then waits before 
            //moving on to the next iteration of the sorting algorithm.
            await drawThenSleep(sortingObject, [j + 1, j, i], false);        
        }

        if(loopIndex != sortingObject.loopIndex)
            return;

        //Again, purely for visualization:
        await drawThenSleep(sortingObject, [ i + 1 ], false);        
    }

    finalizeArray(sortingObject);
}