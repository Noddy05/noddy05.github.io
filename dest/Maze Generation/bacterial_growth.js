"use strict";
const delayCutoff = 50;
async function bacterialGrowth(maze) {
    const loopIndex = maze.newLoop();
    let prevW = maze.width();
    let prevH = maze.height();
    const x = Math.floor(Math.random() * maze.width());
    const y = Math.floor(Math.random() * maze.height());
    const startCell = maze.cell(x, y);
    const bacteria = [startCell];
    startCell.setColor('red');
    let iteration = 0;
    let iterationsPerDraw = 1;
    while (bacteria.length > 0) {
        const pickedBacteria = Math.floor(Math.random() * bacteria.length);
        if (maze.delay() < 100) {
            iterationsPerDraw = Math.ceil(1000 / (maze.delay() + 1));
        }
        const neighbours = maze.unvisitedDirections(bacteria[pickedBacteria]);
        if (neighbours.length == 0) {
            bacteria[pickedBacteria].setColor('green');
            bacteria.splice(pickedBacteria, 1);
        }
        else {
            const pickedDirection = neighbours[Math.floor(Math.random() * neighbours.length)];
            bacteria.push(maze.carve(bacteria[pickedBacteria], pickedDirection));
        }
        if (maze.delay() > 0 && iteration % iterationsPerDraw == 0) {
            await sleepFor(maze.delay());
            if (!maze.isRunning(loopIndex))
                return;
            await maze.draw(true);
        }
        iteration++;
    }
    await maze.draw(false);
}
const bacterialGrowthDiv = new MazeWindow(document.getElementById('bacterial_growth'));
bacterialGrowthDiv.algorithm = bacterialGrowth;
