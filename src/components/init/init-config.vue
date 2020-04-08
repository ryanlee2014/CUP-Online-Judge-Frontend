<template>
    <div class="html ui top attached segment">
        <div class="ui large form">
            <div class="ui form">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("database hostname")}}</label>
                        <input name="hostname" v-model="mysql.host" type="text">
                    </div>
                    <div class="field">
                        <label>{{$t("database port")}}</label>
                        <input name="port" v-model="mysql.port" type="text">
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("database username")}}</label>
                        <input name="user" v-model="mysql.user" type="text">
                    </div>
                    <div class="field">
                        <label>{{$t("database password")}}</label>
                        <input name="password" v-model="mysql.password" type="text">
                    </div>
                </div>
                <div class="field">
                    <label>{{$t("database")}}</label>
                    <input name="database" v-model="mysql.database" type="text">
                </div>
                <div class="field">
                    <label>{{$t("salt")}}</label>
                    <input name="salt" v-model="salt" type="text">
                </div>
                <div class="field">
                    <label>{{$t("session secret")}}</label>
                    <input name="session_secret" v-model="session_secret" type="text">
                </div>
                <div class="field">
                    <label>{{$t("judger address")}}</label>
                    <input name="judger_address" v-model="judger.address" type="text">
                </div>
                <div class="field">
                    <label>{{$t("judger data directory")}}</label>
                    <input name="judger_data_directory" v-model="judger.oj_home" type="text">
                </div>
                <div class="field">
                    <label>{{$t("compile arguments")}}</label>
                    <input name="compile_arguments" v-model="etc.compile_arguments" type="text">
                </div>
                <div class="field">
                    <label>{{$t("problem upload directory")}}</label>
                    <input name="problem_upload_directory" v-model="problem_upload_dest.dir" type="text">
                </div>
            </div>
            <button class="ui primary button" type="submit" @click.prevent="updateConfig" id="submit">{{$t("submit")}}
            </button>
            <button class="ui button" type="reset" @click.prevent="resetConfig" name="reset">{{$t("reset")}}</button>
            <div class="ui error message"></div>
            <br><br>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

let config = {};
let originalConfig = {};
@Component
export default class InitConfig extends Vue {
        mysql = {
            host: "",
            user: "",
            password: "",
            port: "",
            database: ""
        };

        salt = "";
        session_secret = "";
        judger = {
            address: "",
            oj_home: ""
        };

        etc = {
            compile_arguments: ""
        }

        problem_upload_dest = {
            dir: ""
        }

        mounted () {
            this.axios.get("/api/init/firstrun/")
                .then(({ data }) => {
                    Object.assign(this, data.data);
                    config = data.data;
                    originalConfig = JSON.parse(JSON.stringify(originalConfig));
                });
        }

        updateConfig () {
            Object.assign(config, this.$data);
            this.axios.post("/api/init/firstrun/config", { content: config })
                .then(({ data }) => {
                    this.$emit("configUpdated");
                });
        }

        resetConfig () {
            Object.assign(this, originalConfig);
        }
}
</script>

<style scoped>

</style>
