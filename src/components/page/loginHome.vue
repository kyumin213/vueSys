<template>
	<div>
		<div class="mt20 mb20"><span class="tabsTxt">首页</span></div>
		<div class="userBox">
			<div class="panLeft">
				<img src="../../assets/image/headImg.jpg" alt="" class="headImg" />
			</div>
			<div class="bg-purple panRight">
				<div class="userMsg">
					<span>您好</span>
					<span>{{homeData.userName}}</span>
					<span class="level">普通会员lve1</span>
				</div>
				<div>
					<span>账户余额:￥<span class="money">{{homeData.balance}}</span></span>
					<el-button class="el-button ml30" type="primary" size="medium" @click='recharge'>充值</el-button>
					<el-button class="el-button cashWish" type="success" @click="cashMoney" size="medium">提现</el-button>
				</div>
			</div>
		</div>
		<el-row :gutter="20">
			<el-col :span="6" :xs="24">
				<div class="grid-content bg-purple taskBox">
					<div class="items items1" style="width: 100%">
						<div style="width: 40%;">
							<i class="el-icon-goods icons" style="color: #fff;"></i>
						</div>
						<div style="width: 60%;">
							<div class="count">{{userSmmary.totalTasks}}</div>
							<div class="col fz">总任务</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="6" :xs="24">
				<div class="grid-content bg-purple taskBox">
					<div class="items items2" style="width: 100%">
						<div style="width: 40%;">
							<i class="el-icon-pie-chart icons" style="color: #fff;"></i>
						</div>
						<div style="width: 60%;">
							<div class="count">{{userSmmary.ongoingTasks}}</div>
							<div class="col fz">进行中的任务</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="6" :xs="24">
				<div class="grid-content bg-purple taskBox">
					<div class="items items3" style="width: 100%">
						<div style="width: 40%;">
							<i class="el-icon-time icons" style="color: #fff;"></i>
						</div>
						<div style="width: 60%;">
							<div class="count">{{userSmmary.doneTasks}}</div>
							<div class="col fz">已完成的任务</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="6" :xs="24">
				<div class="grid-content bg-purple taskBox">
					<div class="items items4" style="width: 100%">
						<div style="width: 40%;">
							<i class="el-icon-warning-outline icons" style="color: #fff;"></i>
						</div>
						<div style="width: 60%;">
							<div class="count">{{userSmmary.weirdTasks}}</div>
							<div class="col fz">异常任务</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-carousel :interval="5000" arrow="always" :autoplay="false">
			<el-carousel-item>
				<div class="taskTypes">
					<h3 class="fz16 typeName">亚马逊任务</h3>
					<span class="fz16 moreTxt" @click="moreTask">更多任务</span>
				</div>
				<div class="taskBoxIndex">
					<el-row>
						<el-col :span='6' :xs="24" v-for="(item,index) in homeData.tasksItems" :key="index" v-if="item.platformId==1">
							<div class="taskItem">
								<div class="flex2 mt50">
									<i class="el-icon-magic-stick fz120 icon1" v-show='item.taskId==1&& item.platformId==1'></i>
									<i class="el-icon-shopping-cart-full fz120 icon2" v-show='item.taskId==2&& item.platformId==1'></i>
									<i class="el-icon-star-off fz120 icon3" v-show='item.taskId==3&& item.platformId==1'></i>
									<i class="el-icon-apple fz120 icon4" v-show='item.taskId==4&& item.platformId==1'></i>
								</div>
								<div class="flex2">
									<div class="mb5"><span class="mr5 taskPrice">亚马逊{{item.TaskName}}任务</span></div>
									<div class="mb20">
										<span class="fw titleNames mr5">￥{{item.minprice}}</span><span>起</span>
									</div>
									<div class="indexTaskDes">
										{{item.descriptoin}}
									</div>
								</div>
								<div class="flex1 mt50">
									<div>
										<el-button type="primary" round @click="fbaTask(index)" v-show='item.taskId==1&& item.platformId==1'>立即购买</el-button>
										<el-button type="success" round @click="buyCarTask(index)" v-show='item.taskId==2&& item.platformId==1'>立即购买</el-button>
										<el-button type="danger" round @click="wishTask(index)" v-show='item.taskId==3&& item.platformId==1'>立即购买</el-button>
										<el-button type="warning" round @click="likesTask(index)" v-show='item.taskId==4&& item.platformId==1'>立即购买</el-button>
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-carousel-item>
			<el-carousel-item>
				<div class="taskTypes">
					<h3 class="fz16 typeName">速卖通任务</h3>
					<span class="fz16 moreTxt" @click="moreTask">更多任务</span>
				</div>
				<div class="taskBoxIndex">
					<el-row>
						<el-col :span='6' :xs="24" v-for="(item,index) in homeData.tasksItems" :key="item.index" v-if="item.platformId==2">
							<div class="taskItem">
								<div class="flex2 mt50">
									<i class="el-icon-magic-stick fz120 icon1" v-show='item.taskId==1&& item.platformId==2'></i>
									<i class="el-icon-shopping-cart-full fz120 icon2" v-show='item.taskId==2&& item.platformId==2'></i>
									<i class="el-icon-star-off fz120 icon3" v-show='item.taskId==3&& item.platformId==2'></i>
									<i class="el-icon-apple fz120 icon4" v-show='item.taskId==4&& item.platformId==2'></i>
								</div>
								<div class="flex2">
									<div class="mb5"><span class="mr5 taskPrice">亚马逊{{item.TaskName}}任务</span></div>
									<div class="mb20">
										<span class="fw titleNames mr5">￥{{item.minprice}}</span><span>起</span>
									</div>
									<div class="indexTaskDes">
										{{item.descriptoin}}
									</div>
								</div>
								<div class="flex1 mt50">
									<div>
										<el-button type="primary" round @click="fbaTask" v-show='item.taskId==1&& item.platformId==2'>立即购买</el-button>
										<el-button type="success" round @click="buyCarTask" v-show='item.taskId==2&& item.platformId==2'>立即购买</el-button>
										<el-button type="danger" round @click="wishTask" v-show='item.taskId==3&& item.platformId==2'>立即购买</el-button>
										<el-button type="warning" round @click="likesTask" v-show='item.taskId==4&& item.platformId==2'>立即购买</el-button>
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-carousel-item>
		</el-carousel>
		<!--提示-->
		<div class="errTip">
			<el-dialog title="提示" :visible.sync="errorModel" width="30%" center>
				<span>您有<span class="fz16 redRequired">{{userSmmary.weirdTasks}}</span>条异常信息，请前往处理！</span>
				<span slot="footer" class="dialog-footer">
               <el-button type="primary" @click="toErrorList">确 定</el-button>
                </span>
			</el-dialog>
		</div>
		<!--充值-->
		<el-dialog title='充值' :visible.sync='RechargeModal' :close-on-click-modal='false'>
			<el-form :model='rechargeForm' ref='rechargeForm' class="form-item" :rules='rechargeRules' :inline="true" label-width="80px" status-icon>
				<el-row>
					<el-col>
						<el-form-item label='充值金额'>
							<el-radio-group v-model="rechargeForm.money">
								<el-radio-button label="100"></el-radio-button>
								<el-radio-button label="300"></el-radio-button>
								<el-radio-button label="500"></el-radio-button>
								<el-radio-button label="800"></el-radio-button>
								<el-radio-button label="1000"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label='自定义' prop='money'>
							<el-input v-model='rechargeForm.money'>
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='付款方式'>
					<el-radio-group v-model="rechargeForm.payType">
						<el-radio label="1">支付宝</el-radio>
						<!--<el-radio label="2">微信</el-radio>-->
						<el-radio label="3">银行卡</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot='footer' class="dialog-footer">
				<el-button type='primary' @click="comfirPay('rechargeForm')">确认</el-button>
				<el-button @click='RechargeModal=false'>取消</el-button>
			</div>
		</el-dialog>
		<!--支付宝付款-->
		<el-dialog title="支付宝" :visible.sync="AlipayPaymentModal">
			<div class="txtCenter">
				<img class="alipayImg" src="../../assets/image/alipay.jpg" />
				<div class="mt20 colred fz20">充值到账，请联系客服</div>
			</div>
		</el-dialog>
		<!--银行卡付款-->
		<el-dialog title="银行卡" :visible.sync="bankPayModal" :close-on-click-modal="false" :before-close="closeModel">
			<p>请打款至以下指定账户</p>
			<div class="accountCon">
				<p>
					<span>户名：</span><span>{{bankPayForm.accountName}}</span>
				</p>
				<p>
					<span>银行名称：</span>
					<span>{{bankPayForm.openBank}}</span>
				</p>
				<p>
					<span>银行账号：</span>
					<span>{{bankPayForm.accountNumber}}</span>
				</p>
				<p>
					<span>识别码：</span>
					<span>{{bankPayForm.IdentificationCode}}</span>
					<span class="colred fz18">(请将识别码填写在转账备注信息内)</span>
				</p>
			</div>
			<div>到账时间一般为1-5个工作日,请留意账户余额变化.如有疑问请向客服咨询.</div>
			<span slot='footer' class="dialog-footer">
				<el-button @click="closeModel">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import bus from '../common/bus'
	import vali from '../common/validate'
	export default {
		name: 'loginHome',
		data() {
			return {
				platformId:0,
				item: '1',
				RechargeModal: false, //充值
				errorModel: false,
				collapse: false,
				AlipayPaymentModal: false, //支付宝支付
				bankPayModal: false, //银行卡支付
				errorNum: '0',
				// hashBd: false,
				name: sessionStorage.getItem('userName'),
				times: sessionStorage.getItem('times'),
				homeData: [],
				userSmmary: [],
				tasksItems: [],
				rechargeForm: {
					money: '',
					payType: '1'
				},
				//银行卡信息
				bankPayForm: {
					accountName: '',
					openBank: '',
					accountNumber: '',
					IdentificationCode: ''
				},
				rechargeRules: {
					money: [{
							validator: vali.proPrice,
							trigger: 'change'
						},
						{
							required: false,
							trigger: 'change'
						}
					]
				},
				postJson: {}

			}
		},
		created() {
			bus.$on('collapse', msg => {
				this.collapse = msg
			})
			// this.getSrc()
			this.isError()
			this.getHome()
		},
		computed: {
			role() {
				return this.name === 'admin' ? '超级管理员' : '普通用户'
			}

		},
		methods: {
			//首页数据加载
			getHome() {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid')
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontConsoleHome', param).then((res) => {
					if(res.data.status == 200) {
						_this.homeData = res.data.data
						_this.userSmmary = res.data.data.userSmmary
						_this.tasksItems = res.data.data.tasksItems
						sessionStorage.setItem('userId', res.data.data.userid)
						sessionStorage.setItem('balance', res.data.data.balance)
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						_this.$router.push({
							name: 'index',
							params: {
								indexShow: false
							}
						})
						sessionStorage.clear()
					}
				})
			},
			//充值
			recharge() {
				let _this = this
				_this.RechargeModal = true
			},
			isError() {
				let _this = this
				let err = _this.userSmmary.weirdTasks
				if(err > 0) {
					_this.errorModel = true
				}
			},
			//充值确定
			comfirPay(formName) {
				let _this = this
				let types = _this.rechargeForm.payType
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					Amount: _this.rechargeForm.money,
					paymethod: _this.rechargeForm.payType
				}
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doTopUp', param).then((res) => {
							if(res.data.status == '200') {
								let rechargeForm = {
									money: '',
									payType: '1'
								}
								if(types === '1') {
									_this.AlipayPaymentModal = true
									_this.RechargeModal = false
								} else if(types === '3') {
									_this.bankPayModal = true
									_this.RechargeModal = false
								}
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录'
								})
								_this.$router.push({
									name: 'index',
									params: {
										indexShow: false
									}
								})
								sessionStorage.clear()
							} else {
								_this.$message({
									type: 'error',
									message: res.data.message
								})
							}
						})
					}
				})
			},
			//关闭银行卡充值弹窗
			closeModel() {
				let _this = this
				_this.bankPayModal = false
			},
			// 前往异常订单
			toErrorList() {
				this.$router.push({
					name: 'taskManage',
					params: {
						active: 7
					}
				})
			},
			// 更多任务
			moreTask() {
				let _this = this
				let status = true
				_this.$router.push({
					name: "taskManage",
					params: {
						taskTypeModel: true
					}
				})
			},
			// FBA任务
			fbaTask(index) {
				let _this = this
				_this.$router.push('/FbaTask')
				sessionStorage.setItem('platformId',_this.tasksItems[index].platformId)
				sessionStorage.setItem('Platform',_this.tasksItems[index].platform)
				sessionStorage.setItem('baseTaskId',_this.tasksItems[index].taskId)
				sessionStorage.setItem('baseTaskType',_this.tasksItems[index].tasktype)
			},
			// 心愿任务
			wishTask(index) {
				let _this = this
				_this.$router.push({
					name: 'wishTask'
				})
				sessionStorage.setItem('platformId',_this.tasksItems[index].platformId)
				sessionStorage.setItem('Platform',_this.tasksItems[index].platform)
				sessionStorage.setItem('baseTaskId',_this.tasksItems[index].taskId)
				sessionStorage.setItem('baseTaskType',_this.tasksItems[index].tasktype)
			},
			//购物车任务
			buyCarTask(index) {
				let _this = this
				_this.$router.push('/buyCarTask')
				sessionStorage.setItem('platformId',_this.tasksItems[index].platformId)
				sessionStorage.setItem('Platform',_this.tasksItems[index].platform)
				sessionStorage.setItem('baseTaskId',_this.tasksItems[index].taskId)
				sessionStorage.setItem('baseTaskType',_this.tasksItems[index].tasktype)
			},
			//点赞任务
			likesTask(index) {
				let _this = this
				_this.$router.push('/likesTask')
				sessionStorage.setItem('platformId',_this.tasksItems[index].platformId)
				sessionStorage.setItem('Platform',_this.tasksItems[index].platform)
				sessionStorage.setItem('baseTaskId',_this.tasksItems[index].taskId)
				sessionStorage.setItem('baseTaskType',_this.tasksItems[index].tasktype)
			},
			// 提现
			cashMoney() {
				this.$router.push('/CashWithdrawal')
			},
			getSrc() {
				let _this = this
				if(_this.name === 'admin') {
					_this.hashBd = true
				} else {
					_this.hashBd = false
				}
			}
		}
	}
</script>

<style scoped>
	.accountCon {
		width: 85%;
		margin: 20px auto;
		padding: 20px;
		box-sizing: border-box;
		background: #eee;
	}
	
	.accountCon p {
		line-height: 40px;
	}
	
	.alipayImg {
		width: 350px;
	}
	
	.colred {
		color: #f00;
	}
	
	.el-row {
		margin-bottom: 20px;
	}
	
	.todo-item {
		font-size: 14px;
	}
	
	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}
	
	.isRed {
		display: inline-block;
		height: 100px;
		width: 100%;
		color: red;
	}
</style>