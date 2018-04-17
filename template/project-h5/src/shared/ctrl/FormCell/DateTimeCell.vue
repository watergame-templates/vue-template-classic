<template>
  <cell 
    @click.native="datePick_cell_click({
        model:model, 
        labelKey:labelKey,
        format:format
      })"
    @on-change="change"
    :value="dateFormat(model[labelKey], format)">
    <div slot="title" style="width:100px">
      <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
    </div>
  </cell>
</template>

<script>
import dateMixin from './mixin/dateMixin'

export default {
  mixins: [dateMixin],
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm'
    }
  }
}
</script>