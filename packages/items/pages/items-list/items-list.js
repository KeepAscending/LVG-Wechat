// packages/items/pages/items-list/items-list.js
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
    keywords:'',
    list: [],
    hasMore: true,
    total: 0,
    page: 1,
    untouch: false,
    modalShow: false,
    option: 0,
    people: 0,
    minprice: 0,
    maxprice: 501,
    saveminp: 0,
    savemaxp: 501,
    price_index: 0,
    price_save: 0,
    order: 0,
    orderStr: '排序',
    fieldname: 'item_updated',
    isDesc: true,
    beds: 0,
    room: 0,
    toilet: 0,
    restype_index: 0,
    type: '',
    more_save: 0,
    infrast: [
      {str: "空调", selected: false},{str: "WIFI", selected: false},
      {str: "热水沐浴", selected: false},{str: "暖气", selected: false},
      {str: "电视", selected: false},{str: "厨房", selected: false},
      {str: "洗衣机", selected: false},{str: "电脑", selected: false}
    ],
    safefaci: [
      {str: "烟雾报警器", selected: false},{str: "CO报警器", selected: false},
      {str: "灭火器", selected: false}
    ],
    supfaci: [
      {str: "免费停车位", selected: false},{str: "电梯", selected: false},
      {str: "健身房", selected: false},{str: "游泳池", selected: false}
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    var selecDateObj = wx.getStorageSync('selectDate'); 
    _this.setData({
      selectDate: (selecDateObj && selecDateObj.end.year!=''?selecDateObj:''),
    });
    _this.search();
  },

  /**
   * 创建查询体
   */
  createQuery(){
    var _this = this;
    var datas = _this.data;
    var query =  {
      keywords: datas.keywords,
      people: datas.people,
      minprice: datas.saveminp,
      maxprice: datas.savemaxp,
      room: datas.room,
      beds: datas.beds,
      toilet: datas.toilet,
      type: datas.type,
      infrast: [],
      safefaci: [],
      supfaci: [],
      fieldname: datas.fieldname,
      desc: datas.isDesc
     };
     datas.infrast.forEach(element => {
       if(element.selected){
        query.infrast.push(element.str);
       }
     });
     datas.safefaci.forEach(element => {
      if(element.selected){
       query.safefaci.push(element.str);
      }
    });
    datas.supfaci.forEach(element => {
      if(element.selected){
       query.supfaci.push(element.str);
      }
    });
     return query;
  },

  /**
   * 搜索
   */
  search(){
    this.refresh();
  },
  refresh(page = 1){
    var _this = this;
    var datas = _this.data;
    var query =  _this.createQuery();
    var uid = 0;
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    var selecDateObj = wx.getStorageSync('selectDate');
    var intime = '';
    var outtime = '';
    if (selecDateObj && selecDateObj.end.year!=''){
      intime = '' + selecDateObj.start.year + (selecDateObj.start.month>=10?selecDateObj.start.month:'0'+selecDateObj.start.month) + (selecDateObj.start.day>=10?selecDateObj.start.day:'0'+selecDateObj.start.day);
      outtime = '' + selecDateObj.end.year + (selecDateObj.end.month>=10?selecDateObj.end.month:'0'+selecDateObj.end.month) + (selecDateObj.end.day>=10?selecDateObj.end.day:'0'+selecDateObj.end.day);
    }
    view.showLoading('正在加载');
    api.getItemList({
      uid: uid,
      query: `${JSON.stringify(query)}`,
      intime: intime,
      outtime: outtime,
      page
    })
    .then(res => {
      if(res.status == 200){
        var data = {
          total: res.total,
          hasMore: res.hasMore,
          page: page
        };
        console.log(`${JSON.stringify(data)}`);
        console.log(`${JSON.stringify(res.rows.length)}`);
        if(page > 1){
          data.list = datas.list.concat(res.rows);
        }else{
          data.list = res.rows;
        }
        _this.setData(data);
        view.hideLoading();
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
   * 输入关键字
   */
  onConfirm(ev){
    var _this = this;
    var value = ev.detail.value;
    _this.setData({
      keywords: value
    });
    _this.search();
  },

  /**
   * 收藏
   */
  changeCollect(e){
    var _this = this;
    var datas = _this.data;
    var eData = e.currentTarget.dataset;
    var curindex = eData.curindex;
    var collect = !datas.list[curindex].collect;
    var itemid = datas.list[curindex].id;
    _this.setData({
      [`list[${curindex}].collect`]: collect
    }); 
    api.collectItem({uid: app.userInfo.uid, iid: itemid, collect: collect});
  },

  /**
   * 显示 Modal
   */
  openModal(ev){
    var _this = this;
    var datas = _this.data;
    var index  = 0;
    const data = {};
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    if(datas.option == index){
      data.option = 0;
      data.modalShow = false;
      data.untouch = false;
    } else{
      data.option = index;
      data.modalShow = true;
      data.untouch = true; 
    }
    _this.setData(data);
  },

  /**
   * 关闭 Modal
   */
  closeModal(){
    var _this = this;
    var datas = _this.data;  
    const data = {};
    if(datas.modalShow){
      data.modalShow = false;
    }
    if(datas.untouch){
      data.untouch = false;
    }
    if(datas.option != 0){
      data.option = 0;
    }
    _this.setData(data);
  },

  /**
   * 选择宜居人数
   */
  onPeople(ev){
    var _this = this;
    var datas = _this.data;
    var people  = 0;
    const data = {};
    if(typeof ev === 'object'){
      people = ev.currentTarget.dataset.people;
    }
    if(datas.people == people){
      data.people = 0;
    } else{
      data.people = people;
    }
    data.modalShow = false;
    data.untouch = false;
    data.option = 0;
    data.list = [];
    _this.setData(data);
    _this.search();
  },

  /**
   * 选择价格
   */
  // Slider 滑动和点击事件
  onSlider(ev){
    var _this = this;
    var datas = _this.data;
    var value = 0;
    var index = 0;
    const data = {};
    if(typeof ev === 'object'){
      value = ev.detail.value;
      index = ev.currentTarget.dataset.index;
    }
    if(index == 1){
      data.minprice = (value>datas.maxprice?datas.maxprice:value);
    }else{
      data.maxprice = (value<datas.minprice?datas.minprice:value);
    }
    data.price_index = 0;
    _this.setData(data);
  },
  // 点击价位事件
  changePrice(ev){
    var _this = this;
    var price = 0;
    const data = {};
    if(typeof ev === 'object'){
      price = ev.currentTarget.dataset.price;
    }
    if(price == 1){
      data.price_index = 1;
      data.minprice = 0;
      data.maxprice = 150;
    }
    if(price == 2){
      data.price_index = 2;
      data.minprice = 150;
      data.maxprice = 250;
    }
    if(price == 3){
      data.price_index = 3;
      data.minprice = 250;
      data.maxprice = 500;
    }
    if(price == 4){
      data.price_index = 4;
      data.minprice = 501;
      data.maxprice = 501;
    }
    _this.setData(data);
  },
  // 重置价位
  priceReset(){
    this.setData({
      minprice: 0,
      maxprice: 501,
      price_index: 0
    });
  },
  // 保存价位
  priceSave(){
    var _this = this;
    var datas = _this.data;
    _this.setData({
      saveminp: datas.minprice,
      savemaxp: datas.maxprice==0?501:datas.maxprice,
      untouch: false,
      modalShow: false,
      option: 0,
      price_save: 1,
      list: []
    });
    _this.search();
  },

  /**
   * 选择排序方式
   */
  onOrder(ev){
    var _this = this;
    var order  = 0;
    var orderStr = '排序';
    const data = {};
    if(typeof ev === 'object'){
      order = ev.currentTarget.dataset.order;
      orderStr = ev.currentTarget.dataset.orderstr;
      if(order==1){
        data.fieldname = "item_updated";
        data.isDesc = true;
      }
      if(order==2){
        data.fieldname = "item_eval";
        data.isDesc = true;
      }
      if(order==3){
        data.fieldname = "item_price";
        data.isDesc = false;
      }
      if(order==4){
        data.fieldname = "item_price";
        data.isDesc = true;
      }
    }
    data.order = order;
    data.orderStr = orderStr;
    data.modalShow = false;
    data.untouch = false;
    data.option = 0;
    data.list = [];
    _this.setData(data);
    _this.search();
  },

  /**
  * 更多筛选条件
  */
  // 卧室和床铺、房源类型
  numMinus(ev){
    var _this = this;
    var datas  = _this.data;
    var index = 0;
    var type = '';
    const data = {};
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
      type = ev.currentTarget.dataset.type;
    }
    if(index==1 && datas.beds>0){
      data.beds = datas.beds - 1;
    }
    if(index==2 && datas.room>0){
      data.room = datas.room - 1;
    }
    if(index==3 && datas.toilet>0){
      data.toilet = datas.toilet - 1;
    }
    // 房源类型
    if(index==4){
      if(index==datas.restype_index){
        data.restype_index = 0;
        data.type='';
      } else {
        data.restype_index = 4;
        data.type = type;
      }
    }
    if(index==5){
      if(index==datas.restype_index){
        data.restype_index = 0;
      } else {
        data.restype_index = 5;
        data.type = type;
      }
    }
    _this.setData(data);
  },

  numAdd(ev){
    var _this = this;
    var datas  = _this.data;
    var index = 0;
    const data = {};
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    if(index==1 && datas.beds<16){
      data.beds = datas.beds + 1;
    }
    if(index==2 && datas.room<16){
      data.room = datas.room + 1;
    }
    if(index==3 && datas.toilet<16){
      data.toilet = datas.toilet + 1;
    }
    _this.setData(data);
  },
  // 基础、安全、配套设施
  onFaci(ev){
    var _this = this;
    var datas  =  _this.data;
    var index = 0;
    var name = 0;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
      name = ev.currentTarget.dataset.name;
    }
    if(name==1){
      var selected = datas.infrast[index].selected;
      datas.infrast[index].selected = !selected;
    }
    if(name==2){
      var selected = datas.safefaci[index].selected;
      datas.safefaci[index].selected = !selected;
    }
    if(name==3){
      var selected = datas.supfaci[index].selected;
      datas.supfaci[index].selected = !selected;
    }
    _this.setData(datas);
  },
  // 重置筛选条件
  moreReset(){
    var _this = this;
    var datas  =  _this.data;
    datas.beds = 0;
    datas.room = 0;
    datas.toilet = 0;
    datas.restype_index = 0;
    datas.type='';
    datas.infrast.forEach(element => {
      element.selected = false;
    });
    datas.safefaci.forEach(element => {
      element.selected = false;
    });
    datas.supfaci.forEach(element => {
      element.selected = false;
    });
    _this.setData(datas);
  },
  // 保存筛选条件
  moreSave(){
    var _this = this;
    var datas  =  _this.data;
    datas.option = 0;
    datas.untouch = false;
    datas.modalShow = false;
    datas.more_save = 0;
    datas.list = [];
    if(datas.restype_index!=0){
      datas.more_save = 1;
    }
    if(datas.beds!=0 || datas.room!=0 || datas.toilet!=0){
      datas.more_save += 1;
    }
    datas.infrast.forEach(element => {
      if(element.selected){
        datas.more_save += 1;
      }
    });
    datas.safefaci.forEach(element => {
      if(element.selected){
        datas.more_save += 1;
      }
    });
    datas.supfaci.forEach(element => {
      if(element.selected){
        datas.more_save += 1;
      }
    });
    _this.setData(datas);
    _this.search();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom(){
    var _this = this;
    var datas = _this.data;
    if(datas.hasMore){
      _this.refresh(Number(datas.page) + 1);
    }
  },
})