import navbar from 'ctrl/navbar/navbar.ex.vue'
import AV from 'leancloud-storage'
import _ from 'lodash'
import { config } from 'core/context';
import { Scroller, Grid, GridItem } from 'vux'
export default {
  data() {
    return {
      categoryData: [],
      categoryInfoList: [],
      active: 0
    }
  },
  activated() {
    this.reversInfoList = this.active
  },
  methods: {
    goToList(categoryName) {
      this.$router.push({ name: 'goods_list_ecv4', query: { categoryName } })
    },
    select(index) {
      this.categoryInfoList = this.categoryData[index].children
      this.active = index;
    },
    async init(result) {
      let leanData = []
      this.categoryData = []
      await new AV.Query('BASE_Category').equalTo('prj', config.prj).equalTo('state', 2).limit(1000).find()
        .then(async result1 => {
          result1.forEach(v => {
            leanData.push(v.toJSON())
          })
        })
      leanData.filter(f => !f.parent).forEach(v => {
        this.categoryData.push({
          name: v.name,
          children: leanData.filter(s => v.name == s.parent_name)
        })
      })
      this.categoryInfoList = this.categoryData[this.active].children
    },
    uploadImg(url) {
      const file = AV.File.withURL('category_avatar.gif', url);
      return file.save()
    }
  },
  components: {
    'v-navbar': navbar,
    Scroller,
    Grid,
    GridItem
  }
}
