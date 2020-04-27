<template>
    <div>
        <mt-header title="快速注册">
        <router-link to="/registersms" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        </mt-header>

        <div class="jindu">
            <span>1.输入手机号</span>
            &#8197;>&#8197; 
            <span>2.获取验证码</span>
            &#8197;>&#8197; 
            <span style="color: red">3.设置密码</span>
        </div>
        <div class="form-container">
            <mt-field placeholder="输入密码" type="password" v-model="password"></mt-field>
            <mt-field placeholder="确认密码" type="password" v-model="repatpass"></mt-field>
        </div>

        <mt-button type="primary" size="large" @click="putRegister()">确认提交</mt-button>
    
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
            smscode:"",
            password: "",
            repatpass: ""
        }
    },
    methods: {
        putRegister() {
            if ((this.password == "" || this.password == undefined || this.password == 'undefined') ||
                (this.repatpass == "" || this.repatpass == undefined || this.repatpass == 'undefined')) {
                Toast({
                    message: '请输入和确认密码',
                    position: 'middle',
                    duration: 3000,
                });    
                return;        
            }

            this.post('/register', {
                phone: this.phone,
                smsCode: this.smscode,
                password: this.password,
                repeatPass: this.repatpass
            }).then((res) => {
                if (res.error_code == 0) {
                    Toast({
                        message: '注册成功',
                        position: 'middle',
                        duration: 2000,
                    });
                    setTimeout(() => {
                        this.$router.push({
                            path: '/login'
                        })
                    }, 2000)                
                } else {
                    Toast({
                        message: err.msg,
                        position: 'middle',
                        duration: 3000,
                    });                  
                }
            })
        }
    },
    mounted() {
        this.phone = this.$route.query.phone;
        this.smscode = this.$route.query.smscode;
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