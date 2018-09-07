<template>
  <div>
    <div class="top">
      <headerNav />
    </div>

    <main>
      <h2>General information fields.</h2>
      <div class="form-group camera-wrapper">
        <label>Include Media</label>

        <!-- <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="uploadImage"
          ref="fileInput"
          multiple> -->

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
            autoplay
            playsinline>
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
  </div>
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
  head () {
    return {
      script: [
        { src: './webrtc-adapter/adapter.js' }
      ]
    }
  },
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
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    },
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
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment"}})
        .then(stream => {
          // NOTE: WKWebview has not yet implemented getUserMedia -_-,,,
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(error => { alert(error); });
      }
    },
    closeCamera() {
      this.showVideoElm = false;
      return video.srcObject && video.srcObject.getTracks().map(t => t.stop());
    },
    removeImage(c){
      this.captures.splice(this.captures.indexOf(c), 1);
    },
    uploadImage(e, file){
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

      var formData     = new FormData();
      var dataURL = this.postMedia;
      var blob = this.dataURItoBlob(dataURL);
      var requestAttrs = this.defaultFields;

      formData.append("api_key", process.env.open311Key)
      formData.append("service_code", this.postServiceCode)
      formData.append("lat", this.postLat)
      formData.append("long", this.postLong)
      formData.append("address_string", this.postAddressString)
      formData.append("email", this.postEmail)
      formData.append("first_name", this.postFirstName)
      formData.append("last_name", this.postLastName)
      formData.append("phone", this.postPhone)
      formData.append("description", this.postDefaultDescription)
      formData.append("media", blob)

      Object.keys(requestAttrs).map(function(key) {
        return formData.append(`attribute[${key}]`,`${requestAttrs[key]}`);
      }).join('&');

      axios.post(`${process.env.apiUrl}${process.env.postApi}`,
        formData
      )
      .then(response => {
        this.$store.commit('storeResponseInfo', response.data[0]);
      })
      .catch(error => {
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
      return this.captures[0]
    },
    postDefaultDescription() {
      return this.defaultFields.description
    },
    postServiceCode() {
      var sc = parseInt(this.$store.state.serviceInfos.service_group.service_code, 10)
      return sc
    },
    formFields() {
      return this.formElements.attributes
    }
  }
}
</script>