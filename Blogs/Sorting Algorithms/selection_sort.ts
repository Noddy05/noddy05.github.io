//const selectionSortDiv = document.getElementById('selection_sort') as HTMLDivElement;

async function selectionSort(sortingObj: SortingObject){
    const loopIndex = ++sortingObj.loopIndex;

    for(let i = 0; i < sortingObj.length() - 1; i++){
        let minIndex = i;
        for(let j = i + 1; j < sortingObj.length(); j++){
            if(sortingObj.array[j] < sortingObj.array[minIndex])
                minIndex = j
        
            sortingObj.colors = new Map([ 
                [ i, 'green' ], 
                [ j, 'red' ], 
                [ minIndex, 'blue' ], 
            ]);
            await sleep(sortingObj.delay());
            await draw(sortingObj, true)
            if(!sortingObj.isRunning(loopIndex))
                return;
        }

        swap(sortingObj.array, i, minIndex);
        await sleep(sortingObj.delay());
        await draw(sortingObj, true);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    finalizeArray(sortingObj);
}

const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort') as HTMLDivElement);
selectionSortDiv.sortingAlgorithm = selectionSort;

//selectionSort(sortingObj);