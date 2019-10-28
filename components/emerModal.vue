<template>
  <modal v-if="!seenEmerModal">
    <template
      v-if="!seenEmerModal">
      <template
        v-if="!seenAlertOne && !seenAlertTwo">
        <h4 slot="header">Non-Emergency Use Only:</h4>
        <p slot="body">uReport is <strong>not for reporting emergencies</strong>.</p>

        <p slot="body">If this is an <strong>emergency, please immediately dial 911</strong>.</p>

        <button
          slot="footer"
          @click="alertOne()"
          tabindex="0"
          autofocus>
          I Understand, this is not an emergency
        </button>
      </template>

      <template
        v-if="seenAlertOne && !seenAlertTwo">
        <h4 slot="header">Public Disclaimer:</h4>
        <!-- <p slot="body">Your information in this uReport is maintained as public record.</p> -->

        <div
          slot="body"
          class="form-group inline">
          <fieldset>
            <legend>
              <strong>&nbsp;Submission method &nbsp;</strong>
            </legend>

            <p>Would you like to be contacted back?</p>

            <div>
              <input
                tabindex="0"
                autofocus
                id="contact-no"
                type="radio"
                name="inline-radios"
                value="no"
                v-model="submissionMethodTypeVal">

              <label
                for="contact-no">
                No
              </label>
            </div>

            <div>
              <input
                tabindex="0"
                id="contact-yes"
                type="radio"
                name="inline-radios"
                value="yes"
                v-model="submissionMethodTypeVal">

              <label
                for="contact-yes">
                Yes
              </label>
            </div>

            <p v-if="submissionMethodTypeVal == 'no'"> While you are not required to include any personal information, note that reports are public.</p>

            <template
              v-if="submissionMethodTypeVal == 'yes'">
              <p>Provided <strong>first &amp; last</strong> name will be public. <strong>Phone &amp; email</strong> are private and used to contact you.
              </p>
              <div class="form-group">
                <label for="first-name">First Name:</label>
                <input v-model="first_name"
                       type="text"
                       placeholder="First Name"
                       id="first-name"
                       required>
              </div>

              <div class="form-group">
                <label for="last-name">Last Name:</label>
                <input v-model="last_name"
                       type="text"
                       placeholder="Last Name"
                       id="last-name"
                       required>
              </div>

              <div class="form-group">
                <label for="phone">Phone:</label>
                <input v-model="phone"
                       type="tel"
                       placeholder="Phone"
                       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                       id="phone">
              </div>

              <div class="form-group">
                <label for="email">Email:</label>
                <input v-model="email"
                       type="email"
                       placeholder="Email"
                       id="email"
                       required>
              </div>
            </template>
          </fieldset>
        </div>

        <!-- <p slot="body"><strong>Note:</strong> You may submit anonymously.</p> -->

        <button
          v-if="seenAlertOne && !seenAlertTwo && submissionMethodTypeVal"
          slot="footer"
          @click="alertTwo()"
          tabindex="0"
          autofocus>
          <template v-if="submissionMethodTypeVal == 'no'">
            Continue, Anonymously
          </template>

          <template v-else-if="submissionMethodTypeVal == 'yes'">
            Continue<template v-if="first_name">, &amp; report as {{first_name}}</template>
          </template>
        </button>
      </template>

      <template>

      </template>
    </template>
  </modal>
</template>

<style lang="scss">
  @import './assets/scss/colors.scss';

  .modal-mask {
    .modal-wrapper .modal-container .modal-body {
      max-height: 550px;
    }

    .form-group {
      margin: 0;

      fieldset {
        width: 100%;
        border: 1px solid $silver;
      }

      &.inline {
        display: flex;
        flex-wrap: wrap;

        div {
          display: inline-flex;
          align-items: center;

          &:nth-of-type(1) {
            margin: 0 20px 0 0;
          }

          &:nth-of-type(2) {
            margin: 0 0 10px 0;
          }
        }
      }

      label {
        border-radius: 3px;
        padding: 2px 10px;
        background: $fern;
        color: white !important;
        font-weight: 600;

        &:focus,
        &:hover {
          cursor: pointer;
          background: darken($fern, 5%);
        }

        &[for="contact-no"] {
          background-color: $california;
        }
      }

      .form-group {
        display: block !important;

        &:nth-of-type(3) {
          margin: 15px 0 !important;
          padding: 15px 0 0 0;
          border-top: 1px solid $silver;
        }

        &:nth-child(n+4) {
          margin: 0 0 15px 0;
        }

        label {
          border-radius: 0;
          cursor: default;
          background-color: white;
          color: #191919 !important;
          width: 100%;
          padding: 0;
          display: block;
        }

        input {
          border: 1px solid $gainsboro !important;
          background-color: lighten($gainsboro, 10%);
          border-radius: 3 !important;
        }
      }
    }

    button {
      background: red;
      font-weight: 600;
      letter-spacing: 1px;
    }
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
  data() {
    return {
      userInfo: {}
    }
  },
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
    },
    submissionMethodTypeVal: {
      get() {
        return this.$store.getters.submissionMethodType;
      },
      set(value) {
        this.$store.commit("storeSubmissionMethodType", value);
      }
    },
    first_name: {
      get() {
        return this.$store.getters.firstName;
      },
      set(value) {
        this.$store.commit("storePersonalInfoFirst", value);
      }
    },
    last_name: {
      get() {
        return this.$store.getters.lastName;
      },
      set(value) {
        this.$store.commit("storePersonalInfoLast", value);
      }
    },
    email: {
      get() {
        return this.$store.getters.email;
      },
      set(value) {
        this.$store.commit("storePersonalInfoEmail", value);
      }
    },
    phone: {
      get() {
        return this.$store.getters.phone;
      },
      set(value) {
        this.$store.commit("storePersonalInfoPhone", value);
      }
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