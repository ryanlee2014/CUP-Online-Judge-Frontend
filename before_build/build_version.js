const fs = require("fs");
const packageFile = require("../package.json");
fs.writeFileSync("public/VERSION", packageFile.version);
