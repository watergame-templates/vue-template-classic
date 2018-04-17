<template>
  <div id="app" :class="buildTypeClass">
    <keep-alive :include="keepalivelist">
      <router-view v-if="$route.meta && $route.meta.keepAlive" class="router-view"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta || !$route.meta.keepAlive" class="router-view"></router-view>
  </div>
</template>

<script>
import { keepalivelist } from 'core/context'
export default {
  name: 'app',
  data() {
    return {
      keepalivelist
    }
  },
  computed: {
    buildTypeClass() {
      return [`build_type_${process.env.PROJECT_BUILD_TYPE}`]
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import '~vux/src/styles/weui/weui';
  @import '~vux/src/styles/reset';
  @import '~vux/src/styles/1px';
  @import './assets/stylus/base.ex.less';
  #app {
    font-family: 'PingFangSC Regular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #2c3e50;
  }

  .router-view {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .mint-indicator-wrapper {
    z-index: 10000
  }
  .build_type_mixapp {
    .vux-header {
      display: none!important;
    }
  }
</style>
