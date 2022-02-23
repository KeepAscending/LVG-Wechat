import {getPromise} from './promise';

export default {
  // 拍摄或从手机相册中选择图片或视频
  chooseImage(count){
    return getPromise('chooseImage', {
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    });
  },

  // 拍摄视频或从手机相册中选视频
  chooseVideo(){
    return getPromise('chooseVideo', {
      sourceType:	['album', 'camera'],
      compressed:	true, //是否压缩所选择的视频文件
      maxDuration: 10, //拍摄视频最长拍摄时间，单位秒 	
      camera:	'back' //默认拉起的是前置或者后置摄像头
    });
  }
}
