<template>
  <div class="disclaimer" v-if="showDisclaimer">
    <div class="top" ref="top" style="padding: 0; height: 52px; display: flex; justify-content: center;">
      <div class="container">
        <h1>uReport: Disclaimer</h1>
        <div @click="showingDisclaimer(false)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.994 14.994"><title>close</title><g id="close-icon" data-name="close-icon"><line x1="14.287" y1="0.707" x2="0.707" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/><line x1="0.707" y1="0.707" x2="14.287" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/></g></svg>
        </div>
      </div>
    </div>

    <main>
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
export default {
  props: ['showDisclaimer'],
  head () {
    return {
      titleTemplate: `%s - Disclaimer!`
    }
  },
  methods: {
    showingDisclaimer(){
      this.$parent.showingDisclaimer();
    }
  }
}
</script>