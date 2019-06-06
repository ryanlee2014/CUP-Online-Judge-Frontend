<template>
    <div class="ui container padding" v-lazy-container="{ selector: 'img' }">
        <div class="ui form">
            <div class="field">
                <label>{{$t("title")}}</label>
                <div class="two fields">
                    <div class="field">
                        <input name="title" v-model="title" placeholder="contest title" type="text">
                    </div>
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <div class="ui toggle checkbox">
                                    <input v-model="Public" @click="Public = !Public" class="hidden" tabindex="0" type="checkbox">
                                    <label>{{$t("available")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox">
                                    <input v-model="ContestMode" @click="ContestMode = !ContestMode" class="hidden" tabindex="0" type="checkbox">
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
                                <input id="startTime" @input="debug('input')" v-model="startTime" placeholder="Start" type="text">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("end time")}}</label>
                        <div class="ui calendar" id="rangeend">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="endTime" v-model="endTime" placeholder="End" type="text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="three fields">
                    <div class="field">
                        <label>{{$t("contest password")}}</label>
                        <input v-model="password" name="password" placeholder="contest password" type="text">
                    </div>
                    <div class="field">
                        <label>{{$t("limit classroom")}}</label>
                        <div class="ui fluid multiple search selection dropdown">
                            <input v-model="languageSelected" @change="languageSelected = $event.target.value" name="country" type="hidden">
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
                        <div class="ui fluid search dropdown selection" size="1">
                            <input v-model="hostname" @change="hostname=$event.target.value"
                                   type="hidden">
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
                    <div class="ui fluid multiple search selection dropdown">
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
                                <img class="ui avatar image" :data-src="`/avatar/${row}.jpg`">
                                <div class="content">
                                    <div class="header">{{row}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("selected user input")}}</label>
                        <textarea v-model="userListText"  style="min-height: 100%; height: 100%; box-sizing: border-box;">
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
const dayjs = require("dayjs");

export default {
    name: "edit",
    mixins: [mixins],
    data () {
        return {
            title: "",
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
        }
    },
    mounted () {
        const that = this;
        const $rangeStart = $("#rangestart");
        const $rangeEnd = $("#rangeend");
        $rangeStart.calendar({
            endCalendar: $rangeEnd,
            onChange (value) {
                that.startTime = dayjs(value);
            }
        });
        $rangeEnd.calendar({
            startCalendar: $rangeStart,
            onChange (value) {
                that.endTime = dayjs(value);
            }
        });
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
