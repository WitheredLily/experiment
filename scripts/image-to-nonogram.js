import { createCanvas, loadImage } from "canvas";

const imageURL = "https://pbs.twimg.com/media/EvL21fLXcAE5MaB.png";

export async function imageToNonogram(imageSrc, width, height, id, threshold = 150) {
    const img = await loadImage(imageSrc);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;

    const grid = [];

    for (let col = 0; col < width; col++) {
        const colData = [];
        for (let row = 0; row < height; row++) {
            const i = (row * width + col) * 4;
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
            colData.push(grayscale < threshold && a > 0);
        }
        grid.push(colData);
    }

    return grid;
}

const result = await imageToNonogram(imageURL, 16, 16, "test", 60);
console.log(result);

