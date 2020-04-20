import {get,post,getAction} from './https'

export const login = (params) => post('/api/Login/UserLogin', params) //登录
export const register = (params) => post('/api/CustomerUser/AddUser', params) //注册
export const getIndex = (params) => post('/api/HomePage/GetUserInformation', params) //首页获取用户信息、余额
export const getNotice = (params) => get('/api/HomePage/GetHomePage') //首页公告
export const OrderSum = (params) => post('/api/HomePage/GetOrderSum') //首页任务明细
export const updatePwd = (params) => post('/api/CustomerUser/ChangePassWord', params) //修改密码
export const updateQQ = (params) => post('/api/CustomerUser/ChangeQQ', params) //修改QQ
export const updateName = (params) => post('/api/CustomerUser/ChangeName', params) //修改姓名
export const updateWeCatch = (params) => post('/api/CustomerUser/ChangeWeChat', params) //修改微信
export const updatePhone = (params) => post('/api/CustomerUser/ChangePhone', params) //修改手机号
export const addOrder = (params) => post('/api/Order/AddOrder', params) //创建订单
export const orderList = (params) => post('/api/Order/GetOrders', params) //订单列表
export const getAllAccount = (params) => getAction('/api/CustomerFinance/GetCustomerFinance', params) //账户总览
export const Income = (params) => getAction('/api/CustomerFinance/GetPayStateOne', params) //余额收入
export const Expenditure = (params) => getAction('/api/CustomerFinance/GetPayExpenditure', params) //余额支出
export const cashWithList = (params) => getAction('/api/DrawMoney/GetUserWithdrawal', params) //提现列表
export const cashWith = (params) => post('/api/DrawMoney/UserWithdrawal', params) //提现
export const uploadImg = (params,config) => post('/api/Order/GetProductPictures', params,config) //图片上传
export const getCountry = (params) => getAction('/api/Country/GetCountry', params) //国家
export const Rate = (params) => getAction('/api/Rate/GetRate', params) //汇率
export const getServiceFee = (params) => getAction('/api/IncrementServiceFee/IncrementServiceFee', params) //增值费
export const getService = (params) => getAction('/api/Fee/GetFee', params) //服务费
export const getProbalibi = (params) => getAction('/api/Order/GetProbability', params) //留评比例
export const GetOrderState = (params) => getAction('/api/Order/GetOrderState', params) //订单管理状态数
