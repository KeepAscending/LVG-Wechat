import {getPromise} from './promise';

export default {
  // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
  getSetting(scope = 'userInfo'){
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res){
          if(res.authSetting[`scope.${scope}`]){
            resolve();
          }else{
            reject({
              code: 0,
              msg: `没有权限：scope.${scope}`
            });
          }
        },
        fail(err){
          reject({
            code: -1,
            msg: `确认授权出错：scope.${scope}`
          });
        }
      });
    });
  },

  // 获取用户信息，用户信息对象，不包含 openid 等敏感信息
  getUserInfo(option = {}) {
    return getPromise('getUserInfo', option);
  },

  // 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等
  login(){
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if(res.code) {
            resolve(res.code);
          } else {
            reject('获取login code失败');
          }
        },
        fail(err) {
          reject('获取login code出错了');
        }
      });
    });
  },

  // 发起微信支付
  requestPayment(option){
    return getPromise('requestPayment', option);
  },

  // 提前向用户发起授权请求
  authorize(scope = ''){
    scope = `scope.${scope}`;
    return getPromise('authorize', {
      scope
    });
  }
}
