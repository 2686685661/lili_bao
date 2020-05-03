<template>
    <div id="year-bill">
        <mt-header fixed title="账单">
            <i slot="left" class="fa fa-arrow-left" aria-hidden="true" @click="$router.go(-1)"></i> 
            <i slot="right" class="fa fa-search-minus" aria-hidden="true" @click="openPicker()">&nbsp;&nbsp;{{ this.year }}年</i>
        </mt-header>

        <div class="content">

            <div class="head">
                <div class="head-jieyu">
                    <div class="head-jieyu-font">结余</div>
                    <div class="head-jieyue-money head-jieyu-font">{{ (this.yearBill.YearIncome - this.yearBill.YearExpenditure).toFixed(2) }}</div>
                </div>
                <div class="head-budget">
                    <div class="head-budget-left">
                        <span>收入</span>
                        <span>{{ this.yearBill.YearIncome }}</span>
                    </div>
                    <span style="float:left;width: 1px;height: 20px; background: #000;"></span>
                    <div class="head-budget-right">
                        <span>支出</span>
                        <span>{{ this.yearBill.YearExpenditure }}</span>
                    </div>
                </div>
            </div>

            <div class="yearbill-context">
                <div class="yearbill-context-head yearbill-context-row">
                    <span>月份</span>
                    <span>收入</span>
                    <span>支出</span>
                    <span>结余</span>
                    <span>导出</span>
                </div>
                <div class="yearbill-context-row" v-for="(val, i) in this.yearBill.YearBillRange" :key="i">
                    <span>{{ val.month }}月</span>
                    <span>{{ val.MonthIncome }}</span>
                    <span>{{ val.MonthExpenditare }}</span>
                    <span>{{ val.Balance }}</span>
                    <span @click="download(val.MonthDate)"><i class="fa fa-download" aria-hidden="true"></i> </span>
                </div>
            </div>

        </div>

        <mt-datetime-picker
            type="date"
            ref="picker"
            year-format="{value} 年"
            :startDate="new Date(2020, 0, 1, 0, 0, 0)"
            @confirm="handleConfirm"
        >
        </mt-datetime-picker>
    </div>
</template>

<script>
import Vue from 'vue'
import config from '../../config/config.js'
import jwt from 'jsonwebtoken'
import { DatetimePicker, Toast } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
    data() {
        return {
            year:'',
            yearBill: {}
        }
    },
    methods: {
        download(month) {
            let token = this.getCookie('user_token')
            let  jwt = require('jsonwebtoken')
            let dedata =   jwt.decode(token)
            let url = config.axiosConfig.baseurl + "/uploadbill?userId=" + dedata.id + "&month=" + month
            window.location.href = url
        },
        openPicker() {
            this.$refs.picker.open();
            let a = document.getElementsByClassName('picker-slot')
            for(let i = 0; a && i < a.length; i++) {
                if (i == 1 || i == 2) {
                    a[i].style.display = "none"
                }
            }
        },
        handleConfirm(e) {
            this.year = e.getFullYear()
            this.getYearBill()
        },
        getYearBill() {
            if (this.year != "" || this.year != undefined || this.year != 'undefined') {
                this.fetch('/api/user/yearbill', {
                    year: this.year
                }).then((res) => {
                    if (res.error_code == 0) {
                        this.yearBill = res.data
                        if (res.data.YearBillRange.length != 0) {
                            this.formatYearBill()
                        }else {
                            Toast({
                                message: '暂无数据哦～',
                                position: 'middle',
                                duration: 3000
                            });
                        }

                    } else {
                        this.yearBill = {}
                        Toast({
                            message: res.msg,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
            }

        },
        formatYearBill() {
            this.yearBill.YearBillRange.forEach((val) => {
                val.month = val.MonthDate.toString().substring(4, 6)
                // val.MonthDate = val.MonthDate.toString().substring(4, 6)
                val.Balance = ((val.MonthIncome - val.MonthExpenditare) / 100).toFixed(2)
                val.MonthIncome = (val.MonthIncome / 100).toFixed(2)
                val.MonthExpenditare = (val.MonthExpenditare / 100).toFixed(2)
            })
        }
    },
    mounted () {
        this.year = (new Date()).getFullYear()
        this.getYearBill()

    }
}
</script>

<style scoped>
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
.head {
    background-color: #26a2ff;
    padding: 10px 0;
}
.head-jieyu-font {
    font-size: 13px;
    text-align: center;
    width: 100%;
    height: auto;
    padding: 5px 0;
}
.head-jieyue-money {
    font-size: 30px;
}
.head-budget {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 20px 0;
}
.yearbill-context-row {
    border:1px solid #ccc; border-width:0 0 1px 0;
    width: 100%;
    height: 50px;
    color: grey;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 15px;

}
.yearbill-context-head {
    height: 25px;
    font-size: 12px;
}
</style>
