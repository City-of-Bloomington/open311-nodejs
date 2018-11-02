<template>
  <div>
    <header class="info-process">
      <headerNav
        :back-home="backHome"
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="info-process fields" ref="mainElm">
      <h2>General information:</h2>
      <div class="form-group camera-wrapper">

        <input
          type="file"
          accept=".jpeg, .jpg, .png, .gif, .jp2, .jpx, .jpm, .tiff, .tiff-fx, .bmp, .x-bmp, .webp, .heif, .heic"
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
            <img :src="c" />
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
          v-model="defaultDescription"
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
              v-model="serviceAttrs[item.code]"
              type="text"
              :id="item.name"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'number'">
            <label :for="item.key">{{ item.description }}</label>
            <input
              type="number"
              v-model="serviceAttrs[item.code]"
              :id="item.name"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'datetime'">
            <label :for="item.key">{{ item.description }}</label>
            <input
              type="datetime-local"
              v-model="serviceAttrs[item.code]"
              :id="item.name"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'text'">
            <label :for="item.description">{{ item.description }}</label>
            <textarea
              v-model="serviceAttrs[item.code]"
              :id="item.name"
              :name="item.name"
              wrap="hard"></textarea>
          </div>

          <div v-else-if="item.datatype === 'singlevaluelist'" class="singlevaluelist">
            <legend>{{ item.description }}</legend>
            <div v-for="value in item.values" :key="value.code" :item="item">
              <input
                type="radio"
                v-model="serviceAttrs[item.code]"
                :id="item.code"
                :value="value.key"
                :name="item.code" />
              <label :for="value.key">{{ value.name }}</label>
            </div>
          </div>

          <div v-else-if="item.datatype === 'multivaluelist'">
            <label :for="item.description">{{ item.description }}</label>
            <select :id="item.key" v-model="serviceAttrs[item.code]">
              <option
                v-for="item in item.values"
                :value="item.key"
                :key="item.name">{{ item.name }}
            </option>
            </select>
          </div>
        </div>
      </div>

      <!-- <p v-if="reCaptchaError">Error - Please validate the reCaptcha below.</p>
      <div class="g-recaptcha" :data-sitekey="reCaptchaSiteKey"></div> -->

      <footer>
        <!-- <button class="button next-button" @click="submitPost()">Submit</button> -->
        <nuxt-link to="/location"
                   class="button next-button"
                   @click.native="storeFormInfo">Next</nuxt-link>
      </footer>

      <emerModal />
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

    .g-recaptcha {
      margin-bottom: 15px;
    }

    footer {
      button {
        margin-bottom: 15px;
      }
    }
  }

  // .modal-header {
  //   display: none;
  // }

  // .modal-body {
  //   img {
  //     max-width: 100%;
  //   }
  // }
</style>

<script>
import axios     from 'axios'
import emerModal from '~/components/emerModal.vue'
import headerNav from '~/components/nav.vue'
import modal     from '~/components/modal.vue'

export default {
  // beforeRouteEnter (to, from, next) {
  //   if(from.path == '/')
  //     next('/');
  //   next();
  // },
  beforeRouteEnter (to, from, next) {
    if(from.name !== 'subcategory')
      next(vm => {
        vm.backHome = true;
      });
    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.subGroup}`,
      meta: [
        { hid: 'description', name: 'description', content: `Submit a ${this.$store.getters.group} (${this.$store.getters.subGroup}) uReport service request.` }
      ]
    }
  },
  props: ['item'],
  components: {
    emerModal,
    headerNav,
    modal
  },
  data() {
    return {
      backHome:            false,
      routeCode:           '',
      routeCodeData:       '',
      allData:             [],
      navSubGroup:         true,
      percentCompleted:    '',
      modalImage:          null,
      formElements:        {},
      defaultDescription:  '',
      serviceAttrs:        {},
      showVideoElm:        false,
      mainElm:             '',
      imgContext:          null,
      imgCanvas:           null,
      selectedImage:       null,
      imgElement:          null,
      imgOrientation:      '',
      video:               {},
      canvas:              {},
      captures:            [],
      response:            {},
      singleImgMessage:    'Sorry, we only support a single image at the moment.',
      stepActive: {
        one:               false,
        two:               false,
        three:             true,
        four:              false,
        five:              false,
        six:               false
      },
      stepComplete: {
        one:               true,
        two:               true,
        three:             false,
        four:              false,
        five:              false,
        six:               false
      }
    }
  },
  mounted() {
    if(this.$store.state.serviceInfos.service_group.service_code == '') {
      this.routeCode = this.$route.params.fields.substr(this.$route.params.fields.lastIndexOf('/') + 1);
      this.$store.commit('storeRouteCode', this.routeCode);
      this.$store.commit('storeGroupCode', this.routeCode);

      this.allDatas;
      this.routeDataGroup;
      this.routeDataSubGroup;
    }

    axios.post(`${process.env.apiUrl}${process.env.attrsApi}${this.showServiceCode}.json`)
    .then(res => { this.formElements = res.data })
    .catch(err => { console.log(`Fields page error: ${err}`); });
  },
  methods: {
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
      // var imageLoad = require('blueimp-load-image-npm');
      // let loadImage = require('blueimp-load-image');
      // const EXIF = require('exif-js');

      var self = this;
      var reader, files = e.target.files;
      var reader = new FileReader();
      reader.onload = (e) => {
        // console.log(e);
        var img = new Image();
        img.onload = function() {
          self.drawCanvasImage(img);
        }
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    },
    drawCanvasImage(img) {
      var self = this;
      var canvas = self.$refs.imageCanvas;

      const EXIF = require('exif-js');

      EXIF.getData(img, function() {
        self.imgOrientation = this.exifdata.Orientation;
        // console.log(self.imgOrientation);
        // console.log(this.exifdata);
      });

      var max_width  = 1000;
      var max_height = 1000;
      var width      = img.width;
      var height     = img.height;
      var ctx = canvas.getContext("2d");

      if (4 < self.imgOrientation && self.imgOrientation < 9) {
        if (width > height) {
          if (width > max_width) {
            img.height *= max_width / img.width;
            img.width   = max_width;

            height  = img.height;
            width   = img.width;

            canvas.width = img.height;
            canvas.height = img.width;
          }
        } else {
          // console.log('this here 1');
        }
      } else {
        if (height > max_height) {
          // console.log('this here 2');
          img.height *= max_height / img.width;
          img.width   = max_width;

          height  = img.height;
          width   = img.width;

          canvas.width = img.height;
          canvas.height = img.width;
        }

        canvas.width = width;
        canvas.height = height;
      }

      // console.log('img width ::', img.width);
      // console.log('img height ::', img.height);
      // console.log('var width ::', width);
      // console.log('var height ::', height);
      // console.log('canvas width ::', canvas.width);
      // console.log('canvas height ::', canvas.height);

      switch (self.imgOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      ctx.drawImage(img, 0, 0, width, height);

      if(self.captures.length < 1) {
        self.captures.push(canvas.toDataURL());
      } else {
        alert(self.singleImgMessage);
      }
      // this.exifData();
    },
    storeFormInfo() {
      this.$store.commit('storeServiceAtts', this.serviceAttrs);
      this.$store.commit('storeDefaultDescription', this.defaultDescription);

      // var dataURL      = this.postMedia;
      // console.log(dataURL);
      // var blob         = this.dataURItoBlob(dataURL);
      // console.log(blob);
      this.$store.commit('storeDefaultImage', this.captures[0]);
    },

  },
  computed: {
    allInitGroupData() {
      return this.$store.getters.initGroupData
    },
    allDatas() {
      const allRoutesubGroups = this.allInitGroupData.filter(
        g => g.service_code == this.routeCode
      );
      return allRoutesubGroups[0];
    },
    routeDataGroup() {
      this.$store.commit('storeGroupName', this.allDatas.group);
      return this.allDatas.group;
    },
    routeDataSubGroup() {
      this.$store.commit('storeSubGroupName', this.allDatas.service_name);
      return this.allDatas.service_name;
    },
    showSubGroupName() {
      return this.$store.state.serviceInfos.service_group.service_name
    },
    showServiceCode() {
      return parseInt(this.$store.state.serviceInfos.service_group.service_code, 10)
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
    showGroupName() {
      return this.$store.state.serviceInfos.service_group.group
    }
  }
}
</script>