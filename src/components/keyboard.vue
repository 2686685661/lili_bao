
<template>
    <transition name="slide">
        <div class="keyboard animated" v-show="show" @touchstart.stop.prevent="fn">
            <!-- 完成 按钮-->
 
            <!-- 键盘区域 -->
            <div class="list">
                <div class="num">
                    <div :class="['key', {active:active[1]}]" @touchstart="typing('1')">1</div>
                    <div :class="['key', {active:active[2]}]" @touchstart="typing('2')">2</div>
                    <div :class="['key', {active:active[3]}]" @touchstart="typing('3')">3</div>
                    <div :class="['key', {active:active[4]}]" @touchstart="typing('4')">4</div>
                    <div :class="['key', {active:active[5]}]" @touchstart="typing('5')">5</div>
                    <div :class="['key', {active:active[6]}]" @touchstart="typing('6')">6</div>
                    <div :class="['key', {active:active[7]}]" @touchstart="typing('7')">7</div>
                    <div :class="['key', {active:active[8]}]" @touchstart="typing('8')">8</div>
                    <div :class="['key', {active:active[9]}]" @touchstart="typing('9')">9</div>
                    <div :class="['key' ,'dot',{active:active[12]}]" @touchstart="typing('.','12')">·</div>
                    <div :class="['key', {active:active[0]}]" @touchstart="typing('0')">0</div>
                    <div :class="['key', {active:active[10]}]" @touchstart="typing('00','10')">00</div>
                </div>
                <div class="tool">
                    <div :class="['key', 'del', 'iconfont', 'icon-jianpanshanchu',{active:active[11]}]"  @touchstart="typing('del',11)"></div>
                    <div class="key confirm" @touchstart="complete">确定</div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>    
    export default {
        props: {
            show: {
                type: Boolean,
                default: true,
            },
            
        },
        data(){
            return{
                active:[0,0,0,0,0,0,0,0,0,0,0,0,0],
            }
        },
        methods: {
            /*防止点击完成按钮左边的空白区域收起键盘*/
            fn() { },
            /*输入*/
            typing(val,site) {
                var site=site&&site!=='del'&&site!=="."?site:val;
                this.active[site]=1
                this.$set(this.active,site,1)
                setTimeout(()=>{
                    this.$set(this.active,site,0)
                },60)
 
                this.$emit('typing', val);
 
            },
            /*点击完成*/
            complete() {
                this.$emit('complete');
            }
        }
    }
</script>


<style scoped lang="less">
    .keyboard {
        /* height: 250px; */
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background: white;
        z-index: 999;
        .list {
            /* height: 200px; */
            display: flex;
            .key {
                font-size: 34px;
                box-sizing: border-box;
                height: 120px;
                width: 33.33%;
                float: left;
                border-right: 1px solid #d6d6d6;
                border-top: 1px solid #d6d6d6;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &.confirm {
                    height: 360px;
                    background:  #ED5665;
                    color: white;
                    font-size: 34px;
                }
                &.del {
                    font-weight: 100;
                    font-size: 64px;
                }
                &.active{
                    background-color: #F6F6F6;
                }
            }
            .num {
                width: 75%;
                .key:nth-child(-n+3) {
                    border-top: none;
                }
            }
            .tool {
                width: 25%;
                .key {
                    width: 100%;
                    border-right: none;
                    border-top: none;
                
                }
 
            }
 
        }
    }
 
 
 
    .animated {
        animation-duration: .2s;
        animation-fill-mode: both;
    }
 
    @keyframes tabDown {
        from {
            background-color: #ffffff;
        }
        to {
            background-color: #F6F6F6;
        }
    }
 
    @keyframes tabUp {
        from {
            transform: translate3d(0, 100%, 0);
            visibility: visible;
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
 
    .slide-enter-active {
        animation-name: slideInUp;
    }
 
    .slide-leave-active {
        animation-name: slideInDown;
    }
</style>