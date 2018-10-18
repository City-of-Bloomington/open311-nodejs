<template>
  <div>
    <header ref="topHeight" v-bind:style="{height: paddingTop}">
      <headerNav :step-active="stepActive" :step-complete="stepComplete" />
    </header>

    <main style="top: 190px;" class="thank-you">
      <h2 v-html="thankYou"></h2><br>
      <h3 v-html="requestID"></h3>

      <nuxt-link to="/" class="button ok-button">
        <span>ok</span>
      </nuxt-link>
    </main>
  </div>
</template>

<style type="text/css">
  main h2 {
    border-bottom: none;
    margin: 0;
  }

  p {
    margin: 0 0 20px 0;
  }

  p:last-of-type {
    margin: 0;
  }
</style>

<script>
import headerNav from '~/components/nav.vue'

export default {
  // middleware: ['redirect-home'],
  head () {
    return {
      titleTemplate: `%s - Thanks!`
    }
  },
  components: {
    headerNav
  },
  data() {
    return {
      paddingTop:  '',
      serviceReqID: '',
      stepActive: {
        one:   false,
        two:   false,
        three: false,
        four:  false,
        five:  false,
        six:   true,
      },
      stepComplete: {
        one:   true,
        two:   true,
        three: true,
        four:  true,
        five:  true,
        six:   false
      }
    }
  },
  mounted() {
    this.topHeight();
    this.serviceID();
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
    },
    serviceID() {
      var resData = JSON.parse(this.responseData)[0];
      this.serviceReqID = resData.service_request_id;
    }
  },
  computed: {
    firstName() {
      return this.$store.getters.firstName
    },
    requestID() {
      return `Your case number is: <strong>${this.serviceReqID}</strong>`
    },
    responseData() {
      return this.$store.getters.response.data.body;
    },
    thankYou() {
      if(this.firstName != '') {
        return `<strong>${this.firstName}</strong>, thanks for the report!`
      }
      return `Thanks for the report!`
    },
    topbarHeight() {
      return this.$store.getters.topbarHeight
    },
    navHeight() {
      return this.$store.getters.navHeight
    },
    stepperHeight() {
      return this.$store.getters.stepperHeight
    }
  }
}
</script>