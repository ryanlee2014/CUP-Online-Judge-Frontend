import { BODY_CLASS, DEFAULT_UI_MODE, UI_MODE_KEY, applyBodyClass, setUiMode, toggleUiMode, uiModeState } from "@/util/uiMode";

describe("uiMode", () => {
    beforeEach(() => {
        localStorage.clear();
        setUiMode(DEFAULT_UI_MODE);
    });

    it("defaults to the new interface and marks <body>", () => {
        expect(uiModeState.mode).toBe("arena");
        applyBodyClass();
        expect(document.body.classList.contains(BODY_CLASS)).toBe(true);
    });

    it("switches, persists and unmarks <body> for the classic interface", () => {
        setUiMode("classic");
        expect(uiModeState.mode).toBe("classic");
        expect(localStorage.getItem(UI_MODE_KEY)).toBe("classic");
        expect(document.body.classList.contains(BODY_CLASS)).toBe(false);
        expect(toggleUiMode()).toBe("arena");
        expect(localStorage.getItem(UI_MODE_KEY)).toBe("arena");
        expect(document.body.classList.contains(BODY_CLASS)).toBe(true);
    });
});
