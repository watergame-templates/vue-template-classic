<template>
  <div>
    <x-input 
      @on-change="change"
      v-model.number="model[labelKey]"
      placeholder="请输入"
      type="number" 
      keyboard="number"
      >
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
  }
}
</script>