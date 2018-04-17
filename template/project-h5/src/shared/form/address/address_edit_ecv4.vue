<template>
    <div :class="metauiJsonClass" class='addressEdit'>
        <x-header :left-options="{backText: ''}" class="vux-1px-b">编辑收货人</x-header>
        <scroller class='addressList' lock-x :scrollbar-x='false'>
            <div class='box1'>
                <group label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <x-input title="收货人" placeholder="" v-model="receivername"></x-input>
                    <x-input title="联系方式" placeholder="" v-model="phone"></x-input>
                    <x-address @on-hide="logHide" @on-show="logShow" title="所在地区" v-model="value" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择地址" raw-value inline-desc="" :show.sync="showAddress" value-text-align="left"></x-address>
                    <x-input title="详细地址" placeholder="街道、楼牌号等" v-model="address"></x-input>
                </group>
            </div>
        </scroller>
        <div class='footer'>
            <div class='save' @click='saveHandle'>
                保存
            </div>
        </div>
        <toast v-model="showPositionValue" type="text" :time="800" is-show-mask text="请完善信息" :position="position"></toast>
    </div>
</template>

    <script>
import mixin_g from "./address_edit_ecv4.g.js";
import mixin_ex from "./address_edit_ecv4.exp.js";

export default {
  mixins: [mixin_g, mixin_ex]
};
</script>

    <style lang="less" scoped>
@import "./address_edit_ecv4.less";
</style>
    