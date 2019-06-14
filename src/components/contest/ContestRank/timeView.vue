<template>
    <h3 class="ui header">
        当前时间:{{current_time}}
        <div class="sub header" v-if="start_time">
            起始时间:{{dayjs(start_time).format("YYYY-MM-DD HH:mm:ss")}},
            {{format_time(dayjs().diff(start_time,"second"))}}
        </div>
    </h3>
</template>

<script>
const dayjs = require("dayjs");
export default {
    name: "timeView",
    props: {
        start_time: {
            type: Object,
            default: dayjs()
        }
    },
    data: function () {
        return {
            current_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            dayjs
        };
    },
    mounted: function () {
        let that = this;
        setInterval(function () {
            that.current_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
        }, 1000);
    },
    methods: {
        format_time: function (second) {
            let arr = ["还有", "已经过"];
            let passed = Number(second > 0);
            return arr[passed] + this.format_date(second);
        },
        format_date: function (second, mode = 0) {
            let fill_zero = function (str) {
                if (str.length < 2) {
                    return "0" + str;
                }
                else {
                    return str;
                }
            };
            second = Math.abs(second);
            let hour = String(parseInt(second / 3600));
            hour = fill_zero(hour);

            let minute = String(parseInt((second - hour * 3600) / 60));
            minute = fill_zero(minute);
            let sec = String(second % 60);
            sec = fill_zero(sec);
            if (mode) {
                return hour + " : " + minute + " : " + sec;
            }
            else {
                return hour + ":" + minute + ":" + sec;
            }
        }
    }
};
</script>

<style scoped>

</style>
