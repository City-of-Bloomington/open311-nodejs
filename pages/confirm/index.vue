<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="info-process thank-you">
      <h2 v-html="thankYou"></h2><br>
      <h3 v-html="requestID"></h3><br>
      <p v-html="crmMessageLink"></p>

      <div @click="goHome" class="button ok-button">
        <span>ok</span>
      </div>
    </main>
  </div>
</template>

<style type="text/css">

  main.thank-you h2 {
    border-bottom: none;
    margin: 0;
  }

  main.thank-you p a {
    border-bottom: 1px solid white;
  }

  main.thank-you p {
    margin: 0 0 20px 0;
  }

  main.thank-you p:last-of-type {
    margin: 0;
  }
</style>

<script>
import headerNav from '~/components/nav.vue'

export default {
  beforeRouteEnter (to, from, next) {
    if(from.path == '/')
      next('/');
    next();
  },
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
      crmLink:        `${process.env.crmBaseUrl}${process.env.crmTickets}`,
      serviceReqID:   '',
      navSubGroup:    true,
      stepActive: {
        one:          false,
        two:          false,
        three:        false,
        four:         false,
        five:         false,
        six:          true,
      },
      stepComplete: {
        one:          true,
        two:          true,
        three:        true,
        four:         true,
        five:         true,
        six:          false
      }
    }
  },
  mounted() {
    this.serviceID();
  },
  methods: {
    goHome() {
      this.$router.go({ path: '/' });
    },
    serviceID() {
      var resData = JSON.parse(this.responseData)[0];
      this.serviceReqID = resData.service_request_id;
    }
  },
  computed: {
    crmMessageLink() {
      return `To view your request status, <a href='${this.crmLink}${this.serviceReqID}' target='_blank'>click here</a>.`
    },
    firstName() {
      return this.$store.getters.firstName
    },
    requestID() {
      return `Your service request number is: <strong>${this.serviceReqID}</strong>`
    },
    responseData() {
      return this.$store.getters.response.data.body;
    },
    thankYou() {
      if(this.firstName != '') {
        return `<strong>${this.firstName}</strong>, thanks for the report!`
      }
      return `Thanks for the report!`
    }
  }
}
</script>