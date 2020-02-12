import Vuex from 'vuex'
import axios from 'axios'

import { getField, updateField } from 'vuex-map-fields';

// export const strict = false;

export const defaultState = () => ({
  seen_modal:         false,
  topbar_height:      '',
  search_height:      '',
  nav_height:         '',
  stepper_height:     '',
  loc_search_height:  '',
  initGroupData:      {},
  fromServiceCode:    '',
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
    location_data:  {},
    location_info: {
      address_string: '',
      lat:            '',
      long:           ''
    },
    default_image:    '',
    service_attrs:    {},
    pre_service_attrs: [],
    default_description: '',
    service_response: {},
  },
  serviceTicketData:  null,
  serviceTicketCRMHTML: null,
  cityBoundary:       null,
  cityName:           process.env.cityName,
  coordsProjection:   process.env.coordsProjection,
  cityHallLatLong:    process.env.cityHallLatLong,
  consoleLog: {
    info: ['background: rgb(30, 90, 174)',
      'color: white',
      'display: block',
      'border-radius: 3px',
      'padding: 2px 0'].join(';'),

    success: ['background: rgb(76, 174, 79)',
      'color: white',
      'display: block',
      'border-radius: 3px',
      'padding: 2px 0'].join(';'),

    error: ['background: rgb(235, 59, 36)',
      'color: white', 'display: block',
      'border-radius: 3px',
      'padding: 2px 0'].join(';')
  }
});

const state = () => defaultState();

export const mutations = {
  updateField,
  RESET_BASE_STATE(state) {
    Object.assign(state, defaultState())
  },
  seenModal(state, payload) {
    state.seen_modal = payload
  },
  storeInitGroupData(state, payload) {
    state.initGroupData = payload
  },
  storeFromServiceCode(state, payload) {
    state.fromServiceCode = payload
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
  storePreServiceAtts(state, payload) {
    state.serviceInfos.pre_service_attrs = payload
  },
  storeLocationInfo(state, payload) {
    state.serviceInfos.location_info = payload
  },
  storeLocationLat(state, payload) {
    state.serviceInfos.location_info.lat = payload
  },
  storeLocationLong(state, payload) {
    state.serviceInfos.location_info.long = payload
  },
  storeLocationLoading(state, payload) {
    state.serviceInfos.location_info.loading = payload
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
  },
  SET_LOCATION_DATA(state, payload) {
    state.serviceInfos.location_data = payload
  },
  SET_CITY_BOUNDARY_RESPONSE_DATA(state, payload) {
    state.cityBoundary = payload
  },
  SET_SERVICE_TICKET_DATA(state, payload) {
    state.serviceTicketData = payload
  },
  SET_SERVICE_TICKET_CRM_HTML(state, payload) {
    state.serviceTicketCRMHTML = payload
  }
}

export const actions = {
  resetBaseState({ commit }) {
    commit('RESET_BASE_STATE')
  },
  setGroupName(context, payload) {
    context.commit('storeGroupName', payload)
  },
  setSubGroupName(context, payload) {
    context.commit('storeSubGroupName', payload)
  },
  setGroupCode(context, payload) {
    context.commit('storeGroupCode', payload)
  },
  setRouteCode(context, payload) {
    context.commit('storeRouteCode', payload)
  },
  setFromServiceCode(context, payload) {
    context.commit('storeFromServiceCode', payload)
  },
  setServiceAttrs(context, payload) {
    context.commit('storeServiceAtts', payload)
  },
  setPreServiceAttrs(context, payload) {
    context.commit('storePreServiceAtts', payload)
  },
  setLocationLat(context, payload) {
    context.commit('storeLocationLat', payload)
  },
  setLocationLong(context, payload) {
    context.commit('storeLocationLong', payload)
  },
  setDefaultImage(context, payload) {
    context.commit('storeDefaultImage', payload)
  },
  setLocationData(context, payload) {
    context.commit('SET_LOCATION_DATA', payload)
  },
  setCityBoundaryData(context, payload) {
    context.commit("SET_CITY_BOUNDARY_RESPONSE_DATA", payload)
  },
  setServiceTicketData(context, payload) {
    context.commit("SET_SERVICE_TICKET_DATA", payload)
  },
  setServiceTicketCRMHTML(context, payload) {
    context.commit("SET_SERVICE_TICKET_CRM_HTML", payload)
  },
  async nuxtServerInit({ commit }) {
    let { data } = await axios.get(`${process.env.apiUrl}${process.env.servicesApi}`)
    commit('storeInitGroupData', data)
  }
}

export const getters = {
  getField,
  seenModal:          state => state.seen_modal,
  initGroupData:      state => state.initGroupData,
  group:              state => state.serviceInfos.service_group.group,
  subGroup:           state => state.serviceInfos.service_group.service_name,
  subGroupCode:       state => state.serviceInfos.service_group.service_code,
  routeCode:          state => state.serviceInfos.service_group.route_code,
  response:           state => state.serviceInfos.service_response,
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

export default {
  namespaced: true,
  modules: {},
  mutations,
  actions,
  getters,
  state,
};