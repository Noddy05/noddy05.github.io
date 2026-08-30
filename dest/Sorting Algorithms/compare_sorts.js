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
const comparableAlgorithms = [
    ['Selection Sort', selectionSort,],
    ['Bubble Sort', bubbleSort,],
    ['Insertion Sort', insertionSort,],
    ['Merge Sort', mergeSort,],
    ['Quick Sort', quickSort,],
    ['Heap Sort', heapSort,],
    ['Intro Sort', introSort]
];
class CompareDiv {
    constructor(sortDiv) {
        this.canvasA = null;
        this.canvasB = null;
        //public sortingAlgorithmA : ((sortingObj: SortingObject, skipAnimation: boolean) => void) | null = null;
        //public sortingAlgorithmB : ((sortingObj: SortingObject, skipAnimation: boolean) => void) | null = null;
        this.sortingAlgorithmA = null;
        this.sortingAlgorithmB = null;
        this.delaySlider = null;
        this.sortButton = null;
        this.pauseButton = null;
        this.scrambleButton = null;
        this.scrambleMethod = null;
        this.sizeSlider = null;
        this.timeButton = null;
        this.accuracySlider = null;
        this.sortDiv = sortDiv;
        this.createCanvas();
        this.sortingObjA = new SortingObject(this.canvasA, this.delaySlider, this.scrambleMethod, this.sizeSlider);
        this.sortingObjB = new SortingObject(this.canvasB, this.delaySlider, this.scrambleMethod, this.sizeSlider);
        this.sortingObjB.array = [...this.sortingObjA.array];
        draw(this.sortingObjA);
        draw(this.sortingObjB);
    }
    algorithmA() {
        return comparableAlgorithms[+this.sortingAlgorithmA.value][1];
    }
    algorithmB() {
        return comparableAlgorithms[+this.sortingAlgorithmB.value][1];
    }
    createCanvas() {
        this.canvasA = document.createElement('canvas');
        this.canvasA.setAttribute('width', '1600px');
        this.canvasA.setAttribute('height', '1000px');
        this.canvasB = document.createElement('canvas');
        this.canvasB.setAttribute('width', '1600px');
        this.canvasB.setAttribute('height', '1000px');
        this.delaySlider = document.createElement('input');
        this.delaySlider.setAttribute('type', 'range');
        this.delaySlider.setAttribute('min', '0');
        this.delaySlider.setAttribute('max', '200');
        this.delaySlider.setAttribute('value', '50');
        this.sortButton = document.createElement('button');
        this.sortButton.innerHTML = 'Sort';
        this.sortButton.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
            if (this.sortingAlgorithmA != null) {
                this.sortingObjA.paused = false;
                this.algorithmA()(this.sortingObjA, false);
            }
            if (this.sortingAlgorithmB != null) {
                this.sortingObjB.paused = false;
                this.algorithmB()(this.sortingObjB, false);
            }
        });
        const ticks = [100, 500, 1500, 2500, 5000, 10000];
        this.accuracySlider = document.createElement('input');
        this.accuracySlider.setAttribute('type', 'range');
        this.accuracySlider.setAttribute('list', 'accuracy_ticks');
        this.accuracySlider.setAttribute('min', ticks[0].toString());
        this.accuracySlider.setAttribute('max', ticks[ticks.length - 1].toString());
        const accuracyTicks = document.createElement('datalist');
        this.accuracySlider.appendChild(accuracyTicks);
        accuracyTicks.id = 'accuracy_ticks';
        for (let i = 0; i < ticks.length; i++) {
            const option = document.createElement('option');
            option.setAttribute('value', ticks[i].toString());
            accuracyTicks.appendChild(option);
        }
        this.timeButton = document.createElement('button');
        this.timeButton.innerHTML = 'Meassure actual time';
        this.timeButton.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
            const newArray = this.sortingObjA.scrambleMethod()(+this.accuracySlider.value);
            const reuseArray = [...newArray];
            if (this.sortingAlgorithmA != null) {
                this.sortingObjA.paused = false;
                const sliderVal = this.delaySlider.value;
                const previousArray = this.sortingObjA.array;
                this.sortingObjA.array = newArray;
                this.delaySlider.value = '0';
                const start = Date.now();
                yield this.algorithmA()(this.sortingObjA, true);
                console.log(`Sorting A took: ${(Date.now() - start)}ms`);
                this.sortingObjA.array = previousArray;
                this.delaySlider.value = sliderVal;
            }
            if (this.sortingAlgorithmB != null) {
                this.sortingObjB.paused = false;
                const sliderVal = this.delaySlider.value;
                const previousArray = this.sortingObjB.array;
                this.sortingObjB.array = reuseArray;
                this.delaySlider.value = '0';
                const start = Date.now();
                yield this.algorithmB()(this.sortingObjB, true);
                console.log(`Sorting B took: ${(Date.now() - start)}ms`);
                this.sortingObjB.array = previousArray;
                this.delaySlider.value = sliderVal;
            }
        });
        this.pauseButton = document.createElement('button');
        this.pauseButton.innerHTML = 'Pause';
        this.pauseButton.onclick = (e) => {
            this.sortingObjA.paused = !this.sortingObjA.paused;
            this.sortingObjB.paused = !this.sortingObjB.paused;
        };
        this.scrambleButton = document.createElement('button');
        this.scrambleButton.innerHTML = 'Scramble';
        this.scrambleButton.onclick = (e) => {
            this.sortingObjA.scramble();
            this.sortingObjB.array = [...this.sortingObjA.array];
            draw(this.sortingObjA);
            draw(this.sortingObjB);
        };
        this.scrambleMethod = document.createElement('select');
        for (let i = 0; i < scramblers.length; i++) {
            let scrambleOption = document.createElement('option');
            scrambleOption.innerHTML = scramblers[i][0];
            scrambleOption.setAttribute('value', scramblers[i][0]);
            this.scrambleMethod.appendChild(scrambleOption);
        }
        this.sortingAlgorithmA = document.createElement('select');
        for (let i = 0; i < comparableAlgorithms.length; i++) {
            let scrambleOption = document.createElement('option');
            scrambleOption.innerHTML = comparableAlgorithms[i][0];
            scrambleOption.setAttribute('value', i.toString());
            this.sortingAlgorithmA.appendChild(scrambleOption);
        }
        this.sortingAlgorithmB = document.createElement('select');
        for (let i = 0; i < comparableAlgorithms.length; i++) {
            let scrambleOption = document.createElement('option');
            scrambleOption.innerHTML = comparableAlgorithms[i][0];
            scrambleOption.setAttribute('value', i.toString());
            this.sortingAlgorithmB.appendChild(scrambleOption);
        }
        this.sizeSlider = document.createElement('input');
        this.sizeSlider.setAttribute('type', 'range');
        this.sizeSlider.setAttribute('min', '2');
        this.sizeSlider.setAttribute('max', '200');
        this.sizeSlider.setAttribute('value', '30');
        this.sizeSlider.oninput = (e) => {
            this.sortingObjA.resize();
            draw(this.sortingObjA);
            this.sortingObjB.resize();
            draw(this.sortingObjB);
        };
        this.sortDiv.appendChild(this.canvasA);
        this.sortDiv.appendChild(this.canvasB);
        this.sortDiv.appendChild(this.delaySlider);
        this.sortDiv.appendChild(this.sortButton);
        this.sortDiv.appendChild(this.pauseButton);
        this.sortDiv.appendChild(this.scrambleButton);
        this.sortDiv.appendChild(this.scrambleMethod);
        this.sortDiv.appendChild(this.sizeSlider);
        this.sortDiv.appendChild(this.timeButton);
        this.sortDiv.appendChild(this.accuracySlider);
        this.sortDiv.appendChild(this.sortingAlgorithmA);
        this.sortDiv.appendChild(this.sortingAlgorithmB);
    }
}
const compareDiv = new CompareDiv(document.getElementById('compare_sort'));
