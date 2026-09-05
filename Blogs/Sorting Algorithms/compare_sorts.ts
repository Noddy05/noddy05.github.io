const comparableAlgorithms: [ string, (sortingObj: SortingObject, skipAnimation: boolean) => void][] = [
    [ 'Selection Sort', selectionSort, ],
    [ 'Bubble Sort', bubbleSort, ],
    [ 'Insertion Sort', insertionSort, ],
    [ 'Merge Sort', mergeSort, ],
    [ 'Naive Quick Sort', naiveQuickSort, ],
    [ 'Quick Sort', quickSort, ],
    [ 'Heap Sort', heapSort, ],
    [ 'Intro Sort', introSort ],
    [ 'Gnome Sort', gnomeSort ],
]

class CompareDiv {
    public sortDiv : HTMLDivElement;

    public sortingObjA: SortingObject;
    public sortingObjB: SortingObject;
    public canvasA : HTMLCanvasElement | null = null;
    public canvasB : HTMLCanvasElement | null = null;
    //public sortingAlgorithmA : ((sortingObj: SortingObject, skipAnimation: boolean) => void) | null = null;
    //public sortingAlgorithmB : ((sortingObj: SortingObject, skipAnimation: boolean) => void) | null = null;

    public sortingAlgorithmA : HTMLSelectElement | null = null;
    public sortingAlgorithmB : HTMLSelectElement | null = null;

    public delaySlider : HTMLInputElement | null = null;
    public sortButton : HTMLButtonElement | null = null;
    public pauseButton : HTMLButtonElement | null = null;
    public scrambleButton : HTMLButtonElement | null = null;
    public scrambleMethod : HTMLSelectElement | null = null;
    public sizeSlider : HTMLInputElement | null = null;
    public timeButton : HTMLButtonElement | null = null;
    public accuracySlider : HTMLInputElement | null = null;

    public workerA : Worker = new Worker('../../dest/Sorting Algorithms/worker.js');
    public workerB : Worker = new Worker('../../dest/Sorting Algorithms/worker.js');
    public progressA : HTMLParagraphElement | null = null;
    public progressB : HTMLParagraphElement | null = null;
    public timerA: number = 0;
    public timerB: number = 0;
    public trackerIndex: number = 0;

    
    public constructor(sortDiv: HTMLDivElement){
        this.sortDiv = sortDiv;
        this.createCanvas();

        this.sortingObjA = new SortingObject(this.canvasA!, 
            this.delaySlider!, this.scrambleMethod!, this.sizeSlider!);

        this.sortingObjB = new SortingObject(this.canvasB!, 
            this.delaySlider!, this.scrambleMethod!, this.sizeSlider!);
        
        this.sortingObjB.setArray([...this.sortingObjA.getArray()]);

        this.workerA.onmessage = (event) => { this.timerA = event.data; console.log(event); }
        this.workerB.onmessage = (event) => { this.timerB = event.data; console.log(event); }
        
        draw(this.sortingObjA);
        draw(this.sortingObjB);
    }

    private algorithmA(): (sortingObj: SortingObject, skipAnimation: boolean) => void {
        return comparableAlgorithms[+this.sortingAlgorithmA!.value][1];
    }

    public algorithmANum(): number {
        return +this.sortingAlgorithmA!.value;
    }

    public algorithmBNum(): number {
        return +this.sortingAlgorithmB!.value;
    }

    private algorithmB(): (sortingObj: SortingObject, skipAnimation: boolean) => void {
        return comparableAlgorithms[+this.sortingAlgorithmB!.value][1];
    }

    private createCanvas(){
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

        this.progressA = document.createElement('p');
        this.progressA.innerHTML = 'Sorting (Selection Sort): 0ms';
        this.progressB = document.createElement('p');
        this.progressB.innerHTML = 'Sorting (Selection Sort): 0ms';

        this.sortButton = document.createElement('button');
        this.sortButton.innerHTML = 'Sort';
        this.sortButton.onclick = async (e) => {
            if(this.sortingAlgorithmA != null) { 
                this.sortingObjA!.paused = false;
                this.algorithmA()(this.sortingObjA!, false);
            }
            if(this.sortingAlgorithmB != null) { 
                this.sortingObjB!.paused = false;
                this.algorithmB()(this.sortingObjB!, false);
            }
        }


        const ticks = [ 100, 500, 1500, 2500, 5000, 10000 ]
        this.accuracySlider = document.createElement('input');
        this.accuracySlider.setAttribute('type', 'range');
        this.accuracySlider.setAttribute('list', 'accuracy_ticks');
        this.accuracySlider.setAttribute('min', ticks[0].toString());
        this.accuracySlider.setAttribute('max', ticks[ticks.length - 1].toString());

        const accuracyTicks = document.createElement('datalist');
        this.accuracySlider.appendChild(accuracyTicks);
        accuracyTicks.id = 'accuracy_ticks';
        for(let i = 0; i < ticks.length; i++){
            const option = document.createElement('option');
            option.setAttribute('value', ticks[i].toString());
            accuracyTicks.appendChild(option);
        }


        this.timeButton = document.createElement('button');
        this.timeButton.innerHTML = 'Meassure actual time';
        this.timeButton.onclick = (e) => {
            const size = +this.accuracySlider!.value;
            const scramble = +this.sortingObjA.scramblerNum()!;

            this.workerA.terminate();
            this.workerB.terminate();
            this.workerA = new Worker('../../dest/Sorting Algorithms/worker.js');
            this.workerB = new Worker('../../dest/Sorting Algorithms/worker.js');

            this.timerA = 0;
            this.timerB = 0;
            
            this.workerA.postMessage({ scrambler: scramble, size: size, algorithm: compareDiv.algorithmANum() });
            this.workerB.postMessage({ scrambler: scramble, size: size, algorithm: compareDiv.algorithmBNum() });

            trackProgress(++this.trackerIndex);

            this.workerA.onmessage = (event) => { 
                this.timerA = event.data; 
            }
            this.workerB.onmessage = (event) => { 
                this.timerB = event.data; 
            }

            /*
            this.workerA.onmessage = function(event) {
                const timeToExecute = event.data;
                subTimerA = timeToExecute;
                console.log(`Sorting A took: ${timeToExecute}ms`);
            }
            this.workerB.onmessage = function(event) {
                const timeToExecute = event.data;
                console.log(`Sorting B took: ${timeToExecute}ms`);
            }*/
        }

        this.pauseButton = document.createElement('button');
        this.pauseButton.innerHTML = 'Pause';
        this.pauseButton.onclick = (e) => {
            this.sortingObjA!.paused = !this.sortingObjA!.paused;
            this.sortingObjB!.paused = !this.sortingObjB!.paused;
        }

        this.scrambleButton = document.createElement('button');
        this.scrambleButton.innerHTML = 'Scramble';
        this.scrambleButton.onclick = (e) => {
            this.sortingObjA!.scramble();
            this.sortingObjB!.setArray([...this.sortingObjA!.getArray()]);

            draw(this.sortingObjA!);
            draw(this.sortingObjB!);
        }

        this.scrambleMethod = document.createElement('select');
        for(let i = 0; i < scramblers.length; i++){
            let scrambleOption = document.createElement('option') as HTMLOptionElement;
            scrambleOption.innerHTML = scramblers[i][0];
            scrambleOption.setAttribute('value', scramblers[i][0]);
            this.scrambleMethod.appendChild(scrambleOption);
        }

        this.sortingAlgorithmA = document.createElement('select');
        for(let i = 0; i < comparableAlgorithms.length; i++){
            let scrambleOption = document.createElement('option') as HTMLOptionElement;
            scrambleOption.innerHTML = comparableAlgorithms[i][0];
            scrambleOption.setAttribute('value', i.toString());
            this.sortingAlgorithmA.appendChild(scrambleOption);
        }

        this.sortingAlgorithmB = document.createElement('select');
        for(let i = 0; i < comparableAlgorithms.length; i++){
            let scrambleOption = document.createElement('option') as HTMLOptionElement;
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
            this.sortingObjA!.resize();
            draw(this.sortingObjA!);
            this.sortingObjB!.resize();
            draw(this.sortingObjB!);
        }

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
        this.sortDiv.appendChild(this.progressA);
        this.sortDiv.appendChild(this.progressB);
    }
}

async function trackProgress(trackerIndex: number){
    const start = Date.now();

    const sortAName = comparableAlgorithms[compareDiv.algorithmANum()][0];
    const sortBName = comparableAlgorithms[compareDiv.algorithmBNum()][0];
    while(trackerIndex == compareDiv.trackerIndex){
        await sleepFor(100);
        if(compareDiv.timerA == 0)
            compareDiv.progressA!.innerHTML = `Sorting (${sortAName}): ${Date.now() - start}ms`;
        else
            compareDiv.progressA!.innerHTML = `Sorting (${sortAName}): ${compareDiv.timerA}ms`;

        if(compareDiv.timerB == 0)
            compareDiv.progressB!.innerHTML = `Sorting (${sortBName}): ${Date.now() - start}ms`;
        else
            compareDiv.progressB!.innerHTML = `Sorting (${sortBName}): ${compareDiv.timerB}ms`;

        if(compareDiv.timerA != 0 && compareDiv.timerB != 0)
            return;
    }
}