"use strict";
class Filter {
    constructor(bornRuleDiv, surviveRuleDiv) {
        this.rules = [[], []];
        this.layer = new Layer(...this.rules);
        this.otherLayer = new Layer(...this.rules);
        this.isPlaying = false;
        this.hasLoaded = false;
        this.bornRuleDiv = bornRuleDiv;
        this.surviveRuleDiv = surviveRuleDiv;
        this.parseRules();
        this.filterIndex = ++iterationIndex;
        this.loadImage("tiger-downscaled.png");
    }
    parseRules() {
        for (let i = 0; i <= 8; i++) {
            if (this.bornRuleDiv.children[i].checked)
                this.rules[0].push(i);
            if (this.surviveRuleDiv.children[i].checked)
                this.rules[1].push(i);
        }
    }
    async loadImage(image_path) {
        await this.layer.copyImage(image_path);
        await this.otherLayer.copyImage(image_path);
        this.hasLoaded = true;
        this.layer.drawImageToCanvas();
    }
    async startProcessing() {
        this.isPlaying = true;
        while (this.filterIndex == iterationIndex) {
            if (this.isPlaying && this.hasLoaded) {
                this.otherLayer.iterateLayer(this.layer);
                // Swap layers, such that the new layer becomes the old, and vice versa
                [this.layer, this.otherLayer] = [this.otherLayer, this.layer];
                this.layer.drawImageToCanvas();
            }
            await sleepFor(1);
        }
    }
}
