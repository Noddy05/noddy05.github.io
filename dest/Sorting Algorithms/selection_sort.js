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
const selectionSortDiv = document.getElementById('selection_sort');
var canvas = null;
var delaySlider = null;
var sortButton = null;
var scrambleButton = null;
var scrambleMethod = null;
var sizeSlider = null;
var sortingObj = null;
function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', '1600px');
    canvas.setAttribute('height', '1000px');
    delaySlider = document.createElement('input');
    delaySlider.setAttribute('type', 'range');
    delaySlider.setAttribute('min', '0');
    delaySlider.setAttribute('max', '200');
    delaySlider.setAttribute('value', '50');
    sortButton = document.createElement('button');
    sortButton.innerHTML = 'Sort';
    sortButton.onclick = function (e) {
        selectionSort(sortingObj);
    };
    scrambleButton = document.createElement('button');
    scrambleButton.innerHTML = 'Scramble';
    scrambleButton.onclick = function (e) {
        sortingObj.scramble();
        draw(sortingObj);
    };
    scrambleMethod = document.createElement('select');
    for (let i = 0; i < scramblers.length; i++) {
        let scrambleOption = document.createElement('option');
        scrambleOption.innerHTML = scramblers[i][0];
        scrambleOption.setAttribute('value', scramblers[i][0]);
        scrambleMethod.appendChild(scrambleOption);
    }
    sizeSlider = document.createElement('input');
    sizeSlider.setAttribute('type', 'range');
    sizeSlider.setAttribute('min', '2');
    sizeSlider.setAttribute('max', '200');
    sizeSlider.setAttribute('value', '30');
    sizeSlider.oninput = function (e) {
        sortingObj.resize();
        draw(sortingObj);
    };
    selectionSortDiv.appendChild(canvas);
    selectionSortDiv.appendChild(delaySlider);
    selectionSortDiv.appendChild(sortButton);
    selectionSortDiv.appendChild(scrambleButton);
    selectionSortDiv.appendChild(scrambleMethod);
    selectionSortDiv.appendChild(sizeSlider);
}
createCanvas();
sorting();
sortingObj = new SortingObject(canvas, delaySlider, scrambleMethod, sizeSlider);
draw(sortingObj);
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
//selectionSort(sortingObj);
