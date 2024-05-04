var visited = [];
const bacterialGrowth = function(){
    clearInterval(bacterialInterval);
    visited = [];
    generateGrid();

    //First choose a random cell to infect:
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);
    grid[x][y].color = 'red';

    visited.push({ x: x, y: y });
    drawMaze();

    bacterialGrowthSolve();
}
var bacterialInterval;
const bacterialGrowthSolve = function(){
    if(timeStepSize == 0){
        while(visited.length > 0){
            let index = Math.floor(Math.random() * visited.length);
            grow(visited[index].x, visited[index].y);
        }
        drawMaze();
        return;
    }
    bacterialInterval = setInterval(function() {
        if(visited.length == 0){
            clearInterval(bacterialInterval);
            return;
        }
        let index = Math.floor(Math.random() * visited.length);
        grow(visited[index].x, visited[index].y);
        drawMaze();
    }, timeStepSize);
}

function grow(x, y){
    let direction;
    let search = true;
    if(removeIfEmpty(x, y)) 
        return false;
    while(search){
        direction = Math.floor(Math.random() * 4);
        switch(direction) {
            case 0:
                search = !canGrowUp(x, y);
                break;
            case 1:
                search = !canGrowDown(x, y);
                break;
            case 2:
                search = !canGrowRight(x, y);
                break;
            case 3:
                search = !canGrowLeft(x, y);
                break;
        }
    }

    switch(direction) {
        case 0:
            addIfFull(x, y - 1);
            grid[x][y].top = false;
            grid[x][y - 1].bottom = false;
            break;
        case 1:
            addIfFull(x, y + 1);
            grid[x][y].bottom = false;
            grid[x][y + 1].top = false;
            break;
        case 2:
            addIfFull(x + 1, y);
            grid[x][y].right = false;
            grid[x + 1][y].left = false;
            break;
        case 3:
            addIfFull(x - 1, y);
            grid[x][y].left = false;
            grid[x - 1][y].right = false;
            break;
    }
    return true;
}

function addOrRemove(x, y){
    if(removeIfEmpty(x, y)) return true;
    if(addIfFull(x, y)) return true;
    return false;
}
function removeIfEmpty(x, y){
    if(cantGrow(x, y)){
        //console.log(`remove at ${x}, ${y}`)
        let indexInVisited = findPositionInVisited(x, y);
        if(indexInVisited > -1) {
            visited.splice(indexInVisited, 1);
            grid[x][y].color = 'orange';
        }
        return true;
    } 
    return false;
}

function findPositionInVisited(x, y){
    for(let i = 0; i < visited.length; i++){
        if(visited[i].x == x && visited[i].y == y){
            return i;
        }
    }
    return -1;
}

function addIfFull(x, y){
    if(neverVisited(x, y)){
        visited.push({x: x, y: y});
        grid[x][y].color = 'red';
        return true;
    } 
    return false;
}
function neverVisited(x, y){
    return grid[x][y].top && grid[x][y].bottom && grid[x][y].left && grid[x][y].right;
}
function cantGrow(x, y){
    return !canGrowUp(x, y) && !canGrowDown(x, y) && !canGrowLeft(x, y) && !canGrowRight(x, y);
}

function canGrowUp(x, y){
    if(y > 0){
        return neverVisited(x, y - 1);
    }
    return false;
}
function canGrowDown(x, y){
    if(y < rows - 1){
        return neverVisited(x, y + 1);
    }
    return false;
}
function canGrowRight(x, y){
    if(x < columns - 1){
        return neverVisited(x + 1, y);
    }
    return false;
}
function canGrowLeft(x, y){
    if(x > 0){
        return neverVisited(x - 1, y);
    }
    return false;
}