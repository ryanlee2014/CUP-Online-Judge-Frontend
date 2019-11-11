const $ = require("jquery");
const config = require("../../package.json");
export default {
    props: {
        user_id: {
            type: String,
            default: ""
        },
        nick: {
            type: String,
            default: ""
        },
        admin: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: Boolean,
            default: false
        },
        logined: {
            type: Boolean,
            default: false
        },
        homepage: {
            type: Boolean,
            default: false
        },
        contest: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            user: 1,
            judger: 0,
            socketConnected: true,
            intervalId: -1
        };
    },
    methods: {
        _connectTry (times) {
            (async () => {
                let Promise = require("bluebird");
                while (times-- > 0) {
                    if (this.$socket && this.$socket.connect && typeof this.$socket.connect === "function") {
                        if (!this.$socket.connected) {
                            this.$socket.connect();
                            this.$socket.emit("getUser");
                        }
                        else {
                            break;
                        }
                    }
                    await Promise.delay(500);
                }
            })();
        },
        bindSocketObserver () {
            const that = this;
            Object.defineProperty(this.$socket, "connected", {
                _connected: this.$socket.connected,
                get: function () {
                    return this._connected;
                },
                set: function (val) {
                    if (val === false) {
                        that.intervalId = setInterval(() => {
                            that._connectTry(1);
                        }, 1000);
                    }
                    else {
                        if (that.intervalId !== -1) {
                            clearInterval(that.intervalId);
                        }
                    }
                    that.socketConnected = this._connected = val;
                }
            });
        }
    },
    async mounted () {
        this.bindSocketObserver();
        this.socketConnected = this.$socket.connected;
        const authMsg = {
            url: this.$route.fullPath,
            version: window.navigator.appVersion,
            platform: window.navigator.platform,
            browser_core: window.navigator.product,
            useragent: window.navigator.userAgent,
            frontend_version: config.version,
            screen: {
                width: screen.availWidth,
                height: screen.availHeight
            }
        };

        const _subscribe = this.sockets.subscribe;
        const that = this;
        this.sockets.subscribe = (events, callback) => {
            _subscribe.call(this.sockets, events, function () {
                that.socketConnected = true;
                callback.apply(that, arguments);
            });
        };
        this.sockets.subscribe("user", (data) => {
            this.socketConnected = true;
            this.user = parseInt(data.user.user_cnt);
            this.judger = parseInt(data.judger ? data.judger.length : 0);
            this.$store.commit("setOnlineUser", { onlineUser: data.user.user });
        });
        this.sockets.subscribe("connect", () => {
            this.socketConnected = true;
            this.$socket.emit("auth", authMsg);
        });
        this.sockets.subscribe("judgerChange", (data) => {
            this.judger = data.length;
        });
        this.sockets.subscribe("disconnect", () => {
            this.socketConnected = false;
        });
        this.sockets.subscribe("msg", (data) => {
            setTimeout(() => {
                $("body")
                    .toast({
                        class: "info",
                        displayTime: 0,
                        closeIcon: true,
                        message: "<div class='header'>From:" + data["user_id"] + "<br>" + data["nick"] + "</div><div class='content'>" + data["content"] + "</div>"
                    }, 500);
            });
        });
        $("body").on("click", function () {
            $(".msg.header.item").popup("hide").removeAttr("data-html");
        });
        setTimeout(() => {
            if (this.socketConnected === false && this.$socket.connected) {
                this.$socket.disconnect();
                this.$socket.connect();
            }
        });
    }
};
