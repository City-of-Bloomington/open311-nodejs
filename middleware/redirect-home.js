export default function (context, params, route, redirect) {
  // If the user has no service code selection,
  // and visits a later page ... this redirects them home
  // so they can make a selection.
  const serviceCode = context.store.getters['subGroupCode'];
  if(serviceCode == '') {
    return context.redirect('/');
  }
}