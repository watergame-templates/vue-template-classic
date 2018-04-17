<template>
  <div>
    <x-input 
      :disabled="readonly"
      v-model.number="model[labelKey]"
      @on-change="change"
      placeholder="请输入"
      type="number" 
      keyboard="number"
      @on-blur="blur($event)">
      <div slot="label" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
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
  methods: {
    blur(event) {
      if (event === '') {
        return 0
      }
      if (Number(event) !== parseInt(event)) {
        this.showErr('请输入整数')
        this.$set(this.model, this.labelKey, parseInt(event))
      } else {
      }
    }
  }
}
</script>