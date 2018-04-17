<template>
  <div class='login'>
    <x-header left-options.preventGoBack @on-click-back="clickBack" :left-options="{backText: ''}" style="background-color:#3190e8">登录</x-header>
    <form class="loginForm" >
      <section class="input_container phone_number">
        <input keyboard="number" type="number" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
      </section>
      <section class="input_container">
        <input keyboard="number" type="number" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <p class="login_tips">
      温馨提示: 未注册联众同行账号的手机号，登录时将自动注册，且代表您已同意
      <span @click="goAggrement">《用户协议》</span>
    </p>
    <div class="login_container" @click="login">手机登录</div>
    <p class="line" v-if="isWx"></p>
    <div class="login_container login_wx" @click="wxLogin" v-if="isWx">微信登录</div>
  </div>
</template>
<script>
import AV from 'leancloud-storage';
import {app} from 'utils/config';
import {config, setStorage, sendSms, getSharelogFun } from 'core/context';
import _ from 'lodash';

import {XHeader} from 'vux'

import mixin_g from './login.g.js';
export default {
  mixins: [mixin_g],
  components: {
    XHeader
  },
  data() {
    return {
      linkToPath: '/',
      phoneNumber:null,             // 手机号
      computedTime: 0,            // 验证码倒计时
      mobileCode: null           //短信验证码
    };
  },
  mounted() {
    if (this.$route.query.linkToPath) {
      this.linkToPath = this.$route.query.linkToPath;
    }
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function (){
      return /^1\d{10}$/gi.test(String(this.phoneNumber))
    },
    isWx() {
      return config.project_build_type === 'wx'
    }
  },
  methods: {
    clickBack() {
      this.$router.go(-2)
    },
    // 登录
    async login() {
      if (!this.phoneNumber) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入手机号!',
          position: 'bottom',
          width: '80vw'
        });
        return;
      }
      if (!this.rightPhoneNumber) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入正确的手机号!',
          position: 'bottom',
          width: '80vw'
        });
        return;
      }
      if (!this.mobileCode) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入验证码!',
          position: 'bottom',
          width: '80vw'
  
        });
        return;
      }
      try {
        let result = await AV.User.signUpOrlogInWithMobilePhone(this.phoneNumber, this.mobileCode);
        // 登录成功
        if (config.project_build_type !== 'wx' || process.env.NODE_ENV === 'development') {
          let sessionToken = AV.User.current().getSessionToken()
          this.IPC('IPC_login', {
              sessionToken
            })
        }
        // 缓存token
        setStorage('token', { token: result.id });
        getSharelogFun(this.$route, 2)()
        // if (config.project_build_type === 'app') this.sendUserInfoToNative(result.toJSON());
        let query = _.clone(this.$route.query)
        delete query.linkToPath
        // 添加 mixapp 登录
        
        this.$router.replace({ path: this.linkToPath, query });

      } catch (e) {
        this.$vux.toast.show({
          type: 'text',
          text: e.message,
          position: 'bottom',
          width: '80vw'
        });
        throw e;
      }

    },
    wxLogin() {
      let r = window.location.href
      r = r.replace('/form/login/login', '/form/login/login_wx')
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx_app_id_pub +'&redirect_uri=' +
      window.encodeURIComponent(r)
      + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    },
    // 获取验证码
    getVerifyCode() {
      if (!this.rightPhoneNumber) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入正确的手机号!',
          position: 'bottom',
          width: '80vw'
        });
        return;
      }
      if (this.rightPhoneNumber) {
        this.computedTime = 30;
        this.timer = setInterval(() => {
          this.computedTime --;
          if (this.computedTime == 0) {
            clearInterval(this.timer)
          }
        }, 1000)
      }
      sendSms(this.phoneNumber).then((success) => {
        this.$vux.toast.show({
          type: 'text',
          text: '验证码已发送至您的手机',
          position: 'bottom',
          width: '80vw'
        });
      }).catch((e) => {
        this.$vux.toast.show({
          type: 'text',
          text: e.message,
          position: 'bottom',
  
        });
      });
    },
    // 跳转用户协议
    goAggrement() {
      this.$router.push({ name: 'protocol_agreement' });
    },
    // 发送用户信息至native @param userinfo
    sendUserInfoToNative(userInfo) {
      window.broadcaster.fireNativeEvent( "ON_LOGIN", { userInfo:  userInfo});
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../../assets/stylus/mixin.styl'
  .login
    position: relative
    height: 100%
    width 100%
    overflow hidden
    z-index: 300
    background: #F5F5F5
    .header
      height .45rem
      line-height .45rem
      width 100%
      background-color #3190e8
      color #fff
      .icon-fanhui
        position absolute
        left .1rem
        font-size .25rem
      h1
        font-size .2rem
  .loginForm
    margin-top .15rem
    background-color:#fff
    .input_container
      display flex
      justify-content  space-between
      padding: .15rem .2rem
      border-bottom 1px solid #f1f1f1
      input
        width 1.9rem
        font-size .185rem
        color #666
        outline: none
      button
        background-color #dddddd
        font-size .16rem
        color #fff
        font-family: Helvetica Neue,Tahoma,Arial
        padding .07rem .1rem
        border 1px
        border-radius .04rem
      .right_phone_number
        background-color #7a79f1
    .phone_number
      padding: .07rem .2rem
  .login_tips
    font-size .125rem
    color red
    padding .1rem .15rem
    line-height .25rem
    text-align left
    span
      color #3b95e9
  .login_container
    margin 0 .125rem .025rem
    font-size .175rem
    color #fff
    background-color #7a79f1
    padding .125rem 0
    border 1px
    border-radius .04rem
    margin-bottom 30px
  .login_wx
    background-color #04BE01
    margin-top 30px
  .line
    height 0
    width 100%
    border-bottom 1px solid #b2b2b2

</style>
