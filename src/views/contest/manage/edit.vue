<template>
    <div class="ui container padding" v-lazy-container="{ selector: 'img' }">
        <div class="ui form">
            <div class="field">
                <label>{{$t("title")}}</label>
                <div class="two fields">
                    <div class="field">
                        <input name="title" placeholder="contest title" type="text" v-model="title">
                    </div>
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <div class="ui toggle checkbox">
                                    <input @click="Public = !Public" class="hidden" tabindex="0" type="checkbox"
                                           v-model="Public">
                                    <label>{{$t("available")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox">
                                    <input @click="ContestMode = !ContestMode" class="hidden" tabindex="0"
                                           type="checkbox" v-model="ContestMode">
                                    <label>{{$t("contest mode available only")}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("start time")}}</label>
                        <div class="ui calendar" id="rangestart">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input @input="debug('input')" id="startTime" placeholder="Start" type="text"
                                       v-model="startTime">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("end time")}}</label>
                        <div class="ui calendar" id="rangeend">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="endTime" placeholder="End" type="text" v-model="endTime">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="three fields">
                    <div class="field">
                        <label>{{$t("contest password")}}</label>
                        <input name="password" placeholder="contest password" type="text" v-model="password">
                    </div>
                    <div class="field">
                        <label>{{$t("limit classroom")}}</label>
                        <div class="ui fluid multiple search selection dropdown" id="limitClassroom">
                            <input @change="classroomSelected = $event.target.value" name="country"
                                   type="hidden" v-model="classroomSelected">
                            <i class="dropdown icon"></i>
                            <div class="default text">{{$t("limit classroom")}}</div>
                            <div class="menu">
                                <div class="item" data-value="403">
                                    403
                                </div>
                                <div class="item" data-value="404">
                                    404
                                </div>
                                <div class="item" data-value="405">
                                    405
                                </div>
                                <div class="item" data-value="502">
                                    502
                                </div>
                                <div class="item" data-value="503">
                                    503
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("limit hostname")}}</label>
                        <div class="ui fluid search dropdown selection" size="1" id="limitHostname">
                            <input @change="hostname=$event.target.value" type="hidden"
                                   v-model="hostname">
                            <i class="dropdown icon"></i>
                            <div class="default text">All</div>
                            <div class="menu">
                                <div class='item' data-value=''>All<i class="dropdown icon"
                                                                      style="visibility: hidden; "></i></div>
                                <div class="item" data-value="acm.cup.edu.cn">
                                    acm.cup.edu.cn
                                </div>
                                <div class="item" data-value="www.cupacm.com">
                                    www.cupacm.com
                                </div>
                                <div class="item" data-value="oj.cupacm.com">
                                    oj.cupacm.com
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("select language")}}</label>
                    <div class="ui fluid multiple search selection dropdown" id="selectedLanguage">
                        <input @change="languageSelected = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">{{$t("select language")}}</div>
                        <div class="menu">
                            <div :data-value="key" :key="key" class="item" v-for="(row,key) in languageSet">
                                {{row}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("problem list")}}</label>
                    <input type="text" v-model="problemSelected">
                </div>
            </div>
            <div class="field">
                <label>{{$t("description")}}</label>
                <textarea v-model="description"></textarea>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("selected user")}}</label>
                        <div class="ui middle aligned animated list">
                            <div :key="key" class="item" v-for="(row,key) in userList">
                                <img :data-src="`/avatar/${row}.jpg`" class="ui avatar image">
                                <div class="content">
                                    <div class="header">{{row}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("selected user input")}}</label>
                        <textarea style="min-height: 100%; height: 100%; box-sizing: border-box;"
                                  v-model="userListText">
                        </textarea>
                    </div>
                </div>
            </div>
            <div class="padding field">
                <div class="two fields">
                    <div class="field">

                    </div>
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <button class="ui secondary button">
                                    Reset
                                </button>
                            </div>
                            <div class="field">
                                <button class="ui primary button">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";
import Type from "../../../type/index.json";
import Middleware from "../../../module/Middleware/core";

const dayjs = require("dayjs");

export default {
    name: "edit",
    mixins: [mixins],
    data () {
        return {
            contest_id: this.$route.params.contest_id,
            title: "",
            defunct: false,
            Public: true,
            ContestMode: false,
            startTime: "",
            endTime: "",
            password: "",
            description: "",
            languageSelected: "",
            classroomSelected: "",
            problemSelected: "",
            languageSet: Type.language_name.local,
            hostname: "",
            userListText: "",
            userList: []
        };
    },
    methods: {
        debug (name, value) {
            console.log(name);
            if (typeof value !== "undefined") {
                console.log(value);
            }
        },
        /**
         * @return {number}
         */
        LanguageSelectedToLangmask () {
            const byteLength = this.languageSet.length;
            let target = (2 << byteLength) - 1;
            let languageSet = this.languageSelected.split(",").map(el => parseInt(el));
            languageSet.forEach(el => {
                target ^= (2 << el);
            });
            return target;
        },
        LangmaskToLanguageSelected (langmask) {
            let cnt = 0;
            let languageSet = Array.from(Array(this.languageSet.length).keys());
            while (langmask > 0) {
                if ((langmask & 1) === 1) {
                    languageSet.splice(languageSet.indexOf(cnt), 1);
                }
                langmask >>= 1;
                ++cnt;
            }
            this.languageSelected = languageSet.join(",");
        },
        initData (options, next) {
            this.axios.get(`/api/admin/contest/edit/${this.contest_id}`)
                .then(({ data }) => {
                    if (data.data.length > 0) {
                        const res = data.data[0];
                        this.title = res.title;
                        this.startTime = new Date(res.start_time);
                        this.endTime = new Date(res.end_time);
                        this.description = res.description;
                        this.defunct = res.defunct === "N";
                        this.Public = !!this.private;
                        this.ContestMode = !!res.cmod_visible;
                        this.LangmaskToLanguageSelected(res.langmask);
                        this.password = res.password;
                        this.classroomSelected = res.ip_policy;
                        this.hostname = res.limit_hostname ? res.limit_hostname : "";
                    }
                    next();
                });
            this.axios.get(`/api/admin/contest/edit/user/${this.contest_id}`)
                .then(({ data }) => {
                    if (data.data.length > 0) {
                        this.userListText = data.data.map(el => el.user_id).join("\n");
                    }
                });
        },
        initjQuery (options, next) {
            const that = this;
            const $rangeStart = $("#rangestart");
            const $rangeEnd = $("#rangeend");
            $rangeStart.calendar({
                initialDate: this.startTime ? this.startTime : null,
                endCalendar: $rangeEnd,
                onChange (value) {
                    that.startTime = dayjs(value);
                }
            });
            $rangeEnd.calendar({
                initialDate: this.endTime ? this.endTime : null,
                startCalendar: $rangeStart,
                onChange (value) {
                    that.endTime = dayjs(value);
                }
            });
            $(".ui.dropdown").dropdown();
            $("#limitClassroom").dropdown("set selected", this.classroomSelected.split(","));
            $("#limitHostname").dropdown("set selected", this.hostname.split(","));
            $("#selectedLanguage").dropdown("set selected", this.languageSelected.split(","));
            next();
        }
    },
    mounted () {
        const middleware = new Middleware();
        middleware.use(this.initData).use(this.initjQuery).commit();
    },
    watch: {
        userListText (newVal, oldVal) {
            if (oldVal === newVal) {
                return;
            }
            if (newVal.trim().length === 0) {
                this.userList = [];
            }
            else {
                this.userList = newVal.split("\n").map(el => el.trim()).filter(el => el.length > 0);
            }
            this.$nextTick(() => {
                this.$Lazyload.lazyLoadHandler();
                this.$forceUpdate();
            });
        }
    }
};
</script>

<style scoped>

</style>
