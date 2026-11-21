import config from "../../package.json";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
const $ = require("jquery");

@Component
export default class NavbarMixin extends Vue {
    @Prop({ default: "" }) user_id!: string;
    @Prop({ default: false }) admin!: boolean;
    @Prop({ default: false }) avatar!: boolean;
    @Prop({ default: "" }) nick!: string;
    @Prop({ default: false }) logined!: boolean;
    @Prop({ default: false }) homepage!: boolean;
    @Prop({ default: false }) contest!: boolean;
    @Prop({ default: false }) topic!: boolean;
    @Prop({ default: "" }) email!: string;
    sockets: any;
    $socket: any;
    $route: any;
    user = 1;
    judger = 0;
    socketConnected = true;
    intervalId: any = -1;
    _connectTry (times: number) {
        (async () => {
            const Promise = require("bluebird");
            while (times-- > 0) {
                if (this.$socket && this.$socket.connect && typeof this.$socket.connect === "function") {
                    if (!this.$socket.connected && !this.$socket.active) {
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
    }

    async mounted () {
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
        this.sockets.subscribe = (events: any, callback: (...arg: any[]) => any) => {
            _subscribe.call(this.sockets, events, function () {
                that.socketConnected = true;
                // eslint-disable-next-line prefer-rest-params
                callback.apply(that, arguments as unknown as any[]);
            });
        };
        this.sockets.subscribe("user", (data: any) => {
            this.socketConnected = true;
            this.user = parseInt(data.user.user_cnt);
            this.judger = parseInt(data.judger ? data.judger.length : 0);
            this.$store.commit("setOnlineUser", { onlineUser: data.user.user });
        });
        this.sockets.subscribe("connect", () => {
            this.socketConnected = true;
            this.$socket.emit("auth", authMsg);
        });
        this.sockets.subscribe("freeJudgerNumber", (data: any) => {
            this.judger = data.num;
        });
        this.sockets.subscribe("disconnect", (reason: string) => {
            this.socketConnected = false;
            if (reason === "io server disconnect") {
                this.$socket.connect();
            }
        });
        this.sockets.subscribe("msg", (data: any) => {
            setTimeout(() => {
                $("body")
                    .toast({
                        class: "info",
                        displayTime: 0,
                        closeIcon: true,
                        message: "<div class='header'>From:" + data.user_id + "<br>" + data.nick + "</div><div class='content'>" + data.content + "</div>"
                    }, 500);
            });
        });
        $("body").on("click", function () {
            $(".msg.header.item").popup("hide").removeAttr("data-html");
        });
    }
}
