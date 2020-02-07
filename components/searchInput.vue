<template>
  <div
    class="search"
    v-on-clickaway="away">

    <div class="form-wrapper">
      <form>
        <fn1-input
          v-model="input"
          label="Search"
          placeholder="Seach for services or a ticket number"
          name="search"
          autocomplete="false"
          id="search" />
      </form>

      <div v-if="focused" class="auto-suggest">
        <template v-if="serviceTicket">
          <pre style="color: black; font-size: 12px;">{{ serviceTicket }}</pre>
        </template>

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
        border-radius: $radius-default;
        caret-color: $color-blue; //no IE support
        padding-left: 40px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-position: left 10px center;
        background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='search-icon' focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cpath id='path' fill='%23bfbfbf' d='M372,336c27.6-35.3,44-79.7,44-128C416,93.1,322.9,0,208,0S0,93.1,0,208s93.1,208,208,208 c48.3,0,92.7-16.4,128-44 M315.6,377.9L442.7,505c9.4,9.4,24.6,9.4,33.9,0l28.3-28.3c9.4-9.4,9.4-24.6,0.1-34L374.5,312.2 M208,336 c-70.7,0-128-57.2-128-128c0-70.7,57.2-128,128-128c70.7,0,128,57.2,128,128C336,278.7,278.8,336,208,336z'/%3E%3C/svg%3E");

        &:focus,
        &:hover {
          background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='search-icon' focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cpath id='path' fill='%238c8c8c' d='M372,336c27.6-35.3,44-79.7,44-128C416,93.1,322.9,0,208,0S0,93.1,0,208s93.1,208,208,208 c48.3,0,92.7-16.4,128-44 M315.6,377.9L442.7,505c9.4,9.4,24.6,9.4,33.9,0l28.3-28.3c9.4-9.4,9.4-24.6,0.1-34L374.5,312.2 M208,336 c-70.7,0-128-57.2-128-128c0-70.7,57.2-128,128-128c70.7,0,128,57.2,128,128C336,278.7,278.8,336,208,336z'/%3E%3C/svg%3E");
        }

        &::-webkit-input-placeholder {
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &:-moz-placeholder {
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &::-moz-placeholder {
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &:-ms-input-placeholder {
          color: lighten($text-color, 40%) !important;
          font-weight: 400 !important;
        }


        &::-ms-input-placeholder {
          color: lighten($text-color, 40%);
          font-weight: 400;
        }

        &::placeholder {
          color: lighten($text-color, 40%);
          font-weight: 400;
        }
      }

      ::v-deep button[type=submit] {
        display: none;
        background-color: $color-green;
        border-color: $color-green;
        margin: 0;

        svg {}

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
      background-color: white;

      ul {
        z-index: 1000;
        position: absolute;
        top: 38px;
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
          border: 3px solid transparent;

          &:focus {
            outline: none;
            border: 3px dashed $color-blue;
          }

          .badge {
            margin-left: auto;
          }

          &:hover {
            background-color: rgba($color-cloud, 0.75);
          }

          &:nth-child(even) {
            background-color: rgba($color-cloud, 0.75);

            &:hover {
              background-color: rgba($color-cloud, 0.75);
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
    }
  }
</style>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  data() {
    return {
      input:        '',
      focused:      false,
      showClearBtn: false,
      serviceTicket: null,
    }
  },
  props: {
    groups: { type: Array,  required: false},
    data:   { type: Array,  required: true },
    value:  { type: String, required: false},
    field:  { type: String, required: false}
  },
  created() {
    this.input = this.value || ''
  },
  mounted() {},
  methods: {
    away() {
      this.focused = false;
      this.clearSearch();
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
    }
  },
  watch: {
    'input': function(val, oldVal){
      if(val != oldVal) {
        this.serviceTicket = null;
      }

      let numberRegEx = /^\d{6}$/,
            testInput = numberRegEx.test(val);

      if(testInput){
        this.getServiceRequest(val)
        .then((res) => {
          this.serviceTicket = res;
          // alert(JSON.stringify(res));
          console.log(res)
        })
        .catch((e)  => {
          console.log(e)
        })
      }

      if(val.length >= 1) {
        this.focused = true
        this.showClearBtn = true
      } else {
        this.focused = false
        this.showClearBtn = false
      }
    }
  },
  updated() {
    this.$emit('input', this.input)
  }
}
</script>