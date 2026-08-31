
async function recursiveBacktracker(maze: Maze){
    let prevW = maze.width();
    let prevH = maze.height();

    const loopIndex = maze.newLoop();
    const path: Cell[] = [ maze.cell(0, 0)! ];
    path[0].setColor('red');

    let iteration = 0;
    while(path.length > 0){
        if(prevW != maze.width() || prevH != maze.height()){
            while(path.length > 0 && maze.isOutsideBounds(path[path.length - 1].position())){
                path.pop();
            }

            prevW = maze.width();
            prevH = maze.height();
            iteration = 0;
        }

        let iterationsInALoop = 1;
        if(maze.delay() < delayCutoff)
            iterationsInALoop = 1 + Math.floor((delayCutoff - maze.delay()) * 0.5);
        
        const pathEnd = path[path.length - 1];
        let nextPath = pathEnd;
        while(nextPath == pathEnd && !maze.isSurrounded(pathEnd)){
            let direction = Math.floor(Math.random() * blocksPerCell * 2);
            nextPath = maze.carve(pathEnd, direction);
            if(nextPath != pathEnd){
                path.push(nextPath);
                nextPath.setColor('red');
                break;
            }
        }

        if(maze.delay() > 0 && iteration % iterationsInALoop == 0){
            await sleepFor(maze.delay());
            if(!maze.isRunning(loopIndex))
                return;
            await maze.draw(true);
        }

        while(path.length > 0 && maze.isSurrounded(path[path.length - 1])){
            path[path.length - 1].setColor('green');
            path.pop();

            if(maze.delay() > 0 && iteration % iterationsInALoop == 0){
                await sleepFor(maze.delay());
                if(!maze.isRunning(loopIndex))
                    return;
                await maze.draw(true);
            }
            iteration++;
        }

        iteration++;
    }

    maze.draw();
}

const recursiveBacktrackerDiv = new MazeWindow(document.getElementById('recursive_backtracker') as HTMLDivElement);
recursiveBacktrackerDiv.algorithm = recursiveBacktracker;