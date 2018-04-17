<template>
  <div class="user_info">
    <x-header :left-options="{backText: ''}" class="header">个人资料</x-header>
    <div class="contain">
      <div label-width="4.5em" label-margin-right="2em" class="maingrup vux-1px-t">
        <div class="main-item vux-1px-b" v-for="(item, index) in userFormList" :key="index">
          <ImageCell v-if="item.meta_type === 'image'" :title="item.name" :model="mainDataBind" :labelKey="item.code" cropper/>
          <StringCell v-else-if="item.meta_type === 'string'" :title="item.name" :model="mainDataBind" :labelKey="item.code" />
          <DateCell v-else-if="item.meta_type === 'date'" :title="item.name" :model="mainDataBind" :labelKey="item.code" />

          <EnumRedioCell v-else-if="item.meta_type.startsWith('enum_')" :title="item.name" :model="mainDataBind" :labelKey="item.code"
            :enumMap="getEnumMapByMetaType(item.meta_type)" />
        </div>
      </div>
    </div>
    <div class="sub">
      <x-button type="primary" @click.native="save">保存修改</x-button>
    </div>
  </div>
</template>
<script>
  import {
    XHeader,
    XButton
  } from 'vux';
  import {
    ImageCell,
    StringCell,
    DateCell,
    EnumRedioCell
  } from 'ctrl/FormCell'
  import AV from 'leancloud-storage';
  import mixin_g from './user_info.g.js';
  export default {
    mixins: [mixin_g],
    data() {
      return {
        userFormList: [{
            name: '头像',
            meta_type: 'image',
            code: 'avatar'
          },
          {
            name: '昵称',
            meta_type: 'string',
            code: 'user_name'
          },
          {
            name: '性别',
            meta_type: 'enum_gender',
            code: 'sex'
          },
          {
            name: '生日',
            meta_type: 'date',
            code: 'birthday'
          },
        ],
        mainDataBind: {},
        enum_map: {
          'gender': [{
              code: "male",
              name: "男",
              val: 1
            },
            {
              code: "female",
              name: "女",
              val: 2
            }
          ]
        },
        entry: {}
      }
    },
    components: {
      XHeader,
      ImageCell,
      StringCell,
      DateCell,
      EnumRedioCell,
      XButton
    },
    async created() {
      await this.init()
    },
    methods: {
      async init () {
        let a =  (new AV.Query('BASE_Customer').equalTo('user', AV.User.current()))
        let q = await a.find()
        console.log(q);
        let user = q[0].toJSON()
        console.log('user', user);
        for (const iterator of this.userFormList) {
          this.$set(this.mainDataBind, iterator.code,  user[iterator.code])
        }
        this.entry = await new AV.Object.createWithoutData('BASE_Customer', q[0].id)
        console.log(this.entry);
        // this.$set(this.mainDataBind, '')
        for (const iterator of this.userFormList) {
          this.$watch(`mainDataBind.${iterator.code}`, function (val, oldVal) {
            if (val !== oldVal) {
              this.entry.set(iterator.code, val)
            }
          })
        }
      },
      getEnumMapByMetaType(metaType) {
        let name = this.unShiftUpper('enum_', metaType)
        for (let enumName in this.enum_map) {
          if (enumName.toLowerCase() === name.toLowerCase()) {
            return this.enum_map[enumName]
          }
        }
      },
      unShiftUpper(hardstr, str) {
        let reg = new RegExp(`^${hardstr}(.+)$`, 'i')
        let thisString = reg.exec(str)[1]
        if (thisString.startsWith('_')) {
          return thisString[0] + thisString[1].toUpperCase() + thisString.slice(2)
        } else {
          return thisString[0].toUpperCase() + thisString.slice(1)
        }
      },
      async save() {
        let res = await this.entry.save()
        await this.init()
        this.showMsg('保存成功')
        this.$router.go(-1)
        
      }
    },

  }

</script>
<style lang="less" scoped>
  @import './user_info.less';

</style>
