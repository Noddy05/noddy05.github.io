"use strict";
async function generate(maze) {
    const loopIndex = maze.newLoop();
    const x = Math.floor(Math.random() * maze.w);
    const y = Math.floor(Math.random() * maze.h);
    const startCell = maze.cell(x, y);
    const cells = [startCell];
    startCell.setColor('red');
    let cellsLeft = 0;
    let cellsDone = 0;
    for (let x = 0; x < maze.w; x++) {
        for (let y = 0; y < maze.h; y++) {
            if (maze.cell(x, y).getColor() == 'white')
                cellsLeft++;
            if (maze.cell(x, y).getColor() == 'green')
                cellsDone++;
        }
    }
    await sleep(maze.delay());
    if (!maze.isRunning(loopIndex))
        return;
    await maze.draw();
    while (cells.length > 0) {
        let cellIndex = Math.floor(Math.random() * cells.length);
        let nextDirection = Math.floor(Math.random() * blocksPerCell * 2);
        while (cells.length > 0 && maze.isSurrounded(cells[cellIndex])) {
            cells[cellIndex].setColor('green');
            cellsDone++;
            //sound((cellsDone / (maze.w * maze.h)) * 1100 + 130);
            await sleep(maze.delay());
            if (!maze.isRunning(loopIndex))
                return;
            await maze.draw(true);
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
        await sleep(maze.delay());
        if (!maze.isRunning(loopIndex))
            return;
        await maze.draw(true);
        cells.push(next);
    }
    await sleep(maze.delay());
    if (!maze.isRunning(loopIndex))
        return;
    await maze.draw(false);
}
const mazeWindow = document.getElementById('maze_window');
const canvas = document.createElement('canvas');
canvas.setAttribute('width', '1600');
canvas.setAttribute('height', '1000');
const ctx = canvas.getContext('2d');
const startButton = document.createElement('button');
startButton.innerHTML = "Start";
startButton.onclick = (e) => {
    maze.reset();
    generate(maze);
};
mazeWindow.appendChild(canvas);
mazeWindow.appendChild(startButton);
const scale = 2;
const maze = new Maze(16 * scale, 10 * scale);
maze.draw();
