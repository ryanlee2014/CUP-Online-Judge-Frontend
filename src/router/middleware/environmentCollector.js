import Axios from "axios";

const platform = require("platform");
const _ = require("lodash");

function trimMinorVersion (version) {
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
    let storePlatformInfo = {};
    try {
        storePlatformInfo = JSON.parse(localStorage.platformInfo);
    } catch (e) {
        storePlatformInfo = {};
    }

    if (!_.isEqual(PlatformInfo, storePlatformInfo)) {
        Axios.post("/api/env/client", PlatformInfo)
            .then(({ data }) => {
                if (data.status !== "OK") {
                    console.error("Error occur while post system config");
                } else {
                    localStorage.platformInfo = JSON.stringify(PlatformInfo);
                }
            });
    }
}
