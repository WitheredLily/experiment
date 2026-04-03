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

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;

    const grid: boolean[][] = [];

    for (let row = 0; row < height; row++) {
        const rowData: boolean[] = [];

        for (let col = 0; col < width; col++) {
            const i = (row * width + col) * 4;

            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

            rowData.push(grayscale < threshold && a > 0);
        }

        grid.push(rowData);
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

