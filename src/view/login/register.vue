<template>
    <div>
        <mt-header title="快速注册">
        <router-link to="/login" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        </mt-header>

        <div class="jindu">
            <span style="color: red">1.输入手机号</span>
            &#8197;>&#8197; 
            <span>2.获取验证码</span>
            &#8197;>&#8197; 
            <span>3.设置密码</span>
        </div>
        <div class="form-container">
            <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
        </div>

        <mt-button type="primary" size="large" @click="getSmsCode()">获取验证码</mt-button>
    
    </div>
    
</template>

<script>
// import { Field } from 'mint-ui';
import { Toast } from 'mint-ui';
export default {
    components: {

    },
    data() {
        return {
            phone: "",
        }
    },
    methods: {
        getSmsCode() {
            if (this.phone == "" || this.phone == undefined || this.phone == 'undefined') {
                Toast({
                    message: '请输入手机号',
                    position: 'middle',
                    duration: 3000,
                });    
                return;        
            }
            if (this.isPoneAvailable(this.phone) == false) {
                Toast({
                    message: '这不是一个手机号哦',
                    position: 'middle',
                    duration: 3000,
                });    
                return;        
            }

            this.post('/sendSms', {
                phone: this.phone,
            }).then((res) => {
                if (res.error_code == 0) {

                } else {
                    Toast({
                        message: '网络开小差啦～短信发送失败',
                        position: 'middle',
                        duration: 3000,
                    });              
                }
                this.$router.push({
                    path: '/registersms',
                    query: {
                        phone: this.phone
                    }
                })
            })
        }
    },
    mounted() {
        this.phone = this.$route.query.phone;
    }
    
}
</script>>

<style >
.jindu {
    margin: 4% 0;
    display: flex;
    justify-content: center;
}
.form-container {
    margin: 5% 0;
}
.mint-button--large {
    width: 90%;
    margin: 50px auto;
}
</style>