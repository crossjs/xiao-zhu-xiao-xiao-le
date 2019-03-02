var yyw;
(function (yyw) {
    const colorMatrix = [
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0, 0, 0, 1, 0,
    ];
    yyw.grayFilter = new egret.ColorMatrixFilter(colorMatrix);
    function nude(target) {
        target.filters = null;
    }
    yyw.nude = nude;
    function gray(target) {
        target.filters = [yyw.grayFilter];
    }
    yyw.gray = gray;
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
    const fragmentSrcLight = `precision lowp float;
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
    const fragmentSrcWave = `precision lowp float;
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
    function light(target) {
        const lightFilter = new egret.CustomFilter(vertexSrc, fragmentSrcLight, {
            customUniform: 0,
        });
        target.filters = [lightFilter];
        const enterFrame = () => {
            lightFilter.uniforms.customUniform += 0.05;
            if (lightFilter.uniforms.customUniform > Math.PI * 2) {
                lightFilter.uniforms.customUniform = 0.0;
            }
        };
        target.addEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        return () => {
            target.filters = null;
            target.removeEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        };
    }
    yyw.light = light;
    function wave(target) {
        const waveFilter = new egret.CustomFilter(vertexSrc, fragmentSrcWave, {
            center: { x: 0.5, y: 0.5 },
            params: { x: 10, y: 0.2, z: 0.1 },
            time: 0,
        });
        target.filters = [waveFilter];
        const enterFrame = () => {
            waveFilter.uniforms.time += 0.005;
            if (waveFilter.uniforms.time > 1) {
                waveFilter.uniforms.time = 0.0;
            }
        };
        target.addEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        return () => {
            target.filters = null;
            target.removeEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        };
    }
    yyw.wave = wave;
})(yyw || (yyw = {}));
