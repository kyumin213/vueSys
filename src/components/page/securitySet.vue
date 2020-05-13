<template>
	<div>
		<div class="mt20 mb20">
			<span>首页</span>
			<span class="fg">/</span>
			<a>账户设置</a>
			<span class="fg">/</span>
			<span>安全设置</span>
		</div>
		<el-form class="userInfo">
			<!--<el-form-item label="邮箱" class="userList">
				<el-form-item>
					<span>79434334@qq.com</span>
					<span class="tips">绑定密保邮箱后可用于找回密码~</span>
					<span class="editBtn edit1" @click="editEmailHandel"><i class="el-icon-edit"></i>修改</span>
				</el-form-item>
			</el-form-item>-->
			<el-form-item label="手机" class="userList">
				<el-form-item>
					<span>{{userPhone}}</span>
					<span class="tips">手机可用于登录系统，找回密码，请勿泄露手机信息~</span>
					<span class="editBtn edit1" @click="editPhoneHandel"><i class="el-icon-edit"></i>修改</span>
				</el-form-item>
			</el-form-item>
		</el-form>
		<!--  修改邮箱-->
		<el-dialog title="修改邮箱" :visible.sync="editEmailModel" width="30%" center :close-on-click-modal="false">
			<el-form :model="formEmail" ref="formEmail" class="demo-ruleForm">
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，变更信息前需验证身份</span>
				</el-form-item>
				<el-form-item>
					<span>794088**4@qq.com</span>
				</el-form-item>
				<el-form-item>
					<el-row>
						<el-col :span="12">
							<el-input v-model="formEmail.code" placeholder='请输入验证码'></el-input>
						</el-col>
						<el-col :span="12">
							<el-button type='primary'>获取验证码</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary" @click='newEmail'>下一步</el-button>
          <el-button @click="editEmailModel=false">取消</el-button>
        </span>
		</el-dialog>
		<!--验证新邮箱-->
		<el-dialog title="修改邮箱" :visible.sync="editNewEmailModel" width="30%" center :close-on-click-modal="false">
			<el-form :model="formNewEmail" ref="formNewEmail" class="demo-ruleForm">
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，请完成邮箱验证</span>
				</el-form-item>
				<el-form-item prop="email">
					<el-input v-model="formNewEmail.email" placeholder='请输入新邮箱'></el-input>
				</el-form-item>
				<el-form-item>
					<el-row>
						<el-col :span="14">
							<el-input v-model="formNewEmail.code" placeholder='请输入验证码'></el-input>
						</el-col>
						<el-col :span="10">
							<el-button type='primary'>获取验证码</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary">确定</el-button>
          <el-button @click="editNewEmailModel=false">取消</el-button>
        </span>
		</el-dialog>
		<!--修改手机号-->
		<el-dialog title="修改手机号" :visible.sync="editPhoneModel" width="40%" center :close-on-click-modal="false">
			<el-form :model="formPhone" ref="formPhone" class="demo-ruleForm">
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，变更信息前需验证身份</span>
				</el-form-item>
				<el-form-item>
					<span>{{userPhone}}</span>
				</el-form-item>
				<el-form-item prop='code' :error="errorMsg">
					<el-row>
						<el-col :span="12">
							<el-input v-model="formPhone.code" placeholder='请输入验证码' @blur='phoneCodeVali(userPhone,formPhone.code)'></el-input>
						</el-col>
						<el-col :span="12">
							<el-button type='primary' @click='getPhoneCode(userPhone)' :disabled='codedisabled'>
								<span v-show="show">获取验证码</span>
								<span v-show='!show'>{{count}}秒</span>
							</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary" @click='newPhone' :disabled='disabled'>下一步</el-button>
          <el-button @click="editPhoneModel=false">取消</el-button>
        </span>
		</el-dialog>
		<!--验证新手机-->
		<el-dialog title="修改手机" :visible.sync="editNewPhoneModel" width="30%" center :close-on-click-modal="false">
			<el-form :model="formNewPhone" ref="formNewPhone" :rules='rules' class="demo-ruleForm" status-icon>
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，请完成手机验证</span>
				</el-form-item>
				<el-form-item prop="phone">
					<el-input v-model="formNewPhone.phone" placeholder='请输入新手机号'></el-input>
				</el-form-item>
				<el-form-item prop='code' :error='errorMsg'>
					<el-row>
						<el-col :span="12">
							<el-input v-model="formNewPhone.code" placeholder='请输入验证码' @blur='phoneCodeVali(formNewPhone.phone,formNewPhone.code)'></el-input>
						</el-col>
						<el-col :span="12">
							<el-button type='primary' :disabled='codedisabled' @click='getNewPhoneCode(formNewPhone.phone)'>
								<span v-show="show">获取验证码</span>
								<span v-show='!show'>{{count2}}秒</span>
							</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled='disabled' @click='newPhoneComfir'>确定</el-button>
          <el-button @click="editNewPhoneModel=false">取消</el-button>
        </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'securitySet',
		data() {
			// 手机号
			let validatePhone = (rule, value, callback) => {
				const reg = /^[1][3,4,5,7,8][0-9]{9}$/
				if(reg.test(value)) {
					callback()
					console.log(value)
					this.codedisabled = false
				} else {
					this.codedisabled = true
					callback(new Error('请输入正确的手机号'))
				}
			}
			return {
				disabled: false,
				codedisabled: false,
				count: '',
				count2: '',
				show: true,
				errorMsg: '',
				editEmailModel: false,
				editPhoneModel: false,
				editNewEmailModel: false,
				editNewPhoneModel: false,
				userNames: 'kyumin',
				userPhone: '',
				userEmail: '未填写',
				formName: {
					names: ''
				},
				formEmail: {
					code: ''
				},
				formNewEmail: {
					email: '',
					code: ''
				},
				formPhone: {
					code: ''
				},
				formNewPhone: {
					phone: '',
					code: ''
				},
				rules: {
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: validatePhone,
							trigger: 'change'
						}
					],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
		},
		methods: {
			//初次加载
			
			//手机验证码验证
			phoneCodeVali(phone, code) {
				let _this = this
				_this.errorMsg = ''
				let sessionid = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionid,
					phonenumber: phone,
					PhoneCode: code
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/phoneCodeValidation', param).then((res) => {
					if(res.data.status == 500) {
						_this.errorMsg = res.data.message
						_this.disabled = true
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					} else {
						_this.disabled = false
					}
				})
			},
			//旧手机号获取手机验证码
			getPhoneCode(phone) {
				let _this = this
				const TIME_COUNT = 60
				let sessionId = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionId,
					phonenumber: phone
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/phoneCode', param).then((res) => {
					console.log(res.data.message)
					if(res.data.status == '200') {
						_this.$message({
							message: res.data.message,
							type: 'success'
						})
						_this.codeModal = false
						if(!_this.timer) {
							_this.count = TIME_COUNT;
							_this.show = false;
							_this.timer = setInterval(() => {
								if(_this.count > 0 && _this.count <= TIME_COUNT) {
									_this.count--;
									_this.codedisabled = true
								} else {
									_this.show = true;
									_this.codedisabled = false
									clearInterval(_this.timer); // 清除定时器
									_this.timer = null;
								}
							}, 1000)
						}
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					}
				})
			},
			//新手机号获取手机验证码
			getNewPhoneCode(phone) {
				let _this = this
				const TIME_COUNT = 60
				let sessionId = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionId,
					phonenumber: phone
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/phoneCode', param).then((res) => {
					console.log(res.data.message)
					if(res.data.status == '200') {
						_this.$message({
							message: res.data.message,
							type: 'success'
						})
						_this.codeModal = false
						if(!_this.timer) {
							_this.count = TIME_COUNT;
							_this.show = false;
							_this.timer = setInterval(() => {
								if(_this.count2 > 0 && _this.count2 <= TIME_COUNT) {
									_this.codedisabled = true
									_this.count2--;
								} else {
									_this.show = true;
									_this.codedisabled = false
									clearInterval(_this.timer); // 清除定时器
									_this.timer = null;
								}
							}, 1000)
						}
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					} else {
						_this.$message({
							message: res.data.message,
							type: 'error'
						})
					}
				})
			},
			//新手机验证提交
			newPhoneComfir() {
				let _this = this
				let param = {
					// SessionId: sessionStorage.getItem('sessionid'),
					id: sessionStorage.getItem('userId'),
					Phone: _this.formNewPhone.phone,
					// OldValue: _this.userPhone,
					// veriCode: _this.formNewPhone.code
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/CustomerUser/ChangePhone', param).then(res => {
					if(res.data.Code === 'ok') {
						_this.userPhone = res.data.data.phoneNumber
						_this.$message({
							type: 'success',
							message: res.data.Msg
						})
						_this.editNewPhoneModel = false
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					} else {
						_this.$message({
							type: 'error',
							message: res.data.message
						})
					}
				})
			},
			//  修改邮箱弹窗
			editEmailHandel() {
				let _this = this
				_this.editEmailModel = true
			},
			//  修改手机号
			editPhoneHandel() {
				let _this = this
				_this.editPhoneModel = true
			},
			//验证新邮箱
			newEmail() {
				let _this = this
				_this.editEmailModel = false
				_this.editNewEmailModel = true
			},
			//验证新手机
			newPhone() {
				let _this = this
				_this.editPhoneModel = false
				_this.editNewPhoneModel = true
				_this.disabled = true
				_this.codedisabled = true
			}
		}
	}
</script>

<style scoped>
	.demo-ruleForm {
		margin: 20px 50px 50px;
	}
</style>
