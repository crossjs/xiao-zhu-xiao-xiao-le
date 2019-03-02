var yyw;
(function (yyw) {
    class Sound {
        constructor() {
            egret.setTimeout(async () => {
                if (this.url) {
                    this.sound = await yyw.loadAudio(this.url);
                }
            }, this, 0);
            this.constructor.instance = this;
        }
        static play() {
            if (!this.instance) {
                this.instance = new this();
            }
            this.instance.play();
        }
        play() {
            if (!yyw.CONFIG.soundEnabled) {
                return;
            }
            if (!this.sound) {
                return;
            }
            const soundChannel = this.sound.play(0, 1);
            soundChannel.once(egret.Event.SOUND_COMPLETE, () => {
                soundChannel.stop();
            }, this);
        }
    }
    yyw.Sound = Sound;
})(yyw || (yyw = {}));
