class Layer {
    born_rule: number[];
    survival_rule: number[];

    img!: ImageData;     // RGBA bytes, 4 per pixel
    data!: Uint8Array;   // indexed [y * width + x]
    width!: number;
    height!: number;

    constructor(born_rule: number[], survival_rule: number[]) {
        this.born_rule = born_rule;
        this.survival_rule = survival_rule;
    }

    clear(): void {
        this.data.fill(0);
    }

    async copy_image(image_path: string): Promise<void> {
        const image = new Image();
        image.src = image_path;
        await image.decode();

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D canvas context not available");
        ctx.drawImage(image, 0, 0);

        this.img = ctx.getImageData(0, 0, image.width, image.height);
        this.width = image.width;
        this.height = image.height;

        this.data = new Uint8Array(this.width * this.height);
        for (let i = 0; i < this.data.length; i++) {
            const r = this.img.data[4 * i];
            const g = this.img.data[4 * i + 1];
            const b = this.img.data[4 * i + 2];
            const light_level = 0.299 * r + 0.587 * g + 0.114 * b; // same formula as PIL's "L"
            this.data[i] = Math.round(light_level / 255);
        }
    }

    to_image(canvas: HTMLCanvasElement): void {
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D canvas context not available");
        ctx.putImageData(this.img, 0, 0);
    }

    is_outside_bounds(x: number, y: number): boolean {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    iterate_cell(x: number, y: number, prev: Layer): boolean {
        let num_living_cells = 0;
        let num_dead_cells = 0;
        const living_color: number[] = [0, 0, 0];
        const dead_color: number[] = [0, 0, 0];

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if ((dx === 0 && dy === 0) || prev.is_outside_bounds(x + dx, y + dy)) {
                    continue;
                }

                const i = (y + dy) * prev.width + (x + dx);
                let target: number[];

                if (prev.data[i]) {
                    num_living_cells++;
                    target = living_color;
                } else {
                    num_dead_cells++;
                    target = dead_color;
                }

                for (let c = 0; c < 3; c++) {
                    target[c] += prev.img.data[4 * i + c];
                }
            }
        }

        const was_alive = prev.data[y * prev.width + x] === 1;
        const rule = was_alive ? this.survival_rule : this.born_rule;
        const is_alive = rule.includes(num_living_cells);

        if (is_alive !== was_alive) {
            const i = 4 * (y * this.width + x);
            if (is_alive && num_living_cells > 0) {
                for (let c = 0; c < 3; c++) {
                    this.img.data[i + c] = Math.floor(living_color[c] / num_living_cells);
                }
            } else if (!is_alive && num_dead_cells > 0) {
                for (let c = 0; c < 3; c++) {
                    this.img.data[i + c] = Math.floor(dead_color[c] / num_dead_cells);
                }
            }
        }

        return is_alive;
    }

    iterate_layer(prev: Layer): void {
        this.img.data.set(prev.img.data); // unchanged cells keep prev's color
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.data[y * this.width + x] = this.iterate_cell(x, y, prev) ? 1 : 0;
            }
        }
    }
}