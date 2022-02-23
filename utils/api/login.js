import openInterface from '../wx/openInterface';
import request from './request';

function getOpenId(data = {}){
  return request({
    url: '8084/user/wxlogin',
    method: 'POST',
    data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8;'
     }
  });
}

export default function(){
  const loginData = {};
  // 判断用户是否授权
  return openInterface.getSetting('userInfo').then(() => {
    return openInterface.getUserInfo();
  })
  // 获取用户信息结果
  .then(res => {
    loginData.wx_nickname = res.userInfo.nickName;
    loginData.wx_headpic = res.userInfo.avatarUrl;
    return openInterface.login();
  })
  // 获取登录code结果
 .then(code => {
    return getOpenId({
      code: code,
      nickname: loginData.wx_nickname,
      headpic: loginData.wx_headpic
    });
  })
  // 获取openid结果
  .then(res => {
    loginData.uid = res.data.id;
    return {
      loginData,
      ...res
    };
  });
}
