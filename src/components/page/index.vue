<template>
	<div>
		<div v-show="!indexShow">
			<div class="loginBox">
				<div class="navCon">
					<div class="navHead">
						<div class="navImg login">
							<div class="imgBox" @click='checkIndex'>
								<img src="../../assets/image/logo.png" class="img-log" />
							</div>
						</div>
						<div class="navRightBox loginRi">
							<el-menu background-color="#2F4056" text-color="#fff" active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" unique-opened router>
								<el-menu-item class="loginIn"><i class="el-icon-user"></i>登录
								</el-menu-item>
								<el-menu-item class="loginOut"><i class="el-icon-s-custom"></i>注册
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
							<div v-show='switchTab!=3'>
								<el-button size='small' :class="active === 2?'activeThis':''" @click='usePhone'>通过手机找回</el-button>
							</div>
							<el-form :model="forgetPhone" ref="forgetPhone" :rules='rules' class='mt20' status-icon v-show='active==2'>

								<el-form-item class="loginItem" prop='PhoneNumber'>
									<el-input placeholder="请输入手机号" v-model="forgetPhone.PhoneNumber">
										<template slot="prepend">手机号</template>
									</el-input>
								</el-form-item>
<!-- 								<el-row>
									<el-col :span='8' :xs='24'>
										<el-form-item class="loginItem" prop='imgsCode' :error='errorMsg'>
											<el-input v-model="forgetPhone.imgsCode" placeholder='请输入图形码' @blur="imgCodeVali(forgetPhone.imgsCode)">
												<template slot="prepend">图形码</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span='7' :xs='24' class='txtLeft'>
										<div class="identifybox">
											<div>
												<img :src="codeImg" alt="" class="avatar">
											</div>
											<el-button type='text' class="textbtn" @click="getImgCode">看不清，换一张</el-button>
										</div>
									</el-col>
								</el-row> -->
								<el-form-item class="loginItem" prop='VerificationCode' :error='phoneMsg'>
									<el-input placeholder="请输入验证码" v-model="forgetPhone.VerificationCode"  @blur="phoneCodeVali(forgetPhone.PhoneNumber,forgetPhone.VerificationCode)">
										<template slot="prepend">验证码</template>
									</el-input>
									<el-button type='primary' size='medium' :disabled="getPhonePwd" @click='forgetPhoneCode'>
										<span v-show="show">获取验证码</span>
										<span v-show='!show'>{{count}}秒</span>
									</el-button>
								</el-form-item>
								<el-form-item>
									<el-button type='primary' @click="RetrievePwdPhone('forgetPhone')">确定</el-button>
								</el-form-item>
							</el-form>
							<el-form :model='resetPwdForm' ref='resetPwdForm' :rules="setPwdRule" status-icon v-show='switchTab==3'>
								<el-form-item class="loginItem" prop="newPwd">
									<el-input v-model="resetPwdForm.newPwd" maxlength='16' type="password" autocomplete="off" placeholder='请输入新密码'>
										<template slot="prepend">新密码</template>
									</el-input>
									<span class="tipTxt">6-16位英文字母和数字组成</span>
								</el-form-item>
								<el-form-item class="loginItem" prop="comfirPwd">
									<el-input v-model="resetPwdForm.comfirPwd" maxlength='16' type="password" autocomplete="off" placeholder='请再次输入新密码'>
										<template slot="prepend">确认密码</template>
									</el-input>
								</el-form-item>
								<el-form-item>
									<el-button type='primary' @click="comfirPwdBtn('resetPwdForm')">确定</el-button>
								</el-form-item>
							</el-form>
						</el-tab-pane>
					</el-tabs>
					<el-tabs v-model="activeName" @tab-click="handleClick" v-show='!typeShow'>
						<el-tab-pane label="登录" name="first">
							<el-form :model="formLogin" ref="formLogin" :rules='rules' class="demo-ruleForm" status-icon>
								<el-form-item prop='PhoneNumber'>
									<el-row :gutter="20">
										<el-col class="loginItem mr10" :sm='24' :md='9' :lg='8' :xl="7">
											<el-input placeholder="请输入手机号" v-model="formLogin.PhoneNumber">
												<template slot="prepend">手机号</template>
											</el-input>

										</el-col>
									</el-row>
								</el-form-item>
								<el-form-item class="loginItem" prop='passwords'>
									<el-input v-model="formLogin.passwords" type='password' minlength="6" maxlength='16' placeholder='请输入密码'>
										<template slot="prepend">密码</template>
									</el-input>
								</el-form-item>
<!-- 								<el-row :gutter="20">
									<el-col :sm='24' :md='9' :lg='9' :xl="7" class='mb20'>
										<el-form-item class="loginItem mb0" prop='imgsCode' :error='errorMsg'>
											<el-input v-model="formLogin.imgsCode" placeholder='请输入图形码' @blur="imgCodeVali(formLogin.imgsCode)">
												<template slot="prepend">图形码</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :sm='24' :md='14' :lg='14' :xl="10" class='txtLeft'>
										<div class="identifybox">
											<div>
												<img :src="codeImg" alt="" class="avatar">
											</div>
											<el-button type='text' class="textbtn" @click="getImgCode">看不清，换一张</el-button>
										</div>
									</el-col>
								</el-row> -->
								<el-form-item class='mt20'>
									<el-button type="primary" @click="loginIn('formLogin')" size="medium">立即登录</el-button>
									<span class="ml30 forgetTxt" @click="forgetPwd">忘记密码</span>
								</el-form-item>
							</el-form>
						</el-tab-pane>
						<el-tab-pane label="注册" name="second">
							<el-form :model="formReg" ref="formReg" :rules="rules" class="demo-ruleForm" status-icon>
								<el-form-item prop="PhoneNumber" class="loginItem">
									<el-input v-model="formReg.PhoneNumber" placeholder='请输入手机号'>
										<template slot="prepend">手机号</template>
									</el-input>
								</el-form-item>
								<el-form-item class="loginItem" :error='phoneMsg'>
									<el-input v-model="formReg.VerificationCode" placeholder='请输入验证码' @blur="phoneCodeVali(formReg.PhoneNumber,formReg.VerificationCode)">
										<template slot="prepend">验证码</template>
									</el-input>
									<el-button type="primary" size="medium" @click='getPhoneCode' :disabled="codedisabled">
										<span v-show="show">获取验证码</span>
										<span v-show='!show'>{{count}}秒</span>
									</el-button>
								</el-form-item>
								<el-form-item prop="passwords" class="loginItem">
									<el-input v-model="formReg.passwords" minlength='6' maxlength='16' type='password' placeholder='请输入密码'>
										<template slot="prepend">密码</template>
									</el-input>
									<span class="tipTxt">6-16位英文字母和数字组成</span>
								</el-form-item>
								<el-form-item prop="confirmPassWord" class="loginItem">
									<el-input v-model="formReg.confirmPassWord" minlength='6' maxlength='16' type='password' placeholder='请确认密码'>
										<template slot="prepend">确认密码</template>
									</el-input>
								</el-form-item>
								<el-form-item class="loginItem">
									<el-input v-model="formReg.RecommendCode" placeholder='请输入推荐码'>
										<template slot="prepend">推荐码</template>
									</el-input>
								</el-form-item>
<!-- 								<el-form-item>
									<el-checkbox-group v-model="formReg.agreeService">
										<el-checkbox label="同意服务条款" class='col9' name="type"></el-checkbox>
									</el-checkbox-group>
								</el-form-item> -->
								<el-form-item>
									<el-button type="primary" @click="submitRegister('formReg')">立即注册</el-button>
								</el-form-item>
							</el-form>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="footer">
					<div>2019 © 版权所有</div>
				</div>
			</div>
		</div>
		<div class="index" v-show='indexShow'>
			<a name='index'></a>
			<div class="banner">
				<div class="headNav">
					<div class="navHeads">
						<div class="navImg login">
							<div class="imgBox">
								<img src="../../assets/image/logo.png" class="img-log" />
							</div>
						</div>
						<div class="navRightBox loginRi">
							<ul class="navBox">
								<li>
									<a href="#index">首页</a>
								</li>
								<li>
									<a href="#Solution">解决方案</a>
								</li>
								<li>
									<a href="#about">关于我们</a>
								</li>
								<li>
									<a class="loginBtn" @click="loginBtn">登录</a><span class="col">|</span>
									<a class="registerBtn" @click="register">注册</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="bannerTxt">
					<p class="col p1">Amzbuy</p>
					<p class="col p2">用amzBuy，提升亚马逊销量</p>
				</div>
			</div>
			<a name='Solution'></a>
			<div class="proType">
				<p class="txtCenter fz30">平台的特点</p>
				<p class="txtCenter fz16 txtCol mt20">诚信，安全，简单，让电商更有价值</p>
				<div class="mt50">
					<el-row>
						<el-col :span='8' :xs='24' class="txtCenter">
							<div>
								<p><i class="el-icon-setting iconFZ"></i></p>
								<p class="col6 typeItem">诚信</p>
								<p class="col9 mt20">我们是最棒的</p>
							</div>
						</el-col>
						<el-col :span='8' :xs='24' class="txtCenter">
							<div>
								<p><i class="el-icon-upload iconFZ"></i></p>
								<p class="col6 typeItem">安全</p>
								<p class="col9 mt20">我们是最可靠的</p>
							</div>
						</el-col>
						<el-col :span='8' :xs='24' class="txtCenter">
							<div>
								<p><i class="el-icon-help iconFZ"></i></p>
								<p class="col6 typeItem">简单</p>
								<p class="col9 mt20">我们是最厉害的</p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
<!-- 			<div class="taskShow">
				<p class="txtCenter fz30">平台</p>
				<p class="txtCenter col6 mt20 mb50">使用我们的产品轻松提高您的服务的性能，安全性和可靠性</p>
				<div class="widCon">
					<el-row :gutter="20">
						<el-col :span='8' :xs='24' class='txtCenter'>
							<div class="taskBor">
								<p class="fz20">FBA任务</p>
								<p class="mt20 mb20"><span class="priceTask">￥100</span><span class="colItem">起</span></p>
								<p class="br"></p>
								<div class="itemBom">
									<p class="mt30 col9 taskDes">很棒的任务，快速简单安werrqeqrretetetetertewtetete全可靠大神的都是速简单安werrqeqrretetetetertewtetete全可靠大神的都是速简单安werrqeqrretetetetertewtetete全可靠大神的都是速简单安werrqeqrretetetetertewtetete全可靠大神的都是</p>
									<div class="buyBtn">
										<el-button type='warning' round @click="loginBtn">立即购买</el-button>
									</div>
								</div>
							</div>
						</el-col>
						<el-col :span='8' :xs='24' class='txtCenter'>
							<div class="taskBor">
								<p class="fz20">加购任务</p>
								<p class="mt20 mb20"><span class="priceTask">￥100</span><span class="colItem">起</span></p>
								<p class="br"></p>
								<div class="itemBom">
									<p class="mt30 col9 taskDes">很棒的任务，快速简单安全可靠大神的都是</p>
									<div class="buyBtn">
										<el-button type='warning' round @click="loginBtn">立即购买</el-button>
									</div>
								</div>
							</div>
						</el-col>
						<el-col :span='8' :xs='24' class='txtCenter'>
							<div class="taskBor">
								<p class="fz20">点赞任务</p>
								<p class="mt20 mb20"><span class="priceTask">￥100</span><span class="colItem">起</span></p>
								<p class="br"></p>
								<div class="itemBom">
									<p class="mt30 col9 taskDes">很棒的任务，快速简单安全可靠大神的都是</p>
									<div class="buyBtn">
										<el-button type='warning' round @click="loginBtn">立即购买</el-button>
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div> -->
			<!--服务-->
			<div class="serviceBox">
				<div>
					<p class="serviceTitle txtCenter fz30">服务遍布全球</p>
					<p class="serviceDes txtCenter col9">拥有超过10年的跨境电商实战与传统行业运营经验，充分了解跨境电商卖家的需求和行业发展方向，为您的跨境之路保驾护航</p>
				</div>
				<img src="../../assets/image/map.png" alt="" />
			</div>
			<!--关于我们-->
			<div class="aboutUs">
				<a name='about'></a>
				<div class="aboutCon">
					<p class="txtCenter fz30 aboutTit">关于我们</p>
					<p class="aboutDes col9">amzBuy研发团队，拥有精湛、深厚的技术功底，具有多年电商系统开发经验，专注于数据挖掘和跨境电商云服务开发。 管理团队，是一群资深外贸老炮，拥有超过10年的跨境电商实战与传统行业运营经验，充分了解跨境电商卖家的需求和行业发展方向，为您的跨境之路保驾护航。</p>
					<img src="../../assets/image/about.jpg" class="aboutImg" alt="" />
				</div>
			</div>
			<!--联系我们-->
			<!--<div class="contactMe">
				<p class="txtCenter col fz30 contactTitle">加入我们，为您节省99%的研发投入</p>
				<div class="txtCenter mt50">
					<el-button type='warning' class='contactBtn'>立即加入</el-button>
				</div>
			</div>-->
			<footer>
				<div class='footerTit center'>
					<p class="fz20 col mb20">加入我们，为您节省99%的研发投入</p>
					<el-button type='warning' class='contactBtn'>立即加入</el-button>
				</div>
				<!--<p class="footerTit fz20 col">加入我们，为您节省99%的研发投入</p>-->
				<p class="txtCenter footerTxt">Copyright ©2019 Buy System</p>
			</footer>
		</div>

		<el-dialog title='验证码' :visible.sync='codeModal' :close-on-click-modal="false" width="30%">
			<el-form :model="formReg" ref='formReg' :rules='rules' status-icon>
				<el-form-item prop='imgsCode' :error='errorMsg'>
					<el-input v-model="formReg.imgsCode" placeholder='请输入图形码'>

					</el-input>
				</el-form-item>
			</el-form>
			<div class="identifybox">
				<div>
					<img :src="codeImg" alt="" class="avatar" @click="getImgCode">
				</div>
				<el-button @click="getImgCode" type='text' class="textbtn">看不清，换一张</el-button>
			</div>
			<div slot='footer' class="dialog-footer">
				<el-button type='primary' @click="regSendCode('formReg')">确定</el-button>
				<el-button @click='codeModal=false'>取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import vali from '../common/validate'
 import {login,register} from '@/request/api'
	export default {
		data() {
			// 邮箱
			let validateEmail = (rule, value, callback) => {
				let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
				if(reg.test(value)) {
					callback()
					this.getEmailPwd = false
					this.phoneNumber = value
				} else {
					callback(new Error('请输入正确的邮箱'))
				}
			};
			// 手机号
			let validatePhone = (rule, value, callback) => {
				const reg = /^[1][3,4,5,7,8][0-9]{9}$/
				if(reg.test(value)) {
					callback()
					this.codedisabled = false
					this.getPhonePwd = false
				} else {
					this.codedisabled = true
					this.getPhonePwd = true
					callback(new Error('请输入正确的手机号'))
				}
			}
			//注册密码
			let validatePass = (rule, value, callback) => {
				let _this = this
				if(value === '') {
					callback(new Error('请输入密码'))
				} else if(_this.formReg.confirmPassWord !== '') {
					_this.$refs.formReg.validateField('confirmPassWord')
				} else if(value.length >= 6) {
					callback()
				} else {
					callback(new Error('密码必须由6-16个英文字母和数字的字符串组成'))
				}
			};
			//重新设置密码
			let validatePwd = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入新密码'))
				} else if(this.resetPwdForm.comfirPwd !== '') {
					this.$refs.resetPwdForm.validateField('comfirPwd')
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
				} else if(value !== this.resetPwdForm.newPwd) {
					return callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			};
			// <!--注册二次验证密码-->
			let validatePass2 = (rule, value, callback) => {
				let _this = this
				if(value === '') {
					callback(new Error('请再次输入密码'))
				} else if(value !== _this.formReg.passwords) {
					callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			};
			//图形码
			let validateVerifycode = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入验证码'))
				} else {
					callback()
				}
			};
			return {
				errorMsg:'',//图形码是否正确
				phoneMsg:'',//手机验证码是否正确
				getEmailPwd: true, // 通过邮箱找回密码验证
				getPhonePwd: true, //通过手机找回密码验证
				codedisabled: true, //获取验证码按钮
				codeModal: false, //图形码弹窗
				codeImg: '',
				indexShow: true,
				active: 1,
				forgetType: 'second',
				activeName: 'first',
				typeShow: false,
				switchTab: 1,
				imgcodeTxt: '', //返回的验证码
				formReg: {
					PhoneNumber: '',
					passwords: '',
					confirmPassWord: '',
					imgsCode: '',
					VerificationCode: '',
					RecommendCode: null		,
          },
				formLogin: {
					PhoneNumber: '',
					passwords: '',
					imgsCode: ''
				},
				forgetEmail: {
					email: null,
					imgsCode: '',
					VerificationCode: ''
				},
				forgetPhone: {
					PhoneNumber: null,
					imgsCode: '',
					VerificationCode: ''
				},
				//设置新密码
				resetPwdForm: {
					newPwd: '',
					comfirPwd: ''
				},
				rules: {
					email: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur'
						},
						{
							validator: validateEmail,
							trigger: ['blur', 'change']
						}
					],
					PhoneNumber: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: validatePhone,
							trigger: 'blur'
						}
					],
					name: [{
						required: true,
						message: '请输入昵称',
						trigger: 'change'
					}],
					passwords: [{
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
						trigger: 'blur',
						validator: validateVerifycode
					}],
					imgsCode: [{
						required: true,
						trigger: 'blur',
						validator: validateVerifycode
					}],
					VerificationCode: [{
						required: true,
						message: '请输入手机验证码',
						trigger: 'change'
					}]
				},
				setPwdRule: {
					newPwd: [{
							required: true,
							trigger: "change",
							message: '请输入新密码'
						},
						{
							pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$',
							message: '密码必须由6-16个英文字母和数字的字符串组成',
							trigger: 'change'
						}
					],
					comfirPwd: [{
						validator: validatePwd2,
						trigger: 'blur'
					}]
				},
				timer: null,
				count: '',
				show: true,
				imgCode: 0
			}
		},
		created() {
			let _this = this
			// this.getImgCode()
			let indexShow = this.$route.params.indexShow
			if(indexShow === undefined){
			_this.indexShow = true
			}else{
				_this.indexShow = false
			}
		},
		methods: {
			//手机验证码验证
			phoneCodeVali(phonenumber,phoneCode){
				let _this = this
				_this.phoneMsg = ''
				let sessionid = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionid,
					phonenumber:phonenumber,
					PhoneCode: phoneCode
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/phoneCodeValidation', param).then((res) => {
					if(res.data.status == 500) {
						_this.getImgCode()
						_this.phoneMsg = res.data.message
					}
				})
			},
			//验证图形验证码
			imgCodeVali(codes) {
				let _this = this
				_this.errorMsg = ''
				let sessionid = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionid,
					ImageCode: codes
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/imageCodeValidation', param).then((res) => {
					if(res.data.status == 500) {
						_this.getImgCode()
						_this.errorMsg = res.data.message
					}
				})
			},

			//图形验证码
			getImgCode() {
				let _this = this
				_this.errorMes=''
				let param = {
					SessionId: sessionStorage.getItem('sessionid')
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/imageCode', param).then((res) => {
					if(res.data.status == '200') {
						_this.codeImg = 'data:image/png;base64,' + res.data.data.imagedata
						let sessionid = res.data.data.sessionid
						sessionStorage.setItem('sessionid', sessionid)
						_this.imgcodeTxt = res.data.data.imagecode
					}
				})
			},
			//注册获取手机验证码方法
			getPhoneCodeApi() {
				let _this = this
				const TIME_COUNT = 60
				let sessionId = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionId,
					phonenumber: _this.formReg.PhoneNumber
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
					} else {
						_this.$message({
							message: res.data.message,
							type: 'error'
						})
					}
				})
			},
			//注册获取手机验证码确定
			regSendCode(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						this.getPhoneCodeApi()
					} else {
						return false
					}
				})
			},
			//获取手机验证码
			getPhoneCode() {
				let _this = this
				_this.getImgCode()
				_this.codeModal = true
			},
			//手机找回密码获取验证码
			forgetPhoneCode() {
				let _this = this
				const TIME_COUNT = 60
				let sessionId = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionId,
					phonenumber: _this.forgetPhone.PhoneNumber
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/phoneCode', param).then((res) => {
					console.log(res.data.message)
					if(res.data.status == '200') {
						_this.$message({
							message: res.data.message,
							type: 'success'
						})
						if(!_this.timer) {
							_this.count = TIME_COUNT;
							_this.show = false;
							_this.timer = setInterval(() => {
								if(_this.count > 0 && _this.count <= TIME_COUNT) {
									_this.count--;
								} else {
									_this.show = true;
									_this.codedisabled = false
									clearInterval(_this.timer); // 清除定时器
									_this.timer = null;
								}
							}, 1000)
						}
					} else {
						_this.$message({
							message: res.data.message,
							type: 'error'
						})
					}
				})
			},
			//手机设置新密码
			RetrievePwdPhone(formName) {
				let _this = this
				let sessionId = sessionStorage.getItem('sessionid')
				let param = {
					SessionId: sessionId,
					resetoption: 0,
					PhoneEmail: _this.forgetPhone.PhoneNumber,
					imagecode: _this.forgetPhone.imgsCode,
					validationcode: _this.forgetPhone.VerificationCode
				}
				_this.$refs[formName].validate((vali) => {
					if(vali) {
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/passRetrieve', param).then((res) => {
							if(res.data.status == '200') {
								_this.active = 3
								_this.switchTab = 3
							} else {
								_this.$message({
									message: res.data.message,
									type: 'error'
								})
							}
						}).catch(error => {
							console.log(error)
						})
					} else {
						return false
					}
				})

			},
			//邮箱找回密码
			resetPwdEmail() {
				let _this = this
				_this.active = 3
				_this.switchTab = 3
			},
			//切换首页
			checkIndex() {
				let _this = this
				_this.indexShow = true
			},
			//登录
			loginBtn() {
				let _this = this
				_this.indexShow = false
				_this.activeName = 'first'
			},
			//注册
			register() {
				let _this = this
				_this.indexShow = false
				_this.activeName = 'second'
			},
			//登录
			loginShow() {
				let _this = this
				_this.typeShow = true
				console.log(12)
			},
			//使用邮箱找回密码
			useEmail() {
				let _this = this
				_this.getImgCode()
				_this.active = 1
				_this.errorMsg = ''
			},
			//使用手机找回密码
			usePhone() {
				let _this = this
				_this.getImgCode()
				_this.active = 2
				_this.errorMsg = ''
			},
			//忘记密码
			forgetPwd() {
				let _this = this
				_this.typeShow = true
				_this.forgetType = 'second'
				_this.getImgCode()
			},
			//重新设置密码确定
			comfirPwdBtn(formName) {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PhoneNumber: _this.forgetPhone.PhoneNumber,
					emial: _this.forgetEmail.email,
					password: _this.resetPwdForm.newPwd
				}
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doPassReset', param).then((res) => {
							if(res.data.status == '200') {
								_this.$message({
									message: res.data.message,
									type: 'success'
								})
								_this.typeShow = false
								_this.active = 1
								_this.switchTab = 1
								_this.activeName = 'first'
								_this.getImgCode()
							} else {
								_this.$message({
									message: res.data.message,
									type: 'error'
								})
							}
						})

					} else {
						console.log('error submit!!');
						return false
					}
				})
			},
			//登陆后加载数据
			getHome(){
				let _this = this
				let param = {
					SessionId:sessionStorage.getItem('sessionid')
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontConsoleHome', param).then((res) => {
					if(res.data.status == 200) {
						sessionStorage.setItem('userName',res.data.data.userName)
					}
				})
			},
			// 登录
			loginIn(formName) {
				let _this = this
				let param = {
					Phone: _this.formLogin.PhoneNumber,
					Password: _this.formLogin.passwords,
				}
								// sessionStorage.setItem('token','23425252')
								// _this.$router.push('/loginHome')
				_this.$refs[formName].validate((valid) => {
					if(valid) {
            login(param).then((res)=>{
              if(res.data.Code === 'ok') {
              	_this.$message({
              		message: res.data.Msg,
              		type: 'success'
              	})
              	let types = res.data.Data
                let datas = types.split(',')
              	sessionStorage.setItem('userName',datas[1])
              	sessionStorage.setItem('userId',datas[0])
              	_this.$router.push('/')
              } else {
              	_this.$message({
              		message: res.data.message,
              		type: 'error'
              	})
              	// _this.getImgCode()
              }
            }).catch((err)=>{
              console.log(error)
            })

					} else {
						// _this.getImgCode()
						return false

					}
				})
			},
			//注册
			submitRegister(formName) {
				let _this = this
				let param = {
					Phone: _this.formReg.PhoneNumber,
					Password: _this.formReg.passwords,
					// phonecode: _this.formReg.VerificationCode,
					Code: _this.formReg.RecommendCode
				}
				_this.$refs[formName].validate((valid) => {
					if(valid) {
            register(param).then((res)=>{
              if(res.data.Code === 'ok') {
              	_this.$message({
              		message: res.data.Msg,
              		type: 'success'
              	})
              	_this.activeName = 'first'
              	// _this.getImgCode()

              } else {
              	_this.$message({
              		message: res.data.Msg,
              		type: 'error'
              	})
              }
            }).catch((error) => {
							console.log(error)
						})
					} else {
						// _this.getImgCode()
						return false
					}
				})
			},
			// 子组件选中的
			showMessageFromChild(data) {
				let _this = this
				_this.indexShow = data
				_this.tabCheck = 'second'
			},
			handleClick(tab, event) {
				this.getImgCode()
			},
			//忘记密码tab切换
			forgetClick(tab, event) {
				let _this = this
				_this.getImgCode()
				if(tab.index == '0') {
					_this.typeShow = false
				} else {
					_this.typeShow = true
				}
			}
		}
	}
</script>

<style scoped>
	.identifybox {
		display: flex;
		justify-content: space-between;
		width: 120px;
	}

	.iconstyle {
		color: #409EFF;
	}

	.headNav {
		width: 100%;
		height: 60px;
		background: #0099F0;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
	}

	.nav li {
		display: inline-block;
		width: 100px;
		height: 60px;
		line-height: 60px;
	}

	.navHeads {
		/*width: 80%;*/
		display: flex;
		align-items: center;
		background: transparent;
		justify-content: space-between;
		/*padding-top: 20px;*/
		width: 65%;
		margin: 0 auto;
	}

	.navHeads .navBox {
		text-align: right;
	}

	.navHeads .navBox li {
		display: inline-block;
	}

	.navHeads .navBox li a {
		display: inline-block;
		color: #fff;
		width: 120px;
		font-size: 16px;
		height: 60px;
		line-height: 60px;
		cursor: pointer;
		text-align: center;
	}

	.navHeads .navBox a:hover {
		color: rgb(254, 203, 69);
	}

	.navHeads .navRightBox {
		width: 100%;
	}

	.navHeads .navBox .loginBtn,
	.navHeads .navBox .registerBtn {
		display: inline-block;
		width: 60px;
		text-align: center;
	}

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

	.forgetTxt:hover {
		color: #0099F0;
	}

	.activeThis {
		color: #FFF;
		background-color: #409EFF;
		border-color: #409EFF;
	}
</style>
