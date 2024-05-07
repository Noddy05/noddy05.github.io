
const codeElements = Array.prototype.slice.call(document.getElementsByClassName("insert-code"));
const codeSnippets = Array.prototype.slice.call(document.getElementsByClassName("code-snippet"));
var prismStyleSheet;
readFromFile("https://noddy05.github.io/Interactive%20Pages/prism.css", function(data) {prismStyleSheet = data})
var importedCode = new Map(); 

insertCode(0);
function insertCode(i){
    if(i >= codeElements.length){
        insertCodeSnippets();
        return;
    }
    display(`https://noddy05.github.io/Interactive%20Pages/${codeElements[i].id}.js`, codeElements[i].id, function() {
        insertCode(i + 1);
    });
}
function insertCodeSnippets(){
    for(let i = 0; i < codeSnippets.length; i++){
        let fromLine = Number(codeSnippets[i].classList[1]);
        let toLine = Number(codeSnippets[i].classList[2]);
        let imported = importedCode.get(codeSnippets[i].id);
        let startIndex = -1;
        let endIndex = imported.length - 1;
        let lineCounter = 1;
        for(let c = 0; c < imported.length; c++){
            if(lineCounter >= fromLine && startIndex == -1)
                startIndex = c;
            if(lineCounter > toLine){
                endIndex = c;
                break;
            }
            if(imported[c] == '\n'){
                lineCounter++;
            }
        }

        codeSnippets[i].innerHTML = formatCode(imported.substring(startIndex, endIndex)) 
            + `<button class='expand-button' onclick='popupWindow("${codeSnippets[i].id}")'>View source...</button>`;
    }
    loadPrismFunc();
}

async function popupWindow(id){
    var myWindow = await window.open("", `Code for ${id}.js`, `width=${window.innerWidth / 2},height=${window.innerHeight / 2}`);
    myWindow.document.write(document.getElementById(id).innerHTML);
    var styleSheet = document.createElement("style");
    styleSheet.innerText = prismStyleSheet;
    myWindow.document.head.appendChild(styleSheet);
    var title = document.createElement("title");
    title.innerText = `Code for ${id}.js`;
    myWindow.document.head.appendChild(title);
}

function expandCode(id){
    console.log(id);
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('visible');
}

function display(inputPath, outputId, callback){
    let outputPath = document.getElementById(outputId);
    outputPath.innerHTML = 'JS is loading...';

    readFromFile(inputPath, function(data){
        outputPath.innerHTML = formatCode(data);
        importedCode.set(outputId, data);
        outputPath.classList.add("hidden");
        callback();
    });
}

function readFromFile(path, callback){
    //https://stackoverflow.com/questions/74567439/read-response-from-httprequest-in-javascript
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path);
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            callback(data);
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
}

function formatCode(code){
    return "<pre><code class='language-js'>" + code + "</code></pre>";
}

