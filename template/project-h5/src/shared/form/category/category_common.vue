<template>
	<div :class="metauiJsonClass" class='category category_common'>
		<div class='categoryContainer'>
			<div class="category-left">
				<scroller lock-x :scrollbar-x='false'>
					<ul class="category-list">
						<li class="category-item" :class="{active: active === index}" v-for="(item,index) in categoryData" @click="select(index)" :key='index'>{{item.name}}
						</li>
					</ul>
				</scroller>
			</div>
			<scroller class='category-right' lock-x :scrollbar-x='false'>
				<div class="box1">
					<grid :cols="3">
						<grid-item class="grid-item" v-for="(item, index) in categoryInfoList" :key="index" @on-item-click='goToList(item.name)'>
							<img :src="item.avatar.url" alt="" style="width: 60px; height: 60px;">
							<p class="item-name">{{' ' + item.name + ' '}}</p>
						</grid-item>
					</grid>
				</div>
			</scroller>
		</div>
		<div class='categoryNav'>
			<v-navbar></v-navbar>
		</div>
	</div>
</template>

<script>
import mixin_g from "./category_common.g.js";
import mixin_ex from "./category_common.exp.js";

export default {
  mixins: [mixin_g, mixin_ex]
};
</script>

<style lang="less" scoped>
@import "./category_common.less";
</style>
<style lang="less">
.category_common{
  .weui-grids:before{
    border: none;
  }
  .weui-grid:before{
    border: none;
  }
  .weui-grid:after{
    border: none;
  }
  .weui-grid__icon{
    width: .48rem;
    height: .48rem;
  }
  .weui-grid{
    padding: .07rem .05rem;
  }
  .weui-grid__label{
    font-size: .12rem;
    color: #666;
  }
  .weui-grids:after{
    border-left: none;
  }
}
</style>

    