<template>
  <div>
    <header ref="top" style="height: 125px;">
      <topBar />
      <search-input :data="allInitGroupData" field="service_name" v-bind:style="{top}"/>
    </header>

    <main style="top: 125px; padding: 0;">
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
  components: {
    emerModal,
    searchInput,
    topBar
  },
  data() {
    return {
      paddingTop:   '',
      top:          '',
      groups:       []
    }
  },
  created() {
    this.clearState();
  },
  mounted() {
    this.topHeight();
    this.searchPos();
  },
  methods: {
    clearState() {
      this.$store.commit('storeGroupName', '');
      this.$store.commit('storeRouteCode', '');
      this.$store.commit('storeGroupCode', '');
      this.$store.commit('storeSubGroupName', '');
      this.$store.commit('storeFormInfo', '');
    },
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.searchHeight}px`;
    },
    searchPos() {
      this.top = `${this.topbarHeight}px`;
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
    },
    topbarHeight() {
      return this.$store.getters.topbarHeight
    },
    searchHeight() {
      return this.$store.getters.searchHeight
    }
  }
}
</script>