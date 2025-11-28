import { Grid, rowsToGrid } from "../game/nonogram"; // adjust path

/**
 * Convert an image to a Nonogram puzzle.
 * @param imageSrc - URL or base64 string of an image
 * @param width - number of columns in the resulting puzzle
 * @param height - number of rows in the resulting puzzle
 * @param id - unique id for the nonogram
 * @param threshold - grayscale threshold [0–255]
 */
export async function imageToNonogram(
    imageSrc: string,
    width: number,
    height: number,
    id: string,
    threshold: number = 150
): Promise<Grid> {
    const img = await loadImage(imageSrc);

    // Draw to canvas and resize
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;

    // Convert to boolean matrix
    const grid: boolean[][] = [];
    for (let x = 0; x < height; x++) {
        const col: boolean[] = [];
        for (let y = 0; y < width; y++) {
            const i = (y * width + x) * 4;
            const [r, g, b, a] = [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
            const grayscale = r + g + b;
            col.push(grayscale < threshold && a > 0);
        }
        grid.push(col);
    }
    return rowsToGrid(grid, id);
}

/** Helper: load an image into an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

