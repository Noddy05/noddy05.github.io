

const tableOfContents = document.getElementById("table-of-contents");
const pageTitle = document.getElementsByTagName("h1")[0];
const headers = [[]];
headers[0] = document.getElementsByTagName("h2");
headers[1] = document.getElementsByTagName("h3");
headers[2] = document.getElementsByTagName("h4");

function addHeader2(index){
    const listItem = document.createElement("li");
    listItem.innerHTML = header2s[index].innerHTML;
    tableOfContents.appendChild(listItem);
}

function addHeader3(index){
    const listItem = document.createElement("ul");
    listItem.innerHTML = "<li>" + header3s[index].innerHTML + "</li>";
    tableOfContents.appendChild(listItem);
}

addHeaders();
function addHeaders(){
    tableOfContents.innerHTML = "";

    //Setup cursors
    var cursors = [];
    //This cursor resets after a new header to the current header appears. So it goes 1.1, 1.2, 2.1 (<- Reset)...
    var resetCursors = [];
    for(let i = 0; i < headers.length; i++){
        cursors[i] = 0;
        resetCursors[i] = 0;
    }

    //Add header
    const header = document.createElement("h3");
    var tableOfContentsHeader = pageTitle.innerHTML + " - Table of contents";
    header.innerHTML = tableOfContentsHeader;
    tableOfContents.appendChild(header);

    while(true){
        //Find the next header to render:
        let lowestHeight;
        let lowestIndex = -1;
        for(let i = 0; i < headers.length; i++){
            //Make sure we dont include the table of contents header:
            if(headers[i][cursors[i]] == header){
                cursors[i]++;
                i--;
                continue;
            }
            
            if(cursors[i] >= headers[i].length)
                continue;
            let height = headers[i][cursors[i]].getBoundingClientRect().top;
            if(height < lowestHeight || lowestIndex == -1){
                lowestHeight = height;
                lowestIndex = i;
            }
        }
        //If none found: break out
        if(lowestIndex == -1)
            break;
        
        //Add to list:
        const listItem = document.createElement("li");
        let headerText = headers[lowestIndex][cursors[lowestIndex]].innerHTML;
        let headerNoWhitespace = headerText.replace(/\s/g,'');
        
        let headerNumber = "";
        resetCursors[lowestIndex]++;
        for(let i = 0; i <= lowestIndex; i++){
            headerNumber += resetCursors[i] + ".";
        }
        for(let i = headers.length; i > lowestIndex; i--){
            resetCursors[i] = 0;
        }
        
        headers[lowestIndex][cursors[lowestIndex]].innerHTML = `${headerNumber} ${headerText}`;
        headers[lowestIndex][cursors[lowestIndex]].id = headerNoWhitespace;
        listItem.innerHTML = `<a href=#${headerNoWhitespace}>${headerNumber} ${headerText}</a>`;
        listItem.classList = "contents " + "i" + lowestIndex;
        tableOfContents.appendChild(listItem);
        cursors[lowestIndex]++;
    }
}

const sortingObjects = new Map();
const sortingObject = {
    //For drawing:
    delay: 150,
    ctx: null,
    loopIndex: 0,
    //Array generation:
    entries: 50,
    array: [],
}

//Generate figures
const figures = document.getElementsByClassName('display');
for(let i = 0; i < figures.length; i++){
    let sortingAlgorithm = figures[i].classList[1];
    figures[i].innerHTML= `
        <canvas id="${sortingAlgorithm}" class="display-sort" width="300" height="300"></canvas>
        <br>
        <button onclick="${sortingAlgorithm}Visual(${sortingAlgorithm}Obj);">Sort Array</button>
        <button onclick="unsortArray(${sortingAlgorithm}Obj);">Unsort Array</button>
        <br>

        <div>
            <span>Entries: </span>
            <span id="${sortingAlgorithm}-entries-display"></span>
        </div>
        <input id="${sortingAlgorithm}-entries" type="range" min="5" max="100" value="20">
        <br>
        
        <div>
            <span>Time between iterations: </span>
            <span id="${sortingAlgorithm}-delay-display"></span>
        </div>
        <input id="${sortingAlgorithm}-delay" type="range" min="0" max="1000" value="150">`;
    const delaySlider = document.getElementById(`${sortingAlgorithm}-delay`);
    const delayDisplay = document.getElementById(`${sortingAlgorithm}-delay-display`);
    const entriesSlider = document.getElementById(`${sortingAlgorithm}-entries`);
    const entriesDisplay = document.getElementById(`${sortingAlgorithm}-entries-display`);
    
    delayDisplay.innerHTML = delaySlider.value + "ms";
    sortingObject.delay = delaySlider.value;
    delaySlider.addEventListener('input', function() { 
        sortingObjects.get(sortingAlgorithm).delay = delaySlider.value;
        delayDisplay.innerHTML = delaySlider.value + "ms";
    });
    entriesDisplay.innerHTML = entriesSlider.value;
    sortingObject.entries = entriesSlider.value;
    entriesSlider.addEventListener('input', function() { 
        const sortingObject = sortingObjects.get(sortingAlgorithm);
        sortingObject.entries = entriesSlider.value;
        unsortArray(sortingObject);
        entriesDisplay.innerHTML = sortingObject.entries;
    });
}