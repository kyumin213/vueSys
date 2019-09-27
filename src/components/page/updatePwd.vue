<template>
	<div>
		<div class="mt20 mb20 tabsTxt">
			<span>首页</span>
			<span class="fg">/</span>
			<a>账户设置</a>
			<span class="fg">/</span>
			<span>修改密码</span>
		</div>
		<div class="pwdBox">
			<el-form :model="updatePwdForm" ref='updatePwdForm' label-width="80px" :rules='rules' status-icon>
				<el-row>
					<el-col :xs="24">
						<el-form-item label="旧密码" prop='oldPwd'>
							<el-input v-model="updatePwdForm.oldPwd" placeholder='请输入旧密码' type='password'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="新密码" prop='newPwd'>
					<el-input v-model="updatePwdForm.newPwd" placeholder='请输入新密码' type='password'></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop='comfirePwd'>
					<el-input v-model="updatePwdForm.comfirePwd" placeholder='请再次输入新密码' type='password'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="updatePwd('updatePwdForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'updatePwd',
		data() {
			//重新设置密码
			let validatePwd = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入新密码'))
				} else if(this.updatePwdForm.comfirePwd !== '') {
					this.$refs.updatePwdForm.validateField('comfirePwd')
				} else if(value.length >= 6) {
					callback()
				} else {
					return callback(new Error('密码必须由6-16个英文字母和数字的字符串组成'))
				}
			};
			//重新设置确认密码
			let validatePwd2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入新密码'))
				} else if(value !== this.updatePwdForm.newPwd) {
					return callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			};
			return {
				updatePwdForm: {
					oldPwd: '',
					newPwd: '',
					comfirePwd: ''
				},
				rules: {
					oldPwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/,
							message: '密码必须由6-16个英文字母和数字的字符串组成',
							trigger: 'change'
						}
					],
					newPwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/,
							message: '密码必须由6-16个英文字母和数字的字符串组成',
							trigger: 'change'
						}
					],
					comfirePwd: [{
							required: true,
							message: '请确认密码',
							trigger: 'change'
						},
						{
							validator: validatePwd2,
							trigger: 'change'
						}
					],
				}
			}
		},
		methods: {
			//确定
			updatePwd(formName) {

				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						let param = {
							SessionId: sessionStorage.getItem('sessionid'),
							userId: sessionStorage.getItem('userId'),
							KeyName: 'Password',
							KeyValue: _this.updatePwdForm.newPwd,
							OldValue: _this.updatePwdForm.oldPwd
						}
						_this.axios.post(_this.GLOBAL.BASE_URL + 'api/frontUserUpdate', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								sessionStorage.clear()
								_this.$router.push({
									name: 'index',
									params: {
										indexShow: false
									}
								})
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录'
								})
								sessionStorage.clear()
								_this.$router.push({
									name: 'index',
									params: {
										indexShow: false
									}
								})
							}
							if(res.data.status == 500) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
							}
						})
					}else{
						return false;
					}
				})

			}
		}
	}
</script>

<style scoped>

</style>