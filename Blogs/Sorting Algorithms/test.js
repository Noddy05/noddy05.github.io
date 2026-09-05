console.log("working");
console.log("asd");

onmessage = function (event) {
    console.log("Message received from main script");
    const message = event.data;
    console.log("Message content:", message);
    postMessage("Hello from worker!");
}