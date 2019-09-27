<template>
	<div class="loginBox">
		<div class="navCon">
			<div class="navHead">
				<div class="navImg login">
					<div class="imgBox" @click='changeFather'>
						<img src="../../assets/image/logo.png" class="img-log" />
					</div>
				</div>
				<div class="navRightBox loginRi">
					<el-menu :default-active="onRoutes" background-color="#2F4056" text-color="#fff" active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" unique-opened router>
						<el-menu-item index="/login" class="loginIn"><i class="el-icon-user"></i>登录
						</el-menu-item>
						<el-menu-item index="/register" class="loginOut"><i class="el-icon-s-custom"></i>注册
						</el-menu-item>
					</el-menu>
				</div>
			</div>
		</div>
		<div class="loginMain">
			<el-tabs v-model="forgetType" v-show='typeShow' @tab-click="forgetClick">
				<el-tab-pane label="登录" name="first">

				</el-tab-pane>
				<el-tab-pane label="找回密码" name="second">
					<div>
						<el-button :class="active === 1?'activeThis':''" size='small' @click="useEmail">通过邮箱找回</el-button>
						<el-button size='small' :class="active === 2?'activeThis':''" @click='usePhone'>通过手机找回</el-button>
					</div>
					<!--      <img :src="imgCode" alt="" class="avatar">-->
					<el-form :model="forgetEmail" ref="forgetEmail" class='mt20' label-width='80px' status-icon v-show='useType'>
						<el-form-item label='邮箱' class="loginItem">
							<el-input placeholder="请输入邮箱" v-model="forgetEmail.email">

							</el-input>
						</el-form-item>
						<el-form-item class="loginItem" label='图形码'>
							<el-input placeholder="请输入图形码" v-model="forgetEmail.imgCode">
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button type='primary'>确定</el-button>
						</el-form-item>
					</el-form>
					<el-form :model="forgetPhone" ref="forgetPhone" class='mt20' label-width='80px' status-icon v-show='!useType'>
						<el-form-item label='手机' class="loginItem">
							<el-input placeholder="请输入手机" v-model="forgetPhone.phone">

							</el-input>
						</el-form-item>
						<el-form-item class="loginItem" label='图形码'>
							<el-input placeholder="请输入图形码" v-model="forgetPhone.imgCode">
							</el-input>
						</el-form-item>
						<el-form-item class="loginItem" label='验证码'>
							<el-input placeholder="请输入验证码" v-model="forgetPhone.VerificationCode">
							</el-input>
							<el-button type='primary' size='medium'>获取验证码</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type='primary'>确定</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
			<el-tabs v-model="activeName" @tab-click="handleClick" v-show='!typeShow'>
				<el-tab-pane label="登录" name="first">
					<el-form :model="formLogin" ref="formLogin" label-width="80px" class="demo-ruleForm" status-icon>
						<el-form-item label="手机/邮箱">
							<el-row>
								<el-col class="loginItem" :span="8" :xs="24">
									<el-input v-model="formLogin.PhoneNumber"></el-input>
								</el-col>
								<el-col :span="14" :xs="24">
									<span class="tipTxt" style="font-size: 12px;">使用手机或者邮箱中的任意一个均可（若采用手机，请确保你的帐号已绑定过该手机）</span>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="密码" class="loginItem">
							<el-input v-model="formLogin.password"></el-input>
						</el-form-item>
						<el-form-item label="图形码" class="loginItem">
							<el-input v-model="formLogin.verification2"></el-input>
							<img :src="imgCode" alt="" class="avatar">
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="loginIn" size="medium">立即登录</el-button>
							<span class="ml30 forgetTxt" @click="forgetPwd">忘记密码</span>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="注册" name="second">
					<!--      <img :src="imgCode" alt="" class="avatar">-->
					<el-form :model="formReg" ref="formReg" :rules="rules" label-width="80px" class="demo-ruleForm" status-icon>
						<el-form-item label="手机号" prop="PhoneNumber" class="loginItem">
							<el-input v-model="formReg.PhoneNumber"></el-input>
						</el-form-item>
						<el-form-item label="图形码" prop="verification2" class="loginItem">
							<el-input v-model="formReg.verification2"></el-input>
						</el-form-item>
						<el-form-item label="验证码" prop="mobileVerification" class="loginItem">
							<el-input v-model="formReg.mobileVerification"></el-input>
							<el-button type="primary" size="medium">获取验证码</el-button>
						</el-form-item>
						<el-form-item label="昵称" prop="name" class="loginItem">
							<el-input v-model="formReg.name"></el-input>
							<span class="tipTxt">您的名字</span>
						</el-form-item>
						<el-form-item label="密码" prop="password" class="loginItem">
							<el-input v-model="formReg.password"></el-input>
							<span class="tipTxt">6-16位字符</span>
						</el-form-item>
						<el-form-item label="确认密码" prop="confirmPassWord" class="loginItem">
							<el-input v-model="formReg.confirmPassWord"></el-input>
						</el-form-item>
						<el-form-item label="推荐码" class="loginItem">
							<el-input v-model="formReg.RecommendCode"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary">立即注册</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="footer">
			<div>2019 © 版权所有</div>
		</div>
	</div>
</template>

<script>
	import vali from '../common/validate'
	export default {
		name: 'register',
		data() {
			let validatePass = (rule, value, callback) => {
				const reg = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/
				if(value === '') {
					callback(new Error('请输入密码'))
				} else if(this.formReg.confirmPassWord !== '') {
					this.$refs.formReg.validateField('confirmPassWord')
				} else if(reg.test(value)) {
					callback()
				} else {
					callback(new Error('密码必须由6-16个英文字母和数字的字符串组成'))
				}
			}
			// <!--二次验证密码-->
			let validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'))
				} else if(value !== this.formReg.password) {
					callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			}
			return {
				active: 1,
				forgetType: 'second',
				activeName: 'first',
				typeShow: false,
				useType:true,
				imgCode: '',
				formReg: {
					PhoneNumber: '',
					name: '',
					password: '',
					confirmPassWord: '',
					verification: '',
					verification2: '',
					mobileVerification: '',
					RecommendCode: ''
				},
				formLogin: {
					PhoneNumber: '',
					password: '',
					verification2: ''
				},
				forgetEmail: {
					email: '',
					imgCode: ''
				},
				forgetPhone:{
					phone:'',
					imgCode:'',
					VerificationCode:''
				},
				rules: {
					PhoneNumber: [{
							required: true,
							message: '请输入手机号',
							trigger: 'change'
						},
						{
							validator: vali.validatePhone,
							trigger: 'change'
						}
					],
					name: [{
						required: true,
						message: '请输入昵称',
						trigger: 'change'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							validator: validatePass,
							trigger: 'change'
						}
					],
					confirmPassWord: [{
							required: true,
							message: '请确认密码',
							trigger: 'change'
						},
						{
							validator: validatePass2,
							trigger: 'change'
						}
					],
					verification2: [{
						required: true,
						message: '请输入图形码',
						trigger: 'change'
					}],
					mobileVerification: [{
						required: true,
						message: '请输入手机验证码',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.getCode()
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '')
			}
		},
		methods: {
		changeFather(){
			let indexShow = true
             this.$emit("listenTochildEvent",indexShow);
          },
			//登录
			loginShow(){
				let _this = this
				_this.typeShow = true
				console.log(12)
			},
			//使用邮箱找回密码
			useEmail(){
				let _this = this
				_this.useType = true
				_this.active = 1
			},
			//使用手机找回密码
			usePhone(){
				let _this = this
				_this.useType = false
				_this.active = 2
			},
			//忘记密码
			forgetPwd() {
				let _this = this
				_this.typeShow = true
				_this.forgetType = 'second'
			},
			// 登录
			loginIn() {
				let role = 'l4ccy33k'
				sessionStorage.setItem('token', role)
				this.$router.push('/')
			},
			// 跳转登录页面
			// loginInPage () {
			//   this.$router.push('/login')
			// },
			handleClick(tab, event) {
				console.log(tab, event)
				console.log(tab.index)
			},
			//忘记密码tab切换
			forgetClick(tab,event){
				let _this = this
				console.log(tab.index)
				if(tab.index == '0'){
					_this.typeShow = false
				} else {
					_this.typeShow = true
				}
			},
			getCode() {
				let _this = this
				this.axios.get(this.GLOBAL.BASE_URL + '/api/Login/ValidateCode', {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((res) => {
					console.log(res.data)
					_this.imgCode = res.data
					let mes = res.data.message
					if(res.data.success === '200') {
						_this.imgCode = res.data
					} else if(mes === '无操作权限') {}
				}).catch((error) => {
					console.log(error)
				})
			}
		}
	}
</script>
<style scoped>
	.loginBox {
		width: 100%;
		height: 100%;
		background: #f2f2f2;
	}
	
	.loginMain {
		background: #fff;
		padding: 30px;
	}
	
	.footer {
		margin-top: 50px;
		padding: 80px 0;
		border-top: #e2e2e2 solid 1px;
		text-align: center;
	}
	
	.forgetTxt {
		cursor: pointer;
	}
	
	.activeThis {
		color: #FFF;
		background-color: #409EFF;
		border-color: #409EFF;
	}
</style>