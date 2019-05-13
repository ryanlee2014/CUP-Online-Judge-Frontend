<template>
    <div class="ui flowing popup hidden dropdown_menu_group">
        <div class='ui two column grid'>
            <div class='row'>
                <div class='column'><img class='ui small image' :src="img_url">
                    <h4 class='ui header'>{{user_id}}
                        <div class='sub header'>{{nick}}</div>
                    </h4>
                    <p><i class='yen sign icon'></i>0</p></div>
                <div class='column'>
                    <div class='ui link list'><a class='item' href='/modifypage.php'><i
                            class='edit icon'></i>修改帐号</a><br>
                        <a class='item' href='/userinfo.php?user=2016011253'><i
                                class='archive icon'></i>个人信息</a><br>
                        <a class='item' href='/status.php?user_id=2016011253'><i
                                class='send icon'></i>我的提交</a><br>
                        <a class='item'><i
                                class='book icon'></i>我的竞赛&作业</a><br>
                        <a class='logout item' @click.prevent="logout"><i
                                class='remove user icon'></i>注销</a>&nbsp;<br>
                        <a v-if="admin" class='item' href="/admin/">
                            <i class='write icon'></i>管理</a>&nbsp;<br>
                        <a v-if="admin" class='item' href=announce.php><i
                                class='send outline icon'></i>在线用户推送</a>&nbsp;
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '../../../store'
    export default {
        name: "ProfileCard",
        props: {
            user_id: String,
            nick: String,
            avatar: {
                type: Boolean,
                default: false
            },
            admin: {
                type: Boolean,
                default: false
            }
        },
        data: function() {
            return {}
        },
        computed: {
            img_url: function() {
                if(this.avatar && this.user_id.length > 0) {
                    return "/avatar/" + this.user_id + ".jpg";
                }
                else {
                    return "/assets/images/wireframe/white-image.png";
                }
            }
        },
        methods: {
            logout: function() {
                this.axios.get("/api/logout")
                    .then(response => {
                        if(response.data.status === "OK") {
                            sessionStorage.isLogined = false;
                            store.commit("loginMutate", {login: false});
                            location.reload();
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>
