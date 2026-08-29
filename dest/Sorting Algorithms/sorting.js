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
class SortingObject {
    constructor(canvas, delaySlider, scrambleSelect, sizeSlider) {
        this.canvas = canvas;
        this.delaySlider = delaySlider;
        this.scrambleSelect = scrambleSelect;
        this.sizeSlider = sizeSlider;
        this.loopIndex = 0;
        this.array = [];
        this.scramble();
        this.ctx = this.canvas.getContext('2d');
        this.colors = new Map();
    }
    isRunning(loopIndex) {
        return loopIndex == this.loopIndex;
    }
    delay() {
        return +delaySlider.value;
    }
    length() {
        return this.array.length;
    }
    min() {
        let min = this.array[0];
        for (let i = 1; i < this.length(); i++) {
            min = Math.min(this.array[i], min);
        }
        return min;
    }
    max() {
        let max = this.array[0];
        for (let i = 1; i < this.length(); i++) {
            max = Math.max(this.array[i], max);
        }
        return max;
    }
    scramble() {
        let length = +this.sizeSlider.value;
        for (let i = 0; i < scramblers.length; i++) {
            if (scramblers[i][0] == this.scrambleSelect.value) {
                this.array = scramblers[i][1](length);
                return;
            }
        }
    }
    resize() {
        let length = +this.sizeSlider.value;
        for (let i = 0; i < scramblers.length; i++) {
            if (scramblers[i][0] == this.scrambleSelect.value) {
                this.array = scramblers[i][2](this, length);
                return;
            }
        }
    }
}
function swap(A, i, j) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}
function sleep(time) {
    if (time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
function draw(sortingObj, drawUnlessDelayIsZero = false, ignoreColors = false) {
    if (drawUnlessDelayIsZero && sortingObj.delay() <= 0)
        return;
    const canvas = sortingObj.canvas;
    const ctx = sortingObj.ctx;
    const array = sortingObj.array;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var padding = 20;
    var w = canvas.width - 2 * padding, h = canvas.height - 2 * padding;
    var n = array.length;
    var barW = w / n;
    var spacing = 2;
    const size = sortingObj.max() - sortingObj.min() + 1;
    for (let i = 0; i < n; i++) {
        if (!ignoreColors && sortingObj.colors.has(i)) {
            ctx.fillStyle = sortingObj.colors.get(i);
        }
        else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(padding + barW * i + spacing, padding + h, barW - 2 * spacing, -h * (array[i] + 1 - sortingObj.min()) / size);
    }
}
// adding scrambled and then sorted elements behaves weird
// also for reverse sorted
const finalizeWaitTime = 20;
const finalizeResetTime = 1000;
const finalizeFlickerTime = 100;
function finalizeArray(sortingObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const loopIndex = sortingObj.loopIndex;
        sortingObj.colors = new Map([[0, 'green']]);
        yield draw(sortingObj, false);
        for (let i = 1; i < sortingObj.length(); i++) {
            if (sortingObj.array[i] >= sortingObj.array[i - 1]) {
                sortingObj.colors.set(i, 'green');
            }
            else {
                sortingObj.colors.set(i, 'red');
            }
            yield sleep(finalizeWaitTime);
            yield draw(sortingObj, false);
            if (!sortingObj.isRunning(loopIndex))
                return;
        }
        yield sleep(finalizeResetTime);
        yield draw(sortingObj, false, true);
        if (!sortingObj.isRunning(loopIndex))
            return;
        for (let i = 0; i < 3; i++) {
            yield sleep(finalizeFlickerTime);
            yield draw(sortingObj, false);
            if (!sortingObj.isRunning(loopIndex))
                return;
            yield sleep(finalizeFlickerTime);
            yield draw(sortingObj, false, true);
            if (!sortingObj.isRunning(loopIndex))
                return;
        }
        sortingObj.colors = new Map([]);
    });
}
function sorting() {
    console.log('can sort');
}
