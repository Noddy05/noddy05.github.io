"use strict";
async function gnomeSort(sortingObj, skipAnimation) {
    const loopIndex = ++sortingObj.loopIndex;
    let pos = 1;
    while (pos < sortingObj.length()) {
        if (pos == 0 || sortingObj.read(pos) >= sortingObj.get(pos - 1)) {
            sortingObj.colors = new Map([[pos, 'blue']]);
            pos++;
        }
        else {
            swap(sortingObj, pos, pos - 1);
            sortingObj.colors = new Map([[pos, 'blue'], [pos - 1, 'red']]);
            pos--;
        }
        await sleep(sortingObj);
        if (!sortingObj.isRunning(loopIndex))
            return;
        await draw(sortingObj, true);
    }
    if (!skipAnimation && sortingObj.isRunning(loopIndex))
        finalizeArray(sortingObj);
}
const gnomeSortDiv = new SortingDiv(document.getElementById('gnome_sort'));
gnomeSortDiv.sortingAlgorithm = gnomeSort;
