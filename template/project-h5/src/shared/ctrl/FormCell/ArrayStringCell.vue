<template>
  <div>
    <x-input  
      v-for="(item, index) in itemLabelKey"
      :key="index"
      @on-change="change"
      :disabled="readonly"
      v-model="model[item]"
      placeholder="请输入"
      >
      <div slot="label" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}{{index + 1}}</label>
      </div>
    </x-input>
  </div>
</template>

<script>
import baseMixin from './mixin/baseMixin'
import { XInput } from 'vux'

export default {
  mixins: [baseMixin],
  components: {
    XInput
  },
  props: {
    metaType: {
      type: String,
      required: true
    }
  },
  methods: {
  },
  computed: {
    itemLabelKey() {
      let num = /^array_string_(\d+)$/.exec(this.metaType)[1]
      let keyArr = []
      for (let i = 1; i <= num; i++) {
        keyArr.push(this.labelKey + i)
      }
      return keyArr
    },
  }
}
</script>