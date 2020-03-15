import sxf from "@/api/sxf.js";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
  // version:"1.0.6",           // 分支
  version:"2.0.6",           // 主干
  // version:"3.0.1",           // uat
  // version:"3.6.2",           // 生产
  fixed:false,
  home:{
    homedata:{
      promoteCode:"",            // 推广码
      billdate:"",               // 账单日
      accountDate:"",            // 首次还款日期
      timeShow:false,            // 倒计时标识
      countdown:"",              // 是否出现倒计时 
      countTime:"10",            // 倒计时时间
      creditcardNum:{},          // 默认卡号
      creditIndex:0,             // 卡号索引
      applyMoney:"",             // 申请金额
      maxMoney:"",               // 最高可借金额
      paytype:"分期支付",         // 支付方式
      stage:"12期",              // 期数
      planCode:"",               // 产品编号
      rate:"",                   // 费率
      // 分期支付
      dispayEach:"",             // 每期应还(优惠)
      dispayMoney:"",            // 每期本金(优惠)
      dispaypartCharge:"",       // 每期手续费(优惠)
      payEach:"",                // 每期应还
      payMoney:"",               // 每期本金
      paypartCharge:"",          // 每期手续费
      // 一次性支付
      payAll:"",                 // 每期应还本金
      dispayallCharge:"",        // 一次性手续费(优惠)
      payallCharge:"",           // 一次性手续费
      // 支付方式数组
      paytypeList:['分期支付','一次性支付'],
      // 期数数组
      stageList:['3期','6期','12期','18期','24期','36期'],
    },
    homeui:{
      disshow:"",                  // 按钮状态
      repayall:false,              // 一次性还款
      repaypart:true,              // 分期还款
      discount:true,               // 是否优惠 
      showPay:false,               // 显示支付方式弹框
      showStage:false,             // 显示期数弹框
    },
    textMsg: {
      status: 1,
      msg: '获取验证码',
      t: null,
      code: ''
    },
    imageCode: {
      show: false,
      bgImg: '',
      slideImg: '',
      length: ""
    },
    alert:{
      msg:"",
      err:"",
      showAlert:""
    },
    fail:{
      msg:"",
      err:"",
      showAlert:"",
      title:"",
    }
  },
  public:{              // 公共
    pubui:{
      creditList:[],            // 信用卡列表
      installList:[],           // 支付方式/期数大数组
    },
    pubmenu:{
      laystatu:"",               // 蒙版
      applyshow:"",              // 申请金额错误弹框
      reminderstatu:"",          // 温馨提示
    }
  },
};

const getters={

};
const actions = {
  // 初始化数据
  bsetInitHome({commit,state},payload){
    baseData.data.cardKey = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.initHome(baseData).then((res)=>{
      if(res.success==true){
        commit('BSETINITHOME',res.data);
        if(localStorage.getItem("SXF")){
          let SXF = JSON.parse(localStorage.getItem("SXF"));
          commit("BKEEPHOMEDATA",SXF);
          localStorage.removeItem("SXF");
        }
      }else if(res.success==false){
        payload.router.push({path:'/Sxf/FailPage'});
        saAlert("随兴分首页","初始化首页",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","初始化首页",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","初始化首页","请求失败","请求报错");
      }
    });
  },
  // 切换信用卡
  bchangecreditcard({commit,state},payload){          
    baseData.data.cardKey = payload.creditcardNum.cardKey;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    commit('BCHANGECREDITCARD',payload); 
    sxf.initHome(baseData).then((res)=>{
      if(res.success==true){
        commit('BSETINITCREDITCARD',res.data);
      }else if(res.success==false){
        payload.router.push({path:'/Sxf/FailPage'});
        saAlert("随兴分首页","切换信用卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","切换信用卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","切换信用卡","请求失败","请求报错");
      }
    });
  },
  // 申请金额试算
  bchangeapply({commit,state},payload){
    baseData.data.cardKey = payload.creditcardNum.cardKey;
    baseData.data.applyAmt = payload.applyMoney;                    // 申请金额
    baseData.data.period = payload.homedata.stage.split("期")[0];   // 期数
    if(payload.homedata.paytype=="一次性支付"){                      // 支付方式
      baseData.data.payType = "01";
    }else{
      baseData.data.payType = "02";
    }
    baseData.data.planCode = payload.homedata.planCode;             // 产品编号
    baseData.data.rate = payload.homedata.rate;                     // 费率
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.assignMoney(baseData).then((res)=>{
      if(res.success==true){
        commit('BCHANGEAPPLY',res.data);
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        saAlert("随兴分首页","数据试算",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","数据试算",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","数据试算","请求失败","请求报错");
      }
    });
  },
  // 支付方式/期数试算
  bchangemoney({commit,state},payload){
    baseData.data.cardKey = payload.creditcardNum.cardKey;
    baseData.data.applyAmt = payload.applyMoney;                    // 申请金额
    baseData.data.period = payload.homedata.stage.split("期")[0];   // 期数
    if(payload.homedata.paytype=="一次性支付"){                      // 支付方式
      baseData.data.payType = "01";
    }else{
      baseData.data.payType = "02";
    }
    for(var i=0;i<payload.pubui.installList.length;i++){
      if(payload.pubui.installList[i].payType==baseData.data.payType && payload.pubui.installList[i].period==baseData.data.period){
        baseData.data.planCode = payload.pubui.installList[i].planCode;      // 计划编号
        baseData.data.rate = payload.pubui.installList[i].rate;              // 费率
      }
    }
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.assignMoney(baseData).then((res)=>{
      if(res.success==true){
        commit('BCHANGEAPPLY',res.data);
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        saAlert("随兴分首页","数据试算",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","数据试算",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","数据试算","请求失败","请求报错");
      }
    });
  },
  // 获取验证码
  bgetcode({dispatch,commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SXF";
    baseData.data.hkLength = "0";
    commit('BSETMOVELENGTH',"");                          // 设置滑动距离为空
    commit('BCHANGESTATUS', 0);                           // 更改按钮状态(不可点)
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.getSmsCode(baseData).then((res)=>{
      commit('BCHANGESTATUS', 1);
      if(res.success==true){
        if(res.data.noFirstSend=="1"){                         // 直接发短信
          if(res.data.smsCode=="" || res.data.smsCode==undefined){
            commit('BHOMEALERT', {show: true, msg: '发送成功', err: '',fixed:true}); 
          }else{
            commit('BHOMEALERT', {show: true, msg: "短信验证码:"+res.data.smsCode, err: '',fixed:true});
          }
          dispatch('autoCountDown',120);                       // 倒数计时
        }else if(res.data.noFirstSend=="0"){                   // 请求滑块     
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }  
          sxf.getSlider(baseData).then((res)=>{
            if(res.success==true){
              commit('BSHOWIMAGECODE',true);                   // 显示滑块
              commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
            }else if(res.success==false){
              commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
              saAlert("随兴分首页","滑块图片赋值",res.msg,"报错提示");
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
              saAlert("随兴分首页","滑块图片赋值",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
              saAlert("随兴分首页","滑块图片赋值","请求失败","请求报错");
            }
          });
        }
      }else if(res.success==false){
        if(res.code=="ERR_02"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          dispatch('autoCountDown',60);                    // 倒数计时
        }else{
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        }
        saAlert("随兴分首页","获取验证码",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","获取验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","获取验证码","请求失败","请求报错");
      }
    });
  },
  // 获取滑块
  bsendmovelen({dispatch,commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SXF";
    baseData.data.hkLength = payload.imageCode.length;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.getSmsCode(baseData).then((res)=>{
      if(res.success==true){                     // 直接发短信
        if(res.data.smsCode=="" || res.data.smsCode==undefined){
          commit('BHOMEALERT', {show: true, msg: '发送成功', err: '',fixed:true}); 
        }else{
          commit('BHOMEALERT', {show: true, msg: "短信验证码:"+res.data.smsCode, err: '',fixed:true});
        }
        commit('BSHOWIMAGECODE',false);                      // 隐藏滑块验证码 
        dispatch('autoCountDown',120);                       // 倒数计时
        commit('BSETMOVELENGTH',"");                         // 设置滑动距离为空
      }else if(res.success==false){
        if(res.code=="ERR_01"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          commit('BSHOWIMAGECODE',false);
        }
        if(res.code=="ERR_02"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          commit('BSHOWIMAGECODE',false);
          dispatch('autoCountDown',60);                    // 倒数计时
        }else{
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }
          sxf.getSlider(baseData).then((res)=>{
            if(res.success==true){
              commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
            }else if(res.success==false){     
              commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
              saAlert("随兴分首页","滑块图片赋值",res.msg,"报错提示");
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
              saAlert("随兴分首页","滑块图片赋值",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
              saAlert("随兴分首页","滑块图片赋值","请求失败","请求报错");
            }
          });
        }
        saAlert("随兴分首页","获取验证码",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","获取验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","获取验证码","请求失败","请求报错");
      }
    });
  },
  // 点击刷新
  refreshImage({commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SXF";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.getSlider(baseData).then((res)=>{
      if(res.success==true){
        commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
        saAlert("随兴分首页","刷新按钮更新图片",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","刷新按钮更新图片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","刷新按钮更新图片","请求失败","请求报错");
      }
    });
  },
  // 页面倒计时
  autoCountDown({dispatch, commit, state},n) {
    commit('BCHANGESTATUS', 0);             // 更改按钮状态(不可点)
    var times = n;
    var t = setInterval(() => {
      times--;
      commit('BCHANGETEXT', times + 's');
      if (times <= 0) {
        commit('BCHANGETEXT', '获取验证码'); // 更换按钮文字
        commit('BCHANGESTATUS', 1);
        clearInterval(t);
      }
    }, 1000);
    commit('SETINTERVAL', t);
  },
  // 首页申请
  bsubmitinfo({commit,state},payload){
    if(payload.homedata.paytype=="一次性支付"){
      baseData.data.payType = "01";
    }else{
      baseData.data.payType = "02";
    }
    baseData.data.cardKey = payload.cardKey;
    baseData.data.smsCode = payload.smsCode;
    baseData.data.applyAmt = payload.applyAmt;
    baseData.data.period = payload.homedata.stage.split("期")[0];
    baseData.data.promoteCode = payload.homedata.promoteCode;
    if(payload.homedata.countdown=="0"){
      commit('BCHANGETIMESTATUS',true);
    }
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    sxf.submitInfo(baseData).then((res)=>{
      commit('BCHANGETIMESTATUS',false);
      if(res.success==true){
        commit('SUBMITDATA',res.data);            // 计算首次还款日期
        var obj = {
          applyAmt:res.data.applyAmt,
          cardNo:payload.homedata.creditcardNum.cardNo,
          returnAmt:res.data.returnAmt,
          accountDate:payload.homedata.accountDate
        }
        payload.router.push({path:"/Sxf/SuccessPage?Sdata="+JSON.stringify(obj)});
        commit("BCHANGEHOMEBTN",false);
      }else if(res.success==false){
        commit("BHOMEFAIL",{show:true,title:"申请失败",msg:res.msg,err:res.code,fixed:true});
        saAlert("随兴分首页","首页申请提交信息",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      commit('BCHANGETIMESTATUS',false);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随兴分首页","首页申请提交信息",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随兴分首页","首页申请提交信息","请求失败","请求报错");
      }
    });
  },
};

const mutations={
  // 初始化数据
  BSETINITHOME(state,res){
    state.home.homedata.billdate = res.billDate;                         // 账单日
    state.home.homedata.countdown = res.countDown;                       // 0-显示倒计时 1-不显示倒计时
    state.home.homedata.creditcardNum = _.cloneDeep(res.cardList[0]);    // 信用卡号
    state.public.pubui.creditList = res.cardList;                        // 信用卡列表
    state.home.homedata.maxMoney = res.topAmount;                        // 最高可借金额
    state.home.homedata.applyMoney = res.topAmount;                      // 可申请金额
    state.public.pubui.installList = res.installList;                    // 支付方式、期数大数组
    for(var i=0;i<res.installList.length;i++){
      if(res.installList[i].payType=="02" && res.installList[i].period=="12"){
        state.home.homedata.planCode = res.installList[i].planCode;      // 计划编号
        state.home.homedata.rate = res.installList[i].rate;              // 费率
      }
    }
    state.home.homeui.discount = res.discount;                           // 是否优惠
    state.home.homedata.dispayEach = res.discountAmt;                    // 每期应还(优惠)
    state.home.homedata.dispayMoney = res.discountMoney;                 // 每期本金(优惠)
    state.home.homedata.dispaypartCharge = res.discountCharge;           // 每期手续费(优惠)
    state.home.homedata.payEach = res.instalAmt;                         // 每期应还
    state.home.homedata.payMoney = res.eachMoney;                        // 每期本金
    state.home.homedata.paypartCharge = res.eachCharge;                  // 每期手续费
    state.home.homedata.payAll = res.oneAmt;                             // 每期应还本金
    state.home.homedata.dispayallCharge = res.discountOneCharge;         // 一次性手续费(优惠)
    state.home.homedata.payallCharge = res.oneCharge;                    // 一次性手续费
  },
  // 缓存数据
  BKEEPHOMEDATA(state,res){
    state.home.homedata.promoteCode = res.promoteCode;                   // 推广码
    state.home.homedata.billdate = res.billDate;                         // 账单日
    state.home.homedata.countdown = res.countDown;                       // 0-显示倒计时 1-不显示倒计时
    state.home.homedata.creditcardNum = res.creditcardNum;               // 信用卡号
    state.home.homedata.creditIndex = res.creditIndex;                   // 信用卡索引
    state.home.homedata.maxMoney = res.maxMoney;                         // 最高可借金额
    state.home.homedata.applyMoney = res.applyMoney;                     // 可申请金额
    state.public.pubui.installList = res.installList;                    // 支付方式、期数大数组
    state.home.homedata.paytype = res.paytype;                           // 支付方式
    if(res.paytype=="分期支付"){
      state.home.homeui.repaypart = true;
      state.home.homeui.repayall = false;
    }else if(res.paytype=="一次性支付"){
      state.home.homeui.repaypart = false;
      state.home.homeui.repayall = true;
    }
    state.home.homedata.stage = res.stage;                               // 期数
    state.home.homedata.planCode = res.planCode;                         // 产品编号
    state.home.homedata.rate = res.rate;                                 // 费率
    state.home.homeui.discount = res.discount;                           // 是否优惠
    state.home.homedata.dispayEach = res.dispayEach;                     // 每期应还(优惠)
    state.home.homedata.dispayMoney = res.dispayMoney;                   // 每期本金(优惠)
    state.home.homedata.dispaypartCharge = res.dispaypartCharge;         // 每期手续费(优惠)
    state.home.homedata.payEach = res.payEach;                           // 每期应还
    state.home.homedata.payMoney = res.payMoney;                         // 每期本金
    state.home.homedata.paypartCharge = res.paypartCharge;               // 每期手续费
    state.home.homedata.payAll = res.payAll;                             // 每期应还本金
    state.home.homedata.dispayallCharge = res.dispayallCharge;           // 一次性手续费(优惠)
    state.home.homedata.payallCharge = res.payallCharge;                 // 一次性手续费
  },
  // 切换信用卡
  BSETINITCREDITCARD(state,res){
    state.home.homedata.billdate = res.billDate;                         // 账单日
    state.home.homedata.countdown = res.countDown;                       // 0-显示倒计时 1-不显示倒计时
    state.home.homedata.paytype = "分期支付";                             // 支付方式
    state.home.homeui.repaypart = true;
    state.home.homeui.repayall = false;
    state.home.homedata.stage = "12期";                                  // 期数
    state.home.homedata.maxMoney = res.topAmount;                        // 最高可借金额
    state.home.homedata.applyMoney = res.topAmount;                      // 可申请金额
    state.public.pubui.installList = res.installList;                    // 支付方式、期数大数组
    for(var i=0;i<res.installList.length;i++){
      if(res.installList[i].payType=="02" && res.installList[i].period=="12"){
        state.home.homedata.planCode = res.installList[i].planCode;      // 计划编号
        state.home.homedata.rate = res.installList[i].rate;              // 费率
      }
    }
    state.home.homeui.discount = res.discount;                           // 是否优惠
    state.home.homedata.dispayEach = res.discountAmt;                    // 每期应还(优惠)
    state.home.homedata.dispayMoney = res.discountMoney;                 // 每期本金(优惠)
    state.home.homedata.dispaypartCharge = res.discountCharge;           // 每期手续费(优惠)
    state.home.homedata.payEach = res.instalAmt;                         // 每期应还
    state.home.homedata.payMoney = res.eachMoney;                        // 每期本金
    state.home.homedata.paypartCharge = res.eachCharge;                  // 每期手续费
    state.home.homedata.payAll = res.oneAmt;                             // 每期应还本金
    state.home.homedata.dispayallCharge = res.discountOneCharge;         // 一次性手续费(优惠)
    state.home.homedata.payallCharge = res.oneCharge;                    // 一次性手续费
  },
  // 申请金额试算
  BCHANGEAPPLY(state,res){
    state.home.homeui.discount = res.discount;                           // 是否优惠
    state.home.homedata.dispayEach = res.discountAmt;                    // 每期应还(优惠)
    state.home.homedata.dispayMoney = res.discountMoney;                 // 每期本金(优惠)
    state.home.homedata.dispaypartCharge = res.discountCharge;           // 每期手续费(优惠)
    state.home.homedata.payEach = res.instalAmt;                         // 每期应还
    state.home.homedata.payMoney = res.eachMoney;                        // 每期本金
    state.home.homedata.paypartCharge = res.eachCharge;                  // 每期手续费
    state.home.homedata.payAll = res.oneAmt;                             // 每期应还本金
    state.home.homedata.dispayallCharge = res.discountOneCharge;         // 一次性手续费(优惠)
    state.home.homedata.payallCharge = res.oneCharge;                    // 一次性手续费
  },
  // 切换信用卡
  BCHANGECREDITCARD(state,payload){                   
    state.home.homedata.creditcardNum = payload.creditcardNum;
    state.home.homedata.creditIndex = payload.creditcardNum.index;
    state.fixed = false;
  },
  // 更改页面状态
  BCHANGEFIXED(state,value){
    state.fixed = value;
  },
  // 更改申请金额数额 
  BCHANGEAPPLYNUM(state,value){
    state.home.homedata.applyMoney = value;
  },
  // 更改申请金额错误弹框状态              
  BCHANGEAPPLYSTATUS(state,data){
    state.public.pubmenu.laystatu = data.layshow;
    state.public.pubmenu.applyshow = data.applyshow;
  },
  // 更改温馨提示弹框状态
  BCHANGEREMINDSTATUS(state,data){
    state.public.pubmenu.laystatu = data.layshow;
    state.public.pubmenu.reminderstatu = data.remindshow;
  },
  // 更改首页错误弹框状态
  BHOMEALERT(state,data){
    state.home.alert.showAlert = data.show;
    state.home.alert.msg = data.msg;
    state.home.alert.err = data.err;
    state.fixed = data.fixed;
  },
  // 更改首页失败弹框状态
  BHOMEFAIL(state,data){
    state.home.fail.showAlert = data.show;
    state.home.fail.title = data.title;
    state.home.fail.msg = data.msg;
    state.home.fail.err = data.err;
    state.fixed = data.fixed;
  },
  // 设置滑块移动距离
  BSETMOVELENGTH(state,value){
    state.home.imageCode.length = value;
  },
  // 设置按钮状态
  BCHANGESTATUS(state,value){
    state.home.textMsg.status = value;
  },
  // 更换按钮文字
  BCHANGETEXT(state, value) {        
    state.home.textMsg.msg = value;
  },
  // 设置倒计时时间
  SETINTERVAL(state, value) {       
    state.home.textMsg.t = value;
  },
  // 判断是否出现滑块验证码 默认false
  BSHOWIMAGECODE(state, value) {    
    state.home.imageCode.show = value;
  },
  // 给滑块验证码图片赋值
  BASSIGNIMAGE(state,res){          
    state.home.imageCode.bgImg = res.bigimgStr;
    state.home.imageCode.slideImg = res.tarimgStr;
  },
  // 更改按钮状态
  BCHANGEHOMEBTN(state,value){
    state.home.homeui.disshow = value;
  },
  // 更改支付方式弹框状态
  BCHANGEPAY(state,value){
    state.home.homeui.showPay = value;
  },
  // 支付方式赋值
  BASSIGNPAYTYPE(state,value){
    state.home.homedata.paytype = value;
    if(value=="分期支付"){
      state.home.homeui.repaypart = true;
      state.home.homeui.repayall = false;
    }else{
      state.home.homeui.repaypart = false;
      state.home.homeui.repayall = true;
    }
  },
  // 更改期数弹框状态
  BCHANGESTAGE(state,value){
    state.home.homeui.showStage = value;
  },
  // 期数赋值
  BASSIGNSTAGE(state,value){
    state.home.homedata.stage = value;
  },
  // 推广码赋值
  BSETPROMOTECODE(state,value){
    state.home.homedata.promoteCode = value;
  },
  // 更改倒计时状态
  BCHANGETIMESTATUS(state,value){
    state.home.homedata.timeShow = value;
  },
  // 计算首次还款日期
  SUBMITDATA(state,res){
    var applyyear = parseInt(res.applyDate.slice(0,4));
    var applymonth = parseInt(res.applyDate.slice(4,6));
    var applyday = parseInt(res.applyDate.slice(6,8)); 
    var initdate = parseInt(state.home.homedata.billdate); 
    if(applyday > initdate){
        if(applymonth==12){
            applyyear++;
            applymonth = 1;
        }else{
            applymonth++;
        }
        applyday = initdate;
    }else if(applyday <= initdate){
        applyday = initdate;
    }
    if((""+applymonth).length<2){
        applymonth="0"+applymonth;
    }
    if((""+applyday).length<2){
        applyday="0"+applyday;
    }
    state.home.homedata.accountDate = applyyear+"/"+applymonth+"/"+applyday;   // 首次还款日期
  }
};

const baseData = {
  openId: "",
  traceId: Date.now() + '',
  channel: '',
  version: state.version,
  data: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}