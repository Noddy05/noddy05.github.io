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
    draw(w, h) {
        if (!this.hasChanged)
            return;
        this.hasChanged = false;
        ctx.fillStyle = this.color;
        ctx.fillRect(w * this.x, canvas.height - h * this.y, w, -h);
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
    constructor(w, h) {
        this.loopIndex = 0;
        this.w = w;
        this.h = h;
        this.cells = [];
        for (let x = 0; x < w; x++) {
            this.cells[x] = [];
            for (let y = 0; y < h; y++) {
                this.cells[x][y] = new Cell(x, y);
            }
        }
        this.clear();
    }
    delay() {
        return 0;
    }
    isRunning(loopIndex) {
        return this.loopIndex == loopIndex;
    }
    newLoop() {
        return ++this.loopIndex;
    }
    reset() {
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                this.cells[x][y].setColor('white');
                this.cells[x][y].block(Directions.Up);
                this.cells[x][y].block(Directions.Right);
            }
        }
    }
    isOutsideBounds(pos) {
        return pos.x < 0 || pos.x >= this.w || pos.y < 0 || pos.y >= this.h;
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
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    draw(drawUnlessDelayIsZero = false) {
        if (this.delay() == 0 && drawUnlessDelayIsZero)
            return;
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                this.cells[x][y].draw(canvas.width / this.w, canvas.height / this.h);
            }
        }
    }
    cell(x, y) {
        if (this.isOutsideBounds(new Vec2(x, y)))
            return null;
        return this.cells[x][y];
    }
}
async function sleep(time) {
    if (time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
