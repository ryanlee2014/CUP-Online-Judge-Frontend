/**
 * New / classic interface switch. "arena" = 像素赛场 redesign, "classic" = the original Semantic UI pages.
 * Kept per browser in localStorage; <body> gets the class "pa-mode" while the new interface is on,
 * so the global skins (e.g. the top bar) can be scoped to it.
 */
import Vue from "vue";

export type UiMode = "arena" | "classic";

export const UI_MODE_KEY = "cupoj:ui-mode";
export const DEFAULT_UI_MODE: UiMode = "classic";
export const BODY_CLASS = "pa-mode";

function read (): UiMode {
    try {
        const v = localStorage.getItem(UI_MODE_KEY);
        return v === "classic" || v === "arena" ? v : DEFAULT_UI_MODE;
    }
    catch (e) {
        return DEFAULT_UI_MODE;
    }
}

export const uiModeState = Vue.observable({ mode: read() as UiMode });

export function applyBodyClass (mode: UiMode = uiModeState.mode): void {
    if (typeof document === "undefined" || !document.body) {
        return;
    }
    document.body.classList.toggle(BODY_CLASS, mode === "arena");
    // <html> too: its own (white) background shows below short pages and when scrolling past the footer
    document.documentElement.classList.toggle(BODY_CLASS, mode === "arena");
}

export function setUiMode (mode: UiMode): void {
    uiModeState.mode = mode;
    try {
        localStorage.setItem(UI_MODE_KEY, mode);
    }
    catch (e) {
        // private mode etc.: still switch for this page view
    }
    applyBodyClass(mode);
}

export function toggleUiMode (): UiMode {
    const next: UiMode = uiModeState.mode === "arena" ? "classic" : "arena";
    setUiMode(next);
    return next;
}

export function isArena (): boolean {
    return uiModeState.mode === "arena";
}
