<template>
    <div id=recordbill-msg>
        <mt-header fixed :title="this.detailedName">
            <mt-button slot="left" @click="$router.push({path:'/recordbill'})">取消</mt-button>
            <mt-button slot="right" @click.native="bookkeep()">完成</mt-button>
        </mt-header>

        <div class="content">
            <mt-cell title="类型" :value="this.budgetType==1 ? '收入' : '支出'"></mt-cell>
            <mt-field label="金额" placeholder="记录你的收支金额吧～" type="number" v-model="number"></mt-field>
              <mt-cell :title="'记账日期'+' : '+ this.dayStr">
                  <mt-button type="primary" size="small" @click="openPicker()">填写日期</mt-button>
              </mt-cell>
            <mt-field label="备注" placeholder="写点备注吧" type="textarea" rows="2" v-model="remarks"></mt-field>
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
    </div>
</template>

<script>
import Vue from 'vue'
import { DatetimePicker, Toast } from 'mint-ui';
import { billType } from '../../config/billType';
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
    data() {
        return {
            mytime: new Date(),
            number: null,
            birthday:'',
            introduction:'',
            dayStr:'',
            date:'',
            detailedName:'',
            remarks:'',
            detailedType: null,
            budgetType: null
        }
    },
    methods: {
        openPicker() {
            this.$refs.picker.open();
        },
        handleConfirm(e) {
            let year = e.getFullYear()
            let month = this.doHandleMonth(e)
            let days = this.daHandleDays(e)
            this.dayStr = year + '/' + month + '/' + days
            this.date = year + month + days
        },
        bookkeep() {
            this.number = this.keepTwoDecimalFull(this.number)
            if (this.number == false) {
                Toast({
                    message: '请填写金额哦～',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            if (this.budgetType == null || 
                this.budgetType == "" || 
                this.budgetType == undefined || 
                parseInt(this.budgetType) < 1 || 
                parseInt(this.budgetType) > 2
            ) {
                Toast({
                    message: '请选择支出类型哦～',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }

            if (this.detailedType == null || 
                this.detailedType == "" || 
                this.detailedType == undefined || 
                (parseInt(this.budgetType) == 1 && (parseInt(this.detailedType) < 1 || parseInt(this.detailedType) > billType.income.length)) || 
                (parseInt(this.budgetType) == 2 && (parseInt(this.detailedType) < 1 || parseInt(this.detailedType) > billType.expenditure.length))
            ) {
                Toast({
                    message: '请选择明细类型哦～',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }

            if (this.date == '') {
                Toast({
                    message: '请选择记账日期哦～',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }

                this.post('/api/detailed/bookkeep', {
                    date: this.date,
                    budgetType: this.budgetType,
                    detailedType: this.detailedType,
                    remarks: this.remarks,
                    detailedMoney: this.number
                }).then((res) => {
                    if (res.error_code == 0) {
                        this.$router.push({
                            path: "/detailed"
                        })
                        Toast({
                            message: '记录成功～',
                            position: 'middle',
                            duration: 3000
                        });
                    } else {
                        Toast({
                            message: '哎呀！系统开小差啦～',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })

        }
    },
    mounted () {
        this.detailedType = parseInt(this.$route.query.detailedType)
        this.budgetType = parseInt(this.$route.query.budgetType)
        if (this.detailedType == null || this.budgetType == null) {
            this.$router.push({path:'/recordbill'})
        }
        if (this.budgetType == 1) {
            billType.income.forEach((val, key) => {
                if (parseInt(val.detailedType) == this.detailedType) {
                    this.detailedName = val.name
                    this.remarks = val.name
                }
            })
        } else if(this.budgetType == 2) {
            billType.expenditure.forEach((val, key) => {
                if (parseInt(val.detailedType) == this.detailedType) {
                    this.detailedName = val.name
                    this.remarks = val.name
                }
            })
        }
    }
}
</script>

<style scoped>
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
</style>
