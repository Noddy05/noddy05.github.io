"use strict";
// vibe coded, to port from python to ts
async function main() {
    const rules = [[0, 1, 7, 8], [3, 5]];
    let layer = new Layer(...rules);
    await layer.copy_image("forbandet_ungdom.png");
    let otherLayer = new Layer(...rules);
    await otherLayer.copy_image("forbandet_ungdom.png");
    for (let i = 0; i < 12; i++) {
        otherLayer.iterate_layer(layer);
        [layer, otherLayer] = [otherLayer, layer];
    }
    const canvas = document.getElementById("output");
    layer.to_image(canvas);
}
main();
