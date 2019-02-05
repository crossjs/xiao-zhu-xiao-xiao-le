namespace yyw {
  const dispatcher = new egret.EventDispatcher();

  export function on(type: string, listener: any, thisObj: any = null) {
    dispatcher.addEventListener(type, listener, thisObj);
  }

  export function once(type: string, listener: any, thisObj: any = null) {
    dispatcher.once(type, listener, thisObj);
  }

  export function off(type: string, listener: any, thisObj: any = null) {
    dispatcher.removeEventListener(type, listener, thisObj);
  }

  export function emit(type: string, data: any = {}) {
    dispatcher.dispatchEventWith(type, false, data);
  }
}
