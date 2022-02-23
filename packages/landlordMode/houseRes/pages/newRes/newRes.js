// packages/landlordMode/houseRes/pages/newRes/newRes.js
import media from '../../../../../utils/wx/media';
import view from '../../../../../utils/wx/view';
import {sleep} from '../../../../../utils/timer/sleep';
import route from '../../../../../utils/wx/route';
import network from '../../../../../utils/wx/network';
import api from '../../../../../utils/api/group';
import config from '../../../../../utils/config';


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    city: '',
    adress: '',
    restype: [
      {str: "公寓型住宅", selected: false},{str: "独栋楼", selected: false},
      {str: "别墅", selected: false},{str: "酒店", selected: false},
      {str: "乡村小屋", selected: false},{str: "青年旅馆", selected: false},
    ],
    supfaci: [
      {str: "免费停车位", selected: false},{str: "电梯", selected: false},
      {str: "健身房", selected: false},{str: "游泳池", selected: false}
    ],
    title: '',
    content: '',
    num: 0,
    images: [],
    modalShow: false,
    deline: '',
    earliest: '',
    latest: '',
    checkout: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var datas = _this.data;
    var data = {};
    if(options.group){
      var group = JSON.parse(decodeURIComponent(options.group));
      data.updFlag = true;
      data.gid = group.id;
      data.province = group.province;
      data.city = group.city;
      data.adress = group.adress;
      data.title = group.title;
      data.content = group.introduce;
      data.num = group.introduce.length;
      var images = group.image.split(',');
      images.pop();// 去除最后一个逗号带来的空链接
      images.forEach(element => {
        wx.downloadFile({
          url: config.mediaHost + element,
          success (res) {
            if (res.statusCode === 200) {
              var images =  datas.images;
              images.push(res.tempFilePath);
              _this.setData({images: images});
            }
          }
        })
      });
      data.deline = group.deline;
      data.earliest = group.earliest;
      data.latest = group.latest;
      data.checkout = group.checkout;
      var restype = datas.restype;
      restype.forEach(element => {
        if(element.str==group.restype){
          element.selected = true;
          return;
        }
      });
      data.restype = restype;
      var supfaci = datas.supfaci;
      var supfaciStr = group.supfaci.split(',');
      supfaci.forEach(element => {
        supfaciStr.forEach(element2 => {
          if(element.str==element2){
            element.selected = true;
          }
        });
      });
      data.supfaci = supfaci;
    }else{
      data.updFlag = false;
    }
    _this.setData(data);
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
   * 输入房源地址及房源名称
   */
  onInputValue(ev){
    var _this = this;
    var index = ev.currentTarget.dataset.index
    if(index==1){
      _this.setData({
        province: ev.detail.value
      });
    }
    if(index==2){
      _this.setData({
        city: ev.detail.value
      });
    }
    if(index==3){
      _this.setData({
        adress: ev.detail.value
      });
    }
    if(index==4){
      _this.setData({
        title: ev.detail.value
      });
    }
  },

  /**
   * 选择房源类型及配套设施
   */
  onRestype(ev){
    var _this = this;
    var datas  =  _this.data;
    var index = 0;
    var name = 0;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
      name = ev.currentTarget.dataset.name;
    }
    if(name==1){
      datas.restype.forEach(element => {
        element.selected = false;
      });
      var selected = datas.restype[index].selected;
      datas.restype[index].selected = !selected;
    }
    if(name==2){
      var selected = datas.supfaci[index].selected;
      datas.supfaci[index].selected = !selected;
    }
    _this.setData(datas);
  },

  /**
   * 输入房源简介
   */
  onTextarea(ev){
    var content = ev.detail.value;
    this.setData({
      content: content,
      num: content.length
    });
  },

  /**
   * 添加图片
   */
  addImage(){
    var _this = this;
    var images = _this.data.images
    var count = 20 - images.length;
    if(count>0){
      media.chooseImage(count).then(res => {
        images = images.concat(res.tempFilePaths);
        _this.setData({
          images: images
        });
      });
    }else{
      view.toast("上传的图片不可超过20张");
    }
  },

  /**
   * 取消图片
   */
  onShutPic(ev){
    var _this = this;
    var images = _this.data.images;
    var index = ev.currentTarget.dataset.index;
    images.splice(index, 1);
    _this.setData({
      images: images
    });
  },

  /**
   * 显示 Modal
   */
  openModal(ev){
    var _this = this;
    let index  = 0;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    _this.setData({
      modalShow: true,
      bookIndex: index
    });
  },

  /**
   * 关闭 Modal
   */
  closeModal(){
    this.setData({
      modalShow: false
    });
  },

  /**
   * 选择时间
   */
  onSelectTime(ev){
    var _this = this;
    let index  = 0;
    var bookIndex = _this.data.bookIndex;
    var data = {}
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    var time = (index>=10?index:'0'+index)+':00:00';
    if(bookIndex==1){
      data.deline = time;
    }
    if(bookIndex==2){
      data.earliest = time;
    }
    if(bookIndex==3){
      data.latest = time;
    }
    if(bookIndex==4){
      data.checkout = time;
    }
    data.modalShow = false;
    _this.setData(data);
  },

  /**
   * 提交
   */
  onSubmit(){
    var _this = this;
    var datas = _this.data;
    var updFlag = datas.updFlag;
    var province = datas.province;
    var city = datas.city;
    var adress = datas.adress;
    var restype = '';
    if(datas.restype.length>0){
      datas.restype.forEach(element => {
        if(element.selected){
          restype = element.str;
          return;
        }
      });
    }
    var supfaci = '';
    if(datas.supfaci.length>0){
      datas.supfaci.forEach(element => {
        if(element.selected){
          supfaci = supfaci + element.str + ',';
        }
      });
    }
    var title = datas.title;
    var content = datas.content;
    var images = datas.images;
    var deline = datas.deline;
    var earliest = datas.earliest;
    var latest = datas.latest;
    var checkout = datas.checkout;
    if(province!='' && city!='' && adress!='' && restype!='' && title!='' && content!='' && images.length>0 && deline!='' && earliest!='' && latest!='' && checkout!=''){
      if(!updFlag){
        view.showLoading('提交中...');
      }else{
        view.showLoading('修改中...');
      }
      let response = [];
      images.forEach(element => {
        let res =  network.uploadFile(element);
        response.push(res);
      });
      Promise.all(response).then(res => {
        let imageStr = '';
        res.forEach(elements => {
          var imgRes = JSON.parse(elements.data);
          imageStr = imageStr + imgRes.data + ',';
        })
        return imageStr;
      }).then(res => {
        var group = {
          hostId: app.userInfo.uid,
          title: title,
          province: province,
          city: city,
          adress: adress,
          restype: restype,
          image: res,
          introduce: content,
          deline: deline,
          earliest: earliest,
          latest: latest,
          checkout: checkout,
          supfaci: supfaci
        }
        if(!updFlag){
          api.newGroup({groupJson: JSON.stringify(group)}).then(res => {
            if(res.status==200){
              view.hideLoading();
              view.showLoading("提交成功，3秒后返回到上一页");
              sleep(3000).then(() => {
                view.hideLoading();
                route.navigateBack();
              });
            }
          });
        }else{
          group.id = datas.gid;
          api.updGroup({groupJson: JSON.stringify(group)}).then(res => {
            if(res.status==200){
              view.hideLoading();
              view.showLoading("修改成功，3秒后返回到上一页");
              sleep(3000).then(() => {
                view.hideLoading();
                route.navigateBack();
              });
            }
          });      
        }
      })
    }else{
      view.toast("未完善房源信息，请完善后提交");
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