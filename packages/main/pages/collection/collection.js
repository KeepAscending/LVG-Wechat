// packages/main/pages/collection/collection.js
import api from '../../../../utils/api/items';
import view from '../../../../utils/wx/view';
import config from '../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: app.globalData.screenWidth,
    list: [],
    x: [],
    currentX: 0,
    flag: 0,
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 删除收藏
   */
  onDelete(ev){
    var _this = this;
    var index = ev.currentTarget.dataset.index;
    var list = _this.data.list;
    var itemid = list[index].id;
    list.splice(index, 1);
    _this.setData({
      list: list,
      [`x[${index}]`]: 0
    });
    _this.changeFlag();
    api.collectItem({uid: app.userInfo.uid, iid: itemid, collect: false});
  },

  /**
   * flag
   */
  changeFlag(){
    var _this = this;
    if(_this.data.list.length>0){
      _this.setData({
        flag: 2
      });
    } else {
      _this.setData({
        flag: 1
      });
    }
  },

    
  /**
   * 滑动删除效果
   */
  onCurrentX(ev){
    var _this = this;
    _this.currentX = ev.detail.x;
  },
  onChangeX(ev){
    var _this = this;
    var currentX = _this.currentX;
    var index = ev.currentTarget.dataset.index;
    var x = [];
    if(currentX<-45){
      x[index] = -90;
    }else{
      x[index] = 0;
    }
    _this.setData({
      x: x
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
    var uid = 0;
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    view.showLoading('正在加载');
    api.getCollectList({uid: uid})
    .then(res => {
      var data = {
        list: res
      }
      _this.setData(data);
      view.hideLoading();
    }).finally(err => {
      view.hideLoading();
      _this.changeFlag();
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      x: [],
      currentX: 0,
      flag: 0
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      x: [],
      currentX: 0,
      flag: 0
    });
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