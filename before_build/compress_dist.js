const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const distDir = path.resolve(__dirname, "..", "dist");
const exts = new Set([
    ".js",
    ".css",
    ".json",
    ".txt",
    ".html",
    ".eot",
    ".woff",
    ".woff2",
    ".ttf"
]);

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, files);
        }
        else {
            files.push(fullPath);
        }
    }
    return files;
}

function shouldCompress(filePath) {
    if (filePath.endsWith(".gz") || filePath.endsWith(".br")) {
        return false;
    }
    return exts.has(path.extname(filePath));
}

function gzipFile(filePath, data) {
    const gzPath = `${filePath}.gz`;
    const gz = zlib.gzipSync(data, { level: 9 });
    fs.writeFileSync(gzPath, gz);
}

function brotliFile(filePath, data) {
    const brPath = `${filePath}.br`;
    const br = zlib.brotliCompressSync(data, {
        params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11
        }
    });
    fs.writeFileSync(brPath, br);
}

function main() {
    if (!fs.existsSync(distDir)) {
        console.warn("[compress] dist directory missing; skip");
        return;
    }
    const start = Date.now();
    let count = 0;
    const files = walk(distDir).filter(shouldCompress);
    for (const file of files) {
        const data = fs.readFileSync(file);
        gzipFile(file, data);
        brotliFile(file, data);
        count += 1;
    }
    const duration = Math.round((Date.now() - start) / 1000);
    console.log(`[compress] processed ${count} files in ${duration}s`);
}

main();
