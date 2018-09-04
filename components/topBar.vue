<template>
  <header>
    this is the header nav
  </header>
</template>

<script>
export default {
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup }
  }
}
</script>