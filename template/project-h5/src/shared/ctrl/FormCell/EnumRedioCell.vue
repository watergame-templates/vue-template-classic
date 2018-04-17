<template>
  <div>
    <cell 
      @click.native="enum_cell_click({
          model: model,
          title: proTitle,
          labelKey: labelKey,
          enum_map: toEnumMap
        })"
      :value="enumValue"
    >
      <div slot="title" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
      </div>
    </cell>
    
    <div v-transfer-dom @touchmove.prevent>
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
    enumMap: {
      type: Array,
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
    enumValue() {
      let obj = this.toEnumMap.find(item => {
        return item.key === this.model[this.labelKey]
      })
      if (obj === undefined) {
        return ''
      } else {
        return obj.value
      }
    },
    toEnumMap() {
      return this.enumMap.map(i => {
        let obj = {}
        obj.key = i.val
        obj.value = i.name
        return obj
      })
    }
  },
  methods: {
    enum_cell_click({model, title, labelKey, enum_map} = obj) {
      if (this.readonly) {
        return
      }
      try {
        this.redioState.redioTitle = title
        this.redioState.showRedio = true
        this.redioState.labelKey = labelKey
        this.redioState.model = model
        this.redioState.enum = true
        this.redioState.options = enum_map
     } catch (error) {
        console.log(error)
      }  
    },
    async changeRadio(value,label) {
      this.redioState.showRedio = false
      this.$set(this.redioState.model, this.redioState.labelKey, value)
      this.redioState.currentOption = value
    },
    redioHide() {
      this.redioState.enum = false
    },
  }
}
</script>