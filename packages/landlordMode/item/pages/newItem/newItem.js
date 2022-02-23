// packages/landlordMode/item/pages/newItem/newItem.js
import media from '../../../../../utils/wx/media';
import view from '../../../../../utils/wx/view';
import {sleep} from '../../../../../utils/timer/sleep';
import route from '../../../../../utils/wx/route';
import network from '../../../../../utils/wx/network';
import api from '../../../../../utils/api/items';
import config from '../../../../../utils/config';


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    price: '',
    discount: '',
    typeIndex: 0,
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
    images: [],
    modalShow: false,
    bedsParam: [
      "一张 1.2 米宽的单人床", "一张 1.4 米宽的单人床", "一张 1.5 米宽的单人床", 
      "一张 1.4 米宽的双人床", "一张 1.5 米宽的双人床", "一张 1.8 米宽的双人床", 
    ],
    people: 0,
    room: 0,
    toilet: 0,
    bedNum: 0,
    bedIndex: -1,
    bedStr: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var datas = _this.data;
    var data = {};
    if(options.groupId){
      data.groupId = Number(options.groupId);
    }
    if(options.item){
      var item = JSON.parse(decodeURIComponent(options.item));
      data.updFlag = true;
      data.iid = item.id;
      data.groupId = item.groupId;
      data.title = item.title;
      data.price = item.price;
      data.discount = item.discount;
      data.typeIndex = (item.type=='整个房源'?1:2);
      var infrast = datas.infrast;
      var infrastStr = item.infrast.split(',');
      infrast.forEach(element => {
        infrastStr.forEach(element2 => {
          if(element.str==element2){
            element.selected = true;
          }
        });
      });
      data.infrast = infrast;
      var safefaci = datas.safefaci;
      var safefaciStr = item.safefaci.split(',');
      safefaci.forEach(element => {
        safefaciStr.forEach(element2 => {
          if(element.str==element2){
            element.selected = true;
          }
        });
      });
      data.safefaci = safefaci;
      var images = item.image.split(',');
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
      data.people = item.people;
      data.room = item.room;
      data.toilet = item.toilet;
      var beds = item.beds.split(',');
      beds.pop();
      data.bedStr = beds;
      data.bedNum = beds.length;
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
   * 房型标题及价格 
   */
  onInputValue(ev){
    var _this = this;
    var index = 0;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    if(index==1){
      _this.setData({
        title: ev.detail.value
      });
    }
    if(index==2){
      _this.setData({
        price: ev.detail.value
      });
    }
    if(index==3){
      _this.setData({
        discount: ev.detail.value
      });
    }
  },

  /**
   * 选择房型类别
   */
  onType(ev){
    var _this = this;
    var index = 0;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    _this.setData({
      typeIndex: index
    });
  },

  /**
   * 基础设施和安全设施
   */
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
    _this.setData(datas);
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
   * 改变宜住人数、房间个数、卫生间个数、床铺数量
   */
  onChangeNum(ev){
    var _this = this;
    var datas = _this.data;
    var people = datas.people;
    var room = datas.room;
    var toilet = datas.toilet;
    var bedNum = datas.bedNum;
    var bedStr = datas.bedStr;
    var index = 0;
    var data = {};
    var flag;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
      flag = ev.currentTarget.dataset.flag;
    }
    if(index==1){
      (flag?--people:++people);
      if(people>=0){
        data.people = people;
      }
    }
    if(index==2){
      (flag?--room:++room);
      if(room>=0){
        data.room = room;
      }
    }
    if(index==3){
      (flag?--toilet:++toilet);
      if(toilet>=0){
        data.toilet = toilet;
      }
    }
    if(index==4){
      (flag?--bedNum:++bedNum);
      if(bedNum>=0){
        data.bedNum = bedNum;
        if(flag){
          console.log(bedNum);
          bedStr.splice(bedNum, 1);
          data.bedStr = bedStr;
        }
      }
    }
    _this.setData(data);
  },

  /**
   * 显示 Modal
   */
  openModal(ev){
    var _this = this;
    let index  = -1;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    _this.setData({
      modalShow: true,
      bedIndex: index
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
   * 选择床的大小
   */
  onSelectBed(ev){
    var _this = this;
    var datas = _this.data;
    var bedIndex = datas.bedIndex;
    var index = -1;
    if(typeof ev === 'object'){
      index = ev.currentTarget.dataset.index;
    }
    _this.setData({
      [`bedStr[${bedIndex}]`]: datas.bedsParam[index],
      modalShow: false
    });
  },

  /**
   * 发布
   */
  onSubmit(){
    var _this = this;
    var datas = _this.data;
    var updFlag = datas.updFlag;
    var title = datas.title;
    var price = datas.price;
    var discount = datas.discount;
    var typeIndex = datas.typeIndex;
    var type = '';
    if(typeIndex==1){
      type = '整个房源';
    }
    if(typeIndex==2){
      type = '独立房间';
    }
    var infrast = '';
    if(datas.infrast.length>0){
      datas.infrast.forEach(element => {
        if(element.selected){
          infrast = infrast + element.str + ',';
        }
      });
    }
    var safefaci = '';
    if(datas.safefaci.length>0){
      datas.safefaci.forEach(element => {
        if(element.selected){
          safefaci = safefaci + element.str + ',';
        }
      });
    }
    var images = datas.images;
    var people = datas.people;
    var room = datas.room;
    var toilet = datas.toilet;
    var bedNum = datas.bedNum;
    var beds = '';
    if(datas.bedStr.length>0){
      datas.bedStr.forEach(element => {
        if(element!=''){
          beds = beds + element + ',';
        }
      });
    }
    var bedFlag = (beds.split(',').length-1) == bedNum?true:false;
    if(title!='' && price!='' && price!=0 && discount!='' && type!='' && images.length>0 && people!=0 && room!=0 && toilet!=0 && bedFlag){
      if(!updFlag){
        view.showLoading('发布中...');
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
        var item = {
          groupId: datas.groupId,
          title: title,
          price: price,
          discount: discount,
          type: type,
          infrast: infrast,
          safefaci: safefaci,
          image: res,
          people: people,
          room: room,
          toilet: toilet,
          beds: beds,
          status: 1
        }
        if(!updFlag){
          api.newItem({itemJson: JSON.stringify(item)}).then(res => {
            if(res.status==200){
              view.hideLoading();
              view.showLoading("发布成功，3秒后返回到上一页");
              sleep(3000).then(() => {
                view.hideLoading();
                route.navigateBack();
              });
            }
          });
        }else{
          item.id = datas.iid;
          api.updItem({itemJson: JSON.stringify(item)}).then(res => {
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
      view.toast("未完善房型信息，请完善后发布")
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