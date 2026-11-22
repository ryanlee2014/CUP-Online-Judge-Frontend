/**
 * Per-problem code drafts kept in localStorage, so a refresh / accidental close doesn't lose code.
 */
export interface CodeDraft {
    code: string;
    language: number;
    /** last saved, epoch ms */
    t: number;
}

export interface DraftRouteParams {
    problem_id?: string;
    contest_id?: string;
    topic_id?: string;
    num?: string;
}

export const DRAFT_PREFIX = "cupoj:draft:";
export const DRAFT_MAX_AGE = 30 * 24 * 3600 * 1000;
export const DRAFT_MAX_ENTRIES = 50;

const isId = (v?: string) => typeof v === "string" && /^\d+$/.test(v);

export function draftKey (params: DraftRouteParams): string | null {
    if (isId(params.contest_id) && isId(params.num)) {
        return `${DRAFT_PREFIX}c:${params.contest_id}:${params.num}`;
    }
    if (isId(params.topic_id) && isId(params.num)) {
        return `${DRAFT_PREFIX}t:${params.topic_id}:${params.num}`;
    }
    if (isId(params.problem_id)) {
        return `${DRAFT_PREFIX}p:${params.problem_id}`;
    }
    return null;
}

function parse (raw: string | null): CodeDraft | null {
    if (!raw) {
        return null;
    }
    try {
        const d = JSON.parse(raw);
        if (d && typeof d.code === "string" && typeof d.t === "number") {
            return { code: d.code, language: Number(d.language), t: d.t };
        }
    }
    catch (e) {
        // ignore malformed entries
    }
    return null;
}

export function loadDraft (key: string, now = Date.now()): CodeDraft | null {
    try {
        const draft = parse(localStorage.getItem(key));
        if (!draft || now - draft.t > DRAFT_MAX_AGE) {
            return null;
        }
        return draft;
    }
    catch (e) {
        return null;
    }
}

export function removeDraft (key: string): void {
    try {
        localStorage.removeItem(key);
    }
    catch (e) {
        // storage unavailable
    }
}

/** Drop expired drafts and keep only the newest DRAFT_MAX_ENTRIES. */
export function pruneDrafts (now = Date.now()): void {
    try {
        const entries: { key: string, t: number }[] = [];
        for (let i = 0; i < localStorage.length; ++i) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith(DRAFT_PREFIX)) {
                continue;
            }
            const draft = parse(localStorage.getItem(key));
            entries.push({ key, t: draft ? draft.t : 0 });
        }
        entries.sort((a, b) => b.t - a.t);
        entries.forEach((entry, index) => {
            if (index >= DRAFT_MAX_ENTRIES || now - entry.t > DRAFT_MAX_AGE) {
                localStorage.removeItem(entry.key);
            }
        });
    }
    catch (e) {
        // storage unavailable
    }
}

/** Save the draft; blank code removes it. */
export function saveDraft (key: string, code: string, language: number, now = Date.now()): void {
    if (!code || !code.trim()) {
        removeDraft(key);
        return;
    }
    const value = JSON.stringify({ code, language, t: now });
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        // quota exceeded: free space and retry once
        pruneDrafts(now);
        try {
            localStorage.setItem(key, value);
        }
        catch (e2) {
            return;
        }
    }
    pruneDrafts(now);
}
