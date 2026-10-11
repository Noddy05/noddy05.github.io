"use strict";
class Filter {
    constructor(imagePath, bornRuleDiv, surviveRuleDiv, maskPath) {
        this.rules = [[], []];
        this.layer = new Layer(...this.rules);
        this.otherLayer = new Layer(...this.rules);
        this.isPlaying = false;
        this.hasLoaded = false;
        this.bornRuleDiv = bornRuleDiv;
        this.surviveRuleDiv = surviveRuleDiv;
        this.parseRules();
        this.filterIndex = ++iterationIndex;
        if (maskPath == null)
            this.loadImage(imagePath);
        else
            this.loadImageAndMask(imagePath, maskPath);
    }
    parseRules() {
        for (let i = 0; i <= 8; i++) {
            if (this.bornRuleDiv.children[i].checked)
                this.rules[0].push(i);
            if (this.surviveRuleDiv.children[i].checked)
                this.rules[1].push(i);
        }
    }
    async loadImage(imagePath) {
        await this.layer.copyImage(imagePath);
        await this.otherLayer.copyImage(imagePath);
        this.hasLoaded = true;
        this.layer.drawImageToCanvas();
    }
    async loadImageAndMask(imagePath, maskPath) {
        await this.layer.copyImageAndMask(imagePath, maskPath);
        await this.otherLayer.copyImageAndMask(imagePath, maskPath);
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
