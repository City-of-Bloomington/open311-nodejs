<template>
  <div class="disclaimer" v-if="showDisclaimer">
    <div class="top" ref="top">
      <div class="container">
        <h1>Notice:</h1>
        <div @click="showingDisclaimer(false)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.994 14.994"><title>close</title><g id="close-icon" data-name="close-icon"><line x1="14.287" y1="0.707" x2="0.707" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/><line x1="0.707" y1="0.707" x2="14.287" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/></g></svg>
        </div>
      </div>
    </div>

    <main>
      <h2>Non-Emergency Use Only</h2>
      <p><strong><i>This system is not for reporting emergencies or imminent safety hazards.</i></strong></p>

      <p>If this is an emergency, please dial 911.</p>
      
      <p>If this is a safety hazard that could cause an injury, please immediately call <strong>City Utilities Control at 812-339-1444</strong>.</p>

      <p>This number is staffed 24 hours a day. The appropriate staff will be dispatched to address the safety hazard.</p>

      <p>When in doubt, please call, even if you are not sure.</p>

      <p>You may also send an e-mail directly to <strong>info@bloomington.in.gov</strong>, or <strong>call the City at 812.349.3400</strong>.</p>

      <h2>Public Record</h2>
      <p>Information you provide through uReport is stored and retained by the City as a public record.</p>

      <h2>Tickets</h2>
      <p>Tickets may be viewed at:<br>
      <strong><a :href="crmLink" target="_blank" title="View uRport CRM tickets">{{ crmLink }}</a></strong></p>
    </main>
  </div>
</template>


<script>
export default {
  props: ['showDisclaimer'],
  data() {
    return {
      crmLink:  process.env.crmBaseUrl,
    }
  },
  methods: {
    showingDisclaimer(){
      this.$parent.showingDisclaimer();
    }
  }
}
</script>