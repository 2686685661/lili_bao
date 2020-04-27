// import Vue from 'vue'
// import Vuex from 'vuex'

const methods = {
    setCookie: (name,value,timer=1) => {
        var Days = timer; //默认将被保存 1 天
        var exp  = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
    },
    getCookie: (name) => {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null){
            return unescape(arr[2])
        }else{
            return null
        }
    },

    clearCookie: (name) => {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null) document.cookie=name +"="+cval+";expires="+exp.toGMTString();
    },

    getToken: () => {
        let token = ""
        token = methods.getCookie('user_token')
        return token
    },
    ltrim: (str,char) => {
        var pos = str.indexOf(char);
        var sonstr = str.substr(pos+1);
        return sonstr;
    },
    rtrim: (str,char) => {
        var pos = str.lastIndexOf(char);
        
        var sonstr = str.substr(0,pos);
        
        return sonstr;
    },
    // 1、时间戳转化成时间格式
    getTime: (times) => {
        return new Date(parseInt(times) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },

    // 2、时间戳转换为距离几天
    getTimeUntilNow: (mss) => {
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        console.log(days, mss)
        return days;
        // if (days > 0) {
        //     return days + " 天前";
        // };
        // var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // if (hours > 0) {
        //     return hours + " 小时前 ";
        // };
        // var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        // if (minutes > 0) {
        //     return minutes + " 分钟前 ";
        // };
        // var seconds = (mss % (1000 * 60)) / 1000;
        // return "刚刚 ";
    },
    doHandleMonth: (myDate) => {
        myDate = myDate || new Date()
        // var myDate = new Date();
        var tMonth = myDate.getMonth();
     
        var m = tMonth + 1;
        if (m.toString().length == 1) {
            m = "0" + m;
        }
        return m + "";
    },
    //获取指定时间的日期
    daHandleDays: (myDate) => {
        myDate = myDate || new Date()
        var days = myDate.getDate()
        if (days.toString().length == 1) {
            days = "0" + days 
        }
        return days + ""
    },

    dayStrReachTime(daystr) {
        let year = parseInt(daystr.substring(0, 4))
        let month  = parseInt(daystr.substring(4, 6)) - 1
        let day = parseInt(daystr.substring(6, 8))
        let weekarr = ["日", "一", "二", "三", "四", "五", "六"];
        let temp = new Date(year, month, day, 0, 0, 0)
        let str = methods.doHandleMonth(temp) + "月" + methods.daHandleDays(temp) + "日" + "  星期" + weekarr[temp.getDay()]
        return str
    },
    //四舍五入保留2位小数（不够位数，则用0替补）
    keepTwoDecimalFull: (num) => {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(num * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    },

    isPoneAvailable: (poneInput) => {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(poneInput)) {
            return false;
        } else {
            return true;
        }
    }


}

export { methods }