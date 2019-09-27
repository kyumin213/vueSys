<template>
	<div>
		<el-card>
			<ul>
				<li>
					<span>终端类型：</span>
					<span>{{viewTaskData.Device}}</span>
				</li>
				<li>
					<span>{{viewTaskData.QAType}}</span>
				</li>
				<li>
					<el-row :gutter="20">
						<el-col :span="5" :xs="6" class="mb20">
							<span>订单号</span>
						</el-col>
						<el-col :span="3" :xs="6" class="mb20">
							<span>国家</span>
						</el-col>
						<el-col :span="3" :xs="7">
							<span>产品ASIN</span>
						</el-col>
						<el-col :span="5" :xs="6">
							<span>问题</span>
						</el-col>
						<el-col :span="3" :xs="5">
							<span>服务费</span>
						</el-col>
						<el-col :span="5" :xs="5">
							<span>时间</span>
						</el-col>
					</el-row>
				</li>
				<li>
					<el-row :gutter="20" v-for="(item,index) in viewTaskData.QATasks" :key='index'>
						<el-col :span="5" :xs="6" class="mb20">
							<span>{{item.OrderId}}</span>
						</el-col>
						<el-col :span="3" :xs="6" class="mb20">
							<span>{{item.Country}}</span>
						</el-col>
						<el-col :span="3" :xs="7">
							<span>{{item.ASIN}}</span>
						</el-col>
						<el-col :span="5" :xs="6">
							<span>{{item.Question}}</span>
						</el-col>
						<el-col :span="3" :xs="5">
							<span>{{item.Fee}}</span>
						</el-col>
						<el-col :span="5" :xs="5">
							<span>{{item.StartDate}}</span>
						</el-col>
					
					</el-row>
				</li>
				<li>服务费：￥<span class="colred fz20">{{viewTaskData.TotalPrice}}</span></li>
			</ul>
			
		</el-card>
	</div>
</template>

<script>
	export default{
		props:["viewTaskData"]
	}
</script>

<style scope>
	li{
		list-style: none;
		line-height: 36px;
		margin-bottom: 8px;
	}

</style>