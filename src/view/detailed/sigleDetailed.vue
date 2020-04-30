<template>
    <div id="sigledetailed">
        <mt-header fixed :title="this.sigle.DetailedType">
            <i slot="left" class="fa fa-chevron-left" aria-hidden="true" @click="$router.push({path: '/detailed'})"></i>
        </mt-header>
        <div class="content">
            <mt-cell title="类型" >{{ this.sigle.BudgetType == 1 ? "收入" : "支出" }}</mt-cell>
            <mt-cell title="金额" >{{ this.sigle.DetailedMoney }}</mt-cell>
            <mt-cell title="日期" >{{ this.dayStrReachYearTime(this.sigle.SigleDate +"") }}</mt-cell>
            <mt-cell title="备注" >{{ this.sigle.Remarks }}</mt-cell>
        </div>
        <div class="footer">
            <mt-button class="footer-button" type="default" @click="updateSigle()">编辑</mt-button>
            <mt-button class="footer-button" type="default" @click="delSigle()">删除</mt-button>
        </div>
    </div>
</template>

<script>
import { billType } from '../../config/billType';
import { Toast } from 'mint-ui';
export default {
    data() {
        return {
            sigle: {},
            billType: billType,
            title: ""
        }
    },
    methods: {
        updateSigle() {
            this.$router.push({path:'/updatesigle'})
        }, 
        delSigle() {
            let _this = this
            this.$messagebox({
                title: '确认删除',
                message: '删除后数据将不可见！',
                showCancelButton: true,
                confirmButtonText:"删除",
                cancelButtonText:"取消"
            }).then((action) => {
                if (action == 'confirm') {
                    _this.post('/api/detailed/deldetailed', {
                        detialedId: _this.sigle.ID,
                        sigleDate: _this.sigle.SigleDate
                    }).then((res) => {
                        if (res.error_code == 0) {
                            Toast({
                            message: "删除成功",
                            position: 'middle',
                            duration: 3000
                            });
                            _this.$router.push({path: '/detailed'})
                        } else {
                            Toast({
                            message: res.msg,
                            position: 'middle',
                            duration: 3000
                            });
                        }
                    })
                }
            })
        }
    },
    mounted () {
        this.sigle = this.$store.state.detailed['selectionSigle']
        if (JSON.stringify(this.sigle) == "{}") {
            this.$router.go(-1)
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
.footer {
    width: 100%;
    position: fixed;
    bottom: 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.footer-button {
    width: 50%;
    padding: 0 0;
}
</style>
