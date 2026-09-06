

//Simple sorts
const selectionSortDiv = new SortingDiv(document.getElementById('selection_sort') as HTMLDivElement);
selectionSortDiv.sortingAlgorithm = selectionSort;

const bubbleSortDiv = new SortingDiv(document.getElementById('bubble_sort') as HTMLDivElement);
bubbleSortDiv.sortingAlgorithm = bubbleSort;

const insertionSortDiv = new SortingDiv(document.getElementById('insertion_sort') as HTMLDivElement);
insertionSortDiv.sortingAlgorithm = insertionSort;

//Clever sorts 
const mergeSortDiv = new SortingDiv(document.getElementById('merge_sort') as HTMLDivElement);
mergeSortDiv.sortingAlgorithm = mergeSort;

const naiveButton = document.createElement('input') as HTMLInputElement;
naiveButton.setAttribute('type', 'checkbox');
naiveButton.setAttribute('checked', 'true');
const quickSortDiv = new SortingDiv(document.getElementById('quick_sort') as HTMLDivElement);
quickSortDiv.sortingAlgorithm = naiveQuickSort;
naiveButton.onchange = () => {
    if(naiveButton.checked)
        quickSortDiv.sortingAlgorithm = naiveQuickSort;
    else
        quickSortDiv.sortingAlgorithm = quickSort
}
quickSortDiv.sortDiv.appendChild(naiveButton);

const heapSortDiv = new SortingDiv(document.getElementById('heap_sort') as HTMLDivElement);
heapSortDiv.sortingAlgorithm = heapSort;

const introSortDiv = new SortingDiv(document.getElementById('intro_sort') as HTMLDivElement);
introSortDiv.sortingAlgorithm = introSort;

//Silly sorts
const gnomeSortDiv = new SortingDiv(document.getElementById('gnome_sort') as HTMLDivElement);
gnomeSortDiv.sortingAlgorithm = gnomeSort;


//Comparison:
const compareDiv = new CompareDiv(document.getElementById('compare_sort') as HTMLDivElement);
