
//This is the algorithm without sleeping and drawing:
function stalinSort(sortingObject){
    let newArray = [];

    for(let i = 1; i < sortingObject.entries; i++){
        //Only add to the new array if its sorted:
        if(sortingObject.array[i] >= newArray[newArray.length - 1]){
            newArray.append(sortingObject.array[i]);
        }
    }

    sortingObject.array = newArray;
}

const stalinSortObj = Object.create(sortingObject);
sortingObjects.set("stalinSort", stalinSortObj);
stalinSortObj.ctx = document.getElementById("stalinSort").getContext('2d');

stalinSortObj.array = generateArray(stalinSortObj.entries);
stalinSortVisual(stalinSortObj);

async function stalinSortVisual(sortingObject){
    let loopIndex = ++sortingObject.loopIndex;

    let maxFound = sortingObject.array[0];
    await drawThenSleep(sortingObject, [0], false);

    for(let i = 1; i < sortingObject.array.length; i++){
        if(sortingObject.array[i] >= maxFound){
            maxFound = sortingObject.array[i];
        } else {
            sortingObject.array[i] = 0;
        }

        if(loopIndex != sortingObject.loopIndex)
            return;

        await drawThenSleep(sortingObject, [i], false);
    }

    if(loopIndex != sortingObject.loopIndex)
        return;
    
    finalizeArray(sortingObject);
}