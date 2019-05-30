<template>
    <div>
        <h2 class="ui dividing header">私有竞赛/作业</h2>
        <form class="ui form" id='contest_form' method='post'>
            <div class="fields">
                <div class="six wide field">
                    <label>请输入密码</label>
                    <input class="input-mini" id='contest_pass' name="password" type="password">
                </div>
            </div>
            <input class='ui primary button' type="submit">
        </form>
    </div>
</template>

<script>
const $ = require("jquery");
export default {
    name: "LoginForm",
    data: function () {
        return {};
    },
    mounted: function () {
        var that = this;
        $("#contest_form").submit(() => {
            $.post("/api/contest/password/" + this.$route.params.contest_id, {
                password: $("#contest_pass").val()
            }, function (data) {
                if (data.status == "OK") {
                    that.$parent.mode = 0;
                } else {
                    alert(data.statement);
                }
            });
            return false;
        });
    }
};
</script>

<style scoped>

</style>
