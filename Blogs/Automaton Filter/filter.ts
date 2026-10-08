class Layer {
    bornRule: number[];
    survivalRule: number[];

    img!: ImageData;     // RGBA bytes, 4 per pixel
    data!: Uint8Array;   // indexed [y * width + x]
    width!: number;
    height!: number;

    constructor(bornRule: number[], survivalRule: number[]) {
        this.bornRule = bornRule;
        this.survivalRule = survivalRule;
    }

    // Draws image to canvas and returns the image element
    async drawImage(imagePath: string): Promise<HTMLImageElement> 
        {
        const image = new Image();
        image.src = imagePath;
        await image.decode();

        filterCanvas.width = image.width;
        filterCanvas.height = image.height;
        filterCtx.drawImage(image, 0, 0);

        return image;
    }

    // Loads image data, and creates an alive/dead mask based off luminance
    async copyImage(imagePath: string): Promise<void> {
        if (!filterCtx) throw new Error("2D canvas context not available");

        const image = await this.drawImage(imagePath);

        this.img = filterCtx.getImageData(0, 0, image.width, image.height);
        this.width = image.width;
        this.height = image.height;

        this.data = new Uint8Array(this.width * this.height);
        for (let i = 0; i < this.data.length; i++) {
            const r = this.img.data[4 * i];
            const g = this.img.data[4 * i + 1];
            const b = this.img.data[4 * i + 2];
            // Light level between 0 and 1:
            const lightLevel = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            this.data[i] = Math.round(lightLevel);
        }
    }

    // Draws the image to the canvas
    drawImageToCanvas(): void {
        filterCtx.putImageData(this.img, 0, 0);
    }

    // Returns true if (x, y) is not inside the bounds of the image
    isOutsideBounds(x: number, y: number): boolean {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    // Returns true if a cell is alive in the next iteration, and false otherwise
    iterateCell(x: number, y: number, prev: Layer): boolean {
        let numLivingCells = 0;
        let numDeadCells = 0;
        const livingColor: number[] = [0, 0, 0];
        const deadColor: number[] = [0, 0, 0];

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if ((dx === 0 && dy === 0) || prev.isOutsideBounds(x + dx, y + dy)) {
                    continue;
                }

                const i = (y + dy) * prev.width + (x + dx);
                let target: number[];

                if (prev.data[i]) {
                    numLivingCells++;
                    target = livingColor;
                } else {
                    numDeadCells++;
                    target = deadColor;
                }

                for (let c = 0; c < 3; c++) {
                    target[c] += prev.img.data[4 * i + c];
                }
            }
        }

        const wasAlive = prev.data[y * prev.width + x] === 1;
        const rule = wasAlive ? this.survivalRule : this.bornRule;
        const isAlive = rule.includes(numLivingCells);

        if (isAlive !== wasAlive) {
            const i = 4 * (y * this.width + x);
            if (isAlive && numLivingCells > 0) {
                for (let c = 0; c < 3; c++) {
                    this.img.data[i + c] = Math.floor(livingColor[c] / numLivingCells);
                }
            } else if (!isAlive && numDeadCells > 0) {
                for (let c = 0; c < 3; c++) {
                    this.img.data[i + c] = Math.floor(deadColor[c] / numDeadCells);
                }
            }
        }

        return isAlive;
    }

    iterateLayer(prev: Layer): void {
        this.img.data.set(prev.img.data); // unchanged cells keep prev's color
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.data[y * this.width + x] = this.iterateCell(x, y, prev) ? 1 : 0;
            }
        }
    }
}