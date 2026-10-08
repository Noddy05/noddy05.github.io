let iterationIndex = 0;
//let rules: [number[], number[]] = [[0, 1, 7, 8], [3, 5]];
//Interesting rules:
//rules = [ [0, 1, 7, 8], [ 3, 5 ] ]
//rules = [ [ 0, 3, 6, 8 ], [ 2, 3 ] ]
//rules = [ [ 0, 3, 6, 8 ], [ 2, 3, 5, 8 ] ]
//rules = [ [ 3 ], [ 2, 3 ] ]                            // Game of life
//rules = [ [ 1, 3, 5, 7 ], [ 0, 2, 4, 6, 8 ] ]          // Very noisy
//rules = [ [ 0, 2, 4, 6, 8 ], [ 1, 3, 5, 7 ] ]          // Very smooth and blurry
//rules = [ [ 0, 5, 8 ], [ 1, 4, 7 ] ]
//rules = [ [ 0, 1, 2, 3, 4, 5, 6, 7 ], [ 8 ] ]          // wavy 
//rules = [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 7, 8 ] ]          // wavy
//rules = [ [ 2, 3, 4, 5, 6, 7, 8 ], [ 0, 1 ] ] 
//rules = [ [ 0, 1, 5, 6, 7, 8 ], [ 2, 3, 4 ] ] 
//rules = [ [ 0 ], [ 0, 1, 4, 5, 7, 8 ] ]
//rules = [ [ 0 ], [ 0, 1, 4, 5, 7 ] ] // Dithering
//rules = [ [ 0 ], [ 0, 1, 4, 5 ] ] // Dithering
//rules = [ [ 0 ], [ 0, 1, 4 ] ] // Dithering with lines
//rules = [ [ 0 ], [ 3, 4 ] ] // Dithering with lines noisy
//rules = [ [ 0 ], [ 0, 1, 2, 3 ] ] // Dithering
//rules = [ [ 0 ], [ 0, 1, 2, 3, 7, 8 ] ] // Voronoi'ish
//rules = [ [ 0 ], [ 0, 1, 2, 3, 8 ] ] // Voronoi'ish
//rules = [ [ 0 ], [ 0, 1, 2, 3, 6, 7, 8 ] ] // Voronoi'ish
//rules = [ [ 0 ], [ 0, 1, 2, 3, 5, 6, 7, 8 ] ] // Blocky
//rules = [ [ 0, 1 ], [ 0, 1, 2, 3, 5, 6, 7, 8 ] ] // Pattern
//rules = [ [ 0 ], [ 0, 1, 3, 4 ] ] // Dithering with lines
//rules = [ [ 0 ], [ 0, 1, 2, 3, 4 ] ] // Dithering with lines
//rules = [ [ 0, 5, 7, 8 ], [ 0, 4 ] ]
//rules = [ [ 0, 5, 7, 8 ], [ 0, 3 ] ]
//rules = [ [ 0, 5, 7, 8 ], [  ] ] // lines
//rules = [ [ 0, 5, 6, 7, 8 ], [  ] ] // lines
//rules = [ [ 1, 2, 3, 4, 5, 6, 7, 8 ], [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ] // Slates
//rules = [ [ 1, 2, 3, 4, 5, 6, 7, 8 ], [ 0, 1, 2, 3, 4, 5, 6, 7 ] ] // Cloudy

const filterCanvas = document.createElement('canvas') as HTMLCanvasElement;
const filterCtx = filterCanvas.getContext('2d') as CanvasRenderingContext2D;
const displayDiv = document.getElementById('first_display') as HTMLDivElement;
filterCtx.getContextAttributes().willReadFrequently = true;

let filter = null;
let bornRuleDiv = null;
let surviveRuleDiv = null;

function generateDisplay(){
    const playButton = document.createElement('button') as HTMLButtonElement;
    playButton.onclick = () => newFilter();
    playButton.innerText = 'Apply Filter';

    const pauseButton = document.createElement('button') as HTMLButtonElement;
    pauseButton.onclick = () => { filter!.isPlaying = !filter!.isPlaying; }
    pauseButton.innerText = 'Pause';

    bornRuleDiv = document.createElement('div') as HTMLDivElement;
    bornRuleDiv.setAttribute('id', 'born_rule_div');

    for(let i = 0; i <= 8; i++){
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'checkbox');
        bornRuleDiv.appendChild(input);
    }

    surviveRuleDiv = document.createElement('div') as HTMLDivElement;
    surviveRuleDiv.setAttribute('id', 'survive_rule_div');

    for(let i = 0; i <= 8; i++){
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'checkbox');
        surviveRuleDiv.appendChild(input);
    }

    displayDiv.appendChild(playButton);
    displayDiv.appendChild(pauseButton);
    displayDiv.appendChild(bornRuleDiv);
    displayDiv.appendChild(surviveRuleDiv);
}

function newFilter() {
    filter = new Filter(bornRuleDiv!, surviveRuleDiv!);
    filter.startProcessing();
}

displayDiv.appendChild(filterCanvas);
generateDisplay();
newFilter();

/*
init();
*/
