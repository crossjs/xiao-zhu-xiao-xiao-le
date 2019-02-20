namespace game {
  export class Landing extends yyw.Base {
    private btnCheckin: eui.Button;
    private btnBoard: eui.Button;
    private btnStart: eui.Button;
    private tfdVersion: eui.Label;
    private tfdBestScore: eui.Label;
    private favorite: eui.Image;
    private pig: eui.Image;
    private numbers: eui.Image;
    private userInfoButton: wx.UserInfoButton;
    private duration: number = 500;

    public async exiting() {
      yyw.getTween(this.pig).to(
        {
          x: this.pig.x + 90,
          y: this.pig.y + 60,
        },
        this.duration,
      );
      yyw.getTween(this.numbers).to(
        {
          x: this.numbers.x - 60,
          y: this.numbers.y - 30,
        },
        this.duration,
      );
      await yyw.fadeOut(this);
    }

    public async entering() {
      yyw.getTween(this.pig).to(
        {
          x: this.pig.x - 90,
          y: this.pig.y - 60,
        },
        this.duration,
      );
      yyw.getTween(this.numbers).to(
        {
          x: this.numbers.x + 60,
          y: this.numbers.y + 30,
        },
        this.duration,
      );
      await yyw.fadeIn(this);
    }

    protected destroy(): void {
      if (this.userInfoButton) {
        this.userInfoButton.destroy();
      }
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        // const { width, height } = this.btnStart;
        // const { x: left, y: top } = this.btnStart.localToGlobal();
        // TODO 封装成 Component
        this.userInfoButton = await yyw.createUserInfoButton({
          left: 159,
          top: this.stage.stageHeight - 478,
          width: 432,
          height: 144,
          onTap: () => {
            yyw.director.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 每日签到
        yyw.onTap(this.btnCheckin, () => {
          yyw.director.toScene("checkin", true);
        });

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          yyw.director.toScene("ranking", true);
        });

        // 开始游戏
        yyw.onTap(this.btnStart, () => {
          yyw.director.toScene("playing");
        });

        // yyw.showToast(`${yyw.CONFIG.launchOptions.scene}`);
        const STICKY_KEY = "STICKY_ENTRY";
        if (!(await yyw.storage.get(STICKY_KEY))) {
          // 微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）
          if (yyw.CONFIG.launchOptions.scene === 1104) {
            yyw.storage.set(STICKY_KEY, true);
            yyw.award.save({ coins: 1000 });
            yyw.showToast("获得奖励：1000 金币！");
          } else {
            this.favorite.visible = true;
          }
        }

        const vertexSrc = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aColor;
uniform vec2 projectionVector;
varying vec2 vTextureCoord;
varying vec4 vColor;
const vec2 center = vec2(-1.0, 1.0);
void main(void) {
  gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);
  vTextureCoord = aTextureCoord;
  vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);
}`;

        const fragmentSrc1 = `precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform float customUniform;
void main(void) {
  vec2 uvs = vTextureCoord.xy;
  vec4 fg = texture2D(uSampler, vTextureCoord);
  fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;
  gl_FragColor = fg * vColor;
}`;

        const fragmentSrc3 = `precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform vec2 center;
uniform vec3 params;
uniform float time;
void main(){
  vec2 uv = vTextureCoord.xy;
  vec2 texCoord = uv;
  float dist = distance(uv, center);
  if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) ){
    float diff = (dist - time);
    float powDiff = 1.0 - pow(abs(diff*params.x), params.y);
    float diffTime = diff  * powDiff;
    vec2 diffUV = normalize(uv - center);
    texCoord = uv + (diffUV * diffTime);
  }
  gl_FragColor = texture2D(uSampler, texCoord);
}`;

        const customFilter1 = new egret.CustomFilter(vertexSrc, fragmentSrc1, {
          customUniform: 0,
        });

        const customFilter3 = new egret.CustomFilter(vertexSrc, fragmentSrc3, {
          center: { x: 0.5, y: 0.5 },
          params: { x: 10, y: 0.2, z: 0.1 },
          time: 0,
        });

        this.bg.filters = [customFilter1];
        this.pig.filters = [customFilter3];

        this.addEventListener(
          egret.Event.ENTER_FRAME,
          () => {
            customFilter1.uniforms.customUniform += 0.05;
            if (customFilter1.uniforms.customUniform > Math.PI * 2) {
              customFilter1.uniforms.customUniform = 0.0;
            }
            customFilter3.uniforms.time += 0.005;
            if (customFilter3.uniforms.time > 1) {
              customFilter3.uniforms.time = 0.0;
            }
          },
          this,
        );
      }

      // 初始化全局配置
      const { score = 0 } = await yyw.pbl.get();
      this.tfdBestScore.text = `历史最高分数： ${score}`;
    }
  }
}
