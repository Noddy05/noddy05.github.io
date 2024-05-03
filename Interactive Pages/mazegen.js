console.log("maze gen setup!");

var columns = 10;
var rows    = 10;
var timeStepSize = 150;


//Retrieve the information we need to draw on the canvas:
const mazeCanvas = document.getElementById("maze-canvas");
const mazeCtx = mazeCanvas.getContext('2d');

const mazeColumnsInput    = document.getElementById("maze-columns");
const mazeColumnsDisplay  = document.getElementById("maze-columns-display");

const mazeRowsInput       = document.getElementById("maze-rows");
const mazeRowsDisplay    = document.getElementById("maze-rows-display");

const timeStepInput    = document.getElementById("time-step");
const timeStepDisplay  = document.getElementById("time-step-display");

var cellWidth;
var cellHeight;

//Make sure we update the display
updateRowDisplay();
updateColumnDisplay();
updateTimeDisplay();
mazeColumnsInput.addEventListener('input', function() { updateColumnDisplay(); });
function updateColumnDisplay(event){
    columns = mazeColumnsInput.value;
    mazeColumnsDisplay.innerHTML = columns;
    cellWidth = mazeCanvas.clientWidth / columns;
    generateGrid();
}
mazeRowsInput.addEventListener('input', function() { updateRowDisplay(); });
function updateRowDisplay(event){
    rows = mazeRowsInput.value;
    mazeRowsDisplay.innerHTML = rows;
    cellHeight = mazeCanvas.clientHeight / rows;
    generateGrid();
}
timeStepInput.addEventListener('input', function() { updateTimeDisplay(); });
function updateTimeDisplay(event){
    timeStepSize = timeStepInput.value;
    timeStepDisplay.innerHTML = timeStepSize;
}
timeStepInput.addEventListener('change', function() { 
    clearInterval(bacterialInterval);
    bacterialGrowthSolve(); 
    console.log("changed");
});

//Now we generate the maze from the given columns and rows:
//Grid is a 2D array that will keep track of every cell in the maze.
var grid = [[]];
generateGrid();
function generateGrid(){
    grid = [];
    for(let x = 0; x < columns; x++){
        grid[x] = [];
        for(let y = 0; y < rows; y++){
            //Every cell should contain information about wether or not it has a wall above it (top), below it (bottom) etc.
            //And the background color of the cell (color).
            grid[x][y] = { top: true, bottom: true, left: true, right: true, color: 'green' };
        }
    }
    drawMaze();
}

drawMaze();
function drawMaze() {
    //Clear canvas:
    mazeCtx.fillStyle = 'white';
    mazeCtx.fillRect(0, 0, mazeCanvas.clientWidth, mazeCanvas.clientHeight);

    //Now draw each cell:
    mazeCtx.beginPath()
    for(let x = 0; x < columns; x++){
        for(let y = 0; y < rows; y++){
            //Draw cell background color:
            mazeCtx.fillStyle = grid[x][y].color;
            mazeCtx.fillRect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
            prepareCell(x, y);
        }
    }
    mazeCtx.closePath();
    mazeCtx.lineWidth = '3';
    mazeCtx.stroke();
}


function drawCell(x, y){
    
    mazeCtx.beginPath();
    prepareCell(x, y);
    mazeCtx.closePath();
    mazeCtx.lineWidth = '3';
    mazeCtx.stroke();
}

function prepareCell(x, y){
    
    //Now we draw the walls of the cell, this requires us to check wether or not a wall is present:
    if(grid[x][y].top){
        mazeCtx.moveTo(cellWidth * (x + 1), cellHeight * y);
        mazeCtx.lineTo(cellWidth * x, cellHeight * y);
    }
    if(grid[x][y].bottom){
        mazeCtx.moveTo(cellWidth * (x + 1), cellHeight * (y + 1));
        mazeCtx.lineTo(cellWidth * x, cellHeight * (y + 1));
    }
    if(grid[x][y].right){
        mazeCtx.moveTo(cellWidth * (x + 1), cellHeight * (y + 1));
        mazeCtx.lineTo(cellWidth * (x + 1), cellHeight * y);
    }
    if(grid[x][y].left){
        mazeCtx.moveTo(cellWidth * x, cellHeight * (y + 1));
        mazeCtx.lineTo(cellWidth * x, cellHeight * y);
    }
}
