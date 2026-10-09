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
//rules = [ [ 0 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1, 2 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1, 2, 3 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy flickering
//rules = [ [ 0, 1, 2, 6 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1, 2, 6, 7 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
//rules = [ [ 0, 1, 2, 6, 7, 8 ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy
let rules = [ [ 0, 1, 2, ], [ 1, 2, 3, 4, 5, 8 ] ] // Algorithmy


// Game of life'y: let the survival rule be [1, 2, ..., 6, 8] (anything but 7)

// Algorithm rules:
// B02358/S1234568
// B0/S123458
// B01/S123458
// B012/S123458
// B0123/S123458
// B01234/S123458
// B0126/S123458
// B01267/S123458
// B012678/S123458
// B0123/S123578
// B0123/S12358
// B17/S012345678
// B1/S012345678
// B12/S012345678
// B17/S124568
// B178/S124568
// B1678/S124568
// B1678/S12458
// B1678/S12458
// B1678/S124578
// B1678/S12478
// B1678/S124678
// B1678/S12578
// Subtle algorithm rules:
// B178/S1245678
// B0123/S12357
// B0124/S12357
// B0126/S12357

// Interesting:
// B12345678/S012345678 <- Block-art ish
// B01678/S12578 <- Blury mess
// B01678/S125678 <- Interesting expansion

//Clody noisy dither
// B1234568/S01234567
// B12345678/S01234567
// B01678/S1246
// B01678/S12467
// B01678/S124567
// B01678/S12367
// B01678/S123567
// B01678/S012367
// B01678/S0123567

// Spots
// B05678/S0123456
// B05678/S01234568
// B0568/S01234568
// B0568/S01234568
// B17/S145678





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
        if(rules[0].includes(i))
            input.setAttribute('checked', 'true');
        bornRuleDiv.appendChild(input);
    }

    surviveRuleDiv = document.createElement('div') as HTMLDivElement;
    surviveRuleDiv.setAttribute('id', 'survive_rule_div');

    for(let i = 0; i <= 8; i++){
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'checkbox');
        if(rules[1].includes(i))
            input.setAttribute('checked', 'true');
        surviveRuleDiv.appendChild(input);
    }

    displayDiv.appendChild(playButton);
    displayDiv.appendChild(pauseButton);
    displayDiv.appendChild(bornRuleDiv);
    displayDiv.appendChild(surviveRuleDiv);
}

function newFilter() {
    let path = 'forbandet_ungdom_downscaled.png';
    path = 'tiger-downscaled.png';

    filter = new Filter(path, bornRuleDiv!, surviveRuleDiv!);
    filter.startProcessing();
}

displayDiv.appendChild(filterCanvas);
generateDisplay();
newFilter();

/*
init();
*/
