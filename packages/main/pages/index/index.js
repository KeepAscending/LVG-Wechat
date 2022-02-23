// packages/main/pages/index/index.js
import api from '../../../../utils/api/index';
import api2 from '../../../../utils/api/items';
import route from '../../../../utils/wx/route';
import config from '../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    home: app.home,
    banner: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    cityArr:['九江','北京','上海','重庆','大理','厦门','杭州','西安','云南'],
    city_index: -1,
    city:"",
    list:[],
    mediaHost: config.mediaHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.home==1){
      _this.setData({
        home : 1
      });
      route.reLaunch("/packages/landlordMode/pages/landlord/landlord");
      return;
    }
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    // 获取 homeBan
    api.getBan({count:5, isSort:true}).then((res)=>{
      _this.setData({
        banner: res
      });
    });
  
    // 获取精选推荐列表
    _this.getRecommend();   

    // 检查并更新小程序
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) { // 请求完新版本信息的回调
    });
    updateManager.onUpdateReady(function () { // 下载新版本
      wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                  updateManager.applyUpdate();// 重启应用
              }
            }
        });
    });
    updateManager.onUpdateFailed(function (res) { // 新版本下载失败
        console.log('新版本更新失败！');
    });

  },

  /**
   * 推荐列表
   */
  getRecommend(){
    var _this = this;
    var datas = _this.data;
    var query =  {
      keywords: datas.city,
      people: 0,
      minprice: 0,
      maxprice: 0,
      room: 0,
      beds: 0,
      toilet: 0,
      type: "",
      infrast: [],
      safefaci: [],
      supfaci: [],
      fieldname: "",
      desc: true
    };
    var uid = 0;
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    api2.getItemList({
      uid: uid,
      query: `${JSON.stringify(query)}`
    }).then((res)=>{
      if(res.status == 200){
        _this.setData({
          list: res.rows
        });
      }
    });
  },

  /**
   * 更改推荐城市
   */
  changeCity(ev){
    var _this = this;
    var datas = _this.data;
    var city_index  = -1;
    var name = "";
    const data = {};
    if(typeof ev === 'object'){
      city_index = ev.currentTarget.dataset.index;
      name = ev.currentTarget.dataset.name;
    }
    if(datas.city_index == city_index){
      data.city_index = -1;
      data.city = "";
    } else{
      data.city_index = city_index;
      data.city = name;
    }
    _this.setData(data);
    _this.getRecommend();
  },

   /**
   * 收藏
   */
  changeCollect(e){
    var _this = this;
    var datas = _this.data;
    var curindex = e.detail.index;
    var collect = !datas.list[curindex].collect;
    var itemid = datas.list[curindex].id;
    _this.setData({
      [`list[${curindex}].collect`]: collect
    }); 
    api2.collectItem({uid: app.userInfo.uid, iid: itemid, collect: collect});
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
    if(app.home==1){
      _this.setData({
        home : 1
      });
      route.reLaunch("/packages/landlordMode/main/pages/landlord/landlord");
      return;
    }
    var curDate = wx.getStorageSync('curDateObj');
    var selecDateObj = wx.getStorageSync('selectDate'); 
    var nightN = wx.getStorageSync('nightNum')
    _this.setData({
      autoplay: true,
      curDateObj: (curDate?curDate:''),
      selectDate: (selecDateObj && selecDateObj.end.year!=''?selecDateObj:''),
      nightNum: (nightN?nightN:0)
    });
    app.goAuthor();
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