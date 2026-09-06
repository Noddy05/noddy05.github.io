class SortingObject {
    public canvas: HTMLCanvasElement | null;
    private array: number[];
    public colors: Map<number, string>;
    public delaySlider: HTMLInputElement | null;
    public scrambleSelect: HTMLSelectElement | null;
    public sizeSlider: HTMLInputElement | null;
    public paused: boolean;
    public isFinishing: boolean;
    public numWrites: number;
    public numReads: number;

    public max: number = 1;
    public min: number = 0;
    
    //calculated on init:
    public loopIndex: number;
    public ctx: CanvasRenderingContext2D | null;

    public constructor(canvas: HTMLCanvasElement | null, delaySlider: HTMLInputElement | null, 
        scrambleSelect: HTMLSelectElement | null, sizeSlider: HTMLInputElement | null){
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
        if(this.sizeSlider != null && this.scrambleSelect != null)
            this.scramble();
        
        this.colors = new Map();
        
        if(this.canvas != null)
            this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        else
            this.ctx = null;
    }

    public isRunning(loopIndex: number): boolean {
        return loopIndex == this.loopIndex;
    }

    public delay(): number {
        if(this.delaySlider == null)
            return 0;

        return +this.delaySlider.value;
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

    public getArray() {
        return this.array;
    }

    public setArray(array: number[]) {
        this.array = array;
    }

    public playSound(value: number){
        let volumeMult = 1;
        if(!this.isFinishing)
            volumeMult = Math.max(0.2, Math.min(1, Math.log(1 + this.delay() / 100)));
        
        sound(((value - this.min) / (this.max - this.min)) * 1100 + 132, volumeMult);
    }

    public calculateBounds(): void {
        this.min = Infinity;
        this.max = -Infinity;

        for(let i = 0; i < this.length(); i++){
            this.min = Math.min(this.array[i], this.min);
            this.max = Math.max(this.array[i], this.max);
        }
    }

    public scramblerNum(scramblerSelectValue: string = this.scrambleSelect!.value) : number | null {
        for(let i = 0; i < scramblers.length; i++){
            if(scramblers[i][0] == scramblerSelectValue){
                return i;
            }
        }
        return null;
    }
    public scrambler() : [ string, (n: number) => number[], 
        (sortingObj: SortingObject, n: number) => number[] ] | null 
    {
        if(this.scramblerNum() == null)
            return null;

        return scramblers[this.scramblerNum()!];
    }

    public scrambleMethod() : ((n: number) => number[]) {
        const scrambler = this.scrambler();
        if(scrambler == null)
            return (n) => [];

        return scrambler[1];
    }

    public scramble(sizeValue: number = +this.sizeSlider!.value): void {
        this.array = this.scrambleMethod()(sizeValue);
        this.calculateBounds();
    }

    public resize(sizeValue: number = +this.sizeSlider!.value): void {
        const scrambler = this.scrambler();
        
        this.array = scrambler![2](this, sizeValue);
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

        const parameterContainer = document.createElement('div');
        parameterContainer.setAttribute('class', 'parameter_container');

        const animationContainer = document.createElement('div');
        animationContainer.setAttribute('class', 'animation_container input_container');

        const arrayParameterContainer = document.createElement('div');
        arrayParameterContainer.setAttribute('class', 'array_parameter_container input_container');

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
        this.scrambleButton.innerHTML = 'Scramble array';
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
        this.sortDiv.appendChild(parameterContainer);
        
        parameterContainer.appendChild(animationContainer);
        const animationLabel = document.createElement('b');
        animationLabel.innerHTML = 'Animation parameters';
        animationContainer.appendChild(animationLabel);

        animationContainer.appendChild(this.delaySlider);
        animationContainer.appendChild(this.sortButton);
        animationContainer.appendChild(this.pauseButton);
        
        parameterContainer.appendChild(arrayParameterContainer);
        const arrayLabel = document.createElement('b');
        arrayLabel.innerHTML = 'Array parameters';
        arrayParameterContainer.appendChild(arrayLabel);

        arrayParameterContainer.appendChild(this.sizeSlider);
        arrayParameterContainer.appendChild(this.scrambleButton);
        arrayParameterContainer.appendChild(this.scrambleMethod);
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

    if(canvas == null || ctx == null)
        return;

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

async function finalizeArray(sortingObj: SortingObject){
    const finalizeCheckTime = 1000;
    const finalizeResetTime = 1000;
    const finalizeFlickerTime = 100;


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