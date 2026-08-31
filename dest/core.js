"use strict";
async function sleepFor(time) {
    if (time > 0)
        return new Promise(resolve => setTimeout(resolve, time));
}
