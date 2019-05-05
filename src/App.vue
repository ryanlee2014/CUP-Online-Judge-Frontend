<template>
    <div id="app">
        <Navbar></Navbar>
        <router-view/>
    </div>
</template>
<script>
    import Navbar from './components/nav/Navbar'
export default {
        name: 'App',
    components: {Navbar}
}
</script>
<style>
    @import "./static/css/semantic.min.css";
    @import "./static/devicon/devicon.min.css";
    @import "./static/css/judge.css";
    @import "./static/css/home.css";
    @import "./static/css/animate.css";
    @import "./static/css/style.css";
    @import "./static/css/github-markdown.css";
    @import "./static/css/github.min.css";
    @import "./static/css/katex.min.css";

    #app {
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
