<template>
    <div class="ui bottom attached segment">
        <table style="width:100%" class="ui padded borderless selectable table">
            <thead>
            <tr>
                <th width="7%" class="center head">{{$t("rank")}}</th>
                <th width="10%" class="center head"><b>{{$t("user_id")}}</b></th>
                <th width="5%"></th>
                <th width="15%"><b>{{$t("nick")}}</b></th>
                <th width="53%" class="center head">{{$t("biography")}}</th>
                <th width="10%" class="center head" style="text-align: center"><b>{{$t("accept")}}</b></th>
            </tr>
            </thead>
            <tbody>
            <tr :key="key" v-for="(row,key,index) in content">
                <td class="center head">{{page*50+key+1}}</td>
                <td class="center head">
                    <router-link :to="`/user/${row.user_id}`">
                        {{row.user_id}}
                    </router-link>
                </td>
                <td>
                    <img class="ui avatar image" :src="getAvatarURL(row)"
                         style="object-fit: cover;">
                </td>
                <td>
                    {{convertHTML(row.nick)}}
                </td>
                <td class="center head" v-html="markdownIt.renderRaw(row.biography||'')"></td>
                <td class="center head" style="text-align: center">
                    <router-link :to="`/status?user_id=${row.user_id}&jresult=4`">{{row.solved || 0}}</router-link>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import markdownIt from "../../../lib/markdownIt/markdownIt";
import avatarMixin from "../../../mixin/avatarMixin";
export default {
    name: "tableCard",
    mixins: [avatarMixin],
    props: {
        _name: {
            type: Object,
            default: () => {
                return {};
            }
        },
        content: {
            type: Array,
            default: () => []
        },
        page: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            markdownIt
        };
    },
    methods: {
        convertHTML: function (str) {
            const doc = document.createElement("div");
            doc.innerHTML = str;
            return doc.innerText;
        }
    }
};
</script>

<style scoped>

</style>
