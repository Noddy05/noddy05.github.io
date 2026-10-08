class Filter {
    public rules: [number[], number[]] = [[ ], [ ]];
    public layer: Layer = new Layer(...this.rules);
    public otherLayer: Layer = new Layer(...this.rules);

    private bornRuleDiv: HTMLDivElement;
    private surviveRuleDiv: HTMLDivElement;
    
    public isPlaying = false;
    private filterIndex: Number;
    private hasLoaded = false;

    public constructor(bornRuleDiv: HTMLDivElement, surviveRuleDiv: HTMLDivElement){
        this.bornRuleDiv = bornRuleDiv;
        this.surviveRuleDiv = surviveRuleDiv;
        this.parseRules();

        this.filterIndex = ++iterationIndex;
        this.loadImage("tiger-downscaled.png");
    }

    private parseRules(){
        for(let i = 0; i <= 8; i++){
            if((this.bornRuleDiv.children[i] as HTMLInputElement).checked)
                this.rules[0].push(i);

            if((this.surviveRuleDiv.children[i] as HTMLInputElement).checked)
                this.rules[1].push(i);
        }
    }

    private async loadImage(image_path: string) {
        await this.layer.copyImage(image_path);
        await this.otherLayer.copyImage(image_path);
        this.hasLoaded = true;
        this.layer.drawImageToCanvas();
    }

    public async startProcessing(){
        this.isPlaying = true;

        while (this.filterIndex == iterationIndex) {
            if(this.isPlaying && this.hasLoaded){
                this.otherLayer.iterateLayer(this.layer);
                // Swap layers, such that the new layer becomes the old, and vice versa
                [this.layer, this.otherLayer] = [this.otherLayer, this.layer];
                this.layer.drawImageToCanvas();
            }
        
            await sleepFor(1);
        }
    }
}