// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const Top3 = {
  isReady: false,

  async preload() {
    if (!this.isReady) {
      await AssetsManager.init();
      this.isReady = true;
    }
  },

  /**
   * 绘制屏幕
   * 这个函数会在加载完所有资源之后被调用
   */
  async create({ width, height, rankingData }) {
    if (sharedCanvas.width && sharedCanvas.height) {
      // 确保就绪
      await this.preload();
      this.assets = await AssetsManager.getAssets();
      this.width = width;
      this.height = height;
      this.rankingData = rankingData;
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this._cleanScreen();
      this._drawRanking();
      this._rafId = requestAnimationFrame(() => {
        this._onEnterFrame();
      });
    } else {
      console.error("创建开放数据域失败，请检查是否加载开放数据域资源");
    }
  },

  destroy() {
    this._cleanScreen();
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
  },

  _cleanScreen() {
    context.clearRect(
      0,
      0,
      sharedCanvas.width / this.scaleX,
      sharedCanvas.height / this.scaleY
    );
  },

  _renderDirty: false,

  /**
   * 创建排行榜
   */
  _drawRanking() {
    // 创建 body
    this.rankingData.forEach((data, index) => {
      // 创建行
      this._drawRankingItem(data, index);
    });
  },

  /**
   * 根据绘制信息以及当前i绘制元素
   */
  _drawRankingItem(data, i) {
    const  { assets } = this;
    const colWidth = this.width / 3;
    const gutterHeight = 10;
    const crownWidth = 56;
    const crownHeight = 53;
    const iconWidth = 72;
    const fontSize = 24;
    const x = (i === 0 ? 1 : i === 1 ? 0 : 2) * colWidth;
    let y = i === 0 ? 0 : 30;
    // 绘制序号
    this._drawImage(
      assets[`top${data.key}`],
      x + (colWidth - crownWidth) / 2,
      y,
      crownWidth,
      crownHeight,
    );
    y += crownHeight + gutterHeight;
    // 绘制头像
    this._drawImage(
      data.avatarUrl,
      x + (colWidth - iconWidth) / 2,
      y,
      iconWidth,
      iconWidth,
    );
    y += iconWidth + gutterHeight * 2;
    // 绘制名称
    this._drawText(
      data.nickname,
      x,
      y,
      colWidth,
      {
        color: "#000000",
        fontSize,
      },
    );
    y += fontSize + gutterHeight;
    // 绘制分数
    this._drawText(
      data.score,
      x,
      y,
      colWidth,
      {
        color: "#ff5772",
        fontSize,
      },
    );
  },

  /**
   * 图片绘制函数
   */
  _drawImage(image, x, y, width, height) {
    if (typeof image === "string") {
      const img = wx.createImage();
      img.onload = () => {
        this._drawImage(img, x, y, width, height);
      };
      img.src = image;
      return;
    }
    if (width && height) {
      context.drawImage(image, x, y, width, height);
    } else {
      context.drawImage(image, x, y);
    }
  },

  /**
   * 文本绘制函数
   */
  _drawText(
    text,
    x,
    y,
    width,
    { fontSize, color } = {}
  ) {
    x += width / 2;
    y += fontSize / 2 * 1.2;
    context.textAlign = "center";
    context.font = `${fontSize}px Arial`;
    context.fillStyle = color;
    context.fillText(String(text), x, y, width);
  },

  /**
   * 循环函数
   * 每帧判断一下是否需要渲染
   * 如果被标脏，则重新渲染
   */
  _onEnterFrame() {
    if (this._renderDirty) {
      this._cleanScreen();
      this._drawRanking();
      this._renderDirty = false;
    }
    this._rafId = requestAnimationFrame(() => {
      this._onEnterFrame();
    });
  }
};
