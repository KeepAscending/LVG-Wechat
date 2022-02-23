// packages/items/pages/items-detail/items-detail.js
import api from '../../../../utils/api/items';
import view from '../../../../utils/wx/view';
import config from '../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mediaHost: config.mediaHost,
    item: {},
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    introModalShow: false,
    faciModalShow: false,
    status: 0,
    bookable: false
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (id) {
    var _this = this;
    var uid = 0;
    var iid = Number(id.id);
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    view.showLoading('正在加载');
    api.getItemDetail({
      uid: uid,
      iid: iid
    }).then(res => {
      var data = {
        iid: iid,
        item: res.data
      }
      _this.setData(data);
      view.hideLoading();
    }).finally(err => {
      view.hideLoading();
    });
  },


   /**
   * 显示 Modal
   */
  openModal(ev){
    var _this = this;
    let name  = '';
    if(typeof ev === 'object'){
      name = ev.currentTarget.dataset.name;
    }else{
      name = ev;
    }
    _this.setData({
      [`${name}ModalShow`]: true
    });
  },

  /**
   * 关闭 Modal
   */
  closeModal(){
    var _this = this;
    const data = {};
    if(_this.data.introModalShow){
      data.introModalShow = false;
    }

    if(_this.data.faciModalShow){
      data.faciModalShow = false;
    }

    _this.setData(data);
  },
  
  /**
   * 收藏
   */
  changeCollect(){
    var _this = this;
    var datas = _this.data;
    var collect = !datas.item.collect;
    var itemid = datas.item.id;
    _this.setData({
      [`item.collect`]: collect
    }); 
    api.collectItem({uid: app.userInfo.uid, iid: itemid, collect: collect});
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
    //app.goAuthor(true);
    var _this = this;
    var curDate = wx.getStorageSync('curDateObj');
    var selecDateObj = wx.getStorageSync('selectDate'); 
    var nightN = wx.getStorageSync('nightNum')
    _this.setData({
      curDateObj: (curDate?curDate:''),
      selectDate: (selecDateObj && selecDateObj.end.year!=''?selecDateObj:''),
      nightNum: (nightN?nightN:0),
      bookable: (selecDateObj && selecDateObj.end.year!=''?true:false)
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoplay: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      autoplay: false
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