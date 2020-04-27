<template>
<div>
      <p>{{namee}}</p>
      <p>请求状态：{{status}}</p>
      <p>请求之后的数据：{{show}}</p>
</div>
</template>
<script>
export default {
  data(){
    return{
      namee: 'Cart1321',
      show: '',
      status: ''
    }
  },
  mounted(){
	this.fetch('/fplget', {}).then((res) => {
		console.log(res);
	})
    // axios.get("http://localhost:8081"+'/FPList')
    // .then((response)=>{ 
    //   console.log(response.data);
    //   this.status = response.status;
    //   this.show = response.data;
    // })
    // .catch((error)=> {
    //   console.log(error);
    // });
  }
}
</script>