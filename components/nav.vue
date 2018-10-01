<template>
  <div style="padding-bottom: 10px;" ref="topBar">
    <topBar />
    <nav v-bind:style="{navTopPadding}">
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
  components: {
    topBar
  },
  data() {
    return {
      navTopPadding: '',
      showModal:  false,
      allData:    []
    }
  },
  mounted() {
    this.radicalHeight();
  },
  methods: {
    radicalHeight() {
      this.navTopPadding = `${this.$refs.topBar.clientHeight - 10}px`;
    }
  },
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup }
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