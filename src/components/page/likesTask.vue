<template>
	<div>
		<el-form :model="likesForm" ref="likesForm" class="demo-ruleForm">
			<el-row>
				<el-form-item label="终端平台">
					<el-radio-group v-model="likesForm.DeviceType ">
						<el-radio label="1">PC</el-radio>
						<el-radio label="2">Android</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="6">
					<span>链接地址</span>
				</el-col>
				<el-col :span="8" class="center">
					<span>选项操作</span>
				</el-col>
				<el-col :span="4" class="center">
					<span>数量</span>
				</el-col>
				<el-col :span="2" class="center">
					<span>服务费</span>
				</el-col>
			</el-row>
			<div v-for="(item,index) in likesForm.OrderSchedule" :key="index" class="mt30">
				<el-row>
					<el-col :span="6" :xs="24">
						<el-form-item :prop="`OrderSchedule[${index}].linkURL`" :rules="[{required: true, message: '链接不能为空', trigger: 'blur'},{pattern:  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, message: '请以http://或https://开头', trigger: 'change'}]">
							<el-input type="textarea" v-model="item.linkURL" placeholder="请以http://或https://开头"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24" class="center mb20">
						<el-radio-group v-model="item.ActionType" style="line-height: 40px;">
							<el-radio label="1">点赞</el-radio>
							<el-radio label="2">点踩</el-radio>
							<el-radio label="3">Report Abuse</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item :prop="`OrderSchedule[${index}].Number`" :rules="[{required: true, message: '数量不能为空', trigger: 'blur'},{pattern:  /^\+?[1-9][0-9]*$/, message: '数量不能小于0', trigger: 'change'}]">
							<el-input v-model="item.Number" @change="checkService(index)"></el-input>
						</el-form-item>

					</el-col>
					<el-col :span="2" :xs="24" class="center">
						<p class="servTxt" style="line-height: 40px;">{{item.fee}}</p>
					</el-col>
					<el-col :span="4" :xs="24" class="center">
						<el-button type="danger" @click="removeLike(item,index)" :disabled="disabled2">删除</el-button>
					</el-col>
				</el-row>
			</div>
			<el-row class="mt20">
				<el-button @click="addLikes"><i class="el-icon-circle-plus-outline"></i>新增点赞任务</el-button>
			</el-row>
			<el-form-item label="合计结算" class="mt30">
				<span class="fz20 colTxt">￥{{likesForm.OrderTotal}}</span>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="confirLikeForm('likesForm')">确定</el-button>
				<el-button @click="back">返回</el-button>
			</el-form-item>
		</el-form>
		<el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose" center>
			<el-form :model="paymentForm" class="demo-ruleForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="当前余额">
							<span class="tipRed">￥{{paymentForm.balance}}</span>
						</el-form-item>
						<div>
							<el-form-item label="待付款金额">
								<span class="tipRed">￥{{paymentForm.payMoney}}</span>
							</el-form-item>
						</div>
						<el-button type='warning' v-if='parseInt(this.paymentForm.payMoney)>parseInt(this.paymentForm.balance)' @click='toRecharge'>去充值</el-button>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click='paymentOrder' v-if='parseInt(this.paymentForm.payMoney)<parseInt(this.paymentForm.balance) && this.hasBalance==0'>确定</el-button>
				<el-button @click="paymentClose">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'likesTask',
		data() {
			return {
				paymentModel: false,
				disabled2: true,
				likesForm: {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderSchedule: [{
						fee: 10,
						linkURL: '',
						ActionType: '1',
						Number: 0
					}],
					LikeFee: 10,
					OrderTotal: 0,
					DeviceType: '1',
					PlatformId: 1,
					Platform: '',
					baseTaskId: 4,
					baseTaskType: 4,
					Country: '', //国家
					ASIN: '', //产品ASIN
					ShopName: '', //店铺名称
					ProductName: '', //产品名称
					Price: 0, //价格
					Currency: '', //货币符号
					Comments: 0, //评论数
					StarScore: 0, //评分
					ProductURL: '', //产品链接
					PredictSales: 0, //预估月销量
					ProductImage: '', //产品图片
					ProductRank: 0, //品类排名
					KeywordType: 1, //关键词类型
					Keyword: '', //搜索关键词
					OrderNum: 0, //代购数量
					ServiceType: 0, //留评类型
					Facebook: 0, //feedback数量
					PicNum: 0, //评论图片数量
					VideoNum: 0, //评论视频数量
					Coupon: 0, //是否使用优惠券
					SelfShip: 1, //是否自发货
					ProductTotal: 0, //产品总价
					ServiceFee: 0, //服务费
					LinkURL: '', //链接
					Memo: ''
				},
				paymentForm: {
					balance: 0,
					payMoney: 0,
				}
			}
		},
		created() {
			this.intoNewTask()
			this.getPlam()
		},
		methods: {
			//获取平台名称
			getPlam() {
				let _this = this
				_this.likesForm.Platform = sessionStorage.getItem('Platform')
				_this.likesForm.PlatformId = sessionStorage.getItem('platformId')
			},
			// 付款关闭页面
			paymentClose() {
				let _this = this
				_this.paymentModel = false
				_this.$router.push('/taskManage')
			},
			// 新增一行点赞任务
			addLikes() {
				let _this = this
				_this.likesForm.OrderSchedule.push({
					fee: 10,
					linkURL: '',
					ActionType: '1',
					Number: ''
				})
				let len = _this.likesForm.OrderSchedule.length
				_this.likesForm.OrderTotal = len * _this.likesForm.OrderSchedule[0].fee
				if(len > 1) {
					_this.disabled2 = false
				}
			},
			// 删除一行点赞
			removeLike(item, index) {
				let _this = this
				_this.index = _this.likesForm.OrderSchedule.indexOf(item)
				let len = _this.likesForm.OrderSchedule.length
				if(index !== -1) {
					_this.likesForm.OrderSchedule.splice(index, 1)
				}
				let newLen = _this.likesForm.OrderSchedule.length
				_this.likesForm.OrderTotal = newLen * _this.likesForm.OrderSchedule[0].fee
				if(len <= 1) {
					_this.disabled2 = true
				}
			},
			// 点赞任务提交
			confirLikeForm(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						let param = Object.assign({}, _this.likesForm)
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.paymentModel = true
								_this.likesModel = false
								_this.$refs['likesForm'].resetFields()
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
						})

					} else {
						return false

					}
				})
			},
			// 返回
			back() {
				let _this = this
				_this.$router.push('/loginHome')
			},
			//进入新任务页面
			intoNewTask() {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: sessionStorage.getItem('platformId'),
					Platform: sessionStorage.getItem('Platform'),
					baseTaskId: sessionStorage.getItem('baseTaskId'),
					baseTaskType: sessionStorage.getItem('baseTaskType'),
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/newOrderTwo', param).then(res => {
					if(res.data.status == 200) {
						_this.countryData = res.data.data.Country
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
				})
			},
			//点赞计算服务费
			checkService(index) {
				let _this = this
				let len = _this.likesForm.OrderSchedule
				let result = 0
				for(let i = 0; i < len.length; i++) {
					let num = len[i].Number
					let fee = len[i].fee
					result += parseInt(num)
					_this.likesForm.OrderTotal = result * fee
				}
			},
		}
	}
</script>

<style>

</style>