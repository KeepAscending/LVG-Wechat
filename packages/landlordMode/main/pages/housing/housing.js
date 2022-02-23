// packages/landlordMode/pages/housing/housing.js
import view from '../../../../../utils/wx/view';
import api from '../../../../../utils/api/group';
import config from '../../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    view.showLoading('正在加载');
    api.getGroupList({uid: app.userInfo.uid})
    .then(res => {
      if(res.status==200){
        _this.setData({
          list: res.rows,
          total: res.total
        });
        view.hideLoading();
      }else {
        view.hideLoading();
        view.toast('加载失败');
      }
    })
    .finally(err => {
      view.hideLoading();
    });
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