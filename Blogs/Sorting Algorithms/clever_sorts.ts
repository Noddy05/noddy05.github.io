async function mergeSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;
    await merge_sort(sortingObj, 0, sortingObj.length(), loopIndex);

    if(!skipAnimation)
        await finalizeArray(sortingObj);
}
async function merge_sort(sortingObj: SortingObject, l: number, r: number, loopIndex: number){
    if(r - l <= 1)
        return;

    if(loopIndex != sortingObj.loopIndex)
        return;

    let mid = Math.floor((l + r) / 2);
    
    await merge_sort(sortingObj, l, mid, loopIndex);
    await merge_sort(sortingObj, mid, r, loopIndex);
    await merge(sortingObj, l, mid, r, loopIndex);

    sortingObj.colors = new Map([ ]);
    await sleep(sortingObj);
    await draw(sortingObj, true)
}
async function merge(sortingObj: SortingObject, l: number, m: number, r: number, loopIndex: number){
    let leftArray = [];
    
    sortingObj.colors = new Map([ ]);
    for(let i = l; i < r; i++){
        sortingObj.colors.set(i, "red");
    }

    for(let i = l; i < m; i++){
        leftArray.push(sortingObj.read(i));
    }
    let rightArray = [];
    for(let i = m; i < r; i++){
        rightArray.push(sortingObj.read(i));
    }
    
    let L = 0;
    let R = 0;
    while(L < leftArray.length && R < rightArray.length){
        if(leftArray[L] < rightArray[R]){
            sortingObj.write(l + L + R, leftArray[L]);
            sortingObj.colors.set(l + L + R, "green");
            L++;
        } else {
            sortingObj.write(l + L + R, rightArray[R]);
            sortingObj.colors.set(l + L + R, "green");
            R++;
        }
            
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;
    }
    while(L < leftArray.length){
        sortingObj.write(l + L + R, leftArray[L]);
        sortingObj.colors.set(l + L + R, "green");
        L++;
        
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;
    }
    while(R < rightArray.length){
        sortingObj.write(l + L + R, rightArray[R]);
        sortingObj.colors.set(l + L + R, "green");
        R++;
            
        await sleep(sortingObj);
        await draw(sortingObj, true)
        if(loopIndex != sortingObj.loopIndex)
            return;
    }

    await draw(sortingObj, true)
}

const mergeSortDiv = new SortingDiv(document.getElementById('merge_sort') as HTMLDivElement);
mergeSortDiv.sortingAlgorithm = mergeSort;


//Check to use the naive partitioning
const naiveButton = document.createElement('input') as HTMLInputElement;
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('checked', 'true');

async function quickSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;
    await quick_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
    
    if(!skipAnimation)
        await finalizeArray(sortingObj);
}
async function quick_sort(sortingObj: SortingObject, 
    l: number, r: number, loopIndex: number){
    if(r <= l)
        return;

    if(loopIndex != sortingObj.loopIndex)
        return;

    let mid = await partition(sortingObj, l, r, loopIndex) as number;
    if(loopIndex != sortingObj.loopIndex)
        return;

    await quick_sort(sortingObj, l, mid - 1, loopIndex);
    if(loopIndex != sortingObj.loopIndex)
        return;

    await quick_sort(sortingObj, mid + 1, r, loopIndex);
    if(loopIndex != sortingObj.loopIndex)
        return;

    sortingObj.colors = new Map([ ]);
    await sleep(sortingObj);
    await draw(sortingObj, true);
    if(loopIndex != sortingObj.loopIndex)
        return;
}

async function partition(sortingObj: SortingObject, l: number, 
    r: number, loopIndex: number, canBeNaive: boolean = true){

    if(loopIndex != sortingObj.loopIndex)
        return 0;

    const pivotIndex = Math.floor((l + r) / 2);
    if(!naiveButton.checked || !canBeNaive){
        swap(sortingObj, pivotIndex, r);
    }

    let x = sortingObj.read(r);
    let i = l - 1;
    for(let j = l; j < r; j++){
        if(sortingObj.read(j) <= x){
            i++;
            swap(sortingObj, i, j);
        }
        
        sortingObj.colors = new Map([ 
            [ r, 'red' ], 
            [ i, 'blue' ], 
            [ j, 'green' ], 
        ]);

        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return i + 1;

        r = Math.min(r, sortingObj.length());
    }
    
    sortingObj.write(r, sortingObj.read(i + 1));
    sortingObj.write(i + 1, x);

    return i + 1;
}

const quickSortDiv = new SortingDiv(document.getElementById('quick_sort') as HTMLDivElement);
quickSortDiv.sortingAlgorithm = quickSort;
quickSortDiv.sortDiv.appendChild(naiveButton);

async function maxHeapify(sortingObj: SortingObject, length: number, i: number, loopIndex: number){
    let largest = i;

    let l = 2 * i + 1;
    let r = l + 1;

    if(l < length && sortingObj.read(l) > sortingObj.read(largest))
        largest = l;

    if(r < length && sortingObj.read(r) > sortingObj.read(largest))
        largest = r;

    if(largest != i){
        swap(sortingObj, largest, i);

        sortingObj.colors = new Map([ [ i, 'red'], [ l, 'blue' ], [ r, 'blue' ], [ largest, 'green' ] ]);

        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;

        //Now make sure we keep heap-shape in the subtree
        await maxHeapify(sortingObj, length, largest, loopIndex);
    } else {
        sortingObj.colors = new Map([ [ i, 'red' ] ]);
        if(l < length)
            sortingObj.colors.set(l, 'blue');
        if(r < length)
            sortingObj.colors.set(r, 'blue');

        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;
    }
}

async function buildHeap(sortingObj: SortingObject, length: number, loopIndex: number){
    for(let i = length - 1; i >= 0; i--){
        await maxHeapify(sortingObj, length, i, loopIndex);
    }
}

async function heapSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;
    await buildHeap(sortingObj, sortingObj.length(), loopIndex);

    for(let i = sortingObj.length() - 1; i > 0; i--){
        swap(sortingObj, 0, i);
        sortingObj.colors = new Map([ [ i, 'red' ], [ 0, 'red' ] ]);
        
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;


        await maxHeapify(sortingObj, i, 0, loopIndex);

        await sleep(sortingObj);
        await draw(sortingObj, true);
        if(loopIndex != sortingObj.loopIndex)
            return;
    }

    if(!skipAnimation)
    await finalizeArray(sortingObj);
}

const heapSortDiv = new SortingDiv(document.getElementById('heap_sort') as HTMLDivElement);
heapSortDiv.sortingAlgorithm = heapSort;


async function introSort(sortingObj: SortingObject, skipAnimation: boolean){
    const loopIndex = ++sortingObj.loopIndex;
    await intro_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
    if(loopIndex != sortingObj.loopIndex)
        return;
    await insertionSort(sortingObj, true);

    if(!skipAnimation)
        await finalizeArray(sortingObj);
}

async function intro_sort(sortingObj: SortingObject, l: number, r: number, loopIndex: number){
    if(r - l <= 8){
        return;
    }

    if(loopIndex != sortingObj.loopIndex)
        return;

    let mid = await partition(sortingObj, l, r, loopIndex, false) as number;
    if(loopIndex != sortingObj.loopIndex)
        return;

    await intro_sort(sortingObj, l, mid - 1, loopIndex);
    if(loopIndex != sortingObj.loopIndex)
        return;

    await intro_sort(sortingObj, mid + 1, r, loopIndex);
    if(loopIndex != sortingObj.loopIndex)
        return;

    sortingObj.colors = new Map([ ]);
    await sleep(sortingObj);
    await draw(sortingObj, true);
    if(loopIndex != sortingObj.loopIndex)
        return;
}

const introSortDiv = new SortingDiv(document.getElementById('intro_sort') as HTMLDivElement);
introSortDiv.sortingAlgorithm = introSort;