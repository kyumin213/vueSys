<template>
  <div>
    <div class="mt20 mb20 tabsTxt">
        <span>首页</span>
        <span class="fg">/</span>
        <a>账户设置</a>
        <span class="fg">/</span>
        <span>基本信息</span>
    </div>
    <el-form class="userInfo">
      <el-form-item label="姓名" class="userList">
        <el-form-item>
          <span>kyumin</span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="QQ" class="userList">
        <el-form-item>
          <span>{{userQQ}}</span>
          <span class="editBtn edit2" @click="editPwdHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="微信" class="userList">
        <el-form-item>
          <span>{{userWX}}</span>
          <span class="editBtn edit3" @click="editWxHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
    </el-form>
<!--    <div class="userInfo">-->
<!--      <div class="infoItem">-->
<!--        <span class="names">名称</span>-->
<!--        <span>{{userNames}}</span>-->
<!--        <span class="tips">设置名称后能给您提供更好的服务哦~</span>-->
<!--        <span class="editBtn edit1" @click="editHandel"><i class="el-icon-edit"></i>修改</span>-->
<!--      </div>-->
<!--      <div class="infoItem">-->
<!--        <span class="names">QQ</span>-->
<!--        <span>796544354</span>-->
<!--        <span class="editBtn edit2" @click="editPwdHandel"><i class="el-icon-edit"></i>修改</span>-->
<!--      </div>-->
<!--      <div class="infoItem">-->
<!--        <span class="names">微信</span>-->
<!--        <span>kyumin</span>-->
<!--        <span class="editBtn edit3" @click="editWxHandel"><i class="el-icon-edit"></i>修改</span>-->
<!--      </div>-->
<!--    </div>-->
<!--  修改QQ-->
    <el-dialog title="修改信息" :visible.sync="editQqModel" width="30%" center :close-on-click-modal="false">
      <el-form :model="formQq" ref="formQq" label-width='50px' :rules='rules' class="demo-ruleForm">
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="formQq.qq" placeholder='请输入新QQ'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editQQ('formQq')">确定</el-button>
          <el-button @click="editQqModel=false">取消</el-button>
        </span>
    </el-dialog>
    <!--修改微信-->
    <el-dialog title="修改信息" :visible.sync="editWxModel" width="30%" center :close-on-click-modal="false">
      <el-form :model="formWx" ref="formWx" :rules='rules' class="demo-ruleForm" label-width='50px'>
        <el-form-item prop="wx" label='微信'>
          <el-input v-model="formWx.wx" placeholder='请输入新微信'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editWX('formWx')">确定</el-button>
          <el-button @click="editWxModel=false">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data () {
    return {
      editQqModel: false,
      editWxModel: false,
      userNames: 'kyumin',
      pwds: '123434',
      userQQ:'未填写',
      userWX:'未填写',
      formQq: {
        qq: ''
      },
      formWx: {
        wx: ''
      },
      rules:{
      	qq:[{
      		required: true,
					message: '请输入QQ',
					trigger: 'blur'
      	}],
      	wx:[{
      		required: true,
					message: '请输入微信',
					trigger: 'blur'}],
}
}
},
created() {
		this.getHome()
	},
	methods: {
		//初次加载
		getHome() {
			let _this = this
			let param = {
				SessionId: sessionStorage.getItem('sessionid')
			}
			_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontConsoleHome', param).then((res) => {
				if(res.data.status == 200) {
					if(res.data.data.QQ != null) {
						_this.userQQ = res.data.data.QQ
					}
					if(res.data.data.wechat != null) {
						_this.userWX = res.data.data.wechat
					}
				}if(res.data.status==400){
						_this.$message({
							type:'error',
							message:'登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					}
			})
		},//  修改QQ弹窗
    editPwdHandel () {
      let _this = this
      _this.editQqModel = true
    },
    //  修改微信
    editWxHandel () {
      let _this = this
      _this.editWxModel = true
    },
    //修改QQ确定
    editQQ(formName){
    	let _this = this
    	let param = {
    		SessionId:sessionStorage.getItem('sessionid'),
    		userId:sessionStorage.getItem('userId'),
    		KeyName:'QQ',
    		KeyValue:_this.formQq.qq
    	}
    	_this.$refs[formName].validate((valid)=>{
    		if(valid){
    			_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontUserUpdate', param).then((res)=>{
    				if(res.status=='200'){
    					_this.userQQ = res.data.data.QQ
    					_this.$message({
    						type:'success',
    						message:res.data.message
    					})
    					_this.editQqModel = false
    				}if(res.data.status==400){
						_this.$message({
							type:'error',
							message:'登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					}
    			})
    		}
    	})
    },
    //修改微信
        editWX(formName){
    	let _this = this
    	let param = {
    		SessionId:sessionStorage.getItem('sessionid'),
    		userId:sessionStorage.getItem('userId'),
    		KeyName:'wechat',
    		KeyValue:_this.formWx.wx
    	}
    	_this.$refs[formName].validate((valid)=>{
    		if(valid){
    			_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontUserUpdate', param).then((res)=>{
    				if(res.status=='200'){
    					_this.userWX=res.data.data.wechat
    					_this.$message({
    						type:'success',
    						message:res.data.message
    					})
    					_this.editWxModel = false
    				}if(res.data.status==400){
						_this.$message({
							type:'error',
							message:'登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					}
    			})
    		}
    	})
    }
  }
}
</script>

<style scoped>
  .demo-ruleForm{
  	margin: 20px 50px 50px;
  }
  @media screen  and (max-width: 768px){
    .infoItem .names{
      font-size: 12px;
      margin-right: 10px;
    }
  }
</style>
