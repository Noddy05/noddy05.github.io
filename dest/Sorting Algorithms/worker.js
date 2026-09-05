"use strict";
importScripts('generate_array.js');
importScripts('sorting.js');
importScripts('simple_sorts.js');
importScripts('clever_sorts.js');
importScripts('silly_sorts.js');
importScripts('compare_sorts.js');
importScripts('../core.js');
onmessage = async function (event) {
    const sortingObj = new SortingObject(null, null, null, null);
    const data = event.data;
    const generatedArray = scramblers[data.scrambler][1](data.size);
    sortingObj.setArray(generatedArray);
    const start = Date.now();
    await comparableAlgorithms[data.algorithm][1](sortingObj, true);
    postMessage(Date.now() - start);
};
