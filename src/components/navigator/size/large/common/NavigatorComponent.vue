<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <div class="ui dropdown item" tabindex="0">
                <div class="text">{{$t("general")}}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>{{$t("home")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/problemset"><i class="browser icon"></i>{{$t("problemset")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/status"><i
                        class="tasks icon"></i>{{$t("history")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/ranklist"><i class="trophy icon"></i>{{$t("ranklist")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/discuss"><i
                        class="comment alternate icon"></i>{{$t("discuss")}}
                    </router-link>
                    <div class="item" tabindex="0">
                        <i class="right dropdown icon"></i>
                        <div class="text">
                            <i class="keyboard icon"></i>
                            {{$t("contest")}}&amp;{{$t("homework")}}
                        </div>
                        <div class="menu">
                            <router-link class="item" exact-active-class="active" to="/contest"><i class="puzzle icon"></i>{{$t("contest")}}&amp;{{$t("homework")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/topic">
                                <i class="paperclip icon"></i>
                                {{$t("contest topic")}}
                            </router-link>
                        </div>
                    </div>
                    <div class=" item" tabindex="0"><i class="right dropdown icon"></i>
                        <div class="text"><i class="options icon"></i>{{$t("feature")}}</div>
                        <div class="menu">
                            <router-link class="item" exact-active-class="active" to="/faq"><i class="help icon"></i>{{$t("faq")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/extra/software"><i
                                class="plug icon"></i>{{$t("useful")}}{{$t("software")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/extra/whiteboard"><i
                                class="calendar outline icon"></i>{{$t("whiteboard")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/about/fame"><i
                                class="chess queen icon"></i>{{$t("hall of fame")}}
                            </router-link>
                            <a href="https://docs.cupacm.com" class="item" target="_blank"><i class="book icon"></i>{{$t("cupacm docs")}}</a>
                        </div>
                    </div>
                </div>
            </div>
            <slot name="content"></slot>
            <SocketMenu :connected="connected" :judger="judger" :logined="logined" :nick="nick" :user="user"
            ></SocketMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import SocketMenu from "@/components/navigator/components/SocketMenu.vue";
import MenuMixin from "@/mixin/menu/MenuMixin";
@Component({
    components: {
        SocketMenu
    }
})
export default class NavigatorComponent extends Mixins(MenuMixin) {

}
</script>

<style scoped>

</style>
