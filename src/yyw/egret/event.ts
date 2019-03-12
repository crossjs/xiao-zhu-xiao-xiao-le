namespace yyw {
  const dispatcher = new egret.EventDispatcher();

  export function on(type: string, listener: any, thisObj: any = null): () => void {
    dispatcher.addEventListener(type, listener, thisObj);
    return () => off(type, listener, thisObj);
  }

  export function once(type: string, listener: any, thisObj: any = null): void {
    dispatcher.once(type, listener, thisObj);
  }

  export function off(type: string, listener: any, thisObj: any = null): void {
    dispatcher.removeEventListener(type, listener, thisObj);
  }

  export function emit(type: string, data: any = {}): void {
    dispatcher.dispatchEventWith(type, false, data);
  }
}
