import Vuex from 'vuex'
import axios from 'axios'

const Store = () => {
  return new Vuex.Store({
    state: {
      seen_non_emer_modal:     false,
      seen_pub_record_modal:   false,
      seen_modal:              false,
      topbar_height:           '',
      search_height:           '',
      nav_height:              '',
      stepper_height:          '',
      loc_search_height:       '',
      initGroupData:           {},
      serviceInfos: {
        service_group: {
          group:               '',
          service_name:        '',
          service_code:        '',
          route_code:          ''
        },
        personal_info: {
          first_name:          '',
          last_name:           '',
          phone:               '',
          email:               ''
        },
        location_info: {
          loading:             '',
          address_string:      '',
          lat:                 '',
          long:                ''
        },
        default_image:         '',
        service_attrs:         {},
        default_description:   '',
        service_response:      {}
      }
    },
    mutations: {
      seenNonEmerModal(state, payload){
        state.seen_non_emer_modal = payload
      },
      seenPubRecordModal(state, payload) {
        state.seen_pub_record_modal = payload
      },
      seenModal(state, payload) {
        state.seen_modal = payload
      },
      storeInitGroupData(state, payload) {
        state.initGroupData = payload
      },
      storeGroupName(state, payload) {
        state.serviceInfos.service_group.group = payload
      },
      storeGroupCode(state, payload) {
        state.serviceInfos.service_group.service_code = payload
      },
      storeRouteCode(state, payload) {
        state.serviceInfos.service_group.route_code = payload
      },
      storeSubGroupName(state, payload) {
        state.serviceInfos.service_group.service_name = payload
      },
      storePersonalInfo(state, payload) {
        state.serviceInfos.personal_info = payload
      },
      storeDefaultDescription(state, payload) {
        state.serviceInfos.default_description = payload
      },
      storeDefaultImage(state, payload) {
        state.serviceInfos.default_image = payload
      },
      storeServiceAtts(state, payload) {
        state.serviceInfos.service_attrs = payload
      },
      storeLocationInfo(state, payload) {
        state.serviceInfos.location_info = payload
      },
      storeResponseInfo(state, payload) {
        state.serviceInfos.service_response = payload
      },
      storeTopBarHeight(state, payload) {
        state.topbar_height = payload
      },
      storeSearchHeight(state, payload) {
        state.search_height = payload
      },
      storeNavHeight(state, payload) {
        state.nav_height = payload
      },
      storeStepperHeight(state, payload) {
        state.stepper_height = payload
      },
      storeLocSearchHeight(state, payload) {
        state.loc_search_height = payload
      }
    },
    actions: {
      async nuxtServerInit ({commit}) {
        let {data} = await axios.get(`${process.env.apiUrl}${process.env.servicesApi}`)
        commit('storeInitGroupData', data)
      }
    },
    getters: {
      seenNonEmerModal:   state => state.seen_non_emer_modal,
      seenPubRecordModal: state => state.seen_pub_record_modal,
      seenModal:          state => state.seen_modal,
      initGroupData:      state => state.initGroupData,
      group:              state => state.serviceInfos.service_group.group,
      subGroup:           state => state.serviceInfos.service_group.service_name,
      subGroupCode:       state => state.serviceInfos.service_group.service_code,
      routeCode:          state => state.serviceInfos.service_group.route_code,
      response:           state => state.serviceInfos.service_response,
      defaultDescription: state => state.serviceInfos.default_description,
      defaultImage:       state => state.serviceInfos.default_image,
      serviceAttrs:       state => state.serviceInfos.service_attrs,
      firstName:          state => state.serviceInfos.personal_info.first_name,
      lastName:           state => state.serviceInfos.personal_info.last_name,
      phone:              state => state.serviceInfos.personal_info.phone,
      email:              state => state.serviceInfos.personal_info.email,
      locationAddress:    state => state.serviceInfos.location_info.address_string,
      locationLat:        state => state.serviceInfos.location_info.lat,
      locationLong:       state => state.serviceInfos.location_info.long,
      requestID:          state => state.serviceInfos.service_response.service_request_id,
      topbarHeight:       state => state.topbar_height,
      searchHeight:       state => state.search_height,
      navHeight:          state => state.nav_height,
      stepperHeight:      state => state.stepper_height,
      locSearchHeight:    state => state.loc_search_height
    }
  })
}
export default Store