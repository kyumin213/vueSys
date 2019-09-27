<template>
	<div>
		<el-form :model="taskForm" class="demo-ruleForm" ref="taskForm" :rules="taskRule">
			<div class="mb20">产品信息</div>
			<el-row>
				<el-col :span="12" :xs="24">
					<el-form-item label="国家" class="disInline minWid" prop="CountryId">
						<el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
							<el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.Country"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-form-item label="产品ASIN" class="disInline minWid" prop="ASIN">
						<el-input v-model="taskForm.ASIN" maxlength="10" show-word-limit placeholder="长度为10的数字和字母组合"></el-input>
						<el-button size='small' @click='helpCenter'>帮助中心</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>

				<el-col :span="12" :xs="24">
					<el-form-item label="店铺名称" class="disInline minWid">
						<el-select v-model="taskForm.ShopName" placeholder="请选择" class="disInline wid100">

						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-form-item label="产品名称" class="disInline minWid">
						<el-input v-model="taskForm.ProductName" placeholder='产品名称'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>

				<el-col :span="12" :xs="24">
					<el-form-item label="产品价格" class="disInline minWid" prop="Price">
						<el-input type="text" v-model="taskForm.Price" placeholder="请输入数字">
							<template slot="prepend">{{taskForm.Currency}}</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<p class="lh40">产品评分</p>
					<el-rate v-model="taskForm.StarScore" show-text class="mt5"></el-rate>
				</el-col>
			</el-row>
			<div>
				<el-col :span="12" :xs="24" class="fleft">
					<el-form-item label="评论数" class="disInline minWid">
						<el-input v-model="taskForm.Comments" :disabled="true"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24" class="fright">
					<el-form-item label="产品图片" class="disInline">
						<img alt="" :src="taskForm.ProductImage" class="proImg">
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-form-item label="品类排名" class="wid">
						<el-input type="text" v-model="taskForm.ProductRank" :disabled="true"></el-input>
					</el-form-item>
				</el-col>
			</div>
			<el-row>
				<el-col :span="12" :xs="24" class="fleft">
					<el-form-item label="产品链接" class="wid" prop="ProductURL">
						<el-input type="text" v-model="taskForm.ProductURL" placeholder="请以http://或https://开头"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>

			</el-row>
			<el-form-item label="下单信息"></el-form-item>
			<el-row>
				<el-col :span="12" :xs="24">
					<el-form-item label="添加方式">
						<el-radio-group v-model="taskForm.KeywordType" @change="searchBtn">
							<el-radio label="1" class="mb10 mt10">关键词加购</el-radio>
							<el-radio label="2">CPC关键词加购</el-radio>
							<el-radio label="3">链接</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-form-item label="终端平台">
						<el-radio-group v-model="taskForm.DeviceType">
							<el-radio label="1">PC</el-radio>
							<el-radio label="2">Android</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12" :xs="24" v-show="searchType===false">
					<el-form-item label="搜索关键词" class="disInline minWid">
						<el-input v-model="taskForm.Keyword"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24" v-show="searchType">
					<el-form-item label="链接" class="disInline wid">
						<el-input type="textarea" v-model="taskForm.LinkURL"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24">
					<el-form-item label="代购数量" class="disInline minWid" prop="OrderNum">
						<el-input type="text" v-model="taskForm.OrderNum" @change="checkOrderNum" placeholder="请输入正整数"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="con">
				<el-row :gutter="20">
					<el-col :span="7" :xs="12" :md="8" :sm="6" :lg="8" :xl="8">
						<span class="mb20 disInline">任务开始时间</span>
					</el-col>
					<el-col :span="10" :md="10" :sm="12" :xs="24" :lg="8" :xl="8">
						<el-button type="primary" size="small" @click="oneDay" :disabled="btnTask">一天一单</el-button>
						<el-button type="primary" size="small" @click="twoDay" :disabled="btnTask">一天两单</el-button>
						<el-button type="primary" size="small" @click="threeDay" :disabled="btnTask">一天三单</el-button>
					</el-col>
					<el-col :span="7" :md="6" :sm="6" :lg="8" :xl="8" class="mb10 mt10">
						<span>数量</span>
					</el-col>
				</el-row>
				<div v-for="(item,index) in taskForm.OrderSchedule" :key="index" class="mb10">
					<el-row :gutter="20">
						<el-col :span="7" :xs="24" :md="8" :sm="8">
							<el-form-item :prop="`OrderSchedule[${index}].StartDate`" :rules="{ required: true, message: '任务时间不能为空', trigger: 'change' }">
								<el-date-picker style="width: 100%" v-model="item.StartDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="10" :xs="24" :md="8" :sm="8" class="mb10">
							<el-time-picker style="width: 100%" is-range v-model="item.pickTime" format='HH:mm' range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }">
							</el-time-picker>
						</el-col>
						<el-col :span="7" :xs="24" :md="8" :sm="8">
							<el-form-item :prop="`OrderSchedule[${index}].Number`" :rules="{ required: true, message: '数量不能为空', trigger: 'change' }">
								<el-input type="text" v-model="item.Number" style="width: 60%;" placeholder="请输入正整数" @change="allOrderNum(index)"></el-input>
								<el-button type="danger" size="small" class="delMb" @click="removeWishTask(item, index)" :disabled="disabled">删除
								</el-button>
							</el-form-item>

							<div class="tipRed mt10" v-if="errorMes">数量不能超过代购数量</div>
						</el-col>
					</el-row>
				</div>
				<el-row class="mt20 mb20">
					<el-button @click="addWishTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
				</el-row>
			</div>
			<el-form-item label="服务费">
				<span class="colTxt labels">￥{{taskForm.ServiceFee}}</span>
				<span class="labels col9">(服务费单价) * 0 (数量) + 0 (增值费单价) * 0 (数量)</span>
			</el-form-item>
			<el-form-item label='备注'>
				<el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Memo' placeholder='请输入备注'></el-input>
			</el-form-item>
			<el-form-item style="display: block
">
				<el-button type="primary" size="medium" @click="wishComfir('taskForm')">确定</el-button>
				<el-button @click="back" size="medium">返回</el-button>
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
	import vali from '../common/validate'
	export default {
		name: 'wishTask',
		data() {
			return {
				disabled: true,
				errorMes: false,
				paymentModel: false,
				searchType: false,
				btnTask: true,
				pickerOptions0: this.startDate(),
				countryData: [],
				paymentForm: {
					balance: 0,
					payMoney: 0,
				},
				taskForm: {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: 0,
					Platform: '',
					baseTaskId: 3,
					baseTaskType: 3,
					OrderSchedule: [{
						StartDate: '',
						StartHourMin: '',
						EndHourMin: '',
						Number: '',
						pickTime: []
					}],
					CountryId: '',
					Country: '', //国家
					ASIN: '', //产品ASIN
					ShopName: 'nike', //店铺名称
					ProductName: '', //产品名称
					Price: '', //价格
					Currency: '', //货币符号
					Comments: 22, //评论数
					StarScore: null, //评分
					ProductURL: '', //产品链接
					PredictSales: 0, //预估月销量
					ProductImage: '', //产品图片
					ProductRank: 8, //品类排名
					KeywordType: '1', //关键词类型
					DeviceType: '1', //终端平台
					Keyword: '', //搜索关键词
					OrderNum: 0, //代购数量
					ServiceType: 1, //留评类型
					Facebook: 0, //feedback数量
					PicNum: 0, //评论图片数量
					VideoNum: 0, //评论视频数量
					Coupon: '0', //是否使用优惠券
					SelfShip: '1', //是否自发货
					ProductTotal: 0, //产品总价
					ServiceFee: 0, //服务费
					OrderTotal: 0, //合计
					LinkURL: '', //链接
					Memo: ''
				},
				taskRule: {
					ASIN: [{
							required: true,
							message: '请输入产品ASIN',
							trigger: 'change'
						},
						{
							validator: vali.flagNum,
							trigger: 'change'
						}
					],
					CountryId: [{
						required: true,
						message: '请输选择国家',
						trigger: 'change'
					}],
					Price: [{
							required: true,
							message: '请输入产品价格',
							trigger: 'change'
						},
						{
							validator: vali.proPrice,
							trigger: 'change'
						}
					],
					ProductURL: [{
							required: true,
							message: '请输入产品链接',
							trigger: 'change'
						},
						{
							validator: vali.checkLink,
							trigger: 'change'
						}
					],
					Keyword: [{
						required: true,
						message: '请输入关键字',
						trigger: 'change'
					}],
					OrderNum: [{
							required: true,
							message: '请输入购买数量',
							trigger: 'change'
						},
						{
							validator: vali.checkNum,
							trigger: 'change'
						}
					],
					ServiceType: [{
						required: true,
						message: '请选择留评类型',
						trigger: 'change'
					}],
					tradingFlow: [{
						required: true,
						message: '请输入交易流水',
						trigger: 'change'
					}],
					PayAccount: [{
						required: true,
						message: '请输入付款账号',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.getDate()
			this.intoNewTask()
			this.getPlam()
		},
		methods: {
			//获取平台名称
			getPlam(){
				let _this = this
				_this.taskForm.Platform=sessionStorage.getItem('Platform')
				_this.taskForm.PlatformId=sessionStorage.getItem('platformId')
			},
			// 数量验证
			allOrderNum(index) {
				let _this = this
				_this.index = index
				let OrderNum = _this.taskForm.OrderNum
				let taskTime = _this.taskForm.OrderSchedule
				var result = 0
				for(let i = 0; i < taskTime.length; i++) {
					result += parseInt(taskTime[i].Number)
				}
				console.log(result)
				if(parseInt(result) > parseInt(OrderNum)) {
					_this.errorMes = true
					return false
				} else {
					_this.errorMes = false
				}
			},
			// 付款关闭页面
			paymentClose() {
				let _this = this
				_this.paymentModel = false
				_this.$router.push('/taskManage')
			},
			// 代购数量为1
			checkOrderNum() {
				let _this = this
				let nums = _this.taskForm.OrderNum

				_this.taskForm.OrderSchedule = [{
					StartDate: '',
					pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
					Number: ''
				}]
				if(parseInt(nums) === 1) {
					_this.btnTask = true
					_this.taskForm.OrderSchedule[0].Number = 1
				} else {
					_this.btnTask = false
					_this.taskForm.OrderSchedule[0].Number = ''
				}
				_this.getDate()
			},
			// 心愿添加方式
			searchBtn() {
				let _this = this
				let wish = _this.taskForm.KeywordType
				if(wish === '链接') {
					_this.searchType = true
				} else {
					_this.searchType = false
				}
			},
			//心愿订单任务提交
			wishComfir(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						let len = _this.taskForm.OrderSchedule
						for(let i = 0; i < len.length; i++) {
							console.log(len[i].pickTime.length)
							len[i].StartHourMin = len[i].pickTime[0]
							len[i].EndHourMin = len[i].pickTime[1]
						}
						let pick = _this.taskForm.OrderSchedule.pickTime
						let param = Object.assign({}, _this.taskForm)
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.$refs['taskForm'].resetFields()
								_this.paymentModel = true
							} else {
								console.log(res.data.message)
							}
						})
					}else {
						return false
					}
				})
			},
			// 当前日期
			getDate() {
				let _this = this
				let date = new Date()
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				let d = date.getDate()
				if(m < 10) {
					m = '0' + m
				}
				if(d < 10) {
					d = '0' + d
				}
				let startTime = y + '-' + m + '-' + d
				_this.taskForm.OrderSchedule[0].StartDate = startTime
			},
			// 返回按钮
			back() {
				let _this = this
				this.$router.push('/loginHome')
			},
			startDate() {
				return {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7
					}
				}
			},
			// 心愿任务新增一行
			addWishTask() {
				let _this = this
				_this.taskForm.OrderSchedule.push({
					pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
				})
				let len = _this.taskForm.OrderSchedule.length
				if(len > 1) {
					_this.disabled = false
				}
			},
			// 心愿任务删除一行
			removeWishTask(item, index) {
				let _this = this
				_this.index = _this.taskForm.OrderSchedule.indexOf(item)
				let len = _this.taskForm.OrderSchedule.length
				if(index !== -1) {
					_this.taskForm.OrderSchedule.splice(index, 1)
				}
				if(len <= 2) {
					_this.disabled = true
				}
			},
			// 一天一单
			oneDay() {
				let _this = this
				_this.errorMes = false
				let dates = new Date()
				let y = dates.getFullYear()
				let m = dates.getMonth() + 1
				let d = dates.getDate()
				if(m < 10) {
					m = '0' + m
				}
				if(d < 10) {
					d = '0' + d
				}
				let startTime = y + '-' + m + '-' + d
				//_this.taskForm.taskData[0].startTime = startTime
				let t = _this.taskForm.OrderSchedule[0].pickTime
				let num = _this.taskForm.OrderNum
				_this.taskForm.OrderSchedule = [{
					StartDate: startTime,
					pickTime: t,
					Number: ''
				}]
				if(num !== '') {
					_this.taskForm.OrderSchedule[0].Number = '1'
					for(let i = 0; i < num - 1; i++) {
						let dateTemps = _this.taskForm.OrderSchedule[i].StartDate
						var dateTemp = dateTemps.split('-')
						var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0])
						var millSeconds = Math.abs(nDate) + (24 * 60 * 60 * 1000)
						var rDate = new Date(millSeconds)
						var year = rDate.getFullYear()
						var month = rDate.getMonth() + 1
						if(month < 10) month = '0' + month
						var date = rDate.getDate()
						if(date < 10) date = '0' + date
						var times = year + '-' + month + '-' + date
						_this.taskForm.OrderSchedule.push({
							StartDate: times,
							pickTime: t,
							Number: '1'
						})
					}
				}
				let len = _this.taskForm.OrderSchedule.length
				console.log(len)
				if(len > 1) {
					_this.disabled = false
				} else {
					_this.disabled = true
				}
			},
			// 一天两单
			twoDay() {
				let _this = this
				_this.errorMes = false
				let dates = new Date()
				let y = dates.getFullYear()
				let m = dates.getMonth() + 1
				let d = dates.getDate()
				if(m < 10) {
					m = '0' + m
				}
				if(d < 10) {
					d = '0' + d
				}
				let startTime = y + '-' + m + '-' + d
				let t = _this.taskForm.OrderSchedule[0].pickTime
				let num = _this.taskForm.OrderNum
				_this.taskForm.OrderSchedule = [{
					StartDate: startTime,
					pickTime: t,
					Number: ''
				}]
				if(num !== '') {
					let counts = parseInt(num) / 2
					if(counts % 1 === 0) {
						for(let i = 0; i < counts - 1; i++) {
							let dateTemps = _this.taskForm.OrderSchedule[i].StartDate
							let dateTemp = dateTemps.split('-')
							let nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]) // 转换为MM-DD-YYYY格式
							let millSeconds = Math.abs(nDate) + (24 * 60 * 60 * 1000)
							let rDate = new Date(millSeconds)
							let year = rDate.getFullYear()
							let month = rDate.getMonth() + 1
							if(month < 10) month = '0' + month
							let date = rDate.getDate()
							if(date < 10) date = '0' + date
							let times = year + '-' + month + '-' + date
							_this.taskForm.OrderSchedule.push({
								StartDate: times,
								pickTime: t,
								Number: '2'
							})
						}
					} else {
						counts++
						let count = parseInt(counts)
						for(let i = 0; i < count - 1; i++) {
							// _this.taskData[count].numbers = 1
							let dateTemps = _this.taskForm.OrderSchedule[i].StartDate
							var dateTemp = dateTemps.split('-')
							var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]) // 转换为MM-DD-YYYY格式
							var millSeconds = Math.abs(nDate) + (24 * 60 * 60 * 1000)
							var rDate = new Date(millSeconds)
							var year = rDate.getFullYear()
							var month = rDate.getMonth() + 1
							if(month < 10) month = '0' + month
							var date = rDate.getDate()
							if(date < 10) date = '0' + date
							var times = year + '-' + month + '-' + date
							_this.taskForm.OrderSchedule.push({
								StartDate: times,
								pickTime: t,
								Number: '2'
							})
						}
						let item = parseInt(count)
						_this.taskForm.OrderSchedule[item - 1].Number = '1'
					}
					_this.taskForm.OrderSchedule[0].Number = '2'
				}
				let len = _this.taskForm.OrderSchedule.length
				if(len > 1) {
					_this.disabled = false
				} else {
					_this.disabled = true
				}
			},
			// 一天三单
			threeDay() {
				let _this = this
				_this.errorMes = false
				let dates = new Date()
				let y = dates.getFullYear()
				let m = dates.getMonth() + 1
				let d = dates.getDate()
				if(m < 10) {
					m = '0' + m
				}
				if(d < 10) {
					d = '0' + d
				}
				let startTime = y + '-' + m + '-' + d
				let t = _this.taskForm.OrderSchedule[0].pickTime
				let num = _this.taskForm.OrderNum
				_this.taskForm.OrderSchedule = [{
					StartDate: startTime,
					pickTime: t,
					Number: ''
				}]
				if(num !== '') {
					_this.taskForm.OrderSchedule[0].Number = '3'
					let counts = parseInt(num) / 3
					if(counts % 1 === 0) {
						for(let i = 0; i < counts - 1; i++) {
							let dateTemps = _this.taskForm.OrderSchedule[i].StartDate
							let dateTemp = dateTemps.split('-')
							let nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]) // 转换为MM-DD-YYYY格式
							let millSeconds = Math.abs(nDate) + (24 * 60 * 60 * 1000)
							let rDate = new Date(millSeconds)
							let year = rDate.getFullYear()
							let month = rDate.getMonth() + 1
							if(month < 10) month = '0' + month
							let date = rDate.getDate()
							if(date < 10) date = '0' + date
							let times = year + '-' + month + '-' + date
							_this.taskForm.OrderSchedule.push({
								StartDate: times,
								pickTime: t,
								Number: '3'
							})
						}
					} else {
						counts++
						var count = parseInt(counts)
						for(let i = 0; i < count - 1; i++) {
							// _this.taskData[count].numbers = 1
							let dateTemps = _this.taskForm.OrderSchedule[i].StartDate
							var dateTemp = dateTemps.split('-')
							var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]) // 转换为MM-DD-YYYY格式
							var millSeconds = Math.abs(nDate) + (24 * 60 * 60 * 1000)
							var rDate = new Date(millSeconds)
							var year = rDate.getFullYear()
							var month = rDate.getMonth() + 1
							if(month < 10) month = '0' + month
							var date = rDate.getDate()
							if(date < 10) date = '0' + date
							var times = year + '-' + month + '-' + date
							_this.taskForm.OrderSchedule.push({
								StartDate: times,
								pickTime: t,
								Number: '3'
							})
						}
						var item = parseInt(count)
						var result = 0
						for(let j = 0; j < item - 1; j++) {
							result += parseInt(_this.taskForm.OrderSchedule[j].Number)
						}
						_this.taskForm.OrderSchedule[item - 1].numbers = parseInt(num) - parseInt(result)
					}
				}
				let len = _this.taskForm.OrderSchedule.length
				if(len > 1) {
					_this.disabled = false
				} else {
					_this.disabled = true
				}
			},
			// 时间范围
			timePicker() {
				let _this = this
				let pickTimes = _this.taskForm.taskData[0].pickTime
				let len = _this.taskForm.taskData.length
				for(let i = 0; i < len; i++) {
					_this.taskForm.taskData[i].pickTime = pickTimes
				}
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
			//根据国家取货币符号
			checkCountry(index) {
				let _this = this
				_this.taskForm.Currency = _this.countryData[index].CurrSymbal
				_this.taskForm.Country = _this.countryData[index].Code
			},
			//帮助中心
			helpCenter() {
				let _this = this
				_this.$router.push('/help')
			}
		}
	}
</script>

<style>

</style>