<template>
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <table class="ui celled striped table">
                    <thead>
                        <tr>
                            <th colspan="6">
                                {{$t("loginlog")}}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                {{$t("user_id")}}
                            </th>
                            <th>
                                {{$t("login time")}}
                            </th>
                            <th>
                                {{$t("browser name")}}
                            </th>
                            <th>
                                {{$t("browser version")}}
                            </th>
                            <th>
                                {{$t("os name")}}
                            </th>
                            <th>
                                {{$t("os version")}}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(dao, index) in loginLogList" :key="index">
                        <td>
                            <router-link :to="`/user/${dao.user_id}`">
                                {{dao.user_id}}
                            </router-link>
                        </td>
                        <td>
                            {{dayjs(dao.time).format("YYYY-MM-DD HH:mm:ss")}}
                        </td>
                        <td>
                            {{dao.browser_name}}
                        </td>
                        <td>
                            {{dao.browser_version}}
                        </td>
                        <td>
                            {{dao.os_name}}
                        </td>
                        <td>
                            {{dao.os_version}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import dayjs from "dayjs";

interface ILoginLogDAO {
    user_id: string,
    password: string,
    ip: string,
    time: string,
    browser_name?: string,
    browser_version?: string,
    os_name?: string,
    os_version?: string
}

@Component
export default class LoginLogPanel extends Vue {
    loginLogList: ILoginLogDAO[] = [];
    dayjs = dayjs;

    mounted () {
        this.initData();
    }

    initData () {
        this.axios.get("/api/system/log/login/latest")
            .then(({ data }) => {
                this.loginLogList = data.data;
            });
    }
}
</script>

<style scoped>

</style>
