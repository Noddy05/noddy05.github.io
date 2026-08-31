"use strict";
const delayCutoff = 50;
async function bacterialGrowth(maze) {
    const loopIndex = maze.newLoop();
    let prevW = maze.width();
    let prevH = maze.height();
    const x = Math.floor(Math.random() * maze.width());
    const y = Math.floor(Math.random() * maze.height());
    const startCell = maze.cell(x, y);
    const cells = [startCell];
    startCell.setColor('red');
    let cellsLeft = 0;
    let cellsDone = 0;
    for (let x = 0; x < maze.width(); x++) {
        for (let y = 0; y < maze.height(); y++) {
            if (maze.cell(x, y).getColor() == 'white')
                cellsLeft++;
            if (maze.cell(x, y).getColor() == 'green')
                cellsDone++;
        }
    }
    await sleepFor(maze.delay());
    if (!maze.isRunning(loopIndex))
        return;
    await maze.draw();
    let iteration = 0;
    while (cells.length > 0) {
        let iterationsInALoop = 1;
        if (maze.delay() < delayCutoff)
            iterationsInALoop = 1 + Math.floor((delayCutoff - maze.delay()) * 0.5);
        if (prevW != maze.width() || prevH != maze.height()) {
            for (let i = 0; i < cells.length; i++) {
                if (maze.isOutsideBounds(cells[i].position())) {
                    cells.splice(i, 1);
                    i--;
                }
            }
            prevW = maze.width();
            prevH = maze.height();
            iteration = 0;
        }
        let cellIndex = Math.floor(Math.random() * cells.length);
        let nextDirection = Math.floor(Math.random() * blocksPerCell * 2);
        while (cells.length > 0 && maze.isSurrounded(cells[cellIndex])) {
            cells[cellIndex].setColor('green');
            cellsDone++;
            //sound((cellsDone / (maze.w * maze.h)) * 1100 + 130);
            if (maze.delay() > delayCutoff && iteration % iterationsInALoop == 0) {
                await sleepFor(maze.delay());
                if (!maze.isRunning(loopIndex))
                    return;
                await maze.draw(true);
            }
            cells.splice(cellIndex, 1);
            cellIndex = Math.floor(Math.random() * cells.length);
        }
        if (cells.length <= 0)
            break;
        const pickedCell = cells[cellIndex];
        let dirOffset = 0;
        while (maze.next(pickedCell, (nextDirection + dirOffset)
            % (2 * blocksPerCell)).getColor() != 'white') {
            dirOffset++;
            if (dirOffset > 10) {
                console.log(cellIndex, nextDirection, cells);
                cells[cellIndex].setColor('orange');
                console.log("wtf?");
                maze.draw();
                return;
            }
        }
        const next = maze.carve(pickedCell, (nextDirection + dirOffset) % (2 * blocksPerCell));
        cellsLeft--;
        //sound((1 - cellsLeft / (maze.w * maze.h)) * 1100 + 130);
        if (maze.delay() > 0 && iteration % iterationsInALoop == 0) {
            await sleepFor(maze.delay());
            if (!maze.isRunning(loopIndex))
                return;
            await maze.draw(true);
        }
        cells.push(next);
        iteration++;
    }
    await sleepFor(maze.delay());
    if (!maze.isRunning(loopIndex))
        return;
    await maze.draw(false);
}
const bacterialGrowthDiv = new MazeWindow(document.getElementById('bacterial_growth'));
bacterialGrowthDiv.algorithm = bacterialGrowth;
