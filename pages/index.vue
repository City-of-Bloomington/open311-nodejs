<template>
  <div>
    <header class="home" ref="top">
      <topBar />
      <search-input :data="allInitGroupData" field="service_name"/>
    </header>

    <main class="home">
      <div class="grid">
        <div v-for="group in groupCategories"
             :key="group"
             @click="groupName(group)">

          <nuxt-link :to="{name:'subcategory', params:{subcategory:groupsAsCss(`${group}`)}}"
                     v-bind:class="groupsAsCss(`${group}`)"
                     class="item">
            <div class="icon"></div>
            <h3>{{ group }}</h3>
          </nuxt-link>
        </div>
      </div>

      <emerModal />
      <p class="emergency">.: No Emergency Usage :.</p>
    </main>
  </div>
</template>

<script>
import axios       from 'axios'
import emerModal   from '~/components/emerModal.vue'
import searchInput from '~/components/searchInput.vue'
import topBar      from '~/components/topBar.vue'

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
  data() {
    return {
      groups:       []
    }
  },
  created() {
    this.clearState();
  },
  methods: {
    clearState() {
      this.$store.commit('storeGroupName', '');
      this.$store.commit('storeRouteCode', '');
      this.$store.commit('storeGroupCode', '');
      this.$store.commit('storeSubGroupName', '');
      this.$store.commit('storeFormInfo', '');
    },
    groupsAsCss(group) {
      return group
      .replace(/\s+/g, '-')
      .replace(/,/g, '')
      .replace(/&/g, 'and')
      .toLowerCase();
    },
    groupName(name) {
      return this.$store.commit('storeGroupName', name)
    }
  },
  computed: {
    allInitGroupData() {
      return this.$store.getters.initGroupData
    },
    groupCategories() {
      return [...new Set(this.allInitGroupData.map(g => g.group))]
    }
  }
}
</script>