export function getPromise(name, option = {}) {
  return new Promise((resolve, reject) => {
    wx[name]({
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(e);
      },
      ...option
    });
  });
}
