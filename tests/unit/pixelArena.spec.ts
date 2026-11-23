import {
    balloonColor, BALLOON_COLORS, countdown, pickCurrentTask, pickNextContest, pickRunning,
    relativeTime, resultClass, resultShort, shade, shortTitle
} from "@/util/pixelArena";

const sub = (solution_id: number, problem_id: number, result: number, contest_id: number | null = null) =>
    ({ solution_id, problem_id, result, contest_id, in_date: "2026-11-22T10:00:00.000Z", pass_rate: "0.50" });

describe("pixelArena", () => {
    it("gives every problem a fixed balloon colour", () => {
        expect(balloonColor(1000)).toBe(BALLOON_COLORS[1000 % 8]);
        expect(balloonColor("1003")).toBe(BALLOON_COLORS[3]);
        expect(balloonColor(null)).toBe(BALLOON_COLORS[3]);
        expect(shade("#ffffff", 0.5)).toBe("rgb(128,128,128)");
    });

    it("maps judge results to short labels and colour classes", () => {
        expect([resultShort(4), resultClass(4)]).toEqual(["AC", "ac"]);
        expect([resultShort(6), resultClass(6)]).toEqual(["WA", "wa"]);
        expect(resultClass(7)).toBe("tle");
        expect(resultClass(11)).toBe("ce");
        expect(resultClass(0)).toBe("pd");
        expect(resultClass(14)).toBe("pd");
        // 13 = 运行完成: the final result of a test run, must not keep spinning
        expect(resultClass(13)).toBe("run");
        expect(resultClass(12)).toBe("pd");
        expect(resultClass(10)).toBe("wa");
    });

    it("picks the newest unsolved practice problem as the current task", () => {
        // newest first
        const list = [
            sub(9, 1000, 4),
            sub(8, 1003, 3), // still judging: skipped
            sub(7, 1007, 6, 2300), // contest submission: skipped
            sub(6, 1000, 6), // later AC on 1000: skipped
            sub(5, 1003, 6)
        ];
        expect(pickCurrentTask(list)!.solution_id).toBe(5);
        expect(pickCurrentTask([sub(1, 1000, 4)])).toBeNull();
        expect(pickCurrentTask([])).toBeNull();
    });

    it("finds the next contest and the running ones", () => {
        const now = Date.parse("2026-11-22T18:00:00Z");
        const list = [
            { contest_id: 1, title: "permanent", start_time: "2023-12-27T15:55:00Z", end_time: "2032-12-31T15:55:00Z" },
            { contest_id: 2, title: "homework", start_time: "2026-11-01T00:00:00Z", end_time: "2026-12-16T15:55:00Z" },
            { contest_id: 3, title: "quiz B", start_time: "2026-11-23T06:30:00Z", end_time: "2026-11-23T07:30:00Z" },
            { contest_id: 4, title: "quiz A", start_time: "2026-11-23T05:30:00Z", end_time: "2026-11-23T06:30:00Z" },
            { contest_id: 5, title: "far", start_time: "2027-06-01T00:00:00Z", end_time: "2027-06-01T05:00:00Z" }
        ];
        expect(pickNextContest(list, now)!.contest_id).toBe(4);
        expect(pickRunning(list, now).map(c => c.contest_id)).toEqual([2]);
        expect(pickNextContest([], now)).toBeNull();
    });

    it("formats countdowns, relative times and titles", () => {
        expect(countdown(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
        expect(countdown(-5)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        const now = Date.parse("2026-11-22T18:00:00Z");
        expect(relativeTime("2026-11-22T17:59:30Z", now)).toBe("刚刚");
        expect(relativeTime("2026-11-22T16:00:00Z", now)).toBe("2 小时前");
        expect(relativeTime("2026-11-21T12:00:00Z", now)).toBe("昨天");
        expect(shortTitle("A + B Problem III【★】单循环多组 Single round-robin")).toBe("A + B Problem III");
        expect(shortTitle("增税")).toBe("增税");
        expect(shortTitle(null)).toBe("");
    });
});

import { DIFFICULTY_STARS, passCells, passPercent, recentBalloons, testCells } from "@/util/problemsetArena";

describe("problem list / status helpers", () => {
    it("pass rate bar and percentage", () => {
        expect(passPercent(47, 100)).toBe(47);
        expect(passPercent("3", "0")).toBe(0);
        expect(passCells(1, 1000)).toBe(1);
        expect(passCells(0, 10)).toBe(0);
        expect(passCells(10, 10)).toBe(10);
        expect(passCells(63, 100)).toBe(6);
    });

    it("difficulty labels", () => {
        expect(DIFFICULTY_STARS["困难"]).toBe(4);
        expect(DIFFICULTY_STARS["动态规划"]).toBeUndefined();
    });

    it("test case cells", () => {
        expect(testCells(3, 7, 12)).toEqual([...Array(7).fill("ac"), "run", ...Array(4).fill("todo")]);
        expect(testCells(6, 2, 4)).toEqual(["ac", "ac", "bad", "todo"]);
        expect(testCells(4, 0, 3)).toEqual(["ac", "ac", "ac"]);
        // run finished (test run) and compile error: nothing blinking
        expect(testCells(13, 0, 2)).toEqual(["todo", "todo"]);
        expect(testCells(11, 0, 2)).toEqual(["todo", "todo"]);
        expect(testCells(3, 0, 0)).toEqual([]);
        expect(testCells(3, 0, 100).length).toBe(40);
    });

    it("recent balloons: AC only, deduplicated, newest first", () => {
        const list = [
            { problem_id: 1003, result: 4 }, { problem_id: 1002, result: 6 },
            { problem_id: -1003, result: 4 }, { problem_id: 1001, result: 4 }
        ];
        expect(recentBalloons(list)).toEqual([1003, 1001]);
        expect(recentBalloons(list, 1)).toEqual([1003]);
    });
});
