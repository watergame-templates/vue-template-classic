import { Scroller, XHeader, Panel, Confirm, XButton, TransferDom } from 'vux'
import { setStorage } from 'core/context.js'
import { config } from 'core/context';
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      type: "4",
      addressList: [],
      tmpAddressList: [],
      sortAddressList: [],
      isShowConfirm: false,
      selectDeleteIndex: 0,
      isShowAddressList: false
    }
  },
  async activated() {
    this.type = "4"
    this.addressList = []
    this.sortAddressList = []
    this.isShowConfirm = false
    this.selectDeleteIndex = 0
    this.isShowAddressList = false
    let tmpArr = []
    await new AV.Query('BASE_Address').equalTo('state', 1).find()
      .then(subAddress => {
        console.log(subAddress)
        if (subAddress.length == 0) {
          this.isShowAddressList = false
        } else {
          this.isShowAddressList = true
        }
        this.tmpAddressList = subAddress
        subAddress.forEach(addressItem => {
          this.addressList.push(addressItem.toJSON())
        })
      })
    this.addressList.forEach((v, i) => {
      let tmpObj = {
        ...v,
        list: [
          {
            desc: v.address,
            title: `${v.receivername}   ${v.phone}`
          }
        ]
      }
      tmpArr.push(tmpObj)
    })
    this.selectDefault(tmpArr)
  },
  methods: {
    onItem(item, index) {
      // if (!this.$route.query.objectId) return
      // let entity = AV.Object.createWithoutData(config.prj.toUpperCase() + '_Order', this.$route.query.objectId)
      // if (this.tmpAddressList[index].attributes) {
      //   entity.set('shippingAddress', this.tmpAddressList[index])
      // } else {
      //   entity.set('shippingAddress', AV.Object.createWithoutData('BASE_Address', this.tmpAddressList[index].objectId))
      // }
      // entity.set('shippingReceiverName', this.tmpAddressList[index].receivername || this.tmpAddressList[index].get('receivername'))
      // entity.set('shippingReceiverPhone', this.tmpAddressList[index].phone || this.tmpAddressList[index].get('phone'))
      // entity.set('shippingAddress_address', this.tmpAddressList[index].address || this.tmpAddressList[index].get('address'))
      // entity.save()
      //   .then(result => {
      //     this.$router.go(-1)
      //   })
      setStorage('selectAddress', this.tmpAddressList[index])
      this.$router.go(-1)
    },
    onCancel() {
    },
    onConfirm(msg) {
      AV.Object.createWithoutData('BASE_Address', this.addressList[this.selectDeleteIndex].objectId)
        .destroy()
        .then(result => {
          this.addressList.splice(this.selectDeleteIndex, 1)
        })
    },
    onHide() {
    },
    onShow() {
    },
    deleteSelectItem(index) {
      this.isShowConfirm = true
      this.selectDeleteIndex = index
    },
    editSelectItem(index) {
      this.$router.push({ name: 'address_edit_ecv4', query: { objectId: this.addressList[index].objectId } })
    },
    async selectTheDefault(index) {
      let entityOld = new AV.Object.createWithoutData('BASE_Address', this.addressList[0].objectId)
      let entityNew = new AV.Object.createWithoutData('BASE_Address', this.addressList[index].objectId)
      entityOld.set('Isdefault', false)
      entityNew.set('Isdefault', true)
      await entityOld.save()
      await entityNew.save()
      this.addressList[0].Isdefault = false
      this.addressList[index].Isdefault = true
      this.selectDefault()
    },
    selectDefault(tmpArr) {
      if (tmpArr) {
        this.addressList = tmpArr
      }
      let sortArr = []
      sortArr.push(this.addressList.find((f, i) => {
        if (f.Isdefault) {
          this.addressList.splice(i, 1)
        }
        return !!f.Isdefault
      }))
      if (sortArr[0]) {
        sortArr = [...sortArr, ...this.addressList]
        this.addressList = sortArr
        this.tmpAddressList = sortArr
      }
    },
    goAddAddress() {
      this.$router.push({ name: 'address_add_ecv4' })
    },
    onImgError(item, e) {
    }
  },
  components: {
    Scroller,
    XHeader,
    Panel,
    Confirm,
    XButton
  }
}
