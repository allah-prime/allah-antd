let _this: UserMonitor = {} as UserMonitor;

// ES5版本 https://blog.csdn.net/qq_41049816/article/details/90794454
export default class UserMonitor {
  // 定时器
  clientSetInter = {} as NodeJS.Timeout | null;

  // 回调事件
  func: () => void = function () {};

  // 清理的回调
  conditionFunc = false;

  // 清理的回调
  clientTime = 600000;

  constructor(func: () => void, clientTime: number, conditionFunc: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    _this = this;
    this.func = func;
    this.conditionFunc = conditionFunc;
    this.clientTime = clientTime;
    const body = document.querySelector('html');
    body!.addEventListener('click', this.saveClient);
    body!.addEventListener('keydown', this.saveClient);
    body!.addEventListener('mousemove', this.saveClient);
    body!.addEventListener('mousewheel', this.saveClient);
  }

  public saveClient() {
    // 如果有定时器了，重置定时器，问题是鼠标一动就重置了
    if (this.clientSetInter) {
      clearTimeout(this.clientSetInter);
      this.clientSetInter = null;
    }
    this.clientSetInter = setTimeout(() => {
      if (this.conditionFunc) {
        _this.func();
      }
    }, this.clientTime);
  }

  public remove() {
    if (this.clientSetInter) {
      clearTimeout(this.clientSetInter);
      this.clientSetInter = null;
    }
    const body = document.querySelector('html');
    body!.removeEventListener('click', this.saveClient);
    body!.removeEventListener('keydown', this.saveClient);
    body!.removeEventListener('mousemove', this.saveClient);
    body!.removeEventListener('mousewheel', this.saveClient);
  }
}
