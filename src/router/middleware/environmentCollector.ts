import Axios from "axios";
import store from "@/store";
import _ from "lodash";
const platform = require("platform");

function trimMinorVersion (version: string) {
    return version.split(".")[0];
}

export default function () {
    const osName = platform.os.family;
    const osVersion = platform.os.version;
    const browserName = platform.name;
    const browserVersion = trimMinorVersion(platform.version);
    const PlatformInfo = {
        os_name: osName,
        os_version: osVersion,
        browser_name: browserName,
        browser_version: browserVersion
    };
    let storePlatformInfo;
    try {
        storePlatformInfo = JSON.parse(localStorage.platformInfo);
    }
    catch (e) {
        storePlatformInfo = {};
    }

    if (!_.isEqual(PlatformInfo, storePlatformInfo) && store.getters.logined) {
        Axios.post("/api/env/client", PlatformInfo)
            .then(({ data }) => {
                if (data.status !== "OK") {
                    console.error("Error occur while post system config");
                }
                else {
                    localStorage.platformInfo = JSON.stringify(PlatformInfo);
                }
            })
            .catch(({ data }) => {
                console.error("Error occur while post system config");
            });
    }
}
