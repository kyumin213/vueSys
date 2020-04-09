<template>
	<div>
		<div class="mb20 mt20">
			<span class="tabsTxt">
            <span>首页</span>
			<span class="fg">/</span>
			<a>资金管理</a>
			</span>
		</div>
    <div>
      <el-button data-status='1' :class="accountActive===1?'active':''" @click='allAccount()'>账户总览</el-button>
      <el-button data-status='2' :class="accountActive===2?'active':''" @click='balanceIncome()'>余额收入</el-button>
      <el-button data-status='3' :class="accountActive===3?'active':''" @click='balanceExpenditure()'>余额支出</el-button>
    </div>
				<div v-show="accountActive === 1">
          <div class="ml30 mt20 mb20">
          	<div>账户余额</div>
          	<div class="money balance">￥{{balance}}</div>
          <!-- 	<div>
          		<el-button type="primary" size="medium" @click='recharge'>充值</el-button>
          		<el-button type="success" @click="cashPage" size="medium">提现</el-button>
          	</div> -->
            <div class="mt20">最近交易</div>
          </div>
          <el-table :data="allBalanceData" border style="width: 100%;" :header-cell-style="{background:'#fafafa'}">
          	<el-table-column prop="BusinessNumber" label="业务编号" align="center" width='200px'></el-table-column>
          	<el-table-column prop="TransactionAmount" label="交易金额" align="center"></el-table-column>
          	<el-table-column prop="TransactionType" label="交易类型" align="center"></el-table-column>
          	<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
          	<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
          </el-table>
          <div class="mt30 txtRight">
          	<el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50,100]" :page-size="offset" layout="total, sizes, prev, pager, next, jumper" :total="allAccountTotal">
          	</el-pagination>
          </div>
        </div>
			<div v-show="accountActive === 2" class="mt30">
        <div class="searchBox">
        	<el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true" class="form-item">
        		<div class="form-item">
        			<el-form-item label="交易日期" class="form-item">
        				<el-date-picker type="date" class="wid100 mb10" placeholder="选择开始时间" v-model="searchForm.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartDate"></el-date-picker>
        				<el-date-picker type="date" class="wid100" placeholder="选择结束时间" v-model="searchForm.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndDate"></el-date-picker>
        			</el-form-item>
        		</div>
        		<el-form-item label="业务编号">
        			<el-input v-model="searchForm.dealId" placeholder="请输入业务编号" class="mb10" style="width: 220px"></el-input>
        			<el-button type="primary" class="ml30" size="medium" @click='searchAccount()'>搜索</el-button>
        			<el-button size="medium" @click='reasetForm'>重置</el-button>
        		</el-form-item>
        	</el-form>
        </div>
        <div class="mb20">累积收入:0</div>
        <el-table :data="IncomeData" border style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        	<el-table-column prop="BusinessNumber" label="业务编号" align="center" width='200px'></el-table-column>
        	<el-table-column prop="TransactionAmount" label="交易金额" align="center"></el-table-column>
        	<!-- <el-table-column prop="ProductPrice" label="账户余额" align="center"></el-table-column> -->
        	<el-table-column prop="TransactionType" label="交易类型" align="center"></el-table-column>
        	<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
        	<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
        </el-table>
        <div class="mt30 txtRight">
        	<el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50,100]" :page-size="offset" layout="total, sizes, prev, pager, next, jumper" :total="allAccountTotal">
        	</el-pagination>
        </div>
      </div><div v-show="accountActive === 3" class="mt30">
        <div class="searchBox">
        	<el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true" class="form-item">
        		<div class="form-item">
        			<el-form-item label="交易日期" class="form-item">
        				<el-date-picker type="date" class="wid100 mb10" placeholder="选择开始时间" v-model="searchForm.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartDate"></el-date-picker>
        				<el-date-picker type="date" class="wid100" placeholder="选择结束时间" v-model="searchForm.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndDate"></el-date-picker>
        			</el-form-item>
        		</div>
        		<el-form-item label="业务编号">
        			<el-input v-model="searchForm.dealId" placeholder="请输入业务编号" class="mb10" style="width: 220px"></el-input>
        			<el-button type="primary" class="ml30" size="medium" @click='searchAccount()'>搜索</el-button>
        			<el-button size="medium" @click='reasetForm'>重置</el-button>
        		</el-form-item>
        	</el-form>
        </div>
        <div class="mb20">累积支出:0</div>
        <el-table :data="expenditureData" border style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        	<!--<el-table-column prop="UserId" label="任务编码" align="center"></el-table-column>-->
        	<el-table-column prop="BusinessNumber" label="业务编号" align="center" width='200px'></el-table-column>
        	<el-table-column prop="TransactionAmount" label="交易金额" align="center"></el-table-column>
        	<!--<el-table-column prop="Currency" label="货币" align="center"></el-table-column>-->
        	<el-table-column prop="ProductPrice" label="账户余额" align="center"></el-table-column>
        	<el-table-column prop="TransactionType" label="交易类型" align="center"></el-table-column>
        	<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
        	<!-- <el-table-column prop="Status" label="状态" align="center" width="100"></el-table-column> -->
        	<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
        </el-table>
        <div class="mt30 txtRight">
        	<el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50,100]" :page-size="offset" layout="total, sizes, prev, pager, next, jumper" :total="allAccountTotal">
        	</el-pagination>
        </div>
      </div>
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
	import vali from '../common/validate'
  import {getAllAccount,Income} from '@/request/api'
	export default {
		name: 'accountManage',
		data() {
			return {
        accountActive: 1,//默认选中账户总览
				allAccountTotal: 0, //账户总览总条数
				currentPage: 1, //当前页
				pageSize: 10,
				offset: 10,
				balance: 0,
				RechargeModal: false,
				AlipayPaymentModal: false, //支付宝支付
				bankPayModal: false, //银行卡支付
				allBalanceData: [], //账户总览
        IncomeData:[], //余额收入
        expenditureData:[], //余额支出
				searchForm: {
					dealId: '',
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
				name: 'fd',
				obj: []
			}
		},
		created() {
			let _this = this
			_this.balance = sessionStorage.getItem('balance')
			this.getAccount()
			// this.getObj()

		},
		methods: {
      // 账户总览切换
      allAccount(){
        let _this = this
        _this.accountActive = 1
      },
      // 余额收入切换
      balanceIncome:function(){
        let _this = this
        _this.accountActive = 2
      },
      // 余额支出
      balanceExpenditure:function(){
        let _this = this
        _this.accountActive = 3
      },
			//充值
			reasetForm() {
				let _this = this
				_this.searchForm = {
					dealId: '',
					startTime: '',
					endTime: ''
				}
				_this.getAccount()
			},
			//搜索账户明细
			searchAccount() {
				let _this = this
				let StartDate = _this.searchForm.startTime
				let EndDate = _this.searchForm.endTime
				let DealId = _this.searchForm.dealId
				_this.getIncome()
			},
			getObj() {
				let _this = this
				let types = sessionStorage.getItem('typeData')
				let obj = JSON.parse(types)
				_this.obj = obj
			},
			//获取类型
			getInfo(obj, param1, param2) {
				for(let i = 0; i < obj.length; i++) {
					if((obj[i].TypeName == param1 && obj[i].Value == param2) ||
						(obj[i].Value == param1 && obj[i].TypeName == param2)) {
						return obj[i].Display;
					}
				}
			},
			//账户总览列表
			getAccount() {
				let _this = this
        let userid = sessionStorage.getItem('userId')
        let pageNum = _this.currentPage
        let pagesize = _this.pageSize
				let param = {
					userid: sessionStorage.getItem('userId'),
					pageNum: parseInt(10),
					pagesize: parseInt(10)
				}
        getAllAccount(param).then((res)=>{
          _this.allAccountTotal = res.data.total
          _this.allBalanceData = res.data.list
        })
				// _this.axios.get(this.GLOBAL.BASE_URL + `/api/CustomerFinance/GetCustomerFinance?userid=${userid}&pageNum=${pageNum}&pagesize=${pagesize}`).then(res => {
				// 		_this.total = res.data.total
				// 		_this.allBalanceData = res.data.list
				// 		let len = res.data.data.acountDetails
				// 		for(let i = 0; i < len.length; i++) {
				// 			let amount = len[i].Amount
				// 			let curr = len[i].Currency
				// 			len[i].Amount = curr + ' ' + amount
				// 			len[i].Action = _this.getInfo(_this.obj, 'DealAction', len[i].Action)
				// 			len[i].Status = _this.getInfo(_this.obj, 'RefundStatus', len[i].Status)
				// 		}
				// })
			},
      // 余额支出
      getIncome:function(){
        let _this = this
        let param = {
          userid:sessionStorage.getItem('userId'),
          statetime:_this.searchForm.startTime,
          endtime:_this.searchForm.endTime,
          number:_this.searchForm.dealId,
          pageNum:parseInt(_this.currentPage),
          pagesize:parseInt(_this.pageSize)
        }
        Income(param).then((res)=>{
          _this.IncomeData = res.data.list
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
						let endDateVal = this.searchForm.endTime
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
						let beginDateVal = this.searchForm.startTime
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
			// 分页导航
			handleCurrentChange(val) {
				let _this = this
				_this.currentPage = val
				console.log(_this.currentPage)
				_this.getAccount()
			},
			//每页条数
			handleSizeChange(val) {
				let _this = this
				console.log(val)
				_this.pageSize = val
				_this.offset = val
				_this.handleCurrentChange(_this.currentPage)
			},
		}
	}
</script>

<style scoped>
	/*@import '../../../static/css/mystyle.css';*/

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

	.line {
		text-align: center;
		margin-right: 10px;
	}
  .active{
    background: #0098EF;
    color: #fff;
  }
</style>
