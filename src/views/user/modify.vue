<template>
    <div class="ui container pusher">
        <div class="padding">
            <div class="ui grid">
                <div class="five wide column">
                    <div class="row">
                        <div class="ui card" style="width: 100%">
                            <div class="image">
                                <v-gravatar :hostname="$store.getters.gravatarCDN" :email="email" :size="324"></v-gravatar>
                            </div>
                            <div class="content">
                                <div class="header">
                                    Gravatar头像
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="img_src.length > 0">
                        <div class="column">
                            <div class="ui card" style="width: 100%">
                                <div class="image">
                                    <img v-lazy="img_src" id="head">
                                </div>
                                <div class="content">
                                    <div class="header">
                                        原头像
                                    </div>
                                    <div class="meta">
                                        已停用，请根据提示迁移到Gravatar头像
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="eleven wide column">
                    <form method="post">
                        <div class="ui top attached block header">{{$t("update information")}}</div>
                        <div class="ui bottom attached segment">
                            <table style="margin: auto; width: 100%;">
                                <div class="ui form">
                                    <div class="two fields">
                                        <div class="field">
                                            <label>{{$t("user_id")}}</label>
                                            <div class="ui disabled input">
                                                <input :value="user_id" size=50 type=text>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <label>{{$t("nick")}}</label>
                                            <input name="nick" size=50 type=text v-model="nick">
                                        </div>
                                    </div>
                                    <div class="three fields">
                                        <div class="field">
                                            <label>Old Password</label>
                                            <input name="opassword" placeholder="请输入密码后更改其他信息" size=20 type=password
                                                   v-model="password">
                                        </div>
                                        <div class="field">
                                            <label>New Password</label>
                                            <input name="npassword" size=20 type=password v-model="newpassword">
                                        </div>
                                        <div class="field">
                                            <label>Repeat New Password</label>
                                            <input name="rptpassword" size=20 type=password v-model="repeatpassword">
                                        </div>
                                    </div>
                                    <div class="two fields">
                                        <div class="field">
                                            <label>{{$t("school")}}</label>
                                            <input name="school" size=30 type=text v-model="school">
                                        </div>
                                        <div class="field">
                                            <label>{{$t("email")}}</label>
                                            <input name="email" size=30 type=text v-model="email">
                                        </div>
                                    </div>
                                    <div class="two fields">
                                        <div class="field">
                                            <label>找回密码问题</label>
                                            <input name="confirmquestion" size=30 type=text v-model="confirmquestion">
                                        </div>
                                        <div class="field">
                                            <label>找回密码答案</label>
                                            <input name="confirmanswer" size=30 type=text v-model="confirmanswer">
                                        </div>
                                    </div>
                                    <div class="two fields">
                                        <div class="field">
                                            <label>{{$t("blog")}}</label>
                                            <input name="blog" type="text" v-model="blog">
                                        </div>
                                        <div class="field">
                                            <label>GitHub</label>
                                            <input name="github" type="text" v-model="github">
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>头像(请使用邮箱注册 <a href="https://zh-cn.wordpress.com/" target="_blank">WordPress.com</a>，登录 <a href="https://cn.gravatar.com/" target="_blank">Gravatar</a> 并上传头像。头像与你的邮箱绑定。该邮箱在右上“邮箱”输入框修改。)</label>
                                        <input name="" type="text" :value="email" disabled>
                                    </div>
                                    <div class="field">
                                        <label>{{$t("biography")}}(支持markdown语法)</label>
                                        <mavon-editor v-model="biography" :markInstance="markdownIt"></mavon-editor>
                                        <input name="biography" type="text" v-model="biography">
                                    </div>
                                    <div class="fields">
                                        <div class="field">
                                            <label></label>
                                            <input @click.prevent="updateInformation" class="ui primary button"
                                                   name="submit" type="submit"
                                                   value="Submit">
                                        </div>
                                        <div class="field">
                                            <label></label>
                                            <input @click.prevent="reset" class="ui secondary button" name="reset"
                                                   type="reset"
                                                   value="Reset">
                                        </div>
                                    </div>
                                </div>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <br>
        <br>
    </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import util from "../../lib/util";
import mixins from "../../mixin/init";
import markdownIt from "@/lib/markdownIt/markdownIt";
import { Component, Mixins, Watch } from "vue-property-decorator";
@Component({
    computed: {
        ...mapGetters(["user_id"])
    }
})
export default class UserInfoModify extends Mixins(mixins) {
    user_id?: string;
    blog= "";
    github= "";
    biography= "";
    confirmquestion= "";
    confirmanswer= "";
    password= "";
    newpassword= "";
    repeatpassword= "";
    dirty= false;
    email= "";
    school= "";
    nick= "";
    avatar= false;
    avatarUrl= "";

    markdownIt = markdownIt;

    created () {
        this.nick = this.$store.getters.nick;
        this.avatar = this.$store.getters.avatar;
        this.avatarUrl = util.stringify(this.$store.getters.avatarUrl || "");
    }

    mounted () {
        this.axios.get(`/api/user/${this.user_id}`)
            .then(({ data }) => {
                Object.assign(this, data.data.information);
            });
        this.axios.get("/api/reset/password")
            .then(({ data }) => {
                if (data.status === "OK") {
                    this.confirmquestion = data.data;
                }
            });
    }

    updateInformation () {
        this.axios.post("/api/user/update/profile", this.$data)
            .then(({ data }) => {
                this.$store.dispatch("NavStatus");
                alert("更改成功");
            })
            .catch(({ data }) => {
                alert("服务器遇到错误: \n" + data.statement);
            });
    }

    reset () {
        location.reload();
    }

    refreshImage () {
        if (this.dirty) {
            this.dirty = false;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$Lazyload.lazyLoadHandler();
                    this.$forceUpdate();
                }, 0);
            });
        }
    }

    @Watch("avatarUrl")
    onAvatarUrlChanged () {
        this.refreshImage();
    }

    @Watch("img_src")
    onImageSrcChanged () {
        this.refreshImage();
    }

    get img_src () {
        const avatarUrl = util.stringify(this.avatarUrl);
        if (this.avatar && !(avatarUrl.length > 0)) {
            return `/avatar/${this.user_id}.jpg`;
        }
        else if (avatarUrl.length > 0) {
            return avatarUrl;
        }
        else {
            return "";
        }
    }

    set img_src (val: string) {
        if (val !== this.avatarUrl) {
            this.dirty = true;
            this.avatarUrl = val.trim();
        }
    }
}
</script>

<style scoped>

</style>
