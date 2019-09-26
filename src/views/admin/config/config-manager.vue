<template>
    <div class="ui container padding">
        <modify-modal ref="modal"></modify-modal>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">

                </div>
                <div class="three wide right aligned column">
                    <button class="ui primary button" @click="activateModal('add')">
                        {{$t("add config")}}
                    </button>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>key</th>
                <th>value</th>
                <th>comment</th>
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

                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import mixins from "../../../mixin/init";
import modifyModal from "../../../components/admin/config/modify-modal";
export default {
    name: "config-manager",
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
            this.axios.get("/api/setting/devconfig/config")
                .then(({ data }) => {
                    const configList = [];
                    const baseObject = Object.assign(data.data, {});
                    Object.keys(baseObject).forEach(key => configList.push({ key, value: baseObject[key].value, comment: baseObject[key].comment }));
                    this.configList = configList;
                });
        },
        activateModal (act) {
            console.log(act);
            if (act === "add") {
                console.log(this.$refs.modal);
                console.log(this.$refs.modal.activate);
                this.$refs.modal.activate();
            }
        }
    }
};
</script>

<style scoped>

</style>
