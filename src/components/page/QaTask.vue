<template>
	<div>
		<el-form :model="QaForm" class="demo-ruleForm">
			<el-form-item label="终端类型">
				<el-radio-group v-model="QaForm.TerminalPlatform ">
					<el-radio label="PC"></el-radio>
					<el-radio label="Android"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-radio-group v-model="QaForm.QA" @change="selectQA">
					<el-radio label="我要提问"></el-radio>
					<el-radio label="我要回答"></el-radio>
				</el-radio-group>
			</el-form-item>
			<div class="problem" v-show="QaType===true">
				<div class="con">
					<el-form :model="problemForm" ref="problemForm">
						<el-row>
							<el-col :span="4" class="mb20" :xs='6'>
								<span>国家</span>
							</el-col>
							<el-col :span="6" :xs="7">
								<span>产品ASIN</span>
							</el-col>
							<el-col :span="8" :xs="6">
								<span>问题</span>
							</el-col>
							<el-col :span="6" :xs="5">
								<span>时间</span>
							</el-col>
						</el-row>
						<div v-for="(item,index) in problemForm.problemData" :key="index" class="mb20">
							<el-row :gutter="20">
								<el-col :span="4" :xs="24">
									<el-form-item :prop="`problemData[${index}].country`" :rules="[{required: true, message: '请选择国家', trigger: 'change'}]">
										<el-select placeholder="请选择" v-model="item.country" class="wid100 mb20">
											<el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.country"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="6" :xs="24">
									<el-form-item :prop="`problemData[${index}].proAnsi`" :rules="[{required: true, message: '产品ASIN不能为空', trigger: 'change'}]">
										<el-input v-model="item.proAnsi" maxlength="10" show-word-limit placeholder="长度为10的数字和字母组合" class="disInline wid100 mb20"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8" :xs="24">
									<el-form-item :prop="`problemData[${index}].problem`" :rules="[{required: true, message: '请输入问题', trigger: 'change'}]">
										<el-input type="textarea" v-model="item.problem" class="disInline wid"></el-input>
										<el-button type="danger" size="small" class="delMb mt10" @click="removeProblemTask(item, index)" :disabled="disabled2">删除
										</el-button>
									</el-form-item>
								</el-col>
										<el-col :span='6' :xs="24">
										<el-form-item>
											<el-date-picker v-model="item.startTime" type="datetime" placeholder="选择日期" :picker-options="pickerOptions0">
											</el-date-picker>
											<el-button type="danger" size="small" class="delMb mt10" @click="removeProblemTask(item, index)" :disabled="disabled2">删除
											</el-button>
										</el-form-item>
									</el-col>
							</el-row>
						</div>
						<el-row class="mb20">
							<el-button @click="addproblemTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
						</el-row>
						<el-form-item label="服务费">
							<span class="itemPrice">￥{{problemForm.serviceCharge}}</span>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="problemComfir('problemForm')">确定</el-button>
							<el-button @click="QAtaskModel=false">返回</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="answer" v-show="QaType === false">
				<div class="con">
					<el-form :model="answerForm" ref="answerForm" status-icon>
						<el-row :gutter="20">
							<el-col :span="4" :xs="6" class="mb20">
								<span>国家</span>
							</el-col>
							<el-col :span="6" :xs="7">
								<span>问题链接</span>
							</el-col>
							<el-col :span="8" :xs="6">
								<span>回答</span>
							</el-col>
							<el-col :span="6" :xs="5">
								<span>时间</span>
							</el-col>
						</el-row>
						<div v-for="(item,index) in answerForm.answerData" :key="index" class="mb20">
							<el-row :gutter="20">
								<el-col :span="4" :xs="24">
									<el-form-item :prop="`answerData[${index}].country`" :rules="{required: true, message: '请选择国家', trigger: 'change'}">
										<el-select placeholder="请选择" v-model="item.country" class="wid100">
											<el-option label="美国" value="shanghai"></el-option>
											<el-option label="日本" value="beijing"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="7" :xs="24">
									<el-form-item class="wid100" :prop="`answerData[${index}].address`" :rules="{required: true, message: '请输入问题链接', trigger: 'change'}">
										<el-input v-model="item.address"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7" :xs="24">
									<el-form-item :prop="`answerData[${index}].answer`" :rules="{required: true, message: '请输入回答', trigger: 'change'}">
										<el-input type="textarea" v-model="item.answer" class="disInline wid"></el-input>
										<el-button type="danger" size="small" class="delMb mt10" @click="removeAnswerTask(item, index)" :disabled="disabled3">删除
										</el-button>
									</el-form-item>
								</el-col>
								<el-col :span='6' :xs="24">
										<el-form-item>
											<el-date-picker v-model="item.startTime" type="datetime" placeholder="选择日期" :picker-options="pickerOptions0">
											</el-date-picker>
											<el-button type="danger" size="small" class="delMb mt10" @click="removeAnswerTask(item, index)" :disabled="disabled3">删除
											</el-button>
										</el-form-item>
									</el-col>
							</el-row>
						</div>
						<el-row class="mb20">
							<el-button @click="addAnswerTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
						</el-row>
						<el-form-item label="服务费">
							<span class="itemPrice">￥{{answerForm.ansServiceCharge}}</span>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="medium" @click="answerComfir('answerForm')">确定</el-button>
							<el-button size="medium" @click="back">返回</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-form>
		<el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose" center>
			<el-form :model="paymentForm" class="demo-ruleForm">
				<el-row :gutter="20">
					<el-col :span="11" :xs="24" :sm="11" :md="11">
						<el-form-item label="当前余额">
							<span class="tipRed">￥0</span>
						</el-form-item>
						<div>
							<el-form-item label="待付款金额">
								<span class="tipRed">￥12</span>
							</el-form-item>
						</div>
						<el-form-item label="余额支付">
							<el-input v-model="paymentForm.balancePayment"></el-input>
						</el-form-item>
						<el-form-item label="现金支付">
							<el-input v-model="paymentForm.cashPayment"></el-input>
						</el-form-item>
						<el-form-item label="付款方式">
							<el-radio-group v-model="paymentForm.paymentType">
								<el-radio label="支付宝"></el-radio>
							</el-radio-group>
						</el-form-item>
						<div>
							<el-form-item label="收款账户">
								<span>{{paymentForm.recceiveAccount}}</span>
							</el-form-item>
						</div>
						<el-form-item label="付款账号" prop="PayAccount">
							<el-input v-model="paymentForm.PayAccount"></el-input>
						</el-form-item>
						<el-form-item label="交易流水" prop="tradingFlow">
							<el-input v-model="paymentForm.tradingFlow"></el-input>
						</el-form-item>
						<div class="payTips mb20">
							<p>温馨提示</p>
							<span>1.扫码支付，请先核对支付宝收款账户是否正确;</span>
							<p>2.请填写真实有效的付款信息，连续超过3次错误，会被定义为恶意充值，会被冻结账号。</p>
						</div>
					</el-col>
					<el-col :span="10" :xs="24" :sm="10" :md="10" class="modelRight">
						<img class="payImg">
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" :xs="24" :sm="24" :md="24" class="mt20 modelCenter">
						<el-form-item>
							<el-button type="primary">确定</el-button>
							<el-button @click="paymentClose">取消</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'QaTask',
		data() {
			return {
				paymentModel: false,
				disabled2: true,
				disabled3: true,
				QaType: true,
				pickerOptions0: this.startDate(),
				countryData: [{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				QaForm: {
					TerminalPlatform: 'PC',
					QA: '我要提问'
				},
				problemForm: {
					serviceCharge: '0.00',
					problemData: [{
						country: '',
						proAnsi: '',
						problem: '',
						startTime:''
					}]
				},
				answerForm: {
					ansServiceCharge: '0.00',
					answerData: [{
						country: '',
						address: '',
						answer: '',
						startTime:''
					}]
				},
				paymentForm: {
					balancePayment: '',
					cashPayment: '',
					paymentType: '支付宝',
					recceiveAccount: '圭贤',
					PayAccount: '',
					tradingFlow: ''
				}
			}
		},
		methods: {
			startDate() {
				return {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7
					}
				}
			},
			// 选择QA任务类型
			selectQA() {
				let _this = this
				let qa = _this.QaForm.QA
				if(qa === '我要提问') {
					_this.QaType = true
				} else if(qa === '我要回答') {
					_this.QaType = false
				}
			},
			// QA任务问题提交
			problemComfir(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.paymentModel = true

					}
				})
			},
			// QA任务回答提交
			answerComfir(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.paymentModel = true
					}
				})
			},
			// QA任务我要提问新增一行
			addproblemTask() {
				let _this = this
				_this.problemForm.problemData.push({
					country: '',
					proAsin: '',
					problem: ''
				})
				let len = _this.problemForm.problemData.length
				if(len > 1) {
					_this.disabled2 = false
				}
			},
			// QA任务删除一行
			removeProblemTask(item, index) {
				let _this = this
				_this.index = _this.problemForm.problemData.indexOf(item)
				let len = _this.problemForm.problemData.length
				if(index !== -1) {
					_this.problemForm.problemData.splice(index, 1)
				}
				if(len <= 2) {
					_this.disabled2 = true
				}
			},
			// QA任务我要回答新增一行
			addAnswerTask() {
				let _this = this
				_this.answerForm.answerData.push({
					country: '',
					proAsin: '',
					problem: ''
				})
				let len = _this.answerForm.answerData.length
				if(len > 1) {
					_this.disabled3 = false
				}
			},
			// QA任务我要回答删除一行
			removeAnswerTask(item, index) {
				let _this = this
				_this.index = _this.answerForm.answerData.indexOf(item)
				let len = _this.answerForm.answerData.length
				if(index !== -1) {
					_this.answerForm.answerData.splice(index, 1)
				}
				if(len <= 2) {
					_this.disabled3 = true
				}
			},
			// 付款关闭页面
			paymentClose() {
				let _this = this
				_this.paymentModel = false
				_this.paymentForm = {
					balancePayment: '',
					cashPayment: '',
					paymentType: '支付宝',
					recceiveAccount: '圭贤',
					PayAccount: '',
					tradingFlow: ''
				}
			},
			// 返回
			back() {
				let _this = this
				_this.$router.push('/loginHome')
			},
		}
	}
</script>

<style>

</style>