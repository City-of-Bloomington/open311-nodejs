<template>
  <div>
    <headerComponent />
    <div class="nuxt-wrapper">
      <nuxt />
    </div>
  </div>
</template>

<style lang="scss">
  .nuxt-wrapper {
    // background-color: brown;
    position: relative;
    top: 90px;
    height: calc(100vh - 90px);

    @media only screen
    and (min-width : 320px)
    and (max-width : 768px) {
      top: auto;
      height: auto;
      // height: calc(100vh - 73px);
    }
  }
</style>

<script>
import headerComponent  from '~/components/headerComponent.vue'
import { mapFields }    from 'vuex-map-fields'

export default {
  components: { headerComponent },
  data() { return {} },
  created() {},
  mounted() {},
  methods:  {},
  computed: {}
}
</script>