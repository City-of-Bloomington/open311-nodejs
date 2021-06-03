import createPersistedState from "vuex-persistedstate";

export default ({ store, isHMR }) => {
  if (isHMR) return;

  if (process.client) {
    window.onNuxtReady(nuxt => {
      createPersistedState({
        reducer(state, paths) {
          const reducer = Object.assign({}, state);
          delete reducer.initGroupData;
          delete reducer.CITY_NAME;
          delete reducer.cityBoundary;
          delete reducer.cityHallLatLong;
          delete reducer.coordsProjection;
          delete reducer.fromServiceCode;
          delete reducer.routeNames;
          delete reducer.serviceTicketCRMHTML;
          delete reducer.serviceTicketData;
          delete reducer.serviceTypes;
          delete reducer.stepperPaths;
          delete reducer.consoleLog;
          delete reducer.totalSteps;
          delete reducer.seen_modal;
          delete reducer.topbar_height;
          delete reducer.search_height;
          delete reducer.nav_height;
          delete reducer.stepper_height;
          delete reducer.loc_search_height;
          return reducer;
        }
      })(store);
    });
  }
};
