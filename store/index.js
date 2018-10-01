import Vuex from 'vuex'

const Store = () => {
  return new Vuex.Store({
    state: {
      header_height: '',
      search_height: '',
      nav_height:    '',
      serviceInfos: {
        service_group: {
          group:          '',
          service_name:   '',
          service_code:   ''
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
      storeGroupName(state, payload) {
        state.serviceInfos.service_group.group = payload
      },
      storeSubGroupName(state, payload) {
        state.serviceInfos.service_group = payload
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
      storeHeaderHeight(state, payload) {
        state.header_height = payload
      },
      storeSearchHeight(state, payload) {
        state.search_height = payload
      },
      storeNavHeight(state, payload) {
        state.nav_height = payload
      }
    },
    actions: {},
    getters: {
      group:          state => state.serviceInfos.service_group.group,
      subGroup:       state => state.serviceInfos.service_group.service_name,
      subGroupCode:   state => state.serviceInfos.service_group.service_code,
      response:       state => state.serviceInfos.service_response,
      firstName:      state => state.serviceInfos.personal_info.first_name,
      requestID:      state => state.serviceInfos.service_response.service_request_id,
      headerHeight:   state => state.header_height,
      searchHeight:   state => state.search_height,
      navHeight:      state => state.nav_height
    }
  })
}

export default Store