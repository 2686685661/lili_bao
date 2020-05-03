<template>
    <div id="detailed">
        <mt-header fixed title="粒粒记账"></mt-header>
        <div class="content">
            <div class="head">
                <div class="detailed-head">
                    <div class="detailed-head-left" @click="openPicker()">
                        <div>{{ this.year }}年</div>
                        <div>
                            {{ this.month }}月
                            <i class="fa fa-share-square-o" aria-hidden="true"></i>
                        </div>
                    </div>
                    <span style="float:left;width: 1px;height: 25px; background: #000;"></span>
                    <div class="detailed-head-right">
                        <div class="detailed-head-right-income">
                            <span style="font-size:15px;display:block;">收入</span>
                            <span style="font-size:19px;">{{ this.detailData.MonthIncome }}</span>
                        </div>
                        <div class="detailed-head-right-expenditare">
                            <span style="font-size:15px;display:block;">支出</span>
                            <span style="font-size:19px;">{{ this.detailData.MonthExpenditare }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detailed-record">

                <div style="width:100%" v-for="(val, i) in this.detailData.MonthDetailed" :key="i">
                    <div class="detailed-record-date">
                        <div>{{ val.DayNumber }}</div>
                        <div>收入：{{ val.DayIncome }}&nbsp;&nbsp;支出：{{ val.DayExpenditure }}</div>
                    </div>
                    <mt-cell :title="val2.DetailedType" v-for="(val2, i2) in val.SigleDetailedArr" :key="i2" @click.native="setordelDetailed(val2)">
                        <span v-if="val2.BudgetType == 1">{{ val2.DetailedMoney }}</span>
                        <span v-else>-{{ val2.DetailedMoney }}</span>
                        <i slot="icon" :class="val2.className" aria-hidden="true"></i> 
                    </mt-cell>
                </div>
            </div>
        </div>

        <mt-datetime-picker
            v-model="mytime"
            type="date"
            ref="picker"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            :startDate="new Date(2020, 0, 1, 0, 0, 0)"
            @confirm="handleConfirm"
        >
        </mt-datetime-picker>

        <div style="height: 90px;text-align: center;color:gray;margin-top:10px;">
            <span>已经到底啦～～</span>
        </div>
        <nav-bottom-detailed class="nav-bottom"></nav-bottom-detailed>
    </div>
</template>

<script>
import Vue from 'vue'
import { billType } from '../../config/billType';
import { DatetimePicker, Toast } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
    data() {
        return {
            mytime: new Date(),
            month:"",
            detailData:{},
            year: "",
            month:"",
            billType: billType
        }
    },
    methods: {
        setordelDetailed(sigle) {
            this.$store.commit("changeDetailedStatus", {name:'selectionSigle',val:sigle})
            this.$router.push({path: '/sigledetailed'})
        }, 
        openPicker() {
            this.$refs.picker.open();
            let a = document.getElementsByClassName('picker-slot')
            for(let i = 0; a && i < a.length; i++) {
                if (i == 2) {
                    a[i].style.display = "none"
                }
            }
        },
        handleConfirm(e) {
            this.year = e.getFullYear()
            this.month = this.doHandleMonth(e)
            let choiceMonth = this.year + this.month + ""
            this.getUserMonthDetailed(choiceMonth)
        },
        getUserMonthDetailed(month) {
            this.fetch('/api/detailed/getmonthdetailed', {
                month: month
            }).then((res) => {
                if (res.error_code == 0) {
                    this.detailData = res.data
                    this.formatUserMonthDetailed()
                } else {
                    this.detailData = {}
                    Toast({
                        message: '暂无数据哦～',
                        position: 'middle',
                        duration: 3000
                    });
                }
            })
        },
        formatUserMonthDetailed() {
            if (this.detailData.MonthDetailed == null || this.detailData.MonthDetailed ==undefined) {
                return
            }
            let _this = this
            this.detailData.MonthDetailed.sort((x, y) => {
                return x.DayNumber - y.DayNumber
            })
            this.detailData.MonthDetailed.forEach((val) => {
                val.DayNumber = _this.dayStrReachTime(val.DayNumber+'')
                val.SigleDetailedArr.forEach((val2) => {
                    val2.DetailedMoney = val2.DetailedMoney / 100
                    if (val2.BudgetType == 1) {
                        this.billType.income.forEach((v) => {
                            if (v.detailedType == val2.DetailedType) {
                                val2.DetailedType = v.name
                                val2.className = v.className
                            }
                        })
                    } else if (val2.BudgetType == 2) {
                        this.billType.expenditure.forEach((v) => {
                            if (v.detailedType == val2.DetailedType) {
                                val2.DetailedType = v.name
                                val2.className = v.className
                            }
                        })
                    }
                })
            })


        }

    },
    mounted () {
        let time  = new Date()
        this.year = time.getFullYear()
        this.month = this.doHandleMonth(time)
        let monthData = this.year + "" + this.month
        this.getUserMonthDetailed(monthData)
    }
}
</script>

<style scoped>
.nav-bottom {
    
    position: fixed;
}
#detailed {
    line-height: 1.35;
}
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
.head {
    background-color: #26a2ff;
    padding: 10px 0;
}
.detailed-head {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.detailed-head-left {
    width: 25%;
    height: 100%;
    text-align: center;
}
.detailed-head-right {
    width: 75%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

}
.detailed-head-right-income, .detailed-head-right-expenditare {
    width: 50px;
    height: 100%;
}
.detailed-record-date {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: azure;
    color: grey;
    border:1px solid #ccc; border-width:0 0 1px 0;
}
.detailed-record-date div {
    margin: 0 10px;
}
</style>
