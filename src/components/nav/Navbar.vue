<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Large :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Large>
            <Small :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Small>
            <Nano :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Nano>
            <LargeContest :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="contest"></LargeContest>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :user_id="user_id"></ProfileCard>
    </div>
</template>

<script>
    import Large from "./size/large/large";
    import LargeContest from './size/large/ContestNav'
    import Small from "./size/Small/Small";
    import Nano from "./size/nano/nano";
    import ProfileCard from "./components/ProfileCard";
    import init from '../../mixin/init'
    const Promise = require("bluebird");

    const $ = require("jquery");
    export default {
        name: "Navbar",
        mixins: [init],
        components: {
            Large,
            Small,
            Nano,
            ProfileCard,
            LargeContest
        },
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
        data: function () {
            return {
                user: 1,
                judger: 0,
                socketConnected: true,
                intervalId: -1
            }
        },
        methods: {
            async connectTry(times) {
                while(times-- > 0) {
                    if (this.$socket && this.$socket.connect && typeof this.$socket.connect === "function") {
                        if(!this.$socket.connected) {
                            this.$socket.connect();
                            this.$socket.emit("getUser");
                        }
                        else {
                            break;
                        }
                    }
                    await Promise.delay(500);
                }
            },
            bindSocketObserver() {
                const that = this;
                this.$socket._connected = this.$socket.connected;
                Object.defineProperty(this.$socket, "connected", {
                    get: function () {
                        return this._connected;
                    },
                    set: function (val) {
                        if (val === false) {
                            that.intervalId = setInterval(() => {
                                that.connectTry(1);
                            },1000);
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
        async mounted() {
            while(!this.$socket) {
                await Promise.delay(500);
            }
            this.bindSocketObserver();
            this.socketConnected = this.$socket.connected;
            const auth_msg = {
                url: this.$route.fullPath,
                version: window.navigator.appVersion,
                platform: window.navigator.platform,
                browser_core: window.navigator.product,
                useragent: window.navigator.userAgent,
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
                this.$store.commit("setOnlineUser", {onlineUser: data.user.user});
            });
            this.sockets.subscribe("connect", () => {
                this.socketConnected = true;
                this.$socket.emit("auth", auth_msg);
            });
            this.sockets.subscribe("judgerChange", (data) => {
                this.judger = data.length;
            });
            this.sockets.subscribe("disconnect", () => {
                this.socketConnected = false;
            });
            this.sockets.subscribe("msg", (data) => {
                setTimeout(() => {
                    $(".item.online_num").attr("data-html", "<div class='header'>From:" + data['user_id'] + "<br>" + data['nick'] + "</div><div class='content'>" + data['content'] + "</div>")
                        .popup("show").popup("set position", "bottom center");
                }, 500);
            });
            $("body").on('click', function () {
                $(".msg.header.item").popup("hide").removeAttr("data-html");
            });

            setTimeout(() => {
                if(this.socketConnected === false && this.$socket.connected) {
                    this.$socket.disconnect();
                    this.$socket.connect();
                }
            });

            setTimeout(() => {
                this.connectTry(10);
            }, 1500);
        },
        updated() {

        }
    }
</script>

<style scoped>

</style>
