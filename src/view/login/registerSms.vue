<template>
    <div>
        <mt-header title="快速注册">
        <router-link to="/register" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        </mt-header>

        <div class="jindu">
            <span>1.输入手机号</span>
            &#8197;>&#8197; 
            <span style="color: red">2.获取验证码</span>
            &#8197;>&#8197; 
            <span>3.设置密码</span>
        </div>
        <div class="form-container">
            <mt-field placeholder="请输入短信中的验证码" type="number" v-model="smscode"></mt-field>
        </div>

        <mt-button type="primary" size="large" @click="goput()">提交验证码</mt-button>
        

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
            smscode: ""
        }
    },
    methods: {
        goput() {
            if (this.smscode == "" || this.smscode == undefined || this.smscode == 'undefined') {
                Toast({
                    message: '验证码为空',
                    position: 'middle',
                    duration: 3000,
                });    
                return                
            } 
            this.$router.push({
                path: '/registerpass',
                query: {
                    phone: this.phone,
                    smscode: this.smscode
                }
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