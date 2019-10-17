<template>
    <div class="ui raised segment">
        <h1></h1>
        <h2 class="ui header" style="text-align:center"><i class="star outline icon"></i>Contest {{cid}}</h2>
        <h2 class="ui header" style="text-align:center">{{title}}</h2>
        <p>{{description}}</p>
        <!--2018年 中国石油大学（北京）团委 不发ICPC/CCPC奖学金-->
        <div style="text-align: center;">Start Time {{start_time.format("YYYY-MM-DD HH:mm:ss")}}
            <br> &nbsp;Now&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id=nowdate>{{now.format("YYYY-MM-DD HH:mm:ss")}}</span>
            <br>End Time&nbsp;&nbsp;{{end_time.format("YYYY-MM-DD HH:mm:ss")}}
        </div>
        <div :class="'ui top right attached label ' + (private_contest ?'red':'green')">{{ private_contest
            ?'Private':'Public'}}
        </div>
        <div :class="'ui top left attached ' + (now.isAfter(end_time)?'red':now.isBefore(start_time)?'grey':'green') + ' label'">
            <span class="red" v-if="now.isAfter(end_time)">Ended</span>
            <span class="red" v-else-if="now.isBefore(start_time)">Pending</span>
            <span class="green" v-else>Running</span></div>
        <div style="text-align: center;">
            <div class="row padding">
                <div class="ui buttons mini">
                    <a :href="'/copystatus.php?cid='+cid" class="ui button orange" v-if="admin">判重表</a>
                    <a :href="'/copymap.php?cid='+cid" class="ui button yellow" v-if="admin">判重图</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const dayjs = require("dayjs");
export default {
    name: "ProblemView",
    props: {
        start_time: {
            type: Object,
            default: dayjs()
        },
        end_time: {
            type: Object,
            default: dayjs()
        },
        description: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        admin: {
            type: Boolean,
            default: false
        },
        private_contest: {
            type: Boolean,
            default: false
        },
        cid: {
            type: Number,
            default: 0
        }
    },
    data: function () {
        return {
            now: dayjs()
        };
    },
    mounted: function () {
        setInterval(() => {
            this.now = dayjs();
        }, 1000);
    },
    methods: {}
};
</script>

<style scoped>

</style>
