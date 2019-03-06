namespace yyw {
  const grayColorMatrix = [
    0.33, 0.33, 0.33, 0, 0,
    0.33, 0.33, 0.33, 0, 0,
    0.33, 0.33, 0.33, 0, 0,
    0,    0,    0,    1, 0,
  ];

  // 给 EXML 用
  export const grayFilter = new egret.ColorMatrixFilter(grayColorMatrix);

  export function nude(target: egret.DisplayObject) {
    target.filters = null;
  }

  export function gray(target: egret.DisplayObject) {
    target.filters = [grayFilter];
  }

  // const egret.wxgame.EgretShaderLib.default_vert;

  const fragmentSrcLight = `precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform float customUniform;
void main() {
  vec2 uvs = vTextureCoord.xy;
  vec4 fg = texture2D(uSampler, vTextureCoord);
  fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;
  gl_FragColor = fg * vColor;
}`;

  const fragmentSrcWave = `precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform vec2 center;
uniform vec3 params;
uniform float time;
void main() {
  vec2 uv = vTextureCoord.xy;
  vec2 texCoord = uv;
  float dist = distance(uv, center);
  if ((dist <= (time + params.z)) && (dist >= (time - params.z))){
    float diff = (dist - time);
    float powDiff = 1.0 - pow(abs(diff * params.x), params.y);
    float diffTime = diff * powDiff;
    vec2 diffUV = normalize(uv - center);
    texCoord = uv + (diffUV * diffTime);
  }
  gl_FragColor = texture2D(uSampler, texCoord);
}`;

  const fragmentSrcNoise = `precision highp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;
float rand(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main(){
  vec4 color = texture2D(uSampler, vTextureCoord);
  float randomValue = rand(gl_FragCoord.xy * uSeed);
  float diff = (randomValue - 0.5) * uNoise;
  if (color.a > 0.0) {
    color.rgb /= color.a;
  }
  color.r += diff;
  color.g += diff;
  color.b += diff;
  color.rgb *= color.a;
  gl_FragColor = color;
}`;

  export function noise(target: egret.DisplayObject, {
    noise = 0.05,
    seed = 0.5,
  }: {
    noise?: number;
    seed?: number;
  } = {}) {
    const noiseFilter = new egret.CustomFilter(
      egret.wxgame.EgretShaderLib.default_vert,
      fragmentSrcNoise, {
        uNoise: noise,
        uSeed: seed,
      },
    );
    target.filters = [noiseFilter];
  }

  const wmLight = new WeakMap();
  const wmWave = new WeakMap();

  export function light(target: egret.DisplayObject): void {
    if (wmLight.get(target)) {
      return;
    }
    const lightFilter = new egret.CustomFilter(
      egret.wxgame.EgretShaderLib.default_vert,
      fragmentSrcLight, {
        customUniform: 0,
      },
    );

    target.filters = [lightFilter];

    const enterFrame = () => {
      lightFilter.uniforms.customUniform += 0.05;
      if (lightFilter.uniforms.customUniform > Math.PI * 2) {
        lightFilter.uniforms.customUniform = 0.0;
      }
    };

    target.addEventListener(
      egret.Event.ENTER_FRAME,
      enterFrame,
      null,
    );

    wmLight.set(target, () => {
      target.filters = null;
      target.removeEventListener(
        egret.Event.ENTER_FRAME,
        enterFrame,
        null,
      );
    });
  }

  export function disLight(target: egret.DisplayObject): void {
    const off = wmLight.get(target);
    if (off) {
      off();
      wmLight.delete(target);
    }
  }

  export function wave(target: egret.DisplayObject, {
    step = 0.005,
    x = 10,
    y = 0.2,
    z = 0.1,
  }: {
    step?: number;
    x?: number;
    y?: number;
    z?: number;
  } = {}): void {
    if (wmWave.get(target)) {
      return;
    }
    const waveFilter = new egret.CustomFilter(
      egret.wxgame.EgretShaderLib.default_vert,
      fragmentSrcWave, {
        center: { x: 0.5, y: 0.5 },
        params: { x, y, z },
        time: 0,
      },
    );

    target.filters = [waveFilter];

    const enterFrame = () => {
      waveFilter.uniforms.time += step;
      if (waveFilter.uniforms.time > 1) {
        waveFilter.uniforms.time = 0.0;
      }
    };

    target.addEventListener(
      egret.Event.ENTER_FRAME,
      enterFrame,
      null,
    );

    wmWave.set(target, () => {
      target.filters = null;
      target.removeEventListener(
        egret.Event.ENTER_FRAME,
        enterFrame,
        null,
      );
    });
  }

  export function disWave(target: egret.DisplayObject): void {
    const off = wmWave.get(target);
    if (off) {
      off();
      wmWave.delete(target);
    }
  }
}
