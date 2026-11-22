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
