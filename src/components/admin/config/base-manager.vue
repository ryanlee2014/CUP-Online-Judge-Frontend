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
                    <button class="ui tiny secondary button">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import mixins from "../../../mixin/init";
import modifyModal from "./modify-modal";
export default {
    name: "base-manager",
    props: {
        prefix: {
            type: String,
            default: "config"
        },
        range: {
            type: String,
            default: ""
        }
    },
    mixins: [mixins],
    components: {
        modifyModal
    },
    data () {
        return {
            configList: []
        };
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.axios.get(`/api/setting/devconfig/${this.prefix}`)
                .then(({ data }) => {
                    const configList = [];
                    const baseObject = Object.assign(data.data, {});
                    Object.keys(baseObject).forEach(key => configList.push({ key, value: baseObject[key].value, comment: baseObject[key].comment }));
                    this.configList = configList;
                });
        },
        activateModal (act, payload) {
            console.log(act);
            if (act === "add") {
                this.$refs.modal.activate();
            }
            else if (act === "edit") {
                this.$refs.modal.activate(payload);
            }
        },
        updateConfig (payload) {
            this.axios.post(`/api/setting/devconfig/${this.prefix}/update`, payload)
                .then(({ data }) => {
                    this.$refs.modal.deactivate();
                    if (data.status === "OK") {
                        alert("更新成功");
                        setTimeout(() => { this.init(); }, 1000);
                    }
                    else {
                        alert("更新失败");
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
