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
const mazeRowsDisplay     = document.getElementById("maze-rows-display");

const timeStepInput       = document.getElementById("time-step");
const timeStepDisplay     = document.getElementById("time-step-display");

var cellWidth;
var cellHeight;

//Make sure we update the display
updateRowDisplay();
updateColumnDisplay();
updateTimeDisplay();
//This function is called whenever the columns slider is being moved:
mazeColumnsInput.addEventListener('input', function() { updateColumnDisplay(); });
function updateColumnDisplay(){
    //We update the columns variable whenever the slider is updated:
    columns = mazeColumnsInput.value;
    //Then we update the displays:
    mazeColumnsDisplay.innerHTML = columns;
    //And finally we update the width of each cell in the maze, since that depends on the number of columns:
    cellWidth = mazeCanvas.clientWidth / columns;
    generateGrid();
}
//This function is called whenever the rows slider is being moved:
mazeRowsInput.addEventListener('input', function() { updateRowDisplay(); });
function updateRowDisplay(){
    //The same routine:
    rows = mazeRowsInput.value;
    mazeRowsDisplay.innerHTML = rows;
    cellHeight = mazeCanvas.clientHeight / rows;
    generateGrid();
}

//This function is called whenever the time slider is being moved:
timeStepInput.addEventListener('input', function() { updateTimeDisplay(); });
function updateTimeDisplay(){
    //The same routine:
    timeStepSize = timeStepInput.value;
    timeStepDisplay.innerHTML = timeStepSize;
}
//This function is called whenever the time slider is done being moved:
//We use 'change' because this isn't called multiple times per tick, which can be the case for 'input'.
//Calling this multiple times per tick can result in multiple maze generation algorithms being called at the same time.
timeStepInput.addEventListener('change', function() { 
    //We first clear the current interval (something that loops every x milliseconds)
    clearInterval(bacterialInterval);
    //And call this function to create a new loop with the specified time between iterations:
    //In this case we use Bacterial Growth algorithm to generate a maze, hence the name 'bacterialGrowthSolve'
    bacterialGrowthSolve(); 
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
    //This function draws the maze (Its defined further down):
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
            //Add the walls to the current path using prepareCell(x, y)
            prepareCell(x, y);
        }
    }
    //Finally we close the path that contains all the walls
    mazeCtx.closePath();
    //And draw it, with line thickness 3
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



