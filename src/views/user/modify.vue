<template>
    <div class="ui container pusher">
        <div class="padding">
            <div class="ui grid">
                <div class="five wide column">
                    <div class="column">
                        <div class="ui card" style="width: 100%">
                            <div class="image">
                                <img v-lazy="img_src" id="head">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="eleven wide column">
                    <form method="post">
                        <div class="ui top attached block header">Update Information</div>
                        <div class="ui bottom attached segment">
                            <table style="margin: auto; width: 100%;">
                                <div class="ui form">
                                    <div class="two fields">
                                        <div class="field">
                                            <label>User ID</label>
                                            <div class="ui disabled input">
                                                <input :value="user_id" size=50 type=text>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <label>Nick Name</label>
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
                                            <label>School</label>
                                            <input name="school" size=30 type=text v-model="school">
                                        </div>
                                        <div class="field">
                                            <label>Email</label>
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
                                            <label>Blog</label>
                                            <input name="blog" type="text" v-model="blog">
                                        </div>
                                        <div class="field">
                                            <label>GitHub</label>
                                            <input name="github" type="text" v-model="github">
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>AvatarURL(可使用外链,若需要自行上传,请参考<router-link to="/discuss/thread/15">如何使用图床</router-link>并将链接贴在下面)</label>
                                        <input name="avatarUrl" type="text" v-model="avatarUrl">
                                    </div>
                                    <div class="field">
                                        <label>Biography(支持markdown语法)</label>
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
                if (data.status === "OK") {
                    this.$store.dispatch("NavStatus");
                    alert("更改成功");
                }
                else {
                    alert("服务器遇到错误: \n" + data.statement);
                }
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
            return "https://semantic-ui.com/images/wireframe/square-image.png";
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
