
  // generated on Wed Dec 27 2017 09:07:30 GMT+0800 (中国标准时间)
  import { getUIConfigJson, initWechatSDK, config, baseURL, replaceImgUrl } from 'core/context'
  import _ from 'lodash'
  import Vue from 'vue'
    export default {
      name: 'address_edit_ecv4',
      data() {
        return {
          metauiJson: {},
          metauiJsonClass: [],
          title: ''
        }
      },
      props: {
          
        },
      async created(){
        let code = this.$route.query.metauiJson ? this.$route.query.metauiJson : 'address_edit_ecv4'
        let res = await this.loadCfg('gj', code)
        this.metauiJson = res
        this.init_g(this.metauiJson)
        this.title= _.get(res, 'cfg.title')
        _.isFunction(this.init) && this.init(_.cloneDeep(this.metauiJson))
      },
      
          activated(){
            this.init_g(this.metauiJson)
          },
          
    
    methods: {
        async loadCfg(prj, code) {
          // let url = '/meta/wx/' + prj + '/' + code.split('_')[0] + '/' + code + '.metaui.g.json'
          let avcode = prj + '_' + code
          let res
          try{
              res = await getUIConfigJson(prj, avcode)
          } catch(err) {
              res = require('./address_edit_ecv4.metaui.json')
              replaceImgUrl(res, 'gj', 'address')
          }
          return res
        },
        init_g(res) {
          try {
              document.title = res.cfg.title
          } catch (err) {
              document.title = ' '
          }
          
          this.metauiJsonClass = ['address_edit_ecv4', res.code]
          let wxcfg = _.get(res, 'cfg.wxShareConfig', {})
          this.initWx_g(wxcfg)
        },
        initWx_g(wxcfg) {
          if (config.project_build_type === 'wx') {
            initWechatSDK(Vue.wechat, wxcfg, this.$route).then(res => res).catch(res => this.showErr(res));
          }
        }
    }
    }