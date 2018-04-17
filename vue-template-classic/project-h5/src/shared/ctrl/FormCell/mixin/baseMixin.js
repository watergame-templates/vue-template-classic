import { Cell } from 'vux'
export default {
  components: {
    Cell
  },
  props: {
    model: {
      required: true,
      type: Object
    },
    labelKey: {
      required: true,
      type: String
    },
    title: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    nullable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    proTitle() {
      if (this.$props.title !== undefined && this.$props.title !== '') {
        return this.$props.title
      } else {
        return this.labelKey
      }
    },
    labelClass () {
      return {
        'vux-cell-justify': this.$parent.labelAlign === 'justify' || this.$parent.$parent.labelAlign === 'justify'
      }
    }
  },
  methods: {
    change(kay, val) {
      // this.$emit('change', key, val)
    }
  }
}