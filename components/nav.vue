<template>
  <div>
    <topBar />

    <div class="progress-stepper">
      <span class="title">Progress:</span>
      <div v-bind:class="{ active: stepActive.one, 'complete': stepComplete.one }">
        <svg v-if="stepComplete.one" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.one">1</span>
      </div>
      <div v-bind:class="{ active: stepActive.two, 'complete': stepComplete.two }">
        <svg v-if="stepComplete.two" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.two">2</span>
      </div>
      <div v-bind:class="{ active: stepActive.three, 'complete': stepComplete.three }">
        <svg v-if="stepComplete.three" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.three">3</span>
      </div>
      <div v-bind:class="{ active: stepActive.four, 'complete': stepComplete.four }">
        <svg v-if="stepComplete.four" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.four">4</span>
      </div>
      <div v-bind:class="{ active: stepActive.five, 'complete': stepComplete.five }">
        <svg v-if="stepComplete.five" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.five">5</span>
      </div>
      <div v-bind:class="{ active: stepActive.six, 'complete': stepComplete.six }">
        <svg v-if="stepComplete.six" version="1.1" id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="46px" height="37px" viewBox="0 0 46 37" enable-background="new 0 0 46 37" xml:space="preserve">
          <polygon id="check-icon" fill="" points="0.2230862,22.3627338 14.1432562,36.2812843 45,5.4261613 40.3345947,0.7607598 14.1432562,26.9504795 4.7655683,17.5744114 "/>
        </svg>
        <span v-if="!stepComplete.six">6</span>
      </div>
    </div>

    <nav>
      <div @click="navBackButton" class="nav-back" ref="navBack" v-if="!hideBackButton">
        <span>back</span>
      </div>
      <h1 v-html="group"></h1>
      <h2 v-html="subGroup" v-if="navSubGroup" v-bind:style="[hideBackButton ? {'margin': '0'} : {'margin': '0 0 0 46px'}]"></h2>
    </nav>
  </div>
</template>

<script>
import topBar from './topBar.vue'

export default {
  props: ['stepActive','stepComplete','navSubGroup','backHome'],
  components: {
    topBar
  },
  data() {
    return {
      showModal:       false,
      allData:         [],
      hideBackButton:  false
    }
  },
  mounted() {
    this.confirmRoute();
  },
  methods: {
    navBackButton() {
      if(!this.backHome)
        return this.$router.back();
      return this.$router.push('/');
    },
    confirmRoute() {
      if(this.$route.path == '/confirm') {
        this.hideBackButton = true;
      }
    }
  },
  computed: {
    group()   { return this.$store.getters.group },
    subGroup(){ return this.$store.getters.subGroup },
  }
}
</script>