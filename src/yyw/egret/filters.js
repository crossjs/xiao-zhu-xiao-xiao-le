var yyw;
(function (yyw) {
    var colorMatrix = [
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0, 0, 0, 1, 0,
    ];
    // 给 EXML 用
    yyw.grayFilter = new egret.ColorMatrixFilter(colorMatrix);
    function nude(target) {
        target.filters = null;
    }
    yyw.nude = nude;
    function gray(target) {
        target.filters = [yyw.grayFilter];
    }
    yyw.gray = gray;
    var vertexSrc = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nconst vec2 center = vec2(-1.0, 1.0);\nvoid main(void) {\n  gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n  vTextureCoord = aTextureCoord;\n  vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n}";
    var fragmentSrcLight = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nuniform float customUniform;\nvoid main(void) {\n  vec2 uvs = vTextureCoord.xy;\n  vec4 fg = texture2D(uSampler, vTextureCoord);\n  fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n  gl_FragColor = fg * vColor;\n}";
    var fragmentSrcWave = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nuniform vec2 center;\nuniform vec3 params;\nuniform float time;\nvoid main(){\n  vec2 uv = vTextureCoord.xy;\n  vec2 texCoord = uv;\n  float dist = distance(uv, center);\n  if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) ){\n    float diff = (dist - time);\n    float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n    float diffTime = diff  * powDiff;\n    vec2 diffUV = normalize(uv - center);\n    texCoord = uv + (diffUV * diffTime);\n  }\n  gl_FragColor = texture2D(uSampler, texCoord);\n}";
    function light(target) {
        var lightFilter = new egret.CustomFilter(vertexSrc, fragmentSrcLight, {
            customUniform: 0,
        });
        target.filters = [lightFilter];
        var enterFrame = function () {
            lightFilter.uniforms.customUniform += 0.05;
            if (lightFilter.uniforms.customUniform > Math.PI * 2) {
                lightFilter.uniforms.customUniform = 0.0;
            }
        };
        target.addEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        return function () {
            target.filters = null;
            target.removeEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        };
    }
    yyw.light = light;
    function wave(target) {
        var waveFilter = new egret.CustomFilter(vertexSrc, fragmentSrcWave, {
            center: { x: 0.5, y: 0.5 },
            params: { x: 10, y: 0.2, z: 0.1 },
            time: 0,
        });
        target.filters = [waveFilter];
        var enterFrame = function () {
            waveFilter.uniforms.time += 0.005;
            if (waveFilter.uniforms.time > 1) {
                waveFilter.uniforms.time = 0.0;
            }
        };
        target.addEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        return function () {
            target.filters = null;
            target.removeEventListener(egret.Event.ENTER_FRAME, enterFrame, null);
        };
    }
    yyw.wave = wave;
})(yyw || (yyw = {}));
