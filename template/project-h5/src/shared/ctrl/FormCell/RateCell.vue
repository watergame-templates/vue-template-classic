<template>
  <div>


    <cell>
    <div slot="title" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
      </div>
        <rater :value="model[labelKey] / 20" @input="input" :disabled="readonly" active-color="red" :font-size="15" ></rater>
    </cell>
  </div>  
</template>

<script>
import baseMixin from './mixin/baseMixin'
import { Rater, XInput, Range } from 'vux'

export default {
  mixins: [baseMixin],
  components: {
    Rater,
    XInput,
    Range
  },
  computed: {
    currentValue() {
      return this.model[this.labelKey] / 20
    }
  },
  methods: {
    input(val) {
      if (val * 20 === this.model[this.labelKey]) {
        return
      }
      this.$set(this.model, this.labelKey, parseInt(val *20))
    }
  }
}
</script>