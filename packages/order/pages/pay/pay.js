// packages/order/pages/pay/pay.js3
import route from '../../../../utils/wx/route';
import api from '../../../../utils/api/order';
import view from '../../../../utils/wx/view';
import config from '../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,//总计费用
    discountMoney: 0,//折扣优惠
    coupons: 0,//优惠券
    service: 0,//服务费
    payment: 0,//实付金额
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var datas = _this.data;
    var curDate = wx.getStorageSync('curDateObj');
    var selecDateObj = wx.getStorageSync('selectDate'); 
    var nightN = wx.getStorageSync('nightNum');
    var image = config.mediaHost+decodeURIComponent(options.image);
    _this.setData({
      iid: Number(options.iid),
      title: options.title,
      price: options.price,
      discount: options.discount,
      type: options.type,
      restype: options.restype,
      room: options.room,
      bedNum: options.bedNum,
      image: image,
      curDateObj: (curDate?curDate:''),
      selectDate: (selecDateObj && selecDateObj.end.year!=''?selecDateObj:''),
      nightNum: (nightN?nightN:0)
    });
    var total = datas.price * datas.nightNum;
    var discountMoney = Math.round(total * (1 -(datas.nightNum>=30?datas.discount:100)/100));
    var payment = total - discountMoney - datas.service - datas.coupons;
    _this.setData({
      total: total,
      discountMoney: discountMoney,
      payment: payment
    });
  },

  /**
   * 输入入住人信息
   */
  onInputValue(ev){
    var _this = this;
    var index = ev.currentTarget.dataset.index
    if(index==1){
      _this.setData({
        name: ev.detail.value
      });
    }
    if(index==2){
      _this.setData({
        phone: ev.detail.value
      });
    }
  },

  /**
   * 微信支付
   */
  onPayment(){
    var _this = this;
    var datas = _this.data;
    var selectDate = datas.selectDate;
    if(datas.name && datas.phone && datas.name!='' && datas.phone!=''){
      var order = {
        cusId: app.userInfo.uid,
        itemId: datas.iid,
        night: datas.nightNum,
        total: datas.total,
        discount: datas.discountMoney,
        coupons: datas.coupons,
        payment: datas.payment,
        cusName: datas.name,
        cusPhone: datas.phone,
        status: 1
      }
      api.onBook({
        order: `${JSON.stringify(order)}`,
        intime: selectDate.start.year +''+ (selectDate.start.month>=10?selectDate.start.month:0+''+selectDate.start.month) +''+ (selectDate.start.day>=10?selectDate.start.day:0+''+selectDate.start.day),
        outtime: selectDate.end.year +''+ (selectDate.end.month>=10?selectDate.end.month:0+''+selectDate.end.month) +''+ (selectDate.end.day>=10?selectDate.end.day:0+''+selectDate.end.day)
      }).then(res => {
        if(res.status==200){
          view.toast("支付成功");
          route.navigateBack();
        }else{
          view.toast("支付失败");
        }
      });
    }else{
      view.toast("请完善入住人信息");
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})