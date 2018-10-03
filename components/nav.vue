<template>
  <div>
    <topBar />

    <div class="progress-stepper" v-bind:style="{top}" ref="psHeight">
      <span>Progress:</span>
      <div v-bind:class="{ active: stepActive.one, 'complete': stepComplete.one }">1</div>
      <div v-bind:class="{ active: stepActive.two, 'complete': stepComplete.two }">2</div>
      <div v-bind:class="{ active: stepActive.three, 'complete': stepComplete.three }">3</div>
      <div v-bind:class="{ active: stepActive.four, 'complete': stepComplete.four }">4</div>
      <div v-bind:class="{ active: stepActive.five, 'complete': stepComplete.five }">5</div>
    </div>

    <nav v-bind:style="{top: stepperHeight + 'px'}" ref="nHeight">
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
  props: ['stepActive','stepComplete'],
  components: {
    topBar
  },
  data() {
    return {
      top:           '',
      navHeight:     '',
      stepperHeight: '',
      showModal:     false,
      allData:       []
    }
  },
  mounted() {
    this.navTopSpacing();
    this.nHeight();
    this.psHeight();
  },
  methods: {
    navTopSpacing() {
      this.top = `${this.topbarHeight}px`;
    },
    nHeight() {
      this.navHeight = this.$refs.nHeight.clientHeight;
      return this.$store.commit('storeNavHeight', this.navHeight)
    },
    psHeight() {
      this.stepperHeight = this.$refs.psHeight.clientHeight;
      return this.$store.commit('storeStepperHeight', this.stepperHeight)
    }
  },
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup },
    topbarHeight() { return this.$store.getters.topbarHeight }
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