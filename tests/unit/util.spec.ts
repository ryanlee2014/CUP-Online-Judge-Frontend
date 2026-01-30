import axios from "axios";
import { isContestAssistant, parameterHash } from "@/util/util";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("parameterHash", () => {
    it("serializes numbers strings and objects", () => {
        expect(parameterHash([1, "a", { b: 2 }])).toBe("1a{\"b\":2}");
    });

    it("serializes nested values", () => {
        expect(parameterHash([{ a: [1, 2] }, 3, "x"])).toBe("{\"a\":[1,2]}3x");
    });
});

describe("isContestAssistant", () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
    });

    it("returns data from api", async () => {
        mockedAxios.get.mockResolvedValue({ data: { data: true } } as any);
        await expect(isContestAssistant(12)).resolves.toBe(true);
        expect(mockedAxios.get).toHaveBeenCalledWith("/api/contest/assistant/12");
    });
});
