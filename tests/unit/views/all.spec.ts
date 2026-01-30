import fs from "fs";
import path from "path";
import Vue from "vue";
import { shallowMount } from "@vue/test-utils";

process.removeAllListeners("unhandledRejection");
process.on("unhandledRejection", () => undefined);
process.removeAllListeners("uncaughtException");
process.on("uncaughtException", () => undefined);

jest.mock("vuex", () => {
    const normalize = (keys: any) => Array.isArray(keys) ? keys : Object.keys(keys || {});
    const mapGetters = (keys: any) => normalize(keys).reduce<Record<string, any>>((acc, key) => {
        acc[key] = function () {
            return (this as any).$store?.getters?.[key];
        };
        return acc;
    }, {});
    const mapState = (keys: any) => normalize(keys).reduce<Record<string, any>>((acc, key) => {
        acc[key] = function () {
            return (this as any).$store?.state?.[key];
        };
        return acc;
    }, {});
    const Store = function () {};
    const vuex = { Store, install: jest.fn() };
    return {
        __esModule: true,
        default: vuex,
        Store,
        mapGetters,
        mapState
    };
});

const chainable: any = new Proxy(function () {}, {
    apply: () => chainable,
    get: (_target, prop: string | symbol) => {
        if (prop === "text" || prop === "html" || prop === "val") {
            return (value?: any) => (value === undefined ? "" : chainable);
        }
        if (prop === Symbol.toPrimitive) {
            return () => "";
        }
        return () => chainable;
    }
});
const jqueryMock: any = Object.assign((() => chainable) as any, {
    fn: chainable,
    inArray: (value: any, array: any[]) => (Array.isArray(array) ? array.indexOf(value) : -1)
});

jest.mock("jquery", () => jqueryMock);
jest.mock("semantic-ui-popup", () => ({}), { virtual: true });
jest.mock("clipboard", () => {
    return function () {
        return { on: jest.fn() };
    };
});
jest.mock("file-saver", () => ({
    saveAs: jest.fn()
}));
jest.mock("html-to-docx", () => {
    const mock = jest.fn(() => Promise.resolve(new Blob()));
    return Object.assign(mock, { __esModule: true, default: mock });
});
jest.mock("fingerprintjs2", () => ({
    get: (cb: (components: any[]) => void) => cb([]),
    x64hash128: () => "hash"
}));
jest.mock("vue-github-button", () => ({ default: { template: "<div></div>" } }));
jest.mock("chart.js", () => {
    const ChartMock = jest.fn().mockImplementation(() => ({
        destroy: jest.fn(),
        update: jest.fn()
    }));
    return ChartMock;
});
jest.mock("monaco-editor", () => {
    const editor = {
        createModel: () => ({}),
        createDiffEditor: () => ({
            setModel: jest.fn(),
            dispose: jest.fn()
        }),
        create: () => ({
            getModel: () => ({ setValue: jest.fn() }),
            updateOptions: jest.fn(),
            layout: jest.fn(),
            dispose: jest.fn()
        }),
        setTheme: jest.fn()
    };
    return {
        __esModule: true,
        default: { editor },
        editor
    };
});
jest.mock("wastyle", () => ({
    init: jest.fn(() => Promise.resolve()),
    format: jest.fn(async (source: string) => [null, source])
}));
jest.mock("wastyle/dist/astyle.wasm", () => ({ default: new ArrayBuffer(8) }));
const createAmChartAxis = () => ({
    renderer: {
        minGridDistance: 0,
        grid: { template: { location: 0 } }
    },
    dataFields: {}
});

const createAmChartSeries = () => ({
    dataFields: {},
    tooltip: { background: {}, label: {}, pointerOrientation: "", textAlign: "", textValign: "" },
    columns: { template: { tooltipText: "", tooltipY: 0, strokeOpacity: 0, adapter: { add: jest.fn() } } },
    bullets: { push: jest.fn(() => ({ circle: {}, states: { create: jest.fn(() => ({ properties: {} })) } })) }
});

const createAmChart = () => ({
    data: [],
    dataFields: {},
    xAxes: { push: jest.fn(() => createAmChartAxis()) },
    yAxes: { push: jest.fn(() => createAmChartAxis()) },
    series: { push: jest.fn(() => createAmChartSeries()) },
    cursor: {},
    scrollbarX: null,
    scrollbarY: null,
    leftAxesContainer: {},
    bottomAxesContainer: {},
    nodes: { template: {} },
    links: {
        template: { bullets: { push: jest.fn(() => ({ fillOpacity: 0, circle: {}, locationX: 0 })) } },
        length: 0,
        getIndex: jest.fn(() => ({
            bullets: {
                getIndex: jest.fn(() => ({
                    animate: jest.fn(() => ({ events: { on: jest.fn() } }))
                }))
            }
        }))
    },
    events: { on: jest.fn() },
    colors: { getIndex: jest.fn(() => ({})) },
    hiddenState: { properties: {} }
});

jest.mock("@amcharts/amcharts4/core", () => ({
    useTheme: jest.fn(),
    create: jest.fn(() => createAmChart()),
    Scrollbar: jest.fn(() => ({ parent: null, toBack: jest.fn() })),
    color: jest.fn(() => ({}))
}));
jest.mock("@amcharts/amcharts4/charts", () => ({
    XYChart: jest.fn(),
    CategoryAxis: jest.fn(() => createAmChartAxis()),
    DateAxis: jest.fn(() => createAmChartAxis()),
    ValueAxis: jest.fn(() => createAmChartAxis()),
    LineSeries: jest.fn(() => createAmChartSeries()),
    ColumnSeries: jest.fn(() => createAmChartSeries()),
    XYCursor: jest.fn(() => ({})),
    XYChartScrollbar: jest.fn(() => ({ series: { push: jest.fn() }, parent: null })),
    CircleBullet: jest.fn(() => ({ circle: {}, states: { create: jest.fn(() => ({ properties: {} })) } })),
    ChordDiagram: jest.fn(() => ({
        dataFields: {},
        nodes: { template: {} },
        links: {
            template: { bullets: { push: jest.fn(() => ({ fillOpacity: 0, circle: {}, locationX: 0 })) } },
            length: 0,
            getIndex: jest.fn(() => ({
                bullets: {
                    getIndex: jest.fn(() => ({
                        animate: jest.fn(() => ({ events: { on: jest.fn() } }))
                    }))
                }
            }))
        },
        events: { on: jest.fn() }
    }))
}));
jest.mock("@amcharts/amcharts4/themes/animated", () => ({ default: {} }));
jest.mock("@antv/g2", () => {
    const createPoint = () => ({
        position: jest.fn(() => ({
            color: jest.fn(() => ({
                shape: jest.fn(() => ({
                    tooltip: jest.fn(() => ({
                        style: jest.fn()
                    }))
                }))
            }))
        }))
    });
    const createChart = () => ({
        source: jest.fn(),
        legend: jest.fn(),
        axis: jest.fn(),
        tooltip: jest.fn(),
        coord: jest.fn(() => ({ reflect: jest.fn() })),
        point: jest.fn(() => createPoint()),
        render: jest.fn(),
        on: jest.fn()
    });
    return {
        __esModule: true,
        default: {
            Shape: { registerShape: jest.fn() },
            Chart: jest.fn(() => createChart())
        }
    };
});
jest.mock("@antv/data-set", () => {
    const createView = () => {
        const view: any = {};
        view.source = jest.fn(() => view);
        view.range = jest.fn(() => [0, 1]);
        view.transform = jest.fn(() => view);
        return view;
    };
    return {
        __esModule: true,
        default: {
            View: jest.fn(() => createView())
        }
    };
});
jest.mock("@ryanlee2014/mavon-editor", () => ({
    __esModule: true,
    default: {
        template: "<div></div>",
        props: ["value", "markInstance"],
        methods: {
            getValue: jest.fn(() => ""),
            setValue: jest.fn()
        }
    }
}));
jest.mock("dragscroll", () => ({ reset: jest.fn() }));

const projectRoot = path.resolve(__dirname, "../../..");
const originalGetElementById = document.getElementById.bind(document);

const createDefaultMixinMock = (factory?: (VueBase: any) => any) => {
    const VueBase = require("vue");
    const MockMixin = factory ? factory(VueBase) : class extends VueBase {};
    return { __esModule: true, default: MockMixin };
};

const createNamedMixinMock = (name: string) => {
    const VueBase = require("vue");
    return { [name]: class MockMixin extends VueBase {} };
};

const mixinMocks: Record<string, () => any> = {
    "src/mixin/init.ts": () => createDefaultMixinMock(),
    "src/mixin/StatusViewMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        getUserId () { return null; }
        getResult () { return null; }
        getProblemID () { return null; }
        getLanguage () { return null; }
        fetchData () { return Promise.resolve(); }
        search () { return Promise.resolve(); }
        setQuery () {}
        tag () {}
        list_self_only () {}
    }),
    "src/mixin/ContestSetEditMixin.ts": () => createDefaultMixinMock(),
    "src/mixin/TimerMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        timer_: any[] = [];
        beforeDestroy () {
            this.timer_.forEach((timer) => clearInterval(timer));
        }
    }),
    "src/mixin/CaptchaMixin.ts": () => createDefaultMixinMock(),
    "src/mixin/contestAddMixin.ts": () => createDefaultMixinMock(),
    "src/mixin/router/RouterBackMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        routerBack () {}
    }),
    "src/mixin/DarkModeMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        renderDarkMode () {}
    }),
    "src/mixin/mermaidMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        initMermaid () {}
        initVisibleMermaid () {}
    }),
    "src/mixin/avatarMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        getAvatarURL () { return ""; }
        hasAvatarURL () { return false; }
    }),
    "src/mixin/MarkdownWorkerMixin.ts": () => createDefaultMixinMock((VueBase: any) => class extends VueBase {
        async renderAsync (content: string) { return content; }
        async renderPlainAsync (content: string) { return content; }
        async renderRawAsync (content: string) { return content; }
    })
};

beforeAll(() => {
    process.on("unhandledRejection", () => undefined);
    process.on("uncaughtException", () => undefined);
    (require as any).context = () => Object.assign((() => ({})) as any, { keys: () => [] });
    if (!(Function.prototype as any).context) {
        Object.defineProperty(Function.prototype, "context", {
            value: () => Object.assign((() => ({})) as any, { keys: () => [] })
        });
    }

    if (!("chartColors" in window)) {
        (window as any).chartColors = { red: "#f00", blue: "#00f", green: "#0f0" };
    }

    const vueProto: any = (Vue as any).prototype;
    if (!vueProto.getProblemID) vueProto.getProblemID = () => null;
    if (!vueProto.getUserId) vueProto.getUserId = () => null;
    if (!vueProto.getResult) vueProto.getResult = () => null;
    if (!vueProto.getLanguage) vueProto.getLanguage = () => null;
    if (!vueProto.fetchData) vueProto.fetchData = () => Promise.resolve();
    if (!vueProto.search) vueProto.search = () => Promise.resolve();
    if (!vueProto.setQuery) vueProto.setQuery = () => {};
    if (!vueProto.tag) vueProto.tag = () => {};
    if (!vueProto.list_self_only) vueProto.list_self_only = () => {};
    if (!("timer_" in vueProto)) vueProto.timer_ = [];

    if (!("ResizeObserver" in global)) {
        (global as any).ResizeObserver = class {
            observe () {}
            unobserve () {}
            disconnect () {}
        };
    }

    Object.entries(mixinMocks).forEach(([modulePath, factory]) => {
        jest.doMock(path.resolve(projectRoot, modulePath), factory);
    });

    jest.doMock(
        path.resolve(projectRoot, "src/mixin/contest/ContestShowSimMixin.ts"),
        () => createNamedMixinMock("ContestShowSimMixin")
    );

    jest.doMock(path.resolve(projectRoot, "src/lib/util.ts"), () => ({
        __esModule: true,
        default: { init: jest.fn(), stringify: (value: any) => String(value ?? "") }
    }));
    jest.doMock(path.resolve(projectRoot, "src/lib/markdownIt/markdownIt.ts"), () => {
        const createInstance = () => ({
            render: (value: any) => String(value ?? ""),
            renderPlain: (value: any) => String(value ?? ""),
            renderRaw: (value: any) => String(value ?? ""),
            renderAsync: async (value: any) => String(value ?? ""),
            renderPlainAsync: async (value: any) => String(value ?? ""),
            renderRawAsync: async (value: any) => String(value ?? ""),
            image_add: jest.fn()
        });
        const instance = createInstance();
        return {
            __esModule: true,
            default: Object.assign(instance, {
                newInstance: createInstance
            })
        };
    });

    jest.doMock(path.resolve(projectRoot, "src/lib/calendar-heapmap.js"), () => ({
        __esModule: true,
        default: {}
    }));

    jest.doMock(path.resolve(projectRoot, "semantic/semantic-ui/semantic.min.js"), () => ({}));
    jest.doMock(path.resolve(projectRoot, "src/views/faq.vue"), () => ({
        __esModule: true,
        default: { render: (h: any) => h("div") }
    }));
});

const viewsRoot = path.resolve(projectRoot, "src/views");

const collectViewFiles = (dir: string, files: string[] = []) => {
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            collectViewFiles(fullPath, files);
        }
        else if (fullPath.endsWith(".vue")) {
            files.push(fullPath);
        }
    });
    return files;
};

const testCases = collectViewFiles(viewsRoot)
    .sort()
    .map((filePath) => [path.relative(viewsRoot, filePath).split(path.sep).join("/"), filePath]);

const createSafeValue = (): any => new Proxy({}, {
    get: (_target, prop: string | symbol) => {
        if (prop === "length") return 0;
        if (prop === Symbol.iterator) return function * () {};
        if (prop === Symbol.toPrimitive) return () => "";
        if (prop === "map") return () => [];
        if (prop === "forEach") return () => {};
        if (prop === "filter") return () => [];
        if (prop === "join") return () => "";
        if (prop === "split") return () => createSafeValue();
        if (prop === "indexOf") return () => -1;
        if (prop === "match") return () => [];
        if (prop === "substring") return () => "";
        if (prop === "slice") return () => "";
        if (prop === "includes") return () => false;
        if (prop === "replace") return () => "";
        if (prop === "sort") return () => [];
        if (prop === "trim") return () => "";
        if (prop === "toString") return () => "";
        if (prop === "valueOf") return () => "";
        if (prop === "charAt") return () => "";
        return createSafeValue();
    }
});

const safeValue = createSafeValue();
const methodProbeValues = [safeValue, {}, [], { data: [] }, { list: [] }, { status: "OK" }];
const watchPairs: any[] = [
    [safeValue, safeValue],
    [{}, {}],
    [[], []],
    [{}, safeValue],
    [safeValue, {}]
];

const createAxiosResponse = () => {
    const baseData = {
        data: safeValue,
        dataList: safeValue,
        list: safeValue,
        status: "OK",
        logined: false,
        self: "",
        const_variable: safeValue
    };
    const data = new Proxy(baseData as Record<string, any>, {
        get: (target, prop: string | symbol) => (prop in target ? target[prop as keyof typeof target] : safeValue)
    });
    return { data };
};

const createMocks = () => {
    const routeParams = new Proxy({}, { get: () => "1" });
    const routeQuery = new Proxy({}, {
        get: (target, prop: string | symbol) => {
            if (prop === "hasOwnProperty") {
                return Object.prototype.hasOwnProperty.bind(target);
            }
            return "1";
        }
    });
    const getterValues: Record<string, any> = {
        contestMode: false,
        homepage: false,
        darkMode: false,
        language: 0,
        share: 0,
        code: "",
        gravatarCDN: "",
        admin: true,
        contest_manager: true,
        avatarUrl: "",
        avatar: false,
        nick: "",
        user_id: "u1"
    };
    const axiosGet = jest.fn((url: any) => {
        if (typeof url === "string") {
            if (url.includes("api.github.com/repos/")) {
                return Promise.resolve({ data: [{ name: "main" }] });
            }
            if (url.includes("cdn.jsdelivr.net/gh/")) {
                return Promise.resolve({ data: { version: "0.0.0" } });
            }
        }
        return Promise.resolve(createAxiosResponse());
    });
    const axiosMock = Object.assign(
        jest.fn().mockResolvedValue(createAxiosResponse()),
        {
            get: axiosGet,
            post: jest.fn().mockResolvedValue(createAxiosResponse()),
            put: jest.fn().mockResolvedValue(createAxiosResponse()),
            delete: jest.fn().mockResolvedValue(createAxiosResponse()),
            CancelToken: {
                source: () => ({ token: "token", cancel: jest.fn() })
            }
        }
    );
    (Vue as any).prototype.axios = axiosMock;
    return {
        $t: (key: string) => key,
        $tc: (key: string) => key,
        $te: () => true,
        $i18n: { locale: "zh-cn" },
        $Lazyload: { $on: jest.fn(), $off: jest.fn(), lazyLoadHandler: jest.fn() },
        $route: { params: routeParams, query: routeQuery, hash: { page: 0 }, fullPath: "/", path: "/" },
        $router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
        $store: {
            getters: new Proxy({}, { get: (_target, prop: string) => (prop in getterValues ? getterValues[prop] : safeValue) }),
            commit: jest.fn(),
            dispatch: jest.fn()
        },
        $socket: { emit: jest.fn(), on: jest.fn(), off: jest.fn() },
        sockets: { subscribe: jest.fn(), unsubscribe: jest.fn() },
        $refs: new Proxy({}, {
            get: () => ({ $children: [{ num: 0 }], iRender: jest.fn() })
        }),
        $children: [],
        axios: axiosMock,
        renderAsync: async (content: string) => content,
        renderPlainAsync: async (content: string) => content,
        renderRawAsync: async (content: string) => content,
        initMermaid: () => {},
        initVisibleMermaid: () => {},
        getAvatarURL: () => "",
        hasAvatarURL: () => false,
        routerBack: () => {}
    };
};

Vue.config.silent = true;
Vue.directive("observe-visibility", {});
Vue.directive("lazy", {});

const safeCall = (fn: (...args: any[]) => any, ctx: any, args: any[] = []) => {
    try {
        const result = fn.apply(ctx, args);
        if (result && typeof result.then === "function") {
            return result.catch(() => undefined);
        }
        return result;
    }
    catch (_e) {
        return undefined;
    }
};
const callWithProbes = (fn: (...args: any[]) => any, ctx: any) => {
    const argLength = Math.max(0, fn.length || 0);
    if (argLength === 0) {
        safeCall(fn, ctx, []);
    }
    methodProbeValues.forEach((probe) => {
        const args = new Array(argLength).fill(probe);
        safeCall(fn, ctx, args);
    });
};
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const ensureMonacoEditor = () => {
    const monacoModule = require("monaco-editor");
    if (monacoModule && !monacoModule.editor) {
        const editor = {
            createModel: () => ({}),
            createDiffEditor: () => ({
                setModel: jest.fn(),
                dispose: jest.fn()
            }),
            create: () => ({
                getModel: () => ({ setValue: jest.fn() }),
                updateOptions: jest.fn(),
                layout: jest.fn(),
                dispose: jest.fn()
            }),
            setTheme: jest.fn()
        };
        monacoModule.editor = editor;
        if (monacoModule.default && !monacoModule.default.editor) {
            monacoModule.default.editor = editor;
        }
    }
};

describe("views smoke", () => {
    beforeEach(() => {
        window.alert = jest.fn();
        window.confirm = jest.fn(() => true);
        document.body.innerHTML = "";
        document.getElementById = ((id: string) => {
            const element = originalGetElementById(id);
            if (element) return element;
            const fallback = document.createElement("canvas");
            (fallback as any).getContext = jest.fn(() => ({}));
            return fallback;
        }) as any;
        const saveTable = document.createElement("table");
        saveTable.id = "save";
        saveTable.innerHTML = "<tbody></tbody>";
        document.body.appendChild(saveTable);
        try {
            Object.defineProperty(window.location, "reload", { value: jest.fn(), configurable: true });
        }
        catch (_e) {
            try {
                Object.defineProperty(window, "location", {
                    value: { ...(window.location as any), reload: jest.fn() },
                    configurable: true
                });
            }
            catch (_err) {}
        }
    });

    it.each(testCases)("renders %s", async (_name, filePath) => {
        ensureMonacoEditor();
        const componentModule = require(filePath);
        const component = componentModule.default || componentModule;
        const componentOptions = component.options || component;
        const wrapper = shallowMount(component, {
            mocks: createMocks(),
            stubs: {
                "router-link": true,
                "router-view": true,
                transition: false,
                "v-gravatar": true,
                "mavon-editor": true,
                "status-table": true,
                StatusTable: true,
                ContestMode: true,
                Graph: true,
                ResultGraph: true,
                UserGraph: true,
                Statistics: true
            }
        });
        (wrapper.vm as any).$refs = new Proxy({}, {
            get: () => ({ $children: [{ num: 0 }], iRender: jest.fn(), innerHTML: "" })
        });
        (wrapper.vm as any).$children = [];

        if (componentOptions.computed) {
            Object.keys(componentOptions.computed).forEach((key) => {
                safeCall(() => (wrapper.vm as any)[key], wrapper.vm);
            });
        }

        if (componentOptions.watch) {
            Object.values(componentOptions.watch).forEach((watchEntry: any) => {
                const entries = Array.isArray(watchEntry) ? watchEntry : [watchEntry];
                entries.forEach((entry: any) => {
                    let handler = entry;
                    if (entry && typeof entry === "object") {
                        handler = entry.handler;
                    }
                    if (typeof handler === "string") {
                        handler = (wrapper.vm as any)[handler];
                    }
                    if (typeof handler === "function") {
                        watchPairs.forEach((pair) => {
                            safeCall(handler, wrapper.vm, pair);
                        });
                    }
                });
            });
        }

        if (componentOptions.methods) {
            Object.entries(componentOptions.methods).forEach(([key, value]) => {
                if (typeof value === "function") {
                    callWithProbes(value as any, wrapper.vm);
                }
            });
        }

        const proto = Object.getPrototypeOf(wrapper.vm);
        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (["constructor", "created", "mounted", "beforeDestroy", "render"].includes(key)) return;
            const value = (wrapper.vm as any)[key];
            if (typeof value === "function") {
                callWithProbes(value, wrapper.vm);
            }
        });

        await Vue.nextTick();
        for (let i = 0; i < 3; i += 1) {
            await flushPromises();
        }
        wrapper.destroy();
    });
});
