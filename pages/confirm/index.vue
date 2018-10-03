<template>
  <div>
    <header ref="topHeight" v-bind:style="{height: paddingTop}">
      <headerNav />
    </header>

    <main v-bind:style="{paddingTop}" class="thank-you">
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
  middleware: ['redirect-home'],
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
    }
  },
  mounted() {
    this.topHeight();
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
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