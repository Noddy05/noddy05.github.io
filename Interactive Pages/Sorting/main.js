
const sortingObjects = new Map();

const sortingObject = {
    //Til at tegne array'et:
    delay: 150,
    ctx: null,
    loopIndex: 0,
    //For at oprette og sortere array'et:
    entries: 50,
    array: [],
}

const unsortedObj = Object.create(sortingObject);

const unsortedCanvas = document.getElementById('unsorted-canvas');
unsortedCanvas.width = 1000;
unsortedCanvas.height = 1000;

unsortedObj.ctx = unsortedCanvas.getContext('2d');

//We define a variable called swap, so we can access this function in other scripts
function swap(array, indexA, indexB){
    let temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
}

unsortedObj.array = generateArray(unsortedObj.entries);
function generateArray(size){
    //Firstly, generated a sorted array with the specified size:
    let outputArray = [];
    for(let i = 0; i < size; i++){
        outputArray[i] = i + 1;
    }

    //Now randomly unsort the array:
    randomlyUnsortArray(outputArray, size);
    return outputArray;
}

//This function randomly unsorts an array by swapping elements around
function randomlyUnsortArray(array){
    for(let i = 0; i < array.length * 2; i++){
        //Swap with a random element in the array:
        swap(array, i % array.length, Math.floor(Math.random() * array.length));
    }
}

function drawElement(sortingObject, index, color){
    let canvas = sortingObject.ctx.canvas;

    //Vi ønsker at danne en ramme rundt om elementerne i array'et, så vi opretter en margin variabel.
    let margin = 10;
    //Vi ønsker også en lille afstand mellem hvert element:
    let spaceBetweenElements = canvas.width / sortingObject.array.length / 10;
    
    //Vi antager at max(array) = array.length, så ved vi at højden af et element skal være
    // array[i] / array.length * (højden af lærred - 2 * margin);
    let unitHeight = 1 / sortingObject.array.length;
    let height = sortingObject.array[index] * unitHeight * (canvas.height - 2 * margin);

    //Bredden er bare den mængde lærred vi kan tegne på (altså: bredde af lærred - 2 * margin)
    //delt med antallet af elementer der skal tegnes.
    let width = (canvas.width - 2 * margin) / sortingObject.array.length;
    
    //Vi kan nu vælge vores farve
    sortingObject.ctx.fillStyle = color;
    //Og tegne vores element
    sortingObject.ctx.fillRect(index * width + margin + spaceBetweenElements / 2, 
        canvas.height - height - margin, width - spaceBetweenElements, height);
}
function drawArray(sortingObject, selectedEntries){
    //Først maler vi baggrunden sort, så vi har et rent lærred at arbejde med:
    sortingObject.ctx.fillStyle = "black";
    sortingObject.ctx.fillRect(0, 0, sortingObject.ctx.canvas.width, sortingObject.ctx.canvas.height);
    
    //Nu går vi alle elementer igennem og tegner dem:
    for(let i = 0; i < sortingObject.array.length; i++){
        //Et element tegnes som udgangspunkt med hvid:
        let color = "white";

        //Vi tjekker om dette element er et af de markerede elementer defineret i 'selectedEntries'
        //Ved at tjekke alle elementer i selectedEntries kan vi tjekke om dette indeks 'i' er en af de markerede indekser.
        let isSelected = false;
        for(let j = 0; j < selectedEntries.length; j++){
            //Hvis dette indeks findes i selectedEntries stopper vi for-løkken og sætter 'isSelected' til 'true'
            if(selectedEntries[j] == i){
                isSelected = true;
                break;
            }
        }
        //Hvis vi fandt at dette indeks var markeret vil vi farve dette element grønt:
        if(isSelected)
            color = "green";
        
        //Til sidst tegner vi det individuelle element:
        drawElement(sortingObject, i, color);
    }
}
drawArray(unsortedObj, []);

//Sleep venter bare en given mængde af tid (medmindre varigheden er <= 0)
function sleep(duration){
    if(duration > 0)
        return new Promise(resolve => setTimeout(resolve, duration));
}
//En animation der skal vise at et array er sorteret!
async function finalizeArray(sortingObject){
    //Vi bruger denne variabel til at holde styr på om vi skal fortsætte igangværende animation:
    let loopIndex = ++sortingObject.loopIndex;

    for(let i = 0; i < sortingObject.entries; i++){
        //Hvis 'loopIndex' ændrede sig midt i animationen skal vi aflyse denne animation. 
        if(loopIndex != sortingObject.loopIndex)
            return;

        //Ellers tegner vi det næste element (farven sættes til at være en lys grøn: #20C020):
        drawElement(sortingObject, i, "#20C020");
        
        //Vent en tidsperiode før vi tegner næste element:
        await sleep(sortingObject.delay);
    }
}

function unsortArray(sortObject) {
    sortObject.loopIndex++;
    sortObject.selectedEntries = [];
    sortObject.array = generateArray(sortObject.entries);
    drawArray(sortObject, []);
}

async function drawThenSleep(sortingObject, selected, drawAlways){
    if(drawAlways || sortingObject.delay > 0)
        drawArray(sortingObject, selected);
    await sleep(sortingObject.delay);
}

//Til formatering af siden:
generateFigures();
