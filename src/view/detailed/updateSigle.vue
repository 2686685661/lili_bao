<template>
    <div id="updatesigle">
        <mt-header fixed :title="this.detailedName">
            <mt-button slot="left" @click="$router.go(-1)">取消</mt-button>
            <mt-button slot="right" @click="judgeSigleData()">修改</mt-button>
        </mt-header>

        <div class="content">
            <mt-cell title="收支类型" is-link @click.native="budgetPopupVisible = true">{{this.budgetType == 1 ? "收入" : "支出"}}</mt-cell>
            <mt-cell title="明细类型" is-link @click.native="detailedPopupVisible = true">{{ this.detailedName }}</mt-cell>
            <mt-field label="金额" placeholder="记录你的收支金额吧～" type="number" v-model="money"></mt-field>
            <mt-cell :title="'记账日期'+' : '+ this.dayStr">
                <mt-button type="primary" size="small" @click="openPicker()">填写日期</mt-button>
            </mt-cell>
              <mt-field label="备注" placeholder="写点备注吧" type="textarea" rows="2" v-model="remarks"></mt-field>
        </div>


        <mt-popup
            v-model="budgetPopupVisible"
            popup-transition="popup-fade"
            position="bottom">
            <mt-picker :slots="budgetDataList" value-key="name" :show-toolbar="true" ref="budgetPicker">
                <div class="picker-toolbar-title">
                    <div class="usi-btn-cancel" @click="budgetPopupVisible = !budgetPopupVisible">取消</div>
                    <div class="">请选择收支类型</div>
                    <div class="usi-btn-sure" @click="selectBudget()">确定</div>
                </div>
            </mt-picker>
        </mt-popup>

        <mt-popup
            v-model="detailedPopupVisible"
            popup-transition="popup-fade"
            position="bottom">
            <mt-picker :slots="detailedDataList" value-key="name" :show-toolbar="true" ref="detailedPicker">
                <div class="picker-toolbar-title">
                    <div class="usi-btn-cancel" @click="detailedPopupVisible = !detailedPopupVisible">取消</div>
                    <div class="">请选择明细类型</div>
                    <div class="usi-btn-sure" @click="selectDetailed()">确定</div>
                </div>
            </mt-picker>
        </mt-popup>

        <mt-datetime-picker
            v-model="mytime"
            type="date"
            ref="datepicker"
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
            sigle: {},
            billType: billType,
            remarks: "",
            budgetType: 0,
            detailedType: 0,
            detailedName: '',
            dayStr: '',
            money: 0,
            date:'',
            budgetPopupVisible: false,
            detailedPopupVisible: false,
            budgetDataList: [
                {
                    flex: 1,
                    className: 'slot1',
                    textAlign: 'center',
                    defaultIndex: this.budgetType == 1 ? 0 : 1,
                    value: this.budgetType == 1 ? '收入' : '支出',
                    values: [
                        {
                            budget_type: 1,
                            name: "收入"
                        },
                        {
                            budget_type: 2,
                            name: '支出'
                        }
                    ]
                }
            ]
        }
    },
    watch: {
        
    },
    computed: {
        detailedDataList() {
            let data = []
            if (this.budgetType == 1) {
                data = this.billType.income
            } else if (this.budgetType == 2) {
                data = this.billType.expenditure
            }
            let slots = [
                {
                    flex: 2,
                    className: 'slot2',
                    textAlign: 'center',
                    value: this.detailedName,
                    defaultIndex: this.getDetailedIndex(),
                    values: data
                }
            ]
            return slots
        }
    },
    methods: {
        openPicker() {
            this.$refs.datepicker.open();
        },
        handleConfirm(e) {
            let year = e.getFullYear()
            let month = this.doHandleMonth(e)
            let days = this.daHandleDays(e)
            this.date = year + month + days
            this.dayStr = this.dayStrReachYearTime(this.date + "")
        },
        getDetailedIndex() {
            let index = 0
            if (this.budgetType == 1) {
                for (let i = 0; i < this.billType.income.length; i++) {
                    if (this.billType.income[i].name == this.detailedName) {
                        index = i
                        break
                    }
                }
            } else if (this.budgetType == 2) {
                for (let i = 0; i < this.billType.expenditure.length; i++) {
                    if (this.billType.expenditure[i].name == this.detailedName) {
                        index = i
                        break
                    }
                }
            }
            return index
        },
        setPickerStyle() {
            var width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            let picker = document.getElementsByClassName('picker')

            for (let i = 0; i < picker.length; i++) {
                picker[i].style.width = width + 'px'
            }
            
        },
        selectBudget() {
            let budget = this.$refs.budgetPicker.getValues()[0]
            this.budgetType = budget.budget_type
            this.budgetPopupVisible = false
            this.detailedName = ''
            this.detailedType = 0
        },
        selectDetailed() {
            let detailed = this.$refs.detailedPicker.getValues()[0]
            this.detailedName = detailed.name
            this.detailedType = detailed.detailedType
            this.remarks = detailed.name
            this.detailedPopupVisible = false
        },
        judgeSigleData() {
            if (this.budgetType == 0 || this.budgetType == "" || this.budgetType == null || this.budgetType == undefined) {
                Toast({
                message: '请选择收支类型！',
                position: 'middle',
                duration: 3000
                });
                return
            }
            if (this.detailedType == 0 || this.detailedType == "" || this.detailedType == null || this.detailedType == undefined) {
                Toast({
                message: '请选择明细类型！',
                position: 'middle',
                duration: 3000
                });
                return
            }
            if (this.money == 0 || this.money == "" || this.money == null || this.money == undefined) {
                Toast({
                message: '请填写收支金额！',
                position: 'middle',
                duration: 3000
                });
                return
            } else {
                this.money = this.keepTwoDecimalFull(this.money)
            }
            if (this.date == "" || this.date == null || this.date == undefined) {
                Toast({
                message: '请选择记账日期',
                position: 'middle',
                duration: 3000
                });
                return
            }
            this.updateSigle()
        },
        updateSigle() {
            this.post('/api/detailed/updatedetailed', {
                detailedId: this.sigle.ID,
                budgetType: this.budgetType,
                detailedType: this.detailedType,
                sigleMoney: this.money,
                sigleDate: this.date,
                remarks: this.remarks
            }).then((res) => {
                console.log(res)
                if (res.error_code == 0) {
                    Toast({
                        message: '修改成功',
                        position: 'middle',
                        duration: 3000
                    });
                    this.$router.push({path: '/detailed'})
                } else {
                    Toast({
                        message: '服务器开小差啦～',
                        position: 'middle',
                        duration: 3000
                    });
                }
            })
        },
        formatSigle() {
            this.remarks = this.sigle.Remarks
            this.budgetType = this.sigle.BudgetType
            this.detailedName = this.sigle.DetailedType
            this.detailedType = this.initDetailedType(this.budgetType, this.detailedName)
            this.money = this.sigle.DetailedMoney
            this.date = this.sigle.SigleDate + ''
            this.dayStr = this.dayStrReachYearTime(this.sigle.SigleDate +"")
        },
        initDetailedType(budgetType, name) {
            let detailedtype = 0
            if (budgetType == 1) {
                this.billType.income.forEach((val) => {
                    if (val.name == name) {
                        detailedtype = val.detailedType
                    }
                })
            } else if (budgetType == 2) {
                this.billType.expenditure.forEach((val) => {
                    if (val.name == name) {
                        detailedtype = val.detailedType
                    }
                })
            }
            return detailedtype
        },
        setMyTime(daystr) {
            let year = parseInt(daystr.substring(0, 4))
            let month  = parseInt(daystr.substring(4, 6)) - 1
            let day = parseInt(daystr.substring(6, 8))
            this.mytime = new Date(year, month, day, 0, 0, 0)
        }
    },
    mounted () {
        this.sigle = this.$store.state.detailed['selectionSigle']
        console.log(this.sigle)
        this.setMyTime(this.sigle.SigleDate.toString())
        this.formatSigle()
        this.setPickerStyle()
    }

}
</script>

<style scoped>
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
.picker-toolbar-title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}
.usi-btn-cancel, .usi-btn-sure {
    color: #FF6600
}
</style>
