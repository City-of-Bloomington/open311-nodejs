import createPersistedState from 'vuex-persistedstate';

export default ({ store, isHMR }) => {
  if (isHMR) return;

  if (process.client) {
    window.onNuxtReady((nuxt) => {
      createPersistedState({
        reducer(state, paths) {
          const reducer = Object.assign({}, state);
          delete reducer.totalSteps;
          delete reducer.seen_modal;
          delete reducer.topbar_height;
          delete reducer.search_height;
          delete reducer.nav_height;
          delete reducer.stepper_height;
          delete reducer.loc_search_height;
          return reducer;
        }
      })(store)
    });
  }
}