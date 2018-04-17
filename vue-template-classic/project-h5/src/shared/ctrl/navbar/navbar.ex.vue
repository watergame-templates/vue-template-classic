<template>
    <div class="tabbar">
        <tabbar @on-index-change="onIndexChange">
            <tabbar-item :selected="selectNav == 0" @on-item-click="tabNav('home_ecv4')">
                <img slot="icon" src="./icon-home@2x.png">
                <img slot="icon-active" src="./icon-click-home@2x.png">
                <span slot="label">首页</span>
            </tabbar-item>
            <tabbar-item :selected="selectNav == 1" @on-item-click="tabNav('category_common')">
                <img slot="icon" src="./icon-classify@2x.png">
                <img slot="icon-active" src="./icon-click-classify@2x.png">
                <span slot="label">分类</span>
            </tabbar-item>
            <tabbar-item :selected="selectNav == 2" @on-item-click="tabNav('mine_ecv4')">
                <img slot="icon" src="./icon-my@2x.png">
                <img slot="icon-active" src="./icon-click-my@2x.png">
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux';
export default {
    components: {
        Tabbar,
        TabbarItem
    },
    data() {
        return {
            selectNav: 0
        }
    },
    activated() {
        this.tabNav(this.$route.name)
    },
    methods: {
        onIndexChange(newIndex, oldIndex) {
        },
        tabNav(type) {
            switch (type) {
                case 'home_ecv4':
                    this.selectNav = 0;
                    this.$router.push({ name: 'home_ecv4' });
                    break;
                case 'category_common':
                    this.selectNav = 1;
                    this.$router.push({ name: 'category_common' });
                    break;
                case 'mine_ecv4':
                    this.selectNav = 2;
                    this.$router.push({ name: 'mine_ecv4' });
                    break;
                default:
                    break;
            }
        }
    }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
    .weui-tabbar
        position fixed !important
        .weui-bar__item_on
            .weui-tabbar__label
                color #e22833 !important
        .weui-tabbar__icon
            width .19rem !important
            height .19rem !important
</style>
