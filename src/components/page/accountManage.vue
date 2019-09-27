<template>
	<div>
		<div class="mb20 mt20">
			<span class="tabsTxt">
            <span>首页</span>
			<span class="fg">/</span>
			<a>资金管理</a>
			</span>
		</div>
		<el-tabs type="border-card" class="mt30">
			<el-tab-pane label="账户总览">
				<div class="ml30 mt20">
					<div>账户余额</div>
					<div class="money balance">￥100</div>
					<div>
						<el-button type="primary" size="medium" @click='recharge'>充值</el-button>
						<el-button type="success" @click="cashPage" size="medium">提现</el-button>
					</div>
				</div>
				<div style="width: 100%;overflow-x: auto">
					<div id="account" style="width: 980px;height: 320px;margin-top: 30px;overflow-x: auto;"></div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="收支明细">
				<div class="searchBox">
					<el-form ref="form" :model="form" label-width="80px" :inline="true" class="form-item">
						<div class="form-item">
							<el-form-item label="交易日期" class="form-item">
								<el-date-picker type="date" class="wid100 mb10" placeholder="选择开始时间" v-model="form.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartDate"></el-date-picker>
								<el-date-picker type="date" class="wid100" placeholder="选择结束时间" v-model="form.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndDate"></el-date-picker>
							</el-form-item>
						</div>
						<el-form-item label="业务编号">
							<el-input v-model="form.name" placeholder="请输入业务编号" class="mb10" style="width: 220px"></el-input>
							<el-button type="primary" class="ml30" size="medium">搜索</el-button>
							<el-button size="medium">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="UserId" label="任务编码"></el-table-column>
					<el-table-column prop="DealId" label="业务编号"></el-table-column>
					<el-table-column prop="Amount" label="交易金额"></el-table-column>
					<el-table-column prop="Currency" label="货币"></el-table-column>
					<!--<el-table-column prop="ProductPrice" label="账户余额"></el-table-column>-->
					<el-table-column prop="PayMethod" label="交易类型"></el-table-column>
					<el-table-column prop="ActionTime" label="交易时间"></el-table-column>
					<el-table-column prop="Status" label="状态"></el-table-column>
					<el-table-column prop="Remark" label="备注"></el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title='充值' :visible.sync='RechargeModal' :close-on-click-modal='false'>
			<el-form :model='rechargeForm' ref='rechargeForm' :rules='rechargeRules' class="form-item" :inline="true" label-width="80px">
				<el-row>
					<el-col>
						<el-form-item label='充值金额'>
							<el-radio-group v-model="rechargeForm.money">
								<el-radio-button label="100元"></el-radio-button>
								<el-radio-button label="300元"></el-radio-button>
								<el-radio-button label="500元"></el-radio-button>
								<el-radio-button label="800元"></el-radio-button>
								<el-radio-button label="1000元"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label='自定义' prop='moneys'>
							<el-input v-model='rechargeForm.moneys' class='disInline'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='付款方式'>
					<el-radio-group v-model="rechargeForm.payType">
						<el-radio label="1">支付宝</el-radio>
						<!--<el-radio :label="2">微信</el-radio>-->
						<el-radio label="3">银行卡</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot='footer' class="dialog-footer">
				<el-button type='primary' @click="comfirPay">确认</el-button>
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
	// import echarts from 'echarts'
	var echarts = require('echarts/lib/echarts')
	// 引入柱状图组件
	require('echarts/lib/chart/bar')
	// 引入提示框和title组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	import vali from '../common/validate'
	export default {
		name: 'accountManage',
		data() {
			return {
				RechargeModal: false,
				AlipayPaymentModal: false, //支付宝支付
				bankPayModal: false, //银行卡支付
				tableData: [],
				form: {
					name: '',
					resource: '',
					startTime: '',
					endTime: ''
				},
				rechargeForm: {
					money: '100元',
					moneys: '',
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
					moneys: [{
							validator: vali.proPrice,
							trigger: 'change'
						},
						{
							required: false,
							trigger: 'change'
						}
					]
				},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				name: 'fd'
			}
		},
		created(){
			this.getAccount()
		},
		mounted() {
			this.account()
		},
		methods: {
			//明细列表
			getAccount(){
				let _this = this
				let param ={
					SessionId:sessionStorage.getItem('sessionid'),
					StartDate:'',
					EndDate:"",
					Page:'1',
					OffSet:'10',
					DealId:''
				} 
				_this.axios.post(_this.GLOBAL.BASE_URL+'/api/userAccountDetails',param).then(res=>{
					if(res.data.status==200){
						_this.tableData = res.data.data.acountDetails
					}if(res.data.status==400){
						_this.$message({
							type:'error',
							message:'登录过期，请重新登录'
						})
						sessionStorage.clear()
						_this.$router.push({name:'index',params:{indexShow: false}})
					}
				})
			},
			//充值
			recharge() {
				let _this = this
				_this.RechargeModal = true
			},
			//充值
			recharge() {
				let _this = this
				_this.RechargeModal = true
			},
			//充值确定
			comfirPay() {
				let _this = this
				let types = _this.rechargeForm.payType
				console.log(types)
				if(types === '1') {
					_this.AlipayPaymentModal = true
					_this.RechargeModal = false
				}
				if(types === '3') {
					_this.bankPayModal = true
					_this.RechargeModal = false
				}
			},
			//关闭银行卡充值弹窗
			closeModel() {
				let _this = this
				_this.bankPayModal = false
			},
			// 搜索时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.form.endTime
						if(endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime()
						}
					}
				}
			},
			// 搜索下单结束时间
			pickerOptionsEnd() {
				return {
					disabledDate: time => {
						let beginDateVal = this.form.startTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},
			// 提现
			cashPage() {
				this.$router.push('/CashWithdrawal')
			},
			account() {
				var dom = document.getElementById('account')
				var myChart = echarts.init(dom)
				myChart.setOption({
					title: {
						text: '近12个月消费趋势'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['账平', '账不平']
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: '账平',
							type: 'bar',
							data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
							markPoint: {
								data: [{
										type: 'max',
										name: '最大值'
									},
									{
										type: 'min',
										name: '最小值'
									}
								]
							}
						},
						{
							name: '账不平',
							type: 'bar',
							data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
							markPoint: {
								data: [{
										name: '年最高',
										value: 182.2,
										xAxis: 7,
										yAxis: 183
									},
									{
										name: '年最低',
										value: 2.3,
										xAxis: 11,
										yAxis: 3
									}
								]
							}
						}
					]
				})
			}
		}
	}
</script>

<style scoped>
	/*@import '../../../static/css/mystyle.css';*/
		.accountCon{
		width: 85%;
		margin:  20px auto;
		padding: 20px;
		box-sizing: border-box;
		background: #eee;
	}
	.accountCon p{
		line-height: 40px;
	}
	.alipayImg {
		width: 350px;
	}
	.colred{
		color: #f00;
	}
	.line {
		text-align: center;
		margin-right: 10px;
	}
</style>