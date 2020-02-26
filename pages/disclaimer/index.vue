<template>
  <div class="disclaimer">
    <div class="top" ref="top">
      <div class="container">
        <h1>Notice:</h1>

        <div>
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
      <strong><a :href="crmUrl" target="_blank" title="View uRport CRM tickets">{{ crmUrl }}</a></strong></p>
    </main>
  </div>
</template>

<style lang="scss">
.disclaimer {
  background: $color-blue;
  color: white;
  width: 100%;
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  // height: 100%;
  overflow: scroll;
  
  .top {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .container {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 10px auto 0 auto;
    padding: 0 0 10px 0;
    max-width: 520px;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);

    div {
      &:first-of-type {
        margin-left: auto;
      }
    }
  }

  main {
    a {
      width: auto !important;
      height: auto !important;
      margin: 0 !important;
    }
  }

  h1, h2 {
    font-weight: 600;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin: 40px 0 5px 0;

    &:first-of-type {
      margin: 20px 0 5px 0;
    }
  }

  p {
    margin: 0 0 20px 0;
    font-size: 18px;
    letter-spacing: .5px;
    line-height: 25px;

    &:last-child {
      margin: 0;
    }
  }

  svg {
    display: block;
    width: 20px;
    height: 20px;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>


<script>
export default {
  data() {
    return {
      crmUrl:  process.env.CRM_BASE_URL,
    }
  },
  methods: {},
}
</script>