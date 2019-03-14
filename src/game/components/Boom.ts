namespace game {
  export class Boom {
    public static adBoom1: dragonBones.EgretArmatureDisplay;
    public static adBoom2: dragonBones.EgretArmatureDisplay;
    public static init() {
      {
        const dragonbonesData = RES.getRes("boom_ske_dbbin" );
        const textureData = RES.getRes("boom_tex_json" );
        const texture = RES.getRes( "boom_tex_png" );
        const egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
        egretFactory.parseDragonBonesData(dragonbonesData);
        egretFactory.parseTextureAtlasData(textureData, texture);
        this.adBoom1 = egretFactory.buildArmatureDisplay("boom1");
        this.adBoom2 = egretFactory.buildArmatureDisplay("boom2");
      }
    }
    public static async playAt(target: egret.DisplayObjectContainer) {
      return new Promise((resolve) => {
        if (!this.adBoom1 || !this.adBoom2) {
          this.init();
        }
        const adBoom: dragonBones.EgretArmatureDisplay = this[`adBoom${yyw.random(1, 3)}`];
        adBoom.x = target.width / 2;
        adBoom.y = target.height / 2;
        target.addChild(adBoom);
        adBoom.once(dragonBones.MovieEvent.COMPLETE, (e: egret.Event) => {
          yyw.removeElement(adBoom);
          resolve();
        }, this);
        adBoom.animation.play("run", 1);
      });
    }
  }
}
