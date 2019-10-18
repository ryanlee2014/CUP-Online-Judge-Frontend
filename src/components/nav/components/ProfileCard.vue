<template>
    <div class="ui flowing popup hidden dropdown_menu_group">
        <div class='ui two column grid'>
            <div class='row'>
                <div class='column'><img :src="img_url" class='ui small image'>
                    <h4 class='ui header'>{{user_id}}
                        <div class='sub header'>{{nick}}</div>
                    </h4>
                    <p><i class='yen sign icon'></i>0</p></div>
                <div class='column'>
                    <div class='ui link list'>
                        <router-link class="item" to="/user/self/info/modify">
                            <i class='edit icon'></i>修改帐号
                        </router-link>
                        <br>
                        <router-link to="/myinfo" class="item">
                            <i class='archive icon'></i>个人信息
                        </router-link>
                        <br>
                        <router-link :to="`/status/?user_id=${user_id}`" class="item">
                            <i class='send icon'></i>我的提交
                        </router-link>
                        <br>
                        <router-link class="item" to="/contest?myContest">
                            <i class='book icon'></i>我的竞赛&作业
                        </router-link>
                        <br>
                        <a @click.prevent="logout" class='logout item'><i
                            class='remove user icon'></i>注销</a>&nbsp;<br>
                        <router-link class="item" to="/admin">
                            <i class='write icon'></i>管理
                        </router-link>
                        &nbsp;<br>
                        <router-link class="item" to="/extra/broadcast" v-if="admin"><i
                            class='send outline icon'></i>在线用户推送
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "../../../store";
import util from "../../../lib/util";

export default {
    name: "ProfileCard",
    props: {
        user_id: {
            type: String,
            default: ""
        },
        nick: {
            type: String,
            default: ""
        },
        avatar: {
            type: Boolean,
            default: false
        },
        admin: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {};
    },
    computed: {
        img_url: function () {
            return util.getAvatarURL({ user_id: this.user_id, avatar: this.avatar, avatarUrl: this.$store.getters.avatarUrl });
        }
    },
    methods: {
        logout: function () {
            this.axios.get("/api/logout")
                .then(response => {
                    if (response.data.status === "OK") {
                        sessionStorage.isLogined = false;
                        store.commit("loginMutate", { login: false });
                        location.reload();
                    }
                });
        }
    },
    updated () {
        util.bindDropdown();
    }
};
</script>

<style scoped>

</style>
