<template>
  <div>
    <x-input  
      @on-blur="setObj($event)"
      :disabled="readonly"
      placeholder="请输入"
      :value="str"
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
  },
  computed: {
    str() {
      return JSON.stringify(this.model[this.labelKey])
    }
  },
  methods: {
    setObj(e) {
      this.$set(this.model, this.labelKey, JSON.parse(e))
    }
  }
}
</script>