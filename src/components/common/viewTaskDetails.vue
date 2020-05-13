<template>
  <div class="contentView">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>任务信息</span>
      </div>
      <ul class="detailbox detailbox1">
        <li>
          <span>任务编码：</span>
          <p>{{viewTaskData.OrderNumbers}}</p>
        </li>
        <li>
          <span>下单类型：</span>
          <p>{{viewTaskData.ServiceType}}</p>
        </li>
        <li>
          <span>国家：</span>
          <p>{{viewTaskData.countryName}}</p>
        </li>
        <li>
          <span>任务状态：</span>
          <p @change="txtOrderType">{{viewTaskData.TaskState}}</p>
        </li>
        <li>
          <span>产品ASIN：</span>
          <p>{{viewTaskData.Asin}}</p>
        </li>
        <li>
          <span>产品名称：</span>
          <p>{{viewTaskData.ProductName}}</p>
        </li>
<!--        <li>
          <span>产品价格：</span>
          <p>{{viewTaskData.Currency}}{{viewTaskData.AmazonProductPrice}}</p>
        </li> -->
<!--        <li>
          <span>产品图片：</span>
          <p>
            <img :src="'http://47.115.37.202:8080'+viewTaskData.ProductImage" alt="" class="eval_img">
          </p>
        </li> -->
       <!-- <li>
          <span>关键字类型：</span>
          <p>{{viewTaskData.KeywordType}}</p>
        </li>
        <li v-show="viewTaskData.KeywordType=='产品关键字'">
          <span>产品关键词：</span>
          <p>{{viewTaskData.ProductKeyword}}</p>
        </li>
        <li v-show="viewTaskData.KeywordType=='CPC关键字'">
          <span>CPC关键词：</span>
          <p>{{viewTaskData.CpcKeyword}}</p>
        </li> -->
     <!--   <li>
          <span>订单数量：</span>
          <p>{{viewTaskData.OrderNumber}}</p>
        </li> -->
    <!--    <li>
          <span>留评比例：</span>
          <p>{{viewTaskData.ProductPosition}}</p>
        </li> -->
        <li>
          <span>任务执行时间：</span>
          <p>{{viewTaskData.ExecutionTime}}</p>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>购买信息</span>
      </div>
      <ul class="detailbox detailbox1">
        <li>
          <span>购买时间：</span>
          <p>{{viewTaskData.BuyTime}}</p>
        </li>
        <li>
        <li>
          <span>Amazon订单号：</span>
          <p>{{viewTaskData.AmazonNumber}}</p>
        </li>
        <li v-if="viewTaskData.ServiceType === '见单返本'">
          <span>产品金额：</span>
          <p>{{viewTaskData.AmazonProductPrice}}</p>
        </li>
        <li v-if="viewTaskData.ServiceType === '评后返'">
          <span>预计价格：</span>
          <p>{{viewTaskData.ProductPrice}}</p>
        </li>
        <li>
          <span>产品运费：</span>
          <p>{{viewTaskData.Freight}}</p>
        </li>
        <li>
          <span>产品税费：</span>
          <p>{{viewTaskData.Taxation}}</p>
        </li>
         <li>
          <span>其它费用：</span>
          <p>{{viewTaskData.Other}}</p>
        </li>
        <li>
          <span>总额：</span>
          <p>{{viewTaskData.Total}}</p>
        </li>
        <li>
          <span>备注：</span>
          <p>{{viewTaskData.Remarks}}</p>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>评价信息</span>
      </div>
      <ul class="detailbox detailbox1">
        <li>
          <span>产品评分：</span>
          <el-rate v-model="viewTaskData.OrderProductScore"></el-rate>
        </li>
        <li>
          <span>产品链接：</span>
          <a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
        </li>
        <li>
          <span>评价截图：</span>
          <img :src="'http://47.115.37.202:8080'+viewTaskData.ProductImage" v-if="viewTaskData.ProductImage" class="eval_img" />
        </li>
      </ul>
    </el-card>
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
      let _this = this
      _this.txtOrderType()
      // _this.txtKeywords()
      _this.orderStatus()
    },

    methods: {
      //获取类型
      getInfo(obj, param1, param2) {
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].TypeName == param1 && obj[i].Value == param2) ||
            (obj[i].Value == param1 && obj[i].TypeName == param2)) {
            return obj[i].Display;
          }
        }
      },
      backBtn() {
        this.$router.push('/taskManage')
      },
      //下单类型
      txtOrderType() {
        let _this = this
        let types = _this.viewTaskData.ServiceType
        if (types == 1) {
          _this.viewTaskData.ServiceType = '见单返本'
        } else if (types == 2) {
          _this.viewTaskData.ServiceType = '评后返'
        }
      },

      // 订单状态
      orderStatus() {
        let _this = this
        let status = _this.viewTaskData.TaskState
        if (status == 1) {
          _this.viewTaskData.TaskState = '待确认'
        } else if (status == 2) {
          _this.viewTaskData.TaskState = '待分配'
        } else if (status == 3) {
          _this.viewTaskData.TaskState = '已分配'
        } else if (status == 4) {
          _this.viewTaskData.TaskState = '已完成'
        } else if (status == 5) {
          _this.viewTaskData.TaskState = '已取消'
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
