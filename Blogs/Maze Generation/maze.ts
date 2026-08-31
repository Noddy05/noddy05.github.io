

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

    public draw(w: number, h: number){
        if(!this.hasChanged)
            return;
        this.hasChanged = false;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(w * this.x, canvas.height - h * this.y, w, - h);
        
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
    public w: number;
    public h: number;

    private loopIndex: number = 0;
    private cells: Cell[][];

    constructor(w: number, h: number){
        this.w = w;
        this.h = h;

        this.cells = [];
        for(let x = 0; x < w; x++){
            this.cells[x] = [];
            for(let y = 0; y < h; y++){
                this.cells[x][y] = new Cell(x, y);
            }
        }

        this.clear();
    }
    
    public delay(): number {
        return 0;
    }

    public isRunning(loopIndex: number): boolean {
        return this.loopIndex == loopIndex;
    }

    public newLoop(): number {
        return ++this.loopIndex;
    }

    public reset(){
        for(let x = 0; x < this.w; x++){
            for(let y = 0; y < this.h; y++){
                this.cells[x][y].setColor('white');
                this.cells[x][y].block(Directions.Up);
                this.cells[x][y].block(Directions.Right);
            }
        }
    }

    private isOutsideBounds(pos: Vec2): boolean {
        return pos.x < 0 || pos.x >= this.w || pos.y < 0 || pos.y >= this.h;
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
        if(direction.valueOf() < blocksPerCell){
            cell.unblock(direction);
        } else {
            nextCell.unblock(direction % blocksPerCell);
        }

        nextCell.setColor('red');

        return nextCell;
    }

    public clear(){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    public draw(drawUnlessDelayIsZero: boolean = false){
        if(this.delay() == 0 && drawUnlessDelayIsZero)
            return;


        for(let x = 0; x < this.w; x++){
            for(let y = 0; y < this.h; y++){
                this.cells[x][y].draw(canvas.width / this.w, canvas.height / this.h);
            }
        }
    }

    public cell(x: number, y: number): Cell | null{
        if(this.isOutsideBounds(new Vec2(x, y)))
            return null;

        return this.cells[x][y];
    }
}

async function sleep(time: number){
    if(time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
