<template>
  <div>
    <div>
      <div class="mb20 mt20">
        <span>
          <span>首页</span>
          <span class="fg">/</span>
          <a>订单管理</a>
        </span>
      </div>
    </div>
    <div class="searchBox">
      <el-form :model="searchForm" ref="searchForm" class="form-item" label-width="80px" :inline="true">
        <el-form-item label="国家">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="searchForm.checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item,index) in cities" :label="item.Id" :key="index">{{item.CountryName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
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
            <el-input v-model="searchForm.Keyword" style="width: 220px" placeholder="单号,产品名称,ASIN,关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click='searchOrder'>搜索</el-button>
            <el-button @click="resetTask">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="tabBox">
      <div class="tabList">
        <ul class="tabBlock" v-for="(item,index) in allState" :key=index>
          <li :class="active === '' ? 'active':''" data-index="0" @click="getAllStatus">全部<span>({{item.TotalCount}})</span></li>
          <li :class="active === 1 ? 'active':''" data-index="1" @click="daiConfirm">待确认<span>({{item.TotalToBeParker}})</span></li>
          <li :class="active === 2 ? 'active':''" data-index="2" @click="daifp">待分配<span>({{item.TotalToBeAllocated}})</span></li>
          <li :class="active === 3 ? 'active':''" data-index="3" @click="yfp">已分配<span>({{item.TotalAlreadyAllocated}})</span></li>
          <li :class="active === 4 ? 'active':''" data-index="4" @click="ywc">已完成<span>({{item.TotalCompleted}})</span></li>
          <li :class="active === 5 ? 'active':''" data-index="5" @click="daiCancel">已取消<span>({{item.TotalCancel}})</span></li>
        </ul>
      </div>
      <div class="tabRight">
        <el-button type="primary" @click="createOrder">创建订单</el-button>
      </div>
    </div>
    <div class="mt10 tableBg" style="overflow-x: auto">
      <el-table :data="allOrderData" v-loading="loading" element-loading-text="拼命加载中" border style="width: 100%;font-size: 15px;"
        :header-cell-style="{background:'#eef1f6'}">
        <el-table-column prop="Id" label="任务编码" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.$index,scope.row)">{{scope.row.OrderNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
        <el-table-column prop="Number" label="任务数量" align="center"></el-table-column>
        <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="Asin" label="产品ASIN" align="center"></el-table-column>
        <el-table-column prop="ProductKeyword" label="关键词" align="center"></el-table-column>
        <el-table-column prop="Total" label="总价" align="center"></el-table-column>
        <el-table-column prop="OrderTime" label="下单时间" align="center" width="200"></el-table-column>
        <el-table-column prop="OrderState" label="状态" align="center" :formatter="txtOrderStatus"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="cancelHandel(scope.$index,scope.row)" type="danger" v-show="scope.row.OrderState=='1'">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt30 txtRight" v-if="total>0">
        <el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50,100]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- FBA任务-->
    <el-dialog title="创建任务" :visible.sync="addTaskModal" width="90%" custom-class="fixed-dialog" :close-on-click-modal="false"
      :before-close="closeModel" top='5vh'>
      <el-row>
        <div class="mb20">产品信息</div>
      </el-row>
      <el-row>
        <el-col :span="16" :xs="24" :sm="24" :md="24" :lg="16">
          <el-form :model="taskForm" ref="taskForm" :rules="taskRule" class="demo-ruleForm" status-icon>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="下单类型" class="disInline minWid" prop="ServiceType">
                  <el-select v-model="taskForm.ServiceType" placeholder="请选择" class="disInline wid100" @change="checkOrderType">
                    <el-option v-for="(item,index) in orderTypes" :key='index' :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="国家" class="disInline minWid" prop="CountryId">
                  <el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
                    <el-option v-for="(item,index) in countryData" :key="index" :value="item.Id" :label="item.CountryName"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="产品ASIN" class="disInline minWid" prop="Asin">
                  <el-input v-model="taskForm.Asin" maxlength="10" show-word-limit placeholder="长度为10的数字和字母组合"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="产品名称" class="disInline minWid" prop="ProductName">
                  <el-input v-model="taskForm.ProductName" type='textarea'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="产品价格" class="disInline minWid" prop="ProductPrice">
                  <el-input type="text" @blur="checkBuyNumFBA" v-model="taskForm.ProductPrice" placeholder="请输入数字">
                    <template slot="prepend">{{taskForm.Currency}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <p class="lh40">产品评分</p>
                <el-form-item prop='ProductScore'>
                  <el-rate v-model="taskForm.ProductScore"></el-rate>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24" class="fleft">
                <el-form-item label="产品链接" class="wid" prop="ProductLink">
                  <el-input type="textarea" v-model="taskForm.ProductLink" placeholder="请以http://或者https://开头"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="产品图片" prop="ProductPictures" ref='image'>
                  <el-upload  :show-file-list="false" ref='upload' :action="uploadUrl" name='image' list-type="picture-card"
                    :on-success="handlePictureCardSuccess" :on-remove="handleRemove" :before-upload="beforeUpload"
                    :on-change="handleChange">
                  <img v-if="taskForm.ProductPictures" :src="'http://47.115.37.202:8090/'+taskForm.ProductPictures" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-progress type="circle" v-if="loading" :percentage="percentage" :color="colors" class="progress"></el-progress>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            </el-row>
            <el-row>
              <div class="mt30 mb20">下单信息</div>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="关键词类型" prop='KeywordType'>
                  <el-radio-group v-model="taskForm.KeywordType" @change="changeKeyword">
                    <el-radio label="1" value='1'>产品关键字</el-radio>
                    <el-radio label="2" value='2'>CPC关键字</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24" v-show="taskForm.KeywordType == '1'">
                <el-form-item label="产品关键词" class="disInline minWid">
                  <el-input v-model="taskForm.ProductKeyword" placeholder='请输入关键词'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24" v-show="taskForm.KeywordType == '2'">
                <el-form-item label="CPC关键词" class="disInline minWid">
                  <el-input v-model="taskForm.CpcKeyword" placeholder='请输入关键词'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="留评类型" class="disInline minWid" prop="ProductPosition">
                  <el-select v-model="taskForm.ProductPosition" class="disInline wid100" placeholder="请选择" @change="lpType">
                    <el-option v-for="(item,index) in commentTypeData" :key="index" :value="item.Probability" :label="item.Probability"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="订单数量" class="disInline minWid" prop="Number">
                  <el-input v-model="taskForm.Number" @blur="checkBuyNumFBA" placeholder="请输入正整数"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="con">
              <el-row>
                <el-col :span='12' :xs="24">
                  <el-form-item label="任务开始时间" class="disInline minWid" prop="StartTime">
                    <el-date-picker v-model="taskForm.StartTime" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"
                      type="date" placeholder="选择日期" :picker-options="pickerOptions0">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='12' :xs="24">
                  <el-form-item label="任务结束时间" class="disInline minWid" prop="EndTime">
                    <el-date-picker v-model="taskForm.EndTime" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"
                      type="date" placeholder="选择日期" :picker-options="taskEndDate">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-show="priceShow">
                <el-col :span="24" :xs="24">
                  <el-form-item prop='TotalProductPrice'>
                    <span class="spanTxt">产品总价：</span>
                    <span class="colTxt labels fz20">￥{{taskForm.TotalProductPrice}}</span>
                    <span class="labels col9">(产品总价) = {{taskForm.ProductPrice}} (产品价格) * {{taskForm.Number}} (数量) *</span>
                    <span class='col9'>{{ExRate}} (汇率)</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop='ServiceCharge'>
                <span class="spanTxt">服务费：</span>
                <span class="colTxt labels fz20">￥{{taskForm.ServiceCharge}}</span>
                <span class="labels col9">(服务费) = {{serviceUnit}} (服务费单价) * {{taskForm.Number}} (数量) + {{addService}}
                  (增值费单价) * {{taskForm.Number}} (数量)</span>
              </el-form-item>
              <div>
                <el-form-item prop='Total'>
                  <span class="spanTxt">合计：</span>
                  <span class="colTxt labels fz20">￥{{taskForm.Total}}</span>
                  <span class="labels col9">(合计) = <span v-show="priceShow">{{taskForm.TotalProductPrice}} (产品总价) +</span>
                    {{taskForm.ServiceCharge}}
                    (服务费)</span>
                </el-form-item>
              </div>
              <el-row style="width: 90%;">
                <el-form-item label='备注' prop='Remarks'>
                  <el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Remarks'></el-input>
                </el-form-item>
              </el-row>
            </div>
          </el-form>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="8" class="minRight">
          <div class="tabTitle fl mt20 mb20" @click="toggleRate"><i class="el-icon-dish mr10"></i>汇率</div>
          <el-table :data="rateData" border style="width: 100%" v-show="rateTab">
            <el-table-column prop="CurrencyName" label="币种" align="center"></el-table-column>
            <el-table-column prop="CurrencySymbol" label="单位" align="center"></el-table-column>
            <el-table-column prop="ExchangeRate" label="汇率" align="center"></el-table-column>
          </el-table>
          <div class="tabTitle zengTit mt20 mb20" @click="toggleAddFree"><i class="el-icon-coin mr10"></i>增值费</div>
          <el-table :data="addFreeData" border style="width: 100%" v-show="addFreeTab">
            <el-table-column prop="productPrice" label="产品价格区间" align="center"></el-table-column>
            <el-table-column prop="UnitPrice" label="增值费价格" align="center"></el-table-column>
          </el-table>
          <div class="tabTitle serviceTit mt20 mb20" @click="toggleService"><i class="el-icon-guide mr10"></i>服务费</div>
          <el-table :data="serviceData" border style="width: 100%" v-show="serviceTab">
            <el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
            <el-table-column prop="Probability" label="留评率" align="center" width='100'></el-table-column>
            <el-table-column prop="FeePrice" label="服务费单价" align="center" width='150'></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer txtCenter">
        <el-button type="primary" @click="submitPay('taskForm')">确定</el-button>
        <el-button @click="closeModel">返回</el-button>
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
    <!--    <el-dialog title="温馨提示" :visible.sync="submitModal" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否确认此订单?</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='confirmSubmit'>确定</el-button>
        <el-button @click="submitModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog> -->
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
      <div class="del-dialog-cnt">是否确定取消该订单？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelSubmit'>确定</el-button>
        <el-button @click="cancelModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!-- 付款-->
    <el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" center=""
      :before-close="paymentClose" top='5vh'>
      <el-row class="mb20 center">
        <el-col :span="12" :xs="24">
          <p>
            <span>当前余额：</span>
            <span class="colred fz20">￥{{paymentForm.balance}}</span>
          </p>
        </el-col>
        <el-col :span="12" :xs="24">
          <p>
            <span>待付款金额：</span>
            <span class="colred fz20 disInline">￥{{paymentForm.payMoney}}</span>
          </p>
        </el-col>
      </el-row>
      <div class="center mb20 fz18 mt20">请选择以下方式充值</div>
      <div v-for="(item,index) in paymentCode" :key='index' class="center">
        <div class="fz18 colred mb10">{{item.PaymentState}}</div>
        <img :src="item.Image" alt="">
      </div>
      <div slot="footer" class="dialog-footer">
        <!--   <el-button type="primary" @click='paymentOrder' v-if='parseInt(this.paymentForm.payMoney)<parseInt(this.paymentForm.balance) && parseInt(this.paymentForm.balance)!=0 && !payList'>确定</el-button>
        <el-button type="primary" @click='paymentOrderList' v-if="payList">确定</el-button> -->
        <el-button @click="paymentClose">关闭</el-button>
      </div>
    </el-dialog>
    <!--FBA查看详情-->
    <el-dialog title='详情' :visible.sync="viewDetailModal" width='80%'>
      <view-task :viewOrderData="viewOrderData"></view-task>
      <span slot='footer' class="dialog-footer">
        <el-button type='primary' @click='closeViewModel'>返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import vali from '../common/validate'
  import viewTask from '../common/viewOrderDetails'
  // import FileSaver from 'file-saver'
  // import XLSX from 'xlsx'
  // const cityOptions = ['美国', '日本', '韩国', '加拿大'];
  import {
    addOrder,
    orderList,
    getCountry,
    Rate,
    getServiceFee,
    getService,
    getProbalibi,
    uploadImg,
    GetOrderState,
    orderState,
    getPayment
  } from '@/request/api'
  export default {
    name: 'orderManage',
    data() {
      return {
        percentage: 0, //图片上传进度条
        colors: [{
            color: '#f56c6c',
            percentage: 20
          },
          {
            color: '#e6a23c',
            percentage: 40
          },
          {
            color: '#5cb87a',
            percentage: 60
          },
          {
            color: '#1989fa',
            percentage: 80
          },
          {
            color: '#6f7ad3',
            percentage: 100
          }
        ],
        interval: 0, //加载的定时器
        timeStop: 0, //加载成功停止的定时器
        loading: true, //列表加载
        hideUpload: false,
        limitCount: 1,
        paymentCode: [], //充值二维码
        total: 0, //列表总条数
        file: 'file',
        proImg: false, //图片上传状态
        priceShow: true, //总价显示
        checkAll: false,
        cities: [],
        isIndeterminate: true,
        brushRadio: '',
        serviceUnit: 0, //服务费单价
        addService: 0, //增值费
        ExRate: 0, //汇率
        payList: false, //列表付款按钮显示
        OrderId: '', //任务ID
        Amount: 0,
        uploadUrl: this.axios.defaults.baseURL + '/api/Order/GetProductPictures',
        viewOrderData: [],
        allOrderData: [],
        hasBalance: 0,
        commentTypeData: [], //留评类型
        status: this.$route.params.taskTypeModel,
        errorStatus: this.$route.params.active,
        pageSize: 5, //每页条数
        // btnTask: true,
        currentPage: 1, //页数
        cancelModal: false,
        paymentModel: false,
        refundModal: false, //申请退款
        cancelRefundModal: false, //取消退款
        viewDetailModal: false, //FBA查看详情
        activities: [],
        active: '',
        allNum: 0, //总条数
        addTaskModal: false,
        errorMes: false,
        startTime: '',
        pickerOptions0: this.startDate(),
        taskEndDate: this.endDate(),
        pickerEndDate: this.pickerOptionsEnd(),
        pickerStartDate: this.searchStartDate(),
        rateData: [], // 费率
        addFreeData: [], // 增值费
        serviceData: [], // 服务费
        serviceTab: false, // 服务费显示隐藏
        addFreeTab: false, // 服务费显示隐藏
        rateTab: true, // 服务费显示隐藏
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
        taskData: [{
          startTime: '',
          pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
          numbers: ''
        }],
        taskType: 'all',
        orderTypes: [{
          value: '1',
          label: '见单返本'
        }, {
          value: '2',
          label: '评后返'
        }],
        taskForm: {
          UserId: sessionStorage.getItem('userId'),
          CountryId: '',
          ServiceType: '', //订单类型
          // Country: '', //国家
          Asin: '', //产品ASIN
          ShopName: 'nike', //店铺名称
          ProductName: '', //产品名称
          ProductPrice: '', //价格
          Currency: '', //货币符号
          ProductScore: 0, //评分
          ProductLink: '', //产品链接
          ProductPictures: '', //产品图片
          KeywordType: '1', //关键词类型
          ProductKeyword: '', //搜索关键词
          ProductPosition: '', //留评比例,
          CpcKeyword: '', //CPC关键字
          // CpcPosition: '', //CPC位置
          Number: null, //订单数量
          // Coupon: '0', //是否使用优惠券
          // SelfShip: '1', //是否自发货
          StartTime: '', //任务开始时间
          EndTime: '', //任务结束时间
          TotalProductPrice: 0, //产品总价
          ServiceCharge: 0, //服务费
          Total: 0, //合计
          // LinkURL: '', //链接
          Remarks: '' //备注
        },
        taskRule: {
          Asin: [{
              required: true,
              message: '请输入产品ASIN',
              trigger: 'change'
            },
            {
              validator: vali.flagNum,
              trigger: 'change'
            }
          ],
          CountryId: [{
            required: true,
            message: '请选择国家',
            trigger: 'change'
          }],
          ServiceType: [{
            required: true,
            message: '请选择下单类型',
            trigger: 'change'
          }],
          ProductPictures: [{
            required: true,
            message: '请选择产品图片',
            trigger: 'change'
          }],
          StartTime: [{
            required: true,
            message: '请选择任务开始时间',
            trigger: 'change'
          }],
          EndTime: [{
            required: true,
            message: '请选择任务结束时间',
            trigger: 'change'
          }],
          ProductName: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'change'
          }],
          ProductPrice: [{
              required: true,
              message: '请输入产品价格',
              trigger: 'change'
            },
            {
              validator: vali.proPrice,
              trigger: 'change'
            }
          ],
          ProductLink: [{
              required: true,
              message: '请输入产品链接',
              trigger: 'change'
            },
            {
              validator: vali.checkLink,
              trigger: 'change'
            }
          ],
          ProductKeyword: [{
            required: true,
            message: '请输入关键字',
            trigger: 'change'
          }],
          Number: [{
              required: true,
              message: '请输入购买数量',
              trigger: 'change'
            },
            {
              validator: vali.checkNum,
              trigger: 'change'
            }
          ],
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
          }],
          ProductPosition: [{
            required: true,
            message: '请选择留评比例',
            trigger: 'change'
          }]
        },
        obj: [],
        allState: [] //全部状态管理
      }
    },
    components: {
      viewTask
    },
    created() {
      this.allOrderList()
      this.getAllCountry()
      this.allOrderStatus()
    },
    methods: {
      //进度条
      onProgress(e, file, v) {
        let that = this;
        let endPro = 95;
        that.loading = true;
        that.interval = setInterval(function() {
          if (that.percentage < endPro) {
            that.percentage++;
          }
        }, 500)
      },
      //初始化订单列表
      allOrderList() {
        let _this = this
        let param = {
          userId: sessionStorage.getItem('userId'),
          countryIdx: _this.searchForm.checkedCities,
          state: _this.active,
          statetime: _this.searchForm.orderStartTime,
          endtime: _this.searchForm.orderEndTime,
          kWord: _this.searchForm.Keyword,
          pageNum: _this.currentPage,
          pagesize: _this.pageSize
        }
        orderList(param).then((res) => {
          _this.loading = false
          _this.allOrderData = res.data.list
          _this.total = parseInt(res.data.total)
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            let proKey = list[i].ProductKeyword
            let cpcKey = list[i].CpcKeyword
            if (proKey == null) {
              proKey = ''
            }
            if (cpcKey == null) {
              cpcKey = ''
            }
            _this.allOrderData[i].ProductKeyword = proKey + cpcKey
          }
        })
      },
      //每页条数
      handleSizeChange(size) {
        let _this = this
        _this.pageSize = size
        // console.log(size)
        _this.allOrderList()
      },
      // 分页导航
      handleCurrentChange(currentPage) {
        let _this = this
        _this.currentPage = currentPage
        _this.allOrderList()
      },
      // 关键字类型切换
      changeKeyword() {
        let _this = this
        let val = _this.taskForm.KeywordType
        if (val == 1) {
          _this.taskForm.CpcKeyword = ''
        } else if (val == 2) {
          _this.taskForm.ProductKeyword = ''
        }
      },
      // 格式化订单状态
      txtOrderStatus(val) {
        if (val.OrderState == 1) {
          return '待确认'
        } else if (val.OrderState == 2) {
          return '待分配'
        } else if (val.OrderState == 3) {
          return '已分配'
        } else if (val.OrderState == 4) {
          return '已完成'
        } else if (val.OrderState == 5) {
          return '已取消'
        }
      },
      // 获取订单状态数量
      allOrderStatus() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        GetOrderState(param).then(res => {
          _this.allState = res.data
        })
      },
      //上传图片前检验图片格式和大小
      beforeUpload(file) {
        let _this = this
        const isImg = file.type === 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isImg) {
          this.$message.error('只能上传jpg/jpeg/png的图片文件!');
        } else if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        } if(isLt5M) {
          _this.loading = true
        }
        return isImg && isLt5M;
      },
      // 上传图片change
      handleChange(file, fileList) {
        let _this = this
        // _this.hideUpload = fileList.length >= _this.limitCount;
      },
      // 上传产品图片
      handleRemove(file, fileList) {
        let _this = this
        _this.taskForm.ProductPictures = ''
        // _this.hideUpload = fileList.length >= _this.limitCount;
        clearInterval(_this.interval)
        _this.percentage = 0;
        _this.loading = false;
      },
      handlePictureCardSuccess(res, file) {
        let _this = this
        _this.percentage = 100;
        clearInterval(_this.interval)
        _this.taskForm.ProductPictures = res.Data;
        _this.$refs.image.clearValidate()
        _this.timeStop = setTimeout(() => {
          _this.loading = false;
          _this.percentage = 0;
          clearTimeout(_this.timeStop)
          //根据实际开发情况处理响应
          if (file.status == 'success') {
            //文件上传成功，返回状态数据
            _this.$message({
                type: 'success',
                message: '上传成功'
              });
          } else {
            _this.$message.error(res.message || '上传失败');
          }
        }, 100)
      },
      handleDownload(file) {
        console.log(file);
      },
      // 全选
      handleCheckAllChange(val) {
        let _this = this
        let cities = _this.cities
        _this.searchForm.checkedCities = val ? cities : [];
        _this.isIndeterminate = false;
      },
      // 选择国家
      handleCheckedCitiesChange(value) {
        let _this = this
        let checkedCount = value.length;
        _this.checkAll = checkedCount === _this.cities.length;
        _this.isIndeterminate = checkedCount > 0 && checkedCount < _this.cities.length;
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
      // 创建订单
      createOrder() {
        let _this = this
        _this.addTaskModal = true
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        getCountry(param).then((res) => {
          _this.countryData = res.data.list
        }).catch(err => {
          console.log(err)
        })
        // 汇率
        Rate().then((res) => {
          _this.rateData = res.data.list
        }).catch(err => {
          console.log(err)
        })
        // 增值费
        getServiceFee().then((res) => {
          _this.addFreeData = res.data.list
          let fee = res.data.list
          for (let i = 0; i < fee.length; i++) {
            let min = fee[i].Start
            let max = fee[i].Ent
            let UnitPrice = fee[i].IServiceFee
            let productPrice = '$ ' + min + ' - ' + '$ ' + max
            _this.addFreeData[i].productPrice = productPrice
            _this.addFreeData[i].UnitPrice = '￥' + UnitPrice
            _this.addFreeData[i].price = UnitPrice
          }
        }).catch(err => {
          console.log(err)
        })
        // 服务费
        getService().then((res) => {
          _this.serviceData = res.data.list
        }).catch(err => {
          console.log(err)
        })
      },
      // 下单类型选择
      checkOrderType: function() {
        let _this = this
        let types = _this.taskForm.ServiceType
        if (types == '2') {
          _this.priceShow = false
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge)).toFixed(2)
          _this.taskForm.TotalProductPrice = '0'
        } else if (types == '1') {
          _this.priceShow = true
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge) + parseFloat(_this.taskForm.TotalProductPrice)).toFixed(2)
        }
      },

      // 获取服务费单价
      getFee(obj, param1, param2) {
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].CountryId === param1 && obj[i].Probability === param2) ||
            (obj[i].Probability === param1 && obj[i].CountryId === param2)) {
            return obj[i].FeePrice;
          }
        }
      },
      //取增值费
      getAddService(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (param >= obj[i].Start && param <= obj[i].Ent) {
            return obj[i].IServiceFee
          } else if(param < obj[i].Start){
            return 0
          }
        }
      },
      //取汇率
      getRate(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].CountryId == param) {
            return obj[i].ExchangeRate
          }
        }
      },
      // 取货币符号
      getSymbol(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].CountryId == param) {
            return obj[i].CurrencySymbol
          }
        }
      },
      // 留评比例
      lpType(index) {
        let _this = this
        let lp = _this.taskForm.ProductPosition
        let countryId = _this.taskForm.CountryId
        let types = _this.taskForm.ProductPosition
        let obj = _this.serviceData
        _this.serviceUnit = _this.getFee(obj, countryId, types)
        _this.checkBuyNumFBA()
      },
      //列表确认付款弹窗
      payMent() {
        let _this = this
        _this.paymentModel = true
        _this.hasBalance = 1
        _this.paymentForm.balance = sessionStorage.getItem('balance')
        getPayment().then(res => {
          let list = res.data.list
          _this.paymentCode = res.data.list
          for (let i = 0; i < list.length; i++) {
            let state = list[i].PaymentState
            if (state == 1) {
              _this.paymentCode[i].PaymentState = '支付宝'
            } else if (state == 2) {
              _this.paymentCode[i].PaymentState = '微信'
            }
          }

        }).catch(err => {
          console.log(err)
        })
      },
      // 重置
      resetTask() {
        let _this = this
        _this.currentPage = 1
        _this.searchForm = {
          Keyword: '',
          orderStartTime: '',
          orderEndTime: '',
          checkedCities: []
        }
        _this.allOrderList()
      },
      // 时间范围
      timePicker() {
        let _this = this
        let pickTimes = _this.taskForm.OrderSchedule[0].StartDate
        let len = _this.taskForm.OrderSchedule.length
        for (let i = 0; i < len; i++) {
          _this.taskForm.OrderSchedule[i].StartDate = pickTimes
        }
      },

      // FBA代购数量为1
      checkBuyNumFBA() {
        let _this = this
        let nums = _this.taskForm.Number
        let obj = _this.addFreeData
        let price = parseInt(_this.taskForm.ProductPrice)
        // _this.getAddService(obj, nums)
        // _this.getProTotal()
        _this.addService = _this.getAddService(obj,price)
        let serviceFree = _this.addService
        let serviceUnit = _this.serviceUnit
        let types = _this.taskForm.ServiceType
        _this.taskForm.ServiceCharge = ((nums * serviceFree) + (nums * serviceUnit)).toFixed(2)
        _this.taskForm.TotalProductPrice = (_this.taskForm.ProductPrice * nums * _this.ExRate).toFixed(2)
        if (types == '2') {
          _this.priceShow = false
           _this.taskForm.TotalProductPrice = '0'
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge)).toFixed(2)
        } else if (types == '1') {
          _this.priceShow = true
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge) + parseFloat(_this.taskForm.TotalProductPrice)).toFixed(2)
        }


      },


      // 付款关闭页面
      paymentClose() {
        let _this = this
        _this.paymentModel = false
        _this.payList = false
        _this.hasBalance = 0
      },
      // 创建任务提交订单到支付
      submitPay(formName) {
        let _this = this
        let errorMes = _this.errorMes
        let fileList = _this.FileList
        _this.$refs[formName].validate((valid) => {
          if (valid && !errorMes) {
            let param = Object.assign({}, _this.taskForm)
            addOrder(param).then((res) => {
              _this.OrderId = res.data.OrderId
              _this.paymentModel = true
              _this.paymentForm.payMoney = _this.taskForm.Total
              _this.addTaskModal = false
              _this.$refs['taskForm'].resetFields()
              // _this.$refs.upload.clearFiles()
              _this.taskForm.ProductKeyword = ''
              _this.taskForm.CpcKeyword = ''
              _this.payMent()
              _this.allOrderList()
              _this.allOrderStatus()
            })
          }
        })
      },
      // 取消
      cancelHandel(index, row) {
        let _this = this
        _this.cancelModal = true
        _this.OrderId = row.Id
      },
      //取消确定
      cancelSubmit() {
        let _this = this
        let orderId = _this.OrderId
        let param = {
          UserId: parseInt(sessionStorage.getItem('userId')),
          Id: parseInt(orderId)
        }
        orderState(param).then(res => {
          if (res.data.Code === 'ok') {
            _this.cancelModal = false
            _this.$message({
              type: 'success',
              message: '操作成功'
            })
            _this.allOrderList()
            _this.allOrderStatus()
          }
        })
      },
      //全部
      getAllStatus() {
        let _this = this
        _this.active = ''
        _this.allOrderList()
      },
      // 待确认
      daiConfirm() {
        let _this = this
        _this.active = 1
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 待分配
      daifp() {
        let _this = this
        _this.active = 2
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已分配
      yfp() {
        let _this = this
        _this.active = 3
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已完成
      ywc() {
        let _this = this
        _this.active = 4
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已取消
      daiCancel() {
        let _this = this
        _this.active = 5
        _this.currentPage = 1
        _this.allOrderList()
      },
      searchStartDate() {
        let _this = this
        return {
          disabledDate: time => {
            let endDateVal = _this.searchForm.orderEndTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        }
      },
      // 搜索下单结束时间
      pickerOptionsEnd() {
        let _this = this
        return {
          disabledDate: time => {
            let beginDateVal = _this.searchForm.orderStartTime
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            }
          }
        }
      },
      // 任务结束时间
      endDate() {
        let _this = this
        return {
          disabledDate: time => {
            let beginDateVal = _this.taskForm.StartTime
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
      // FB任务弹窗返回按钮
      closeModel() {
        let _this = this
        let fileList = _this.FileList
        _this.addTaskModal = false
        // _this.btnTask = true
        _this.$refs['taskForm'].resetFields()
        _this.taskForm.ServiceFee = 0
        _this.taskForm.OrderTotal = 0
        _this.taskForm.ProductTotal = 0
      },

      // 查看任务详情
      viewDetails(index, row) {
        let _this = this
        let obj = _this.obj
        _this.viewDetailModal = true
        _this.viewOrderData = _this.allOrderData[index]
        // let val = _this.viewTaskData
        // if (val.OrderState == 1) {
        //   _this.viewTaskData.OrderState = '待确认'
        // } else if (val.OrderState == 2) {
        //   _this.viewTaskData.OrderState = '待分配'
        // } else if (val.OrderState == 3) {
        //   _this.viewTaskData.OrderState = '已分配'
        // } else if (val.OrderState == 4) {
        //   _this.viewTaskData.OrderState = '已完成'
        // } else if (val.OrderState == 5) {
        //   _this.viewTaskData.OrderState = '已取消'
        // }
        // if (val.ServiceType == 1) {
        //   _this.viewTaskData.ServiceType = '见单返本'
        // } else if (val.ServiceType == 2) {
        //   _this.viewTaskData.ServiceType = '评后返'
        // }
        // if (val.KeywordType == 1) {
        //   _this.viewTaskData.KeywordType = '产品关键字'
        // } else if (val.KeywordType == 2) {
        //   _this.viewTaskData.KeywordType = 'CPC关键字'
        // } else {
        //   return
        // }
      },
      // 详情关闭
      closeViewModel() {
        let _this = this
        _this.viewDetailModal = false
        _this.viewOrderData = []
      },
      // 服务费显示与隐藏
      toggleService() {
        let _this = this
        let tabs = _this.serviceTab
        if (tabs) {
          _this.serviceTab = false
        } else {
          _this.serviceTab = true
        }
      },
      // 增值费显示与隐藏
      toggleAddFree() {
        let _this = this
        let tabs = _this.addFreeTab
        if (tabs) {
          _this.addFreeTab = false
        } else {
          _this.addFreeTab = true
        }
      },
      // 汇率显示与隐藏
      toggleRate() {
        let _this = this
        let tabs = _this.rateTab
        if (tabs) {
          _this.rateTab = false
        } else {
          _this.rateTab = true
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

      //产品总价
      getProTotal() {
        let _this = this
        let unit = _this.taskForm.Price
        let num = _this.taskForm.OrderNum
        let rate = _this.ExRate
        _this.taskForm.ProductTotal = unit * rate * num
      },
      //根据国家取货币符号
      checkCountry(index) {
        let _this = this
        let obj = _this.rateData
        let Id = _this.taskForm.CountryId
        _this.ExRate = _this.getRate(obj, Id)
        _this.taskForm.Currency = _this.getSymbol(obj, Id)
        _this.checkBuyNumFBA()
        let param = {
          cid: _this.taskForm.CountryId
        }
        getProbalibi(param).then(res => {
          _this.commentTypeData = res.data
        })
      },

      //查询
      searchOrder() {
        let _this = this
        _this.allOrderList()
      }
    }
  }
</script>

<style scoped>
/*  /deep/.hide .el-upload--picture-card {
    display: none;
  } */

  .drag-upload {
    .drag-upload__icon {
      font-size: 40px;
      line-height: 40px;
      color: var(--theme);
      margin: 0;
    }

    .drag-upload__text {
      line-height: 20px;
      margin-bottom: 6px;
    }

    .drag-upload__tip {
      font-size: 12px;
      line-height: 20px;
      color: $auxiliary-text-color;
    }
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
    padding: 20px;
    text-align: center;
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
