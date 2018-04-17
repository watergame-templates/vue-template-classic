import { dateFormat } from 'vux'
import baseMixin from './baseMixin'

export default {
  mixins: [baseMixin],
  methods: {
    dateFormat(val, format) {
      if (val) {
        return dateFormat(new Date(val), format)
      } else {
        return ''
      }
    },
    datePick_cell_click({model, format, value, labelKey} = obj) {
      if (this.readonly) {
        return
      }
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        minYear: 1900,
        format: format,
        value: value ? this.dateFormat(value, format) : this.dateFormat(model[labelKey], format),
        onConfirm: (val) => {
          if (/^\d\d:\d\d$/.test(val) ) {
            val = '2000-01-02 ' + val + ':00'
            val = val.replace(/\-/g, '/')
            this.$set(model, labelKey, new Date(val) - 1000 * 60 * 60 * 8)
          } else {
            val = val.replace(/\-/g, '/')
            this.$set(model, labelKey, new Date(val))
          }
          }
        })
    }
  }
}