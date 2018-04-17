<template>
	<div :class="metauiJsonClass" class='address'>
		<x-header :left-options="{backText: ''}" class="vux-1px-b header">地址管理</x-header>
		<scroller class='addressList' lock-x :scrollbar-x='false'>
			<div class='box1'>
				<div class='addressInfo' v-show='isShowAddressList' v-for='(item, index) in addressList' :key='index'>
					<panel :list="item.list" :type="type" @on-img-error="onImgError" @on-click-item='onItem(item.list, index)'></panel>
					<div class='addressHandle'>
						<div class='leftHandle'>
							<div class='setActivat' v-show='!item.Isdefault'  @click='selectTheDefault(index)'>
								<span>
									<img src="./img/noselect.svg" height="12px" alt="">
								</span>
								<span>
									设为默认
								</span>
							</div>
							<div class='defaultActivat' v-show='item.Isdefault'>
								<span>
									<img src="./img/select.svg" height="12px" alt="">
								</span>
								<span>
									默认地址
								</span>
							</div>
						</div>
						<div class='rightHandle'>
							<div @click='deleteSelectItem(index)'>
								<span class='iconfont icon-shanchu'></span>
								删除
							</div>
							<div @click='editSelectItem(index)'>
								<span class='iconfont icon-bianji'></span>
								编辑
							</div>
						</div>
					</div>
				</div>
			</div>
		</scroller>
		<div class='footer'>
			<div class='addAddress' @click='goAddAddress'>
				+&nbsp;&nbsp;&nbsp;新建地址
			</div>
		</div>
		<div v-transfer-dom>
			<confirm v-model="isShowConfirm" title="确定执行此操作?" @on-cancel="onCancel" @on-confirm="onConfirm" @on-show="onShow" @on-hide="onHide">
				<p style="text-align:center;">是否确认删除该地址</p>
			</confirm>
		</div>
	</div>
</template>

    <script>
import mixin_g from "./address_ecv4.g.js";
import mixin_ex from "./address_ecv4.exp.js";

export default {
  mixins: [mixin_g, mixin_ex]
};
</script>

    <style lang="less" scoped>
@import "./address_ecv4.less";
</style>
    