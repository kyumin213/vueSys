<template>
	<div class="contentView">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>任务信息</span>
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>任务编码：</span>
					<p>{{viewTaskData.OrderNumber}}</p>
				</li>
				<li>
					<span>国家：</span>
					<p>{{viewTaskData.CountryName}}</p>
				</li>
				<li>
					<span>任务状态：</span>
					<p>{{viewTaskData.OrderState}}</p>
				</li>
				<li>
					<span>产品ASIN：</span>
					<p>{{viewTaskData.Asin}}</p>
				</li>
				<li>
					<span>产品名称：</span>
					<p>{{viewTaskData.ProductName}}</p>
				</li>
				<li>
					<span>产品价格：</span>
					<p>{{viewTaskData.Currency}}{{viewTaskData.ProductPrice}}</p>
				</li>
				<li>
					<span>产品图片：</span>
					<p>
						<img :src="viewTaskData.ProductPictures" alt="" class="eval_img">
					</p>
				</li>
				<li>
					<span>产品评分：</span>
					<!-- <p>{{viewTaskData.ProductScore}}</p> -->
          <el-rate v-model="viewTaskData.ProductScore"></el-rate>
				</li>
				<li>
					<span>产品链接：</span>
					<a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
				</li>
			</ul>
		</el-card>
		<el-card class="box-card mt20">
			<div slot="header" class="clearfix">
				<span>购买信息</span>
				<!--          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>关键字类型：</span>
					<p>{{viewTaskData.KeywordType}}</p>
				</li>
				<li>
					<span>产品关键词：</span>
					<p>{{viewTaskData.ProductKeyword}}</p>
				</li>		<li>
					<span>CPC关键词：</span>
					<p>{{viewTaskData.CpcKeyword}}</p>
				</li>
				<li>
					<span>订单数量：</span>
					<p>{{viewTaskData.OrderNumber}}</p>
				</li>
        <li>
					<span>留评比例：</span>
					<p>{{viewTaskData.ProductPosition}}</p>
				</li>
        <li>
					<span>任务开始时间：</span>
					<p>{{viewTaskData.StartTimes}}</p>
				</li>
        <li>
					<span>任务结束时间：</span>
					<p>{{viewTaskData.EndTimes}}</p>
				</li>
	<!-- 			<li>
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
				</li> -->
				<li>
					<span>产品总价：</span>
					<p>${{viewTaskData.TotalProductPrice}}</p>
				</li>
				<li>
					<span>服务费：</span>
					<p>${{viewTaskData.ServiceFee}}</p>
				</li>
				<li>
					<span>合计：</span>
					<p>{{viewTaskData.Total}}</p>
				</li>
				<li>
					<span>备注：</span>
					<p>{{viewTaskData.Remarks}}</p>
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
			this.txtOrderType()
			this.txtKeywords()
		},

		methods: {
			//获取类型
			getInfo(obj, param1, param2) {
				for(let i = 0; i < obj.length; i++) {
					if((obj[i].TypeName == param1 && obj[i].Value == param2) ||
						(obj[i].Value == param1 && obj[i].TypeName == param2)) {
						return obj[i].Display;
					}
				}
			},
			backBtn() {
				this.$router.push('/taskManage')
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
				let keys = _this.viewTaskData.KeywordType
				if(keys == 1) {
					_this.viewTaskData.KeyType = '产品关键字'
				} else if(keys == 2) {
					_this.viewTaskData.KeyType = 'CPC关键字'
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
