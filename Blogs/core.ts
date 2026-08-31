

async function sleepFor(time: number){
    if(time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}