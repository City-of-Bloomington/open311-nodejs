<template>
  <div>
    <search-input
      v-if="initGroupData"
      :data="initGroupData"
      :value="ticketID"
      field="service_name" />

    <main :class="['home', {'viewing-ticket': serviceTicketData}]">
      <div class="grid" v-if="!serviceTicketData && initGroupData">
        <div
          v-for="group, i in groupCategories"
          :key="group"
          @click="groupName(group)">

          <nuxt-link
            :to="{
              name:   'subcategory',
              params: { subcategory: stringToDashed(`${group}`) }
            }"
            :class="['item', stringToDashed(`${group}`)]">
            <div class="icon"></div>
            <h3>{{ group }}</h3>
          </nuxt-link>
        </div>
      </div>

      <div
        v-if="serviceTicketData"
        class="service-ticket">

        <div class="service-link">
          <a :href="`https://bloomington.in.gov/crm/tickets/view?ticket_id=${serviceTicketData[0].service_request_id}`" class="external" target="_blank" title="Visit ticket via uReport CRM">Visit full ticket</a>
        </div>

        <template v-if="serviceTicketData[0].lat != null">
          <GmapMap
            v-if="serviceTicketData[0].lat"
            style="width: 100%; height: 225px;"
            :center="{lat: parseFloat(serviceTicketData[0].lat), lng: parseFloat(serviceTicketData[0].long)}"
            :zoom="19"
            map-type-id="hybrid"
            :options="{
              zoomControl:        true,
              mapTypeControl:     true,
              scaleControl:       false,
              streetViewControl:  false,
              rotateControl:      false,
              fullscreenControl:  false,
              disableDefaultUi:   true,
              draggable:          true,
              styles: [
                {
                  featureType:    'poi',
                  stylers: [
                    {
                      visibility: 'off'
                    }
                  ]
                },
                {
                  featureType:    'poi.medical',
                  stylers: [
                    {
                      visibility: 'off'
                    }
                  ]
                },
                {
                  featureType:    'poi.government',
                  stylers: [
                    {
                      visibility: 'off'
                    }
                  ]
                }
              ]
            }">

            <GmapMarker
              ref="myMarker"
              :position="{lat: parseFloat(serviceTicketData[0].lat), lng: parseFloat(serviceTicketData[0].long)}"
            />
          </GmapMap>
        </template>

        <div class="service-info">
          <header>
              <h1>{{ serviceTicketData[0].service_name}}</h1>

              <h2>
                <template v-if="serviceTicketData[0].address != ''">
                  {{ serviceTicketData[0].address }}
                </template>
                <template v-else>
                  Missing address
                </template>
              </h2>
          </header>

          <div class="meta-row">
            <fn1-badge :variant="[{'success': serviceTicketData[0].status == 'open', 'danger': serviceTicketData[0].status == 'closed'}]">
              {{ serviceTicketData[0].status }}
            </fn1-badge>

            <span 
              v-if="serviceTicketData[0].requested_datetime != ''"
              class="meta has-icon">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-clock fa-w-16 fa-3x"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z" class=""></path></svg>
              {{ formatDate(serviceTicketData[0].requested_datetime) }}
            </span>

            <span 
              v-if="serviceTicketData[0].agency_responsible != ''" class="meta has-icon">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-users fa-w-20 fa-3x"><path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" class=""></path></svg>
              {{ serviceTicketData[0].agency_responsible }}
            </span>
          </div>
        </div>
        
        <div class="service-body">
          <div class="description" v-if="serviceTicketData[0].description != null">
            <h5>Service Description</h5>
            <p>{{ serviceTicketData[0].description }}</p>
          </div>

          <div class="communication" v-if="serviceTicketCRMHTML">
            <h5>Communication</h5>
            <ul class="hotline" v-for="c, i in setCommunicationHistory">
              <li>{{ c.heading }}</li>
              <li>{{ c.body }}</li>
            </ul>
          </div>
        </div>
      </div>

      <emerModal />
      <p class="emergency">
        <strong>Note:</strong> If an Emergency, dial 911.
      </p>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  main {
    &.home {
      margin: 0 auto;
      // background-color: red;
      height: 100vh;
      max-height: calc(100vh - 165px);

      // background-color: pink;
      // height: calc(100vh - 161px);
      // max-height: calc(100vh - 165px);
      // height: max-content;

      &.viewing-ticket {
        padding-bottom: 20px;
        max-height: calc(100vh - 165px);
        height: max-content;
      }

      .service-ticket {
        position: relative;
        margin: 25px 0 20px 0;
        border-radius: $radius-default;
        background: white;
        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.10);
        color: $text-color;

        .service-link {
          position: absolute;
          top: -26px;
          right: 0;
          background: white;
          padding: 0 0 10px 10px;
          -webkit-border-top-left-radius: 3px;
          -webkit-border-top-right-radius: 3px;
          -moz-border-radius-topleft: 3px;
          -moz-border-radius-topright: 3px;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;

          a {
            font-size: 14px;
            line-height: 14px;
            font-weight: 600;
            color: $text-color;

            &:hover {
              color: $color-blue;
            }
          }
        }

        .service-info {
          padding: 0 10px 10px 10px;

          .meta-row {
            display: flex;
            padding: 0 0 10px 0;
            border-bottom: 1px solid lighten($text-color, 50%);

            span {
              &:nth-child(-n+2) {
                margin: 0 20px 0 0;
              }
            }
          }

          .badge {
            font-size: 14px;
            line-height: 14px;
            padding: 2px 10px;
            text-transform: capitalize;

            &.primary {
              background-color: $color-green;
            }

            &.closed {
              background-color: $color-vermilion-dark;
            }
          }


          span {
            &.meta {
              font-weight: $weight-semi-bold;
              font-size: 14px;
              color: lighten($text-color, 10%);

              &.has-icon {
                display: flex;
                align-items: center;
              }

              svg {
                margin: 0 5px 0 0;
                width: 17px;
                height: 17px;;
              }
            }
          }
          
          header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            margin: 0 0 10px 0;
            border-bottom: 1px solid lighten($text-color, 50%);
            
            h1, h2 {
              font-weight: 600;
            }
            
            h1 {
              width: 100%;
              font-size: 20px;
              line-height: 24px;
              color: $text-color;
              margin: 5px 0;
            }

            h2{
              font-size: 16px;
              line-height: 20px;
              color: lighten($text-color, 10%);
              width: 100%;
            }
          }
        }

        .service-body {
          padding: 0 10px 10px 10px;

          h5 {
            position: relative;
            color: lighten($text-color, 20%);
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
          }

          p {
            position: relative;
            font-size: 16px;
            line-height: 24px;
          }

          .description {
            margin: 0 0 20px 0;
          }

          .communication {
            h5 {
              margin: 0 0 5px 0;
            }

            ul {
              margin: 0 0 10px 0;

              li {
                margin: 0 0 5px 0;
                font-size: 16px;
                line-height: 24px;
                color: $text-color;

                &:nth-child(1) {
                  font-size: 14px;
                  line-height: 14px;
                  color: lighten($text-color, 10%);
                  font-weight: 600;
                }

                &:nth-child(2) {
                  margin: 0 0 0 10px;
                }
              }
            }
          }
        }
      }

      @media only screen
      and (min-device-width : 320px)
      and (max-device-width : 480px) {
        padding: 2px 0;
        // background-color: purple !important;
        margin: 0 auto;
        // max-height: calc(100vh - 125px);
        height: auto;

        .service-ticket {

          .service-info {
            header {
              h2 {
                width: 295px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .meta-row {
              flex-wrap: wrap;

              span {
                &:nth-child(3) {
                  margin: 10px 0 0 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

<script>
import emerModal      from '~/components/emerModal.vue'
import searchInput    from '~/components/searchInput.vue'
import topBar         from '~/components/topBar.vue'
import { mapFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(to.query.ticket){
        vm.ticketID = to.query.ticket;

        vm.getServiceRequest(to.query.ticket)
        .then((res) => {
          vm.$store.dispatch("setServiceTicketData", res);

          vm.getServiceRequestCRMHTML(to.query.ticket)
          .then((res) => {
            vm.$store.dispatch("setServiceTicketCRMHTML", res);
          })
          .catch((e)  => console.log(e));
        })
        .catch((e)  => console.log(e));
      }

      if(!vm.initGroupData)
        vm.$axios.get(`${process.env.CRM_API_URL}${process.env.SERVICES_API}`)
        .then((res) => {
          vm.$store.dispatch("setInitGroupData", res)
        })
        .catch((err) => {
          console.error(err)
        });
      next();
    });
  },
  head () {
    return {
      titleTemplate: `%s - City of Bloomington`,
    }
  },
  components: {
    emerModal,
    searchInput,
    topBar
  },
  data() { return {
    ticketID: null,
  } },
  methods: {
    formatDate(date) {
      let newDate = new Date(date)
      return newDate.toLocaleDateString("en-US");
    },
    groupName(name) {
      return this.$store.dispatch('setGroupName', name)
    }
  },
  computed: {
    ...mapFields([
      'initGroupData',
      'serviceTicketData',
      'serviceTicketCRMHTML',
    ]),
    ticketData(){
      return this.serviceTicketData[0]
    },
    groupCategories() {
      if(this.initGroupData)
        return [...new Set(this.initGroupData.map(g => g.group))]
    },
    setCommunicationHistory() {
      if(this.serviceTicketCRMHTML) {
        const cheerio = require('cheerio'),
                    $ = cheerio.load(this.serviceTicketCRMHTML);

        let history = $(".history").find('.historyItem'),
              names = [];

        $(history).each(function(i, value) {
          let headingTxt = $(value).find("header h1").text(),
             testBodyTxt = $(value).find(".historyItem p") !== null,
                 bodyTxt = testBodyTxt ? $(value).find(".historyItem p").text() : null,
         testMessagesTxt = $(value).find(".historyItem .message") !== null,
              messageTxt = testMessagesTxt ? $(value).find(".historyItem .message").text() : null;
                 
          
          let data = {
            "heading":  headingTxt,
            "body":     bodyTxt,
            "messages": messageTxt,
          }

          names.push(data);
        });

        return names
      }
    },
  },
}
</script>