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
                <el-checkbox v-for="(item,index) in cities" :label="item.Id" :key="index">{{item.CountryName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-item">
          <el-form-item label="下单时间">
            <el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate"
              value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
            <el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关键字" class="labelNum">
            <el-input v-model="searchForm.Keyword" style="width: 220px" placeholder="任务编码,产品名称"></el-input>
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
        <ul class="tabBlock" v-for="(item,index) in statusList" :key=index>
          <li :class="active === 0 ? 'active':''" @click="allTaskNum" :data-index="0">全部<span>({{item.TotalCount}})</span></li>
          <li :class="active === 1 ? 'active':''" :data-index="1" @click="daifp">待分配<span>({{item.OrderStateInOne}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待购买<span>({{item.OrderStateInTwo}})</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daiComfir">订单待确认<span>({{item.OrderStateInThree}})</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daipj">待评价<span>({{item.OrderStateInFour}})</span></li>
          <li :class="active === 5 ? 'active':''" :data-index="5" @click="evaluationComfir">评价待确认<span>({{item.OrderStateInFive}})</span></li>
          <li :class="active === 6 ? 'active':''" :data-index="6" @click="ywc">已完成<span>({{item.OrderStateInSix}})</span></li>
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="taskCancel">已取消<span>({{item.OrderStateInSeven}})</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errTask">异常<span>({{item.OrderStateInEight}})</span></li>
        </ul>
      </div>
    </div>
    <div class="mt10 tableBg" style="overflow-x: auto">
      <el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" :header-cell-style="{background:'#eef1f6'}">
        <el-table-column prop="OrderNumbers" label="任务编码" align="center" width="170">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.$index,scope.row)">{{scope.row.OrderNumbers}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="countryName" label="国家" align="center"></el-table-column>
        <el-table-column prop="Asin" label="产品ASIN" align="center" width="120"></el-table-column>
        <el-table-column prop="AmazonProductPrice" label="产品价格" align="center"></el-table-column>
        <el-table-column prop="ServiceType" label="服务类型" align="center"></el-table-column>
        <el-table-column prop="TaskState" label="状态" align="center" width="100" :formatter="txtOrderStatus"></el-table-column>
        <el-table-column prop="AmazonNumber" label="订单号" align="center" width="100"></el-table-column>
        <el-table-column prop="ProductName" label="产品名称" align="center" width="100"></el-table-column>
        <el-table-column prop="BuyTime" label="下单时间" align="center" width="200"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="small" type="primary" v-if="scope.row.Status=='待付款'" @click="payMent(scope.$index,scope.row)">付款</el-button> -->
            <el-button size="small" v-if="scope.row.TaskState==1" type="danger" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
            <el-button size="small" v-if="scope.row.TaskState==5" type="success" @click="evalEdit(scope.$index,scope.row)">填写评价</el-button>
            <!-- <el-button size="small" type="warning" @click="viewDaily(scope.$index,scope.row)">日志</el-button> -->
            <!-- <el-button size="small" v-if="scope.row.Status=='取消'" type="danger" @click="delhandel(scope.$index,scope.row)">删除</el-button> -->
            <el-button size="small" type="primary" v-if="scope.row.TaskState==3" @click="confirmBtn(scope.$index,scope.row)">订单确认</el-button>
            <!-- 						<el-button size="small" v-if="scope.row.Status=='待收货'" type="danger" @click="refundBtn(scope.$index,scope.row)">申请退款</el-button>
						<el-button size="small" v-if="scope.row.Status=='退款'" @click="cancelRefundBtn(scope.$index,scope.row)">取消退款</el-button>
						<el-button size="small" v-if="scope.row.Status=='取消'" @click="cancelReasonBtn(scope.$index,scope.row)">取消原因</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="mt30 txtRight" v-if="total>0">
        <el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!--评价-->
    <el-dialog title="评价" :visible.sync="assessModel" width="40%" center="" :close-on-click-modal="false">
      <el-form :model="assessForm">
        <el-form-item label="产品链接">
          <span>{{assessForm.productLink}}</span>
        </el-form-item>
        <el-form-item label="产品图片">
          <img :src="assessForm.ProductImage" class="proImg" />
        </el-form-item>
        <el-form-item label="评论图片" v-if="serviceType=='评后返'">
          <el-upload :class="{hide:hideUpload}" :action="uploadUrl" name='image' list-type="picture-card"
             :on-success="handlePictureCardSuccess" :on-remove="handleRemove"
            :before-upload="beforeUpload"  :on-change="handleChange">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg,图片大小不应超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button type="primary" size="medium" @click='evalEditSubmit'>确认</el-button>
        <el-button @click="assessModel=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!-- 日志-->
<!--    <el-dialog title="日志" :visible.sync="dailyModel" :close-on-click-modal="false">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in activities" :key="index" :timestamp="item.ActDate" placement="top">
          <el-card>
            <h4>{{item.ActionName}}</h4>
            <p>{{item.ActDate}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog> -->
    <!-- 删除-->
<!--    <el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否删除此数据?</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='delSubmit'>确定</el-button>
        <el-button @click="delModel=false" size="medium">取消</el-button>
      </span>
    </el-dialog> -->
    <!--确认完成-->
    <el-dialog title="订单确认" :visible.sync="submitModal" :close-on-click-modal="false" center="" width="40%">
      <div>
        <el-form :model="orderForm" label-width="80px">
          <el-form-item label="任务状态">
            <el-radio-group v-model="orderForm.orderStatus">
              <el-radio label="1">正常</el-radio>
              <el-radio label="0">异常</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" v-show="orderForm.orderStatus=='0'">
            <el-input type="textarea" v-model="orderForm.orderRemark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='confirmSubmit'>确定</el-button>
        <el-button @click="submitModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!--申请退款-->
<!--    <el-dialog title="温馨提示" :visible.sync="refundModal" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否确定申请退款?</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='retuenSubmit'>确定</el-button>
        <el-button @click="refundModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog> -->
    <!--取消退款-->
<!--    <el-dialog title="温馨提示" :visible.sync="cancelRefundModal" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否确定取消退款申请?</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelRefund'>确定</el-button>
        <el-button @click="cancelRefundModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog> -->
    <!--取消-->
    <el-dialog title="取消订单" :visible.sync="cancelModal" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否确定取消该任务?</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelSubmit'>确定</el-button>
        <el-button @click="cancelModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!-- 付款-->
<!--    <el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose"
      top='5vh'>
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
            <el-button type='warning' v-if='parseInt(this.paymentForm.payMoney)>parseInt(this.paymentForm.balance) || parseInt(this.paymentForm.balance)==0'
              @click='toRecharge'>去充值</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click='paymentOrder' v-if='parseInt(this.paymentForm.payMoney)<parseInt(this.paymentForm.balance) && parseInt(this.paymentForm.balance)!=0 && !payList'>确定</el-button>
        <el-button type="primary" @click='paymentOrderList' v-if="payList">确定</el-button>
        <el-button @click="paymentClose">取消</el-button>
      </div>
    </el-dialog> -->
    <!--FBA查看详情-->
    <el-dialog title='详情' :visible.sync="viewDetailModal" width='80%'>
      <view-task :viewTaskData="viewTaskData"></view-task>
      <span slot='footer' class="dialog-footer">
        <el-button type='primary' @click='viewDetailModal=false'>返回</el-button>
      </span>
    </el-dialog>
    <!--取消原因-->
<!--    <el-dialog title='取消原因' :visible.sync='reasonModal' width='40%'>
      <span>{{reasonCon}}</span>
      <span slot='footer' class="dialog-footer">
        <el-button type='primary' @click='reasonModal=false'>返回</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
  import vali from '../common/validate'
  import viewTask from '../common/viewTaskDetails'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {
    getCountry,
    taskList,
    taskStatus,
    taskConfirm,
    taskCancel
  } from '@/request/api'
  const cityOptions = ['美国', '日本', '韩国', '加拿大'];
  export default {
    name: 'taskManage',
    data() {
      return {
        serviceType:0,
        hideUpload: false, //评论上传图片继续添加按钮
        limitCount:1, //图片数量
        orderForm: {
          orderStatus: '1', //确认订单状态
          orderRemark: '', //确认订单备注
        },
        checkAll: false,
        cities: [],
        isIndeterminate: true,
        activeTask: 2, //除FBA任务外的其它任务状态
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
        uploadUrl: this.axios.defaults.baseURL+'/api/Order/GetProductPictures',
        BaseTaskType: 1, //任务列表类型
        viewTaskData: [],
        OrderSchedule: {}, //查看任务开始时间
        allOrderData: [],
        hasBalance: 0,
        taskTypeData: [], //任务类型
        commentTypeData: [], //留评类型
        dialogImageUrl: '',
        dialogVisible: false,
        loading: true,
        // status: this.$route.params.taskTypeModel,
        errorStatus: this.$route.params.active,
        pageSize: 10, //每页条数
        total: 0, //总条数
        btnTask: true,
        currentPage: 1, //页数
        cancelModal: false,
        delModel: false, // 删除
        reverse: true,
        paymentModel: false,
        submitModal: false, //确认
        refundModal: false, //申请退款
        cancelRefundModal: false, //取消退款
        viewDetailModal: false, //FBA查看详情
        activities: [],
        active: 0,
        dailyModel: false,
        disabled: true,
        assessModel: false,
        errorMes: false,
        nolp: true,
        startTime: '',
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
          checkedCities: []
        },
        assessForm: {
          productLink:'', //产品链接
          ProductPictures: '',//评论图片
          ProductImage:'' //产品图片
        },

        // taskType: 'all',

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
        selected: [], //选中的值
        statusList: [] //全部状态
      }
    },
    components: {
      viewTask
    },
    created() {
      // this.getError()
      // this.getObj()
      this.getAllCountry()
      this.getAllData()
      this.getAllStatus()
    },
    methods: {
      //上传图片前检验图片格式和大小
      beforeUpload(file) {
        let _this = this
        _this.proImg = true
        const isImg = file.type === 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/png' || file.type ==
          'image/gif';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isImg) {
          this.$message.error('只能上传jpg/jpeg/png/gif的图片文件!');
        } else if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isImg && isLt5M;
      },
      // 上传图片change
      handleChange(file,fileList){
        let _this = this
        _this.hideUpload = fileList.length >= _this.limitCount;
      },
      // 上传产品图片
      handleRemove(file, fileList) {
        let _this = this
        _this.assessForm.ProductPictures = ''
        _this.hideUpload = fileList.length >= _this.limitCount;
      },
      handlePictureCardSuccess(res,file) {
        let _this = this
        _this.assessForm.ProductPictures =  res.Data;
        if(file.status == 'success'){
          _this.$message({
            type:'success',
            message:'上传成功'
          });
        }else{
          _this.$message.error('上传失败')
        }
      },
      // 格式化状态
      txtOrderStatus(val) {
        if (val.TaskState == 1) {
          return '待分配'
        } else if (val.TaskState == 2) {
          return '待购买'
        } else if (val.TaskState == 3) {
          return '订单待确认'
        } else if (val.TaskState == 4) {
          return '待评价'
        } else if (val.TaskState == 5) {
          return '评价待确认'
        } else if (val.TaskState == 6) {
          return '已完成'
        } else if (val.TaskState == 7) {
          return '已取消'
        } else if (val.TaskState == 8) {
          return '异常'
        }
      },
      // 初始化状态
      getAllStatus() {
        let _this = this
        let userId = sessionStorage.getItem('userId')
        let param = {
          userId: userId,
          countryIdx: _this.searchForm.checkedCities,
          keyWord: _this.searchForm.Keyword
        }
        taskStatus(param).then(res => {
          _this.statusList = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      // 初始化任务列表
      getAllData() {
        let _this = this
        let userId = sessionStorage.getItem('userId')
        let param = {
          pageNum: _this.currentPage,
          pagesize: _this.pageSize,
          userId: userId, //用户id
          countryIdx: _this.searchForm.checkedCities, //国家数组
          kWord: _this.searchForm.Keyword, //查询（任务编码，产品名称）
          state: parseInt(_this.active) //任务状态
        }
        taskList(param).then(res => {
          _this.allOrderData = res.data.list
          _this.total = parseInt(res.data.total)
          let lists = res.data.list
          for (let i = 0; i < lists.length; i++) {
            let types = lists[i].ServiceType
            if (types == 1) {
              lists[i].ServiceType = '见单返本'
            } else if (types == 2) {
              lists[i].ServiceType = '评后返'
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 初始化国家查询
      getAllCountry() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        getCountry(param).then((res) => {
          _this.cities = res.data.list
        }).catch(err => {
          console.log(err)
        })
      },
      // 国家全选
      handleCheckAllChange(val) {
        this.searchForm.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      // 国家选择
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
          if (res.data.status == 200) {
            sessionStorage.setItem('userId', res.data.data.userid)
            sessionStorage.setItem('balance', res.data.data.balance)
          }
          if (res.data.status == 400) {
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
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].TypeName == param1 && obj[i].Value == param2) ||
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
      //订单确认完成弹窗
      confirmBtn(index) {
        let _this = this
        _this.submitModal = true
        _this.OrderId = _this.allOrderData[index].Id
      },
      //订单确认完成确定
      confirmSubmit() {
        let _this = this
        let userId = sessionStorage.getItem('userId')
        let param = {
          State:parseInt(_this.orderForm.orderStatus),
          Id:_this.OrderId,
          UserId:userId,
          Remark:_this.orderForm.orderRemark
        }
        taskConfirm(param).then(res=>{
          if(res.data.Code == 'ok'){
            _this.$message({
              type:'success',
              message:res.data.Msg
            })
          }else{
            _this.$message({
              type:'error',
              message:res.data.Msg
            })
          }
          _this.submitModal = false
          _this.orderForm={
            orderStatus:'1',
            orderRemark:''
          }
          _this.getAllData()
          _this.getAllStatus()
        }).catch(error=>{
          console.log(error)
        })
      },
      // 获取异常
      getError() {
        let _this = this
        let errors = _this.errorStatus
        if (errors != undefined) {
          this.errData()
        }
      },

      // 重置
      resetTask() {
        let _this = this
        _this.searchForm = {
          Keyword: '',
          orderStartTime: '',
          orderEndTime: '',
          checkedCities: []
        }
        _this.getAllData()
      },
      // 付款关闭页面
      paymentClose() {
        let _this = this
        _this.paymentModel = false
        _this.payList = false
        _this.hasBalance = 0
      },


      // 取消
      cancelHandel(index) {
        let _this = this
        _this.cancelModal = true
        _this.OrderId = _this.allOrderData[index].Id

      },
      //取消确定
      cancelSubmit() {
        let _this = this
        let orderId = _this.OrderId
        let param = {
          UserId: sessionStorage.getItem('userId'),
          Id: orderId,
          UserImage: ''
        }
        taskCancel(param).then(res=>{
          if(res.data.Code == 'ok'){
            _this.$message({
              type:'success',
              message:'操作成功'
            })
            _this.cancelModal = false
            _this.getAllData()
            _this.getAllStatus()
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      searchStartDate() {
        return {
          disabledDate: time => {
            let endDateVal = this.searchForm.orderEndTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        }
      },
      // 搜索下单结束时间
      pickerOptionsEnd() {
        return {
          disabledDate: time => {
            let beginDateVal = this.searchForm.orderStartTime
            if (beginDateVal) {
              return (
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
      evalEdit(index) {
        let _this = this
        _this.assessModel = true
        _this.OrderId = _this.allOrderData[index].Id
        _this.serviceType = _this.allOrderData[index].ServiceType
        _this.assessForm.productLink = _this.allOrderData[index].ProductLink
        _this.assessForm.ProductImage = 'http://47.115.37.202:8080' + _this.allOrderData[index].ProductImage
      },
      //评论确定
      evalEditSubmit() {
        let _this = this
        let param = {
          UserId: sessionStorage.getItem('userId'),
          Id: _this.OrderId,
          UserImage: _this.assessForm.ProductPictures
        }
       taskCancel(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.$message({
              type: 'success',
              message: '操作成功'
            })
            _this.assessModel = false
            _this.getAllData()
            _this.getAllStatus()
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      // 查看任务详情
      viewDetails(index, row) {
        let _this = this
        let obj = _this.obj
        _this.viewDetailModal = true
        _this.viewTaskData = _this.allOrderData[index]
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

      //查询
      searchOrder() {
        let _this = this
        _this.getAllData()
      },
      //上传图片选择
      openFile() {
        this.$refs.file.click();
      },
      //上传视频选择
      openVideo() {
        this.$refs.files.click();
      },
      // 分页导航
      handleCurrentChange(val) {
        let _this = this
        _this.currentPage = val
        _this.getAllData()
      },
      //每页条数
      handleSizeChange(val) {
        let _this = this
        _this.pageSize = val
        _this.handleCurrentChange(_this.currentPage)
        _this.getAllData()
      },
      //全部
      allTaskNum() {
        let _this = this
        _this.active = 0
        _this.getAllData()
      },
      //任务待分配
      daifp() {
        let _this = this
        _this.active = 1
        _this.getAllData()
      },
      //待购买
      daiBuy() {
        let _this = this
        _this.active = 2
        _this.getAllData()
      },
      //订单待确认
      daiComfir() {
        let _this = this
        _this.active = 3
        _this.getAllData()
      },
      // 待评价
      daipj() {
        let _this = this
        _this.active = 4
        _this.getAllData()
      },
      // 评价待确认
      evaluationComfir() {
        let _this = this
        _this.active = 5
        _this.getAllData()
      },
      // 已完成
      ywc() {
        let _this = this
        _this.active = 6
        _this.getAllData()
      },
      // 已取消
      taskCancel() {
        let _this = this
        _this.active = 7
        _this.getAllData()
      },
      //其他任务异常
      errTask() {
        let _this = this
        _this.active = 8
        _this.getAllData()
      }
    }
  }
</script>

<style scoped>
  /deep/.hide .el-upload--picture-card {
  display: none;
  }
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
