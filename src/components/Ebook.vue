<template>
    <div class="eBook">
        <!--顶栏-->
        <title-bar :titleAndMenuShow="titleAndMenuShow">
        </title-bar>
        <!--阅读器-->
        <div class="read-wrapper">
            <div id="read"><!-- 阅读器解析对象挂载点-->
            </div>
            <div class="mask">
                <div class="left" @click="prevPage"></div>
                <div class="center" @click="toggleTitleAndMenu"></div>
                <div class="right" @click="nextPage"></div>
            </div>
        </div>
        <!--底栏-->
        <menu-bar :titleAndMenuShow="titleAndMenuShow"
                  :fontSizeList="fontSizeList"
                  :defaultFontSize="defaultFontSize"
                  :themeList="themeList"
                  :defaultTheme="defaultTheme"
                  :bookAvailable="bookAvailable"
                  :navigation="navigation"
                  @setFontSize="setFontSize"
                  @setTheme="setTheme"
                  @onProgressChange="onProgressChange"
                  @jumpTo="jumpTo"
                  ref="menuBar">
            <!--@setFontSize="setFontSize  将父组件的方法传递到子组件，提供子组件调用-->
        </menu-bar>
    </div>
</template>

<script>
    import Epub from 'epubjs'
    import TitleBar from '../components/TitleBar'
    import MenuBar from '../components/MenuBar'

    const DOWNLOAD_URL = 'static/167176.epub';

    export default {
        name: "Ebook",

        data() {
            return {
                titleAndMenuShow: false,
                fontSizeList: [
                    {fontSize: 12},
                    {fontSize: 14},
                    {fontSize: 16},
                    {fontSize: 18},
                    {fontSize: 20},
                    {fontSize: 22},
                    {fontSize: 24}
                ],
                defaultFontSize: 16,
                themeList: [
                    {
                        name: '默认',
                        style: {
                            body: {
                                'color': '#000', 'background': '#fff'
                            }
                        }
                    },
                    {
                        name: '护眼',
                        style: {
                            body: {
                                'color': '#000', 'background': '#ceeaba'
                            }
                        }
                    },
                    {
                        name: '夜间',
                        style: {
                            body: {
                                'color': '#fff', 'background': '#000'
                            }
                        }
                    },
                    {
                        name: '金色',
                        style: {
                            body: {
                                'color': '#000', 'background': 'rgba(241,236,226)'
                            }
                        }
                    }
                ],
                defaultTheme: 0,//默认主题（主题数组下标）
                bookAvailable: false,  //电子书是否处于可用状态
                navigation: {}
            }
        },

        components: {
            TitleBar,
            MenuBar
        },

        mounted() {
            this.showEpub()
        },

        methods: {
            //电子书渲染
            showEpub() {
                //生成book对象
                this.book = new Epub(DOWNLOAD_URL);
                //生成rendition对象，通过Book.renderTo
                this.rendition = this.book.renderTo('read', {  //read为生成渲染电子数的dom对象
                    width: window.innerWidth,
                    height: window.innerHeight
                });
                //通过rendition.display渲染电子书
                this.rendition.display();
                this.themes = this.rendition.themes;//获取电子书主题
                //设置默认字体大小
                this.themes.fontSize(this.defaultFontSize);
                //注册主题
                this.registerTheme();
                //设置默认主题
                this.setTheme(this.defaultTheme);
                //获取locations对象(通过epubjs的钩子函数来实现)
                this.book.ready.then(() => {
                    //获取电子书目录
                    this.navigation = this.book.navigation;
                    return this.book.locations.generate();
                }).then(result => {
                    this.locations = this.book.locations;
                    this.bookAvailable = true;
                });
            },
            //上一页
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev();
                }

            },
            //下一页
            nextPage() {
                if (this.rendition) {
                    this.rendition.next();
                }
            },
            //
            toggleTitleAndMenu() {
                this.titleAndMenuShow = !this.titleAndMenuShow;
                if (!this.titleAndMenuShow) {
                    this.$refs.menuBar.hideSetting();
                }
            },
            //设置字体大小
            setFontSize(fontSize) {
                this.defaultFontSize = fontSize;
                if (this.themes) {
                    this.themes.fontSize(fontSize + 'px');
                }
            },
            //注册主题
            registerTheme() {
                this.themeList.forEach(theme => {
                    this.themes.register(theme.name, theme.style);
                })
            },
            //设置主题
            setTheme(index) {
                this.themes.select(this.themeList[index].name);
                this.defaultTheme = index;
            },
            //当进度条发生变化时
            onProgressChange(progress) {
                const percentage = progress / 100;
                const locations = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0;
                this.rendition.display(locations);
            },
            //根据目录跳转到指定章节
            jumpTo(href) {
                this.rendition.display(href);
                //隐藏顶栏和菜单栏
                this.hideTitleAndMenu();
            },
            hideTitleAndMenu() {
                //隐藏标题栏和菜单栏
                this.titleAndMenuShow = false;
                //隐藏设置栏
                this.$refs.menuBar.hideSetting();
                //隐藏目录栏
                this.$refs.menuBar.hideContent();
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/styles/global";

    .eBook {
        position: relative;
        .read-wrapper {
            .mask {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
                display: flex;
                width: 100%;
                height: 100%;
                .left {
                    flex: 0 0 px2rem(100);
                }
                .center {
                    flex: 1;
                }
                .right {
                    flex: 0 0 px2rem(100);
                }
            }
        }
    }
</style>
