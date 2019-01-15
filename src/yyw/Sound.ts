namespace yyw {
  let muted: boolean = false;

  export function getMute(): boolean {
    return muted;
  }

  export function setMute(b: boolean) {
    muted = b;
  }
}
