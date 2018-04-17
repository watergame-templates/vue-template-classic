import { Scroller, XHeader, Group, XAddress, ChinaAddressV4Data, XInput, Toast } from 'vux'

export default {
  data() {
    return {
      value: [],
      addressData: ChinaAddressV4Data,
      showAddress: false,
      receivername: '',
      phone: '',
      address: '',
      Isdefault: false,
      region: [],
      position: 'middle',
      showPositionValue: false
    }
  },
  async activated() {
    this.value = []
    await new AV.Query('BASE_Address').get(this.$route.query.objectId)
      .then(result => {
        const entity = result.toJSON()
        // '收货人': this.receivername,
        this.receivername = entity.receivername
        console.log(this.receivername)
        // '联系方式': this.phone,
        this.phone = entity.phone
        // '所在区域': this.value,
        console.log(entity.region_code)
        this.value.push(entity.region_code.slice(0, 2) + '0000')
        this.value.push(entity.region_code.slice(0, 4) + '00')
        this.value.push(entity.region_code.slice(0, 6))
        // '详细地址': this.address
        this.address = entity.address
      })
  },
  computed: {
    testPhone() {
      return  /^\d{11}$/.test(this.phone)
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
      let entity = AV.Object.createWithoutData('BASE_Address', this.$route.query.objectId)
      entity.set('receivername', this.receivername)
      entity.set('phone', this.phone)
      let regionquery = new AV.Query('BASE_Region')
      regionquery.equalTo('code', this.value[this.value.length - 1] + '00')
      let res = await regionquery.find()
      this.region = res
      entity.set('region', this.region.find(f => f.get('code') == this.value[this.value.length - 1] + '00'))
      entity.set('region_code', this.value[this.value.length - 1] + '00')
      entity.set('region_name', this.region.find(f => f.get('code') == this.value[this.value.length - 1] + '00').toJSON().name)
      entity.set('address', this.address)
      entity.save()
        .then(result => {
          this.$router.go(-1)
        })
    },
    onShadowChange(ids, names) {
      console.log(ids, names);
    },
    logShow(str) {
      console.log('on-show')
    },
    logHide(str) {
      console.log('on-hide', str)
    },
    async init() {
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
