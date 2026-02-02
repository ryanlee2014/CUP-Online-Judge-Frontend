const fs = require("fs");
const path = require("path");
const os = require("os");
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
    return new Promise((resolve, reject) => {
        zlib.gzip(data, { level: 9 }, (err, buf) => {
            if (err) return reject(err);
            fs.writeFile(gzPath, buf, err2 => (err2 ? reject(err2) : resolve()));
        });
    });
}

function brotliFile(filePath, data) {
    const brPath = `${filePath}.br`;
    return new Promise((resolve, reject) => {
        zlib.brotliCompress(data, {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11
            }
        }, (err, buf) => {
            if (err) return reject(err);
            fs.writeFile(brPath, buf, err2 => (err2 ? reject(err2) : resolve()));
        });
    });
}

async function compressFile(filePath) {
    const data = await fs.promises.readFile(filePath);
    await gzipFile(filePath, data);
    await brotliFile(filePath, data);
}

async function runWithConcurrency(items, limit, worker) {
    let index = 0;
    let active = 0;
    return new Promise((resolve, reject) => {
        const next = () => {
            if (index >= items.length && active === 0) {
                return resolve();
            }
            while (active < limit && index < items.length) {
                const item = items[index++];
                active += 1;
                Promise.resolve(worker(item))
                    .then(() => {
                        active -= 1;
                        next();
                    })
                    .catch(reject);
            }
        };
        next();
    });
}

async function main() {
    if (!fs.existsSync(distDir)) {
        console.warn("[compress] dist directory missing; skip");
        return;
    }
    const start = Date.now();
    let count = 0;
    const files = walk(distDir).filter(shouldCompress);
    const cpuCount = Math.max(1, os.cpus().length);
    const concurrency = Math.max(1, Math.min(cpuCount, parseInt(process.env.COMPRESS_CONCURRENCY || "", 10) || cpuCount));
    await runWithConcurrency(files, concurrency, async file => {
        await compressFile(file);
        count += 1;
    });
    const duration = Math.round((Date.now() - start) / 1000);
    console.log(`[compress] processed ${count} files in ${duration}s (concurrency=${concurrency})`);
}

main().catch(err => {
    console.error("[compress] failed:", err && err.message ? err.message : err);
    process.exit(1);
});
