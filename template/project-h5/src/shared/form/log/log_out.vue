<template>
  <div>
    
  </div>
</template>

<script>
import {config, IPC} from 'core/context'
import mixin_g from './log_out.g.js';

export default {
  mixins: [mixin_g],
  beforeRouteEnter(to, from, next) {
    AV.User.logOut()
    IPC('IPC_logout', {
      logout: true
    })
    next()
  }
}
</script>

<style>

</style>
