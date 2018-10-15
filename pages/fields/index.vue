<template>
  <div>
    <header ref="topHeight" v-bind:style="{height: paddingTop}">
      <headerNav :step-active="stepActive" :step-complete="stepComplete" />
    </header>

    <main v-bind:style="{paddingTop}" ref="mainElm" class="fields">
      <h2>General information:</h2>
      <div class="form-group camera-wrapper">
        <!-- <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="uploadImage"
          ref="fileInput"
          multiple> -->

        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          @change="updateCanvasImage"
          ref="fileInput"
          name="media">


        <!-- <div class="video-wrapper" v-show="showVideoElm"> -->
        <div class="video-wrapper" v-show="false">
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

        <!-- <canvas ref="imgCanvas" id="img-canvas" width="640" height="480" v-show="true"></canvas> -->
        <canvas id="imageCanvas" ref="imageCanvas" v-show="false"></canvas>

        <ul v-if="captures.length">
          <li v-for="c in captures" :key="c">
            <img :src="c" @click="biggerImage(c)" />
            <button type="button" class="button" @click="removeImage(c)">remove</button>
          </li>
        </ul>

        <button @click="$refs.fileInput.click()" v-if="captures.length < 1" class="image-input">Include Photo</button>

        <button
          v-show="false"
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

      <div v-if="hasFormAttributes">
        <h2>{{ showSubGroupName }} specific information:</h2>
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
      </div>



      <footer>
        <button class="button next-button" @click="submitPost()">Submit</button>
      </footer>

      <modal v-if="showBiggerImage">
        <img slot="body" :src="modalImage" />
        <button slot="footer" @click="showBiggerImage = false">close</button>
      </modal>
    </main>
  </div>
</template>

<style lang="scss">

  main {
    .fields {
      h2 {
        border-bottom: 1px solid rgba(225,225,225,0.2);
        margin: 0 0 10px 0;
      }

      .form-group {
        margin: 0 0 40px 0 !important;
      }
    }
  }

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
      titleTemplate: `%s - ${this.$store.getters.subGroup}`
    }
  },
  middleware: ['redirect-home'],
  props: ['item'],
  components: {
    headerNav,
    modal
  },
  data() {
    return {
      percentCompleted: '',
      paddingTop:       '',
      modalImage:       null,
      showBiggerImage:  false,
      formElements:     {},
      defaultFields:    {},
      showVideoElm:     false,
      mainElm:          '',
      imgContext:       null,
      imgCanvas:        null,
      selectedImage:    null,
      imgElement:       null,
      video:            {},
      canvas:           {},
      captures:         [],
      response:         {},
      singleImgMessage: 'Sorry, we only support a single image at the moment.',
      stepActive: {
        one:   false,
        two:   false,
        three: false,
        four:  false,
        five:  true,
        six:   false
      },
      stepComplete: {
        one:   true,
        two:   true,
        three: true,
        four:  true,
        five:  false,
        six:   false
      }
    }
  },
  mounted() {
    this.topHeight();
    axios.post(`${process.env.apiUrl}${process.env.attrsApi}${this.showServiceCode}.json`)
    .then(res => { this.formElements = res.data })
    .catch(err => { console.log(`Fields page error: ${err}`); });
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
    },
    dataURItoBlob(dataURI) {
      if(dataURI) {
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
      }
    },
    capture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas.getContext("2d")
      context.drawImage(this.video, 0, 0, 640, 480);
      if(this.captures.length < 1) {
        this.captures.push(canvas.toDataURL("image/png"));
      } else {
        alert(this.singleImgMessage);
      }
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
      this.$refs.fileInput.value = '';
    },
    updateCanvasImage(e) {
      var self = this;
      var reader, files = e.target.files;
      var reader = new FileReader();
      reader.onload = (e) => {
        var img = new Image();
        img.onload = function() {
          self.drawCanvasImage(img);
        }
        img.src = event.target.result;
      };

      reader.readAsDataURL(files[0]);
    },
    drawCanvasImage(img) {
      var canvas = this.$refs.imageCanvas;
      var max_width  = 1000;
      var max_height = 1000;
      var width      = img.width;
      var height     = img.height;

      if (width > height) {
        if (width > max_width) {
          height *= max_width / width;
          width   = max_width;
        }
      } else {
        if (height > max_height) {
          width *= max_height / height;
          height = max_height;
        }
      }
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      if(this.captures.length < 1) {
        this.captures.push(canvas.toDataURL());
      } else {
        alert(this.singleImgMessage);
      }
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
      this.$refs.mainElm.innerHTML = 'TEMP: Check console for submit completion % until UI is in place ...\n-_-';
      this.$store.commit('storeFormInfo', this.defaultFields);

      var formData     = new FormData();
      var dataURL      = this.postMedia;
      var blob         = this.dataURItoBlob(dataURL);
      var requestAttrs = this.defaultFields;

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

      var config = {
        onUploadProgress: function (progressEvent) {
          this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Percent Completed:' + this.percentCompleted);
        }
      }

      axios.post(`${process.env.postProxy}`, formData, config)
      .then(response => {
        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
        }
        this.$store.commit('storeResponseInfo', response);
      })
      .then(response => {
        this.$router.push({ path: 'confirm' })
      })
      .catch(error => {
        console.log(error);
      });


      // Working
      // axios.post(`${process.env.API_URL}${process.env.POST_API}`,
      //   formData
      // )
      // .then(response => {
      //   this.$store.commit('storeResponseInfo', response.data[0]);
      // })
      // .then(response => {
      //   this.$router.push({ path: 'confirm' })
      // })
      // .catch(error => {
      //   console.log(error);
      // });
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
    },
    hasFormAttributes() {
      var array = this.formElements.attributes
      if (Array.isArray(array) && array.length) {
        return true
      }
      return false
    },
    topbarHeight() {
      return this.$store.getters.topbarHeight
    },
    navHeight() {
      return this.$store.getters.navHeight
    },
    stepperHeight() {
      return this.$store.getters.stepperHeight
    }
  }
}
</script>