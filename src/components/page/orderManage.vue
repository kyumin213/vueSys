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
          <li :class="active === '' ? 'active':''" data-index="0" @click="getAllStatus">全部<span>({{allDataNum}})</span></li>
          <!-- <li :class="active === 1 ? 'active':''" data-index="1" @click="daiPay">待付款<span>({{StatusSum[1]}})</span></li> -->
          <li :class="active === 1 ? 'active':''" data-index="1" @click="daiConfirm">待确认<span>({{TotalToBeParker}})</span></li>
          <li :class="active === 2 ? 'active':''" data-index="2" @click="daifp">待分配<span>({{TotalToBeAllocated}})</span></li>
          <li :class="active === 3 ? 'active':''" data-index="3" @click="yfp">已分配<span>({{TotalAlreadyAllocated}})</span></li>
          <li :class="active === 4 ? 'active':''" data-index="4" @click="ywc">已完成<span>({{TotalCompleted}})</span></li>
          <li :class="active === 5 ? 'active':''" data-index="5" @click="daiCancel">已取消<span>({{TotalCancel}})</span></li>
          <!--<li :class="active === 4 ? 'active':''" :data-index="4" @click="errData">异常<span>({{StatusSum[4]}})</span></li>-->
          <!-- <li :class="active === 4 ? 'active':''" :data-index="4" @click="returnMoney">退款<span>({{StatusSum[4]}})</span></li> -->
        </ul>
      </div>
      <div class="tabRight">
        <el-button type="primary" size="medium" @click="createOrder">创建订单</el-button>
      </div>
    </div>
    <div class="mt10 tableBg" style="overflow-x: auto">
      <el-table :data="allOrderData" border style="width: 100%" :header-cell-style="{background:'#eef1f6'}">
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
        <el-table-column prop="TotalProductPrice" label="总价" align="center"></el-table-column>
        <el-table-column prop="OrderTime" label="下单时间" align="center" width="200"></el-table-column>
        <el-table-column prop="OrderState" label="状态" align="center" :formatter="txtOrderStatus"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="small" type="primary" @click="payMent">付款</el-button> -->
            <el-button size="small" @click="cancelHandel(scope.$index,scope.row)" type="danger" v-show="scope.row.OrderState=='1'">取消</el-button>
            <!--<el-button size="small" :disabled="disable3" type="success" @click="evalEdit()">填写评价</el-button>-->
            <!-- <el-button size="small" type="warning" @click="viewDaily()">日志</el-button> -->
            <!-- <el-button size="small" type="danger" @click="delhandel">删除</el-button> -->
            <!--<el-button size="small" :disabled="disable6" type="primary" @click="confirmBtn">确认完成</el-button>-->
            <!-- <el-button size="small" type="danger" @click="refundBtn">申请退款</el-button> -->
            <!-- <el-button size="small" type="danger" @click="cancelRefundBtn">取消退款</el-button> -->
            <!-- <el-button size="small" @click="cancelReasonBtn">取消原因</el-button> -->
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
                  <!-- <el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'> -->
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
                  <!-- <el-button size='small' @click='helpCenter'>帮助中心</el-button> -->
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
                <el-form-item label="产品图片" prop="ProductPictures">
                      <el-upload :class="{hide:hideUpload}" :action="uploadUrl" name='image' list-type="picture-card"
                     :on-success="handlePictureCardSuccess" :on-remove="handleRemove"
                    :before-upload="beforeUpload"  :on-change="handleChange">
                    <i class="el-icon-plus"></i>
                  </el-upload>
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
            <!-- <el-row>
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
            </el-row> -->
            <!--       <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="是否使用优惠券" prop='Coupon'>
                  <el-radio-group v-model="taskForm.Coupon">
                    <el-radio label="0">不用</el-radio>
                    <el-radio label="1">用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
             <el-col :span="12" :xs="24">
                <el-form-item label="是否自发货" prop='SelfShip'>
                  <el-radio-group v-model="taskForm.SelfShip">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row> -->
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
              <el-row>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="submitPay('taskForm')">确定</el-button>
        <el-button size="medium" @click="closeModel">返回</el-button>
      </span>
    </el-dialog>
    <!-- 填写评价-->
    <!--    <el-dialog title="评价" :visible.sync="assessModel" width="45%" :close-on-click-modal="false" center="">
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
          <input ref='file' name="file" style='display: none;' type="file" accept="image/png,image/jpeg,image/jpg"
            @change="update" />
          <span class="fileBtn">选择图片</span>
        </el-form-item>
        <el-form-item class='txtCenter'>
          <div class="Upload_pictures">
            <span></span>
            <span>最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
            <p class="colred" v-show='videoSuccess'>视频已上传成功！</p>
            <p class="colred" v-show='videlIng'>视频上传中...</p>
          </div>
          <input name="files" type="file" ref='files' style='display: none;' />
          <span class="fileBtn" v-show="videoTip">选择视频</span>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button type="primary" size="medium" @click='evalEditSubmit'>确认</el-button>
        <el-button @click="assessModel=false" size="medium">取消</el-button>
      </span>

    </el-dialog> -->
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
      <div class="del-dialog-cnt">是否确定取消该订单？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='cancelSubmit'>确定</el-button>
        <el-button @click="cancelModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!-- 付款-->
    <el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" :before-close="paymentClose"
      top='5vh'>
      <!-- <el-form :model="paymentForm" class="demo-ruleForm"> -->
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
      <!-- </el-form> -->
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
      <view-task :viewTaskData="viewTaskData"></view-task>
      <span slot='footer' class="dialog-footer">
        <el-button type='primary' @click='closeViewModel'>返回</el-button>
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
  import viewTask from '../common/viewOrderDetails'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  const cityOptions = ['美国', '日本', '韩国', '加拿大'];
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
        hideUpload: false,
        limitCount:1,
        paymentCode: [], //充值二维码
        total: 0, //列表总条数
        file: 'file',
        proImg: false, //图片上传状态
        dialogVisible: false,
        disabled: false,
        priceShow: true, //总价显示
        disabledImg: false,
        checkAll: false,
        cities: [],
        isIndeterminate: true,
        allDataNum: 0, //全部状态数量
        TotalToBeParker: 0, //待确认状态数量
        TotalToBeAllocated: 0, //待分配状态数量
        TotalAlreadyAllocated: 0, //已分配状态数量
        TotalCompleted: 0, //已完成状态数量
        TotalCancel: 0, //已取消状态数量
        brushRadio: '',
        serviceUnit: 0, //服务费单价
        addService: 0, //增值费
        ExRate: 0, //汇率
        activeTask: 0, //除FBA任务外的其它任务状态
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
        addBuyData: [], //加购列表
        viewTaskData: [],
        allOrderData: [],
        hasBalance: 0,
        commentTypeData: [], //留评类型
        dialogImageUrl: '',
        loading: true,
        status: this.$route.params.taskTypeModel,
        errorStatus: this.$route.params.active,
        pageSize: 5, //每页条数
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
        activities: [],
        active: '',

        allNum: 0, //总条数
        dailyModel: false,
        searchType: false,
        disabled: true,
        assessModel: false,
        addTaskModal: false,
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
          checkedCities: []
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
        taskType: 'all',
        orderTypes: [{
          value: '0',
          label: '见单返本'
        }, {
          value: '1',
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
          ProductPrice: '0', //价格
          Currency: '', //货币符号
          ProductScore: 0, //评分
          ProductLink: '', //产品链接
          ProductPictures: '', //产品图片
          KeywordType: '1', //关键词类型
          ProductKeyword: '', //搜索关键词
          ProductPosition: '', //留评比例,
          CpcKeyword: '', //CPC关键字
          // CpcPosition: '', //CPC位置
          Number: 0, //订单数量
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
        selected: [], //选中的值
        file_list: []
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
          _this.allDataNum = res.data[0].TotalCount
          _this.TotalToBeParker = res.data[0].TotalToBeParker
          _this.TotalToBeAllocated = res.data[0].TotalToBeAllocated
          _this.TotalAlreadyAllocated = res.data[0].TotalAlreadyAllocated
          _this.TotalCompleted = res.data[0].TotalCompleted
          _this.TotalCancel = res.data[0].TotalCancel
        })
      },
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
      uploadFile: function(file) { // 上传的函数
        let _this = this
        let uploadData = new FormData()
        uploadData.append('image', file.file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        uploadImg(uploadData, config).then(res => {
          if (res.data.Code === 'ok') {
            _this.proImg = false
            _this.taskForm.ProductPictures = res.data.Data
            _this.$message({
              type:'success',
              message:res.data.Msg
            })
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 上传图片change
      handleChange(file,fileList){
        let _this = this
        _this.hideUpload = fileList.length >= _this.limitCount;
      },
      // 上传产品图片
      handleRemove(file, fileList) {
        let _this = this
        _this.taskForm.ProductPictures = ''
        _this.hideUpload = fileList.length >= _this.limitCount;
      },
      handlePictureCardSuccess(res,file) {
        let _this = this
        _this.taskForm.ProductPictures =  res.Data;
        if(file.status == 'success'){
          _this.$message({
            type:'success',
            message:'上传成功'
          });
        }else{
          _this.$message.error('上传失败')
        }
      },
      handleDownload(file) {
        console.log(file);
      },
      // 全选
      handleCheckAllChange(val) {
        this.searchForm.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      // 选择国家
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
        if (types == '1') {
          _this.priceShow = false
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge))
            .toFixed(2)
        } else {
          _this.priceShow = true
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge) + parseFloat(_this.taskForm.TotalProductPrice))
            .toFixed(2)
        }
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
      getAddService(obj, param3) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (param3 >= obj[i].Start && param3 <= obj[i].Ent) {
            return obj[i].IServiceFee
          } else {
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
        // _this.payList = true
        _this.hasBalance = 1
        // _this.OrderId = _this.selected.Id
        // _this.Amount = _this.selected.TotalPrice
        // _this.paymentForm.payMoney = _this.selected.TotalPrice
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
      //付款确认按钮
      paymentOrderList() {
        let _this = this
        let orderId = _this.OrderId
        let Amount = _this.Amount
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
        let price = _this.taskForm.ProductPrice
        // _this.getAddService(obj, nums)
        // _this.getProTotal()
        _this.addService = _this.getAddService(obj, price)
        let serviceFree = _this.addService
        let serviceUnit = _this.serviceUnit
        let types = _this.taskForm.ServiceType
        _this.taskForm.ServiceCharge = ((nums * serviceFree) + (nums * serviceUnit)).toFixed(2)
        _this.taskForm.TotalProductPrice = (_this.taskForm.ProductPrice * nums * _this.ExRate).toFixed(2)
        if (types == 1) {
          _this.priceShow = false
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge))
            .toFixed(2)
        } else {
          _this.priceShow = true
          _this.taskForm.Total = (parseFloat(_this.taskForm.ServiceCharge) + parseFloat(_this.taskForm.TotalProductPrice))
            .toFixed(2)
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
          OrderId: orderId,
          Amount: Amount,
          ActionType: 4
        }
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
        _this.disabled = true
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
        var result = 0
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
        _this.viewTaskData = _this.allOrderData[index]
        let val = _this.allOrderData[index]
        if (val.OrderState == 1) {
         _this.viewTaskData.OrderState = '待确认'
        } else if (val.OrderState == 2) {
           _this.viewTaskData.OrderState = '待分配'
        } else if (val.OrderState == 3) {
           _this.viewTaskData.OrderState = '已分配'
        } else if (val.OrderState == 4) {
           _this.viewTaskData.OrderState = '已完成'
        } else if (val.OrderState == 5) {
           _this.viewTaskData.OrderState = '已取消'
        }if(val.ServiceType == 0){
          _this.viewTaskData.ServiceType = '见单返本'
        }else if(val.ServiceType == 1){
           _this.viewTaskData.ServiceType = '评后返'
        } if(val.KeywordType == 1){
          _this.viewTaskData.KeywordType = '产品关键字'
        }else if(val.KeywordType == 2){
          _this.viewTaskData.KeywordType = 'CPC关键字'
        }else{
          return
        }
      },
      // 详情关闭
      closeViewModel() {
        let _this = this
        _this.viewDetailModal = false
        _this.viewTaskData = []
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
      //下单成功后确定付款
      paymentOrder() {
        let _this = this
        let param = {
          OrderId: _this.OrderId,
          Amount: _this.paymentForm.payMoney
        }
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
        _this.allOrderList()
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
