<template>
  <div style="border-bottom:1px solid yellow; min-height: 125px;">
    <topBar />
    <nav>
      <nuxt-link to="/" class="nav-back" ref="nav-back">
        <span>back</span>
      </nuxt-link>
      <h1 v-html="group"></h1>
      <h2 v-html="subGroup"></h2>
    </nav>
  </div>
</template>

<script>
import topBar from './topBar.vue'

export default {
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup }
  },
  components: {
    topBar
  },
  watch: {
    confirmRoute: function() {
      if (this.$route.path === "/confirm") {
        alert('confirm screen')
      } else  {
        alert('not confirm screen')
      }
    }
  }
}
</script>