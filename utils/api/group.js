import request from './request';

export default {
  // 根据用户ID获取房源列表
  getGroupList(data = {}){
    return request({
      url: '8081/group/list',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 新建房源
  newGroup(data = {}){
    return request({
      url: '8081/group/add',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },

  // 更新房源
  updGroup(data = {}){
    return request({
      url: '8081/group/update',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },
}