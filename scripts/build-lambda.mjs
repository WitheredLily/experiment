import { execSync } from "child_process";
import { mkdirSync, rmSync, existsSync, readdirSync, copyFileSync, lstatSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const ROOT_DIR = join(__dirname, "..");
const BUILD_LAMBDA = join(ROOT_DIR, "build-lambda");
const SERVER_SRC = join(ROOT_DIR, "server.ts");
const NODE_MODULES = join(ROOT_DIR, "node_modules");
const REACT_BUILD = join(ROOT_DIR, "build");

// Recursive copy function
function copyDir(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = lstatSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    }
    else if (stat.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Clean previous Lambda build
rmSync(BUILD_LAMBDA, { recursive: true, force: true });
mkdirSync(BUILD_LAMBDA, { recursive: true });

// 2. Compile server.ts
console.log("Compiling server.ts...");
execSync(`tsc ${SERVER_SRC} --outDir ${BUILD_LAMBDA} --module CommonJS --target ES2020`, { stdio: "inherit" });

// 3. Copy node_modules
console.log("Copying node_modules...");
const modulesToCopy = ["express", "@vendia/serverless-express"];
for (const mod of modulesToCopy) {
  copyDir(join(NODE_MODULES, mod), join(BUILD_LAMBDA, "node_modules", mod));
}

// 4. Copy React build folder
console.log("Copying React build folder...");
copyDir(REACT_BUILD, join(BUILD_LAMBDA, "build"));

console.log("Lambda build completed at build-lambda/");
