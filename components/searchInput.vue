<template>
  <div
    class="search"
    v-on-clickaway="away">

    <div class="form-wrapper">
      <form @submit.prevent autocomplete="off">
        <fn1-input
          v-model="input"
          label="Search"
          placeholder="Seach for services or a ticket number"
          name="search"
          autocomplete="off"
          id="search" />
      </form>

      <div
        v-if="focused && isNan(input)"
        class="auto-suggest">
        <ul v-if="data">
          <li
            v-for="(group, i) in data"
            :key="group.service_code"
            v-if="filter(group)"
            @keyup.enter="complete(i)"
            @click="complete(i)"
            tabindex="0"
            v-html="group.service_name">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .form-wrapper {
    position: relative;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 0;
    border: none;
    background-color: transparent;

    form {
      z-index: 1;
      width: 100%;

      label {
        @include visuallyHidden;
      }

      ::v-deep input {
        z-index: 1000;
        box-shadow: none;
        border: 1px solid $color-grey-dark;
        color: $text-color;
        font-size: 18px;
        line-height: 30px;
        min-height: 30px;
        border-radius: $radius-default;
        caret-color: $color-blue; //no IE support
        padding: 0 10px 0 40px;
        background-color: white;
        // background-color: red;
        background-size: 20px;
        background-repeat: no-repeat;
        background-position: left 10px center;
        background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='search-icon' focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cpath id='path' fill='%23bfbfbf' d='M372,336c27.6-35.3,44-79.7,44-128C416,93.1,322.9,0,208,0S0,93.1,0,208s93.1,208,208,208 c48.3,0,92.7-16.4,128-44 M315.6,377.9L442.7,505c9.4,9.4,24.6,9.4,33.9,0l28.3-28.3c9.4-9.4,9.4-24.6,0.1-34L374.5,312.2 M208,336 c-70.7,0-128-57.2-128-128c0-70.7,57.2-128,128-128c70.7,0,128,57.2,128,128C336,278.7,278.8,336,208,336z'/%3E%3C/svg%3E");

        &:focus,
        &:hover {
          background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='search-icon' focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cpath id='path' fill='%238c8c8c' d='M372,336c27.6-35.3,44-79.7,44-128C416,93.1,322.9,0,208,0S0,93.1,0,208s93.1,208,208,208 c48.3,0,92.7-16.4,128-44 M315.6,377.9L442.7,505c9.4,9.4,24.6,9.4,33.9,0l28.3-28.3c9.4-9.4,9.4-24.6,0.1-34L374.5,312.2 M208,336 c-70.7,0-128-57.2-128-128c0-70.7,57.2-128,128-128c70.7,0,128,57.2,128,128C336,278.7,278.8,336,208,336z'/%3E%3C/svg%3E");
        }

        &::-webkit-input-placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &:-moz-placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &::-moz-placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &:-ms-input-placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%) !important;
          font-weight: 400 !important;
        }


        &::-ms-input-placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &::placeholder {
          vertical-align: middle;
          color: lighten($text-color, 40%);
          font-weight: 400;
        }
      }

      ::v-deep button[type=submit] {
        display: none;
        background-color: $color-green;
        border-color: $color-green;
        margin: 0;

        &:hover,
        &:focus {
          background-color: darken($color-green, 5%);
        }
      }
    }
  }

  .search {
    // background: green;
    padding: 20px 0;

    ::v-deep label {
      @include visuallyHidden;
    }

    input {
      padding: 5px 10px;
      font-size: 18px;
    }

    .auto-suggest {
      // background-color: white;
      background: red;

      ul {
        z-index: 1000;
        position: absolute;
        top: 30px;
        border: 1px solid $color-grey-dark;
        border-top: none;
        overflow: scroll;
        max-height: 300px;
        width: 100%;
        background-color: white;
        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.10);
        -webkit-border-bottom-right-radius: $radius-default;
        -webkit-border-bottom-left-radius: $radius-default;
        -moz-border-radius-bottomright: $radius-default;
        -moz-border-radius-bottomleft: $radius-default;
        border-bottom-right-radius: $radius-default;
        border-bottom-left-radius: $radius-default;

        li {
          display: flex;
          padding: 8px 10px;
          margin: 0;
          cursor: pointer;
          color: $text-color;
          font-size: 16px;
          border: 3px solid transparent;

          &:focus {
            outline: none;
            border: 3px dashed $color-blue;
          }

          .badge {
            margin-left: auto;
          }

          &:hover {
            background-color: $color-cloud;
          }

          &:nth-child(odd) {
            background-color: rgba($color-cloud, 0.75);

            &:hover {
              background-color: $color-cloud;
            }
          }
        }
      }
    }

    @media only screen
    and (min-device-width : 320px)
    and (max-device-width : 480px) {
      width: calc(100% - 40px);
      padding: 10px 0;

      .form-wrapper {
        form {
          ::v-deep {
            input {
              padding-left: 30px;
              background-size: 15px;

              &::-webkit-input-placeholder {
                font-size: 16px;
              }

              &:-moz-placeholder {
                font-size: 16px;
              }

              &::-moz-placeholder {
                font-size: 16px;
              }

              &:-ms-input-placeholder {
                font-size: 16px;
              }


              &::-ms-input-placeholder {
                font-size: 16px;
              }

              &::placeholder {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }

  
</style>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapFields }          from 'vuex-map-fields'

export default {
  beforeUpdate() {
    console.log('beforeUpdate()')
  },
  mixins: [ clickaway ],
  data() {
    return {
      input:        this.value,
      focused:      false,
      updatedOnce:  false,
    }
  },
  props: {
    groups: { type: Array,  required: false},
    data:   { type: Array,  required: true },
    value:  { type: String, required: false},
    field:  { type: String, required: false}
  },
  computed: {
    ...mapFields([
      'serviceTicketData',
    ]),
  },
  methods: {
    isNan(val){ return isNaN(val) },
    away() {
      let numberRegEx = /^\d{6}$/,
            testInput = numberRegEx.test(this.input);

      if(!testInput || !this.serviceTicketData){
        this.focused = false;
        this.clearSearch();
      }
    },
    complete(i) {
      this.select(this.data[i]);
      this.focused      = false;
      var selectedGroup = this.groupsAsCss(this.data[i].group);
      var selectedCode  = this.data[i].service_code;
      var selectedUrl   = `${selectedGroup}/${selectedCode}`
      this.$router.push({ path: selectedUrl })
    },
    groupsAsCss(group) {
      return group
      .replace(/\s+/g, '-')
      .replace(/,/g, '')
      .replace(/&/g, 'and')
      .toLowerCase();
    },
    select(row) {
      this.input    = row[this.field];
      this.selected = true;
      this.$store.commit('storeSubGroupName', row);
    },
    filter(row) {
      return row[this.field].toLowerCase().indexOf(this.input.toLowerCase()) != -1
    },
    clearSearch() {
      this.input = ''
    },
    ticketLookup(val) {
      this.getServiceRequest(val)
      .then((res) => {
        this.$store.dispatch("setServiceTicketData", res);

        this.getServiceRequestCRMHTML(val)
        .then((res) => {
          this.$store.dispatch("setServiceTicketCRMHTML", res);
          this.$router.replace({query: {ticket: val}})
        })
        .catch((e)  => console.log(e));
      })
      .catch((e)  => console.log(e));
    },
  },
  watch: {
    'input': function(val, oldVal){

      let numberRegEx = /^\d{6}$/,
            ticketInputTest = numberRegEx.test(val);

      if(val == '') {
        this.$router.replace({query: null})
        this.input = '';        
        this.$store.dispatch("setServiceTicketData", null);
        this.$store.dispatch("setServiceTicketCRMHTML", null);
      }


      if(ticketInputTest){
        this.input = val;
        console.log('looking up the ticket')
        this.ticketLookup(val);
      }

      if(val){
        if(val.length >= 1) {
          this.focused = true
        } else {
          this.focused = false
        }
      }
    }
  },
  updated() {
    if(!this.updatedOnce)
      setTimeout(() => {
        console.log('updatedOnce')
        console.log('i', this.input)
        console.log('v', this.value)
        this.updatedOnce = true
        this.input = this.value;
      }, 100);
  }
}
</script>