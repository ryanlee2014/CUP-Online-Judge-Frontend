<template>
    <div class="ui container padding">
        <modify-modal ref="modal" v-on:callback="updateConfig"></modify-modal>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">

                </div>
                <div class="three wide right aligned column">
                    <button class="ui primary button" @click="activateModal('add')">
                        {{$t(`add ${prefix}`)}}
                    </button>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th width="26%">key</th>
                <th width="26%">value{{range}}</th>
                <th width="26%">comment</th>
                <th>action</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.key" v-for="(row) in configList">
                <td>
                    {{row.key}}
                </td>
                <td>
                    {{row.value}}
                </td>
                <td>
                    {{row.comment}}
                </td>
                <td>
                    <button class="ui tiny primary button" @click="activateModal('edit', row)">Modify</button>
                    <button class="ui tiny secondary button" @click="removeConfig(row.key)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">

import mixins from "../../../mixin/init";
import modifyModal from "./modify-modal.vue";
import { Prop, Mixins, Component } from "vue-property-decorator";
@Component({
    components: {
        modifyModal
    }
})
export default class BaseManager extends Mixins(mixins) {
    @Prop({ default: "config" }) prefix!: string;
    @Prop({ default: "" }) range!: string;
    configList = [];
    $refs: any;
    mounted () {
        this.init();
    }

    init () {
        this.axios.get(`/api/setting/devconfig/${this.prefix}`)
            .then(({ data }) => {
                const configList: any = [];
                const baseObject = Object.assign(data.data, {});
                Object.keys(baseObject).forEach(key => configList.push({ key, value: baseObject[key].value, comment: baseObject[key].comment }));
                this.configList = configList;
            });
    }

    activateModal (act: string, payload: any) {
        if (act === "add") {
            this.$refs.modal.activate();
        }
        else if (act === "edit") {
            this.$refs.modal.activate(payload);
        }
    }

    updateConfig (payload: any) {
        this.axios.post(`/api/setting/devconfig/${this.prefix}/update`, payload)
            .then(({ data }) => {
                this.$refs.modal.deactivate();
                alert("更新成功");
                setTimeout(() => { this.init(); }, 1000);
            })
            .catch(({ data }) => {
                alert("更新失败");
            });
    }

    removeConfig (key: any) {
        this.axios.post(`/api/setting/devconfig/${this.prefix}/delete`, { key })
            .then(() => {
                alert("删除成功");
                setTimeout(() => { this.init(); }, 1000);
            })
            .catch(() => {
                alert("删除失败");
                setTimeout(() => { this.init(); }, 1000);
            });
    }
}
</script>

<style scoped>

</style>
