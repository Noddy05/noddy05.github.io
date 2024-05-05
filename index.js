
var scrollByElementsHTML = document.getElementsByClassName("scroll-by");

//By https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
var scrollByElements = Array.prototype.slice.call(scrollByElementsHTML); 

//Hide all elements that should only appear when you scroll:
for(let i = 0; i < scrollByElements.length; i++){
    scrollByElements[i].classList.add("hidden")

    //Make sure the size isnt affected by the animation:
    let boundingRect = scrollByElements[i].getBoundingClientRect();
    scrollByElements[i].style.height = boundingRect.height + "px";
}

var currentlyTyping = 0;
document.addEventListener('scroll', (e) => {
    var scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop

    //Detect wether an element should be shown (Depends on the scrolling):
    for(let i = 0; i < scrollByElements.length; i++){
        if(screen.height / 2 >= scrollByElements[i].getBoundingClientRect().top){
            //Show element
            scrollByElements[i].classList.remove("hidden");
            scrollByElements[i].classList.add("visible");

            //Write out text:
            if(scrollByElements[i].nodeName == 'P'){
                let textInside = scrollByElements[i].innerHTML;
                scrollByElements[i].innerHTML = textInside[0];
                writeLetter(scrollByElements[i], textInside, 1, currentlyTyping + 1);
                currentlyTyping++;
            }

            //Remove from array
            scrollByElements.splice(i, 1);
        }
    }
});


function writeLetter(HTMLElement, totalText, currentLetterIndex, indexInArray){
    if(currentLetterIndex >= totalText.length)
        return;
    HTMLElement.innerHTML += totalText[currentLetterIndex++];
    if(currentlyTyping > indexInArray){
        HTMLElement.innerHTML = totalText;
        HTMLElement.style.animation="finishFast 1s";
        return;
    }
    setTimeout(function() { writeLetter(HTMLElement, totalText, currentLetterIndex, indexInArray) }, 15);
}


//Interactive projects - Maybe write a JSON file instead?
const interactiveProjects = [
    { 
        url: "./Interactive%20Pages/CellularAutometa/main.html", 
        title: "Cellular Autometa",
        description: "Ingen beskrivelse",
        thumbnail: "Files/maze2.png",
    },
    { 
        url: "./Interactive%20Pages/Maze/maze.html", 
        title: "Maze Generation",
        description: "Forskellige algoritmer (med justerbare parametre) til at danne labyrinter.",
        thumbnail: "Files/maze_bacteria.png",
    },
    { 
        url: "./Interactive%20Pages/Sorting/main.html", 
        title: "Sorting Algorithms",
        description: "Sammenligning af forskellige algoritmer til at sortere lister.",
        thumbnail: "Files/bubblesort.png",
    },
];

const leftProject  = document.getElementsByClassName("project left");
const mainProject  = document.getElementsByClassName("project main");
const rightProject = document.getElementsByClassName("project right");

let leftIndex = 0;
let mainIndex = 1;
let rightIndex = 2;
displayProjects();
function displayProjects(){

    leftProject[0].innerHTML = `
        <img src="${interactiveProjects[leftIndex].thumbnail}"><br>
        <h4>${interactiveProjects[leftIndex].title}</h4>
        <p>${interactiveProjects[leftIndex].description}</p>
    `;
    leftProject[0].href = interactiveProjects[leftIndex].url;

    mainProject[0].innerHTML = `
        <img src="${interactiveProjects[mainIndex].thumbnail}"><br>
        <h4>${interactiveProjects[mainIndex].title}</h4>
        <p>${interactiveProjects[mainIndex].description}</p>
    `;
    mainProject[0].href = interactiveProjects[mainIndex].url;

    rightProject[0].innerHTML = `
        <img src="${interactiveProjects[rightIndex].thumbnail}"><br>
        <h4>${interactiveProjects[rightIndex].title}</h4>
        <p>${interactiveProjects[rightIndex].description}</p>
    `;
    rightProject[0].href = interactiveProjects[rightIndex].url;
}

function moveProjects(increment){
    leftIndex  += increment;
    mainIndex  += increment;
    rightIndex += increment;

    //Loop back around:
    leftIndex  = (leftIndex  + interactiveProjects.length) % interactiveProjects.length;
    mainIndex  = (mainIndex  + interactiveProjects.length) % interactiveProjects.length;
    rightIndex = (rightIndex + interactiveProjects.length) % interactiveProjects.length;
    displayProjects();
}