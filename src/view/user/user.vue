<template>
<div id="my">
    <mt-header fixed title="个人中心"></mt-header>
    <div class="content">
    <div class="head">
        <div class="user-head">
            <div class="user-img" style="order:1" @click="$router.push({path: '/usermsg'})"></div>
            <diV class="user-name" style="order:1">{{ usermsg.NickName }}</diV>
            <div class="right-arrow" style="order:2">
                <mt-button size="normal" @click="pluckClock()" v-if="this.$store.state.user['pluckColck'] == false">每日打卡</mt-button>
                <mt-button size="normal" v-else disabled>成功打卡</mt-button>
            </div>
        </div>
        <div class="user-daka">
            <div>已连续打卡：{{ usermsg.ClockinNum }}</div>
            <div>记账总天数：{{ usermsg.RegisterTime }}</div>
            <div>记账总笔数：{{ usermsg.KeepNum }}</div>
        </div>
    </div>
      <div class="user-option">
          <div class="user-option-tubiao">
              <div><mt-button type="default" @click="wait()">我的消息</mt-button></div>
              <div>
                  <mt-button type="default" @click="wait()">零钱</mt-button>
              </div>
              <div>
                   <mt-button type="default" @click="$router.push({path: '/yearbill'})">账单导出</mt-button>
              </div>
          </div>
          <div class="user-option-zhangdan" @click="$router.push({path: '/yearbill'})">
              <div class="user-zhangdan-left">
                  <div>账单</div>
                  <div>{{ this.doHandleMonth((new Date())) }}月</div>
              </div>
              <sapn style="float:left;width: 1px;height: 25px; background: #000;"></sapn> 
              <div class="user-zhangdan-right">
                  <div>
                        <div>收入</div>
                        <div>{{ usermsg.Bill.MonthIncome }}</div>                     
                  </div>
                  <div>
                        <div>支出</div>
                        <div>{{ usermsg.Bill.MonthExpenditare }}</div>     
                  </div>
                  <div>
                        <div>结余</div>
                        <div>{{ (usermsg.Bill.MonthIncome - usermsg.Bill.MonthExpenditare).toFixed(2) }}</div>     
                  </div>
              </div>
              <i style="margin-right: 5px;" class="fa fa-angle-right" aria-hidden="true"></i> 
          </div>
        <o-chart :data="data" :legend="legend">
            <o-pie position="name*percent"></o-pie>
        </o-chart>
          <div class="user-option-yusuan">
              <mt-cell title="本月预算" :label="this.yusuanlable+''">
                  <mt-button type="primary" size="small" @click="setYusuan()">设置预算</mt-button>
              </mt-cell>
              <mt-cell title="剩余预算" :value="(this.yusuanlable == 0) ? 0 : (this.yusuanlable - this.usermsg.Bill.MonthExpenditare).toFixed(2) + ''"></mt-cell>
              <mt-cell title="本月支出" :value="this.usermsg.Bill.MonthExpenditare+''"></mt-cell>
              <mt-cell title="当前版本" value="V1.0.0"></mt-cell>
              <mt-button type="danger" style="margin-top:30px;" size="large" @click="signout()">退出登陆</mt-button>
          </div>
           
      </div>
     
    </div>
    
    <div style="height: 200px"></div>
    <NavBottom class="nav-bottom"></NavBottom>
</div>

</template>

<script>
import { Toast,MessageBox } from 'mint-ui';
export default {
    data() {
        return {
            test: "fuck",
            defaultUserHead: '../../assets/img/default_head.jpg',
            usermsg: {},
            yusuanlable: 0,
            legend: {
                position: "top",
                align: "center", // align只有当position为top何bottom时有效
                //verticalAlign:"middle",
            },
            data: [
                {
                    name: "收入",
                    percent: 0
                },
                {
                    name: "支出",
                    percent: 0
                },
                {
                    name: "结余",
                    percent: 0
                }
            ]
        }
    },
    methods: {
        wait: () => {
            Toast({
                message: "期待下一版本～",
                position: 'middle',
                duration: 3000,
            });
        },
        getUserMsg() {
            this.fetch("/api/user/getuseranymsg").then((res) => {
                if(res.error_code == 0) {
                    this.usermsg = res.data
                    this.setUserData()
                    this.$store.commit("changeUserStatus", {name:'userMsg',val: res.data})
                    this.setCookie('RegisterTime', res.data.RegisterTime)
                } else {
                    Toast({
                        message: "网络延迟，请稍后刷新",
                        position: 'middle',
                        duration: 1000,
                    });
                }
            })
        },
        setUserData() {
            this.yusuanlable = this.usermsg.Bill.MonthBudget
            let income = this.usermsg.Bill.MonthIncome
            let monthExpenditare = this.usermsg.Bill.MonthExpenditare
            let jieyu = Math.abs(income - monthExpenditare)
            let total = parseInt(income) + parseInt(monthExpenditare) + parseInt(jieyu)
            total = (total == 0) ? 1 : total
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].name == '收入') {
                    this.data[i].percent = parseFloat((income / total).toFixed(2)) * 100
                } else if (this.data[i].name == '支出') {
                    this.data[i].percent = parseFloat((monthExpenditare / total).toFixed(2)) * 100
                } else {
                    this.data[i].percent = parseFloat((jieyu / total).toFixed(2)) * 100
                }
            }
        },

        pluckClock() {
            this.fetch('/api/user/punchclock').then((res) => {
                if (res.error_code == 0) {
                    this.$store.commit('changeUserStatus', {name: 'pluckColck', val: true})
                    this.getUserMsg()
                } else {
                    Toast({
                        message: "打卡失败",
                        position: 'middle',
                        duration: 3000,
                    });
                }
            })
        },
        setYusuan() {
            let monthBudget = this.usermsg.Bill.MonthBudget
            MessageBox.prompt('设置预算', '提示', {
                inputValue: monthBudget+''
            }).then(({ value, action }) => {
                if (action == 'confirm') {
                    this.post('/api/user/setbudget', {
                        budget: parseFloat(value)
                    }).then((res) => {
                        if (res.error_code == 0) {
                            Toast({
                                message: "设置成功",
                                position: 'middle',
                                duration: 3000,
                            });
                            this.getUserMsg()
                        } else {
                            Toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 3000,
                            });         
                        }
                    })
                }
            });
        },
        signout() {
            this.clearCookie("user_token")
            this.$router.push({
                path: "/login"
            })
        }
    },
    mounted () {
        this.getUserMsg()
        
    }
}
</script>

<style scoped>
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }
 
  .user-head {
    height: 100px;
    width: 100%;
    background-color: #73ccff;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
.nav-bottom {
    position: fixed;
}
  .user-daka {
    height: 50px;
    width: 100%;
    background-color: #73ccff;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .user-daka div {
      font-size: 12px;
      color:aliceblue
  }
 
  .user-img {
    background-image: url("../../assets/img/default_head.jpg"); /**默认头像，先不搞用户信息修改 */
    width: 60px;
    height: 60px;
    border-radius: 30px;
    border: solid #ffffff 2px;
    display: flex;
    justify-content: center;
    align-items: center;
	background-repeat:no-repeat;
	background-size: 100% 100%;
	background-size: cover;
  }
 
  .user-option {
    /* background-color: #dbdbdb; */
  }
  .user-option-tubiao {
      width: 95%;
      height: 60px;
      margin: 10px auto;
      background-color: #dbdbdb;
      display: flex;
      justify-content: space-around;
      align-items: center;
  }

  .user-option-zhangdan {
      width: 95%;
      height: 70px;
      margin: 10px auto;
      background-color: #dbdbdb;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .user-zhangdan-left {
      width: 15%;
      margin: 0 10px;
  }

  .user-zhangdan-right {
      width: 85%;
      margin: 0 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 12px;
  }


  .user-option-yusuan {
      width: 96%;
      height: 100px;
      margin: 10px auto;
      background-color: #dbdbdb;
  }

 
  .mint-cell {
    min-height: 40px;
  }
 
  .right-arrow {
    margin-left: 10px;
  }
 
  .user-option span {
    font-size: 13px;
  }
 
  .mint-cell:last-child {
    background-position-x: 10px;
  }

</style>
