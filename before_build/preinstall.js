const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function removeDist() {
    const distPath = path.resolve(__dirname, "..", "dist");
    if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
    }
}

function stripGoogleFontsImport() {
    const cssPath = path.resolve(__dirname, "..", "semantic", "semantic-ui", "semantic.css");
    if (!fs.existsSync(cssPath)) {
        return;
    }
    try {
        fs.accessSync(cssPath, fs.constants.W_OK);
    }
    catch (err) {
        console.warn("[preinstall] skip semantic.css update (no write access)");
        return;
    }
    const importLine = "@import url('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin&display=swap')";
    let css = "";
    try {
        css = fs.readFileSync(cssPath, "utf8");
    }
    catch (err) {
        console.warn("[preinstall] skip semantic.css read:", err && err.message ? err.message : err);
        return;
    }
    if (!css.includes(importLine)) {
        css = fixBrokenContentStrings(css);
        fs.writeFileSync(cssPath, css, "utf8");
        return;
    }
    const updated = css.split(importLine).join("/* removed */\n");
    const fixed = fixBrokenContentStrings(updated);
    try {
        fs.chmodSync(cssPath, 0o666);
    }
    catch (err) {
        // ignore permission error and try write anyway
    }
    try {
        fs.writeFileSync(cssPath, fixed, "utf8");
    }
    catch (err) {
        // If file is read-only in CI, skip instead of failing the build.
        console.warn("[preinstall] skip semantic.css update:", err && err.message ? err.message : err);
    }
}

function fixBrokenContentStrings(css) {
    // Replace malformed list bullet content from bad encoding.
    return css.replace(/content:'[^']*?left:-1em/g, "content:'\\2022';left:-1em");
}

function buildVersion() {
    execSync("node before_build/build_version.js", { stdio: "inherit" });
}

removeDist();
stripGoogleFontsImport();
buildVersion();
