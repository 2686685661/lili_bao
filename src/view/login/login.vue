<template>
    <div>
        <mt-header title="登陆">

        </mt-header>
        <div class="form-container">
            <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
        </div>
        <mt-button type="primary" size="large" @click="checkLogin()">登陆</mt-button>
        
        <div class="footer-font">
            <span>找回密码</span>
            <span @click="$router.push({path:'/register', query: {phone: phone}})">快速注册</span>
        </div>
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
            password: "",

        }
    },
    methods: {
        checkLogin() {
            if ( this.name == "" || this.password == "") {
                Toast({
                    message: '请输入手机号和密码',
                    position: 'middle',
                    duration: 3000,
                });
                return;
            }
            this.login()
        },
        login() {
            let _this = this;
            this.post('/login', {
                phone: this.phone,
                password: this.password
            }).then((res) => {
                if (res.error_code == 0) {
                    let data = res.data
                    if (data.hasOwnProperty("token") == true) {
                        _this.setCookie('user_token', data.token, 1)
                        _this.$store.commit("changeUserStatus", {name:'token',val:data.token})
                        delete data.token
                    }
                    this.$router.push({
                        path: '/user'
                    })
                } else {
                    Toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000,
                    });
                }
            })
        }

    },
    mounted() {

    }
    
}
</script>>

<style >
.mint-button--large {
    width: 90%;
    margin: 50px auto;
}
.form-container {
    margin-top: 5%;
}
.footer-font {
    display: flex;
    justify-content: space-between
}
.footer-font span {
    margin: 0 5%;

}
</style>