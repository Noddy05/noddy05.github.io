



let outputPath = document.getElementById("mazescript");
display("", outputPath);
function display(inputPath, outputPath){
    outputPath.innerHTML = 'console.log("yes")';

    //https://stackoverflow.com/questions/74567439/read-response-from-httprequest-in-javascript
    const request = new XMLHttpRequest();
    console.log("yes 1!");
    request.open('POST', 'file:///C:/Users/noah0/Personal%20Website/Interactive%20Pages/mazegen.js');
    request.onreadystatechange = function() {
        console.log("yes 2!");
        if (this.readyState == 4 && this.status == 200) {
            console.log("yes 3!");
            document.getElementById("demo").innerHTML =
                this.responseText;
       }
    };
}

const xhr = new XMLHttpRequest();
xhr.open("GET", "https://noddy05.github.io/Interactive%20Pages/mazegen.js");
xhr.send();
xhr.responseType = "html";
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    const data = xhr.response;
    console.log(data);
  } else {
    console.log(`Error: ${xhr.status}`);
  }
};


