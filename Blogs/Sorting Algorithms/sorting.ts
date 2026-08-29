class SortingObject {
    public canvas: HTMLCanvasElement;
    public array: number[];
    public colors: Map<number, string>;
    public delaySlider: HTMLInputElement;
    public scrambleSelect: HTMLSelectElement;
    public sizeSlider: HTMLInputElement;

    
    //calculated on init:
    public loopIndex: number;
    public ctx: CanvasRenderingContext2D;

    public constructor(canvas: HTMLCanvasElement, delaySlider: HTMLInputElement, 
        scrambleSelect: HTMLSelectElement, sizeSlider: HTMLInputElement){
        this.canvas = canvas;
        this.delaySlider = delaySlider;
        this.scrambleSelect = scrambleSelect;
        this.sizeSlider = sizeSlider;

        this.loopIndex = 0;

        this.array = [];
        this.scramble();
        
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.colors = new Map();
    }

    public isRunning(loopIndex: number): boolean {
        return loopIndex == this.loopIndex;
    }

    public delay(): number {
        return +this.delaySlider!.value;
    }

    public length(): number {
        return this.array.length;
    }

    public min(): number {
        let min = this.array[0];
        for(let i = 1; i < this.length(); i++){
            min = Math.min(this.array[i], min)
        }
        return min;
    }

    public max(): number {
        let max = this.array[0];
        for(let i = 1; i < this.length(); i++){
            max = Math.max(this.array[i], max)
        }
        return max;
    }

    public scramble(): void {
        let length = +this.sizeSlider.value;
        
        for(let i = 0; i < scramblers.length; i++){
            if(scramblers[i][0] == this.scrambleSelect.value){
                this.array = scramblers[i][1](length);
                return;
            }
        }
    }

    public resize(): void {
        let length = +this.sizeSlider.value;
        
        for(let i = 0; i < scramblers.length; i++){
            if(scramblers[i][0] == this.scrambleSelect.value){
                this.array = scramblers[i][2](this, length);
                return;
            }
        }
    }
}

class SortingDiv {
    public sortDiv : HTMLDivElement;
    public sortingObj: SortingObject;

    public canvas : HTMLCanvasElement | null = null;
    public delaySlider : HTMLInputElement | null = null;
    public sortButton : HTMLButtonElement | null = null;
    public scrambleButton : HTMLButtonElement | null = null;
    public scrambleMethod : HTMLSelectElement | null = null;
    public sizeSlider : HTMLInputElement | null = null;

    public sortingAlgorithm : ((sortingObj: SortingObject) => void) | null = null;
    
    public constructor(sortDiv: HTMLDivElement){
        this.sortDiv = sortDiv;
        this.sortingObj = new SortingObject(this.canvas!, 
            this.delaySlider!, this.scrambleMethod!, this.sizeSlider!);

        this.createCanvas();
    }

    private createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', '1600px');
        this.canvas.setAttribute('height', '1000px');

        this.delaySlider = document.createElement('input');
        this.delaySlider.setAttribute('type', 'range');
        this.delaySlider.setAttribute('min', '0');
        this.delaySlider.setAttribute('max', '200');
        this.delaySlider.setAttribute('value', '50');

        this.sortButton = document.createElement('button');
        this.sortButton.innerHTML = 'Sort';
        this.sortButton.onclick = (e) => {
            if(this.sortingAlgorithm == null)
                return;
            
            this.sortingAlgorithm(this.sortingObj!);
        }

        this.scrambleButton = document.createElement('button');
        this.scrambleButton.innerHTML = 'Scramble';
        this.scrambleButton.onclick = (e) => {
            this.sortingObj!.scramble();
            draw(this.sortingObj!);
        }

        this.scrambleMethod = document.createElement('select');
        for(let i = 0; i < scramblers.length; i++){
            let scrambleOption = document.createElement('option') as HTMLOptionElement;
            scrambleOption.innerHTML = scramblers[i][0];
            scrambleOption.setAttribute('value', scramblers[i][0]);
            this.scrambleMethod.appendChild(scrambleOption);
        }

        this.sizeSlider = document.createElement('input');
        this.sizeSlider.setAttribute('type', 'range');
        this.sizeSlider.setAttribute('min', '2');
        this.sizeSlider.setAttribute('max', '200');
        this.sizeSlider.setAttribute('value', '30');
        this.sizeSlider.oninput = (e) => {
            this.sortingObj!.resize();
            draw(this.sortingObj!);
        }

        this.sortDiv.appendChild(this.canvas);
        this.sortDiv.appendChild(this.delaySlider);
        this.sortDiv.appendChild(this.sortButton);
        this.sortDiv.appendChild(this.scrambleButton);
        this.sortDiv.appendChild(this.scrambleMethod);
        this.sortDiv.appendChild(this.sizeSlider);
    }
}

function swap(A: number[], i: number, j: number){
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function sleep(time: number){
    if(time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
function draw(sortingObj: SortingObject, drawUnlessDelayIsZero: boolean = false, ignoreColors: boolean = false){
    if(drawUnlessDelayIsZero && sortingObj.delay() <= 0)
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
    for(let i = 0; i < n; i++){
        if(!ignoreColors && sortingObj.colors.has(i)){
            ctx.fillStyle = sortingObj.colors.get(i) as string;
        } 
        else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(padding + barW * i + spacing,      padding + h, 
            barW - 2 * spacing,         - h * (array[i] + 1 - sortingObj.min()) / size);
    }
}
// adding scrambled and then sorted elements behaves weird
// also for reverse sorted

const finalizeWaitTime = 20;
const finalizeResetTime = 1000;
const finalizeFlickerTime = 100;
async function finalizeArray(sortingObj: SortingObject){
    const loopIndex = sortingObj.loopIndex;

    sortingObj.colors = new Map([ [ 0, 'green' ] ]);
    await draw(sortingObj, false)

    for(let i = 1; i < sortingObj.length(); i++){
        if(sortingObj.array[i] >= sortingObj.array[i - 1]){
            sortingObj.colors.set(i, 'green')
        } else {
            sortingObj.colors.set(i, 'red')
        }
        await sleep(finalizeWaitTime);
        await draw(sortingObj, false);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    await sleep(finalizeResetTime);
    await draw(sortingObj, false, true);
    if(!sortingObj.isRunning(loopIndex))
        return;

    for(let i = 0; i < 3; i++){
        await sleep(finalizeFlickerTime);
        await draw(sortingObj, false);
        if(!sortingObj.isRunning(loopIndex))
            return;

        await sleep(finalizeFlickerTime);
        await draw(sortingObj, false, true);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    sortingObj.colors = new Map([ ]);
}