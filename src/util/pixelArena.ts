/**
 * Helpers for the 像素赛场 (Pixel Arena) design language.
 */

/** Balloon palette. Every problem keeps one fixed colour (problem_id mod palette size). */
export const BALLOON_COLORS = ["#ff5a5f", "#2fd27a", "#ffd84a", "#5b8cff", "#36c5f0", "#a77bff", "#ff9a2e", "#ff6fb5"];
export const BALLOON_NAMES = ["红", "绿", "黄", "蓝", "青", "紫", "橙", "粉"];

function paletteIndex (problemId: number | string | null | undefined): number {
    const n = problemId === null || problemId === undefined || problemId === "" ? NaN : Number(problemId);
    if (!Number.isFinite(n) || n < 0) {
        return 3;
    }
    return Math.floor(n) % BALLOON_COLORS.length;
}

export function balloonColor (problemId: number | string | null | undefined): string {
    return BALLOON_COLORS[paletteIndex(problemId)];
}

export function balloonIndex (problemId: number | string | null | undefined): number {
    return paletteIndex(problemId);
}

export function balloonName (problemId: number | string | null | undefined): string {
    return BALLOON_NAMES[paletteIndex(problemId)];
}

export function shade (hex: string, factor: number): string {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) {
        return hex;
    }
    const n = parseInt(m[1], 16);
    const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
    return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

/**
 * Judge result codes (see const_list.result in the backend):
 * 0 waiting, 1 waiting rejudge, 2 compiling, 3 running, 4 AC, 5 PE, 6 WA, 7 TLE, 8 MLE, 9 OLE, 10 RE, 11 CE,
 * 12 compiled, 13 run finished, 14 queued (12-14 are still in progress), 15 rejected, 16 system error.
 */
const RESULT_SHORT: Record<number, string> = {
    0: "等待", 1: "重判", 2: "编译", 3: "运行", 4: "AC", 5: "PE", 6: "WA", 7: "TLE", 8: "MLE", 9: "OLE", 10: "RE", 11: "CE",
    12: "运行", 13: "运行", 14: "排队", 15: "拒绝", 16: "SE"
};

export function isPending (code: number): boolean {
    return (code >= 0 && code <= 3) || (code >= 12 && code <= 14);
}

export function resultShort (code: number): string {
    return RESULT_SHORT[code] ?? String(code);
}

/** css modifier for .pa-result: ac / wa / tle / ce / pd */
export function resultClass (code: number): string {
    if (code === 4) {
        return "ac";
    }
    if (isPending(code)) {
        return "pd";
    }
    if (code === 7 || code === 8 || code === 9) {
        return "tle";
    }
    if (code === 11) {
        return "ce";
    }
    return "wa";
}

/** Problem titles carry decorations like "A + B Problem III【★】单循环… English title". Keep the leading name. */
export function shortTitle (title: string | null | undefined): string {
    if (!title) {
        return "";
    }
    const cut = title.split("【")[0].trim();
    return cut || title.trim();
}

export interface Countdown { days: number; hours: number; minutes: number; seconds: number }

export function countdown (ms: number): Countdown {
    const total = Math.max(0, Math.floor(ms / 1000));
    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60
    };
}

export function pad2 (n: number): string {
    return n < 10 ? `0${n}` : String(n);
}

export interface RelativeParts { key: "justNow" | "minutes" | "hours" | "yesterday" | "days" | "date"; n?: number; date?: string }

/** Locale-neutral relative time; the UI turns `key` into words (pa.ago.*). */
export function relativeParts (time: string | number | Date, now = Date.now()): RelativeParts {
    const t = new Date(time).getTime();
    if (!Number.isFinite(t)) {
        return { key: "date", date: "" };
    }
    const diff = Math.max(0, now - t) / 1000;
    if (diff < 60) {
        return { key: "justNow" };
    }
    if (diff < 3600) {
        return { key: "minutes", n: Math.floor(diff / 60) };
    }
    if (diff < 86400) {
        return { key: "hours", n: Math.floor(diff / 3600) };
    }
    if (diff < 2 * 86400) {
        return { key: "yesterday" };
    }
    if (diff < 30 * 86400) {
        return { key: "days", n: Math.floor(diff / 86400) };
    }
    const d = new Date(t);
    return { key: "date", date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` };
}

const ZH_AGO: Record<string, (n?: number) => string> = {
    justNow: () => "刚刚",
    minutes: n => `${n} 分钟前`,
    hours: n => `${n} 小时前`,
    yesterday: () => "昨天",
    days: n => `${n} 天前`
};

/** Chinese wording of relativeParts ("刚刚 / 5 分钟前 / 3 小时前 / 昨天 / 4 天前 / 2026-10-01"). */
export function relativeTime (time: string | number | Date, now = Date.now()): string {
    const p = relativeParts(time, now);
    return p.key === "date" ? (p.date as string) : ZH_AGO[p.key](p.n);
}

export interface SubmissionLite {
    solution_id: number;
    problem_id: number;
    result: number;
    pass_rate?: string | number;
    contest_id?: number | null;
    in_date: string;
    language?: number;
}

/**
 * "Current task": the newest practice submission (not in a contest) that did not pass,
 * on a problem with no later AC in the given list. `list` is newest first.
 */
export function pickCurrentTask<T extends SubmissionLite> (list: T[]): T | null {
    const solved = new Set<number>();
    for (const s of list) {
        if (s.contest_id !== null && s.contest_id !== undefined) {
            continue;
        }
        if (s.result === 4) {
            solved.add(Number(s.problem_id));
            continue;
        }
        if (isPending(s.result)) {
            continue;
        }
        if (!solved.has(Number(s.problem_id))) {
            return s;
        }
    }
    return null;
}

export interface ContestLite {
    contest_id: number;
    title: string;
    start_time: string;
    end_time: string;
    private?: number;
}

const DAY = 86400 * 1000;

/** Nearest contest that has not started yet (within `horizonDays`). */
export function pickNextContest<T extends ContestLite> (list: T[], now = Date.now(), horizonDays = 30): T | null {
    let best: T | null = null;
    for (const c of list) {
        const start = new Date(c.start_time).getTime();
        if (start > now && start - now <= horizonDays * DAY) {
            if (!best || start < new Date(best.start_time).getTime()) {
                best = c;
            }
        }
    }
    return best;
}

/** Contests running right now and ending within `maxDays` (filters out permanent practice sets). */
export function pickRunning<T extends ContestLite> (list: T[], now = Date.now(), maxDays = 60): T[] {
    return list
        .filter(c => {
            const start = new Date(c.start_time).getTime();
            const end = new Date(c.end_time).getTime();
            return start <= now && end > now && end - now <= maxDays * DAY;
        })
        .sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime());
}
