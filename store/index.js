import Vuex from 'vuex'
import axios from 'axios'

const Store = () => {
  return new Vuex.Store({
    state: {
      topbar_height:      '',
      search_height:      '',
      nav_height:         '',
      stepper_height:     '',
      loc_search_height:  '',
      initGroupData:      {},
      serviceInfos: {
        service_group: {
          group:          '',
          service_name:   '',
          service_code:   '',
          route_code:     ''
        },
        personal_info: {
          first_name:     '',
          last_name:      '',
          phone:          '',
          email:          ''
        },
        location_info: {
          loading:        '',
          address_string: '',
          lat:            '',
          long:           ''
        },
        service_fields: {},
        service_response: {}
      }
    },
    mutations: {
      storeInitGroupData(state, payload) {
        state.initGroupData = payload
      },
      storeGroupName(state, payload) {
        state.serviceInfos.service_group.group = payload
      },
      storeRouteCode(state, payload) {
        state.serviceInfos.service_group.service_code = payload
      },
      storeGroupCode(state, payload) {
        state.serviceInfos.service_group.route_code = payload
      },
      storeSubGroupName(state, payload) {
        state.serviceInfos.service_group.service_name = payload
      },
      storePersonalInfo(state, payload) {
        state.serviceInfos.personal_info = payload
      },
      storeFormInfo(state, payload) {
        state.serviceInfos.service_fields = payload
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
      initGroupData:    state => state.initGroupData,
      group:            state => state.serviceInfos.service_group.group,
      subGroup:         state => state.serviceInfos.service_group.service_name,
      subGroupCode:     state => state.serviceInfos.service_group.service_code,
      routeCode:        state => state.serviceInfos.service_group.route_code,
      response:         state => state.serviceInfos.service_response,
      firstName:        state => state.serviceInfos.personal_info.first_name,
      requestID:        state => state.serviceInfos.service_response.service_request_id,
      topbarHeight:     state => state.topbar_height,
      searchHeight:     state => state.search_height,
      navHeight:        state => state.nav_height,
      stepperHeight:    state => state.stepper_height,
      locSearchHeight:  state => state.loc_search_height
    }
  })
}

export default Store