"use strict";
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(b) {
        return new Vec2(this.x + b.x, this.y + b.y);
    }
    sub(b) {
        return new Vec2(this.x - b.x, this.y - b.y);
    }
    mult(s) {
        return new Vec2(this.x * s, this.y * s);
    }
    multVec(v) {
        return new Vec2(this.x * v.x, this.y * v.y);
    }
    addDirection(direction) {
        return this.add(directionVectors.get(direction));
    }
}
//Keep directions in clockwise/counterclockwise order
var Directions;
(function (Directions) {
    Directions[Directions["Up"] = 0] = "Up";
    Directions[Directions["Right"] = 1] = "Right";
    Directions[Directions["Down"] = 2] = "Down";
    Directions[Directions["Left"] = 3] = "Left";
})(Directions || (Directions = {}));
const directionVectors = new Map([
    [Directions.Up, new Vec2(0, 1)],
    [Directions.Right, new Vec2(1, 0)],
    [Directions.Down, new Vec2(0, -1)],
    [Directions.Left, new Vec2(-1, 0)],
]);
const blocksPerCell = Math.floor(Object.keys(Directions).length / 4);
class Cell {
    constructor(x, y) {
        this.color = 'white';
        this.hasChanged = true;
        this.x = x;
        this.y = y;
        this.blocked = [];
        for (let i = 0; i < blocksPerCell; i++) {
            this.blocked.push(true);
        }
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
        this.hasChanged = true;
    }
    change() {
        this.hasChanged = true;
    }
    isBlocked(index) {
        return this.blocked[index];
    }
    unblock(index) {
        this.blocked[index] = false;
        this.hasChanged = true;
    }
    block(index) {
        this.blocked[index] = true;
        this.hasChanged = true;
    }
    position() {
        return new Vec2(this.x, this.y);
    }
    draw(maze) {
        if (!this.hasChanged)
            return;
        this.hasChanged = false;
        const canvas = maze.getCanvas();
        const ctx = maze.getCtx();
        let w = canvas.width / maze.width();
        let h = canvas.height / maze.height();
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(w * this.x), Math.floor(canvas.height - h * this.y), Math.ceil(w), -Math.ceil(h));
        ctx.strokeStyle = "black";
        let halfWidth = 1;
        ctx.lineWidth = 2 * halfWidth;
        for (let i = 0; i < this.blocked.length; i++) {
            if (!this.blocked[i]) {
                continue;
            }
            ctx.beginPath();
            const pos = new Vec2(this.x, this.y).multVec(new Vec2(w, h));
            const dir = directionVectors.get(i);
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
    constructor(canvas, delaySlider, sizeSlider) {
        this.w = 8;
        this.h = 5;
        this.loopIndex = 0;
        this.cells = [];
        this.delaySlider = null;
        this.sizeSlider = null;
        this.prevW = 0;
        this.prevH = 0;
        this.delaySlider = delaySlider;
        this.sizeSlider = sizeSlider;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.clear();
    }
    getCanvas() {
        return this.canvas;
    }
    getCtx() {
        return this.ctx;
    }
    size() {
        return +this.sizeSlider.value;
    }
    width() {
        return this.w * this.size();
    }
    height() {
        return this.h * this.size();
    }
    resize() {
        if (this.prevW == 0)
            this.cells = [];
        for (let x = 0; x < this.width(); x++) {
            if (x >= this.prevW)
                this.cells[x] = [];
            for (let y = 0; y < this.height(); y++) {
                if (x >= this.prevW || y >= this.prevH)
                    this.cells[x][y] = new Cell(x, y);
                else
                    this.cells[x][y].change();
            }
        }
        this.prevW = this.width();
        this.prevH = this.height();
    }
    delay() {
        return +this.delaySlider.value;
    }
    isRunning(loopIndex) {
        return this.loopIndex == loopIndex;
    }
    newLoop() {
        return ++this.loopIndex;
    }
    reset() {
        for (let x = 0; x < this.width(); x++) {
            for (let y = 0; y < this.height(); y++) {
                this.cells[x][y].setColor('white');
                this.cells[x][y].block(Directions.Up);
                this.cells[x][y].block(Directions.Right);
            }
        }
    }
    isOutsideBounds(pos) {
        return pos.x < 0 || pos.x >= this.width() || pos.y < 0 || pos.y >= this.height();
    }
    next(cell, direction) {
        const pos = cell.position().add(directionVectors.get(direction));
        if (this.isOutsideBounds(pos))
            return cell;
        return this.cells[pos.x][pos.y];
    }
    isSurrounded(cell) {
        for (let i = 0; i < 2 * blocksPerCell; i++) {
            if (this.next(cell, i).getColor() == 'white')
                return false;
        }
        return true;
    }
    carve(cell, direction) {
        const pos = cell.position().add(directionVectors.get(direction));
        if (this.isOutsideBounds(pos))
            return cell;
        const nextCell = this.cells[pos.x][pos.y];
        if (nextCell.getColor() != 'white')
            return cell;
        if (direction.valueOf() < blocksPerCell) {
            cell.unblock(direction);
        }
        else {
            nextCell.unblock(direction % blocksPerCell);
        }
        nextCell.setColor('red');
        return nextCell;
    }
    clear() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    draw(drawUnlessDelayIsZero = false) {
        if (this.delay() == 0 && drawUnlessDelayIsZero)
            return;
        for (let x = 0; x < this.width(); x++) {
            for (let y = 0; y < this.height(); y++) {
                this.cells[x][y].draw(this);
            }
        }
    }
    cell(x, y) {
        if (this.isOutsideBounds(new Vec2(x, y)))
            return null;
        return this.cells[x][y];
    }
}
class MazeWindow {
    constructor(mazeDiv) {
        this.canvas = null;
        this.delaySlider = null;
        this.startButton = null;
        this.sizeSlider = null;
        this.algorithm = null;
        this.mazeDiv = mazeDiv;
        this.createCanvas();
        this.mazeObj = new Maze(this.canvas, this.delaySlider, this.sizeSlider);
        this.mazeObj.draw();
    }
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', '1600');
        this.canvas.setAttribute('height', '1000');
        this.delaySlider = document.createElement('input');
        this.delaySlider.setAttribute('type', 'range');
        this.delaySlider.setAttribute('min', '0');
        this.delaySlider.setAttribute('max', '200');
        this.delaySlider.setAttribute('value', '50');
        this.startButton = document.createElement('button');
        this.startButton.innerHTML = "Generate";
        this.startButton.onclick = (e) => {
            this.mazeObj.reset();
            this.algorithm(this.mazeObj);
        };
        this.sizeSlider = document.createElement('input');
        this.sizeSlider.setAttribute('type', 'range');
        this.sizeSlider.setAttribute('min', '1');
        this.sizeSlider.setAttribute('max', '20');
        this.sizeSlider.setAttribute('value', '2');
        this.sizeSlider.oninput = (e) => {
            this.mazeObj.resize();
            this.mazeObj.draw();
        };
        this.mazeDiv.appendChild(this.canvas);
        this.mazeDiv.appendChild(this.delaySlider);
        this.mazeDiv.appendChild(this.startButton);
        this.mazeDiv.appendChild(this.sizeSlider);
    }
}
