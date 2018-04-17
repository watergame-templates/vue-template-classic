<template>
  <div>
    <card class="card">
      <h4 slot="header" style="paddingLeft: 15px;">
          <span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}
      </h4>
      <flexbox slot="content" wrap="wrap" :gutter="0">
        <flexbox-item :span="1/4"  v-for="(imgItem, index) in itemLabelKey" @click.native="picture_cell_click(imgItem,index)" class="flexitem" :key="index">
          <div class="imgbox" :class="{'vux-1px': !cellImgUrlArr[index]}">
            <img class="img" :src="cellImgUrlArr[index]" v-if="cellImgUrlArr[index] !== ''">
            <span v-else><x-icon type="ios-plus-empty" size="40" class="icon-e"></x-icon></span>
          </div>
        </flexbox-item>
      </flexbox>
    </card>
    <!--图片预览-->
    <div v-transfer-dom @touchmove.prevent>
      <popup v-model="picState.showpicPick" position="bottom" height="50%" :hide-on-blur="false">
        <popup-header
        left-text="取消"
        right-text="确定"
        title="我的图片"
        :show-bottom-border="true"
        @on-click-left="picState.showpicPick = false"
        @on-click-right="updatePic"
        ></popup-header>
        <div class="imgpop">
          
          <div style="padding-top:30px"class="button-box">
            <div class="button-inner" style="position:relative"  v-if="!readonly">
              <x-button :mini="true" @click.native="nativeImgCheck">
                本地
                <input 
                  ref="imgInput"
                  class="imputImg"
                  type="file" 
                  :accept="accept"
                  @change="imgHandleChange" 
                  @click.stop>
              </x-button>
            </div>
            <div class="button-inner"  v-if="originFile !== undefined && !readonly" ><x-button :mini="true" @click.native="originChick">数据库</x-button></div>
            <div class="button-inner"  v-if="cropper && !readonly"><x-button :mini="true" @click.native="cropperChick">剪裁</x-button></div>
            <div class="button-inner"  v-if="!readonly"><x-button :mini="true" type="warn" @click.native="delClick">删除</x-button></div>
          </div>

          <div style="minHeight: 30vh">
            <img class="previewImg" :src="picState.proviewImgUrl" >
          </div>
        </div>
      </popup>
    </div>
    <!--图片剪裁-->
    <div v-transfer-dom @touchmove.prevent v-if="cropper">
      <popup v-model="cropperState.showCropper" position="bottom" height="60%" @on-hide="cropperHide"  @on-show="showCropperPopup">
        <popup-header
          left-text="取消"
          right-text="剪裁"
          title="图片剪裁"
          :show-bottom-border="true"
          @on-click-left="cropperState.showCropper = false"
          @on-click-right="doCropper"
        ></popup-header>
         <div class="copper-box">
          <vue-cropper
            v-if="cropperState.showCropper"
            ref="cropper"
            :img="picState.proviewImgUrl"
            :info="true"
            outputType="png"
            :autoCrop="true"
            :autoCropWidth="200"
            :autoCropHeight="200"
            :fixed="true"
            :fixedNumber="[1,1]"
          ></vue-cropper>
         </div>
      </popup>
    </div>
    <!--远程图片-->
    <div v-transfer-dom @touchmove.prevent v-if="originFile !== undefined">
      <popup v-model="originState.showpicPick" position="bottom" height="60%">
        <popup-header
          left-text="取消"
          title="数据库图片"
          :show-bottom-border="true"
          @on-click-left="originState.showpicPick = false"
        ></popup-header>
        <flexbox wrap="wrap" :gutter="0">
          <flexbox-item 
            :span="4"
            class="oriItem"
            v-for="item in originState.urlList" 
            style="padding-bottom:10px;padding-top:10px" 
            @click.native="oriClick(item)"
            :key="item.id">
            <img class="oriImg" :src="item.url" >
          </flexbox-item>
        </flexbox>
      </popup>
    </div>
  </div>
  
</template>

<script>
import { Popup, Radio, Group, PopupHeader, TransferDom, Flexbox, FlexboxItem,XButton,Card } from 'vux'
import baseMixin from './mixin/baseMixin'
import { firstUpperCase } from 'core/context'
import vueCropper from 'vue-cropper'

export default {
  mixins: [baseMixin],
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Radio,
    Group,
    PopupHeader,
    Flexbox,
    FlexboxItem,
    XButton,
    vueCropper,
    Card
  },
  props: {
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png'
    },
    originFile: {
      type: String
    },
    cropper: {
      type: Boolean,
      default: false
    },
    metaType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      picState: {
        proviewImgUrl: '',
        proviewImgName: '',
        showpicPick: false,
        labelKey: '',
        imgId: '',
        currentIndex: 0,
      },
      computedList: {},
      cropperState:{
        picURLkey: '',
        showpicPick: false,
        showCropper: false
      },
      originState:{
        showpicPick: false,
        urlList: []
      }
    }
  },
  computed: {
    itemLabelKey() {
      let num = /^array_image_(\d+)$/.exec(this.metaType)[1]
      let keyArr = []
      for (let i = 1; i <= num; i++) {
        keyArr.push(this.labelKey + i)
      }
      return keyArr
    },
    cellImgUrlArr() {
      return this.itemLabelKey.map(i => {
        let file = this.model[i]
       
        if (file instanceof this.AV.File) {
          if (file.attributes && (file.attributes.url !== '')) {
            return file.attributes.url
          } else {
            return this.computedList[i]
          }
        } else if (file instanceof this.AV.Object) {
          return file.attributes.url
        } else {
          return ''
        }
      })
    }
  },
  methods: {
    picture_cell_click(key,index) {
      this.picState.currentIndex = index
      this.picState.labelKey = key
      this.picState.proviewImgUrl = this.cellImgUrlArr[index]
      this.picState.showpicPick = true
    },
    async updatePic() {
      this.picState.showpicPick = false
      if (this.picState.proviewImgUrl === this.cellImgUrlArr[this.picState.currentIndex]) {
        return
      }
      let file
      if (/^data:image\/(gif|jpeg|jpg|png);base64,(.+)$/.test(this.picState.proviewImgUrl)){
        let matchArray = /^data:image\/(gif|jpeg|jpg|png);base64,(.+)$/.exec(this.picState.proviewImgUrl)
        let suffix = matchArray[1]
        let base64 = matchArray[2]
        this.$set(this.computedList, this.picState.labelKey, this.picState.proviewImgUrl)
        file = new this.AV.File(`resume.${suffix}`, { base64: base64})
      } else if (/([^\/]+.(gif|jpeg|jpg|png))$/.test(this.picState.proviewImgUrl)){
        let matchArray = /([^\/]+.(gif|jpeg|jpg|png))$/.exec(this.picState.proviewImgUrl)
        let name = matchArray[1]
        file = await new this.AV.Query('_File').get(this.picState.imgId)
      } else {
        file = null
      }
      console.log(file)
      this.$set(this.model, this.picState.labelKey, file)
    },
    delClick() {
      this.picState.proviewImgUrl = ''
    },
    nativeImgCheck() {
      this.$refs.imgInput.click()
    },
    imgHandleChange(e) {
      let files = e.target.files
      if (files.length) {
        let fr = new FileReader();
        fr.onload = (evt) => {
          console.log(evt)
          this.picState.proviewImgUrl = evt.target.result
        };
        fr.readAsDataURL(files[0])
      }
    },
    async initPictureList() {
      const query = new this.AV.Query('_File')
      return await query.startsWith('mime_type', 'image/')
        .descending('updatedAt')
        .limit(10)
        .find()
    },
    async originChick() {
      this.originState.showpicPick = true;
      let result = await this.initPictureList()
      let list = result.map(i => {
        let obj = {}
        obj.url = i.attributes.url
        obj.id = i.id
        return obj
      })
      this.originState.urlList = list
    },
    oriClick(item) {
      this.picState.proviewImgUrl = item.url
      this.picState.imgId = item.id
      this.originState.showpicPick = false
    },
    cropperChick() {
      this.cropperState.showCropper = true
    },
    cropperHide() {
      this.cropperState.showCropper = false;
      
    },
    doCropper() {
      this.cropperState.showCropper = false;
      this.$refs.cropper.getCropData((data) => {
        // do something
        this.picState.proviewImgUrl = data
      })
    },
    showCropperPopup() {
      this.$nextTick(() => {
        this.$refs.cropper && this.$refs.cropper.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import './styles/imagecell.less';
</style>