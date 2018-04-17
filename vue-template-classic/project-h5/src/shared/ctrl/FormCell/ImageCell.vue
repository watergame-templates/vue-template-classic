<template>
  <div>
    <cell 
      is-link
      >
      <div slot="title" style="width:100px">
        <label class="weui-label" :class="labelClass"><span style="color:red;position: absolute;left: 5px;" v-if="!nullable">* </span>{{proTitle}}</label>
      </div>
      <div class="imgbox" :class="{'vux-1px': !cellImgUrl}" @click="picture_cell_click(labelKey)">
        <img class="img" :src="cellImgUrl" v-if="cellImgUrl !== ''">
        <span v-else><x-icon type="ios-plus-empty" size="40" class="icon-e"></x-icon></span>
      </div>
    </cell>
    <!--图片预览-->
    <div v-transfer-dom @touchmove.prevent>
      <popup v-model="picState.showpicPick" position="bottom" :hide-on-blur="false" height="50%">
        <popup-header
        left-text="取消"
        right-text="确定"
        title="我的图片"
        :show-bottom-border="true"
        @on-click-left="picState.showpicPick = false"
        @on-click-right="updatePic"
        ></popup-header>
        <!-- <flexbox :gutter="0">
          <flexbox-item :span="8">
            <img class="previewImg" :src="picState.proviewImgUrl" >
          </flexbox-item>
          <flexbox-item :span="4" style="padding-top:30px">
            <x-button :mini="true" style="position:relative" @click.native="nativeImgCheck" v-if="!readonly">
              本地
              <input 
                ref="imgInput"
                class="imputImg"
                type="file" 
                :accept="accept"
                @change="imgHandleChange" 
                @click.stop>
            </x-button>
            <x-button :mini="true" v-if="originFile !== undefined && !readonly" @click.native="originChick">数据库</x-button>
            <x-button :mini="true" @click.native="cropperChick" v-if="cropper && !readonly">剪裁</x-button>
            <x-button :mini="true" type="warn" @click.native="delClick" v-if="!readonly">删除</x-button>
          </flexbox-item>
        </flexbox> -->
        <div class="imgpop">
          
          <div style="padding-top:30px" class="button-box">
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

          <div style="minHeight: 30vh;display: flex;">
            <img class="previewImg" :src="picState.proviewImgUrl" style="margin: auto;" >
          </div>
        </div>
      </popup>
    </div>
    <!--图片剪裁-->
    <div v-transfer-dom v-if="cropper" @touchmove.prevent>
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
    <div v-transfer-dom v-if="originFile !== undefined" @touchmove.prevent>
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
import { Popup, Radio, Group, PopupHeader, TransferDom, Flexbox, FlexboxItem,XButton } from 'vux'
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
    vueCropper
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
    }
  },
  data() {
    return {
      picState: {
        proviewImgUrl: '',
        proviewImgName: '',
        showpicPick: false,
        labelKey: '',
        imgId: ''
      },
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
    cellImgUrl() {
      let file = this.model[this.labelKey]
      if (file instanceof this.AV.File) {
        if (file.attributes && (file.attributes.url !== '')) {
          return file.attributes.url
        } else {
          return this.picState.proviewImgUrl
        }
      } else if (file instanceof this.AV.Object) {
        return file.attributes.url
      } else if (file instanceof Object && file.url) {
        return file.url
      } else {
        return ''        
      }
    }
  },
  methods: {
    picture_cell_click(key) {
      this.picState.labelKey = key
      this.picState.proviewImgUrl = this.cellImgUrl
      this.picState.showpicPick = true
    },
    delClick() {
      this.picState.proviewImgUrl = ''
    },
    async updatePic() {
      this.picState.showpicPick = false
      if (this.picState.proviewImgUrl === this.cellImgUrl) {
        return
      }
      let file
      if (/^data:image\/(gif|jpeg|jpg|png);base64,(.+)$/.test(this.picState.proviewImgUrl)){
        let matchArray = /^data:image\/(gif|jpeg|jpg|png);base64,(.+)$/.exec(this.picState.proviewImgUrl)
        let suffix = matchArray[1]
        let base64 = matchArray[2]
        file = new this.AV.File(`resume.${suffix}`, { base64: base64})
      } else if (/([^\/]+.(gif|jpeg|jpg|png))$/.test(this.picState.proviewImgUrl)){
        let matchArray = /([^\/]+.(gif|jpeg|jpg|png))$/.exec(this.picState.proviewImgUrl)
        let name = matchArray[1]
        file = await new this.AV.Query('_File').get(this.picState.imgId)
      } else {
        file = null
      }
      console.log(file instanceof this.AV.Object)
      this.$set(this.model, this.picState.labelKey, file)
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
      console.log(item)
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
  .imputImg {
    opacity: 0;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    background-image: none;
  }
  .previewImg{
    max-height: 30vh;
    max-width: 100%;
  }
  .copper-box{
    width: 100%;
    height: 45vh;
  }
  .imgbox{
    width: 40px;
    height: 40px;
    display: inline-block;
    box-sizing: border-box;
    flex: 0 0 auto;
    margin-bottom: .1rem;
    margin-right: .08rem;
    display: flex;
    .img{
      margin: auto;
      max-width:100%;
      max-height: 100%;
    }
    .icon-e{
      fill: #c7c7c7;
    }
  }
.oriItem{
  height: 15vh;
  .oriImg{
    max-width:100%;
    max-height: 100%;
  }
}
.card{
  &:before{
    border-top: none;
  }
  &:after{
    border-bottom: none;
  }
}
.imgpop{
  display: flex;
  flex-direction: column-reverse;
}
.button-box{
  display: flex;
  flex: 0 0 auto;
  justify-content: space-around
}
</style>