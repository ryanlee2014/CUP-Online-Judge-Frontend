const platform = require("platform");
import Axios from 'axios'
function trimMinorVersion(version) {
    return version.split(".")[0];
}
export default function () {
    const os_name = platform.os.family;
    const os_version = platform.os.version;
    const browser_name = platform.name;
    const browser_version = trimMinorVersion(platform.version);
    const PlatformInfo = {
        os_name,
        os_version,
        browser_name,
        browser_version
    };
    console.log(PlatformInfo);
}
