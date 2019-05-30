<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="ui column">
                    <div class='ui toggle checkbox refresh'>
                        <input type='checkbox' v-model="refresh">
                        <label>停止自动刷新</label>
                    </div>
                    <div class='ui toggle checkbox sort'>
                        <input type='checkbox'>
                        <label>自动排序</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui grid">
            <div class="row">
                <addressList></addressList>
                <userList></userList>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../mixin/init"
import addressList from "../components/online/addressList"
import userList from "../components/online/userList"
export default {
  name: "online",
  mixins: [mixins],
  data: () => {
    return {
      refresh: localStorage.getItem("refresh") === "true"
    }
  },
  components: {
    addressList,
    userList
  },
  mounted () {
    document.title = `Online user -- ${document.title}`
  },
  updated () {

  }
}
</script>

<style scoped>

</style>
