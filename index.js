
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
