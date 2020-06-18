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

<script lang="ts">
import jquery from "jquery";
import Vue from "vue";
import { Component } from "vue-property-decorator";
const $: any = jquery;
@Component
export default class LoginForm extends Vue {
    $parent: any;
    mounted () {
        $("#contest_form").submit(() => {
            this.axios.post(`/api/contest/password/${this.$route.params.contest_id}`, {
                password: $("#contest_pass").val()
            })
                .then(({ data }) => {
                    this.$parent.mode = 0;
                })
                .catch(({ data }) => {
                    alert(data.statement);
                });
            return false;
        });
    }
}
</script>

<style scoped>

</style>
