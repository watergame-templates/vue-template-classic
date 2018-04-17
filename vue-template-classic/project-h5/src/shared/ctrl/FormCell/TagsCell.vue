<template>
    <div>
        <cell 
          @click.native="tagscellClick"
          >
        <div slot="title" style="width:100px">
          <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
        </div>
        
        <span v-for="(item, index) in model[labelKey]" class="static-tags" :key="index">
          {{item}}
        </span>
      </cell>
        
      <div v-transfer-dom @touchmove.prevent>
          <popup 
            v-model="tagsState.showTags"
            position="bottom"
            height="50%"
            @on-show="tagsShow">
            <popup-header
              left-text="取消"
              right-text="确定"
              title="标签选择"
              :show-bottom-border="true"
              @on-click-left="tagsState.showTags = false"
              @on-click-right="tagsSave"
            ></popup-header>
            <!-- <group>
              <radio 
                title="title" 
                :options="redioState.options" 
                v-model="redioState.currentOption"
                @on-change="changeRadio">
                <template slot-scope="props" slot="each-item">
                  <p>
                    {{ props.label }}
                  </p>
                </template>
              </radio>
            </group> -->
            <div class="scroll-box">
              <scroll ref="scroll">
                  <checker
                    class="checker"
                    v-model="tagsState.currentList"
                    type="checkbox"
                    default-item-class="checker-item"
                    selected-item-class="checker-item-selected">
                    <checker-item :value="item" v-for="(item, index) in tagsUniverse" :key="index">
                      {{item}}
                      <span @click.stop="delItem(item)">
                          <x-icon type="ios-close-empty" size="30" class="close"></x-icon>
                      </span>
                    </checker-item>
                  </checker>
              </scroll>
            </div>
            <div class="addTags">
                <input class="input" v-model="tempString"></input>
                <x-button mini type="primary" style="marginLeft: 20px" @click.native="addTags">
                    增加
                </x-button>
            </div>
          </popup>
        </div>
    </div>  
  </template>
  
  <script>
  import baseMixin from './mixin/baseMixin'
  import { XInput, Checker, CheckerItem, PopupHeader, TransferDom, Popup, Group, XButton } from 'vux'
  import Scroll from 'ctrl/Scroll'
  import _ from 'lodash';
  
  export default {
    mixins: [baseMixin],
    directives: {
      TransferDom
    },
    props: {
      currentClass:{
        type: String,
        required: true
      }
    },
    data() {
      return {
        tagsState: {
          showTags: false,
          tagsTitle: '',
          currentList: [],
          allTags: [],
          model: null,
        },
        tagsUniverseId: '',
        tagsUniverse: [],
        tempString: ''
      }
    },
    computed: {
      tagsUniverseEntry() {
        return new this.AV.Object.createWithoutData(this.currentClass)
      }
    },
    components: {
      XInput,
      Checker,
      CheckerItem,
      PopupHeader,
      Popup,
      Group,
      XButton,
      Scroll
    },
    mounted() {
      console.log(this.model[this.labelKey])
      // this.tagscellClick()
    },
    watch: {
      tagsUniverse() {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    methods: {
      async tagsShow() {
        this.tagsState.currentList = _.union(this.tagsState.currentList, this.model[this.labelKey])
        try {
          let results = await new this.AV.Query(this.currentClass).equalTo('code', 'it_is_just_for_tags_dose_not_have_other_date').find()
          console.log('results', results.length);
          if (results.length === 0) {
            console.log(132123);
            this.tagsUniverse = createTagsUniverse()
          } else if (results.length === 1) {
            this.tagsUniverseId = result[0].id
            this.tagsUniverse = _.get(results, `0.attributes.${this.labelKey}`, [])
          } else {
            this.tagsUniverseId = result[0].id
            this.tagsUniverse = results.reduce(function (oldval, newval) {
              let arr = _.get(newval, `attributes.${this.labelKey}`, [])
              return _.union(oldval, arr)
            }, [])
            console.log(this.tagsUniverse);
          }
          console.log(this.labelKey);
        } catch (err) {
          if (err.code === 101) {
            // this.tagsUniverse = createTagsUniverse()
          }
        }
        this.tagsUniverse = _.union(this.tagsUniverse, this.model[this.labelKey])
      },
      tagsSave() {
        this.tagsState.showTags = false
        
        this.$set(this.model, this.labelKey, this.tagsState.currentList)
        // 保存全集
        try{
          let entry = new this.AV.Object.createWithoutData(this.currentClass, this.tagsUniverseId)
          entry.set(this.labelKey, this.tagsUniverse)
        } catch(err) {
          this.showErr(err)
        }
      },
      async tagscellClick() {
        this.tagsState.showTags = true
        // let tagsUniverse
        // 获取此表的code为 it_is_just_for_tags_dose_not_have_other_date
        
      },
      // 创建tags全集项
      async createTagsUniverse() {
        clg(1232131)
        let metaTable = new this.AV.Object.extend(this.currentClass)
            metaTable.set('code', 'it_is_just_for_tags_dose_not_have_other_date')
            metaTable.set(this.labelKey, [])
        let result = await metaTable.save();
            this.tagsUniverseId = result.id
            return []
      },
      delItem(e) {
        console.log(e);
      },
      addTags() {
        let string = _.trim(this.tempString)
        if (!this.tagsUniverse.includes(string) && string !== '') {
          this.tagsUniverse.push(string)
          this.tagsState.currentList.push(string)
        }
        this.tempString = ''
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
    .item{
      border: 1px solid #fff;
      box-sizing: border-box;
      margin: 5px;
    }
    .item-selected{
      border: 1px solid #39A46A;
  
    }
    .checker{
      box-sizing: border-box;
    }
    .checker-item{
      position: relative;
      border: 1px solid #fff;
      box-sizing: border-box;
      margin: 5px;
      width: 80vw;
    }
    .checker-item-selected{
      border: 1px solid #39A46A;
    }
    .addTags{
      background-color: #ECECEC;
      height: 50px;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      .input{
        width: 50vw;
        box-sizing: border-box;
        height: 50px;
        padding: 5px;
        margin-left: 15px;
      }
    }
    .close{
      position: absolute;
      right: -30px;
      top: 0;
    }
    .scroll-box{
      height:60vw;
      width:100%;
      position:relative;
    }
    .static-tags{
      border: 1px solid #39A46A;
      padding: 3px
    }
  </style>
  