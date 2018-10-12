export default function (context, params, route, redirect) {
  // If the user has no group selection,
  // and visits a later page ... this redirects them home
  // so they can make a selection.

  // console.log('middleware alert');

  // console.log('route name :: ', context.route.name)
  // // console.log(context)

  // const routeCode = context.store.getters['routeCode'];
  // if(context.route.name == 'info') {
  //   // console.log(context);
  //   console.log('MMMrrrrrrrr ::',routeCode);
  // }

  // if(context.route.name == 'subcategory') {
  //   // console.log(context);
  //   console.log('SSSrrrrrrrr ::',routeCode);
  // }
  // console.log(context);

  // const group = context.store.getters['group'];
  // if(group == '') {
  //   return context.redirect('/:info');
  // }
}