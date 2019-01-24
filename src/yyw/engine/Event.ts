namespace yyw {
  const dispatcher = new egret.EventDispatcher();

  export function on(type: string, listener: any) {
    dispatcher.addEventListener(type, listener, null);
  }

  export function once(type: string, listener: any) {
    dispatcher.once(type, listener, null);
  }

  export function off(type: string, listener: any) {
    dispatcher.removeEventListener(type, listener, null);
  }

  export function emit(type: string, data: any) {
    dispatcher.dispatchEventWith(type, false, data);
  }
}
