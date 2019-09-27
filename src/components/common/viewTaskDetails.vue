<template>
	<div class="contentView">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>任务信息</span>
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>任务编码：</span>
					<p>{{viewTaskData.Id}}</p>
				</li>
				<li>
					<span>平台/国家：</span>
					<p>{{viewTaskData.PlatformId}}/{{viewTaskData.Country}}</p>
				</li>
				<li>
					<span>任务状态：</span>
					<p>{{viewTaskData.Status}}</p>
				</li>
				<li>
					<span>任务类型：</span>
					<p>{{viewTaskData.OrderType}}</p>
				</li>
				<li>
					<span>产品ASIN：</span>
					<p>{{viewTaskData.ASIN}}</p>
				</li>
				<li>
					<span>店铺名称：</span>
					<p>{{viewTaskData.ShopName}}</p>
				</li>
				<li>
					<span>产品名称：</span>
					<p>{{viewTaskData.ProductName}}</p>
				</li>
				<li>
					<span>产品价格：</span>
					<p>{{viewTaskData.Currency}}{{viewTaskData.UnitPrice}}</p>
				</li>
				<li>
					<span>品类排名：</span>
					<p>{{viewTaskData.Rank}}</p>
				</li>
				<li>
					<span>产品图片：</span>
					<p>
						<img src="" alt="" class="eval_img">
					</p>
				</li>

				<li>
					<span>产品评分：</span>
					<p>{{viewTaskData.StarScore}}</p>
				</li>

				<li>
					<span>评论数：</span>
					<p>{{viewTaskData.CommentAmount}}</p>
				</li>
				<li>
					<span>预估销量：</span>
					<p>{{viewTaskData.PredictSales}}</p>
				</li>
				<li>
					<span>产品链接：</span>
					<a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
				</li>

				<!--<li>
              <span>执行任务时间：</span>
              <p>2019-06-16</p>
            </li>-->
			</ul>
			<!--        </div>-->
		</el-card>
		<el-card class="box-card mt20">
			<div slot="header" class="clearfix">
				<span>购买信息</span>
				<!--          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>关键字类型：</span>
					<p>{{viewTaskData.KeyType}}</p>
				</li>
				<li>
					<span>设备平台：</span>
					<p>{{viewTaskData.Device}}</p>
				</li>
				<li>
					<span>关键词：</span>
					<p>{{viewTaskData.KeywordSearch}}</p>
				</li>
				<li>
					<span>购买数量：</span>
					<p>{{viewTaskData.OrderNumber}}</p>
				</li>
				<li>
					<span>feedback数量：</span>
					<p>{{viewTaskData.FacebookNumber}}</p>
				</li>
				<li>
					<span>评论图片数量：</span>
					<p>{{viewTaskData.PicCommentNumber}}</p>
				</li>
				<li>
					<span>评论视频数量：</span>
					<p>{{viewTaskData.VideoCommentNumber}}</p>
				</li>
				<li>
					<span>是否使用优惠券：</span>
					<p>{{viewTaskData.CouponUsed}}</p>
				</li>
				<li>
					<span>是否自发货：</span>
					<p>{{viewTaskData.SelfShipped}}</p>
				</li>
				<li>
					<span>产品金额：</span>
					<p>${{viewTaskData.ProductPrice}}</p>
				</li>
				<li>
					<span>服务费：</span>
					<p>${{viewTaskData.ServiceFee}}</p>
				</li>
				<li>
					<span>增值费：</span>
					<p>${{viewTaskData.ValueAdded}}</p>
				</li>
				<li>
					<span>实际支付：</span>
					<p>{{viewTaskData.PaidCurrency}}{{viewTaskData.TotalPrice}}</p>
				</li>
				<el-row>
					<el-col>
						<li>
							<span>任务开始时间</span>
						</li>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" :xs="6" class="mb20">
						<span>开始日期</span>
					</el-col>
					<el-col :span="6" :xs="6" class="mb20">
						<span>时间</span>
					</el-col>
					<el-col :span="4" :xs="6">
						<span>数量</span>
					</el-col>
					<el-col :span="6" :xs="5">
						<span>订单号</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<div v-for="(item,index) in viewTaskData.OrderSchedule" :key="index">
							<el-row>
								<el-col :xs="24" :span="8" class="mb10">
									<span>{{item.StartDate}}</span>
								</el-col>
								<el-col :xs="24" :span='6' class="mb10">
									<span>{{item.StartHourMin}}</span>
									<span>至</span>
									<span>{{item.EndHourMin}}</span>
								</el-col>
								<el-col :xs="24" :span='4'>
									<span>{{item.Amount}}</span>
								</el-col>
								<el-col :xs="24" :span='6'>
									<span>{{item.OrderId}}</span>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<li>
					<span>备注：</span>
					<p>{{viewTaskData.Memo}}</p>
				</li>
			</ul>
		</el-card>
		<!--<el-button type="primary" class="mt30" size="medium" @click="backBtn">返回</el-button>-->
	</div>
</template>

<script>
	export default {
		name: 'viewTaskDetails',
		props: ["viewTaskData"],
		data() {
			return {
				form: {}
			}
		},
		mounted() {
			this.checkTxtPlat()
			this.txtOrderType()
			this.txtKeywords()
			this.txtDevice()
		},

		methods: {
			backBtn() {
				this.$router.push('/taskManage')
			},
			//平台
			checkTxtPlat() {
				let _this = this
				let plat = _this.viewTaskData.PlatformId
				if(plat == 1) {
					_this.viewTaskData.PlatformId = '亚马逊'
				} else if(plat == 2) {
					_this.viewTaskData.PlatformId = '速卖通'
				}
			},
			//任务类型
			txtOrderType() {
				let _this = this
				let types = _this.viewTaskData.OrderType
				if(types == 1) {
					_this.viewTaskData.OrderType = 'FBA'
				} else if(types == 2) {
					_this.viewTaskData.OrderType = '加购'
				} else if(types == 3) {
					_this.viewTaskData.OrderType = '心愿'
				} else if(types == 4) {
					_this.viewTaskData.OrderType = '点赞'
				} else if(types == 5) {
					_this.viewTaskData.OrderType = 'QA'
				}
			},
			//关键字类型
			txtKeywords() {
				let _this = this
				let keys = _this.viewTaskData.KeyType
				if(keys == 1) {
					_this.viewTaskData.KeyType = '搜索关键词'
				} else if(keys == 2) {
					_this.viewTaskData.KeyType = 'CPC'
				} else if(keys == 3) {
					_this.viewTaskData.KeyType = '链接'
				}
			},
			//设备平台
			txtDevice() {
				let _this = this
				let device = _this.viewTaskData.Device
				if(device == 1) {
					_this.viewTaskData.Device = 'PC'
				} else if(device == 2) {
					_this.viewTaskData.Device = 'Android'
				}
			}
		}
	}
</script>

<style scoped>
	.mt30 {
		margin-top: 30px;
	}
	
	.mt20 {
		margin-top: 20px;
	}
	
	.mb20 {
		margin-bottom: 20px;
		font-size: 14px;
	}
	
	.contentView {
		text-align: left;
		margin: 0 auto 50px;
		position: relative;
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