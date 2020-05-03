<template>
    <div id="usermsg">
        <mt-header fixed title="个人信息">
            <i slot="left" class="fa fa-chevron-left" aria-hidden="true" @click="$router.push({path: '/user'})"></i>
        </mt-header>

        <div class="content">
            <div class="userhead" @click="onPickFile()">
                <span class="userhead-font" style="margin-left:10px;">头像</span>
                <span class="userhead-font userhead-span-margin">
                    <img class="userhead-img" :src="headUrl == '' ? defaultHead : headUrl" alt="">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </span>
            </div>

            <!-- <cropper :headerImage="headerImage"  @getHeaderImage="newHeaderImage"></cropper>　 -->
            
            <mt-cell title="昵称" is-link @click.native="updateNickName()">
                <span style="color: green">{{ this.username }}</span>
            </mt-cell>
            <mt-cell title="性别" is-link @click.native="PopupVisible = true"> 
                <span style="color: green">{{ this.sex == 0 ? '男' : '女' }}</span>
            </mt-cell>
            <mt-cell title="手机号" >
                <span style="">{{ this.phone }}</span>
            </mt-cell>
        </div>


        <mt-popup
            v-model="PopupVisible"
            popup-transition="popup-fade"
            position="bottom">
            <mt-picker :slots="sexDataList" value-key="name" :show-toolbar="true" ref="picker">
                <div class="picker-toolbar-title">
                    <div class="usi-btn-cancel" @click="PopupVisible = !PopupVisible">取消</div>
                    <div class="">请选择性别</div>
                    <div class="usi-btn-sure" @click="updateSex()">确定</div>
                </div>
            </mt-picker>
        </mt-popup>

        <input type="file" accept="image/*" @change="handleFile" ref="fileInput" style="display: none">
    </div>
</template>

<script>
import { Toast,MessageBox } from 'mint-ui';
import Exif from 'exif-js';
export default {
    data() {
        return {
            headerImage: '',
            user: {},
            headUrl: '',
            defaultHead: require('../../assets/img/default_head.jpg'),
            username: "",
            sex: 0,
            phone: "",
            PopupVisible: false,
            sexDataList: [
                {
                    flex: 1,
                    className: 'slot1',
                    textAlign: 'center',
                    defaultIndex: this.sex,
                    value: this.set == 0 ? '帅哥' : '靓女',
                    values: [
                        {
                            sexid: 0,
                            name :'帅哥'
                        },
                        {
                            sexid: 1,
                            name :'靓女'
                        }
                    ]
                }
            ]

        }
    },
    methods: {
        newHeaderImage(newImg){
            this.headerImage = newImg;
        },
        onPickFile() {
            // Toast({
            //     message: "期待下一版本～",
            //     position: 'middle',
            //     duration: 3000,
            // }) 
            // console.log('fuck')
            this.$refs.fileInput.click()
        },
        handleFile(e) {
            let files = e.target.files || e.dataTransfer.files || e.target || e.srcElementb;  
            if (!files.length) return;  
            let picValue = files[0];
            var testmsg=picValue.name.substring(picValue.name.lastIndexOf('.')+1)   
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = picValue.size / 1024 / 1024 < 10  
            if(!extension && !extension2) {
                Toast({
                    message: "上传文件只能是 jpg、png格式!",
                    position: 'middle',
                    duration: 3000,
                })
            }
            if(!isLt2M) {
                Toast({
                    message: "上传文件大小不能超过 10MB!",
                    position: 'middle',
                    duration: 3000,
                })
            }
            if (extension || extension2 && isLt2M) {
                this.postImg(picValue)
            }

        },
        postImg(file) {
            let param = new FormData(); //创建form对象
            param.append('file', file, file.name);//通过append向form对象添加数据
            this.post("/api/user/upload", param).then((res) => {
                if (res.error_code == 0) {
                    this.headUrl = res.data
                    Toast({
                        message: "头像修改成功",
                        position: 'middle',
                        duration: 3000,
                    })
                }
            })
        },

        initUserData() {
            this.headUrl = this.user.HeadPortait
            this.username = this.user.NickName
            this.sex = this.user.Sex
            this.phone = this.user.Phone + ''
        },
        updateSex() {
            let sex = this.$refs.picker.getValues()[0]
            this.PopupVisible = false
            this.post('/api/user/updatemsg', {
                msgType: 2,
                data: sex.sexid
            }).then((res) => {
                if (res.error_code == 0) {
                    this.sex = sex.sexid
                    Toast({
                        message: "性别修改成功",
                        position: 'middle',
                        duration: 3000,
                    })
                } else {
                    Toast({
                        message: "服务器开小差啦～",
                        position: 'middle',
                        duration: 3000,
                    })
                }
            })
            

        },
        updateNickName() {
            let _this = this
            this.$messagebox.prompt("昵称", {
                closeOnClickModal: true,
                showInput: true,
                inputValue: this.username
            }).then(action => {
                if (action.action == 'confirm') {
                    let nickname = action.value
                    nickname.replace(/(^\s*)|(\s*$)/g, "")
                    if (nickname == "") {
                        Toast({
                            message: "昵称不能为空",
                            position: 'middle',
                            duration: 3000,
                        })
                        return
                    }
                    _this.post('/api/user/updatemsg', {
                        msgType: 1,
                        data: nickname
                    }).then((res) => {
                        if (res.error_code == 0) {
                            _this.username = nickname
                            Toast({
                                message: "昵称修改成功",
                                position: 'middle',
                                duration: 3000,
                            })
                        } else {
                            Toast({
                                message: "服务器开小差了～",
                                position: 'middle',
                                duration: 3000,
                            })
                        }
                    })
                }
            });
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
    },
    mounted () {
        this.user = this.$store.state.user['userMsg']
        this.initUserData()
        this.setPickerStyle()
        console.log(this.user)
    }
}
</script>

<style scoped>
.content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}
.userhead {
    width: 100%;
    min-height: 48px;
    display: flex;
    justify-content:space-between;
    align-items: center;
}
.userhead-font  {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.userhead-span-margin {
    margin-right: 20px;
}
.userhead-img {
    height: 35px;
    width: 35px;
    margin: 0 10px 0 0;
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
