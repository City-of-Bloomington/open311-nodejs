<template>
  <div>
    <search-input
      :data="initGroupData"
      field="service_name" />

    <main class="home">
      <div class="grid">
        <div
          v-for="group, i in groupCategories"
          :key="group"
          @click="groupName(group)">

          <nuxt-link
            :to="{
              name:   'subcategory',
              params: { subcategory: stringToDashed(`${group}`) }
            }"
            :class="['item', stringToDashed(`${group}`)]">
            <div class="icon"></div>
            <h3>{{ group }}</h3>
          </nuxt-link>
        </div>
      </div>

      <emerModal />
      <p class="emergency">. :&nbsp;&nbsp;If Emergency, Call 911&nbsp;&nbsp;: .</p>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  main {
    &.home {
      margin: 0 auto;
      background-color: pink;
      max-height: calc(100vh - 200px);
      height: auto;

      @media only screen
      and (min-device-width : 320px)
      and (max-device-width : 480px) {
        background-color: purple !important;
        max-height: calc(100vh - 220px);
        height: auto;
      }
    }
  }
</style>

<script>
import axios          from 'axios'
import emerModal      from '~/components/emerModal.vue'
import searchInput    from '~/components/searchInput.vue'
import topBar         from '~/components/topBar.vue'
import { mapFields }  from 'vuex-map-fields'

export default {
  head () {
    return {
      titleTemplate: `%s - City of Bloomington`,
    }
  },
  components: {
    emerModal,
    searchInput,
    topBar
  },
  data() { return {} },
  methods: {
    groupName(name) {
      return this.$store.dispatch('setGroupName', name)
    }
  },
  computed: {
    ...mapFields([
      'initGroupData',
    ]),
    groupCategories() {
      return [...new Set(this.initGroupData.map(g => g.group))]
    }
  }
}
</script>