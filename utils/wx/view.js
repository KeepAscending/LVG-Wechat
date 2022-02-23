import {getPromise} from './promise';

export default {
  showLoading(title = ''){
    return getPromise('showLoading', {
      title,
      mask: true
    });
  },
  hideLoading(){
    return getPromise('hideLoading');
  },
  showModal(option) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        success(res) {
          if (res.confirm) {
            resolve();
          }
        },
        fail(err) {
          reject(err);
        },
        ...option
      });
    });
  },
  toast(title, icon = 'none'){
    let iconVal = 'success';
    if(typeof icon === 'string'){
      iconVal = icon;
    }
    wx.showToast({
      title,
      icon: iconVal
    });
  }
}