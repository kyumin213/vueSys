<template>
	<div>
		<div>
			<div class="mb20 mt20">
				<span class="tabsTxt">
            <span>首页</span>
				<span class="fg">/</span>
				<a>任务管理</a>
				</span>
			</div>
		</div>
		<div class="searchBox">
			<el-form :model="searchForm" ref="searchForm" class="form-item" label-width="80px" :inline="true">
				<el-row>
					<el-col :xs="24" :span='24'>
						<el-form-item label="国家">
						  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						  <div style="margin: 15px 0;"></div>
						  <el-checkbox-group v-model="searchForm.checkedCities" @change="handleCheckedCitiesChange">
						    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
						  </el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="form-item">
					<el-form-item label="下单时间">
						<el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						<el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="关键字" class="labelNum">
						<el-input v-model="searchForm.Keyword" style="width: 220px" placeholder="请输入关键字"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium" @click='searchOrder'>搜索</el-button>
						<el-button size="medium" @click="resetTask">重置</el-button>
						<!-- <el-button type="warning" size="medium" @click="exportExcel">导出</el-button> -->
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div>
			<div class="tabList">
				<ul class="tabBlock">
					<li :class="active === 0 ? 'active':''" @click="allTaskNum" :data-index="0">全部<span>({{allNum}})</span></li>
					<!--<li :class="active === 1 ? 'active':''" :data-index="1" @click="daiPay">待付款<span>({{StatusSum[1]}})</span></li>-->
					<li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">订单待确认<span>({{StatusSum[2]}})</span></li>
					<!-- <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待发货<span>({{StatusSum[3]}})</span></li> -->
					<!-- <li :class="active === 4 ? 'active':''" :data-index="4" @click="daish">待收货<span>({{StatusSum[4]}})</span></li> -->
					<li :class="active === 5 ? 'active':''" :data-index="5" @click="daipj">待评价<span>({{StatusSum[5]}})</span></li>
					<li :class="active === 6 ? 'active':''" :data-index="6" @click="evaluationComfir">评价待确认<span>({{StatusSum[5]}})</span></li>
					<li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>({{StatusSum[6]}})</span></li>
					<li :class="active === 8 ? 'active':''" :data-index="8" @click="daiCancel">已取消<span>({{StatusSum[7]}})</span></li>
					<!-- <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">异常<span>({{StatusSum[8]}})</span></li> -->
					<!--<li :class="active === 9 ? 'active':''" :data-index="9" @click="returnMoney">退款<span>({{StatusSum[9]}})</span></li>-->
				</ul>
			</div>
		</div>
		<div class="mt10 tableBg" style="overflow-x: auto">
			<el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" id="allOrder" @row-click="brushShowRow">
<!-- 				<el-table-column show-overflow-tooltip width="40px" align="center">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="brushRadio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column> -->
				<el-table-column prop="Id" label="任务编码" align="center" width="170">
					<template slot-scope="scope">
						<el-button type="text" @click="viewDetails(scope.$index,scope.row)">{{scope.row.Id}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="Platform" label="国家" align="center" width="150"></el-table-column>
				<el-table-column prop="TaskAmount" label="任务数量" align="center" width="100"></el-table-column>
				<el-table-column prop="ProductName" label="产品名称" align="center" width="100"></el-table-column>
				<el-table-column prop="ASIN" label="产品ASIN" align="center" width="120"></el-table-column>
				<el-table-column prop="OrderType" label="关键词" align="center"></el-table-column>
				<el-table-column prop="TotalPrice" label="总价" align="center"></el-table-column>
				<el-table-column prop="CreateTime" label="下单时间" align="center" width="200"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center" width="100"></el-table-column>
				<el-table-column label="操作" align="center" width="280">
					<template slot-scope="scope">
						<!-- <el-button size="small" type="primary" v-if="scope.row.Status=='待付款'" @click="payMent(scope.$index,scope.row)">付款</el-button> -->
						<!-- <el-button size="small" v-if="scope.row.Status=='待付款'" @click="cancelHandel(scope.$index,scope.row)">取消</el-button> -->
						<el-button size="small" type="success" @click="evalEdit(scope.$index,scope.row)">填写评价</el-button>
						<el-button size="small" type="warning" @click="viewDaily(scope.$index,scope.row)">日志</el-button>
			<!-- 			<el-button size="small" v-if="scope.row.Status=='取消'" type="danger" @click="delhandel(scope.$index,scope.row)">删除</el-button>
						<el-button size="small" type="primary" v-if="scope.row.Status=='待收货'" @click="confirmBtn(scope.$index,scope.row)">确认完成</el-button>
						<el-button size="small" v-if="scope.row.Status=='待收货'" type="danger" @click="refundBtn(scope.$index,scope.row)">申请退款</el-button>
						<el-button size="small" v-if="scope.row.Status=='退款'" @click="cancelRefundBtn(scope.$index,scope.row)">取消退款</el-button>
						<el-button size="small" v-if="scope.row.Status=='取消'" @click="cancelReasonBtn(scope.$index,scope.row)">取消原因</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</div>


		<!--评价-->
		<el-dialog title="评价" :visible.sync="assessModel" width="45%" :close-on-click-modal="false" center="">
			<el-form :model="assessForm">
				<el-form-item label="Feedback评分">
					<el-rate v-model="assessForm.FeedassessValue"></el-rate>
				</el-form-item>
				<el-form-item label="Feedback评价">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="assessForm.Feedassess" class="wid"></el-input>
				</el-form-item>
				<el-form-item label="产品评价星级">
					<el-rate v-model="assessForm.assessValue"></el-rate>
				</el-form-item>
				<el-form-item label="产品评价标题">
					<el-input v-model="assessForm.proTitle" class="wid"></el-input>
				</el-form-item>
				<el-form-item label="产品评价内容">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="assessForm.proCon" class="wid"></el-input>
				</el-form-item>
				<el-form-item class='txtCenter' prop='imgId'>
					<p>评论图片，（单张图片大小不应超过5M）</p>
					<p v-show='imgTip' class="colred">上传失败！单张图片大小不能超过5M</p>
					<p class="colred" v-show='imgIng'>图片上传中...</p>
					<div>
						<span v-for="(item,index) in imgsData" :key='index' class="imgItem">
							<img  :src="item" alt="" class='comImg' @click='delImg(index)' />
							<span class="iconItem" @click='delImg(index)'>
								<span class="imgDelModal"></span>
						<i class="el-icon-delete delIcon"></i>
						</span>
						</span>

					</div>
					<!--<el-input type='file' name='file' accept="image/png,image/jpeg,image/jpg" @change="update"></el-input>-->
					<input ref='file' name="file" style='display: none;' type="file" accept="image/png,image/jpeg,image/jpg" @change="update" />
					<span @click='openFile' class="fileBtn">选择图片</span>
				</el-form-item>
				<el-form-item class='txtCenter'>
					<div class="Upload_pictures">
						<span></span>
						<span>最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
						<p class="colred" v-show='videoSuccess'>视频已上传成功！</p>
						<p class="colred" v-show='videlIng'>视频上传中...</p>
					</div>
					<input name="files" type="file" ref='files' style='display: none;' @change="uploadVideo" />
					<span @click='openVideo' class="fileBtn" v-show="videoTip">选择视频</span>
				</el-form-item>
			</el-form>
			<span slot='footer' class='dialog-footer'>
				<el-button type="primary" size="medium" @click='evalEditSubmit'>确认</el-button>
				<el-button @click="assessModel=false" size="medium">取消</el-button>
			</span>

		</el-dialog>
		<!-- 日志-->
		<el-dialog title="日志" :visible.sync="dailyModel" :close-on-click-modal="false">
			<el-timeline>
				<el-timeline-item v-for="(item, index) in activities" :key="index" :timestamp="item.ActDate" placement="top">
					<!--{{item.ActionName}}{{item.ActDate}}-->
					<el-card>
						<h4>{{item.ActionName}}</h4>
						<p>{{item.ActDate}}</p>
					</el-card>
				</el-timeline-item>
			</el-timeline>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt">是否删除此数据?</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='delSubmit'>确定</el-button>
        <el-button @click="delModel=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!--确认完成-->
		<el-dialog title="温馨提示" :visible.sync="submitModal" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt">是否确认此订单?</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='confirmSubmit'>确定</el-button>
        <el-button @click="submitModal=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!--申请退款-->
		<el-dialog title="温馨提示" :visible.sync="refundModal" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt">是否确定申请退款?</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='retuenSubmit'>确定</el-button>
        <el-button @click="refundModal=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!--取消退款-->
		<el-dialog title="温馨提示" :visible.sync="cancelRefundModal" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt">是否确定取消退款申请?</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelRefund'>确定</el-button>
        <el-button @click="cancelRefundModal=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!--取消-->
		<el-dialog title="取消订单" :visible.sync="cancelModal" :close-on-click-modal="false" center="" width="30%">
			<el-input placeholder='请输入取消原因' v-model='reasonTxt'></el-input>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelSubmit'>确定</el-button>
        <el-button @click="cancelModal=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!-- 付款-->
		<el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose" top='5vh'>
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
						<el-button type='warning' v-if='parseInt(this.paymentForm.payMoney)>parseInt(this.paymentForm.balance) || parseInt(this.paymentForm.balance)==0' @click='toRecharge'>去充值</el-button>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click='paymentOrder' v-if='parseInt(this.paymentForm.payMoney)<parseInt(this.paymentForm.balance) && parseInt(this.paymentForm.balance)!=0 && !payList'>确定</el-button>
				<el-button type="primary" @click='paymentOrderList' v-if="payList">确定</el-button>
				<el-button @click="paymentClose">取消</el-button>
			</div>
		</el-dialog>
		<!--FBA查看详情-->
		<el-dialog title='详情' :visible.sync="viewDetailModal" width='80%'>
			<view-task :viewTaskData="viewTaskData"></view-task>
			<span slot='footer' class="dialog-footer">
				<el-button type='primary' @click='viewDetailModal=false'>返回</el-button>
			</span>
		</el-dialog>
		<!--取消原因-->
		<el-dialog title='取消原因' :visible.sync='reasonModal' width='40%'>
			<span>{{reasonCon}}</span>
			<span slot='footer' class="dialog-footer">
				<el-button type='primary' @click='reasonModal=false'>返回</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import vali from '../common/validate'
	import viewTask from '../common/viewTaskDetails'
	import qaTask from '../common/QaDetails'
	import likeTask from '../common/likeDetails'
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
  const cityOptions = ['美国', '日本', '韩国', '加拿大'];
	export default {
		name: 'taskManage',
		data() {
			return {
        checkAll: false,
        cities: cityOptions,
        isIndeterminate: true,
				disable1: true,
				disable2: true,
				disable3: true,
				disable4: true,
				disable5: true,
				disable6: true,
				disable7: true,
				disable8: true,
				disable9: true,
				activeTask: 2, //除FBA任务外的其它任务状态
				offset: 10, //每页条数
				imgIng: false, //评论图片上传中
				videoTip: true, //评论视频上传错误提示
				videlIng: false, //视频上传中
				payList: false, //列表付款按钮显示
				reasonModal: false, //取消原因
				reasonCon: '',
				imgTip: false, //上传图片失败提示
				videoSuccess: false, //视频上传成功
				imgsData: [], //评论上传图片
				fileId: '',
				OrderId: '', //任务ID
				Amount: 0,
				uploadUrl: this.GLOBAL.BASE_URL + '/api/doFileUpload',
				BaseTaskType: 1, //任务列表类型
				addBuyData: [], //加购列表
				likeListData: [], //点赞列表
				QAListData: [], //QA列表
				PlatformId: 0, //平台ID
				viewTaskData: [],
				OrderSchedule: {}, //查看任务开始时间
				allOrderData: [],
				hasBalance: 0,
				taskTypeData: [], //任务类型
				commentTypeData: [], //留评类型
				dialogImageUrl: '',
				dialogVisible: false,
				loading: true,
				status: this.$route.params.taskTypeModel,
				errorStatus: this.$route.params.active,
				pageSize: 1,
				btnTask: true,
				currentPage: 1,
				cancelModal: false,
				delModel: false, // 删除
				reverse: true,
				paymentModel: false,
				submitModal: false, //确认
				refundModal: false, //申请退款
				cancelRefundModal: false, //取消退款
				viewDetailModal: false, //FBA查看详情
				QaViewDetailsModal: false, //QA查看详情
				likeViewDetailModal: false, //点赞查看详情
				reasonTxt: '系统取消', //取消原因
				activities: [],
				active: 0,
				QaType: true,
				allNum: 0,
				dailyModel: false,
				disabled: true,
				assessModel: false,
				addTaskModal: false,
				taskTypeModel: false,
				errorMes: false,
				nolp: true,
				startTime: '',
				buyNumData: [],
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				paymentForm: {
					balance: 0,
					payMoney: 0,
				},
				countryData: [],
				searchForm: {
					Keyword: '',
					orderStartTime: '',
					orderEndTime: '',
          checkedCities:[]
				},
				assessForm: {
					assessValue: null,
					FeedassessValue: null,
					Feedassess: '',
					proTitle: '',
					proCon: '',
					PicIds: [],
					VideoIds: ''
				},

				activeName: 'first',
				taskType: 'all',

				taskRule: {
					VideoNum: [{
						validator: vali.checkNum,
						trigger: 'change'
					}],
					PicNum: [{
						validator: vali.checkNum,
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
				},
				obj: [],
				StatusSum: [], //任务状态数量
				selected: [] //选中的值
			}
		},
		components: {
			viewTask,
			qaTask,
			likeTask
		},
		created() {
			this.getAllData(1)
//			this.getTaskList()
//			this.getDate()
			this.getError()
			this.getObj()
			let status = this.status
			if(status) {
				this.taskTypeModel = true
			} else {
				this.taskTypeModel = false
			}

		},
		methods: {
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
			

			//更新余额
			getBalance() {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid')
				}
				_this.axios.post(this.GLOBAL.BASE_URL + '/api/frontConsoleHome', param).then((res) => {
					if(res.data.status == 200) {
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

			//任务类型搜索
			checkTask(value) {
				let _this = this
				_this.BaseTaskType = value
				_this.currentPage = 1
				_this.getAllData(value)
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				console.log(file)
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//列表确认付款弹窗
			payMent() {
				let _this = this
				_this.paymentModel = true
				_this.payList = true
				_this.hasBalance = 1
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice
				_this.paymentForm.payMoney = _this.selected.TotalPrice
				_this.paymentForm.balance = sessionStorage.getItem('balance')
			},
			//付款确认按钮
			paymentOrderList() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				let BaseTaskType = parseInt(_this.searchForm.BaseTaskType)
				_this.orderAction(1, orderId, Amount)
				_this.getBalance()
			},
			//申请退款弹窗
			refundBtn() {
				let _this = this
				_this.refundModal = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice
			},
			//退款确定
			retuenSubmit() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(8, orderId, Amount)
			},
			//确认完成弹窗
			confirmBtn() {
				let _this = this
				_this.submitModal = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice
			},
			//确认完成确定
			confirmSubmit() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(6, orderId, Amount)
			},
			// 任务管理全部状态信息
			getAllData(value) {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: parseInt(_this.searchForm.PlatformId),
					BaseTaskType: parseInt(value),
					Status: _this.active,
					Page: parseInt(_this.currentPage),
					offset: _this.offset,
					StartDate: _this.searchForm.orderStartTime,
					EndDate: _this.searchForm.orderEndTime,
					Keyword: _this.searchForm.Keyword
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderList', param).then((res) => {
					if(res.data.status == 200) {
						let status = res.data.data.StatusSum
						_this.StatusSum = status
						_this.allNum = res.data.data.TotalRecords
						let len = res.data.data.RstList
						for(let i = 0; i < len.length; i++) {
							let plat = len[i].Platform
							let country = len[i].Country
							len[i].Platform = plat + '/' + country
							len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
							len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
							len[i].Device = _this.getInfo(_this.obj, 'DeviceType', len[i].Device)
						}
						_this.allOrderData = res.data.data.RstList
						_this.loading = false
					} else if(res.data.status == 400) {
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
					} else {
						console.log(res.data.message)
					}
				}).catch((error) => {
					console.log(error)
				})
			},
			// 任务管理状态查询信息
			getDataStatus(status) {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: parseInt(_this.searchForm.PlatformId),
					BaseTaskType: parseInt(_this.BaseTaskType),
					Status: status,
					Page: 1,
					offset: _this.offset
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderList', param).then((res) => {
					if(res.data.status == 200) {
						let len = res.data.data.RstList
						_this.StatusSum = res.data.data.StatusSum
						for(let i = 0; i < len.length; i++) {
							let plat = len[i].Platform
							let country = len[i].Country
							len[i].Platform = plat + '/' + country
							len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
							len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
						}
						_this.allOrderData = res.data.data.RstList
						_this.loading = false
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
				}).catch((error) => {
					console.log(error)
				})
			},
			// 获取异常
			getError() {
				let _this = this
				let errors = _this.errorStatus
				if(errors != undefined) {
					this.errData()
				}
			},

			// 重置
			resetTask() {
				let _this = this
				let baseTaskType = _this.searchForm.BaseTaskType
				_this.searchForm = {
					PlatformId: '0',
					Keyword: '',
					orderStartTime: '',
					orderEndTime: '',
					BaseTaskType: _this.searchForm.BaseTaskType
				}
				_this.getAllData(parseInt(baseTaskType))
			},
			// 导出
			exportExcel() {
				var xlsxParam = {
					raw: true
				}
				// 导出的内容只做解析，不进行格式转换
				var wb = XLSX.utils.table_to_book(document.querySelector('#allOrder'), xlsxParam)
				var wbout = XLSX.write(wb, {
					bookType: 'xlsx',
					bookSST: true,
					type: 'array'
				})
				try {
					FileSaver.saveAs(new Blob([wbout], {
						type: 'application/octet-stream'
					}), '任务订单表.xlsx')
				} catch(e) {
					if(typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},


			// 付款关闭页面
			paymentClose() {
				let _this = this
				_this.paymentModel = false
				_this.payList = false
				_this.hasBalance = 0
			},


			// 取消
			cancelHandel() {
				let _this = this
				_this.cancelModal = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice
			},
			//取消确定
			cancelSubmit() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = parseFloat(_this.Amount)
				let Reason = _this.reasonTxt
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: orderId,
					Amount: Amount,
					ActionType: 2,
					Reason: Reason
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.cancelModal = false
						_this.getAllData(_this.BaseTaskType)
						_this.$message({
							type: 'success',
							message: res.data.message
						})
					} else if(res.data.status == 400) {
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
					} else {
						_this.$message({
							type: 'error',
							message: res.data.message
						})
						console.log(res.data.message)
					}
				})
			},
			// 删除弹窗
			delhandel() {
				let _this = this
				_this.delModel = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice
			},
			//删除确定
			delSubmit() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(5, orderId, Amount)
			},
			//取消退款弹窗
			cancelRefundBtn() {
				let _this = this
				_this.cancelRefundModal = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TotalPrice

			},
			//取消退款确定
			cancelRefund() {
				let _this = this
				let orderId = _this.orderId
				let Amount = _this.Amount
				_this.orderAction(9, orderId, Amount)
			},
			// 日志
			viewDaily() {
				let _this = this
				_this.dailyModel = true
				let orderId = _this.selected.Id
				let Amount = _this.selected.TotalPrice
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: orderId,
					Amount: Amount,
					ActionType: 4
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.activities = res.data.data.Logs
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
			//全部
			getAllStatus() {
				let _this = this
				_this.active = 0
				_this.getDataStatus(0)
			},

			//待付款
			daiPay() {
				let _this = this
				_this.active = 1
				_this.getDataStatus(1)
			},
			// 待购买
			daiBuy() {
				let _this = this
				_this.active = 2
				_this.getDataStatus(2)
			},
			// 待发货
			daifh() {
				let _this = this
				_this.active = 3
				_this.getDataStatus(3)
			},
			// 待收货
			daish() {
				let _this = this
				_this.active = 4
				_this.getDataStatus(4)
			},
			// 待评价
			daipj() {
				let _this = this
				_this.active = 5
				_this.getDataStatus(5)
			},
      // 待评价确认
      evaluationComfir(){
        let _this = this
        _this.active = 6
        _this.getDataStatus(6)
      },
			// 已完成
			ywc() {
				let _this = this
				_this.active = 7
				_this.getDataStatus(7)
				_this.brushRadio = ''
			},
			// 已取消
			daiCancel() {
				let _this = this
				_this.active = 7
				_this.getDataStatus(7)
			},
			// 异常
			// errData() {
			// 	let _this = this
			// 	_this.active = 8
			// 	_this.getDataStatus(8)
			// 	_this.brushRadio = ''
			// },
			// 退款
			// returnMoney() {
			// 	let _this = this
			// 	_this.active = 9
			// 	_this.getDataStatus(9)
			// 	_this.brushRadio = ''
			// },
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.formAll.orderEndTime
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
						let beginDateVal = this.formAll.orderStartTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},
			endTimeStatus: function(value) {
				this.orderEndTime = value
			},


			// 填写评价
			evalEdit() {
				let _this = this
				_this.assessModel = true
				_this.OrderId = _this.selected.Id
				_this.Amount = _this.selected.TaskAmount

			},
			//评论确定
			evalEditSubmit() {
				let _this = this
				let OrderId = _this.OrderId
				let Amount = _this.Amount
				console.log(_this.assessForm.PicIds)
				let common = {
					OrderId: _this.OrderId,
					StarScore: _this.assessForm.assessValue,
					Subject: _this.assessForm.proTitle,
					Comments: _this.assessForm.proCon,
					PicIds: _this.assessForm.PicIds.toString(),
					VideoIds: _this.assessForm.VideoIds
				}
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.OrderId,
					ActionType: 3,
					Amount: _this.Amount,
					OrderComments: common
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.$message({
							type: 'success',
							message: res.data.message
						})
						_this.assessModel = false
						_this.getAllData(1)
					} else if(res.data.status == 400) {
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
					} else {
						console.log(res.data.message)
					}
				})
			},
			// 查看任务详情
			viewDetails(index, row) {
				let _this = this
				let obj = _this.obj
				_this.viewDetailModal = true
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.allOrderData[index].Id,
					ActionType: 7
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.viewTaskData = res.data.data.Order
						//						_this.OrderSchedule=res.data.data.OrderSchedule
						let order = res.data.data.OrderSchedule
						_this.viewTaskData.OrderSchedule = order
						_this.viewTaskData.OrderType = this.getInfo(obj, 'BaseTaskType', _this.viewTaskData.OrderType)
						_this.viewTaskData.Status = this.getInfo(obj, 'OrderStatus', _this.viewTaskData.Status)
						_this.viewTaskData.KeyType = this.getInfo(obj, 'KeyType', _this.viewTaskData.KeyType)
						_this.viewTaskData.Device = this.getInfo(obj, 'DeviceType', _this.viewTaskData.Device)
						_this.viewTaskData.CouponUsed = this.getInfo(obj, 'CouponUsed', _this.viewTaskData.CouponUsed)
						_this.viewTaskData.SelfShipped = this.getInfo(obj, 'SelfShipped', _this.viewTaskData.SelfShipped)
						let plat = _this.viewTaskData.PlatformId
						if(plat == 1) {
							_this.viewTaskData.PlatformId = '亚马逊'
						} else if(plat == 2) {
							_this.viewTaskData.PlatformId = '速卖通'
						}
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



			startDate() {
				return {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7
					}
				}
			},
			handleClick(tab, event) {
				console.log(tab)
			},

			//任务列表操作
			orderAction(ActionType, orderId, Amount) {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: orderId,
					ActionType: ActionType,
					Amount: parseInt(Amount)
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.paymentModel = false
						_this.cancelModal = false //取消
						_this.assessModel = false //评论
						_this.delModel = false //删除
						_this.submitModal = false //确认完成
						_this.refundModal = false //申请退款
						_this.cancelRefundModal = false //取消退款
						_this.disable1 = true
						_this.disable2 = true
						_this.disable3 = true
						_this.disable4 = true
						_this.disable5 = true
						_this.disable6 = true
						_this.disable7 = true
						_this.disable8 = true
						_this.disable9 = true
						_this.getAllData(_this.BaseTaskType)
						_this.$message({
							type: 'success',
							message: res.data.message
						})
					} else if(res.data.status == 400) {
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
					} else {
						_this.$message({
							type: 'error',
							message: res.data.message
						})
						console.log(res.data.message)
					}
				})
			},
			//下单成功后确定付款
			paymentOrder() {
				let _this = this
				let BaseTaskType = _this.searchForm.BaseTaskType
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.OrderId,
					Amount: _this.paymentForm.payMoney
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderPayment', param).then(res => {
					if(res.data.status == 200) {
						_this.$message({
							type: 'success',
							message: res.data.message
						})
						_this.paymentModel = false
						_this.taskTypeModel = false
						_this.getAllData(BaseTaskType)
						_this.getBalance()
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
			//去充值
			toRecharge() {
				this.$router.push('/accountManage')
			},
			//帮助中心
			helpCenter() {
				let _this = this
				_this.$router.push('/help')
			},
			//QA任务查看详情
			QaViewDetails(index, row) {
				let _this = this
				_this.QaViewDetailsModal = true
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.allOrderData[index].Id,
					ActionType: 7
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						let obj = _this.obj
						_this.viewTaskData = res.data.data.Order
						_this.viewTaskData.QATasks = res.data.data.QATasks
						console.log(_this.viewTaskData)
						_this.viewTaskData.QAType = _this.getInfo(obj, 'QAType', _this.viewTaskData.QAType)
						_this.viewTaskData.Device = _this.getInfo(obj, 'DeviceType', _this.viewTaskData.Device)
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
			//点赞查看详情
			likeDetails(index, row) {
				let _this = this
				let obj = _this.obj
				_this.likeViewDetailModal = true
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.allOrderData[index].Id,
					ActionType: 7
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.viewTaskData = res.data.data.Order
						let device = _this.viewTaskData.Device
						if(device == 1) {
							_this.viewTaskData.Device = 'PC'
						} else if(device == 2) {
							_this.viewTaskData.Device = 'Android'
						}
						_this.viewTaskData.LikeTasks = res.data.data.LikeTasks
						let likeLen = _this.viewTaskData.LikeTasks
						for(let i = 0; i < likeLen.length; i++) {
							likeLen[i].Action = _this.getInfo(obj, 'Action', likeLen[i].Action)
						}
						console.log(_this.viewTaskData)
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
				console.log(index)
				let len = _this.likesForm.OrderSchedule
				let result = 0
				for(let i = 0; i < len.length; i++) {
					let num = len[i].Number
					let fee = len[i].fee
					result += parseInt(num)
					_this.likesForm.OrderTotal = result * fee
				}
			},
			//QA选择国家
			QaCountry(index) {
				let _this = this
				console.log(index)
				_this.QaForm.Country = _this.countryData[index].Code
				//				_this.QaForm.CountryId = _this.countryData[index].Country
				_this.problemForm.problemData.Currency = _this.countryData[index].Currency
			},
			//点赞选项操作
			actionCheck(value) {
				console.log(value)
			},
			//上传图片
			update(e) {
				let _this = this
				let file = e.target.files[0]
				_this.assessForm.imgId = file
				let name = file.name
				let size = file.size
				var ext = name.lastIndexOf('.')
				let fileTpyes = name.substring(ext + 1)
				sessionStorage.setItem('fileext', fileTpyes)
				var AllowImgFileSize = 5242880;
				if(file) {
					_this.imgIng = true
					if(size > AllowImgFileSize) {
						_this.$message({
							type: 'error',
							message: '上传失败，图片不能大于5M'
						})
						_this.imgTip = true

					} else {
						_this.imgTip = false
						let param = file
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doFileUpload', param, {
								headers: {
									'Content-Type': 'application/octet-stream',
									'fileext': fileTpyes,
									'SessionId': sessionStorage.getItem('sessionid')
								}
								//						responseType: 'arraybuffer'

							})
							.then(res => {
								if(res.data.status == 200) {
									let fileId = res.data.data.FileId
									_this.fileId = fileId
									_this.imgsData.push(this.GLOBAL.BASE_URL + '/api/doGetFile?Id=' + fileId)
									_this.assessForm.PicIds.push(fileId)
									_this.imgIng = false
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
									console.log(res.data.message)
								}
							})
					}

				}

			},
			//上传视频
			uploadVideo(e) {
				let _this = this
				_this.videlIng = true
				let file = e.target.files[0]
				let name = file.name
				let size = file.size
				var ext = name.lastIndexOf('.')
				let fileTpyes = name.substring(ext + 1)
				sessionStorage.setItem('fileext', fileTpyes)
				var AllowImgFileSize = 52428800;
				if(file) {
					_this.videoSuccess = false
					if(parseInt(size) > parseInt(AllowImgFileSize)) {
						_this.$message({
							type: 'error',
							message: '上传失败！视频不能超过50M'
						})
						_this.videoTip = true

					} else {
						_this.videoTip = false
						let param = file
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doFileUpload', param, {
								headers: {
									'Content-Type': 'application/octet-stream',
									'fileext': fileTpyes,
									'SessionId': sessionStorage.getItem('sessionid')
								}

							})
							.then(res => {
								if(res.data.status == 200) {
									_this.assessForm.VideoIds = res.data.data.FileId
									_this.videoSuccess = true
									_this.videlIng = false
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
									console.log(res.data.message)
								}
							})
					}
				}

			},
			//获取图片
			getFiles(fileId) {
				let _this = this
				let param = {
					Id: fileId
				}
				_this.axios.get(_this.GLOBAL.BASE_URL + '/api/doGetFile', {
					params: param
				}).then(res => {
					console.log(_this.imgsData);
				})
			},
			//查询
			searchOrder() {
				let _this = this
				let BaseTaskType = _this.searchForm.BaseTaskType
				_this.getAllData(BaseTaskType)
			},
			//上传图片选择
			openFile() {
				this.$refs.file.click();
			},
			//上传视频选择
			openVideo() {
				this.$refs.files.click();
			},
			//全部
			allTaskNum() {
				let _this = this
				_this.active = 0
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: parseInt(_this.searchForm.PlatformId),
					BaseTaskType: parseInt(_this.BaseTaskType),
					Status: 0,
					Page: 1,
					offset: _this.offset
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderList', param).then((res) => {
					if(res.data.status == 200) {
						let len = res.data.data.RstList
						let status = res.data.data.StatusSum
						_this.StatusSum = status
						for(let i = 0; i < len.length; i++) {
							let plat = len[i].Platform
							let country = len[i].Country
							len[i].Platform = plat + '/' + country
							len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
							len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
						}
						_this.allOrderData = res.data.data.RstList
						_this.loading = false
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
				}).catch((error) => {
					console.log(error)
				})
			},
			//查看取消原因
			cancelReasonBtn(index, row) {
				let _this = this
				_this.reasonModal = true
				//				let orderId = _this.allOrderData[index].Id
				//				let Amount = _this.allOrderData[index].TotalPrice
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.allOrderData[index].Id,
					ActionType: 11,
					Amount: _this.allOrderData[index].TotalPrice
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						_this.reasonCon = res.data.data.Order.Reason
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
			//评论删除图片
			delImg(index) {
				let _this = this
				console.log(index)
				_this.imgsData.splice(index, 1)
			},
			// 分页导航
			handleCurrentChange(val) {
				let _this = this
				_this.currentPage = val
				let baseTaskType = _this.BaseTaskType
				console.log(_this.pageSize)
				console.log(_this.currentPage)
				_this.getAllData(baseTaskType)
			},
			//每页条数
			handleSizeChange(val) {
				let _this = this
				console.log(val)
				_this.pageSize = val
				_this.offset = val
				_this.handleCurrentChange(_this.currentPage)
			},
			//其它任务全部
			allTaskOther() {
				let _this = this
				_this.activeTask = 0
			},
			//其他任务待付款
			daifk() {
				let _this = this
				_this.activeTask
			},
			//待执行
			daizx() {
				let _this = this
				_this.activeTask = 2
			},
			//其他任务已完成
			ywcOther() {
				let _this = this
				_this.activeTask = 3
			},
			//其他任务异常
			errorOther() {
				let _this = this
				_this.activeTask = 4
			}
		}
	}
</script>

<style scoped>
	.fileBtn {
		display: inline-block;
		width: 120px;
		height: 40px;
		background: #0098EF;
		color: #fff;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}

	.comImg {
		width: 200px;
		background-size: cover;
		border: solid #ccc 1px;
	}

	.imgItem {
		position: relative;
		z-index: 9;
		display: inline-block;
		cursor: pointer;
		width: 200px;
		height: 115px;
		margin: 0 10px 10px 10px;
	}

	.imgItem:hover .imgDelModal {
		display: inline-block;
		position: absolute;
		width: 200px;
		height: 115px;
		top: 50%;
		left: 50%;
		background: rgba(0, 0, 0, .4);
		z-index: 99;
		transform: translate(-50%, -50%);
	}

	.delIcon,
	.imgDelModal {
		display: none;
	}

	.imgItem:hover .delIcon {
		display: inline-block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9999;
		font-size: 26px;
		color: #fff;
		transition: all ease-in-out .5s;
	}

	.footer {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		background: #eee;
		padding: 20px;
		box-sizing: border-box;
	}

	.detailbox1 li {
		width: 48%;
		float: left;
		list-style: none;
		line-height: 36px;
		margin-bottom: 8px;
		overflow: hidden;
	}

	.detailbox1 li p {
		margin: 0;
		display: inline-block;
		color: #666;
	}

	.detailbox1 li p img {
		display: inline-block;
	}

	.detailbox {
		overflow: hidden;
		margin-top: 20px;
		font-size: 14px;
	}

	.eval_img {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		cursor: pointer;
		border: 1px solid #ccc;
		margin-right: 10px;
	}

	.detailbox1 {
		padding: 0;
		margin: 0 0 0 10px;
		text-align: left;
	}

	@media screen and (max-width: 970px) {
		.detailbox1 li {
			width: 100%;
		}
	}

	@media screen and (min-width: 1440px) {
		.dialogModal {
			width: 60% !important;
			margin: 0 auto;
		}
	}
</style>
