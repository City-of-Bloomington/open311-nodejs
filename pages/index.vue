<template>
  <div>
    <header ref="top" v-bind:style="{height: paddingTop}">
      <topBar />
      <search-input :data="groups" field="service_name" v-bind:style="{top}"/>
    </header>

    <main v-bind:style="{paddingTop}">
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

      <p class="emergency">.: No Emergency Usage :.</p>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import searchInput from '~/components/searchInput.vue'
import modal from '~/components/modal.vue'
import topBar from '~/components/topBar.vue'

export default {
  head () {
    return {
      bodyAttrs: {
        class: this.showingModal ? 'showing-modal' : ''
      }
    }
  },
  components: {
    searchInput,
    modal,
    topBar
  },
  data() {
    return {
      paddingTop:   '',
      top:          '',
      showingModal: false,
      groups:       []
    }
  },
  asyncData ({req, params}) {
    return axios.get(`${process.env.apiUrl}${process.env.servicesApi}`)
    .then((res) => { return { groups: res.data }})
    .catch((err) => { console.log(err); });
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
    },
    showModal(val) {
      console.log(this.showingModal)
      console.log(val)
      this.showingModal = val;
    }
  },
  computed: {
    groupCategories() {
      return [...new Set(this.groups.map(g => g.group))]
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