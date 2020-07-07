import { ISystemState } from "@/store/system/system";

const states: ISystemState = {
    contestMode: false,
    init: true,
    darkMode: false,
    languageServerUrl: localStorage.getItem("languageServerUrl") || `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}`
};

export default states;
