<template>
    <mt-tabbar v-model="select">
        <!-- <mt-tab-item @click.native="jump('')" :id="1">
            <i slot="icon" class="fa fa-credit-card fa-lg" aria-hidden="true"></i>
            存钱罐
        </mt-tab-item> -->
        <mt-tab-item @click.native="jump('/incomechart')" :id="2">
            <i slot="icon" class="fa fa-pie-chart fa-lg" aria-hidden="true"></i>
            图表
        </mt-tab-item>
        <mt-tab-item @click.native="jump('detailed')" :id="3">
            <i slot="icon" class="fa fa-book fa-lg" aria-hidden="true"></i>
            明细
        </mt-tab-item>
        <!-- <mt-tab-item @click.native="jump('')" :id="4">
            <i slot="icon" class="fa fa-university fa-lg"></i>
            社区
        </mt-tab-item> -->
        <mt-tab-item @click.native="jump('/user')" :id="5">
            <i slot="icon"  class="fa fa-user-o fa-lg"></i>
            我的
        </mt-tab-item>
    </mt-tabbar>
</template>



<script>
import { Tabbar, TabItem } from 'mint-ui';
export default {
  props: {
    selected: null
  },
  data () {
    return {
        select: 1
    }
  },
  // watch: {
  //   //   selected:function (val,oldval) {
  //   //       this.select = val;
  //   //   }
  // },
  watch: {
    //   $route:{
    //       handler(val,old){
    //           // console.log(val,old)
    //           this.select = val.meta.select
    //       }
    //   }
  },
  methods:{
      jump(url){
          this.$router.push(url);
      }

      
  },
  mounted(){

  }
}
</script>

