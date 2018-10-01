<template>
  <div>
    <topBar />
    <nav v-bind:style="{top}" ref="nHeight">
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
      top:       '',
      navHeight: '',
      showModal:  false,
      allData:    []
    }
  },
  mounted() {
    this.navTopSpacing();
    this.nHeight();
  },
  methods: {
    navTopSpacing() {
      this.top = `${this.headerHeight}px`;
    },
    nHeight() {
      this.navHeight = this.$refs.nHeight.clientHeight;
      return this.$store.commit('storeNavHeight', this.navHeight)
    }
  },
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup },
    headerHeight() { return this.$store.getters.headerHeight }
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