<template>
  <main>
    <headerNav></headerNav>

    <h2>General information fields.</h2>
    <div class="form-group camera-wrapper">
      <label>Include Media</label>

      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        @change="uploadImage"
        ref="fileInput"
        multiple>

      <div class="video-wrapper" v-show="showVideoElm">
        <video
          ref="video"
          id="video"
          autoplay>
        </video>

        <button
          v-on:click="capture()"
          class="button take"
          alt="Take photo"
          title="Take photo"
          >
          <span>Take Photo</span>
        </button>

        <button
          v-on:click="closeCamera()"
          class="button close"
          alt="Close camera"
          title="Close camera">Close Camera</button>
      </div>

      <canvas ref="canvas" id="canvas" width="640" height="480" v-show="false"></canvas>
      <ul v-if="captures.length">
        <li v-for="c in captures" :key="c">
          <img :src="c" @click="biggerImage(c)" />
          <button type="button" class="button" @click="removeImage(c)">remove</button>
        </li>
      </ul>

      <button @click="$refs.fileInput.click()">Upload File</button>

      <button
        v-on:click="openCamera()"
        class="button open"
        alt="Open camera"
        title="Open camera">Open Camera</button>
    </div>

    <div class="form-group">
      <label for="default-description">Tell us a little about this issue</label>
      <textarea
        v-model="defaultFields.description"
        id="default-description"
        name="default-description"
        wrap="hard">
      </textarea>
    </div>

    <h2>{{ showSubGroupName }} specific information fields.</h2>
    <div class="form-group" v-for="item in formFields" :key="item.code">
      <div v-if="item.datatype === 'string'">
        <label :for="item.key">{{ item.description }}</label>
        <input
          v-model="defaultFields[item.code]"
          type="text"
          :id="item.name"
          :name="item.name" />
      </div>

      <div v-else-if="item.datatype === 'number'">
        <label :for="item.key">{{ item.description }}</label>
        <input
          type="number"
          v-model="defaultFields[item.code]"
          :id="item.name"
          :name="item.name" />
      </div>

      <div v-else-if="item.datatype === 'datetime'">
        <label :for="item.key">{{ item.description }}</label>
        <input
          type="datetime-local"
          v-model="defaultFields[item.code]"
          :id="item.name"
          :name="item.name" />
      </div>

      <div v-else-if="item.datatype === 'text'">
        <label :for="item.description">{{ item.description }}</label>
        <textarea
          v-model="defaultFields[item.code]"
          :id="item.name"
          :name="item.name"
          wrap="hard"></textarea>
      </div>

      <div v-else-if="item.datatype === 'singlevaluelist'" class="singlevaluelist">
        <legend>{{ item.description }}</legend>
        <div v-for="value in item.values" :key="value.code" :item="item">
          <input
            type="radio"
            v-model="defaultFields[item.code]"
            :id="item.code"
            :value="value.key"
            :name="item.code" />
          <label :for="value.key">{{ value.name }}</label>
        </div>
      </div>

      <div v-else-if="item.datatype === 'multivaluelist'">
        <label :for="item.description">{{ item.description }}</label>
        <select :id="item.key" v-model="defaultFields[item.code]">
          <option
            v-for="item in item.values"
            :value="item.key"
            :key="item.name">{{ item.name }}
        </option>
        </select>
      </div>
    </div>

    {{attrKeyValPairs}}

    <footer>
      <nuxt-link
        to="/confirm"
        class="button next-button"
        @click.native="submitPost()">Next</nuxt-link>

      <!-- <button class="button next-button" @click="storeCommitFormInfo()">Store</button> -->
      <!-- <button class="button next-button" @click="submitPost()">Submit</button> -->
    </footer>

    <modal v-if="showBiggerImage">
      <img slot="body" :src="modalImage" />
      <button slot="footer" @click="showBiggerImage = false">close</button>
    </modal>
  </main>
</template>

<style lang="scss">
  .modal-header {
    display: none;
  }

  .modal-body {
    img {
      max-width: 100%;
    }
  }
</style>

<script>
import axios from 'axios'
import headerNav from '~/components/nav.vue'
import modal from '~/components/modal.vue'

export default {
  props: ['item'],
  components: {
    headerNav,
    modal
  },
  data() {
    return {
      modalImage:       null,
      showBiggerImage:  false,
      formElements:     {},
      defaultFields:    {},
      showVideoElm:     false,
      video:            {},
      canvas:           {},
      captures:         [],
      response:         {}
    }
  },
  mounted() {
    axios.post(`${process.env.apiUrl}${process.env.attrsApi}${this.showServiceCode}.json`)
    .then(res => { this.formElements = res.data })
    .catch(err => { console.log(`Fields page error: ${err}`); });
  },
  methods: {
    capture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas.getContext("2d")
      context.drawImage(this.video, 0, 0, 640, 480);
      this.captures.push(canvas.toDataURL("image/png"));
    },
    openCamera() {
      this.showVideoElm = true;
      this.video = this.$refs.video;
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(error => { console.log('error', error); });
      }
    },
    closeCamera() {
      this.showVideoElm = false;
      return video.srcObject && video.srcObject.getTracks().map(t => t.stop());
    },
    removeImage(c){
      this.captures.splice(this.captures.indexOf(c), 1);
    },
    uploadImage(e){
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.captures.push(e.target.result);
      };
    },
    biggerImage(c) {
      this.showBiggerImage = true;
      this.modalImage = c;
    },

    storeCommitFormInfo() {
      console.log(this.defaultFields);
      // return this.$store.commit('storeFormInfo', this.defaultFields);
    },

    submitPost() {
      this.$store.commit('storeFormInfo', this.defaultFields);

      var testing = `api_key=${process.env.open311Key}`
                  + `&service_code=${this.postServiceCode}`
                  + `&lat=${this.postLat}`
                  + `&long=${this.postLong}`
                  + `&address_string=${this.postAddressString}`
                  + `&email=${this.postEmail}`
                  + `&first_name=${this.postFirstName}`
                  + `&last_name=${this.postLastName}`
                  + `&phone=${this.postPhone}`
                  + `&description=${this.postDefaultDescription}`
                  // + `&media_url=${this.postMedia}`
                  + `&${this.attrKeyValPairs}`;

      var formData = new FormData();
      formData.append("api_key", process.env.open311Key)
      formData.append("service_code", this.postServiceCode)
      formData.append("lat", this.postLat)
      formData.append("long", this.postLong)
      formData.append("address_string", this.postAddressString)
      // formData.append("account_id",)
      formData.append("email", this.postEmail)
      formData.append("first_name", this.postFirstName)
      formData.append("last_name", this.postLastName)
      formData.append("phone", this.postPhone)
      // formData.append("description", )
      // formData.append("media_url", )
      formData.append("attribute", this.attrKeyValPairs)

      var formObject = {};
      formData.forEach(function(value, key){
        formObject[key] = value;
      });
      var formJson = JSON.stringify(formObject);

      // console.log(formData);

      axios.post(`${process.env.apiUrl}${process.env.postApi}`,
      // axios.post(`/`,
        // formData,
        testing,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then(response => {
        console.log(testing);
        console.log('cool!!');
        console.log(response.data[0]);
        this.$store.commit('storeResponseInfo', response.data[0]);
      })
      .catch(error => {
        // console.log(testing);
        console.log('dang!!');
        console.log(error);
      });
    }
  },
  computed: {
    showGroupName() {
      return this.$store.state.serviceInfos.service_group.group
    },
    showSubGroupName() {
      return this.$store.state.serviceInfos.service_group.service_name
    },
    showServiceCode() {
      return parseInt(this.$store.state.serviceInfos.service_group.service_code, 10)
    },
    postLat() {
      return this.$store.state.serviceInfos.location_info.lat
    },
    postLong() {
      return this.$store.state.serviceInfos.location_info.long
    },
    postAddressString() {
      return this.$store.state.serviceInfos.location_info.address_string
    },
    postEmail() {
      return this.$store.state.serviceInfos.personal_info.email
    },
    postFirstName() {
      return this.$store.state.serviceInfos.personal_info.first_name
    },
    postLastName() {
      return this.$store.state.serviceInfos.personal_info.last_name
    },
    postPhone() {
      return this.$store.state.serviceInfos.personal_info.phone
    },
    postMedia() {
      return this.captures
    },
    postDefaultDescription() {
      return this.$store.state.serviceInfos.service_fields.description
    },
    postServiceCode() {
      var sc = parseInt(this.$store.state.serviceInfos.service_group.service_code, 10)
      return sc
    },
    formFields() {
      return this.formElements.attributes
    },
    attrKeyValPairs() {
      var requestAttrs = this.$store.state.serviceInfos.service_fields;

      var requestAttrsStr = Object.keys(requestAttrs).map(function(key) {
        return `attribute[${key}]=${requestAttrs[key]}`;
      }).join('&');

      return requestAttrsStr;
    }
  }
}
</script>