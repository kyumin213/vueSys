<template>
	<div class="contentView">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>任务信息</span>
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>订单编号：</span>
					<p>{{viewOrderData.OrderNumber}}</p>
				</li>
				<li>
					<span>下单类型：</span>
					<p>{{viewOrderData.ServiceType}}</p>
				</li>
        <li>
					<span>国家：</span>
					<p>{{viewOrderData.CountryName}}</p>
				</li>
				<li>
					<span>订单状态：</span>
					<p>{{viewOrderData.OrderState}}</p>
				</li>
				<li>
					<span>产品ASIN：</span>
					<p>{{viewOrderData.Asin}}</p>
				</li>
				<li>
					<span>产品名称：</span>
					<p>{{viewOrderData.ProductName}}</p>
				</li>
				<li>
					<span>产品价格：</span>
					<p>{{viewOrderData.Currency}}{{viewOrderData.ProductPrice}}</p>
				</li>
				<li>
					<span>产品评分：</span>
					<!-- <p>{{viewTaskData.ProductScore}}</p> -->
          <el-rate v-model="viewOrderData.ProductScore"></el-rate>
				</li>
				<li>
					<span>产品链接：</span>
					<a :href="viewOrderData.ProductLink">{{viewOrderData.ProductLink}}</a>
				</li>
        <li>
        	<span>产品图片：</span>
        	<p>
        		<img :src="viewOrderData.ProductPictures" alt="" class="eval_img">
        	</p>
        </li>
			</ul>
		</el-card>
		<el-card class="box-card mt20">
			<div slot="header" class="clearfix">
				<span>购买信息</span>
			</div>
			<ul class="detailbox detailbox1">
				<li>
					<span>关键字类型：</span>
					<p>{{viewOrderData.KeywordType}}</p>
				</li>
				<li v-show="viewOrderData.KeywordType=='产品关键字'">
					<span>产品关键词：</span>
					<p>{{viewOrderData.ProductKeyword}}</p>
				</li>
        <li  v-show="viewOrderData.KeywordType=='CPC关键字'">
					<span>CPC关键词：</span>
					<p>{{viewOrderData.CpcKeyword}}</p>
				</li>
				<li>
					<span>订单数量：</span>
					<p>{{viewOrderData.OrderNumber}}</p>
				</li>
        <li>
					<span>留评比例：</span>
					<p>{{viewOrderData.ProductPosition}}</p>
				</li>
        <li>
					<span>任务开始时间：</span>
					<p>{{viewOrderData.StartTimes}}</p>
				</li>
        <li>
					<span>任务结束时间：</span>
					<p>{{viewOrderData.EndTimes}}</p>
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
					<p>{{viewOrderData.TotalProductPrice}}</p>
				</li>
				<li>
					<span>服务费：</span>
					<p>{{viewOrderData.ServiceCharge}}</p>
				</li>
				<li>
					<span>合计：</span>
					<p>{{viewOrderData.Total}}</p>
				</li>
				<li>
					<span>备注：</span>
					<p>{{viewOrderData.Remarks}}</p>
				</li>
			</ul>
		</el-card>
		<!--<el-button type="primary" class="mt30" size="medium" @click="backBtn">返回</el-button>-->
	</div>
</template>

<script>
	export default {
		name: 'viewOrderDetails',
		props: ["viewOrderData"],
		data() {
			return {
				form: {}
			}
		},
    mounted(){
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
      //关键字类型
      txtKeywords() {
        let _this = this
        let keys = _this.viewOrderData.KeywordType
        if (keys == 1) {
          _this.viewOrderData.KeywordType = '产品关键字'
        } else if (keys == 2) {
          _this.viewOrderData.KeywordType = 'CPC关键字'
        }
      },
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
		width: 150px;
		height: 150px;
		border-radius: 4px;
		cursor: pointer;
		border: 1px solid #ccc;
		margin-right: 10px;
    background-size: cover;
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
