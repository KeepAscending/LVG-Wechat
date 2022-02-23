// packages/order/pages/order-eval/order-eval.js
import media from '../../../../utils/wx/media';
import view from '../../../../utils/wx/view';
import {sleep} from '../../../../utils/timer/sleep';
import route from '../../../../utils/wx/route';
import network from '../../../../utils/wx/network';
import api from '../../../../utils/api/order';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: 0,
    content: '',
    images: [],
    video: '',
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      oid: Number(options.oid)
    });
  },

  /**
   * 评分
   */
  onPoint(ev){
    var _this = this;
    var index = ev.currentTarget.dataset.index;
    _this.setData({
      point: index + 1
    });
  },

  /**
   * 输入函数
   */
  onInput(ev){
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
    var count = 7 - images.length;
    if(count>0){
      media.chooseImage(count).then(res => {
        images = images.concat(res.tempFilePaths);
        _this.setData({
          images: images
        });
      });
    }else{
      view.toast("上传的图片不可超过7张");
    }
  },

  /**
   * 添加视频
   */
  addVideo(){
    var _this = this;
    var video = _this.data.video;
    if(video==''){
      media.chooseVideo().then(res => {
        _this.setData({
          video: res.tempFilePath
        });
      });
    }else{
      view.toast("只允许上传一个视频");
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
   * 取消视频
   */
  onShutVid(){
    var _this = this;
    _this.setData({
      video: ''
    });
  },

  /**
   * 发布评价
   */
  onPublish(){
    var _this = this;
    var datas = _this.data;
    var oid = datas.oid;
    var point = datas.point;
    var content = datas.content;
    var images = datas.images;
    var video = datas.video;
    var uid = 0;
    if(app.userInfo.uid){
      uid = app.userInfo.uid;
    }
    if(point != 0){
      view.hideLoading('发布中...');
      // 缓存评分
      wx.setStorage({
        key: "orderEval_Point",
        data: point
      });

      // 更新订单的评分
      var order = {
        id: oid,
        point: point
      }
      api.updateOrder({orderJson: JSON.stringify(order)});

      // 新增订单评价
      let response = [];
      if(images.length>0){
        images.forEach(element => {
          let res1 =  network.uploadFile(element);
          response.push(res1);
        });
      }
      if(video!=''){
        let res2 =  network.uploadFile(video);
        response.push(res2);
      }
      Promise.all(response).then(res => {
        let imageStr = '';
        let videoStr = '';
        if(video!=''){
          var vidRes = JSON.parse(res.pop().data);
          videoStr = vidRes.data;
        }
        res.forEach(elements => {
          var imgRes = JSON.parse(elements.data);
          imageStr = imageStr + imgRes.data + ',';
        })
        return {imageStr, videoStr};
      }).then(res => {
        var orderEval = {
          orderId: oid,
          userId: uid,
          content: content,
          image: res.imageStr,
          video: res.videoStr
        }
        api.addOrderEval({evalJson: JSON.stringify(orderEval)}).then(res => {
          if(res.status==200){
            view.hideLoading();
            view.showLoading("发布成功，3秒后返回到上一页");
            sleep(3000).then(() => {
              view.hideLoading();
              route.navigateBack();
            });
          }
        });
      })
    } else {
      view.toast("请先为房源星级打分");
    }
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