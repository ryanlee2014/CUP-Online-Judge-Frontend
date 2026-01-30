const buildRouter = (admin: boolean) => {
    jest.resetModules();
    const storePath = require.resolve("../../src/store");
    jest.doMock(storePath, () => ({
        __esModule: true,
        default: {
            getters: {
                admin
            }
        }
    }));
    return require("../../src/lib/router").default;
};

describe("adminAuth", () => {
    it("calls next when admin", () => {
        const router = buildRouter(true);
        const next = jest.fn();
        router.adminAuth({}, {}, next);
        expect(next).toHaveBeenCalled();
    });

    it("does not call next when not admin", () => {
        const router = buildRouter(false);
        const next = jest.fn();
        router.adminAuth({}, {}, next);
        expect(next).not.toHaveBeenCalled();
    });
});
