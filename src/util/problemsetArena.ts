/**
 * Helpers for the 像素赛场 problem list / status pages (pure functions, unit tested).
 */
import { isPending } from "@/util/pixelArena";

/** Difficulty labels used on the problem set, mapped to 1-4 stars. */
export const DIFFICULTY_STARS: Record<string, number> = { 简单: 1, 普通: 2, 中等: 3, 困难: 4 };

function toInt (v: unknown): number {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Accepted / submitted as a whole percentage (0 when nothing was submitted). */
export function passPercent (accepted: unknown, submit: unknown): number {
    const s = toInt(submit);
    return s ? Math.round(toInt(accepted) / s * 100) : 0;
}

/** Number of lit cells (0-10) in the 10-cell pass-rate bar; any accepted submission lights at least one. */
export function passCells (accepted: unknown, submit: unknown): number {
    const s = toInt(submit);
    const a = toInt(accepted);
    if (!s || !a) {
        return 0;
    }
    return Math.min(10, Math.max(1, Math.round(a / s * 10)));
}

export type CellState = "ac" | "bad" | "run" | "todo";

/**
 * Test-case cells for a submission: passed cells are green, the case that failed (or is being judged) is
 * red (or yellow while judging), the rest stay dark. Returns [] when the total is unknown.
 */
export function testCells (result: number, passPoint: unknown, totalPoint: unknown, max = 40): CellState[] {
    const total = toInt(totalPoint);
    if (!total) {
        return [];
    }
    const shown = Math.min(total, max);
    const passed = Math.min(shown, result === 4 ? total : toInt(passPoint));
    const out: CellState[] = [];
    for (let i = 0; i < shown; i++) {
        if (i < passed) {
            out.push("ac");
        }
        else if (i === passed && result !== 4 && result !== 13 && result !== 11) {
            out.push(isPending(result) ? "run" : "bad");
        }
        else {
            out.push("todo");
        }
    }
    return out;
}

/** Problem ids with an AC in a newest-first submission list, deduplicated, newest first. */
export function recentBalloons (list: { problem_id: number | string; result: number; contest_id?: unknown }[], limit = 18): number[] {
    const out: number[] = [];
    for (const s of list || []) {
        const id = Math.abs(Number(s.problem_id));
        if (s.result === 4 && id && out.indexOf(id) < 0) {
            out.push(id);
            if (out.length >= limit) {
                break;
            }
        }
    }
    return out;
}
