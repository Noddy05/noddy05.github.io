
const mergeSortObj = Object.create(sortingObject);
sortingObjects.set("mergeSort", mergeSortObj);
mergeSortObj.ctx = document.getElementById("mergeSort").getContext('2d');

function mergeSort(sortingObject){
    sortingObject.array = divide(sortingObject.array);
}

function divide(array){
    //If there's only one element left, we are done:
    if(array.length <= 1)
        return array;

    //Find the middle index:
    let middle = Math.ceil(array.length / 2);
    let leftArray = [];
    let rightArray = [];
    //Add elements to left array:
    for(let i = 0; i < middle; i++){
        leftArray[i] = array[i];
    }
    //Now recursively divide left side into smaller arrays:
    leftArray = divide(leftArray);

    //Add elements to the right array:
    for(let i = middle; i < array.length; i++){
        rightArray[i - middle] = array[i];
    }
    //Now recursively divide right side into smaller arrays:
    rightArray = divide(rightArray);

    //Once the arrays have been divided, we're left with two sorted arrays, we now conquer these arrays:
    return conquer(leftArray, rightArray);
}

function conquer(leftArray, rightArray){
    let leftPointer = 0;
    let rightPointer = 0;
    let finalArray = [];
    //While left AND right array still has elements not in finalArray
    while(leftPointer < leftArray.length && rightPointer < rightArray.length){
        //Check which element is the smallest, either the next in the leftArray or the rightArray
        if(leftArray[leftPointer] < rightArray[rightPointer]){
            //The next element in the left array was smallest, so we add it:
            finalArray[leftPointer + rightPointer] = leftArray[leftPointer];
            leftPointer++;
        } else {
            //The next element in the right array was smallest, so we add it:
            finalArray[leftPointer + rightPointer] = rightArray[rightPointer];
            rightPointer++;
        }
    }
    //If only left array has elements left
    while(leftPointer < leftArray.length){
        //In this case we simply add the last elements to the finalArray
        //And since leftArray is already sorted we just add them like so:
        finalArray[leftPointer + rightPointer] = leftArray[leftPointer];
        leftPointer++;
    }
    //If only right array has elements left
    while(rightPointer < rightArray.length){
        //In this case we simply add the last elements to the finalArray
        //And since rightArray is already sorted we just add them like so:
        finalArray[leftPointer + rightPointer] = rightArray[rightPointer];
        rightPointer++;
    }

    return finalArray;
}


mergeSortObj.array = generateArray(mergeSortObj.entries);
mergeSortVisual(mergeSortObj);

async function mergeSortVisual(sortingObject){
    let copiedArray = sortingObject.array.map((x) => x);
    let loopIndex = ++sortingObject.loopIndex;
    await divideVisual(copiedArray, sortingObject, loopIndex, 0);

    if(loopIndex != sortingObject.loopIndex)
        return;
    
    finalizeArray(sortingObject);
}

async function divideVisual(array, sortingObject, loopIndex, startIndex){
    if(loopIndex != sortingObject.loopIndex)
        return;

    if(array.length <= 1)
        return array;

    let middle = Math.ceil(array.length / 2);
    let leftArray = [];
    let rightArray = [];
    for(let i = 0; i < middle; i++){
        leftArray[i] = array[i];
    }
    leftArray = await divideVisual(leftArray, sortingObject, loopIndex, startIndex);
    if(loopIndex != sortingObject.loopIndex)
        return;

    for(let i = middle; i < array.length; i++){
        rightArray[i - middle] = array[i];
    }
    rightArray = await divideVisual(rightArray, sortingObject, loopIndex, startIndex + middle);

    if(loopIndex != sortingObject.loopIndex)
        return;
    
    return await conquerVisual(leftArray, rightArray, sortingObject, loopIndex, startIndex);
}

async function conquerVisual(leftArray, rightArray, sortingObject, loopIndex, startIndex){
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