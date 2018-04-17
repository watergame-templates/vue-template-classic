import Router from 'vue-router'
import routerG from './router.g'
let routes = []

routes = routes.concat(routerG)

export default new Router({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

