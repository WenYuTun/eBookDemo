<template>
    <div class="menu-bar">
        <!--transition标签为包裹在其内部的div添加过渡动画-->
        <transition name="slide-up">
            <!--菜单栏（底栏）-->
            <div class="menu-wrapper"
                 v-show="titleAndMenuShow"
                 :class="{'hide-box-shadow':settingShow}">
                <div class="icon-wrapper" @click="toggleSetting(3)">
                    <span class="icon-menu icon"></span>
                </div>
                <div class="icon-wrapper" @click="toggleSetting(1)">
                    <span class="icon-bright icon"></span>
                </div>
                <div class="icon-wrapper" @click="toggleSetting(2)">
                    <span class="icon-Progress-read icon"></span>
                </div>
                <div class="icon-wrapper" @click="toggleSetting(0)">
                    <span class="icon-a icon">A</span>
                </div>
            </div>
        </transition>
        <!--设置模块-->
        <transition name="slide-up">
            <div class="setting-wrapper" v-show="settingShow">
                <!--字体大小设置模块-->
                <div class="setting-font-size" v-if="showTag === 0">
                    <div class="preview" :style="{fontSize:fontSizeList[0].fontSize+'px'}">A</div>
                    <div class="select">
                        <div class="select-wrapper"
                             v-for="(item,index) in fontSizeList"
                             :key="index"
                             @click="setFontSize(item.fontSize)">
                            <div class="line"></div>
                            <div class="point-wrapper">
                                <div class="point" v-show="defaultFontSize === item.fontSize">
                                    <div class="small-point"></div>
                                </div>
                            </div>
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="preview" :style="{fontSize:fontSizeList[fontSizeList.length-1].fontSize+'px'}">A
                    </div>
                </div>
                <!--主题设置模块-->
                <div class="setting-theme" v-else-if="showTag === 1">
                    <div class="setting-theme-item"
                         v-for="(item,index) in themeList"
                         :key="index"
                         @click="setTheme(index)">
                        <div class="preview" :style="{background:item.style.body.background}"
                             :class="{'no-border':item.style.body.background !=='#fff'}"></div>
                        <div class="text" :class="{'selected' : index === defaultTheme}">{{item.name}}</div>
                    </div>
                </div>
                <!--进度条设置-->
                <div class="setting-progress" v-else-if="showTag === 2">
                    <div class="progress-wrapper">
                        <input class="progress"
                               type="range"
                               max="100"
                               min="0"
                               step="1"
                               @change="onProgressChange($event.target.value)"
                               @input="onProgressInput($event.target.value)"
                               :value="progress"
                               :disabled="!bookAvailable"
                               ref="progress"/>
                        <div class="text-wrapper">
                            <span>{{bookAvailable ? progress+'%':'加载中...'}}</span>

                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <content-view :ifShowContent="ifShowContent"
                      v-show="ifShowContent"
                      :navigation="navigation"
                      :bookAvailable="bookAvailable"
                      @jumpTo="jumpTo">
        </content-view>
        <transition name="fade">
            <div class="content-mask"
                 v-show="ifShowContent"
                 @click="hideContent">
            </div>
        </transition>
    </div>
</template>

<script>
    import ContentView from '../components/Content'

    export default {
        name: "MenuBar",
        components: {
            ContentView
        },
        //接收父组件传过来的值
        props: {
            titleAndMenuShow: {
                type: Boolean,
                default: false
            },
            fontSizeList: {
                type: Array
            },
            defaultFontSize: {
                type: Number
            },
            themeList: {
                type: Array
            },
            defaultTheme: {
                type: Number
            },
            bookAvailable: {
                type: Boolean,
                default: false
            },
            navigation: Object
        },
        data() {
            return {
                settingShow: false,
                showTag: 0,
                progress: 0,
                ifShowContent: false
            }
        },
        methods: {
            toggleSetting(tag) {
                this.showTag = tag;
                if (tag == 3) {
                    this.settingShow = false;
                    this.ifShowContent = true;
                } else {
                    this.settingShow = true;
                }
            },
            //隐藏设置模块
            hideSetting() {
                this.settingShow = false;
            },
            setFontSize(fontSize) {
                this.$emit('setFontSize', fontSize); //调用父组件的setFontSize方法，并将fontSize参数传递到父组件
            },
            setTheme(index) {
                this.$emit('setTheme', index);
            },
            onProgressChange(progress) {
                this.$emit("onProgressChange", progress);
            },
            onProgressInput(progress) {
                this.progress = progress;
                this.$refs.progress.style.backgroundSize = this.progress + '% 100%';
            },
            hideContent() {
                this.ifShowContent = false;
            },
            jumpTo(href) {
                this.$emit('jumpTo', href);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/styles/global";

    .menu-bar {
        .menu-wrapper {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 101;
            display: flex;
            width: 100%;
            height: px2rem(48);
            background-color: white;
            box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
            &.hide-box-shadow { /*&标识其和包裹的class为同级*/
                box-shadow: none;
            }
            .icon-wrapper {
                flex: 1;
                @include center;
            }
        }
        .setting-wrapper {
            position: absolute;
            bottom: px2rem(48);
            height: px2rem(60);
            width: 100%;
            left: 0;
            z-index: 101;
            box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
            background-color: white;
            .setting-font-size {
                display: flex;
                height: 100%;
                .preview {
                    flex: 0 0 px2rem(40);
                    @include center;

                }
                .select {
                    display: flex;
                    flex: 1;
                    .select-wrapper {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        &:first-child {
                            .line {
                                &:first-child {
                                    border-top: none;
                                }
                            }
                        }
                        &:last-child {
                            .line {
                                &:last-child {
                                    border-top: none;
                                }
                            }
                        }
                        .line {
                            flex: 1;
                            height: 0;
                            border-top: px2rem(1) solid #ccc;
                        }
                        .point-wrapper {
                            position: relative;
                            flex: 0 0 0;
                            width: 0;
                            height: px2rem(7);
                            border-left: px2rem(1) solid #ccc;
                            .point {
                                position: absolute;
                                top: px2rem(-8);
                                left: px2rem(-10);
                                width: px2rem(20);
                                height: px2rem(20);
                                border-radius: 50%;
                                background-color: white;
                                border: px2rem(1) solid #ccc;
                                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
                                @include center;
                                .small-point {
                                    width: px2rem(5);
                                    height: px2rem(5);
                                    border-radius: 50%;
                                    background-color: black;

                                }
                            }
                        }
                    }
                }

            }
            .setting-theme {
                display: flex;
                height: 100%;
                .setting-theme-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: px2rem(5);
                    box-sizing: border-box;
                    .preview {
                        flex: 1;
                        border: px2rem(1) solid #ccc;
                        box-sizing: border-box;
                        &.n0-border {
                            border: none;
                        }
                    }
                    .text {
                        flex: 0 0 px2rem(20);
                        font-size: px2rem(14);
                        color: #ccc;
                        @include center;
                        &.selected {
                            color: #333;
                        }
                    }
                }
            }
            .setting-progress {
                position: relative;
                width: 100%;
                height: 100%;
                .progress-wrapper {
                    width: 100%;
                    height: 100%;
                    @include center;
                    padding: 0 px2rem(30);
                    box-sizing: border-box;
                    .progress {
                        width: 100%;
                        -webkit-appearance: none;
                        height: px2rem(2);
                        background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
                        background-size: 0 100%;
                        &:focus {
                            outline: none;
                        }
                        &::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            height: px2rem(20);
                            width: px2rem(20);
                            border-radius: 50%;
                            background: white;
                            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
                            border: px2rem(1) solid #ddd;
                        }
                    }
                    .text-wrapper {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        color: #333;
                        font-size: px2rem(12);
                        text-align: center;
                    }
                }
            }
        }
        .content-mask {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 101;
            display: flex;
            width: 100%;
            height: 100%;
            background: rgba(51, 51, 51, .8);
        }
    }

</style>
