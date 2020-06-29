export default class Version {
    private readonly majorVersion: number;
    private readonly minorVersion: number;
    private readonly patchVersion: number;
    private readonly stage: string;
    private readonly stageVersion: number;
    constructor (version: string) {
        const versionArray = version.trim().split(".");
        if (versionArray.length !== 3) {
            throw new Error("version should contains 3 parts.");
        }
        versionArray.forEach(e => {
            if (isNaN(parseInt(e))) {
                throw new Error("version code should be numeric");
            }
        });
        this.majorVersion = parseInt(versionArray[0]);
        this.minorVersion = parseInt(versionArray[1]);
        const patchVersion = parseInt(versionArray[2]);
        if (patchVersion.toString() !== versionArray[2]) {
            console.log(versionArray[2], version);
            const patchArray = versionArray[2].split("-");
            const patchVersion = parseInt(patchArray[0]);
            const stage = patchArray[1];
            const stageVersion = parseInt(patchArray[2]);
            this.patchVersion = patchVersion;
            this.stage = stage;
            this.stageVersion = stageVersion;
        }
        else {
            this.patchVersion = patchVersion;
            this.stage = "release";
            this.stageVersion = 0;
        }
    }

    lesserThan (version: Version) {
        if (this.majorVersion < version.majorVersion) {
            return true;
        }
        if (this.majorVersion > version.majorVersion) {
            return false;
        }
        if (this.minorVersion < version.minorVersion) {
            return true;
        }
        if (this.minorVersion > version.minorVersion) {
            return false;
        }
        if (this.patchVersion < version.patchVersion) {
            return true;
        }
        if (this.patchVersion > version.patchVersion) {
            return false;
        }
        if (Version.stageLevel(this.stage) < Version.stageLevel(version.stage)) {
            return true;
        }
        if (Version.stageLevel(this.stage) > Version.stageLevel(version.stage)) {
            return false;
        }
        else return this.stageVersion < version.stageVersion;
    }

    greaterThan (version: Version) {
        return !this.lesserThan(version) && this.toString() !== version.toString();
    }

    toString () {
        return `${this.majorVersion}.${this.minorVersion}.${this.patchVersion}`;
    }

    static LesserComparator (version1: Version, version2: Version) {
        if (version1.majorVersion !== version2.majorVersion) {
            return version1.majorVersion - version2.majorVersion;
        }
        else if (version1.minorVersion !== version2.minorVersion) {
            return version1.minorVersion - version2.minorVersion;
        }
        else if (version1.patchVersion !== version2.patchVersion) {
            return version1.patchVersion - version2.patchVersion;
        }
        else if (version1.stage !== version2.stage) {
            return this.stageLevel(version1.stage) - this.stageLevel(version2.stage);
        }
        else {
            return version1.stageVersion - version2.stageVersion;
        }
    }

    static greaterComparator (version1: Version, version2: Version) {
        return -this.LesserComparator(version1, version2);
    }

    static stageLevel (stage: string) {
        switch (stage) {
        case "alpha":
            return 1;
        case "beta":
            return 2;
        case "ppe":
            return 3;
        case "release":
            return 4;
        default:
            return 0;
        }
    }
}
