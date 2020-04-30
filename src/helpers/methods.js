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
        var cval=methods.getCookie(name);
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

    //获取指定时间是第几月
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
    //获取指定时间的日期 01 、23
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

    dayStrReachYearTime(daystr) {
        let year = parseInt(daystr.substring(0, 4))
        let month  = parseInt(daystr.substring(4, 6)) - 1
        let day = parseInt(daystr.substring(6, 8))
        let weekarr = ["日", "一", "二", "三", "四", "五", "六"];
        let temp = new Date(year, month, day, 0, 0, 0)
        let str = temp.getFullYear() + "年" + methods.doHandleMonth(temp) + "月" + methods.daHandleDays(temp) + "日" + "  星期" + weekarr[temp.getDay()]
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

    //正则判断是否是手机号
    isPoneAvailable: (poneInput) => {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(poneInput)) {
            return false;
        } else {
            return true;
        }
    },

    //获取指定日期在当年的第几周
    getWeek: (dt) => {
        let d1 = new Date(dt);
        let d2 = new Date(dt);
        d2.setMonth(0);
        d2.setDate(1);
        let rq = d1-d2;
        let days = Math.ceil(rq/(24*60*60*1000));
        let num = Math.ceil(days/7);
        return num;
    },

    //获取某个日期所在周周一的日期
    GetFirstMonday:(dd) => {
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? week - 1 : 6;
        dd.setDate(dd.getDate() - minus); //获取minus天前的日期
        var y = dd.getFullYear();
        var m = methods.doHandleMonth(dd); //获取月份
        var d = methods.daHandleDays(dd);
        return y + "" + m + "" + d;
    },
    //获取某个日期所在周周末的日期
    GetLastMonday: (dd) => {
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? (7 - week) : minus;
        dd.setDate(dd.getDate() + minus); //获取minus天后的日期
        var y = dd.getFullYear();
        var m = methods.doHandleMonth(dd); //获取月份
        var d = methods.daHandleDays(dd);
        return y + "" + m + "" + d;
    },
    

    helperswitchDate(dayNum, selected) {
        dayNum = parseInt(dayNum)
        let dd = new Date()
        dd.setDate(dd.getDate()-dayNum); //获取dayNum天前的日期时间

        if (selected == '1') {
            let n = Math.ceil(dayNum / 7)
            let weekValue = []
            //当年的第几周
            let theweeknum = methods.getWeek(dd.getFullYear() + '-' + methods.doHandleMonth(dd) + '-' + methods.daHandleDays(dd))
            for (let i = 0; i <= n; i++) {
                weekValue.push({
                    name: theweeknum + "周",
                    firstDate: methods.GetFirstMonday(dd),
                    lastDate: methods.GetLastMonday(dd)
                })
                theweeknum = theweeknum+1
                dd.setDate(dd.getDate() + 7);
            }
            return weekValue
        } else if (selected == '2') {
            let monthValue = []
            let monthNum = dd.getMonth()
            let fornum = ((new Date().getMonth()) - monthNum) + 1 //获取当前时间和注册时间的月份差整数
            for (let i = 0; i < fornum; i++) {
                let temp = new Date(dd.getFullYear(), dd.getMonth()+1, 0)
                monthValue.push({
                    name: (monthNum + 1) + '月',
                    firstDate: dd.getFullYear() + "" + methods.doHandleMonth(dd) + "01",
                    lastDate: dd.getFullYear() + "" + methods.doHandleMonth(dd) + temp.getDate()
                })
                monthNum = monthNum + 1
                dd.setMonth(dd.getMonth() + 1);
            }
            return monthValue
        } else if (selected == '3') {
            let yearValue = []
            let yearNum = dd.getFullYear()
            let fornum = (new Date().getFullYear() - yearNum) + 1 //获取当前时间和注册时间的年份差整数
            for (let i = 0; i < fornum; i++) {
                let temp = new Date(dd.getFullYear(), 12, 0)
                yearValue.push({
                    name: yearNum + "年",
                    firstDate: dd.getFullYear() + "0101",
                    lastDate: dd.getFullYear() + "12" + temp.getDate()
                })
                yearNum = yearNum + 1
                dd.setFullYear(dd.getFullYear() + 1);
            }
            return yearValue
            
        }
    },

    downLoadByUrl: (url) => {
        var xhr = new XMLHttpRequest();
        //GET请求,请求路径url,async(是否异步)
        xhr.open('GET', url, true);
        //设置请求头参数的方式,如果没有可忽略此行代码
        xhr.setRequestHeader("Authorization", methods.getCookie('user_token'));
        //设置响应类型为 blob
        xhr.responseType = 'blob';
        //关键部分
        xhr.onload = function (e) {
            //如果请求执行成功
            if (this.status == 200) {
                var blob = this.response;
                var filename = "123.xlsx";//如123.xls
                var a = document.createElement('a');

                blob.type = "application/octet-stream";
                //创键临时url对象
                var url = URL.createObjectURL(blob);

                a.href = url;
                a.download=filename;
                a.click();
                //释放之前创建的URL对象
                window.URL.revokeObjectURL(url);
            }
        };
        //发送请求
        xhr.send();
    },


    /**
     * 获取指定周一的7天日期
     * @param {*} daystr 字符串形式日期："20200401"
     */
    getAppoitWeekDateRange(daystr) {
        let year = parseInt(daystr.substring(0, 4))
        let month  = parseInt(daystr.substring(4, 6)) - 1
        let day = parseInt(daystr.substring(6, 8))
        let date = new Date(year, month, day, 0, 0, 0)
        let week = []
        for (let i = 0; i < 7; i++) {
            week.push((methods.doHandleMonth(date) + "" + methods.daHandleDays(date)))
            date.setDate(date.getDate() + 1);
        }
        return week
    }
}

export { methods }