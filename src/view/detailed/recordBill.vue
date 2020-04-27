<template>
    <div id="record-bill">
        <mt-header fixed title="粒粒记账">
            <mt-button slot="right" @click="$router.push({path:'/detailed'})">取消</mt-button>
        </mt-header>
        <div class="content">
            <mt-navbar class="page-part" v-model="selected">
                <mt-tab-item id="2">支出</mt-tab-item>
                <mt-tab-item id="1">收入</mt-tab-item>
            </mt-navbar>
  
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="2" class="bill-contain-item">
                    <div class="bill-contain-item-div flex-center" v-for="(val, i) in this.billType.expenditure" :key="i" @click="writeBill(val.detailedType, 2)">
                        <div class="fuck">
                            <i :class="val.className" aria-hidden="true" style="display:block; padding-left: 30%;"></i>
                            {{ val.name }}
                        </div>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id=1 class="bill-contain-item">
                    <div class="bill-contain-item-div flex-center" v-for="(val, i) in this.billType.income" :key="i" @click="writeBill(val.detailedType, 1)">
                        <div class="fuck">
                            <i :class="val.className" aria-hidden="true" style="display:block; padding-left: 30%;"></i>
                            {{ val.name }}
                        </div>
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <!-- <keyboard></keyboard> -->
    </div>
</template>

<script>
import Vue from 'vue'
import { Navbar, TabItem } from 'mint-ui';  //导航栏
import { TabContainer, TabContainerItem } from 'mint-ui';//Item
import { Cell } from 'mint-ui';
import { billType } from '../../config/billType';
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);

export default {
    data() {
        return {
            selected: '1',
            billType : billType
        }
    },
    methods: {
        writeBill(detailedType, budgetType) {
            this.$router.push({
                path: '/recordbillMsg',
                query: {
                    detailedType: detailedType,
                    budgetType: budgetType
                }
            })
        }
    },
    mounted () {
        // console.log(billType)
    }
}
</script>

<style scoped>

.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
.bill-contain-item {
    display:flex;
    align-content:stretch; 
    flex-wrap: wrap;
}
.bill-contain-item-div {
    width:63px;
    height:63px;
    border-radius: 31px;
    background:#F0F0F0;
    margin: 15px 15px;
    /* position: relative; */

}
.flex-center {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
}

.fuck {
    /* position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top:0;
    margin: auto;
    width: 100px;
    height: 100x; */

    /* margin: 20px;
    width: 40px;
    height: 40px; */
}
</style>
