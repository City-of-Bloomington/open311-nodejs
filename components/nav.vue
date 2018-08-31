<template>
  <nav>
    <nuxt-link to="/" class="nav-back">
      <span>back</span>
    </nuxt-link>
    <h1 v-html="group"></h1>
    <h2 v-html="subGroup"></h2>
  </nav>
</template>

<script>
export default {
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup }
  }
}
</script>