// packages/main/pages/authorize/authorize.js
import route from '../../../../utils/wx/route';
import view from '../../../../utils/wx/view';
import login from '../../../../utils/api/login';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn: {
      text: '授权',
      openType: 'getUserInfo',
      onGetUserInfo: 'getUserInfo'
    }
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userInfo')){
      app.userInfo = wx.getStorageSync('userInfo');
    }else{
      this.doLogin();
    }
  },

  getUserInfo(ev){
    if(ev.detail.errMsg === 'getUserInfo:fail auth deny') return;
    this.doLogin();
  },
  
  doLogin(){
    view.showLoading('正在登录');
    login().then(res => {
      view.hideLoading();
      if(res.status === 200){
        app.userInfo= res.loginData;
        // 缓存用户信息
        wx.setStorage({
          key: "userInfo",
          data: app.userInfo
        });
        route.navigateBack();
      }else{
        view.toast('登录失败');
      }
    })
    .catch(err => {
      view.hideLoading();
      if(err.code === 0){
        view.toast('请授权');
      }else{
        view.toast('授权失败');
      }
    })
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