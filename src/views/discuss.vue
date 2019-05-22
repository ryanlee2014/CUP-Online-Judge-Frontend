<template>
    <ContestMode v-if="contest_mode"></ContestMode>
    <div class="ui container padding" v-else>
        <h2 class="ui dividing header">Discuss</h2>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                    <div class="ui search">
                        <div class="ui icon input">
                            <input class="prompt" type="text" placeholder="搜索标题" v-model="search">
                            <i class="search icon"></i>
                        </div>
                        <div class="results"></div>
                    </div>
                </div>
                <div class="three wide right aligned column">
                    <a href="/newdiscusspost.php" target="_blank" class="ui labeled icon blue mini button">
                        <i class="write icon"></i>
                        Post
                    </a>
                </div>
            </div>
            <div class="row">
                <div id="word-cloud">

                </div>
            </div>
        </div>
        <table class="ui very basic center aligned table" v-cloak>
            <thead>
            <th width="5%">ID</th>
            <th width="40%">Title</th>
            <th>Author</th>
            <th>Create Time</th>
            <th>Modify Time</th>
            <th>Latest Post</th>
            </thead>
            <tbody>
            <tr :key="key" v-for="(row,key) in table">
                <td>{{row.article_id}}</td>
                <td>
                    <router-link :to="`/discuss/thread/${row.article_id}`">
                        {{row.title}}
                    </router-link>
                </td>
                <td>
                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                </td>
                <td>{{dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}}</td>
                <td>{{dayjs(row.edit_time).format("YYYY-MM-DD HH:mm:ss")}}</td>
                <td>{{dayjs(row.last_post).format("YYYY-MM-DD HH:mm:ss")}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import ContestMode from '../components/contestMode/block'
    const $ = require("jquery");
    window.$ = window.jQuery = $;
    const dayjs = require("dayjs");
    require("../static/js/semantic.min");
    import mixins from '../mixin/init'
    export default {
        name: "discuss",
        mixins: [mixins],
        components: {
            ContestMode
        },
        data:function(){
            return {
                page:parseInt(this.$route.hash.page)||0,
                table_val:[],
                total:0,
                search:"",
                contest_mode:false,
                dayjs
            }
        },
        watch:{
            search:function(newVal,oldVal) {
                var that = this;
                var page = this.page * 20;
                var url = "/api/discuss/";
                if(newVal && newVal.length > 0) {
                    url += "search/" + newVal;
                }
                url += "?page=" + page;
                $.get(url,function(data){
                    if(data.contest_mode) {
                        that.contest_mode = true;
                        return;
                    }
                    if(data.discuss) {
                        that.table = data;
                    }
                    else {
                        that.table = {
                            discuss:data.data
                        }
                    }
                })
            }
        },
        created:function(){

        },
        mounted:function(){
            document.title = `Discuss -- ${document.title}`;
            var page = this.page * 20;
            var that = this;
            $.get("/api/discuss?page="+page,function(data){
                if(data.contest_mode) {
                    that.contest_mode = true;
                    return;
                }
                that.table = data;
            });
            $.get("/api/discuss?page="+page,function(data){
                if(data.contest_mode) {
                    that.contest_mode = true;
                    return;
                }
                that.table = data;
            });
        },
        methods:{

        },
        computed:{
            table:{
                get:function(){
                    return this.table_val;
                },
                set:function(data){
                    this.total = parseInt(data.total);
                    this.table_val = data.discuss;
                }
            }
        }
    }
</script>

<style scoped>

</style>
