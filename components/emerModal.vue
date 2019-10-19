<template>
  <modal v-if="!seenEmerModal">
    <template
      v-if="!seenEmerModal">
      <template
        v-if="!seenAlertOne && !seenAlertTwo">
        <h4 slot="header">Non-Emergency Use Only :</h4>
        <p slot="body">This system is <strong>not for reporting emergencies or imminent safety hazards</strong>.</p>

        <p slot="body">If this is an <strong>emergency, please immediately dial 911</strong> for assistance.</p>

        <button
          slot="footer"
          @click="alertOne()"
          tabindex="0"
          autofocus>I Understand
        </button>
      </template>

      <template
        v-if="seenAlertOne && !seenAlertTwo">
        <h4 slot="header">Public Disclaimer :</h4>
        <p slot="body">Your information in this uReport is maintained as public record.</p>

        <p slot="body"><strong>Note:</strong> You may submit anonymously.</p>

        <button
          v-if="seenAlertOne && !seenAlertTwo"
          slot="footer"
          @click="alertTwo()"
          tabindex="0"
          autofocus>I also understand
        </button>
      </template>
    </template>
  </modal>
</template>

<style>
  button {
    font-weight: 600;
    letter-spacing: 1px;
  }
</style>

<script>
import modal from '~/components/modal.vue'

export default {
  components: { modal },
  head () {
    return {
      bodyAttrs: {
        class: !this.seenEmerModal ? 'showing-modal' : ''
      }
    }
  },
  data() { return {} },
  computed: {
    seenAlertOne() {
      console.dir('1');
      return this.$store.getters.seenAlertOne
    },
    seenAlertTwo() {
      console.dir('2');
      return this.$store.getters.seenAlertTwo
    },
    seenEmerModal() {
      console.dir('3');
        return this.$store.getters.seenNonEmerModal
    }
  },
  methods: {
    alertOne() {
      this.$store.commit('storeSeenAlertOne', true);
    },
    alertTwo() {
      this.$store.commit('storeSeenAlertTwo', true);
      this.$store.commit('storeSeenNonEmerModal', true);
    },
  }
}
</script>