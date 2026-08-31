async function selectionSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;

    for(let i = 0; i < sortingObj.length() - 1; i++){
        let minIndex = i;
        for(let j = i + 1; j < sortingObj.length(); j++){
            if(sortingObj.read(j) < sortingObj.get(minIndex))
                minIndex = j
        
            sortingObj.colors.set(minIndex, 'green');
            await sleep(sortingObj);
            await draw(sortingObj, true)
            if(!sortingObj.isRunning(loopIndex))
                return;
        }

        swap(sortingObj, i, minIndex);
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    if(!skipAnimation && sortingObj.isRunning(loopIndex))
        finalizeArray(sortingObj);
}

const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort') as HTMLDivElement);
selectionSortDiv.sortingAlgorithm = selectionSort;



async function bubbleSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;

    for(let i = 0; i < sortingObj.length() - 1; i++){
        let swapped = false;

        for(let j = 0; j < sortingObj.length() - i - 1; j++){
            if(sortingObj.read(j) > sortingObj.read(j + 1)){
                swap(sortingObj, j, j + 1);
                swapped = true;
            } 

            await sleep(sortingObj);
            await draw(sortingObj, true);
            if(!sortingObj.isRunning(loopIndex))
                return;
        }

        if(!swapped)
            break;
    }

    if(!skipAnimation && sortingObj.isRunning(loopIndex))
        finalizeArray(sortingObj);
}

const bubbleSortDiv = new SortingDiv(document.getElementById('bubble_sort') as HTMLDivElement);
bubbleSortDiv.sortingAlgorithm = bubbleSort;

async function insertionSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;

    for(let i = 0; i < sortingObj.length(); i++){
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(!sortingObj.isRunning(loopIndex))
            return;

        let j = i - 1;
        while(j >= 0 && sortingObj.read(j) > sortingObj.read(j + 1)){
            swap(sortingObj, j, j + 1);
            await sleep(sortingObj);
            await draw(sortingObj, true);
            if(!sortingObj.isRunning(loopIndex))
                return;
            j--;
        }
    }

    if(!skipAnimation && sortingObj.isRunning(loopIndex))
        finalizeArray(sortingObj);
}

const insertionSortDiv = new SortingDiv(document.getElementById('insertion_sort') as HTMLDivElement);
insertionSortDiv.sortingAlgorithm = insertionSort;