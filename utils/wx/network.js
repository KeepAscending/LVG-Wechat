import {getPromise} from './promise';

request.interceptors = {};

export function request(option, useBaseURL = true){
  if(!option.url){
    return Promise.reject(new Error('缺少url参数'));
  }

  const baseURL = request.baseURL;

  if(useBaseURL && baseURL){
    option.url = baseURL + option.url;
  }

  return getPromise('request', option).then(res => {
    return request.interceptors.response ? request.interceptors.response(res) : Promise.resolve(res);
  });
}

export default {
  uploadFile(filePath){
    return getPromise('uploadFile', {
      url: 'http://192.168.40.1:80/upload',
      filePath: filePath,
      name: 'file',
      formData: {
      },
      header: {
        'content-type': 'multipart/form-data'
      }
    });
  }
}
