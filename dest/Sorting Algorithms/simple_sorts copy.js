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
function selectionSort(sortingObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length() - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < sortingObj.length(); j++) {
                if (sortingObj.array[j] < sortingObj.array[minIndex])
                    minIndex = j;
                sortingObj.colors = new Map([
                    [i, 'green'],
                    [j, 'red'],
                    [minIndex, 'blue'],
                ]);
                yield sleep(sortingObj.delay());
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
            }
            swap(sortingObj.array, i, minIndex);
            yield sleep(sortingObj.delay());
            yield draw(sortingObj, true);
            if (!sortingObj.isRunning(loopIndex))
                return;
        }
        finalizeArray(sortingObj);
    });
}
const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort'));
selectionSortDiv.sortingAlgorithm = selectionSort;
function bubbleSort(sortingObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length() - 1; i++) {
            let swapped = false;
            for (let j = 0; j < sortingObj.length() - i - 1; j++) {
                if (sortingObj.array[j] > sortingObj.array[j + 1]) {
                    swap(sortingObj.array, j, j + 1);
                    swapped = true;
                }
                sortingObj.colors = new Map([
                    [j, 'red'],
                    [j + 1, 'red'],
                ]);
                yield sleep(sortingObj.delay());
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
            }
            if (!swapped)
                break;
        }
        finalizeArray(sortingObj);
    });
}
const bubbleSortDiv = new SortingDiv(document.getElementById('bubble_sort'));
bubbleSortDiv.sortingAlgorithm = bubbleSort;
function insertionSort(sortingObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = ++sortingObj.loopIndex;
        for (let i = 0; i < sortingObj.length(); i++) {
            sortingObj.colors = new Map([
                [i, 'green'],
            ]);
            yield sleep(sortingObj.delay());
            yield draw(sortingObj, true);
            if (!sortingObj.isRunning(loopIndex))
                return;
            let j = i - 1;
            while (j >= 0 && sortingObj.array[j] > sortingObj.array[j + 1]) {
                sortingObj.colors = new Map([
                    [j, 'red'],
                    [j + 1, 'red'],
                    [i, 'green'],
                ]);
                swap(sortingObj.array, j, j + 1);
                yield sleep(sortingObj.delay());
                yield draw(sortingObj, true);
                if (!sortingObj.isRunning(loopIndex))
                    return;
                j--;
            }
        }
        finalizeArray(sortingObj);
    });
}
const insertionSortDiv = new SortingDiv(document.getElementById('insertion_sort'));
insertionSortDiv.sortingAlgorithm = insertionSort;
