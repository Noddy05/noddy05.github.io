"use strict";
async function mergeSort(sortingObj, skipAnimation) {
    const loopIndex = ++sortingObj.loopIndex;
    await merge_sort(sortingObj, 0, sortingObj.length(), loopIndex);
    if (!skipAnimation && sortingObj.isRunning(loopIndex))
        await finalizeArray(sortingObj);
}
async function merge_sort(sortingObj, l, r, loopIndex) {
    if (r - l <= 1)
        return;
    if (loopIndex != sortingObj.loopIndex)
        return;
    let mid = Math.floor((l + r) / 2);
    await merge_sort(sortingObj, l, mid, loopIndex);
    await merge_sort(sortingObj, mid, r, loopIndex);
    await merge(sortingObj, l, mid, r, loopIndex);
    sortingObj.colors = new Map([]);
    await sleep(sortingObj);
    await draw(sortingObj, true);
}
async function merge(sortingObj, l, m, r, loopIndex) {
    let leftArray = [];
    sortingObj.colors = new Map([]);
    for (let i = l; i < r; i++) {
        sortingObj.colors.set(i, "red");
    }
    for (let i = l; i < m; i++) {
        leftArray.push(sortingObj.read(i));
    }
    let rightArray = [];
    for (let i = m; i < r; i++) {
        rightArray.push(sortingObj.read(i));
    }
    let L = 0;
    let R = 0;
    while (L < leftArray.length && R < rightArray.length) {
        if (leftArray[L] < rightArray[R]) {
            sortingObj.write(l + L + R, leftArray[L]);
            sortingObj.colors.set(l + L + R, "green");
            L++;
        }
        else {
            sortingObj.write(l + L + R, rightArray[R]);
            sortingObj.colors.set(l + L + R, "green");
            R++;
        }
        await sleep(sortingObj);
        await draw(sortingObj, true, false, false);
        if (loopIndex != sortingObj.loopIndex)
            return;
    }
    while (L < leftArray.length) {
        sortingObj.write(l + L + R, leftArray[L]);
        sortingObj.colors.set(l + L + R, "green");
        L++;
        await sleep(sortingObj);
        await draw(sortingObj, true, false, false);
        if (loopIndex != sortingObj.loopIndex)
            return;
    }
    while (R < rightArray.length) {
        sortingObj.write(l + L + R, rightArray[R]);
        sortingObj.colors.set(l + L + R, "green");
        R++;
        await sleep(sortingObj);
        await draw(sortingObj, true, false, false);
        if (loopIndex != sortingObj.loopIndex)
            return;
    }
    await draw(sortingObj, true);
}
const mergeSortDiv = new SortingDiv(document.getElementById('merge_sort'));
mergeSortDiv.sortingAlgorithm = mergeSort;
//Check to use the naive partitioning
const naiveButton = document.createElement('input');
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('checked', 'true');
async function quickSort(sortingObj, skipAnimation) {
    const loopIndex = ++sortingObj.loopIndex;
    await quick_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
    if (!skipAnimation && sortingObj.isRunning(loopIndex))
        await finalizeArray(sortingObj);
}
async function quick_sort(sortingObj, l, r, loopIndex) {
    if (r <= l)
        return;
    if (loopIndex != sortingObj.loopIndex)
        return;
    let mid = await partition(sortingObj, l, r, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await quick_sort(sortingObj, l, mid - 1, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await quick_sort(sortingObj, mid + 1, r, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await sleep(sortingObj);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await draw(sortingObj, true);
}
async function partition(sortingObj, l, r, loopIndex, canBeNaive = true) {
    if (loopIndex != sortingObj.loopIndex)
        return 0;
    const pivotIndex = Math.floor((l + r) / 2);
    if (!naiveButton.checked || !canBeNaive) {
        swap(sortingObj, pivotIndex, r);
    }
    let x = sortingObj.read(r);
    let i = l - 1;
    for (let j = l; j < r; j++) {
        if (sortingObj.read(j) <= x) {
            i++;
            swap(sortingObj, i, j);
        }
        sortingObj.colors.set(r, 'blue');
        sortingObj.colors.set(i, 'green');
        await sleep(sortingObj);
        if (loopIndex != sortingObj.loopIndex)
            return 0;
        await draw(sortingObj, true);
        r = Math.min(r, sortingObj.length());
    }
    sortingObj.write(r, sortingObj.read(i + 1));
    sortingObj.write(i + 1, x);
    return i + 1;
}
const quickSortDiv = new SortingDiv(document.getElementById('quick_sort'));
quickSortDiv.sortingAlgorithm = quickSort;
quickSortDiv.sortDiv.appendChild(naiveButton);
async function maxHeapify(sortingObj, length, i, loopIndex) {
    let largest = i;
    let l = 2 * i + 1;
    let r = l + 1;
    if (l >= length)
        return;
    if (l < length && sortingObj.read(l) > sortingObj.read(largest))
        largest = l;
    if (r < length && sortingObj.read(r) > sortingObj.read(largest))
        largest = r;
    if (largest != i) {
        swap(sortingObj, largest, i);
        sortingObj.colors.set(i, 'green');
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if (loopIndex != sortingObj.loopIndex)
            return;
        //Now make sure we keep heap-shape in the subtree
        await maxHeapify(sortingObj, length, largest, loopIndex);
    }
    else {
        sortingObj.colors.set(i, 'green');
        sortingObj.colors.set(l, 'blue');
        sortingObj.colors.set(r, 'blue');
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if (loopIndex != sortingObj.loopIndex)
            return;
    }
}
async function buildHeap(sortingObj, length, loopIndex) {
    for (let i = length - 1; i >= 0; i--) {
        await maxHeapify(sortingObj, length, i, loopIndex);
    }
}
async function heapSort(sortingObj, skipAnimation) {
    const loopIndex = ++sortingObj.loopIndex;
    await buildHeap(sortingObj, sortingObj.length(), loopIndex);
    for (let i = sortingObj.length() - 1; i > 0; i--) {
        swap(sortingObj, 0, i);
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if (loopIndex != sortingObj.loopIndex)
            return;
        await maxHeapify(sortingObj, i, 0, loopIndex);
        await sleep(sortingObj);
        await draw(sortingObj, true);
        if (loopIndex != sortingObj.loopIndex)
            return;
    }
    if (!skipAnimation && sortingObj.isRunning(loopIndex))
        await finalizeArray(sortingObj);
}
const heapSortDiv = new SortingDiv(document.getElementById('heap_sort'));
heapSortDiv.sortingAlgorithm = heapSort;
async function introSort(sortingObj, skipAnimation) {
    const loopIndex = ++sortingObj.loopIndex;
    await intro_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await insertionSort(sortingObj, true);
    if (!skipAnimation && sortingObj.isRunning(loopIndex + 1))
        await finalizeArray(sortingObj);
}
async function intro_sort(sortingObj, l, r, loopIndex) {
    if (r - l <= 8) {
        return;
    }
    if (loopIndex != sortingObj.loopIndex)
        return;
    let mid = await partition(sortingObj, l, r, loopIndex, false);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await intro_sort(sortingObj, l, mid - 1, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await intro_sort(sortingObj, mid + 1, r, loopIndex);
    if (loopIndex != sortingObj.loopIndex)
        return;
    await sleep(sortingObj);
    await draw(sortingObj, true);
    if (loopIndex != sortingObj.loopIndex)
        return;
}
const introSortDiv = new SortingDiv(document.getElementById('intro_sort'));
introSortDiv.sortingAlgorithm = introSort;
