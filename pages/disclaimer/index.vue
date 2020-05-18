<template>
  <div class="disclaimer">
    <div class="top" ref="top">
      <div class="container">
        <h1>Notice:</h1>

        <!-- <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.994 14.994"><title>close</title><g id="close-icon" data-name="close-icon"><line x1="14.287" y1="0.707" x2="0.707" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/><line x1="0.707" y1="0.707" x2="14.287" y2="14.287" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/></g></svg>
        </div> -->
      </div>
    </div>

    <main>
      <h2>Non-Emergency Use Only</h2>
      <p><strong>If this is an emergency, please dial 911.</strong></p>


      <p>This system is not for reporting emergencies or imminent safety hazards.</p>

      
      <p>If this is a safety hazard that could cause an injury, please immediately call <strong>City Utilities Control at 812-339-1444</strong>.</p>

      <p>This number is staffed 24 hours a day. The appropriate staff will be dispatched to address the safety hazard.</p>

      <p>When in doubt, please call, even if you are not sure.</p>

      <p>You may also send an e-mail directly to <strong>info@bloomington.in.gov</strong>, or <strong>call the City at 812.349.3400</strong>.</p>

      <h2>Public Record</h2>
      <p>Information you provide through uReport is stored and retained by the City as a public record.</p>

      <h2>Tickets</h2>
      <p>Tickets may be viewed by searching for your ticket number on the homepage, or by visiting:<br>

        <strong>
          <a
            :href="crmUrl"
            target="_blank"
            title="View uRport CRM tickets">
            {{ crmUrl }}
          </a>
        </strong>
      </p>
    </main>
  </div>
</template>

<style lang="scss">
.disclaimer {
  position: relative;
  margin: 0 auto;
  padding: 20px 0;
  max-width: 520px;

  h1 {
    color: white;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: .5px;
    display: inline-block;
    line-height: 30px;
    margin: 0 0 15px 0;
  }

  h2 {
    color: white;
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    letter-spacing: .25px;
    margin: 0 0 5px 0;
  }

  p {
    color: white;
    font-size: 18px;
    letter-spacing: .5px;
    position: relative;
    width: 100%;
    margin: 0 0 20px 0;
    overflow: hidden;

    a {
      color: white;
      text-decoration: underline;
    }
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