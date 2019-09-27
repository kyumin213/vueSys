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
						<el-form-item label="平台" class="disInline">
							<el-radio-group v-model="searchForm.PlatformId" class="disInline">
								<el-radio label="1">全部</el-radio>
								<el-radio label="2">Amazon</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="form-item">
					<el-form-item label='任务类型'>
						<el-select v-model="searchForm.BaseTaskType" placeholder="请选择" class="disInline wid100" @change='checkTask'>
							<el-option value="1" label="FBA"></el-option>
							<el-option value="2" label="加购"></el-option>
							<el-option value="3" label="心愿"></el-option>
							<el-option value="4" label="点赞"></el-option>
							<el-option value="5" label="QA"></el-option>
						</el-select>
					</el-form-item>
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
						<el-button type="warning" size="medium" @click="exportExcel">导出</el-button>
					</el-form-item>
					<!--          </el-col>-->
				</div>
			</el-form>
		</div>
		<div class="tabBox">
			<div class="tabList">
				<ul class="tabBlock">
					<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
					<li :class="active === 3 ? 'active':''" :data-index="3" @click="daiPay">待付款<span>(0)</span></li>
					<li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待购买<span>(0)</span></li>
					<li :class="active === 4 ? 'active':''" :data-index="4" @click="daifh">待发货<span>(0)</span></li>
					<li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待收货<span>(0)</span></li>
					<li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">待评价<span>(0)</span></li>
					<li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
					<li :class="active === 8 ? 'active':''" :data-index="8" @click="daiCancel">已取消<span>(0)</span></li>
					<li :class="active === 9 ? 'active':''" :data-index="9" @click="errData">异常<span>(0)</span></li>
				</ul>
			</div>
			<div class="tabRight">
				<el-button type="primary" size="medium" @click="createTsk">创建任务</el-button>
			</div>
		</div>
		<div class="mt10" style="overflow-x: auto" v-show='BaseTaskType==1 || BaseTaskType==2 || BaseTaskType==3'>
			<el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" id="allOrder">
				<el-table-column prop="Id" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewDetails(scope.$index,scope.row)">{{scope.row.Id}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="Platform" label="平台/国家" align="center" width="100"></el-table-column>
				<el-table-column prop="TaskAmount" label="任务数量" align="center" width="100"></el-table-column>
				<el-table-column prop="ASIN" label="产品ASIN" align="center" width="120"></el-table-column>
				<el-table-column prop="TotalPrice" label="产品价格" align="center"></el-table-column>
				<el-table-column prop="OrderType" label="服务类型" align="center"></el-table-column>
				<el-table-column prop="CreateTime" label="下单时间" align="center" width="200"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center" width="100"></el-table-column>
				<el-table-column label="操作" align="center" width="750">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="payMent(scope.$index,scope.row)">付款</el-button>
						<el-button size="small" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
						<el-button size="small" type="success" @click="evalEdit(scope.$index,scope.row)">填写评价</el-button>
						<el-button size="small" type="warning" @click="viewDaily(scope.$index,scope.row)">日志</el-button>
						<el-button size="small" type="danger" @click="delhandel(scope.$index,scope.row)">删除</el-button>
						<el-button size="small" type="primary" @click="confirmBtn(scope.$index,scope.row)">确认完成</el-button>
						<el-button size="small" type="danger" @click="refundBtn(scope.$index,scope.row)">申请退款</el-button>
						<el-button size="small" @click="cancelRefundBtn(scope.$index,scope.row)">取消退款</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="allNum">
				</el-pagination>
			</div>
		</div>
		<!--QA任务列表-->
		<div class="mt10" style="overflow-x: auto" v-show='BaseTaskType==5'>
			<el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" id="QAListData">
				<el-table-column prop="Id" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="QaViewDetails(scope.$index,scope.row)">{{scope.row.Id}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="Device" label="平台" align="center" width="100"></el-table-column>
				<el-table-column prop="OrderType" label="任务" align="center" width="100"></el-table-column>
				<el-table-column prop="TaskAmount" label="任务数量" align="center"></el-table-column>
				<el-table-column prop="TotalPrice" label="总价" align="center"></el-table-column>
				<el-table-column prop="CreateTime" label="下单时间" align="center" width="200"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center" width="100"></el-table-column>
				<el-table-column label="操作" align="center" width="750">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="payMent(scope.$index,scope.row)">付款</el-button>
						<el-button size="small" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
						<el-button size="small" type="warning" @click="viewDaily(scope.$index,scope.row)">日志</el-button>
						<el-button size="small" type="danger" @click="delhandel(scope.$index,scope.row)">删除</el-button>
						<el-button size="small" type="primary" @click="confirmBtn(scope.$index,scope.row)">确认完成</el-button>
						<el-button size="small" type="danger" @click="refundBtn(scope.$index,scope.row)">申请退款</el-button>
						<el-button size="small" @click="cancelRefundBtn(scope.$index,scope.row)">取消退款</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="allNum">
				</el-pagination>
			</div>
		</div>
		<!--点赞任务-->
		<div class="mt10" style="overflow-x: auto" v-show='BaseTaskType==4'>
			<el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" id="likeListData">
				<el-table-column prop="Id" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="likeDetails(scope.$index,scope.row)">{{scope.row.Id}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="Device" label="平台" align="center" width="100"></el-table-column>
				<el-table-column prop="OrderType" label="任务" align="center" width="100"></el-table-column>
				<el-table-column prop="TaskAmount" label="任务数量" align="center"></el-table-column>
				<el-table-column prop="TotalPrice" label="总价" align="center"></el-table-column>
				<el-table-column prop="CreateTime" label="下单时间" align="center" width="200"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center" width="100"></el-table-column>
				<el-table-column label="操作" align="center" width="750">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="payMent(scope.$index,scope.row)">付款</el-button>
						<el-button size="small" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
						<el-button size="small" type="warning" @click="viewDaily(scope.$index,scope.row)">日志</el-button>
						<el-button size="small" type="danger" @click="delhandel(scope.$index,scope.row)">删除</el-button>
						<el-button size="small" type="primary" @click="confirmBtn(scope.$index,scope.row)">确认完成</el-button>
						<el-button size="small" type="danger" @click="refundBtn(scope.$index,scope.row)">申请退款</el-button>
						<el-button size="small" @click="cancelRefundBtn(scope.$index,scope.row)">取消退款</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="allNum">
				</el-pagination>
			</div>
		</div>
		<!--任务类型-->
		<el-dialog title="任务类型" :visible.sync="taskTypeModel" width="60%" :close-on-click-modal="false" top='5vh'>
			<el-tabs v-model="taskType" @tab-click="handleClick">
				<el-tab-pane label="全部" name="all">
					<div class="mb20 TypeItems" v-for="(item,index) in taskTypeData" :key='index'>
						<div>
							<div>
								<div>
									<h4 class="titleName">{{item.Platform}}</h4>
									<span class="titleName">{{item.TaskName}}</span>
								</div>
							</div>
							<div class="des">{{item.Description}}
							</div>
						</div>
						<div>
							<div class="mb20 itemPrice">￥{{item.MinPrice}}起</div>
							<div>
								<el-button type="primary" @click="buyTask(index)" v-if="item.TaskName=='FBA'">立即购买</el-button>
								<el-button type="primary" @click="wishTask(index)" v-if="item.TaskName=='心愿'">立即购买</el-button>
								<el-button type="primary" @click="problemTask(index)" v-if="item.TaskName=='QA'">立即购买</el-button>
								<el-button type="primary" @click="likesTask(index)" v-if="item.TaskName=='点赞'">立即购买</el-button>
								<el-button type="primary" @click="buyCarTask(index)" v-if="item.TaskName=='加购'">立即购买</el-button>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="亚马逊" name="second">
					<div class="mb20 TypeItems" v-for="(item,index) in taskTypeData" :key='index' v-if='item.PlatformId==1'>
						<div>
							<div>
								<div>
									<h4 class="titleName">{{item.Platform}}</h4>
									<span class="titleName">{{item.TaskName}}</span>
								</div>
							</div>
							<div class="des">{{item.Description}}</div>
						</div>
						<div>
							<div class="mb20 itemPrice">￥{{item.MinPrice}}起</div>
							<div>
								<el-button type="primary" @click="buyTask(index)" v-if="item.TaskName=='FBA'">立即购买</el-button>
								<el-button type="primary" @click="wishTask(index)" v-if="item.TaskName=='心愿'">立即购买</el-button>
								<el-button type="primary" @click="problemTask(index)" v-if="item.TaskName=='QA'">立即购买</el-button>
								<el-button type="primary" @click="likesTask(index)" v-if="item.TaskName=='点赞'">立即购买</el-button>
								<el-button type="primary" @click="buyCarTask(index)" v-if="item.TaskName=='加购'">立即购买</el-button>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="速卖通" name="third">
					<div class="mb20 TypeItems" v-for="(item,index) in taskTypeData" :key='index' v-if='item.PlatformId==2'>
						<div>
							<div>
								<div>
									<h4 class="titleName">{{item.Platform}}</h4>
									<span class="titleName">{{item.TaskName}}</span>
								</div>
							</div>
							<div class="des">{{item.Description}}</div>
						</div>
						<div>
							<div class="mb20 itemPrice">￥{{item.MinPrice}}起</div>
							<div>
								<el-button type="primary" @click="buyTask(index)" v-if="item.TaskName=='FBA'">立即购买</el-button>
								<el-button type="primary" @click="wishTask(index)" v-if="item.TaskName=='心愿'">立即购买</el-button>
								<el-button type="primary" @click="problemTask(index)" v-if="item.TaskName=='QA'">立即购买</el-button>
								<el-button type="primary" @click="likesTask(index)" v-if="item.TaskName=='点赞'">立即购买</el-button>
								<el-button type="primary" @click="buyCarTask(index)" v-if="item.TaskName=='加购'">立即购买</el-button>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
		<!-- FBA任务-->
		<el-dialog title="FBA任务" :visible.sync="addTaskModal" width="90%" custom-class="fixed-dialog" :close-on-click-modal="false" :before-close="closeModel" top='5vh'>
			<el-row>
				<div class="mb20">产品信息</div>
			</el-row>
			<el-row>
				<el-col :span="16" :xs="24" :sm="24" :md="24" :lg="16">
					<el-form :model="taskForm" ref="taskForm" :rules="taskRule" class="demo-ruleForm" status-icon>
						<el-row>
							<el-col :span="12" :xs="24">
								<el-form-item label="国家" class="disInline minWid" prop="Country">
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
										<!--<el-option></el-option>-->
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="产品名称" class="disInline minWid">
									<el-input v-model="taskForm.ProductName"></el-input>
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
								<el-form-item>
									<el-rate v-model="taskForm.StarScore"></el-rate>
								</el-form-item>
							</el-col>
						</el-row>
						<div>
							<el-col :span="12" :xs="24" class="fleft">
								<el-form-item label="评论数" class="disInline minWid">
									<el-input type="number" v-model="taskForm.Comments" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24" class="fright">
								<el-form-item label="产品图片" class="disInline">
									<img :src="taskForm.ProductImage" alt="" class="proImg">
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24" class="fleft">
								<el-form-item label="品类排名" class="wid">
									<el-input type="text" v-model="taskForm.ProductRank" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
						</div>
						<el-row>
							<el-col :span="12" :xs="24" class="fleft">
								<el-form-item label="产品链接" class="wid" prop="ProductURL">
									<el-input type="text" v-model="taskForm.ProductURL" placeholder="请以http://或者https://开头"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='12' :xs='24'>
								<el-form-item label='预估月销量' class="wid">
									<el-input type="text" v-model="taskForm.PredictSales" placeholder="请输入预估月销量"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<div class="mt30 mb20">下单信息</div>
						</el-row>
						<el-row>
							<el-col :span="12" :xs="24">
								<el-form-item label="关键词类型">
									<el-radio-group v-model="taskForm.KeywordType">
										<el-radio label="1">产品关键字</el-radio>
										<el-radio label="2">CPC关键字</el-radio>
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
							<el-col :span="12" :xs="24">
								<el-form-item label="搜索关键词" class="disInline minWid" prop="Keyword">
									<el-input v-model="taskForm.Keyword" placeholder='请输入关键词'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="代购数量" class="disInline minWid" prop="OrderNum">
									<el-input v-model="taskForm.OrderNum" @blur="checkBuyNum" placeholder="请输入正整数"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" :xs="24">
								<el-form-item label="留评类型" class="disInline minWid" prop="ServiceType">
									<el-select v-model="taskForm.ServiceType" class="disInline wid100" placeholder="请选择" @change="lpType">
										<el-option v-for="(item,index) in commentTypeData" :key="index" :value="item.ServiceType" :label="item.Service"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="Feedback数量" class="disInline minWid">
									<el-input type="text" required="false" v-model="taskForm.Facebook" placeholder="请输入正整数"></el-input>
									<p><span class="tipRed" v-if="parseInt(this.taskForm.Facebook)>parseInt(this.taskForm.OrderNum) || parseInt(this.taskForm.fbNumber)<0">数量必须小于等于订购数量{{taskForm.buyNum}}</span></p>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="nolp==true">
							<el-col :span="12" :xs="24">
								<el-form-item label="评论图片数量" class="disInline minWid">
									<el-input v-model="taskForm.PicNum" placeholder="请输入正整数"></el-input>
									<div class="el-form-item__error" v-if="parseInt(this.taskForm.PicNum) > parseInt(this.taskForm.OrderNum) || parseInt(this.taskForm.PicNum)>4">
										数量不能超过订购数量并且最大为4</div>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="评论视频数量" class="disInline minWid">
									<el-input type="text" :required="false" v-model="taskForm.VideoNum" placeholder="请输入正整数"></el-input>
									<div class="el-form-item__error" v-if="parseInt(this.taskForm.VideoNum) > parseInt(this.taskForm.OrderNum) || parseInt(this.taskForm.VideoNum)>1">
										数量不能超过订购数量并且最大为1</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" :xs="24">
								<el-form-item label="是否使用优惠券">
									<el-radio-group v-model="taskForm.Coupon">
										<el-radio label="0">不用</el-radio>
										<el-radio label="1">用</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="是否自发货">
									<el-radio-group v-model="taskForm.SelfShip">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="con">
							<el-row :gutter="20">
								<el-col :span="6" :xs="12" :md="7" :lg="5" :xl="6">
									<span class="mb20 disInline">任务开始时间</span>
								</el-col>
								<el-col :span="12" :xs="24" :md="9" :lg="14" :xl="10" class="mb10">
									<el-button type="primary" size="small" @click="oneDay" :disabled="btnTask">一天一单</el-button>
									<el-button type="primary" size="small" @click="twoDay" :disabled="btnTask">一天两单</el-button>
									<el-button type="primary" size="small" @click="threeDay" :disabled="btnTask">一天三单</el-button>
								</el-col>
								<el-col :span="4" :xs="8" :md="6" :lg="3" :xl="6" class="mb10">
									<span>数量</span>
								</el-col>
							</el-row>
							<div v-for="(item,index) in taskForm.OrderSchedule" :key="index" class="mb10">
								<el-row :gutter="20">
									<el-col :xs="24" :sm="8" :md="7" :xl="7" class="mb10">
										<el-form-item :prop="`OrderSchedule[${index}].StartDate`" :rules="{required: true, message: '任务时间不能为空', trigger: 'change'}">
											<el-date-picker style="width: 100%" v-model="item.StartDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="8" :md="8" :xl="7" class="mb10">
										<el-time-picker style="width: 100%" is-range v-model="item.pickTime" value-format='HH:mm' format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }">
										</el-time-picker>
									</el-col>
									<el-col :xs="24" :sm="8" :md="9" :xl="10">
										<el-form-item :prop="`OrderSchedule[${index}].Number`" :rules="{required: true, message: '数量不能为空', trigger: 'change'}">
											<el-input type="text" v-model="item.Number" style="width: 60%" @change="allBuyNum(index)" placeholder="请输入正整数"></el-input>
											<el-button type="danger" size="small" class="delMb" @click="removeTask(item, index)" :disabled="disabled">删除
											</el-button>
										</el-form-item>
										<div class="tipRed mt10" v-if="errorMes">数量不能超过代购总数</div>
									</el-col>
								</el-row>
							</div>
							<el-row class="mb50">
								<el-button @click="addNewTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
							</el-row>
							<el-row>
								<el-form-item label='备注'>
									<el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Memo'></el-input>
								</el-form-item>
							</el-row>
						</div>
					</el-form>
				</el-col>
				<el-col :span="8" :xs="24" :sm="24" :md="24" :lg="8" class="minRight">
					<div class="tabTitle fl mt20 mb20" @click="toggleRate"><i class="el-icon-dish mr10"></i>费率</div>
					<el-table :data="rateData" border style="width: 100%" v-show="rateTab">
						<el-table-column prop="BaseCurrency" label="币种" align="center"></el-table-column>
						<el-table-column prop="TargetCurrency" label="单位" align="center"></el-table-column>
						<el-table-column prop="ExRate" label="汇率" align="center"></el-table-column>
					</el-table>
					<div class="tabTitle zengTit mt20 mb20" @click="toggleAddFree"><i class="el-icon-coin mr10"></i>增值费</div>
					<el-table :data="addFreeData" border style="width: 100%" v-show="addFreeTab">
						<el-table-column prop="productPrice" label="产品价格区间" align="center"></el-table-column>
						<el-table-column prop="UnitPrice" label="增值费价格" align="center"></el-table-column>
					</el-table>
					<div class="tabTitle serviceTit mt20 mb20" @click="toggleService"><i class="el-icon-guide mr10"></i>服务费</div>
					<el-table :data="serviceData" border style="width: 100%" v-show="serviceTab">
						<el-table-column prop="Service" label="服务类型" align="center"></el-table-column>
						<el-table-column prop="CommentRate" label="留评率" align="center" width='100'></el-table-column>
						<el-table-column prop="servicePrice" label="服务费单价" align="center" width='150'></el-table-column>
					</el-table>
				</el-col>
			</el-row>

			<div slot="footer" class="dialog-footer">
				<el-form :model='taskForm' class='txtLeft pl30'>
					<el-row>
						<el-col :span="24" :xs="24">
							<span class="spanTxt">产品总价：</span>
							<span class="colTxt labels fz20">￥{{taskForm.ProductTotal}}</span>
							<span class="labels col9">(产品总价) = 0 (产品价格) * 0 (数量) * 7.3 (汇率)</span>
						</el-col>
					</el-row>
					<span class="spanTxt">服务费：</span>
					<span class="colTxt labels fz20">￥{{taskForm.ServiceFee}}</span>
					<span class="labels col9">(服务费单价) * 0 (数量) + 0 (增值费单价) * 0 (数量)</span>
					<div>
						<span class="spanTxt">合计：</span>
						<span class="colTxt labels fz20">￥{{taskForm.OrderTotal}}</span>
						<span class="labels col9">(产品总价)0.00  + (服务费)0.00 </span>
					</div>
				</el-form>
				<el-button type="primary" size="medium" @click="submitPay('taskForm')">确定</el-button>
				<el-button size="medium" @click="closeModel">返回</el-button>
			</div>
		</el-dialog>
		<!-- 点赞任务-->
		<el-dialog title="点赞任务" :visible.sync="likesModel" width="80%" :close-on-click-modal="false" top='5vh'>
			<el-form :model="likesForm" ref="likesForm" class="demo-ruleForm" :rules="taskRule">
				<el-row>
					<el-form-item label="终端平台">
						<el-radio-group v-model="likesForm.DeviceType">
							<el-radio label="1">PC</el-radio>
							<el-radio label="2">Android</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>
				<el-row>
					<el-col :span="6">
						<span>链接地址</span>
					</el-col>
					<el-col :span="7" class="center">
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
						<el-col :span="6" :xs="24" class="center">
							<el-form-item :prop="`OrderSchedule[${index}].linkURL`" :rules="[{required: true, message: '链接不能为空', trigger: 'blur'},{pattern:  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, message: '请以http://或https://开头', trigger: 'change'}]">
								<el-input type="textarea" v-model="item.linkURL" placeholder="请以http://或https://开头"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8" :xs="24" class="center mb20">
							<el-radio-group v-model="item.ActionType" @change='actionCheck'>
								<el-radio label="1">点赞</el-radio>
								<el-radio label="2">点踩</el-radio>
								<el-radio label="3">Report Abuse</el-radio>
							</el-radio-group>
						</el-col>
						<el-col :span="4" :xs="24" class="center">
							<el-form-item :prop="`OrderSchedule[${index}].Number`" :rules="[{required: true, message: '数量不能为空', trigger: 'blur'},{pattern:  /^\+?[1-9][0-9]*$/, message: '数量不能小于0', trigger: 'change'}]">
								<el-input v-model="item.Number" @change="checkService(index)"></el-input>
							</el-form-item>

						</el-col>
						<el-col :span="2" :xs="24" class="center">
							<span class="servTxt">{{item.fee}}</span>
						</el-col>
						<el-col :span="4" :xs="24" class="center">
							<el-button type="danger" @click="removeLike(item,index)" :disabled="disabled2">删除</el-button>
						</el-col>
					</el-row>
				</div>
				<el-row class="mb120">
					<el-button @click="addLikes"><i class="el-icon-circle-plus-outline"></i>新增点赞任务</el-button>
				</el-row>
			</el-form>
			<div slot='footer' class="dialog-footer">
				<div class="txtLeft">
					<span class="spanTxt">合计：</span>
					<span class="colTxt labels fz20">￥{{likesForm.OrderTotal}}</span>
				</div>
				<el-button type="primary" @click="confirLikeForm('likesForm')">确定</el-button>
				<el-button @click="likesModel=false">返回</el-button>
			</div>
		</el-dialog>
		<!-- 购物车任务-->
		<el-dialog title="购物车任务" :visible.sync="buyCarModel" width="60%" :close-on-click-modal="false" :before-close="closeModel" top='5vh'>
			<div>
				<el-row>
					<div class="mb20">产品信息</div>
				</el-row>
			</div>
			<el-form :model="taskForm" ref="taskForm" class="demo-ruleForm" :rules="taskRule">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="国家" class="disInline minWid" prop="Country">
							<el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
								<el-option v-for="(item,index) in countryData" :key="item.Code" :value="index" :label="item.Country"></el-option>
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
							<el-select v-model="taskForm.ShopName" placeholder="请选择" class="disInline wid100"></el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品名称" class="disInline minWid">
							<el-input v-model="taskForm.ProductName"></el-input>
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
						<el-form-item>
							<el-rate v-model="taskForm.StarScore"></el-rate>
						</el-form-item>
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
					<el-col :span="12" :xs="24" class="fleft">
						<el-form-item label="品类排名" class="disInline wid">
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
				<el-form-item label="下单信息"></el-form-item>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="加购方式">
							<el-radio-group v-model="taskForm.KeywordType" @change="platFormCar">
								<el-radio label="1" class="mb10 mt10">关键词加购</el-radio>
								<el-radio label="2">CPC关键词加购</el-radio>
								<el-radio label="3">链接加购</el-radio>
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
					<el-col :span="12" :xs="24" v-if="searchType==false">
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
						<el-form-item label="数量" class="disInline minWid" prop="OrderNum">
							<el-input v-model="taskForm.OrderNum" @blur="checkBuyNum" placeholder="请输入正整数"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="con">
					<el-row>
						<el-col :span="7" :xs="13" :sm="6" :md="8" :lg="6">
							<span class="mb20 disInline">任务开始时间</span>
						</el-col>
						<el-col :span="10" :xs="24" :sm="12" :md="8" :lg="8">
							<el-button type="primary" size="small" @click="oneDay" :disabled="btnTask">一天一单</el-button>
							<el-button type="primary" size="small" @click="twoDay" :disabled="btnTask">一天两单</el-button>
							<el-button type="primary" size="small" @click="threeDay" :disabled="btnTask">一天三单</el-button>
						</el-col>
						<el-col :span="6" :xs="9" :sm="6" :md="8" :lg="10" class="mt10 mb10">
							<span>数量</span>
						</el-col>
					</el-row>
					<div v-for="(item,index) in taskForm.OrderSchedule" :key="index" class="mb10">
						<el-row :gutter="20">
							<el-col :span="7" :xs="24" :sm="7" :md="8" :lg="5">
								<el-form-item :prop="`OrderSchedule[${index}].StartDate`" :rules="{ required: true, message: '任务开始时间不能为空', trigger: 'change' }">
									<el-date-picker style="width:100%;" v-model="item.StartDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="7" :xs="24" :sm="7" :md="8" :lg="7" class="mb10">
								<el-time-picker style="width: 100%;" is-range v-model="item.pickTime" value-format='HH:mm' format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }">
								</el-time-picker>
							</el-col>
							<el-col :span="10" :xs="24" :sm="10" :md="8" :lg="10">
								<el-form-item :prop="`OrderSchedule[${index}].Number`" :rules="{ required: true, message: '数量不能为空', trigger: 'change' }">
									<el-input type="text" v-model="item.Number" style="width: 60%;" @change="allBuyNum(index)" placeholder="请输入正整数"></el-input>
									<el-button type="danger" size="small" @click="removeBuyCarTask(item, index)" :disabled="disabled">删除
									</el-button>
								</el-form-item>
								<div class="tipRed mt10" v-if="errorMes">数量不能超过订购数量</div>
							</el-col>
						</el-row>
					</div>
					<el-row class="mb20">
						<el-button @click="addCarNewTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
					</el-row>
					<el-row>
						<el-form-item label='备注'>
							<el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Memo'></el-input>
						</el-form-item>
					</el-row>
				</div>
			</el-form>
			<div slot='footer' class="dialog-footer">
				<div class="txtLeft">
					<span class="spanTxt">服务费：</span>
					<span class="colTxt labels fz20">￥{{taskForm.ServiceFee}}</span>
					<span class="labels col9">(服务费单价) 0 * 0 (数量) + 0 (CPC服务费) * (数量)</span>
				</div>
				<el-button type="primary" size="medium" @click="buyCarComfir('taskForm')">确定</el-button>
				<el-button size="medium" @click="closeModel">返回</el-button>
			</div>
		</el-dialog>
		<!-- QA任务-->
		<el-dialog title="QA任务" :visible.sync="QAtaskModel" width="75%" :close-on-click-modal="false" top='5vh'>
			<el-form :model="QaForm" class="demo-ruleForm">
				<el-form-item label="终端类型">
					<el-radio-group v-model="QaForm.DeviceType" @change='checkPlat'>
						<el-radio label="1">PC</el-radio>
						<el-radio label="2">Android</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-radio-group v-model="QaForm.QAType" @change="selectQA">
						<el-radio label="1">我要提问</el-radio>
						<el-radio label="2">我要回答</el-radio>
					</el-radio-group>
				</el-form-item>
				<div class="problem" v-show="QaType===true">
					<div class="con">
						<el-form :model="problemForm" ref="problemForm">
							<el-row :gutter="20">
								<el-col :span="4" :xs="5" class="mb20">
									<span>国家</span>
								</el-col>
								<el-col :span="4" :xs="6">
									<span>产品ASIN</span>
								</el-col>
								<el-col :span="6" :xs="5">
									<span>问题</span>
								</el-col>
								<el-col :span="5" :xs="5">
									<span>时间</span>
								</el-col>
								<el-col :span="3" :xs="3">
									<span>服务费</span>
								</el-col>
							</el-row>
							<div v-for="(item,index) in problemForm.problemData" :key="index" class="mb20">
								<el-row :gutter="20">
									<el-col :span="4" :xs="24">
										<el-form-item :prop="`problemData[${index}].Country`" :rules="[{required: true, message: '请选择国家', trigger: 'change'}]">
											<el-select placeholder="请选择" v-model="item.Country" class="wid100 mb20" @change="QaCountry(index)">
												<el-option v-for="(item,index) in countryData" :key="item.Code" :value="item.Code" :label="item.Country"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="4" :xs="24">
										<el-form-item :prop="`problemData[${index}].ASIN`" :rules="[{required: true, message: '产品ASIN不能为空', trigger: 'change'}]">
											<el-input v-model="item.ASIN" maxlength="10" show-word-limit placeholder="长度为10的数字和字母" class="disInline wid100 mb20"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6" :xs="24">
										<el-form-item :prop="`problemData[${index}].Question`" :rules="[{required: true, message: '请输入问题', trigger: 'change'}]">
											<el-input type="textarea" v-model="item.Question" class="disInline" placeholder="请输入问题"></el-input>

										</el-form-item>
									</el-col>
									<el-col :span='5' :xs="24">
										<el-form-item :prop="`problemData[${index}].StartDate`" :rules="[{required: true, message: '请选择日期', trigger: 'change'}]">
											<el-date-picker v-model="item.StartDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" :picker-options="pickerOptions0">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span='4' :xs='24'>
										<span style="display: inline-block;width: 80px;">{{item.fee}}</span>
										<el-button type="danger" size="small" class="delMb mt10" @click="removeProblemTask(item, index)" :disabled="disabled2">删除
										</el-button>
									</el-col>
								</el-row>
							</div>
							<el-row class="mb120">
								<el-button @click="addproblemTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
							</el-row>
							<div class="footer txtRight">
								<div class="txtLeft">
									<span class="spanTxt">服务费：</span>
									<span class="colTxt labels fz20">￥{{problemForm.OrderTotal}}</span>
								</div>
								<el-button type="primary" @click="problemComfir('problemForm')">确定</el-button>
								<el-button @click="QAtaskModel=false">返回</el-button>
							</div>
						</el-form>
					</div>
				</div>
				<div class="answer" v-show="QaType === false">
					<div class="con">
						<el-form :model="answerForm" ref="answerForm" status-icon>
							<el-row :gutter="20">
								<el-col :span="4" :xs="5" class="mb20">
									<span>国家</span>
								</el-col>
								<el-col :span="5" :xs="5">
									<span>问题链接</span>
								</el-col>
								<el-col :span="5" :xs="6">
									<span>回答</span>
								</el-col>
								<el-col :span="5" :xs="5">
									<span>时间</span>
								</el-col>
								<el-col :span="3" :xs="3">
									<span>服务费</span>
								</el-col>
							</el-row>
							<div v-for="(item,index) in answerForm.answerData" :key="index" class="mb20">
								<el-row :gutter="20">
									<el-col :span="4" :xs="24">
										<el-form-item :prop="`answerData[${index}].Country`" :rules="{required: true, message: '请选择国家', trigger: 'change'}">
											<el-select placeholder="请选择" v-model="item.Country" class="wid100">
												<el-option v-for="(item,index) in countryData" :key="item.Code" :value="item.Code" :label="item.Country"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="5" :xs="24">
										<el-form-item class="wid100" :prop="`answerData[${index}].address`" :rules="{required: true, message: '请输入问题链接', trigger: 'change'}">
											<el-input type='textarea' v-model="item.address" placeholder="请输入问题链接"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="5" :xs="24">
										<el-form-item :prop="`answerData[${index}].Answer`" :rules="{required: true, message: '请输入回答', trigger: 'change'}">
											<el-input type="textarea" v-model="item.Answer" class="disInline" placeholder="请输入回答"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='5' :xs="24">
										<el-form-item>
											<el-date-picker v-model="item.StartDate" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" :picker-options="pickerOptions0">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span='3' :xs='24'>
										<span style="display: inline-block;width: 80px;">{{item.fee}}</span>
										<el-button type="danger" size="small" class="delMb mt10" @click="removeAnswerTask(item, index)" :disabled="disabled3">删除
										</el-button>
									</el-col>
								</el-row>
							</div>
							<el-row class="mb120">
								<el-button @click="addAnswerTask"><i class="el-icon-circle-plus-outline"></i>添加新任务</el-button>
							</el-row>
							<div class="footer txtRight">
								<div class="txtLeft">
									<span class="spanTxt">服务费：</span>
									<span class="colTxt labels fz20">￥{{answerForm.OrderTotal}}</span>
								</div>
								<el-button type="primary" size="medium" @click="answerComfir('answerForm')">确定</el-button>
								<el-button size="medium" @click="QAtaskModel=false">返回</el-button>
							</div>
						</el-form>
					</div>
				</div>
			</el-form>
		</el-dialog>
		<!-- 心愿任务-->
		<el-dialog title="心愿任务" :visible.sync="wishModel" width="60%" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="taskForm" class="demo-ruleForm" ref="taskForm" :rules="taskRule">
				<div class="mb20">产品信息</div>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="国家" class="disInline minWid" prop="Country">
							<el-select v-model="taskForm.Country" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
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
							<el-input v-model="taskForm.ProductName"></el-input>
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
				<el-form-item label="下单信息"></el-form-item>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="关键词类型">
							<el-radio-group v-model="taskForm.KeywordType" @change="searchBtn">
								<el-radio label="1" class="min10">产品关键字</el-radio>
								<el-radio label="2" class="min10">CPC关键字</el-radio>
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
							<el-input v-model="taskForm.Keyword" placeholder='请输入关键词'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24" v-show="searchType">
						<el-form-item label="链接" class="disInline wid">
							<el-input type="textarea" v-model="taskForm.LinkURL" placeholder='请输入链接'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="代购数量" class="disInline minWid" prop="OrderNum">
							<el-input type="text" v-model="taskForm.OrderNum" @change="checkBuyNum" placeholder="请输入正整数"></el-input>
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
						<el-col :span="7" :md="6" :sm="6" :lg="8" :xl="8" class="mb10">
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
									<el-input type="text" v-model="item.Number" style="width: 60%;" placeholder="请输入正整数" @blur="allBuyNum(index)"></el-input>
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
					<el-row>
						<el-form-item label='备注'>
							<el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Memo'></el-input>
						</el-form-item>
					</el-row>
				</div>
				<!--<el-form-item label="服务费">
					<span class="colTxt labels">￥{{taskForm.serviceCharge}}</span>
					<span class="labels col9">(服务费单价) * 0 (数量) + 0 (增值费单价) * 0 (数量)</span>
				</el-form-item>
				<el-form-item style="display: block">

				</el-form-item>-->
			</el-form>
			<div slot='footer' class="dialog-footer">
				<div class="txtLeft">
					<span class="spanTxt">合计：</span>
					<span class="colTxt labels fz20">￥{{taskForm.OrderTotal}}</span>
					<span class="labels col9">(服务费单价) * 0 (数量) + 0 (增值费单价) * 0 (数量)</span>
				</div>
				<el-button type="primary" size="medium" @click="wishComfir('taskForm')">确定</el-button>
				<el-button @click="closeModel" size="medium">返回</el-button>
			</div>
		</el-dialog>
		<!-- 填写评价-->
		<el-dialog title="评价" :visible.sync="assessModel" width="45%" :close-on-click-modal="false" center="">
			<el-form :model="assessForm">
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
					<div>
						<img v-for="(item,index) in imgsData" :key='index' :src="item" alt="" class='comImg' />
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
					</div>
					<input name="files" type="file" ref='files' style='display: none;' @change="uploadVideo" />
					<span @click='openVideo' class="fileBtn">选择视频</span>
				</el-form-item>
			</el-form>
			<span slot='footer' class='dialog-footer'>
				<el-button type="primary" size="medium" @click='evalEditSubmit'>确认</el-button>
				<el-button @click="assessModel=false" size="medium">取消</el-button>
			</span>
		</el-dialog>
		<!-- 日志-->
		<el-dialog title="日志" :visible.sync="dailyModel" :close-on-click-modal="false">
			<el-timeline :reverse="reverse">
				<el-timeline-item v-for="(item, index) in activities" :key="index" :timestamp="item.timestamp">
					{{item.ActionName}}{{item.ActDate}}
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
						<el-button type='warning' v-if='parseInt(this.paymentForm.payMoney)>parseInt(this.paymentForm.balance)' @click='toRecharge'>去充值</el-button>
					</el-col>

				</el-row>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click='paymentOrder' v-if='parseInt(this.paymentForm.payMoney)<parseInt(this.paymentForm.balance) && this.hasBalance==0'>确定</el-button>
				<el-button type="primary" @click='paymentOrderList' v-else>确定</el-button>
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
		<!--QA查看详情-->
		<el-dialog title='详情' :visible.sync='QaViewDetailsModal' width="70%">
			<qa-task :viewTaskData="viewTaskData"></qa-task>
			<span slot='footer' class="dialog-footer">
				<el-button type='primary' @click='QaViewDetailsModal=false'>返回</el-button>
			</span>
		</el-dialog>
		<!--点赞查看详情-->
		<el-dialog title='详情' :visible.sync='likeViewDetailModal' width="70%">
			<like-task :viewTaskData="viewTaskData"></like-task>
			<span slot='footer' class="dialog-footer">
				<el-button type='primary' @click='likeViewDetailModal=false'>返回</el-button>
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
	export default {
		name: 'taskManage',
		data() {
			return {
				imgTip: false, //上传图片失败提示
				videoSuccess: false, //视频上传成功
				imgsData: [], //评论上传图片
				fileId: '',
				OrderId: '', //任务ID
				Amount: '',
				uploadUrl: this.GLOBAL.BASE_URL + '/api/doFileUpload',
				BaseTaskType: 1, //任务列表类型
				addBuyData: [], //加购列表
				wishListData: [], //心愿列表
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
				pageSize: '0',
				btnTask: false,
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
				active: 1,

				QaType: true,
				allNum: 0,
				dailyModel: false,
				searchType: false,
				disabled: true,
				disabled2: true,
				disabled3: true,
				likesModel: false,
				buyCarModel: false,
				QAtaskModel: false,
				wishModel: false,
				assessModel: false,
				addTaskModal: false,
				taskTypeModel: false,
				errorMes: false,
				nolp: true,
				startTime: '',
				buyNumData: [],
				pickerOptions0: this.startDate(),
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				rateData: [], // 费率
				addFreeData: [], // 增值费
				serviceData: [], // 服务费
				serviceTab: false, // 服务费显示隐藏
				addFreeTab: false, // 服务费显示隐藏
				rateTab: true, // 服务费显示隐藏
				paymentForm: {
					balance: 10,
					payMoney: 2,
				},
				countryData: [],
				searchForm: {
					PlatformId: '1',
					Keyword: '',
					orderStartTime: '',
					orderEndTime: '',
					BaseTaskType: '1'
				},
				assessForm: {
					assessValue: null,
					proTitle: '',
					proCon: '',
					PicIds: [],
					VideoIds: ''
				},
				problemForm: {
					OrderTotal: 10,
					problemData: [{
						Country: '',
						ASIN: '',
						Question: '',
						StartDate: '',
						QAType: 1,
						fee: 10,
						Currency: '',
						Answer: ''
					}]
				},
				answerForm: {
					OrderTotal: 10,
					answerData: [{
						Country: '',
						address: '',
						Answer: '',
						startTime: '',
						QAType: 2,
						fee: 10,
						Currency: '',
						Question: ''
					}]
				},

				taskData: [{
					startTime: '',
					pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
					numbers: ''
				}],
				buyCarData: [{
					startTime: '',
					pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
					numbers: ''
				}],
				wishData: [{
					startTime: '',
					pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
					numbers: ''
				}],
				activeName: 'first',
				taskType: 'all',

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
				taskForm: {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: 1,
					Platform: '亚马逊',
					baseTaskId: 1,
					baseTaskType: 1,
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
					//					TerminalPlatform: 'PC',
					Keyword: '', //搜索关键词
					OrderNum: 0, //代购数量
					ServiceType: '', //留评类型
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
				QaForm: {
					PlatformId: 0,
					Platform: '',
					DeviceType: '1', //设备平台类型
					QAType: '1', //QA类型
					QaTypeId: 1,
					QAFee: 10,
					baseTaskId: 5,
					baseTaskType: 5,
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
					ProductRank: 8, //品类排名
					KeywordType: '1', //关键词类型
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
					OrderTotal: 0,
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
					Country: [{
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
					Facebook: [{
						required: false,
						message: '请输入关键字',
						trigger: 'change'
					}, {
						validator: vali.checkNum,
						trigger: 'change'
					}],
					VideoNum: [{
						validator: vali.checkNum,
						trigger: 'change'
					}],
					PicNum: [{
						validator: vali.checkNum,
						trigger: 'change'
					}],
					ServiceType: [{
						required: true,
						message: '请选择留评类型',
						trigger: 'change'
					}],
					proService: [{
							required: true,
							message: '请输入数量',
							trigger: 'change'
						},
						{
							validator: vali.checkNum,
							trigger: 'change'
						}
					],
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
		components: {
			viewTask,
			qaTask,
			likeTask
		},
		created() {
			this.getAllData(1)
			//			this.getTaskLeng()
			this.getDate()
			this.getError()
			let status = this.status
			if(status) {
				this.taskTypeModel = true
			} else {
				this.taskTypeModel = false
			}
		},
		methods: {
			//任务类型搜索
			checkTask(value) {
				let _this = this
				_this.BaseTaskType = value
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
			//列表确认付款
			payMent(index, row) {
				let _this = this
				_this.paymentModel = true
				_this.hasBalance = 1
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount
			},
			//付款确认按钮
			paymentOrderList() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(1, orderId, Amount)
			},
			//申请退款弹窗
			refundBtn(index, row) {
				let _this = this
				_this.refundModal = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount
			},
			//退款确定
			retuenSubmit() {
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(8, orderId, Amount)
			},
			//确认完成弹窗
			confirmBtn(index, row) {
				let _this = this
				_this.submitModal = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount
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
				_this.active = 1
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: parseInt(_this.searchForm.PlatformId),
					BaseTaskType: parseInt(value),
					Status: 1,
					Page: 1,
					offset: 10
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderList', param).then((res) => {
					if(res.data.status == 200) {
						let len = res.data.data.RstList
						for(let i = 0; i < len.length; i++) {
							let plat = len[i].Platform
							let country = len[i].Country
							len[i].Platform = plat + '/' + country
						}
						_this.allOrderData = res.data.data.RstList
						_this.allNum = res.data.data.length
						_this.loading = false
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: res.data.message
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
								_this.OrderId = res.data.OrderId
								_this.paymentModel = true
								_this.likesModel = false
								_this.$refs['likesForm'].resetFields()
								_this.getAllData(4)
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
			// 重置
			resetTask() {
				let _this = this
				//				 this.$refs[formName].resetFields()
				_this.formAll = {
					resource: '全部',
					name: '',
					orderStartTime: '',
					orderEndTime: ''
				}
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
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
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
				_this.taskForm.OrderSchedule[0].StartDate = startTime
				let t = _this.taskForm.OrderSchedule[0].pickTime
				console.log(t)
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
						_this.taskForm.OrderSchedule[item - 1].Number = parseInt(num) - parseInt(result)
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
				let pickTimes = _this.taskForm.OrderSchedule[0].StartDate
				let len = _this.taskForm.OrderSchedule.length
				for(let i = 0; i < len; i++) {
					_this.taskForm.OrderSchedule[i].StartDate = pickTimes
				}
			},
			// 新增一行任务
			addNewTask() {
				let _this = this
				_this.taskForm.OrderSchedule.push({
					StartDate: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
				})
				let len = _this.taskForm.OrderSchedule.length
				if(len > 1) {
					_this.disabled = false
				}
			},
			// 删除一项任务
			removeTask(item, index) {
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
			// 代购数量为1
			checkBuyNum() {
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
			wishCheckBuyNum() {
				let _this = this
				let nums = _this.taskForm.OrderNum
				if(parseInt(nums) === 1) {
					_this.btnTask = true
					_this.taskForm.OrderSchedule[0].Number = 1
				} else {
					_this.btnTask = false
					_this.taskForm.OrderSchedule[0].Number = ''
				}
			},
			// 付款关闭页面
			paymentClose() {
				let _this = this
				_this.paymentModel = false
				_this.hasBalance = 0
			},
			// 创建任务提交订单到支付
			submitPay(formName) {
				let _this = this
				let errorMes = _this.errorMes
				_this.$refs[formName].validate((valid) => {
					if(valid && !errorMes) {
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
								_this.OrderId = res.data.OrderId
								_this.paymentModel = true
								_this.addTaskModal = false
								_this.$refs['taskForm'].resetFields()
								_this.getAllData(1)
							} else {
								console.log(res.data.message)
							}
						})
					}
				})
			},
			//购物车任务提交
			buyCarComfir(formName) {
				let _this = this
				let errorMes = _this.errorMes
				_this.$refs[formName].validate((valid) => {
					if(valid && !errorMes) {
						let len = _this.taskForm.OrderSchedule
						for(let i = 0; i < len.length; i++) {
							console.log(len[i].pickTime.length)
							len[i].StartHourMin = len[i].pickTime[0]
							len[i].EndHourMin = len[i].pickTime[1]
						}
						let pick = _this.taskForm.OrderSchedule.pickTime
						_this.taskForm.ServiceType=0
						let param = Object.assign({}, _this.taskForm)
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.OrderId = res.data.OrderId
								_this.getAllData(2)
								_this.paymentModel = true
								_this.buyCarModel = false
								_this.$refs['taskForm'].resetFields()
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录!'
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
					}
				})
			},
			//心愿订单任务提交
			wishComfir(formName) {
				let _this = this
				let errorMes = _this.errorMes
				_this.$refs[formName].validate((valid) => {
					if(valid && !errorMes) {
						let len = _this.taskForm.OrderSchedule
						for(let i = 0; i < len.length; i++) {
							console.log(len[i].pickTime.length)
							len[i].StartHourMin = len[i].pickTime[0]
							len[i].EndHourMin = len[i].pickTime[1]
						}
						_this.taskForm.ServiceType=0
						let param = Object.assign({}, _this.taskForm)
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.OrderId = res.data.OrderId
								_this.paymentModel = true
								_this.wishModel = false
								_this.$refs['wishForm'].resetFields()
								_this.getAllData(3)
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录!'
								})
								sessionStorage.clear()
								_this.$router.push({
									name: 'index',
									params: {
										indexShow: false
									}
								})
							} else {
								console.lor(res.data.message)
							}
						})
					}
				})
			},
			// QA任务问题提交
			problemComfir(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						let param = {
							SessionId: sessionStorage.getItem('sessionid'),
							PlatformId: parseInt(_this.QaForm.PlatformId),
							Platform: _this.QaForm.Platform,
							baseTaskId: _this.QaForm.baseTaskId,
							baseTaskType: _this.QaForm.baseTaskType,
							QAType: parseInt(_this.QaForm.QaTypeId),
							OrderSchedule: _this.problemForm.problemData,
							OrderTotal: _this.problemForm.OrderTotal,
							baseTaskType: _this.QaForm.baseTaskType,
							Country: _this.QaForm.Country, //国家
							ASIN: _this.QaForm.ASIN, //产品ASIN
							ShopName: _this.QaForm.ShopName, //店铺名称
							ProductName: _this.QaForm.ProductName, //产品名称
							Price: _this.QaForm.Price, //价格
							Currency: _this.QaForm.Currency, //货币符号
							Comments: parseInt(_this.QaForm.Comments), //评论数
							StarScore: _this.QaForm.StarScore, //评分
							ProductURL: _this.QaForm.ProductURL, //产品链接
							PredictSales: _this.QaForm.PredictSales, //预估月销量
							ProductImage: _this.QaForm.ProductImage, //产品图片
							ProductRank: parseInt(_this.QaForm.ProductRank), //品类排名
							KeywordType: parseInt(_this.QaForm.KeywordType), //关键词类型
							Keyword: _this.QaForm.Keyword, //搜索关键词
							OrderNum: parseInt(_this.QaForm.OrderNum), //代购数量
							ServiceType: parseInt(_this.QaForm.ServiceType), //留评类型
							Facebook: _this.QaForm.Facebook, //feedback数量
							PicNum: _this.QaForm.PicNum, //评论图片数量
							VideoNum: _this.QaForm.VideoNum, //评论视频数量
							Coupon: parseInt(_this.QaForm.Coupon), //是否使用优惠券
							SelfShip: parseInt(_this.QaForm.SelfShip), //是否自发货
							ProductTotal: _this.QaForm.ProductTotal, //产品总价
							ServiceFee: _this.QaForm.ServiceFee, //服务费
							LinkURL: _this.QaForm.LinkURL, //链接
							Memo: _this.QaForm.Memo
						}
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.OrderId = res.data.OrderId
								_this.getAllData(5)
								_this.paymentModel = true
								_this.QAtaskModel = false
								_this.$refs['problemForm'].resetFields()
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录!'
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
					}
				})
			},
			// QA任务回答提交
			answerComfir(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {

						let param = {
							SessionId: sessionStorage.getItem('sessionid'),
							PlatformId: parseInt(_this.QaForm.PlatformId),
							Platform: _this.QaForm.Platform,
							baseTaskId: _this.QaForm.baseTaskId,
							baseTaskType: _this.QaForm.baseTaskType,
							QAType: parseInt(_this.QaForm.QaTypeId),
							OrderSchedule: _this.answerForm.answerData,
							OrderTotal: _this.problemForm.OrderTotal,
							baseTaskType: _this.QaForm.baseTaskType,
							Country: _this.QaForm.Country, //国家
							ASIN: _this.QaForm.ASIN, //产品ASIN
							ShopName: _this.QaForm.ShopName, //店铺名称
							ProductName: _this.QaForm.ProductName, //产品名称
							Price: _this.QaForm.Price, //价格
							Currency: _this.QaForm.Currency, //货币符号
							Comments: parseInt(_this.QaForm.Comments), //评论数
							StarScore: _this.QaForm.StarScore, //评分
							ProductURL: _this.QaForm.ProductURL, //产品链接
							PredictSales: _this.QaForm.PredictSales, //预估月销量
							ProductImage: _this.QaForm.ProductImage, //产品图片
							ProductRank: parseInt(_this.QaForm.ProductRank), //品类排名
							KeywordType: parseInt(_this.QaForm.KeywordType), //关键词类型
							Keyword: _this.QaForm.Keyword, //搜索关键词
							OrderNum: parseInt(_this.QaForm.OrderNum), //代购数量
							ServiceType: parseInt(_this.QaForm.ServiceType), //留评类型
							Facebook: _this.QaForm.Facebook, //feedback数量
							PicNum: _this.QaForm.PicNum, //评论图片数量
							VideoNum: _this.QaForm.VideoNum, //评论视频数量
							Coupon: parseInt(_this.QaForm.Coupon), //是否使用优惠券
							SelfShip: parseInt(_this.QaForm.SelfShip), //是否自发货
							ProductTotal: _this.QaForm.ProductTotal, //产品总价
							ServiceFee: _this.QaForm.ServiceFee, //服务费
							LinkURL: _this.QaForm.LinkURL, //链接
							Memo: _this.QaForm.Memo
						}
						_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
							if(res.data.status == 200) {
								_this.$message({
									type: 'success',
									message: res.data.message
								})
								_this.OrderId = res.data.OrderId
								_this.getAllData(5)
								_this.paymentModel = true
								_this.QAtaskModel = false
								_this.$refs['answerForm'].resetFields()
							}
							if(res.data.status == 400) {
								_this.$message({
									type: 'error',
									message: '登录过期，请重新登录!'
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
				m = m < 10 ? "0" + m : m
				d = d < 10 ? "0" + d : d
				let startTime = y + '-' + m + '-' + d
				_this.taskForm.OrderSchedule[0].StartDate = startTime
				//				_this.buyCarData[0].startTime = startTime
				//				_this.wishData[0].startTime = startTime
			},
			// 取消
			cancelHandel(index, row) {
				let _this = this
				_this.cancelModal = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount
			},
			//取消确定
			cancelSubmit() {
				let _this = this
				let orderId = _this.orderId
				let Amount = _this.Amount
				_this.orderAction(1, orderId, Amount)
			},
			// 删除弹窗
			delhandel(index, row) {
				let _this = this
				_this.delModel = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount
			},
			//删除确定
			delSubmit() {
				let _this = this
				let orderId = _this.OrderId
				let Amount = _this.Amount
				_this.orderAction(5, orderId, Amount)
			},
			//取消退款弹窗
			cancelRefundBtn(index, row) {
				let _this = this
				_this.cancelRefundModal = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount

			},
			//取消退款确定
			cancelRefund() {
				let _this = this
				let orderId = _this.orderId
				let Amount = _this.Amount
				_this.orderAction(9, orderId, Amount)
			},
			// 日志
			viewDaily(index, row) {
				let _this = this
				_this.dailyModel = true
				let orderId = _this.allOrderData[index].Id
				let Amount = _this.allOrderData[index].TaskAmount
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
			// 待购买
			daiBuy() {
				let _this = this
				_this.active = 2
				_this.allOrderData = []
			},
			//待付款
			daiPay() {
				let _this = this
				_this.active = 3
				_this.allOrderData = []
			},
			// 待发货
			daifh() {
				let _this = this
				_this.active = 4
				_this.allOrderData = []
			},
			// 待收货
			daish() {
				let _this = this
				_this.active = 5
				_this.allOrderData = []
			},
			// 待评价
			daipj() {
				let _this = this
				_this.active = 6
				_this.allOrderData = []
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 7
				_this.allOrderData = []
			},
			// 已取消
			daiCancel() {
				let _this = this
				_this.active = 8
				_this.allOrderData = []
			},
			// 异常
			errData() {
				let _this = this
				_this.active = 9
				_this.allOrderData = []
			},
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
			// FB任务弹窗返回按钮
			closeModel() {
				let _this = this
				_this.addTaskModal = false
				_this.disabled = true
				_this.buyCarModel = false
				_this.wishModel = false
			},
			// 心愿任务关闭弹窗
			closeModelWish() {
				let _this = this
				_this.wishModel = false
				_this.disabled = true
			},
			// 购物车加购平台选择
			platFormCar() {
				let _this = this
				let forms = _this.taskForm.KeywordType
				if(forms === '链接加购') {
					_this.searchType = true
				} else {
					_this.searchType = false
				}
			},
			// 心愿任务代购数量
			checkNums(index) {
				let _this = this
				_this.index = index
				let buyNum = _this.wishForm.buyNum
				let taskTime = _this.wishData
				var result = 0
				for(let i = 0; i < taskTime.length; i++) {
					result += parseInt(taskTime[i].numbers)
				}
				if(result > buyNum) {
					_this.errorMes = true
					return false
				} else {
					_this.errorMes = false
				}
			},
			// FB任务代购数量
			allBuyNum(index) {
				let _this = this
				_this.index = index
				let buyNum = _this.taskForm.OrderNum
				let taskTime = _this.taskForm.OrderSchedule
				var result = 0
				for(let i = 0; i < taskTime.length; i++) {
					result += parseInt(taskTime[i].Number)
				}
				console.log(result)
				if(parseInt(result) > parseInt(buyNum)) {
					_this.errorMes = true
					return false
				} else {
					_this.errorMes = false
				}
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
			// 填写评价
			evalEdit(index, row) {
				let _this = this
				_this.assessModel = true
				_this.OrderId = _this.allOrderData[index].Id
				_this.Amount = _this.allOrderData[index].TaskAmount

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
			// 服务费显示与隐藏
			toggleService() {
				let _this = this
				let tabs = _this.serviceTab
				if(tabs) {
					_this.serviceTab = false
				} else {
					_this.serviceTab = true
				}
			},
			// 增值费显示与隐藏
			toggleAddFree() {
				let _this = this
				let tabs = _this.addFreeTab
				if(tabs) {
					_this.addFreeTab = false
				} else {
					_this.addFreeTab = true
				}
			},
			// 汇率显示与隐藏
			toggleRate() {
				let _this = this
				let tabs = _this.rateTab
				if(tabs) {
					_this.rateTab = false
				} else {
					_this.rateTab = true
				}
			},
			// 留评类型
			lpType(index) {
				let _this = this
				let lp = _this.commentTypeData[index].Service
				console.log(lp)
				if(lp === '不留评') {
					_this.nolp = false
				} else {
					_this.nolp = true
				}
			},
			// 心愿任务弹窗
			wishTask(index) {
				let _this = this
				_this.wishModel = true
				let indexs = index
				_this.intoNewTask(indexs)
				_this.taskForm.BaseTaskType = 3
				_this.taskForm.baseTaskId = 3
			},
			// 选择QA任务类型
			selectQA(value) {
				let _this = this
				_this.QaForm.QaTypeId = value
				let qa = _this.QaForm.QAType
				if(qa === '我要提问') {
					_this.QaType = true
					_this.QaForm.QaTypeId = 1
					_this.problemForm.QAType = 1
				} else if(qa === '我要回答') {
					_this.QaType = false
					_this.QaForm.QaTypeId = 2
					_this.answerForm.QAType = 2
				}
			},

			// QA任务我要回答新增一行
			addAnswerTask() {
				let _this = this
				_this.answerForm.answerData.push({
					Country: '',
					ASIN: '',
					Answer: '',
					fee: _this.answerForm.answerData[0].fee
				})
				let len = _this.answerForm.answerData.length
				_this.answerForm.ServiceFee = len * _this.QaForm.QAFee
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
				let newLen = _this.problemForm.problemData.length
				_this.answerForm.ServiceFee = newLen * _this.QaForm.QAFee
				if(newLen <= 1) {
					_this.disabled3 = true
				}
			},
			// 购物车任务
			buyCarTask(index) {
				let _this = this
				_this.buyCarModel = true
				let indexs = index
				_this.intoNewTask(indexs)
				_this.taskForm.baseTaskId = 2
				_this.taskForm.baseTaskType = 2
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
				if(newLen <= 1) {
					_this.disabled2 = true
				}
			},
			getTaskLeng() {
				let _this = this
				let len = _this.taskData.length
				if(len === 1) {
					_this.disabled = true
				}
			},
			// QA任务我要提问新增一行
			addproblemTask() {
				let _this = this
				_this.problemForm.problemData.push({
					Country: '',
					ASIN: '',
					Question: '',
					fee: _this.problemForm.problemData[0].fee
				})
				let len = _this.problemForm.problemData.length
				_this.problemForm.OrderTotal = len * _this.problemForm.problemData[0].fee
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
				let newLen = _this.problemForm.problemData.length
				_this.problemForm.OrderTotal = newLen * _this.problemForm.problemData[0].fee
				if(newLen <= 1) {
					_this.disabled2 = true
				}
			},
			// 心愿任务新增一行
			addWishTask() {
				let _this = this
				_this.taskForm.OrderSchedule.push({
					StartDate: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
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
			// 购物车任务新增一行
			addCarNewTask() {
				let _this = this
				_this.taskForm.OrderSchedule.push({
					StartDate: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
				})
				let len = _this.taskForm.OrderSchedule.length
				if(len > 1) {
					_this.disabled = false
				}
			},
			// 购物车任务删除一行
			removeBuyCarTask(item, index) {
				let _this = this
				_this.index = _this.taskForm.OrderSchedule.indexOf(item)
				let len = _this.taskForm.OrderSchedule.length
				console.log(len)
				if(index !== -1) {
					_this.taskForm.OrderSchedule.splice(index, 1)
				}
				if(len <= 2) {
					_this.disabled = true
				}
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
			// 任务类型弹窗
			createTsk() {
				let _this = this
				_this.taskTypeModel = true
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					Platform: 99
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/newOrderOne', param).then(res => {
					if(res.data.status == 200) {
						_this.taskTypeData = res.data.data.TasksList
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
			//进入新任务页面
			intoNewTask(index) {
				let _this = this
				_this.PlatformId = _this.taskTypeData[index].PlatformId
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: _this.taskTypeData[index].PlatformId,
					Platform: _this.taskTypeData[index].Platform,
					baseTaskId: '1',
					baseTaskType: '1'
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/newOrderTwo', param).then(res => {
					if(res.data.status == 200) {
						_this.countryData = res.data.data.Country
						_this.rateData = res.data.data.ExRate
						_this.addFreeData = res.data.data.ValueAdded
						//						_this.QaForm.QAFee=res.data.data.QAFee
						//						_this.likesForm.LikeFee=res.data.data.LikeFee
						let fee = res.data.data.ValueAdded
						for(let i = 0; i < fee.length; i++) {
							let min = fee[i].MinVal
							let max = fee[i].MaxVal
							let UnitPrice = fee[i].UnitPrice
							let productPrice = '$ ' + min + ' - ' + '$ ' + max
							_this.addFreeData[i].productPrice = productPrice
							_this.addFreeData[i].UnitPrice = '￥' + UnitPrice
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
			// 购物车任务弹窗
			buyTask(index) {
				let _this = this
				_this.addTaskModal = true
				let indexs = index
				_this.intoNewTask(indexs)

			},
			// 点赞任务弹窗
			likesTask(index) {
				let _this = this
				_this.likesModel = true
				let indexs = index
				_this.intoNewTask(indexs)
				_this.likesForm.PlatformId = _this.taskTypeData[index].PlatformId
				_this.likesForm.Platform = _this.taskTypeData[index].Platform
			},
			// QA任务弹窗
			problemTask(index) {
				let _this = this
				_this.QAtaskModel = true
				let indexs = index
				_this.intoNewTask(indexs)
				_this.QaForm.PlatformId = _this.taskTypeData[index].PlatformId
				_this.QaForm.Platform = _this.taskTypeData[index].Platform
			},
			//根据国家取货币符号
			checkCountry(index) {
				let _this = this
				_this.taskForm.Currency = _this.countryData[index].CurrSymbal
				_this.taskForm.Country = _this.countryData[index].Code
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: _this.PlatformId,
					Country: _this.countryData[index].Code
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetService', param).then(res => {
					if(res.data.status == 200) {
						_this.commentTypeData = res.data.data.Service
						let service = res.data.data.Service
						_this.serviceData = res.data.data.Service
						for(let i = 0; i < service.length; i++) {
							let rate = service[i].CommentRate
							let country = service[i].Country
							let price = service[i].UnitPrice
							let newRate = rate * 100 + '%'
							_this.serviceData[i].CommentRate = newRate
							_this.serviceData[i].servicePrice = country + ' ￥' + price
							//							let comm = service[i].Service
							//							_this.commentTypeData.push(comm)
						}
					}
				})
			},
			//QA平台
			checkPlat(value) {
				let _this = this
				if(value == 'PC') {
					_this.QaForm.DeviceType = 1
				} else if(value == 'Android') {
					_this.QaForm.DeviceType = 2
				}
			},
			//任务列表操作
			orderActions(ActionType, orderId, Amount) {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: orderId,
					ActionType: ActionType,
					Amount: Amount
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
						_this.getAllData(1)
						_this.$message({
							type:'success',
							message:res.data.message
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
							type:'error',
							message:res.data.message
						})
						console.log(res.data.message)
					}
				})
			},
			//下单成功后确定付款
			paymentOrder() {
				let _this = this
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
						_this.getAllData()
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
						_this.viewTaskData = res.data.data.Order
						_this.viewTaskData.QATasks = res.data.data.QATasks
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
			//点赞查看详情
			likeDetails(index, row) {
				let _this = this
				_this.likeViewDetailModal = true
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					OrderId: _this.allOrderData[index].Id,
					ActionType: 7
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderAction', param).then(res => {
					if(res.data.status == 200) {
						let device = res.data.data.Order.Device
						console.log(device)
						if(device == 1) {
							res.data.data.Order.Device = 'PC'
						} else if(device == 2) {
							res.data.data.Order.Device = 'Android'
						}
						_this.viewTaskData = res.data.data.Order
						_this.viewTaskData.LikeTasks = res.data.data.LikeTasks
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
				_this.QaForm.Country = _this.countryData[index].Country
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
				let file = e.target.files[0]
				let name = file.name
				let size = file.size
				var ext = name.lastIndexOf('.')
				let fileTpyes = name.substring(ext + 1)
				sessionStorage.setItem('fileext', fileTpyes)
				var AllowImgFileSize = 52428800;
				if(file) {
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
								//						responseType: 'arraybuffer'

							})
							.then(res => {
								if(res.data.status == 200) {
									_this.assessForm.VideoIds = res.data.data.FileId
									_this.videoSuccess = true
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
				let param = {
					SessionId: sessionStorage.getItem('sessionid'),
					PlatformId: _this.searchFrom.PlatformId,
					StartDate: _this.searchForm.orderStartTime,
					EndDate: _this.searchForm.orderEndTime,
					Keyword: _this.searchForm.Keyword,
					Status: _this.active,
					Page: 1,
					offset: 10,
					BaseTaskType: _this.searchForm.BaseTaskType
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + 'api/doOrderList', param).then(res => {
					if(res.data.status == 200) {
						_this.allOrderData = res.data.data.RstList
					} else if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录超时，请重新登录'
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
							message: '操作异常'
						})
					}
				})
			},
			//上传图片选择
			openFile() {
				this.$refs.file.click();
			},
			//上传视频选择
			openVideo() {
				this.$refs.files.click();
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
		margin: 0 10px 10px 10px;
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
</style>