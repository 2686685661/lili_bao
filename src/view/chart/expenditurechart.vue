<template>
    <div id="incomechart">
        <mt-header fixed title="粒粒记账">
            <i slot="left" class="fa fa-calendar-o" aria-hidden="true" @click="popupVisible = true">日期</i>
            <i slot="right" class="fa fa-sort" aria-hidden="true" @click="$router.push({path: '/incomechart'})">&nbsp;&nbsp;支出</i>
        </mt-header>
        <div class="content">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">周</mt-tab-item>
                <mt-tab-item id="2">月</mt-tab-item>
                <mt-tab-item id="3">年</mt-tab-item>
            </mt-navbar>
        </div>
        <div class="total-pingjun">
            <div class="total">总支出: {{ this.total }}</div>
            <div class="pingjun">平均值: {{ this.average }}</div>
        </div>

        <div id="canvas"></div>
        <div id="container" ref="container" style="display:none;"></div>

        <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            position="bottom">
            <mt-picker :slots="dataList" value-key="name" :show-toolbar="true" ref="picker">
                <div class="picker-toolbar-title">
                    <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
                    <div class="">请选择日期</div>
                    <div class="usi-btn-sure" @click="SelectData()">确定</div>
                </div>
            </mt-picker>
        </mt-popup>
        <div style="height: 100px;"></div>
        <NavBottom class="nav-bottom"></NavBottom>
    </div>
</template>

<script>
import Vue from 'vue'
import { Navbar, TabItem, Toast, Picker, Popup } from 'mint-ui';  //导航栏
import { billType } from '../../config/billType';
import { Line, Bar } from '@antv/g2plot';
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
export default {
    watch: {
        selected(val) {
            if (val == '1') {
                this.setWeekDate()
            } else if (val == '2') {
                this.setMonthDate()
            } else {
                this.setYearDate()
            }
            this.getChartData()
            this.getBarData()
        }
    },
    data() {
        return {
            billType: billType,
            budgetType: 2,
            currentTags: {},
            fuck: true,
            popupVisible: false,
            selected:"1",
            firstDate: "",
            lastDate: "",
            currentTags: {},
            linePlot: null,
            barPlot: null,
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }
            ],
            total: 0.00,
            average: 0.00,
            testData: [
                {
                    '明细类型': "暂无",
                    '汇总金额': 0,
                },
                {
                    '明细类型': "test",
                    '汇总金额': 0,
                },
            ]
        }
    },
    computed: {
        dataList() {
            let registerTime = this.getCookie('RegisterTime')
            let data = this.helperswitchDate(registerTime, this.selected) //TODO helperswitchDate辅助函数有问题，二期修改
            data.sort((x, y) => {
                return parseInt(y.name) - parseInt(x.name)
            })
            let slots = [
                {
                    flex: 1,
                    className: 'slot1',
                    textAlign: 'center',
                    values: data
                }
            ]
            return slots
        }
    },
    methods: {
        showContailer() {
            this.$refs.container.style.display = "block";
        },
        getBarData() {
            this.fetch('/api/chart/getbarchardata', {
                budgetType: this.budgetType,
                farstDate: this.firstDate,
                lastDate: this.lastDate
            }).then((res) => {
                if (res.error_code == 0) {
                    this.FormatBarData(res.data)
                }
            })
        },
        FormatBarData(barData) {
            let data = []
            if (barData != null) {
                barData.forEach((val) => {
                    this.billType.expenditure.forEach((val2) => {
                        if (val.DetailedType == parseInt(val2.detailedType)) {
                            data.push({
                                "汇总金额": parseFloat(val.Summary),
                                "明细类型": val2.name
                            })
                        }
                    })
                })
            }
            this.initBar(data)
        },
        StatisticsTotal(data) {
            if (data != null) {
                let num = data.length || 1
                for (let i = 0; i < num; i++) {
                    this.total += parseFloat(data[i].Summary)
                }
                this.average = (this.total / num).toFixed(2)
            } else {
                this.total = 0.00
                this.average = 0.00 
            }

        },
        setPickerStyle() {
            var width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            let picker = document.getElementsByClassName('picker')
            picker[0].style.width = width + 'px'
        },
        initBar(data) {
            if (data.length == 0) {
                data = this.testData
                this.$refs.container.style.display = "none";
            } else {
                this.showContailer()
            }
            if (this.barPlot == null) {
                this.barPlot = new Bar(document.getElementById('container'), {
                    forceFit: true, //自适应容器宽高
                    barSize:30,
                    title: {
                        visible: true,
                        text: '支出排行榜',
                    },
                    data,
                    xField: '汇总金额',
                    yField: '明细类型',
                    conversionTag: {
                        visible: false,
                    },
                    label: {
                        visible: true,
                        position: 'middle',
                        offsetX: 6,
                        // offsetY: 6,
                        style: {
                            fill: 'rgba(0, 0, 0, 0.65)',
                            stroke: '#ffffff',
                            lineWidth: 2,
                        },
                        adjustColor: true,
                        adjustPosition: true
                    },

                });
                this.barPlot.render();
            }
            this.barPlot.changeData(data)
            // this.barPlot.repaint()
        },
        initLine(data) {
            if (this.linePlot == null) {
                this.linePlot = new Line('canvas', {
                    forceFit: true, //自适应容器宽高
                    data,
                    xField: 'xField',
                    yField: 'yField',
                    color: '#1979C9',
                    lineSize: 1,  //折线宽度
                    point: {  //配置折线上的点
                        visible: true,
                        size:3,
                        color: 'white',
                        style: {
                            fill: '#FE740C',
                            stroke: '#FE740C',
                            lineWidth: 1,
                            fillOpacity: 0.6,
                        }
                    },
                    xAxis: {

                    }, 
                    yAxis: {
                        grid: {
                            visible: true
                        }
                        // formatter: (v) => {
                        //     return v + 'k';
                        // },
                    },
                    label: {
                        visible: true
                    },
                });
                this.linePlot.render();
            }
            this.linePlot.changeData(data)
        },
        SelectData() {
            this.currentTags = this.$refs.picker.getValues()[0]
            this.firstDate = this.currentTags.firstDate
            this.lastDate = this.currentTags.lastDate
            this.getChartData()
            this.getBarData()
            this.popupVisible = false
        }, 
        getChartData() {
            this.fetch('/api/chart/getchartdata', {
                budgetType: this.budgetType,
                dateType: this.selected,
                farstDate: this.firstDate,
                lastDate: this.lastDate
            }).then((res) => {
                if (res.error_code == 0) {
                    this.StatisticsTotal(res.data)
                    this.FormatData(res.data)
                } else {
                    Toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000,
                    });
                }
            })
        },
        FormatData(linedata) {
            let data = []
            if (this.selected == '1') {
                let week = this.getAppoitWeekDateRange(this.firstDate+'') || []
                if (linedata == null) {
                   for (let i = 0; i < week.length; i++) {
                        data.push({
                            "xField": week[i].substring(0, 2) + "-" + week[i].substring(2, 4),
                            "yField": 0
                        })
                   }
                } else {
                    for (let i = 0; i < week.length; i++) {
                        linedata.forEach((val) => {
                            if (val.Date.toString().substring(4, 8) == week[i]) {
                                data.push({
                                    "xField": week[i].substring(0, 2) + "-" + week[i].substring(2, 4),
                                    "yField": val.Summary
                                })
                            } else {
                                data.push({
                                    "xField": week[i].substring(0, 2) + "-" + week[i].substring(2, 4),
                                    "yField": 0
                                })
                            }
                        })
                        
                    }
                }
                this.initLine(data)
            } else if (this.selected == '2') {
                let daystr = this.firstDate.toString()
                let day = parseInt(daystr.substring(6, 8))
                let theonedate = new Date(
                    parseInt(daystr.substring(0, 4)), 
                    parseInt(daystr.substring(4, 6)) - 1, 
                    parseInt(daystr.substring(6, 8)), 
                    0, 
                    0, 
                    0
                ); //获取选择月的第一天时间

                let date = new Date(parseInt(daystr.substring(0, 4)), parseInt(daystr.substring(4, 6)), 0) 
                let fornum = date.getDate() //获取选择月的天数
                let month = []
                if (linedata == null) {
                    for (let i = 1; i <= fornum; i++) {
                        month.push({
                            "xField": i.toString(),
                            "yField": 0
                        }) 
                    }
                } else {
                    let s = 0
                    for (let i = 1; i <= fornum; i++) {
                        linedata.forEach((val) => {
                            if (val.Date.toString() == (theonedate.getFullYear() + this.doHandleMonth(theonedate) + this.daHandleDays(theonedate))) {
                                month.push({
                                    "xField": i.toString(),
                                    "yField": val.Summary
                                })
                            } else {
                                month.push({
                                    "xField": i.toString(),
                                    "yField": 0
                                })
                            }
                        })
                        theonedate.setDate(theonedate.getDate() + 1);
                    }
                }
                this.initLine(month)
            } else {
                let year = []
                let daystr = this.firstDate.toString()
                let theonedate = new Date(
                    parseInt(daystr.substring(0, 4)), 
                    parseInt(daystr.substring(4, 6)) - 1, 
                    parseInt(daystr.substring(6, 8)), 
                    0, 
                    0, 
                    0
                ); //获取选择月的第一天时间
                if (linedata == null) {
                    for (let i = 1; i <= 12; i++) {
                        year.push({
                            "xField": i.toString(),
                            "yField": 0
                        })
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        linedata.forEach((val) => {
                            if ((theonedate.getFullYear() + this.doHandleMonth(theonedate)) == val.Month) {
                                year.push({
                                    "xField": i.toString() + "月",
                                    "yField": val.Summary
                                })
                            } else {
                                year.push({
                                    "xField": i.toString() + "月",
                                    "yField": 0
                                })
                            }
                        })
                        theonedate.setMonth(theonedate.getMonth() + 1);
                    } 
                }
                this.initLine(year)
            }
        },
        setWeekDate() {
            let time = new Date()
            this.firstDate = this.GetFirstMonday(time) //所在日期的周一的日期
            this.lastDate = this.GetLastMonday(time) //所在日期的周末的日期
            
        },
        setMonthDate() {
            let time = new Date()
            this.firstDate = time.getFullYear() + this.doHandleMonth(time) + "01"
            this.lastDate = time.getFullYear() + this.doHandleMonth(time) + "" + (new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate())

        },
        setYearDate() {
            let time = new Date()
            this.firstDate = time.getFullYear() + "0101"
            this.lastDate = time.getFullYear() + "12" + (new Date(time.getFullYear(), 12, 0).getDate())
        }
    },
    mounted () {
        this.setWeekDate() //初始化时间
        this.setPickerStyle() //修改picker样式
        this.getChartData()
        this.getBarData()

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
.nav-bottom {
    position: fixed;
}
.mtpicker {
    display: flex;
    justify-content:space-between
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

.total-pingjun {
    margin: 10px 0 0px 22px;
    font-size: 12px;
    color: grey;
}
.total {
    margin: 10px 0;
}

</style>
