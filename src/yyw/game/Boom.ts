namespace yyw {
  export class Boom {
    public static booms: dragonBones.EgretArmatureDisplay[];
    public static init() {
      const dragonbonesData = RES.getRes("boom_ske_dbbin" );
      const textureData = RES.getRes("boom_tex_json" );
      const texture = RES.getRes( "boom_tex_png" );
      const egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
      egretFactory.parseDragonBonesData(dragonbonesData);
      egretFactory.parseTextureAtlasData(textureData, texture);
      // 弄 64 个缓存起来
      this.booms = Array(MAX_COLS * MAX_ROWS).fill(0).map(() => {
        return egretFactory.buildArmatureDisplay("boom1");
      });
    }
    public static async playAt(target: egret.DisplayObjectContainer) {
      return new Promise((resolve) => {
        if (!this.booms) {
          this.init();
        }
        const boom: dragonBones.EgretArmatureDisplay = this.booms.pop();
        boom.x = target.width / 2;
        boom.y = target.height / 2;
        target.addChild(boom);
        boom.once(dragonBones.MovieEvent.COMPLETE, (e: egret.Event) => {
          removeElement(boom);
          this.booms.unshift(boom);
          resolve();
        }, this);
        boom.animation.play("run", 1);
      });
    }
  }
}
