// packages/order/pages/order-list/order-list.js
import api from '../../../../utils/api/order';
import view from '../../../../utils/wx/view';
import config from '../../../../utils/config'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: app.globalData.windowHeight,
    currentTab: -1,
    list: [],
    total: 0,
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var tab = Number(options.tab);
    _this.setData({
      currentTab: tab
    });
  },

  /**
   * 获取订单列表
   */
  refresh(page = 1, status = 0){
    var _this = this;
    var datas = _this.data;
    var uid = 0;
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    view.showLoading('正在加载');
    api.showList({
      isLandlord: false,
      uid: uid,
      status,
      page,
    })
    .then(res => {
      if(res.status == 200){
        var data = {
          total: res.total,
          hasMore: res.hasMore,
          page: page
        };
        if(page > 1){
          data.list = datas.list.concat(res.rows);
        }else{
          data.list = res.rows;
        }  
        view.hideLoading();
        _this.setData(data);
      
      } else {
        view.hideLoading();
        view.toast('加载失败');
      }
    })
    .finally(err => {
      view.hideLoading();
    });
  },

  /**
   * scroll-view 滚动到底部/右边时触发
   */
  onScrollToLower(){
    var _this = this;
    var datas = _this.data;
    if(datas.hasMore){
      _this.refresh(Number(datas.page) + 1, Number(datas.currentTab));
    }
  },

  /**
   * 滑动按钮
   */
  switchTab(ev){
    var _this = this;
    var index = ev.currentTarget.dataset.index;
    if(index==0){
      _this.setData({
        currentTab: 0,
        list: []
      });
    }
    if(index==1){
      _this.setData({
        currentTab: 1,
        list: []
      });
    }
    if(index==2){
      _this.setData({
        currentTab: 2,
        list: []
      });
    }
    _this.refresh(1, index);
  },

   /**
   * 滑动切面
   */
  onChange(ev){
    var _this = this;
    var index = ev.detail.current
    _this.setData({
      currentTab: index,
      list: []
    });
    _this.refresh(1, index);
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
    _this.refresh(1, _this.data.currentTab);
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