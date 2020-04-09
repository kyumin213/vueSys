<template>
  <div>
    <div>
      <div class="mb20 mt20">
        <span class="tabsTxt">
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
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
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
    <div class="tabBox">
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 0 ? 'active':''" data-index="0" @click="getAllStatus">全部<span>({{allDataNum}})</span></li>
          <li :class="active === 1 ? 'active':''" data-index="1" @click="daiPay">待付款<span>({{StatusSum[1]}})</span></li>
          <li :class="active === 2 ? 'active':''" data-index="2" @click="daiConfirm">待确认<span>({{StatusSum[1]}})</span></li>
          <li :class="active === 3 ? 'active':''" data-index="3" @click="daifp">待分配<span>({{StatusSum[1]}})</span></li>
          <li :class="active === 4 ? 'active':''" data-index="4" @click="yfp">已分配<span>({{StatusSum[1]}})</span></li>
          <li :class="active === 5 ? 'active':''" data-index="5" @click="ywc">已完成<span>({{StatusSum[2]}})</span></li>
          <li :class="active === 6 ? 'active':''" data-index="6" @click="daiCancel">已取消<span>({{StatusSum[3]}})</span></li>
          <!--<li :class="active === 4 ? 'active':''" :data-index="4" @click="errData">异常<span>({{StatusSum[4]}})</span></li>-->
          <!-- <li :class="active === 4 ? 'active':''" :data-index="4" @click="returnMoney">退款<span>({{StatusSum[4]}})</span></li> -->
        </ul>
      </div>
      <div class="tabRight">
        <el-button type="primary" size="medium" @click="createTsk">创建订单</el-button>
      </div>
    </div>
    <div class="mt10 tableBg" style="overflow-x: auto">
      <el-table :data="allOrderData" border style="width: 100%;overflow-x: auto" id="allOrder" @row-click="brushShowRow">
        <el-table-column show-overflow-tooltip width="40px" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="brushRadio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" :disabled="disable1" type="primary" @click="payMent">付款</el-button>
            <el-button size="small" :disabled="disable2" @click="cancelHandel">取消</el-button>
            <!--<el-button size="small" :disabled="disable3" type="success" @click="evalEdit()">填写评价</el-button>-->
            <el-button size="small" :disabled="disable4" type="warning" @click="viewDaily()">日志</el-button>
            <el-button size="small" :disabled="disable5" type="danger" @click="delhandel">删除</el-button>
            <!--<el-button size="small" :disabled="disable6" type="primary" @click="confirmBtn">确认完成</el-button>-->
            <el-button size="small" :disabled="disable7" type="danger" @click="refundBtn">申请退款</el-button>
            <el-button size="small" :disabled="disable8" type="danger" @click="cancelRefundBtn">取消退款</el-button>
            <el-button size="small" :disabled="disable9" @click="cancelReasonBtn">取消原因</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- FBA任务-->
    <el-dialog title="创建任务" :visible.sync="addTaskModal" width="90%" custom-class="fixed-dialog" :close-on-click-modal="false"
      :before-close="closeModel" top='5vh'>
      <el-row>
        <div class="mb20">产品信息</div>
      </el-row>
      <el-row>
        <el-col :span="16" :xs="24" :sm="24" :md="24" :lg="16">
          <el-form :model="taskForm" ref="taskForm"  :rules="taskRule" class="demo-ruleForm" status-icon>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="下单类型" class="disInline minWid" prop="CountryId">
                  <el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
                    <el-option  value="0" label="见单返本"></el-option>
                    <el-option  value="1" label="评后返"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="产品ASIN" class="disInline minWid" prop="ASIN">
                  <el-input v-model="taskForm.ASIN" maxlength="10" show-word-limit placeholder="长度为10的数字和字母组合"></el-input>
                  <!-- <el-button size='small' @click='helpCenter'>帮助中心</el-button> -->
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
                  <el-input v-model="taskForm.ProductName" type='textarea'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="12" :xs="24">
                <el-form-item label="产品价格" class="disInline minWid" prop="Price">
                  <el-input type="text" @blur="checkBuyNumFBA" v-model="taskForm.Price" placeholder="请输入数字">
                    <template slot="prepend">{{taskForm.Currency}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <p class="lh40">产品评分</p>
                <el-form-item prop='StarScore'>
                  <el-rate v-model="taskForm.StarScore"></el-rate>
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <el-col :span="12" :xs="24" class="fright">
                <el-form-item label="产品图片" class="disInline">
                  <img :src="taskForm.ProductImage" alt="" class="proImg">
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

            </el-row>
            <el-row>
              <div class="mt30 mb20">下单信息</div>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="关键词类型" prop='KeywordType'>
                  <el-radio-group v-model="taskForm.KeywordType">
                    <el-radio label="1">产品关键字</el-radio>
                    <el-radio label="2">CPC关键字</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
             <el-col :span="12" :xs="24">
               <el-form-item label="搜索关键词" class="disInline minWid" prop="Keyword">
                 <el-input v-model="taskForm.Keyword" placeholder='请输入关键词'></el-input>
               </el-form-item>
             </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="订单数量" class="disInline minWid" prop="OrderNum">
                  <el-input v-model="taskForm.OrderNum" @blur="checkBuyNumFBA" placeholder="请输入正整数"></el-input>
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
                <el-form-item label="Feedback数量" class="disInline minWid" prop='Facebook'>
                  <el-input type="text" required="false" v-model="taskForm.Facebook" placeholder="请输入正整数"></el-input>
                  <p><span class="tipRed" v-if="parseInt(this.taskForm.Facebook)>parseInt(this.taskForm.OrderNum) || parseInt(this.taskForm.fbNumber)<0">数量必须小于等于订购数量{{taskForm.buyNum}}</span></p>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="是否使用优惠券" prop='Coupon'>
                  <el-radio-group v-model="taskForm.Coupon">
                    <el-radio label="0">不用</el-radio>
                    <el-radio label="1">用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
<!--              <el-col :span="12" :xs="24">
                <el-form-item label="是否自发货" prop='SelfShip'>
                  <el-radio-group v-model="taskForm.SelfShip">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
            </el-row>
            <div class="con">
                <el-row>
                  <el-col :span='12' :xs="24">
                    <el-form-item label="任务开始时间" class="disInline minWid" :rules="{required: true, message: '任务时间不能为空', trigger: 'change'}">
                      <el-date-picker  v-model="taskForm.startDate" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"  type="date" placeholder="选择日期"
                        :picker-options="pickerOptions0">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12' :xs="24" >
                    <el-form-item label="任务结束时间" class="disInline minWid">
                      <el-date-picker v-model="taskForm.endDate" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"  type="date" placeholder="选择日期"
                        :picker-options="taskEndDate">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              <el-row>
                <el-col :span="24" :xs="24">
                  <el-form-item prop='ProductTotal'>
                    <span class="spanTxt">产品总价：</span>
                    <span class="colTxt labels fz20">￥{{taskForm.ProductTotal}}</span>
                    <span class="labels col9">(产品总价) = {{taskForm.Price}} (产品价格) * {{taskForm.OrderNum}} (数量) *</span>
                    <span class='col9'>{{ExRate}} (汇率)</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop='ServiceFee'>
                <span class="spanTxt">服务费：</span>
                <span class="colTxt labels fz20">￥{{taskForm.ServiceFee}}</span>
                <span class="labels col9">(服务费) = {{serviceUnit}} (服务费单价) * {{taskForm.OrderNum}} (数量) + {{addService}}
                  (增值费单价) * {{taskForm.OrderNum}} (数量)</span>
              </el-form-item>
              <div>
                <el-form-item prop='OrderTotal'>
                  <span class="spanTxt">合计：</span>
                  <span class="colTxt labels fz20">￥{{taskForm.OrderTotal}}</span>
                  <span class="labels col9">(合计) = {{taskForm.ProductTotal}} (产品总价) + {{taskForm.ServiceFee}} (服务费)</span>
                </el-form-item>
              </div>
              <el-row>
                <el-form-item label='备注' prop='Memo'>
                  <el-input type='textarea' :autosize="{ minRows: 2, maxRows: 6}" v-model='taskForm.Memo'></el-input>
                </el-form-item>
              </el-row>
            </div>
          </el-form>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="8" class="minRight">
          <div class="tabTitle fl mt20 mb20" @click="toggleRate"><i class="el-icon-dish mr10"></i>费率</div>
          <el-table :data="rateData" border style="width: 100%" v-show="rateTab">
            <el-table-column prop="CurSymbol" label="币种" align="center"></el-table-column>
            <el-table-column prop="CurCode" label="单位" align="center"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="submitPay('taskForm')">确定</el-button>
        <el-button size="medium" @click="closeModel">返回</el-button>
      </span>
    </el-dialog>
    <!-- 填写评价-->
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
              <img :src="item" alt="" class='comImg' @click='delImg(index)' />
              <span class="iconItem" @click='delImg(index)'>
                <span class="imgDelModal"></span>
                <i class="el-icon-delete delIcon"></i>
              </span>
            </span>

          </div>
          <!--<el-input type='file' name='file' accept="image/png,image/jpeg,image/jpg" @change="update"></el-input>-->
          <input ref='file' name="file" style='display: none;' type="file" accept="image/png,image/jpeg,image/jpg"
            @change="update" />
          <span  class="fileBtn">选择图片</span>
        </el-form-item>
        <el-form-item class='txtCenter'>
          <div class="Upload_pictures">
            <span></span>
            <span>最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
            <p class="colred" v-show='videoSuccess'>视频已上传成功！</p>
            <p class="colred" v-show='videlIng'>视频上传中...</p>
          </div>
          <input name="files" type="file" ref='files' style='display: none;' />
          <span  class="fileBtn" v-show="videoTip">选择视频</span>
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
    <el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose"
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
    name: 'orderManage',
    data() {
      return {
        checkAll: false,
        cities: cityOptions,
        isIndeterminate: true,
      allDataNum: 0,
        brushRadio: '',
        disable1: true,
        disable2: true,
        disable3: true,
        disable4: true,
        disable5: true,
        disable6: true,
        disable7: true,
        disable8: true,
        disable9: true,
        serviceUnit: 0, //服务费单价
        addService: 0, //增值费
        ExRate: 0, //汇率
        activeTask: 0, //除FBA任务外的其它任务状态
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
        startTime: '',
        buyNumData: [],
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
        taskData: [{
          startTime: '',
          pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
          numbers: ''
        }],
        activeName: 'first',
        taskType: 'all',

        taskForm: {
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
          Price: '0', //价格
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
          OrderNum: 0, //订单数量
          ServiceType: '', //留评类型
          Facebook: 0, //feedback数量
          Coupon: '0', //是否使用优惠券
          SelfShip: '1', //是否自发货
          startDate:'', //任务开始时间
          endDate:'', //任务结束时间
          ProductTotal: 0, //产品总价
          ServiceFee: 0, //服务费
          OrderTotal: 0, //合计
          LinkURL: '', //链接
          Memo: '' //备注
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
      //选中的行
      brushShowRow(row) {
        let _this = this
        _this.brushRadio = _this.allOrderData.indexOf(row)
        _this.selected = row
        if (row.Status == '代付款') {
          _this.disable1 = false
          _this.disable2 = false
          _this.disable3 = true
          _this.disable4 = true
          _this.disable5 = true
          _this.disable6 = true
          _this.disable7 = true
          _this.disable8 = true
          _this.disable9 = true
        } else if (row.Status == '取消') {
          _this.disable1 = true
          _this.disable2 = true
          _this.disable3 = true
          _this.disable4 = false
          _this.disable5 = true
          _this.disable6 = true
          _this.disable7 = true
          _this.disable8 = true
          _this.disable9 = true
        } else if (row.Status == '待收货') {
          _this.disable1 = true
          _this.disable2 = true
          _this.disable3 = true
          _this.disable4 = true
          _this.disable5 = false
          _this.disable6 = false
          _this.disable7 = true
          _this.disable8 = true
          _this.disable9 = true
        } else if (row.Status == '退款') {
          _this.disable1 = true
          _this.disable2 = true
          _this.disable3 = true
          _this.disable4 = true
          _this.disable5 = true
          _this.disable6 = true
          _this.disable7 = false
          _this.disable8 = true
          _this.disable9 = true
        } else if (row.Status == '取消') {
          _this.disable1 = true
          _this.disable2 = true
          _this.disable3 = true
          _this.disable4 = true
          _this.disable5 = true
          _this.disable6 = true
          _this.disable7 = true
          _this.disable8 = false
          _this.disable9 = false
        } else {
          _this.disable1 = true
          _this.disable2 = true
          _this.disable3 = true
          _this.disable4 = true
          _this.disable5 = true
          _this.disable6 = true
          _this.disable7 = true
          _this.disable8 = true
          _this.disable9 = true
        }
      },
      //任务类型列表
      getTaskList() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          Platform: 99
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/newOrderOne', param).then(res => {
          if (res.data.status == 200) {
            _this.taskTypeData = res.data.data.TasksList
          } else if (res.data.status == 400) {
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

      //获取类型
      getInfo(obj, param1, param2) {
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].TypeName == param1 && obj[i].Value == param2) ||
            (obj[i].Value == param1 && obj[i].TypeName == param2)) {
            return obj[i].Display;
          }
        }
      },
      //取增值费
      getAddService(obj, param3) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (param3 >= obj[i].MinVal && param3 <= obj[i].MaxVal) {
            return obj[i].price
          }
        }
      },
      //取汇率
      getRate(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].CurSymbol == param) {
            return obj[i].ExRate
          }
        }
      },
      //任务类型搜索
      checkTask(value) {
        let _this = this
        _this.BaseTaskType = value
        _this.currentPage = 1
        _this.brushRadio = ''
        _this.disable1 = true
        _this.disable2 = true
        _this.disable4 = true
        _this.disable5 = true
        _this.disable7 = true
        _this.disable8 = true
        _this.disable9 = true
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
          if (res.data.status == 200) {
            let status = res.data.data.StatusSum
            _this.StatusSum = status
            _this.allNum = res.data.data.TotalRecords
            let count = 0
            for (let i = 1; i <= 9; i++) {
              count += Number(_this.StatusSum[i])
            }
            _this.allDataNum = count
            let len = res.data.data.RstList
            for (let i = 0; i < len.length; i++) {
              let plat = len[i].Platform
              let country = len[i].Country
              len[i].Platform = plat + '/' + country
              len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
              len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
              len[i].Device = _this.getInfo(_this.obj, 'DeviceType', len[i].Device)
            }
            _this.allOrderData = res.data.data.RstList
            _this.loading = false
          } else if (res.data.status == 400) {
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
          Status: parseInt(status),
          Page: 1,
          offset: _this.offset
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doOrderList', param).then((res) => {
          if (res.data.status == 200) {
            let len = res.data.data.RstList
            _this.allNum = res.data.data.TotalRecords
            _this.StatusSum = res.data.data.StatusSum
            for (let i = 0; i < len.length; i++) {
              let plat = len[i].Platform
              let country = len[i].Country
              len[i].Platform = plat + '/' + country
              len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
              len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
            }

            _this.allOrderData = res.data.data.RstList
            _this.loading = false
          }
          if (res.data.status == 400) {
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
        if (errors != undefined) {
          this.errData()
        }
      },
      // 点赞任务提交
      confirLikeForm(formName) {
        let _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = Object.assign({}, _this.likesForm)
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
              if (res.data.status == 200) {
                _this.$message({
                  type: 'success',
                  message: res.data.message
                })
                _this.OrderId = res.data.data.OrderId
                _this.paymentForm.payMoney = _this.likesForm.OrderTotal
                _this.paymentForm.balance = sessionStorage.getItem('balance')
                _this.paymentModel = true
                _this.likesModel = false
                _this.taskTypeModel = false
                _this.$refs['likesForm'].resetFields()
                _this.getAllData(4)
                _this.BaseTaskType = '4'
              }
              if (res.data.status == 400) {
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
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
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
        let nums = _this.taskForm.OrderNum
        let obj = _this.addFreeData
        let price = _this.taskForm.Price
        _this.getAddService(obj, nums)
        _this.getProTotal()
        _this.addService = _this.getAddService(obj, price)
        let serviceFree = _this.addService
        let serviceUnit = _this.serviceUnit
        _this.taskForm.ServiceFee = nums * serviceFree + nums * serviceUnit
        _this.taskForm.OrderTotal = _this.taskForm.ServiceFee + _this.taskForm.ProductTotal
        _this.taskForm.OrderSchedule = [{
          StartDate: '',
          pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
          Number: ''
        }]
        if (parseInt(nums) === 1) {
          _this.btnTask = true
          _this.taskForm.OrderSchedule[0].Number = 1
        } else {
          _this.btnTask = false
          _this.taskForm.OrderSchedule[0].Number = ''
        }
        _this.getDate()
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
        _this.$refs[formName].validate((valid) => {
          if (valid && !errorMes) {
            let len = _this.taskForm.OrderSchedule
            for (let i = 0; i < len.length; i++) {
              len[i].StartHourMin = len[i].pickTime[0]
              len[i].EndHourMin = len[i].pickTime[1]
            }
            let pick = _this.taskForm.OrderSchedule.pickTime
            let param = Object.assign({}, _this.taskForm)
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewOrder', param).then(res => {
              if (res.data.status == 200) {
                _this.$message({
                  type: 'success',
                  message: res.data.message
                })
                _this.OrderId = res.data.OrderId
                _this.paymentModel = true
                _this.paymentForm.payMoney = _this.taskForm.OrderTotal
                _this.paymentForm.balance = sessionStorage.getItem('balance')
                _this.addTaskModal = false
                _this.taskTypeModel = false
                _this.$refs['taskForm'].resetFields()
                _this.getAllData(1)
                _this.BaseTaskType = '1'
              } else {
                console.log(res.data.message)
              }
            })
          }
        })
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
          if (res.data.status == 200) {
            _this.cancelModal = false
            _this.getAllData(_this.BaseTaskType)
            _this.$message({
              type: 'success',
              message: res.data.message
            })
          } else if (res.data.status == 400) {
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
          if (res.data.status == 200) {
            _this.activities = res.data.data.Logs
          }
          if (res.data.status == 400) {
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
        _this.brushRadio = ''
        _this.allDisable()
      },

      //待付款
      daiPay() {
        let _this = this
        _this.active = 1
        _this.getDataStatus(1)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 待确认
      daiConfirm() {
        let _this = this
        _this.active = 2
        _this.getDataStatus(2)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 待分配
      daifp() {
        let _this = this
        _this.active = 3
        _this.getDataStatus(3)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // yfp
      yfp() {
        let _this = this
        _this.active = 4
        _this.getDataStatus(4)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 已完成
      ywc() {
        let _this = this
        _this.active = 5
        _this.getDataStatus(5)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 已取消
      daiCancel() {
        let _this = this
        _this.active = 6
        _this.getDataStatus(6)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 异常
      errData() {
        let _this = this
        _this.active = 8
        _this.getDataStatus(8)
        _this.brushRadio = ''
        _this.allDisable()
      },
      // 退款
      returnMoney() {
        let _this = this
        _this.active = 4
        _this.getDataStatus(4)
        _this.brushRadio = ''
        _this.allDisable()
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
      endDate(){
        let _this = this
        return {
          disabledDate: time => {
            let beginDateVal = _this.taskForm.startDate
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
        _this.addTaskModal = false
        _this.disabled = true
        _this.buyCarModel = false
        _this.wishModel = false
        _this.btnTask = true
        _this.$refs['taskForm'].resetFields()
        _this.taskForm.ServiceFee = 0
        _this.taskForm.OrderTotal = 0
        _this.taskForm.ProductTotal = 0
      },

      // FB任务代购数量
      allBuyNum(index) {
        let _this = this
        _this.index = index
        let buyNum = _this.taskForm.OrderNum
        let taskTime = _this.taskForm.OrderSchedule
        var result = 0
        for (let i = 0; i < taskTime.length; i++) {
          result += parseInt(taskTime[i].Number)
        }
        console.log(result)
        if (parseInt(result) > parseInt(buyNum)) {
          _this.errorMes = true
          return false
        } else {
          _this.errorMes = false
        }
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
          if (res.data.status == 200) {
            _this.$message({
              type: 'success',
              message: res.data.message
            })
            _this.assessModel = false
            _this.getAllData(1)
          } else if (res.data.status == 400) {
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
          if (res.data.status == 200) {
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
          }
          if (res.data.status == 400) {
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
      // 留评类型
      lpType(index) {
        let _this = this
        let lp = _this.commentTypeData[index].Service
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
        _this.addTaskModal = true
      },
      //进入新任务页面
      intoNewTask(index) {
        let _this = this
        _this.PlatformId = _this.taskTypeData[index].PlatformId
        _this.taskForm.PlatformId = _this.taskTypeData[index].PlatformId
        _this.likesForm.PlatformId = _this.taskTypeData[index].PlatformId
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: _this.taskTypeData[index].PlatformId,
          Platform: _this.taskTypeData[index].Platform,
          baseTaskId: '1',
          baseTaskType: '1'
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/newOrderTwo', param).then(res => {
          if (res.data.status == 200) {
            _this.countryData = res.data.data.Country
            _this.rateData = res.data.data.ExRate
            _this.addFreeData = res.data.data.ValueAdded
            _this.QaForm.QAFee = res.data.data.QAFee
            _this.likesForm.LikeFee = res.data.data.LikeFee
            let fee = res.data.data.ValueAdded
            for (let i = 0; i < fee.length; i++) {
              let min = fee[i].MinVal
              let max = fee[i].MaxVal
              let UnitPrice = fee[i].UnitPrice
              let productPrice = '$ ' + min + ' - ' + '$ ' + max
              _this.addFreeData[i].productPrice = productPrice
              _this.addFreeData[i].UnitPrice = '￥' + UnitPrice
              _this.addFreeData[i].price = UnitPrice
            }

          }
          if (res.data.status == 400) {
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
        _this.taskForm.ServiceType = null
        _this.taskForm.Currency = _this.countryData[index].CurrSymbal
        _this.taskForm.Country = _this.countryData[index].Code
        let obj = _this.rateData
        _this.ExRate = _this.getRate(obj, _this.taskForm.Currency)
        _this.getProTotal()
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: _this.PlatformId,
          Country: _this.countryData[index].Code
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetService', param).then(res => {
          if (res.data.status == 200) {
            _this.commentTypeData = res.data.data.Service
            let service = res.data.data.Service
            _this.serviceData = res.data.data.Service
            for (let i = 0; i < service.length; i++) {
              let rate = service[i].CommentRate
              let country = service[i].Country
              let price = service[i].UnitPrice
              let newRate = rate * 100 + '%'
              _this.serviceData[i].CommentRate = newRate
              _this.serviceData[i].servicePrice = country + ' ￥' + price
            }
          }
        })
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
          if (res.data.status == 200) {
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
          } else if (res.data.status == 400) {
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
          if (res.data.status == 200) {
            _this.$message({
              type: 'success',
              message: res.data.message
            })
            _this.paymentModel = false
            _this.taskTypeModel = false
            _this.getAllData(BaseTaskType)
            _this.getBalance()
          }
          if (res.data.status == 400) {
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
        if (file) {
          _this.imgIng = true
          if (size > AllowImgFileSize) {
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
                if (res.data.status == 200) {
                  let fileId = res.data.data.FileId
                  _this.fileId = fileId
                  _this.imgsData.push(this.GLOBAL.BASE_URL + '/api/doGetFile?Id=' + fileId)
                  _this.assessForm.PicIds.push(fileId)
                  _this.imgIng = false
                }
                if (res.data.status == 400) {
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
                if (res.data.status == 500) {
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

      //全部
      allTaskNum(e) {
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
          if (res.data.status == 200) {
            let len = res.data.data.RstList
            let status = res.data.data.StatusSum
            _this.StatusSum = status
            for (let i = 0; i < len.length; i++) {
              let plat = len[i].Platform
              let country = len[i].Country
              len[i].Platform = plat + '/' + country
              len[i].OrderType = _this.getInfo(_this.obj, 'BaseTaskType', len[i].OrderType)
              len[i].Status = _this.getInfo(_this.obj, 'OrderStatus', len[i].Status)
            }
            _this.allOrderData = res.data.data.RstList
            _this.loading = false
          }
          if (res.data.status == 400) {
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
          if (res.data.status == 200) {
            _this.reasonCon = res.data.data.Order.Reason
          }
          if (res.data.status == 400) {
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
        _this.activeTask = 1
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
      },
      //按钮全部禁用
      allDisable() {
        let _this = this
        _this.disable1 = true
        _this.disable2 = true
        _this.disable4 = true
        _this.disable5 = true
        _this.disable7 = true
        _this.disable8 = true
        _this.disable9 = true
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
