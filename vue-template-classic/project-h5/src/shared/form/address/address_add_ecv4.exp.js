import { Scroller, XHeader, Group, XAddress, ChinaAddressV4Data, XInput, Toast } from 'vux'
import { config } from 'core/context';
export default {
  data() {
    return {
      value: [],
      addressData: ChinaAddressV4Data,
      showAddress: false,
      receivername: '',
      phone: '',
      address: '',
      region: [],
      position: 'middle',
      showPositionValue: false
    }
  },
  methods: {
    async saveHandle() {
      if (!this.receivername || !this.phone || !this.value.length || !this.address) {
        this.showMsg('请完善信息')
        return
      }
      if (!this.testPhone) {
        this.showMsg('请填写正确的手机号')
        return
      }
      // /**收货人*/
      // receivername String
      // /**手机号*/
      // phone Phone
      // /**地区*/
      // region REF_Region
      // /**详细地址*/
      // address String
      // /**是否默认*/
      // Isdefault Boolean
      let entity = new AV.Object('BASE_Address')
      entity.set('receivername', this.receivername)
      entity.set('phone', this.phone)
      entity.set('state', 1)
      let regionquery = new AV.Query('BASE_Region')
      regionquery.equalTo('code', this.value[this.value.length - 1] + '00')
      let res = await regionquery.find()
      this.region = res
      if (res.length < 1) {
        this.showMsg('此地区不在数据库,请更换')
        return
      }
      console.log(res);
      entity.set('region', this.region.find(f => f.get('code') == this.value[this.value.length - 1] + '00'))
      entity.set('address', this.address)
      entity.set('Isdefault', false)
      entity.set('prj', config.prj)
      console.log(entity);
      await entity.save()
      this.$router.go(-1)
    },
    onShadowChange(ids, names) {
      console.log(ids)
      console.log(names)
    },
    logShow(str) {
      console.log('on-show')
    },
    logHide(str) {
      console.log('on-hide', str)
    }
  },
  computed: {
    testPhone() {
      return  /^\d{11}$/.test(this.phone)
    }
  },
  components: {
    Scroller,
    XHeader,
    Group,
    XAddress,
    ChinaAddressV4Data,
    XInput,
    Toast
  }
}
