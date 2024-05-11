
const mergeSortObj = Object.create(sortingObject);
sortingObjects.set("mergeSort", mergeSortObj);
mergeSortObj.ctx = document.getElementById("mergeSort").getContext('2d');

mergeSortObj.array = generateArray(mergeSortObj.entries);
mergeSortVisual(mergeSortObj);

async function mergeSortVisual(sortingObject){
    let copiedArray = sortingObject.array.map((x) => x);
    let loopIndex = ++sortingObject.loopIndex;
    await divide(copiedArray, sortingObject, loopIndex, 0);

    if(loopIndex != sortingObject.loopIndex)
        return;
    
    finalizeArray(sortingObject);
}

async function divide(array, sortingObject, loopIndex, startIndex){
    if(loopIndex != sortingObject.loopIndex)
        return;

    if(array.length <= 1)
        return array;

    let median = Math.ceil(array.length / 2);
    let leftArray = [];
    let rightArray = [];
    for(let i = 0; i < median; i++){
        leftArray[i] = array[i];
    }
    leftArray = await divide(leftArray, sortingObject, loopIndex, startIndex);
    if(loopIndex != sortingObject.loopIndex)
        return;

    for(let i = median; i < array.length; i++){
        rightArray[i - median] = array[i];
    }
    rightArray = await divide(rightArray, sortingObject, loopIndex, startIndex + median);

    if(loopIndex != sortingObject.loopIndex)
        return;
    
    return await conquer(leftArray, rightArray, sortingObject, loopIndex, startIndex);
}

async function conquer(leftArray, rightArray, sortingObject, loopIndex, startIndex){
    let leftPointer = 0;
    let rightPointer = 0;
    let finalArray = [];
    while(leftPointer < leftArray.length && rightPointer < rightArray.length){
        if(leftArray[leftPointer] < rightArray[rightPointer]){
            finalArray[leftPointer + rightPointer] = leftArray[leftPointer];
            sortingObject.array[leftPointer + rightPointer + startIndex] = finalArray[leftPointer + rightPointer];
            
            if(loopIndex != sortingObject.loopIndex)
                return;

            await drawThenSleep(sortingObject, [startIndex + leftPointer, leftPointer + rightPointer + startIndex], false);
            leftPointer++;
        } else {
            finalArray[leftPointer + rightPointer] = rightArray[rightPointer];
            sortingObject.array[leftPointer + rightPointer + startIndex] = finalArray[leftPointer + rightPointer];
            
            if(loopIndex != sortingObject.loopIndex)
                return;

            await drawThenSleep(sortingObject, [startIndex + rightPointer + leftArray.length, leftPointer + rightPointer + startIndex], false);
            rightPointer++;
        }
    }
    while(leftPointer < leftArray.length){
        finalArray[leftPointer + rightPointer] = leftArray[leftPointer];
        sortingObject.array[leftPointer + rightPointer + startIndex] = finalArray[leftPointer + rightPointer];
        leftPointer++;
        
        if(loopIndex != sortingObject.loopIndex)
            return;

        await drawThenSleep(sortingObject, [startIndex + leftPointer, leftPointer + rightPointer + startIndex], false);
    }
    while(rightPointer < rightArray.length){
        finalArray[leftPointer + rightPointer] = rightArray[rightPointer];
        sortingObject.array[leftPointer + rightPointer + startIndex] = finalArray[leftPointer + rightPointer];
        rightPointer++;

            if(loopIndex != sortingObject.loopIndex)
                return;

        await drawThenSleep(sortingObject, [startIndex + rightPointer + leftArray.length, leftPointer + rightPointer + startIndex], false);
    }

    return finalArray;
}