"use strict";
//Simple sorts
const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort'));
selectionSortDiv.sortingAlgorithm = selectionSort;
const bubbleSortDiv = new SortingDiv(document.getElementById('bubble_sort'));
bubbleSortDiv.sortingAlgorithm = bubbleSort;
const insertionSortDiv = new SortingDiv(document.getElementById('insertion_sort'));
insertionSortDiv.sortingAlgorithm = insertionSort;
//Clever sorts 
const mergeSortDiv = new SortingDiv(document.getElementById('merge_sort'));
mergeSortDiv.sortingAlgorithm = mergeSort;
const naiveButton = document.createElement('input');
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('checked', 'true');
const quickSortDiv = new SortingDiv(document.getElementById('quick_sort'));
quickSortDiv.sortingAlgorithm = naiveQuickSort;
naiveButton.onchange = () => {
    if (naiveButton.checked)
        quickSortDiv.sortingAlgorithm = naiveQuickSort;
    else
        quickSortDiv.sortingAlgorithm = quickSort;
};
quickSortDiv.sortDiv.appendChild(naiveButton);
const heapSortDiv = new SortingDiv(document.getElementById('heap_sort'));
heapSortDiv.sortingAlgorithm = heapSort;
const introSortDiv = new SortingDiv(document.getElementById('intro_sort'));
introSortDiv.sortingAlgorithm = introSort;
//Silly sorts
const gnomeSortDiv = new SortingDiv(document.getElementById('gnome_sort'));
gnomeSortDiv.sortingAlgorithm = gnomeSort;
//Comparison:
const compareDiv = new CompareDiv(document.getElementById('compare_sort'));
