<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">Version Control</h2>
        <div class="ui grid">
            <div class="row">
                <h3 class="ui header">
                    前端组件
                </h3>
            </div>
            <div class="row">
                <h3 class="ui header">
                    当前版本
                </h3>
            </div>
            <div class="row">
                <div class="ui card">
                    <RepoInfoCard>
                        <template v-slot:header>
                            {{currentFrontendInfo.version}}
                        </template>
                        <template v-slot:meta>
                        </template>
                    </RepoInfoCard>
                </div>
            </div>
            <div class="row">
                <h3 class="ui header">
                    仓库分支版本
                </h3>
            </div>
            <div class="row">
                <div class="ui cards">
                    <RepoInfoCard :key="key" v-for="(row, key) in frontendBranch">
                        <template v-slot:header>
                            {{row.name}}
                        </template>
                        <template v-slot:meta>
                            {{row.version}}
                        </template>
                        <template v-slot:content>

                        </template>
                    </RepoInfoCard>
                </div>
            </div>
            <div class="row">
                <h3 class="ui header">
                    后端组件
                </h3>
            </div>
            <div class="row">
                <h3 class="ui header">
                    当前版本
                </h3>
            </div>
            <div class="row">
                <div class="ui card">
                    <RepoInfoCard>
                        <template v-slot:header>
                            {{currentBackendInfo.version}}
                        </template>
                        <template v-slot:meta>
                        </template>
                    </RepoInfoCard>
                </div>
            </div>
            <div class="row">
                <h3 class="ui header">
                    仓库分支版本
                </h3>
            </div>
            <div class="row">
                <div class="ui cards">
                    <RepoInfoCard :key="key" v-for="(row, key) in backendBranch">
                        <template v-slot:header>
                            {{row.name}}
                        </template>
                        <template v-slot:meta>
                            {{row.version}}
                        </template>
                        <template v-slot:content>

                        </template>
                    </RepoInfoCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../mixin/init";
import RepoInfoCard from "@/components/system/repoInfoCard.vue";
import Package from "../../../package.json";
@Component({
    components: {
        RepoInfoCard
    }
})
export default class GithubRepoInfo extends Mixins(InitMixin) {
    frontendBranch: any[] = [];
    backendBranch: any[] = [];
    currentFrontendInfo = Package;
    currentBackendInfo: any = {};
    [id: string]: any;
    frontendRepo = "ryanlee2014/CUP-Online-Judge-NG-Frontend";
    backendRepo = "CUP-ACM-Programming-Club/CUP-Online-Judge-Express";
    mounted () {
        this.initFrontendData();
        this.initBackendData();
    }

    buildBranchAPIUrl (repo: string) {
        return `https://api.github.com/repos/${repo}/branches?timestamp=${Date.now()}`;
    }

    buildVersion (repo: string, githubData: any[]) {
        const resolveArray: any[] = [];
        githubData.forEach((e) => {
            const resolve = this.axios.get(this.buildJsDelivrLink(repo, e.name))
                .then(({ data }) => {
                    e.version = data.version;
                    return e;
                });
            resolveArray.push(resolve);
        });
        return Promise.all(resolveArray);
    }

    baseInitData (repo: string, branchKey: string) {
        this.axios.get(this.buildBranchAPIUrl(repo))
            .then(({ data }) => {
                return this.buildVersion(repo, data);
            })
            .then(data => {
                data.sort((a: any, b: any) => {
                    return a.version < b.version ? 1 : a.version > b.version ? -1 : 0;
                });
                return data;
            })
            .then(data => {
                this[branchKey] = data;
            });
    }

    initFrontendData () {
        this.baseInitData(this.frontendRepo, "frontendBranch");
    }

    initBackendData () {
        this.baseInitData(this.backendRepo, "backendBranch");
        this.getBackendVersion();
    }

    getBackendVersion () {
        this.axios.get("/api/system/config/version_control/version")
            .then(({ data }) => {
                this.currentBackendInfo = this.buildVersionPackage(data.data);
            });
    }

    buildVersionPackage (version: string) {
        return { version };
    }

    buildJsDelivrLink (repo: string, branch: string) {
        return `https://cdn.jsdelivr.net/gh/${repo}@${branch}/package.json?timestamp=${Date.now()}`;
    }
}
</script>

<style scoped>

</style>
