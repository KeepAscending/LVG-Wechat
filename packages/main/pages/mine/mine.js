// packages/main/pages/mine/mine.js
import route from '../../../../utils/wx/route';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {
      wx_nickname: 'Hello',
      wx_headpic: '/images/headpic.png'
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
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
    app.goAuthor();
    if(app.userInfo.wx_nickname){
      this.setData({
        userinfo: app.userInfo
      });
    }
  },

  onReLaunch(){
    app.goAuthor();

      app.home = 1;
      route.reLaunch("/packages/landlordMode/main/pages/landlord/landlord");
 
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