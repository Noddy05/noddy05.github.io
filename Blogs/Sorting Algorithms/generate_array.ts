const scramblers: [ string, (n: number) => number[], (sortingObj: SortingObject, n: number) => number[] ][] = [
    [ 'Scrambled', genScrambledArray, extendScrambledArray ],
    [ 'Sorted', genSortedArray, extendSortedArray ],
    [ 'Reverse Sorted', genReverseSortedArray, extendReverseSortedArray ],
    [ 'Random Values', genRandomArray, extendRandomArray ],
]


function genSortedArray(n: number){
    const array = [] as number[];
    for(let i = 0; i < n; i++){
        array[i] = i + 1;
    }
    return array;
}
function extendSortedArray(sortingObj: SortingObject, new_size: number){
    const array = [] as number[];
    const max = sortingObj.max;
    for(let i = 0; i < new_size; i++){
        if(i < sortingObj.length()){
            array[i] = sortingObj.array[i];
        }
        else {
            array[i] = max + 1 + i - sortingObj.length()
        }
    }
    return array;
}

function genReverseSortedArray(n: number){
    const array = [] as number[];
    for(let i = 0; i < n; i++){
        array[i] = n - i;
    }
    return array;
}
function extendReverseSortedArray(sortingObj: SortingObject, new_size: number){
    const array = [] as number[];
    const min = sortingObj.min;
    for(let i = 0; i < new_size; i++){
        if(i < sortingObj.length()){
            array[i] = sortingObj.array[i];
        }
        else {
            array[i] = min - 1 - (i - sortingObj.length())
        }
    }
    return array;
}
function genScrambledArray(n: number){
    const array = genSortedArray(n);
    for(let i = 0; i < n; i++){
        let j = Math.floor(Math.random() * n);
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
function extendScrambledArray(sortingObj: SortingObject, new_size: number){
    const originalSize = sortingObj.length();
    const array = extendSortedArray(sortingObj, new_size);

    if(originalSize >= new_size)
        return array;

    const firstIndex = Math.floor(originalSize * 0.75);
    for(let i = firstIndex; i < new_size; i++){
        let j = Math.floor(Math.random() * (new_size - firstIndex)) + firstIndex;
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
function genRandomArray(n: number){
    const array = [] as number[];
    for(let i = 0; i < n; i++){
        array[i] = Math.random() * (n - 1) + 1;
    }
    return array;
}
//to be modified to make it more satisfying:
function extendRandomArray(sortingObj: SortingObject, new_size: number){
    const originalSize = sortingObj.length();
    const array = extendSortedArray(sortingObj, new_size);

    for(let i = originalSize; i < new_size; i++){
        array[i] = Math.random() * (sortingObj.max - 1) + 1;
    }
    return array;
}