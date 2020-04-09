import {get,post,getAction} from './https'

export const login = (params) => post('/api/Login/UserLogin', params) //登录
export const register = (params) => post('/api/CustomerUser/AddUser', params) //注册
export const getIndex = (params) => post('/api/HomePage/GetUserInformation', params) //首页获取名称、余额
export const getNotice = (params) => get('/api/HomePage/GetHomePage') //首页公告
export const updatePwd = (params) => post('/api/CustomerUser/ChangePassWord', params) //修改密码
export const updateQQ = (params) => post('/api/CustomerUser/ChangeQQ', params) //修改QQ
export const updateName = (params) => post('/api/CustomerUser/ChangeName', params) //修改姓名
export const updateWeCatch = (params) => post('/api/CustomerUser/ChangeWeChat', params) //修改微信
export const updatePhone = (params) => post('/api/CustomerUser/ChangePhone', params) //修改手机号
export const addOrder = (params) => post('/api/Order/AddOrder', params) //创建订单
export const getAllAccount = (params) => getAction('/api/CustomerFinance/GetCustomerFinance', params) //账户总览
export const Income = (params) => getAction('/api/CustomerFinance/GetPayStateOne', params) //余额收入
