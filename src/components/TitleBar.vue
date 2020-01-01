<template>
    <!--transition标签为包裹在其内部的div添加过渡动画-->
    <transition name="slide-down">
        <!--顶栏-->
        <div class="title-wrapper" v-show="titleAndMenuShow">
            <div class="left">
                <span class="icon-back icon"></span>
            </div>
            <div class="right">
                <div class="icon-wrapper">
                    <span class="icon-cart icon"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon-person icon"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon-share icon"></span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "TitleBar",
        //接收父组件传过来的值
        props: {
            titleAndMenuShow: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/styles/global";

    .title-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: px2rem(48);
        background-color: white;
        box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
        .left {
            flex: 0 0 px2rem(60);
            @include center;
        }
        .right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            .icon-wrapper {
                flex: 0 0 px2rem(40);
                @include center;
            }
        }
    }
</style>
