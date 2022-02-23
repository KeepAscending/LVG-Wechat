import {request} from '../wx/network';
import config from '../config';

request.baseURL = config.getRequestPrefix();
request.interceptors.response = function(res){
  if(res.statusCode === 200){
    return Promise.resolve(res.data);
  }else{
    return Promise.reject({
      msg: '请求出错',
      data: res.data
    });
  }
}

export default request