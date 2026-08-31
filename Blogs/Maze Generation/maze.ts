

class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public add(b: Vec2): Vec2{
        return new Vec2(this.x + b.x, this.y + b.y);
    }

    public sub(b: Vec2): Vec2{
        return new Vec2(this.x - b.x, this.y - b.y);
    }

    public mult(s: number): Vec2{
        return new Vec2(this.x * s, this.y * s);
    }

    public multVec(v: Vec2): Vec2{
        return new Vec2(this.x * v.x, this.y * v.y);
    }

    public addDirection(direction: Directions): Vec2{
        return this.add(directionVectors.get(direction)!);
    }
}

//Keep directions in clockwise/counterclockwise order
enum Directions {
    Up,
    Right,
    Down,
    Left
}
const directionVectors: Map<Directions, Vec2> = new Map([
    [ Directions.Up,    new Vec2( 0,  1) ],
    [ Directions.Right, new Vec2( 1,  0) ],
    [ Directions.Down,  new Vec2( 0, -1) ],
    [ Directions.Left,  new Vec2(-1,  0) ],
]);

const blocksPerCell = Math.floor(Object.keys(Directions).length / 4);

class Cell {
    private x: number;
    private y: number;

    private blocked: boolean[];

    private color = 'white';

    private hasChanged = true;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;

        this.blocked = [];
        for(let i = 0; i < blocksPerCell; i++){
            this.blocked.push(true);
        }
    }

    public getColor(): string {
        return this.color;
    }

    public setColor(color: string){
        this.color = color;
        this.hasChanged = true;
    }

    public change(): void {
        this.hasChanged = true;
    }

    public isBlocked(index: number): boolean{
        return this.blocked[index];
    }

    public unblock(index: number){
        this.blocked[index] = false;
        this.hasChanged = true;
    }

    public block(index: number){
        this.blocked[index] = true;
        this.hasChanged = true;
    }

    public position(): Vec2{
        return new Vec2(this.x, this.y);
    }

    public draw(maze: Maze){
        if(!this.hasChanged)
            return;
        this.hasChanged = false;

        const canvas = maze.getCanvas();
        const ctx = maze.getCtx();

        let w = canvas.width / maze.width();
        let h = canvas.height / maze.height();
        
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(w * this.x), Math.floor(canvas.height - h * this.y), 
            Math.ceil(w), -Math.ceil(h));
        
        ctx.strokeStyle = "black";
        let halfWidth = 1;
        ctx.lineWidth = 2 * halfWidth;

        for(let i = 0; i < this.blocked.length; i++){
            if(!this.blocked[i]){
                continue;
            }

            ctx.beginPath();
            const pos = new Vec2(this.x, this.y).multVec(new Vec2(w, h));
            const dir = directionVectors.get(i)!;
            const firstVector = dir.multVec(new Vec2(w - halfWidth, h - halfWidth));
            const firstCorner = pos.add(firstVector);
            const endCorner = pos.add(firstVector.add(new Vec2(1, 1).sub(dir).multVec(new Vec2(w, h))));
            ctx.moveTo(firstCorner.x, canvas.height - firstCorner.y);
            ctx.lineTo(endCorner.x, canvas.height - endCorner.y);
            ctx.stroke();
        }
    }
}

class Maze {
    private w: number = 8;
    private h: number = 5;

    private loopIndex: number = 0;
    private cells: Cell[][] = [];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    public delaySlider: HTMLInputElement | null = null;
    public sizeSlider: HTMLInputElement | null = null;

    private prevW = 0;
    private prevH = 0;

    constructor(canvas: HTMLCanvasElement, delaySlider: HTMLInputElement, sizeSlider: HTMLInputElement){
        this.delaySlider = delaySlider;
        this.sizeSlider = sizeSlider;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.resize();

        this.clear();
    }

    public getCanvas() {
        return this.canvas;
    }

    public getCtx() {
        return this.ctx;
    }

    private size(): number {
        return +this.sizeSlider!.value;
    }

    public width() {
        return this.w * this.size();
    }

    public height() {
        return this.h * this.size();
    }

    public resize(){
        if(this.prevW == 0)
            this.cells = [];

        for(let x = 0; x < this.width(); x++){
            if(x >= this.prevW)
                this.cells[x] = [];
            for(let y = 0; y < this.height(); y++){
                if(x >= this.prevW || y >= this.prevH)
                    this.cells[x][y] = new Cell(x, y);
                else
                    this.cells[x][y].change();
            }
        }

        this.prevW = this.width();
        this.prevH = this.height();
    }

    public delay(): number {
        return +this.delaySlider!.value;
    }

    public isRunning(loopIndex: number): boolean {
        return this.loopIndex == loopIndex;
    }

    public newLoop(): number {
        return ++this.loopIndex;
    }

    public reset(){
        for(let x = 0; x < this.width(); x++){
            for(let y = 0; y < this.height(); y++){
                this.cells[x][y].setColor('white');
                this.cells[x][y].block(Directions.Up);
                this.cells[x][y].block(Directions.Right);
            }
        }
    }

    public isOutsideBounds(pos: Vec2): boolean {
        return pos.x < 0 || pos.x >= this.width() || pos.y < 0 || pos.y >= this.height();
    }

    public next(cell: Cell, direction: Directions): Cell {
        const pos = cell.position().add(directionVectors.get(direction)!);
        if(this.isOutsideBounds(pos))
            return cell;

        return this.cells[pos.x][pos.y];
    }

    public isSurrounded(cell: Cell): boolean {
        for(let i = 0; i < 2 * blocksPerCell; i++){
            if(this.next(cell, i).getColor() == 'white')
                return false;
        }
        
        return true;
    }

    public carve(cell: Cell, direction: Directions): Cell {
        const pos = cell.position().add(directionVectors.get(direction)!);
        if(this.isOutsideBounds(pos))
            return cell;

        const nextCell = this.cells[pos.x][pos.y];
        if(nextCell.getColor() != 'white')
            return cell;

        if(direction.valueOf() < blocksPerCell){
            cell.unblock(direction);
        } else {
            nextCell.unblock(direction % blocksPerCell);
        }

        nextCell.setColor('red');

        return nextCell;
    }

    public clear(){
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public draw(drawUnlessDelayIsZero: boolean = false){
        if(this.delay() == 0 && drawUnlessDelayIsZero)
            return;

        for(let x = 0; x < this.width(); x++){
            for(let y = 0; y < this.height(); y++){
                this.cells[x][y].draw(this);
            }
        }
    }

    public cell(x: number, y: number): Cell | null{
        if(this.isOutsideBounds(new Vec2(x, y)))
            return null;

        return this.cells[x][y];
    }
}

class MazeWindow {
    public mazeDiv: HTMLDivElement;
    public mazeObj: Maze;

    public canvas: HTMLCanvasElement | null = null;
    public delaySlider: HTMLInputElement | null = null;
    public startButton: HTMLButtonElement | null = null;
    public sizeSlider: HTMLInputElement | null = null;

    public algorithm: ((maze: Maze) => void) | null = null;

    public constructor(mazeDiv: HTMLDivElement){
        this.mazeDiv = mazeDiv;
        this.createCanvas();

        this.mazeObj = new Maze(this.canvas!, this.delaySlider!, this.sizeSlider!);
        this.mazeObj.draw();
    }

    public createCanvas(){
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.setAttribute('width', '1600');
        this.canvas.setAttribute('height', '1000');

        this.delaySlider = document.createElement('input');
        this.delaySlider.setAttribute('type', 'range');
        this.delaySlider.setAttribute('min', '0');
        this.delaySlider.setAttribute('max', '200');
        this.delaySlider.setAttribute('value', '50');

        this.startButton = document.createElement('button') as HTMLButtonElement;
        this.startButton.innerHTML = "Generate";
        this.startButton.onclick = (e) => {
            this.mazeObj.reset();
            this.algorithm!(this.mazeObj);
        }

        this.sizeSlider = document.createElement('input');
        this.sizeSlider.setAttribute('type', 'range');
        this.sizeSlider.setAttribute('min', '1');
        this.sizeSlider.setAttribute('max', '20');
        this.sizeSlider.setAttribute('value', '2');
        this.sizeSlider.oninput = (e) => {
            this.mazeObj.resize();
            this.mazeObj.draw();
        }

        this.mazeDiv.appendChild(this.canvas);
        this.mazeDiv.appendChild(this.delaySlider);
        this.mazeDiv.appendChild(this.startButton);
        this.mazeDiv.appendChild(this.sizeSlider);
    }
}
