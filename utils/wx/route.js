import {getPromise} from './promise';

export default {
  navigateTo(url = ''){
    return getPromise('navigateTo', {url});
  },
  navigateBack(delta = 1){
    return getPromise('navigateBack', {delta});
  },
  redirectTo(url = ''){
    return getPromise('redirectTo', {url});
  },
  reLaunch(url = ''){
    return getPromise('reLaunch', {url});
  }
}