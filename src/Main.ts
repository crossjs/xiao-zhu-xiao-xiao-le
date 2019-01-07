//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    private recommender: yyw.Recommender;
    // private sceneRecommender: SceneRecommender;

    protected createChildren(): void {
      super.createChildren();

      egret.lifecycle.addLifecycleListener((context) => {
        // custom lifecycle plugin
        egret.log("addLifecycleListener", context);
      });

      egret.lifecycle.onPause = () => {
        egret.ticker.pause();
      };

      egret.lifecycle.onResume = () => {
        egret.ticker.resume();
      };

      // inject the custom material parser
      // 注入自定义的素材解析器
      egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
      egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

      this.runGame().catch((e) => {
        egret.log(e);
      });
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected async createGameScene(): Promise<void> {
      this.initOpenDataContext();
      // 把 this 设置为场景管理器的根舞台
      SceneManager.instance.setStage(this);
      // 初始化交叉营销
      const recommender = new yyw.Recommender({
        appId: "wx11587d272c5f19a6",
        openId: "0",
        // origins: {
        //   box: 'http://127.0.0.1:7001',
        //   log: 'http://127.0.0.1:7002',
        // },
      });
      // // 监听就绪
      // recommender.onReady(() => {
      SceneManager.toScene("play");
      // });
      // // 存起来
      yyw.define.set("recommender", recommender);
    }

    private async runGame() {
      await this.loadResource();
      await this.createGameScene();
      const data = await Platform.login();
      // const userInfo = await Platform.getUserInfo();
      egret.log(data);
    }

    private async loadResource() {
      try {
        const loadingView = new LoadingUI();
        this.stage.addChild(loadingView);
        await RES.loadConfig("resource/default.res.json", "resource/");
        await this.loadTheme();
        await RES.loadGroup("preload", 0, loadingView);
        this.stage.removeChild(loadingView);
      } catch (e) {
        egret.error(e);
      }
    }

    private loadTheme() {
      return new Promise((resolve, reject) => {
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        // 加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        const theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, () => {
          resolve();
        }, this);
      });
    }

    private initOpenDataContext() {
      // 加载资源
      OpenDataContext.postMessage({
        command: "init",
      });
    }
  }
