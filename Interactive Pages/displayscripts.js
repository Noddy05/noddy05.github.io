
var codeElementsHTML = document.getElementsByClassName("insert-code");
var codeElements = Array.prototype.slice.call(codeElementsHTML); 

insertCode();
async function insertCode(){
    for(let i = 0; i < codeElements.length; i++){
        display(`https://noddy05.github.io/Interactive%20Pages/${codeElements[i].id}.js`, codeElements[i].id, function() {
            loadPrismFunc();
        });
    }
}

function display(inputPath, outputId, callback){
    let outputPath = document.getElementById(outputId);
    outputPath.innerHTML = 'JS is loading...';

    //https://stackoverflow.com/questions/74567439/read-response-from-httprequest-in-javascript
    const xhr = new XMLHttpRequest();
    xhr.open("GET", inputPath);
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            outputPath.innerHTML = "<pre><code class='language-js'>" + data + "</code></pre>";
            console.log(data);
        } else {
            outputPath.innerHTML = `Error: ${xhr.status}`;
        }
        callback();
    };
}

