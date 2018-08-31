<template>
  <main>
    <headerNav></headerNav>

    <p v-html="thankYou"></p>
    <p v-html="requestID"></p>

    <!--     {{responseData}} -->

    <nuxt-link to="/" class="button ok-button">
      <span>ok</span>
    </nuxt-link>
  </main>
</template>

<style type="text/css">
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
  components: {
    headerNav
  },
  data() {
    return {
    }
  },
  computed: {
    firstName() {
      return this.$store.getters.firstName
    },
    requestID() {
      return `Your case number is: <strong>${this.$store.getters.requestID}</strong>`
    },
    responseData() {
      return this.$store.getters.response
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