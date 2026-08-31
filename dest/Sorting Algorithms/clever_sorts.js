"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function mergeSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        yield merge_sort(sortingObj, 0, sortingObj.length(), loopIndex);
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            yield finalizeArray(sortingObj);
    });
}
function merge_sort(sortingObj, l, r, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (r - l <= 1)
            return;
        if (loopIndex != sortingObj.loopIndex)
            return;
        let mid = Math.floor((l + r) / 2);
        yield merge_sort(sortingObj, l, mid, loopIndex);
        yield merge_sort(sortingObj, mid, r, loopIndex);
        yield merge(sortingObj, l, mid, r, loopIndex);
        sortingObj.colors = new Map([]);
        yield sleep(sortingObj);
        yield draw(sortingObj, true);
    });
}
function merge(sortingObj, l, m, r, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield sleep(sortingObj);
            yield draw(sortingObj, true, false, false);
            if (loopIndex != sortingObj.loopIndex)
                return;
        }
        while (L < leftArray.length) {
            sortingObj.write(l + L + R, leftArray[L]);
            sortingObj.colors.set(l + L + R, "green");
            L++;
            yield sleep(sortingObj);
            yield draw(sortingObj, true, false, false);
            if (loopIndex != sortingObj.loopIndex)
                return;
        }
        while (R < rightArray.length) {
            sortingObj.write(l + L + R, rightArray[R]);
            sortingObj.colors.set(l + L + R, "green");
            R++;
            yield sleep(sortingObj);
            yield draw(sortingObj, true, false, false);
            if (loopIndex != sortingObj.loopIndex)
                return;
        }
        yield draw(sortingObj, true);
    });
}
const mergeSortDiv = new SortingDiv(document.getElementById('merge_sort'));
mergeSortDiv.sortingAlgorithm = mergeSort;
//Check to use the naive partitioning
const naiveButton = document.createElement('input');
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('checked', 'true');
function quickSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        yield quick_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            yield finalizeArray(sortingObj);
    });
}
function quick_sort(sortingObj, l, r, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (r <= l)
            return;
        if (loopIndex != sortingObj.loopIndex)
            return;
        let mid = yield partition(sortingObj, l, r, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield quick_sort(sortingObj, l, mid - 1, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield quick_sort(sortingObj, mid + 1, r, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield sleep(sortingObj);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield draw(sortingObj, true);
    });
}
function partition(sortingObj_1, l_1, r_1, loopIndex_1) {
    return __awaiter(this, arguments, void 0, function* (sortingObj, l, r, loopIndex, canBeNaive = true) {
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
            yield sleep(sortingObj);
            if (loopIndex != sortingObj.loopIndex)
                return 0;
            yield draw(sortingObj, true);
            r = Math.min(r, sortingObj.length());
        }
        sortingObj.write(r, sortingObj.read(i + 1));
        sortingObj.write(i + 1, x);
        return i + 1;
    });
}
const quickSortDiv = new SortingDiv(document.getElementById('quick_sort'));
quickSortDiv.sortingAlgorithm = quickSort;
quickSortDiv.sortDiv.appendChild(naiveButton);
function maxHeapify(sortingObj, length, i, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (loopIndex != sortingObj.loopIndex)
                return;
            //Now make sure we keep heap-shape in the subtree
            yield maxHeapify(sortingObj, length, largest, loopIndex);
        }
        else {
            sortingObj.colors.set(i, 'green');
            sortingObj.colors.set(l, 'blue');
            sortingObj.colors.set(r, 'blue');
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (loopIndex != sortingObj.loopIndex)
                return;
        }
    });
}
function buildHeap(sortingObj, length, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = length - 1; i >= 0; i--) {
            yield maxHeapify(sortingObj, length, i, loopIndex);
        }
    });
}
function heapSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        yield buildHeap(sortingObj, sortingObj.length(), loopIndex);
        for (let i = sortingObj.length() - 1; i > 0; i--) {
            swap(sortingObj, 0, i);
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (loopIndex != sortingObj.loopIndex)
                return;
            yield maxHeapify(sortingObj, i, 0, loopIndex);
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (loopIndex != sortingObj.loopIndex)
                return;
        }
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            yield finalizeArray(sortingObj);
    });
}
const heapSortDiv = new SortingDiv(document.getElementById('heap_sort'));
heapSortDiv.sortingAlgorithm = heapSort;
function introSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        yield intro_sort(sortingObj, 0, sortingObj.length() - 1, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield insertionSort(sortingObj, true);
        if (!skipAnimation && sortingObj.isRunning(loopIndex + 1))
            yield finalizeArray(sortingObj);
    });
}
function intro_sort(sortingObj, l, r, loopIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (r - l <= 8) {
            return;
        }
        if (loopIndex != sortingObj.loopIndex)
            return;
        let mid = yield partition(sortingObj, l, r, loopIndex, false);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield intro_sort(sortingObj, l, mid - 1, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield intro_sort(sortingObj, mid + 1, r, loopIndex);
        if (loopIndex != sortingObj.loopIndex)
            return;
        yield sleep(sortingObj);
        yield draw(sortingObj, true);
        if (loopIndex != sortingObj.loopIndex)
            return;
    });
}
const introSortDiv = new SortingDiv(document.getElementById('intro_sort'));
introSortDiv.sortingAlgorithm = introSort;
