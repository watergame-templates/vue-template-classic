<template>
  <div>
    
  </div>
</template>

<script>
import mixin_g from './login_wx.g.js';
export default {
  mixins: [mixin_g],
  beforeRouteEnter(to, from, next) {
      delete to.query.code
      next({
        path: to.query.linkToPath || '/',
        query: to.query
      })
  }
}
</script>

<style>

</style>
