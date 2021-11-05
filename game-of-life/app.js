let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.setAttribute('width', gameSettings.canvasSettings.canvasWidth);
canvas.setAttribute('height', gameSettings.canvasSettings.canvasHeight);
let gridSizeX = Math.floor(gameSettings.canvasSettings.canvasWidth / gameSettings.canvasSettings.resolution), gridSizeY = Math.floor(gameSettings.canvasSettings.canvasHeight / gameSettings.canvasSettings.resolution);
let rectWidth = gameSettings.canvasSettings.canvasWidth / (gridSizeX), rectHeight = gameSettings.canvasSettings.canvasHeight / (gridSizeY);
let grid = createGrid(gridSizeX, gridSizeY);
fillRandomCellToGrid(grid);

function createGrid(gridSizeX, gridSizeY) {
    return new Array(gridSizeX).fill(null).map(() => new Array(gridSizeY).fill(0));
}

function fillRandomCellToGrid(grid) {
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            grid[column][row] = Math.floor(Math.random() * 2);
        }
    }
}

function drawCells(grid) {
    ctx.beginPath();
    ctx.clearRect(0, 0, gameSettings.canvasSettings.canvasWidth, gameSettings.canvasSettings.canvasHeight);
    ctx.fillStyle = gameSettings.canvasObjectSettings.cellColor;
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            if (grid[column][row] == 1) {
                ctx.fillRect(column * rectWidth, row * rectHeight, rectWidth, rectHeight);
            }
        }
    }
    ctx.closePath();
}

function sumNeighbors(grid, column, row) {
    let sum = 0;
    let tempColumn = column, tempRow = row;
    let cellDirections = {
        topLeft: [-1, -1],
        top: [0, -1],
        topRight: [1, -1],
        right: [1, 0],
        bottomRight: [1, 1],
        bottom: [0, 1],
        bottomLeft: [-1, 1],
        left: [-1, 0],
    };
    for (let [key] of Object.entries(cellDirections)) {
        column = tempColumn;
        row = tempRow;
        if (column + cellDirections[key][0] < 0) {
            column = grid.length - 1;
        } else if (column + cellDirections[key][0] > grid.length - 1) {
            column = 0;
        } else if (row + cellDirections[key][1] < 0) {
            row = grid.length - 1;
        } else if (row + cellDirections[key][1] > grid.length - 1) {
            row = 0;
        }
        if (grid[column + cellDirections[key][0]][row + cellDirections[key][1]] == 1) {
            sum++;
        }
    }
    return sum;
}

function killCell(newGenerationArr, column, row) {
    newGenerationArr[column][row] = 0;
}

function reviveCell(grid, column, row) {
    grid[column][row] = 1;
}

function createNewGenerationArr(grid) {
    let newGenerationArr = new Array(grid.length).fill(null)
        .map(() => new Array(grid.length).fill(0));
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            newGenerationArr[column][row] = grid[column][row];
        }
    }
    return newGenerationArr;
}

function fillGridWithNewGenerationArr(grid, newGenerationArr) {
    for (let column = 0; column < newGenerationArr.length; column++) {
        for (let row = 0; row < newGenerationArr[column].length; row++) {
            grid[column][row] = newGenerationArr[column][row];
        }
    }
    return grid;
}


function nextGeneration(grid) {
    let newGenerationArr = createNewGenerationArr(grid);
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            if (grid[column][row] == 1 && sumNeighbors(grid, column, row) < 2) {
                killCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 1 && sumNeighbors(grid, column, row) > 3) {
                killCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 1 && (sumNeighbors(grid, column, row) == 2 || sumNeighbors(grid, column, row) == 3)) {
                reviveCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 0 && sumNeighbors(grid, column, row) == 3) {
                reviveCell(newGenerationArr, column, row);
            }
        }
    }
    grid = fillGridWithNewGenerationArr(grid, newGenerationArr);
    drawCells(newGenerationArr);
}

setInterval(function() {
    nextGeneration(grid);
}, gameSettings.canvasSettings.refreshTime);