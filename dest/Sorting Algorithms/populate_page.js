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
//Quick sort
const naiveButton = document.createElement('input');
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('id', 'use_naive_button');
naiveButton.setAttribute('checked', 'true');
const extraHeader = document.createElement('b');
extraHeader.innerText = 'Algorithm parameters';
const buttonLabel = document.createElement('label');
buttonLabel.innerText = 'Use Lomuto partitioning:';
const quickSortDiv = new SortingDiv(document.getElementById('quick_sort'));
quickSortDiv.sortingAlgorithm = displayQuickSort;
quickSortDiv.extraContainer.appendChild(extraHeader);
quickSortDiv.extraContainer.appendChild(buttonLabel);
quickSortDiv.extraContainer.appendChild(naiveButton);
const heapSortDiv = new SortingDiv(document.getElementById('heap_sort'));
heapSortDiv.sortingAlgorithm = heapSort;
const introSortDiv = new SortingDiv(document.getElementById('intro_sort'));
introSortDiv.sortingAlgorithm = introSort;
//Silly sorts
const gnomeSortDiv = new SortingDiv(document.getElementById('gnome_sort'));
gnomeSortDiv.sortingAlgorithm = gnomeSort;
//Comparison:
const compareDiv = new CompareDiv(document.getElementById('compare_sort'));
