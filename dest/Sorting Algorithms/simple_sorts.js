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
function selectionSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length() - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < sortingObj.length(); j++) {
                if (sortingObj.read(j) < sortingObj.get(minIndex))
                    minIndex = j;
                sortingObj.colors.set(minIndex, 'green');
                yield sleep(sortingObj);
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
            }
            swap(sortingObj, i, minIndex);
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (!sortingObj.isRunning(loopIndex))
                return;
        }
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            finalizeArray(sortingObj);
    });
}
const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort'));
selectionSortDiv.sortingAlgorithm = selectionSort;
function bubbleSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length() - 1; i++) {
            let swapped = false;
            for (let j = 0; j < sortingObj.length() - i - 1; j++) {
                if (sortingObj.read(j) > sortingObj.read(j + 1)) {
                    swap(sortingObj, j, j + 1);
                    swapped = true;
                }
                yield sleep(sortingObj);
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
            }
            if (!swapped)
                break;
        }
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            finalizeArray(sortingObj);
    });
}
const bubbleSortDiv = new SortingDiv(document.getElementById('bubble_sort'));
bubbleSortDiv.sortingAlgorithm = bubbleSort;
function insertionSort(sortingObj, skipAnimation) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length(); i++) {
            yield sleep(sortingObj);
            yield draw(sortingObj, true);
            if (!sortingObj.isRunning(loopIndex))
                return;
            let j = i - 1;
            while (j >= 0 && sortingObj.read(j) > sortingObj.read(j + 1)) {
                swap(sortingObj, j, j + 1);
                yield sleep(sortingObj);
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
                j--;
            }
        }
        if (!skipAnimation && sortingObj.isRunning(loopIndex))
            finalizeArray(sortingObj);
    });
}
const insertionSortDiv = new SortingDiv(document.getElementById('insertion_sort'));
insertionSortDiv.sortingAlgorithm = insertionSort;
