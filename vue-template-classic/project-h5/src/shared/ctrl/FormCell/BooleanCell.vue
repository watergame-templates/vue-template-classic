<template>
  <cell>
    <div slot="title" style="width:100px">
      <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
    </div>
    <x-switch title=" " :disabled="readonly" v-model="model[labelKey]" @on-change="change">
      
    </x-switch>
  </cell>
</template>

<script>
import baseMixin from './mixin/baseMixin'
import { XSwitch } from 'vux'

export default {
  mixins: [baseMixin],
  components: {
    XSwitch
  },
  mounted() {
    if (this.model[this.labelKey] === undefined) {
      this.$set(this.model, this.labelKey, false)
    }
  }
}
</script>