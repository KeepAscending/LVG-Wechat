// packages/order/pages/order-detail/order-detail.js
import config from '../../../../utils/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    point: 0,
    service: 0,
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var order = JSON.parse(decodeURIComponent(options.order));
    _this.setData({
      order: order,
      status: order.status,
      point: order.point
    });
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
    var _this = this;
    if(wx.getStorageSync('orderEval_Point')){
      var point = wx.getStorageSync('orderEval_Point');
      _this.setData({
        point: point
      });
      wx.removeStorageSync('orderEval_Point');
    }
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