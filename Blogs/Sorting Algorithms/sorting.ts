class SortingObject {
    public canvas: HTMLCanvasElement;
    private array: number[];
    public colors: Map<number, string>;
    public delaySlider: HTMLInputElement;
    public scrambleSelect: HTMLSelectElement;
    public sizeSlider: HTMLInputElement;
    public paused: boolean;
    public isFinishing: boolean;
    public numWrites: number;
    public numReads: number;

    public max: number = 1;
    public min: number = 0;
    
    //calculated on init:
    public loopIndex: number;
    public ctx: CanvasRenderingContext2D;

    public constructor(canvas: HTMLCanvasElement, delaySlider: HTMLInputElement, 
        scrambleSelect: HTMLSelectElement, sizeSlider: HTMLInputElement){
        this.canvas = canvas;
        this.delaySlider = delaySlider;
        this.scrambleSelect = scrambleSelect;
        this.sizeSlider = sizeSlider;
        this.paused = false;
        this.isFinishing = false;
        this.numWrites = 0;
        this.numReads = 0;

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

    //Get and set modifies the array without making noises
    public get(index: number): number {
        this.numReads++;
        return this.array[index];
    }
    public set(index: number, value: number): void {
        this.numWrites++;
        this.array[index] = value;
    }

    //Read and write are used for the animations
    public read(index: number): number {
        const val = this.get(index);
        if(this.delay() > 0 || this.isFinishing){
            //Play sound
            this.playSound(val);

            if(this.delay() > 0){
                this.colors.set(index, 'red');
            }
        }
        return val;
    }
    public write(index: number, value: number): void {
        if(this.delay() > 0 || this.isFinishing){
            //Play sound
            this.playSound(value);

            if(this.delay() > 0){
                this.colors.set(index, 'red');
            }
        }
        this.set(index, value);
    }

    public playSound(value: number){
        let volumeMult = 1;
        if(!this.isFinishing)
            volumeMult = Math.max(0.2, Math.min(1, Math.log(1 + this.delay() / 100)));
        
        sound(((value - this.min) / (this.max - this.min) + this.min) * 1100 + 132, volumeMult);
    }

    public calculateBounds(): void {
        this.min = Infinity;
        this.max = -Infinity;

        for(let i = 0; i < this.length(); i++){
            this.min = Math.min(this.array[i], this.min);
            this.max = Math.max(this.array[i], this.max);
        }
    }

    public scrambleMethod() : ((n: number) => number[]) {
        for(let i = 0; i < scramblers.length; i++){
            if(scramblers[i][0] == this.scrambleSelect.value){
                return scramblers[i][1];
            }
        }

        return (n) => [];
    }

    public scramble(): void {
        let length = +this.sizeSlider.value;
        this.array = this.scrambleMethod()(length);
        this.calculateBounds();
    }

    public resize(): void {
        let length = +this.sizeSlider.value;
        
        for(let i = 0; i < scramblers.length; i++){
            if(scramblers[i][0] == this.scrambleSelect.value){
                this.array = scramblers[i][2](this, length);
            }
        }

        this.calculateBounds();
    }
}

class SortingDiv {
    public sortDiv : HTMLDivElement;
    public sortingObj: SortingObject;

    public canvas : HTMLCanvasElement | null = null;
    public delaySlider : HTMLInputElement | null = null;
    public sortButton : HTMLButtonElement | null = null;
    public pauseButton : HTMLButtonElement | null = null;
    public scrambleButton : HTMLButtonElement | null = null;
    public scrambleMethod : HTMLSelectElement | null = null;
    public sizeSlider : HTMLInputElement | null = null;

    public sortingAlgorithm : ((sortingObj: SortingObject, skipAnimation: boolean) => void) | null = null;
    
    public constructor(sortDiv: HTMLDivElement){
        this.sortDiv = sortDiv;
        this.createCanvas();

        this.sortingObj = new SortingObject(this.canvas!, 
            this.delaySlider!, this.scrambleMethod!, this.sizeSlider!);
        draw(this.sortingObj);
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

            this.sortingObj!.numWrites = 0;
            this.sortingObj!.numReads = 0;
            this.sortingObj!.paused = false;
            this.sortingObj!.isFinishing = false;
            this.sortingAlgorithm(this.sortingObj!, false);
        }

        this.pauseButton = document.createElement('button');
        this.pauseButton.innerHTML = 'Pause';
        this.pauseButton.onclick = (e) => {
            this.sortingObj!.paused = !this.sortingObj!.paused;
        }

        this.scrambleButton = document.createElement('button');
        this.scrambleButton.innerHTML = 'Scramble';
        this.scrambleButton.onclick = (e) => {
            this.sortingObj!.scramble();
            draw(this.sortingObj!, false, false, false);
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
            draw(this.sortingObj!, false, false, false);
        }

        this.sortDiv.appendChild(this.canvas);
        this.sortDiv.appendChild(this.delaySlider);
        this.sortDiv.appendChild(this.sortButton);
        this.sortDiv.appendChild(this.pauseButton);
        this.sortDiv.appendChild(this.scrambleButton);
        this.sortDiv.appendChild(this.scrambleMethod);
        this.sortDiv.appendChild(this.sizeSlider);
    }
}

function swap(A: SortingObject, i: number, j: number){
    const tmp = A.read(i);
    A.write(i, A.read(j));
    A.write(j, tmp);
}
function swapArray(A: number[], i: number, j: number){
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

async function sleepFor(time: number){
    if(time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
async function sleep(sortingObj: SortingObject){
    const loopIndex = sortingObj.loopIndex;
    while(sortingObj.paused){
        await sleepFor(1);
        if(loopIndex != sortingObj.loopIndex)
            return;
    }

    if(sortingObj.delay() > 0)
        return new Promise(resolve => setTimeout(resolve, sortingObj.delay()));
}
function draw(sortingObj: SortingObject, drawUnlessDelayIsZero: boolean = false, 
    ignoreColors: boolean = false, resetColors: boolean = true){
    if(drawUnlessDelayIsZero && sortingObj.delay() <= 0)
        return;

    const canvas = sortingObj.canvas;
    const ctx = sortingObj.ctx;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var padding = 20;
    var w = canvas.width - 2 * padding, h = canvas.height - 2 * padding;
    var n = sortingObj.length();
    var barW = w / n;
    var spacing = 2;

    const size = sortingObj.max - sortingObj.min + 1;
    for(let i = 0; i < n; i++){
        if(!ignoreColors && sortingObj.colors.has(i)){
            ctx.fillStyle = sortingObj.colors.get(i) as string;
        } 
        else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(padding + barW * i + spacing,      padding + h, 
            barW - 2 * spacing,         - h * (sortingObj.get(i) + 1 - sortingObj.min) / size);
    }

    if(resetColors)
        sortingObj.colors = new Map([]);
}
// adding scrambled and then sorted elements behaves weird
// also for reverse sorted

const finalizeCheckTime = 1000;
const finalizeResetTime = 1000;
const finalizeFlickerTime = 100;
async function finalizeArray(sortingObj: SortingObject){
    sortingObj.isFinishing = true;
    const loopIndex = sortingObj.loopIndex;

    sortingObj.colors = new Map([ [ 0, 'green' ] ]);
    await draw(sortingObj, false, false, false);

    for(let i = 1; i < sortingObj.length(); i++){
        if(sortingObj.get(i) >= sortingObj.get(i - 1)){
            sortingObj.playSound(sortingObj.get(i));
            sortingObj.playSound(sortingObj.get(i - 1));
            
            sortingObj.colors.set(i, 'green');
        } else {
            sortingObj.colors.set(i, 'red');
        }
        await sleepFor(finalizeCheckTime / sortingObj.length());
        await draw(sortingObj, false, false, false);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    await sleepFor(finalizeResetTime);
    await draw(sortingObj, false, true, false);
    if(!sortingObj.isRunning(loopIndex))
        return;

    for(let i = 0; i < 3; i++){
        await sleepFor(finalizeFlickerTime);
        await draw(sortingObj, false, false, false);
        sound(1200 - (i % 2) * 400);

        if(!sortingObj.isRunning(loopIndex))
            return;

        await sleepFor(finalizeFlickerTime);
        await draw(sortingObj, false, true, false);
        if(!sortingObj.isRunning(loopIndex))
            return;
    }

    sortingObj.colors = new Map([]);
    sortingObj.isFinishing = false;
}