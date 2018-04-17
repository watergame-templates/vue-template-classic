<template>
  <div>
    <cell 
      @on-change="change"
      @click.native="ref_cell_click({
        model: model,
        title: proTitle,
        labelKey: labelKey,
        refClass: refClass
      })" 
      :value="refValue">
      <div slot="title" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
      </div>
    </cell>
    <div v-transfer-dom>
      <popup 
        v-model="redioState.showRedio"
        position="bottom"
        height="50%"
        @on-hide="redioHide">
        <popup-header
          left-text="取消"
          :title="redioState.redioTitle"
          :show-bottom-border="true"
          @on-click-left="redioState.showRedio = false"
        ></popup-header>
        <group>
          <radio 
            title="title" 
            :options="redioState.options" 
            v-model="redioState.currentOption"
            @on-change="changeRadio">
            <template slot-scope="props" slot="each-item">
              <p>
                {{ props.label }}
              </p>
            </template>
          </radio>
        </group>
      </popup>
    </div>
  </div>
  
</template>

<script>
import { Popup, Radio, Group, PopupHeader, TransferDom } from 'vux'
import baseMixin from './mixin/baseMixin'
import { firstUpperCase } from 'core/context'

export default {
  mixins: [baseMixin],
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Radio,
    Group,
    PopupHeader
  },
  props: {
    refClass: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      redioState: {
        showRedio: false,
        redioTitle: '',
        currentOption: '',
        refClass: '',
        options: [],
        labelKey: '',
        model: null,
        enum: false
      }
    }
  },
  computed: {
    refValue() {
      let obj = this.redioState.options.find(item => {
        return item.key === this.model[this.labelKey]
      })
      if (obj === undefined) {
        return this.model[`${this.labelKey}_name`]
      } else {
        return obj.value
      }
    }
  },
  methods: {
    async ref_cell_click({model, title, labelKey, refClass} = obj) {
      if (this.readonly) {
        return
      }
      try {
        this.redioState.redioTitle = title
        this.redioState.showRedio = true
        this.redioState.labelKey = labelKey
        this.redioState.refClass = refClass
        this.redioState.model = model
        let rlist = await this.load_refClass_data(refClass)
        this.redioState.options = rlist.map(this.toentitydata_refData)
     } catch (error) {
        console.log(error)
      }  
    },
    toentitydata_refData(e) {
      let r = {}
      r.key = e.get('objectId')
      r.value = e.get('name')
      return r
    },
    change(key,val) {
      this.$emit('change', key, val)
    },
    changeRadio(value,label) {
      this.redioState.showRedio = false
      
      this.redioState.currentOption = value
      const selectProperty = this.redioState.labelKey
      const className = firstUpperCase(selectProperty)
      const selectInfo = this.AV.Object.createWithoutData(this.redioState.refClass, value)
      this.$set(this.redioState.model, this.redioState.labelKey, selectInfo)
      this.$set(this.redioState.model, `${this.labelKey}_name`, label)
    },
    redioHide() {
      this.redioState.enum = false
    },
    async load_refClass_data(refClass) {
      let q = new this.AV.Query(refClass)
        //todo 过滤条件.equalTo(this.selectByteName, this.uimodel_item[this.editObjectByteName])4
        q.equalTo('createdby', this.AV.User.current())
        // if (refClass === 'BASE_Category') {
        //   q.equalTo('prj', this.$route.query.prj)
        // }
        q.limit(1000)
      return await   q.find()
    },
  }
}
</script>