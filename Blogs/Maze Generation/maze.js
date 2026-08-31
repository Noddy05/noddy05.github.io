var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (b) {
        return new Vec2(this.x + b.x, this.y + b.y);
    };
    Vec2.prototype.sub = function (b) {
        return new Vec2(this.x - b.x, this.y - b.y);
    };
    Vec2.prototype.mult = function (s) {
        return new Vec2(this.x * s, this.y * s);
    };
    Vec2.prototype.multVec = function (v) {
        return new Vec2(this.x * v.x, this.y * v.y);
    };
    Vec2.prototype.addDirection = function (direction) {
        return this.add(directionVectors.get(direction));
    };
    return Vec2;
}());
//Keep directions in clockwise/counterclockwise order
var Directions;
(function (Directions) {
    Directions[Directions["Up"] = 0] = "Up";
    Directions[Directions["Right"] = 1] = "Right";
    Directions[Directions["Down"] = 2] = "Down";
    Directions[Directions["Left"] = 3] = "Left";
})(Directions || (Directions = {}));
var directionVectors = new Map([
    [Directions.Up, new Vec2(0, 1)],
    [Directions.Right, new Vec2(1, 0)],
    [Directions.Down, new Vec2(0, -1)],
    [Directions.Left, new Vec2(-1, 0)],
]);
var blocksPerCell = Math.floor(Object.keys(Directions).length / 4);
var Cell = /** @class */ (function () {
    function Cell(x, y) {
        this.color = 'white';
        this.hasChanged = true;
        this.x = x;
        this.y = y;
        this.blocked = [];
        for (var i = 0; i < blocksPerCell; i++) {
            this.blocked.push(true);
        }
    }
    Cell.prototype.getColor = function () {
        return this.color;
    };
    Cell.prototype.setColor = function (color) {
        this.color = color;
        this.hasChanged = true;
    };
    Cell.prototype.change = function () {
        this.hasChanged = true;
    };
    Cell.prototype.isBlocked = function (index) {
        return this.blocked[index];
    };
    Cell.prototype.unblock = function (index) {
        this.blocked[index] = false;
        this.hasChanged = true;
    };
    Cell.prototype.block = function (index) {
        this.blocked[index] = true;
        this.hasChanged = true;
    };
    Cell.prototype.position = function () {
        return new Vec2(this.x, this.y);
    };
    Cell.prototype.draw = function (maze) {
        if (!this.hasChanged)
            return;
        this.hasChanged = false;
        var canvas = maze.getCanvas();
        var ctx = maze.getCtx();
        var w = canvas.width / maze.width();
        var h = canvas.height / maze.height();
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(w * this.x), Math.floor(canvas.height - h * this.y), Math.ceil(w), -Math.ceil(h));
        ctx.strokeStyle = "black";
        var halfWidth = 1;
        ctx.lineWidth = 2 * halfWidth;
        for (var i = 0; i < this.blocked.length; i++) {
            if (!this.blocked[i]) {
                continue;
            }
            ctx.beginPath();
            var pos = new Vec2(this.x, this.y).multVec(new Vec2(w, h));
            var dir = directionVectors.get(i);
            var firstVector = dir.multVec(new Vec2(w - halfWidth, h - halfWidth));
            var firstCorner = pos.add(firstVector);
            var endCorner = pos.add(firstVector.add(new Vec2(1, 1).sub(dir).multVec(new Vec2(w, h))));
            ctx.moveTo(firstCorner.x, canvas.height - firstCorner.y);
            ctx.lineTo(endCorner.x, canvas.height - endCorner.y);
            ctx.stroke();
        }
    };
    return Cell;
}());
var Maze = /** @class */ (function () {
    function Maze(canvas, delaySlider, sizeSlider) {
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
    Maze.prototype.getCanvas = function () {
        return this.canvas;
    };
    Maze.prototype.getCtx = function () {
        return this.ctx;
    };
    Maze.prototype.size = function () {
        return +this.sizeSlider.value;
    };
    Maze.prototype.width = function () {
        return this.w * this.size();
    };
    Maze.prototype.height = function () {
        return this.h * this.size();
    };
    Maze.prototype.resize = function () {
        if (this.prevW == 0)
            this.cells = [];
        for (var x = 0; x < this.width(); x++) {
            if (x >= this.prevW)
                this.cells[x] = [];
            for (var y = 0; y < this.height(); y++) {
                if (x >= this.prevW || y >= this.prevH)
                    this.cells[x][y] = new Cell(x, y);
                else
                    this.cells[x][y].change();
            }
        }
        this.prevW = this.width();
        this.prevH = this.height();
    };
    Maze.prototype.delay = function () {
        return +this.delaySlider.value;
    };
    Maze.prototype.isRunning = function (loopIndex) {
        return this.loopIndex == loopIndex;
    };
    Maze.prototype.newLoop = function () {
        return ++this.loopIndex;
    };
    Maze.prototype.reset = function () {
        for (var x = 0; x < this.width(); x++) {
            for (var y = 0; y < this.height(); y++) {
                this.cells[x][y].setColor('white');
                this.cells[x][y].block(Directions.Up);
                this.cells[x][y].block(Directions.Right);
            }
        }
    };
    Maze.prototype.isOutsideBounds = function (pos) {
        return pos.x < 0 || pos.x >= this.width() || pos.y < 0 || pos.y >= this.height();
    };
    Maze.prototype.next = function (cell, direction) {
        var pos = cell.position().add(directionVectors.get(direction));
        if (this.isOutsideBounds(pos))
            return cell;
        return this.cells[pos.x][pos.y];
    };
    Maze.prototype.isSurrounded = function (cell) {
        for (var i = 0; i < 2 * blocksPerCell; i++) {
            if (this.next(cell, i).getColor() == 'white')
                return false;
        }
        return true;
    };
    Maze.prototype.carve = function (cell, direction) {
        var pos = cell.position().add(directionVectors.get(direction));
        if (this.isOutsideBounds(pos))
            return cell;
        var nextCell = this.cells[pos.x][pos.y];
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
    };
    Maze.prototype.clear = function () {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Maze.prototype.draw = function (drawUnlessDelayIsZero) {
        if (drawUnlessDelayIsZero === void 0) { drawUnlessDelayIsZero = false; }
        if (this.delay() == 0 && drawUnlessDelayIsZero)
            return;
        for (var x = 0; x < this.width(); x++) {
            for (var y = 0; y < this.height(); y++) {
                this.cells[x][y].draw(this);
            }
        }
    };
    Maze.prototype.cell = function (x, y) {
        if (this.isOutsideBounds(new Vec2(x, y)))
            return null;
        return this.cells[x][y];
    };
    return Maze;
}());
var MazeWindow = /** @class */ (function () {
    function MazeWindow(mazeDiv) {
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
    MazeWindow.prototype.createCanvas = function () {
        var _this = this;
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
        this.startButton.onclick = function (e) {
            _this.mazeObj.reset();
            _this.algorithm(_this.mazeObj);
        };
        this.sizeSlider = document.createElement('input');
        this.sizeSlider.setAttribute('type', 'range');
        this.sizeSlider.setAttribute('min', '1');
        this.sizeSlider.setAttribute('max', '20');
        this.sizeSlider.setAttribute('value', '2');
        this.sizeSlider.oninput = function (e) {
            _this.mazeObj.resize();
            _this.mazeObj.draw();
        };
        this.mazeDiv.appendChild(this.canvas);
        this.mazeDiv.appendChild(this.delaySlider);
        this.mazeDiv.appendChild(this.startButton);
        this.mazeDiv.appendChild(this.sizeSlider);
    };
    return MazeWindow;
}());
function sleep(time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (time > 0)
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
            return [2 /*return*/];
        });
    });
}
