import { readdirSync, writeFileSync } from "fs";
import path from "path";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const pagesDir = path.resolve("src/app/pages");
const files = readdirSync(pagesDir)
    .filter((f) => f.endsWith(".tsx") && f.toLowerCase() !== "index.tsx");

const exports = files
    .map((f) => {
        const base = path.basename(f, ".tsx");
        return `export {${capitalizeFirstLetter(base)}} from "./${base}";`;
    })
    .join("\n")

const outputPath = path.join(pagesDir, "index.ts");
writeFileSync(outputPath, exports + "\n");

console.log("✅ pages/index.ts generated successfully:");
