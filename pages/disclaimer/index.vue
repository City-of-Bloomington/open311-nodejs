<template>
  <div class="disclaimer">
    <div class="top" ref="top" style="background: red;">
      <div class="container">
        <div @click="$router.back()">close</div>
      </div>
    </div>

    <main v-bind:style="{paddingTop}">
      <h1>uReport: Disclaimer</h1>

      <h2>Please Note:</h2>
      <p><strong><i>This system is not for reporting emergencies or imminent safety hazards.</i></strong></p>

      <p>If this is an emergency, please immediately dial <strong>911</strong> for assistance.</p>

      <p>If this is a safety hazard that could cause an injury, please immediately call <strong>City Utilities Control at 812-339-1444</strong>.</p>

      <p>This number is staffed 24 hours a day. The appropriate staff will be dispatched to address the safety hazard.</p>

      <p>When in doubt, please call, even if you are not sure.</p>

      <p>You may also send an e-mail directly to info@bloomington.in.gov, or call the City at <strong>812.349.3400</strong>.</p>
    </main>
  </div>
</template>

<script>
import headerNav from '~/components/nav.vue'

export default {
  head () {
    return {
      titleTemplate: `%s - Disclaimer!`
    }
  },
  components: {},
  data() {
    return {
      paddingTop: '',
      previousRoute: null,
    }
  },
  mounted() {
    this.topHeight();
    console.dir(this.$router);
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.$refs.top.clientHeight + 50}px`;
    }
  },
  computed: {}
}
</script>