<template>
  <div>
    <cell>
        <div slot="title" style="width:100px">
          <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
        </div>
      <x-input 
        title="纬度" 
        :disabled="readonly"
        :value="latitude" 
        @on-change="change"
        @on-blur="latitude_change({
            event :$event,
            labelKey: labelKey
          })" 
        type="number">
      </x-input>
      <x-input 
        title="经度" 
        :disabled="readonly"
        :value="longitude" 
        @on-blur="longitude_change({
            event: $event,
            labelKey: labelKey
          })" 
        type="number">
      </x-input>
    </cell>
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
    latitude() {
      if (this.model === undefined) {
        return ''
      }
      let obj = this.model[this.labelKey]
      if (obj !== null && typeof obj === 'object') {
        return this.model[this.labelKey]['latitude']
      } else {
        return ''
      }
    },
    longitude() {
      if (this.model === undefined) {
        return ''
      }
      let obj =this.model[this.labelKey]
      if (obj !== null && typeof obj === 'object') {
        return this.model[this.labelKey]['longitude']
      } else {
        return ''
      }
    }
  },
  methods: {
    // 纬度
    latitude_change({event, labelKey} = obj) {
      let model = this.model
      try {
        let latitude
        if (Number.isNaN(event)) {
          latitude = 0
        } else {
          latitude = Number(event)
        }
        if (model === undefined) {
          model = {}
        }
        console.log(model)
        if (model[labelKey] === undefined) {
          this.$set(model, labelKey, new this.AV.GeoPoint(latitude,0))
        } else {
          this.$set(model, labelKey, new this.AV.GeoPoint(latitude,model[labelKey]['longitude']))
        }
      } catch (error) {
        console.error(error)
        this.showErr('经纬设置失败')
      }
    },
    // 经度
    longitude_change({event, labelKey} = obj) {
      let model = this.model
      try {
        let longitude
        if (Number.isNaN(event)) {
          longitude = 0
        } else {
          longitude = Number(event)
        }
        if (model === undefined) {
          model = {}
        }
        if (model[labelKey] === undefined) {
          this.$set(model, labelKey, new this.AV.GeoPoint(0,longitude))
        } else {
          this.$set(model, labelKey, new this.AV.GeoPoint(model[labelKey]['latitude'],longitude))
        }
      } catch (error) {
        console.error(error)
        this.showErr('经纬设置失败')
      }
    },
  }
}
</script>